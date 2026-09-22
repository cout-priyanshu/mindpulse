import sqlite3
import json
import uuid
from datetime import datetime
from typing import Any, List, Dict, Optional, Type

class Integer: pass
class Float: pass
class String:
    def __init__(self, length=255):
        self.length = length
class Text: pass
class Boolean: pass
class DateTime: pass
class ForeignKey:
    def __init__(self, target):
        self.target = target

class Column:
    def __init__(self, *args, **kwargs):
        self.type = None
        self.foreign_key = None
        for arg in args:
            if isinstance(arg, ForeignKey):
                self.foreign_key = arg
            else:
                self.type = arg
        
        self.primary_key = kwargs.get('primary_key', False)
        self.nullable = kwargs.get('nullable', True)
        self.default = kwargs.get('default', None)
        self.unique = kwargs.get('unique', False)
        self.name = None

class ModelMeta(type):
    def __new__(cls, name, bases, attrs):
        columns = {}
        for k, v in list(attrs.items()):
            if isinstance(v, Column):
                v.name = k
                columns[k] = v
        attrs['_columns'] = columns
        return super().__new__(cls, name, bases, attrs)

class Base(metaclass=ModelMeta):
    __tablename__ = ""
    _columns: Dict[str, Column] = {}

    def __init__(self, **kwargs):
        for k, col in self._columns.items():
            val = kwargs.get(k)
            if val is None and col.default is not None:
                val = col.default() if callable(col.default) else col.default
            setattr(self, k, val)

    def to_dict(self):
        d = {}
        for k in self._columns.keys():
            val = getattr(self, k, None)
            if isinstance(val, datetime):
                d[k] = val.isoformat()
            else:
                d[k] = val
        return d

class MetaData:
    def __init__(self):
        self._models = []
    
    def register(self, model):
        self._models.append(model)
        
    def create_all(self, bind):
        conn = bind.connect()
        cursor = conn.cursor()
        for model in self._models:
            if not getattr(model, '__tablename__', None):
                continue
            cols_def = []
            for col_name, col in model._columns.items():
                col_type = "TEXT"
                if col.type is Integer:
                    col_type = "INTEGER"
                elif col.type is Float:
                    col_type = "REAL"
                elif col.type is Boolean:
                    col_type = "INTEGER"
                elif col.type is DateTime:
                    col_type = "TEXT"
                elif isinstance(col.type, String) or col.type is Text:
                    col_type = "TEXT"

                constraints = []
                if col.primary_key:
                    constraints.append("PRIMARY KEY")
                if not col.nullable and not col.primary_key:
                    constraints.append("NOT NULL")
                if col.unique:
                    constraints.append("UNIQUE")
                
                cols_def.append(f'"{col_name}" {col_type} {" ".join(constraints)}'.strip())
            
            sql = f'CREATE TABLE IF NOT EXISTS "{model.__tablename__}" ({", ".join(cols_def)});'
            cursor.execute(sql)
        conn.commit()
        conn.close()

metadata = MetaData()

def declarative_base():
    class DeclBase(Base):
        pass
    DeclBase.metadata = metadata
    return DeclBase

class Engine:
    def __init__(self, db_url):
        self.db_url = db_url
        if db_url.startswith("sqlite:////"):
            self.db_path = "/" + db_url.replace("sqlite:////", "")
        elif db_url.startswith("sqlite:///"):
            self.db_path = db_url.replace("sqlite:///", "")
        else:
            self.db_path = db_url

    def connect(self):
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

def create_engine(db_url, **kwargs):
    return Engine(db_url)

class Query:
    def __init__(self, session, model_cls):
        self.session = session
        self.model_cls = model_cls
        self._filters = []
        self._order_by = None
        self._limit = None
        self._offset = None

    def filter(self, *conditions):
        for cond in conditions:
            self._filters.append(cond)
        return self

    def filter_by(self, **kwargs):
        for k, v in kwargs.items():
            self._filters.append((k, "=", v))
        return self

    def order_by(self, order_expr):
        self._order_by = order_expr
        return self

    def limit(self, lim):
        self._limit = lim
        return self

    def offset(self, off):
        self._offset = off
        return self

    def _execute(self):
        sql = f'SELECT * FROM "{self.model_cls.__tablename__}"'
        params = []
        if self._filters:
            clauses = []
            for cond in self._filters:
                if isinstance(cond, tuple) and len(cond) == 3:
                    col, op, val = cond
                    clauses.append(f'"{col}" {op} ?')
                    params.append(val)
                elif isinstance(cond, str):
                    clauses.append(cond)
            if clauses:
                sql += " WHERE " + " AND ".join(clauses)
        if self._order_by:
            sql += f" ORDER BY {self._order_by}"
        if self._limit is not None:
            sql += f" LIMIT {self._limit}"
        if self._offset is not None:
            sql += f" OFFSET {self._offset}"

        cursor = self.session.conn.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        results = []
        for r in rows:
            obj = self.model_cls()
            for col_name in self.model_cls._columns.keys():
                val = r[col_name]
                col = self.model_cls._columns[col_name]
                if col.type is Boolean and val is not None:
                    val = bool(val)
                elif col.type is DateTime and val is not None and isinstance(val, str):
                    try:
                        val = datetime.fromisoformat(val)
                    except Exception:
                        pass
                setattr(obj, col_name, val)
            results.append(obj)
        return results

    def all(self):
        return self._execute()

    def first(self):
        res = self.limit(1)._execute()
        return res[0] if res else None

    def count(self):
        return len(self._execute())

class Session:
    def __init__(self, engine):
        self.engine = engine
        self.conn = engine.connect()

    def query(self, model_cls):
        return Query(self, model_cls)

    def add(self, obj):
        cols = obj._columns
        names = []
        placeholders = []
        vals = []
        for name, col in cols.items():
            val = getattr(obj, name, None)
            if val is None and col.default is not None:
                val = col.default() if callable(col.default) else col.default
                setattr(obj, name, val)
            if isinstance(val, datetime):
                val = val.isoformat()
            elif isinstance(val, bool):
                val = 1 if val else 0
            names.append(f'"{name}"')
            placeholders.append("?")
            vals.append(val)

        sql = f'INSERT OR REPLACE INTO "{obj.__tablename__}" ({", ".join(names)}) VALUES ({", ".join(placeholders)})'
        cursor = self.conn.cursor()
        cursor.execute(sql, vals)

    def delete(self, obj):
        pk = None
        for name, col in obj._columns.items():
            if col.primary_key:
                pk = name
                break
        if pk:
            sql = f'DELETE FROM "{obj.__tablename__}" WHERE "{pk}" = ?'
            self.conn.cursor().execute(sql, (getattr(obj, pk),))

    def commit(self):
        self.conn.commit()

    def rollback(self):
        self.conn.rollback()

    def refresh(self, obj):
        pass

    def close(self):
        self.conn.close()

def sessionmaker(autocommit=False, autoflush=False, bind=None):
    def make_session():
        return Session(bind)
    return make_session
