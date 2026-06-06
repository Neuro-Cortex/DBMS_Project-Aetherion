"""
Centralized FastAPI dependencies.

All common dependencies are re-exported here for clean imports:
    from app.core.deps import get_db, get_current_user, get_settings
"""

from fastapi import Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from .config import Settings, get_settings
from .database import get_db
from ..middleware.auth_middleware import get_current_user, get_current_user_optional
from ..core.permissions import CurrentUser


# ============================================
# REDIS DEPENDENCY
# ============================================

_redis_client = None


def _init_redis():
    """Initialize Redis client lazily."""
    global _redis_client
    if _redis_client is not None:
        return _redis_client

    settings = get_settings()
    try:
        import redis
        _redis_client = redis.from_url(
            settings.REDIS_CONNECTION_URL,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
        )
        _redis_client.ping()  # Test connection
    except Exception:
        _redis_client = None

    return _redis_client


def get_redis():
    """FastAPI dependency that provides a Redis client (None if unavailable)."""
    return _init_redis()


# ============================================
# COMMON QUERY PARAMETERS
# ============================================

class CommonQueryParams:
    """Standard pagination and search query parameters."""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        size: int = Query(20, ge=1, le=100, description="Items per page"),
        search: Optional[str] = Query(None, description="Search term"),
    ):
        self.page = page
        self.size = size
        self.search = search
        self.offset = (page - 1) * size


# ============================================
# RE-EXPORTS (for clean imports across the codebase)
# ============================================

__all__ = [
    "get_db",
    "get_settings",
    "get_redis",
    "get_current_user",
    "get_current_user_optional",
    "CurrentUser",
    "CommonQueryParams",
    "Settings",
]
