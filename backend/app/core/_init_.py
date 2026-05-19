"""Core package initialization"""
from app.core.config import settings, get_settings
from app.core.database import (
    Base, engine, async_session_factory, get_db, init_db, close_db, db_manager
)
from app.core.security import SecurityManager, security_manager
from app.core.cache import CacheManager, cache_manager
from app.core.celery_app import celery_app
from app.core.exceptions import (
    BaseAppException, AuthenticationError, AuthorizationError,
    NotFoundError, ValidationError, ConflictError, RateLimitError,
    ServiceUnavailableError, DatabaseError, PaymentError,
    MedicalRecordError, PrescriptionError, AppointmentError,
    BloodDonationError, EmergencyError
)
from app.core.logging import app_logger, setup_logging

__all__ = [
    "settings", "get_settings",
    "Base", "engine", "async_session_factory", "get_db",
    "init_db", "close_db", "db_manager",
    "SecurityManager", "security_manager",
    "CacheManager", "cache_manager",
    "celery_app",
    "BaseAppException", "AuthenticationError", "AuthorizationError",
    "NotFoundError", "ValidationError", "ConflictError",
    "RateLimitError", "ServiceUnavailableError", "DatabaseError",
    "PaymentError", "MedicalRecordError", "PrescriptionError",
    "AppointmentError", "BloodDonationError", "EmergencyError",
    "app_logger", "setup_logging"
]