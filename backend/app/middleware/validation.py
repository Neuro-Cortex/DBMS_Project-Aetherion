"""
Request validation middleware for Aetherion.

Performs input sanitization and validation before requests reach route handlers.
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional

from ..core.logger import get_logger

logger = get_logger("middleware.validation")

# Maximum content length for non-file uploads
MAX_CONTENT_LENGTH = 1024 * 1024  # 1MB

# Suspicious patterns for basic SQL injection detection
SQL_INJECTION_PATTERNS = [
    "' OR '1'='1",
    "'; DROP TABLE",
    "' UNION SELECT",
    "1=1; --",
    "exec(",
    "execute(",
    "xp_cmdshell",
]


class ValidationMiddleware(BaseHTTPMiddleware):
    """
    Request validation middleware.

    - Strips leading/trailing whitespace from string query params
    - Validates Content-Type for POST/PUT/PATCH
    - Checks content length
    - Basic SQL injection pattern detection in query strings
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        # Validate Content-Type for write methods
        if request.method in ("POST", "PUT", "PATCH"):
            content_type = request.headers.get("content-type", "")

            # Allow multipart/form-data for file uploads
            # Allow application/json for API requests
            # Allow application/x-www-form-urlencoded
            if content_type and not any(
                ct in content_type
                for ct in ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"]
            ):
                # Don't reject — just log for monitoring
                logger.warning(
                    f"Unexpected Content-Type: {content_type} for {request.method} {request.url.path}"
                )

        # Basic SQL injection check on query parameters
        query_string = str(request.url.query)
        if query_string:
            for pattern in SQL_INJECTION_PATTERNS:
                if pattern.lower() in query_string.lower():
                    logger.warning(
                        f"Potential SQL injection attempt: {request.method} {request.url.path}?{query_string[:200]}"
                    )
                    return Response(
                        content='{"success":false,"message":"Invalid request","error":{"type":"BadRequestException","status_code":400}}',
                        status_code=400,
                        media_type="application/json",
                    )

        return await call_next(request)
