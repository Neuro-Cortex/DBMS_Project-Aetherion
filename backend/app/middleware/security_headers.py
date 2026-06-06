"""
Security headers middleware for Aetherion.

Adds security-related HTTP headers to all responses to protect against
common web vulnerabilities.
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security headers to all HTTP responses.

    Headers added:
    - X-Content-Type-Options: nosniff — prevents MIME type sniffing
    - X-Frame-Options: DENY — prevents clickjacking
    - X-XSS-Protection: 1; mode=block — enables XSS filter
    - Strict-Transport-Security — forces HTTPS (production only)
    - Referrer-Policy — controls referrer information
    - Permissions-Policy — restricts browser features
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Enable XSS filter in browsers
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Restrict browser features
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(self), payment=()"
        )

        # HSTS — only in production (requires HTTPS)
        from ..core.config import get_settings
        settings = get_settings()
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        return response
