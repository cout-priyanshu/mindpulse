import hmac
import hashlib
import base64
import json
import time
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.config import settings

def _b64_url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def _b64_url_decode(data_str: str) -> bytes:
    padding = '=' * (4 - (len(data_str) % 4)) if len(data_str) % 4 != 0 else ''
    return base64.urlsafe_b64decode((data_str + padding).encode('utf-8'))

def get_password_hash(password: str) -> str:
    salt = os.urandom(16).hex()
    iterations = 100_000
    derived = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), iterations)
    return f"pbkdf2_sha256${iterations}${salt}${derived.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = parts[2]
        expected_hash = parts[3]
        derived = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), iterations)
        return hmac.compare_digest(derived.hex(), expected_hash)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now_ts = int(time.time())
    if expires_delta:
        expire_ts = now_ts + int(expires_delta.total_seconds())
    else:
        expire_ts = now_ts + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    
    to_encode.update({"iat": now_ts, "exp": expire_ts})
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _b64_url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _b64_url_encode(json.dumps(to_encode, separators=(',', ':')).encode('utf-8'))
    
    signature_data = f"{header_b64}.{payload_b64}".encode('utf-8')
    sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signature_data, hashlib.sha256).digest()
    sig_b64 = _b64_url_encode(sig)
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        signature_data = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signature_data, hashlib.sha256).digest()
        actual_sig = _b64_url_decode(sig_b64)
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload = json.loads(_b64_url_decode(payload_b64).decode('utf-8'))
        
        # Check expiration
        if "exp" in payload and payload["exp"] < int(time.time()):
            return None
            
        return payload
    except Exception:
        return None
