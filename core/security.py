from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================================
# PASSWORD HASHING
# ============================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ============================================
# JWT TOKEN CREATION
# ============================================

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_token_pair(data: Dict[str, Any]) -> Tuple[str, str]:
    """Create an access token and refresh token pair together."""
    access_token = create_access_token(data)
    refresh_token = create_refresh_token({"sub": data.get("sub")})
    return access_token, refresh_token


# ============================================
# JWT TOKEN DECODING & VALIDATION
# ============================================

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode a JWT token. Returns None if invalid/expired."""
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


def decode_and_validate_token(token: str, expected_type: str = "access") -> Optional[Dict[str, Any]]:
    """Decode and strictly validate a JWT token with type and expiry checks."""
    payload = decode_token(token)
    if not payload:
        return None

    if payload.get("type") != expected_type:
        return None

    # Check expiry explicitly (jose handles this, but double-check)
    exp = payload.get("exp")
    if exp and datetime.utcnow() > datetime.utcfromtimestamp(exp):
        return None

    return payload


# ============================================
# TOKEN ROTATION
# ============================================

def rotate_refresh_token(old_refresh_token: str, user_data: Dict[str, Any]) -> Optional[Tuple[str, str]]:
    """
    Validate an existing refresh token and issue a new token pair.
    Returns (new_access_token, new_refresh_token) or None if invalid.
    The caller is responsible for revoking the old session in the database.
    """
    payload = decode_and_validate_token(old_refresh_token, expected_type="refresh")
    if not payload:
        return None

    # Verify user_id matches
    old_sub = payload.get("sub")
    if not old_sub or old_sub != user_data.get("sub"):
        return None

    return create_token_pair(user_data)
