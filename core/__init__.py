"""
Aetherion Core Layer.

Centralized configuration, database, security, and shared utilities.
"""

from .config import Settings, get_settings
from .database import get_db, Base, engine, SessionLocal
from .security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    create_token_pair,
    decode_token,
    decode_and_validate_token,
    rotate_refresh_token,
)
from .exceptions import (
    AppException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
    ValidationException,
    RateLimitException,
    InternalServerException,
    ServiceUnavailableException,
    get_exception_handlers,
)
from .logger import setup_logging, get_logger, generate_request_id, RequestContext
from .constants import *  # noqa: All enum constants

__all__ = [
    # Config
    "Settings", "get_settings",
    # Database
    "get_db", "Base", "engine", "SessionLocal",
    # Security
    "hash_password", "verify_password",
    "create_access_token", "create_refresh_token", "create_token_pair",
    "decode_token", "decode_and_validate_token", "rotate_refresh_token",
    # Exceptions
    "AppException", "NotFoundException", "UnauthorizedException",
    "ForbiddenException", "ConflictException", "BadRequestException",
    "ValidationException", "RateLimitException", "InternalServerException",
    "ServiceUnavailableException", "get_exception_handlers",
    # Logger
    "setup_logging", "get_logger", "generate_request_id", "RequestContext",
]
