"""
Structured logging system for Aetherion Healthcare API.

Provides JSON-formatted logs for production and human-readable logs for development.
Includes request ID tracking for distributed tracing.
"""

import logging
import json
import sys
import uuid
from datetime import datetime
from typing import Optional


# ============================================
# JSON LOG FORMATTER
# ============================================

class JSONFormatter(logging.Formatter):
    """Formats log records as structured JSON for production environments."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add request_id if present
        request_id = getattr(record, "request_id", None)
        if request_id:
            log_entry["request_id"] = request_id

        # Add user_id if present
        user_id = getattr(record, "user_id", None)
        if user_id:
            log_entry["user_id"] = user_id

        # Add extra fields
        extra = getattr(record, "extra_fields", None)
        if extra and isinstance(extra, dict):
            log_entry["extra"] = extra

        # Add exception info
        if record.exc_info and record.exc_info[0] is not None:
            log_entry["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
            }

        return json.dumps(log_entry, default=str)


# ============================================
# HUMAN-READABLE FORMATTER (Development)
# ============================================

class DevFormatter(logging.Formatter):
    """Colorful, human-readable log format for development."""

    COLORS = {
        "DEBUG": "\033[36m",     # Cyan
        "INFO": "\033[32m",      # Green
        "WARNING": "\033[33m",   # Yellow
        "ERROR": "\033[31m",     # Red
        "CRITICAL": "\033[35m",  # Magenta
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelname, self.RESET)
        request_id = getattr(record, "request_id", "")
        rid_str = f" [{request_id[:8]}]" if request_id else ""

        message = (
            f"{color}{record.levelname:8s}{self.RESET} "
            f"{datetime.utcnow().strftime('%H:%M:%S')}{rid_str} "
            f"\033[90m{record.name}\033[0m "
            f"{record.getMessage()}"
        )

        if record.exc_info and record.exc_info[0] is not None:
            message += f"\n{self.formatException(record.exc_info)}"

        return message


# ============================================
# LOGGING SETUP
# ============================================

_logging_initialized = False


def setup_logging(log_level: str = "INFO", log_format: str = "json"):
    """
    Configure the global logging system.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_format: Output format — "json" for production, "text" for development
    """
    global _logging_initialized
    if _logging_initialized:
        return

    # Determine formatter
    if log_format == "json":
        formatter = JSONFormatter()
    else:
        formatter = DevFormatter()

    # Configure root handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Quiet down noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if log_level.upper() == "DEBUG" else logging.WARNING
    )

    _logging_initialized = True


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module.

    Usage:
        logger = get_logger("emergency_service")
        logger.info("Emergency request created", extra={"request_id": rid})
    """
    return logging.getLogger(f"aetherion.{name}")


# ============================================
# REQUEST ID HELPERS
# ============================================

def generate_request_id() -> str:
    """Generate a unique request ID for correlation."""
    return str(uuid.uuid4())


class RequestContext:
    """Thread-local storage for request-scoped data (request_id, user_id)."""

    _request_id: Optional[str] = None
    _user_id: Optional[str] = None

    @classmethod
    def set_request_id(cls, request_id: str):
        cls._request_id = request_id

    @classmethod
    def get_request_id(cls) -> Optional[str]:
        return cls._request_id

    @classmethod
    def set_user_id(cls, user_id: str):
        cls._user_id = user_id

    @classmethod
    def get_user_id(cls) -> Optional[str]:
        return cls._user_id

    @classmethod
    def clear(cls):
        cls._request_id = None
        cls._user_id = None
