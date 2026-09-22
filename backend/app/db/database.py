import os
from app.config import settings

# Agar Vercel par deploy ho raha ho toh /tmp writable folder use karo
if os.getenv("VERCEL"):
    db_url = "sqlite:////tmp/mindpulse.db"
else:
    db_url = settings.DATABASE_URL

# If standard SQLAlchemy is installed in the target production environment, use it.
# Otherwise, seamlessly fall back to our embedded zero-dependency SQLite ORM.
try:
    from sqlalchemy import create_engine
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker
    
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    engine = create_engine(db_url, connect_args=connect_args)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except ImportError:
    from app.db.orm import create_engine, declarative_base, sessionmaker
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()