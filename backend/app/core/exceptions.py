from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Optional, Any, Dict
import logging

logger = logging.getLogger("aetherion.exceptions")


# ============================================
# EXCEPTION CLASSES
# ============================================

class AppException(HTTPException):
    """Base application exception."""

    def __init__(
        self,
        message: str = "An error occurred",
        status_code: int = 400,
        details: Optional[Any] = None,
    ):
        super().__init__(status_code=status_code, detail=message)
        self.message = message
        self.details = details


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message=message, status_code=401)


class ForbiddenException(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(message=message, status_code=403)


class ConflictException(AppException):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message=message, status_code=409)


class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request", details: Optional[Any] = None):
        super().__init__(message=message, status_code=400, details=details)


class ValidationException(AppException):
    def __init__(self, message: str = "Validation error", details: Optional[Any] = None):
        super().__init__(message=message, status_code=422, details=details)


class RateLimitException(AppException):
    def __init__(self, message: str = "Too many requests. Please try again later."):
        super().__init__(message=message, status_code=429)


class InternalServerException(AppException):
    def __init__(self, message: str = "Internal server error"):
        super().__init__(message=message, status_code=500)


class ServiceUnavailableException(AppException):
    def __init__(self, message: str = "Service temporarily unavailable"):
        super().__init__(message=message, status_code=503)


# ============================================
# GLOBAL EXCEPTION HANDLERS
# ============================================

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle all AppException subclasses with consistent JSON format."""
    request_id = getattr(request.state, "request_id", "unknown")

    response_body = {
        "success": False,
        "message": exc.message,
        "error": {
            "type": exc.__class__.__name__,
            "status_code": exc.status_code,
            "request_id": request_id,
        },
    }

    if exc.details:
        response_body["error"]["details"] = exc.details

    return JSONResponse(
        status_code=exc.status_code,
        content=response_body,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle Pydantic/FastAPI validation errors with structured details."""
    request_id = getattr(request.state, "request_id", "unknown")

    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in error.get("loc", [])),
            "message": error.get("msg", "Validation error"),
            "type": error.get("type", "value_error"),
        })

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error",
            "error": {
                "type": "ValidationError",
                "status_code": 422,
                "request_id": request_id,
                "details": errors,
            },
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unhandled exceptions — returns 500 with correlation ID."""
    import uuid
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))

    logger.error(
        f"Unhandled exception on {request.method} {request.url.path}: {exc}",
        extra={"request_id": request_id},
        exc_info=True,
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred",
            "error": {
                "type": "InternalServerError",
                "status_code": 500,
                "request_id": request_id,
            },
        },
    )


# ============================================
# EXCEPTION HANDLERS REGISTRY
# ============================================

def get_exception_handlers() -> Dict:
    """
    Returns a dict of exception handlers to register with FastAPI.
    Usage:
        for exc_class, handler in get_exception_handlers().items():
            app.add_exception_handler(exc_class, handler)
    """
    return {
        AppException: app_exception_handler,
        RequestValidationError: validation_exception_handler,
        Exception: unhandled_exception_handler,
    }
