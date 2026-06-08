"""
Rate limiting middleware for Aetherion.

Supports per-IP and per-user rate limiting with Redis backend
or in-memory fallback for single-instance deployments.
"""

import time
from typing import Optional, Dict, Tuple
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from ..core.config import get_settings
from ..core.logger import get_logger

logger = get_logger("middleware.rate_limit")


class InMemoryRateLimiter:
    """Simple in-memory rate limiter using a sliding window."""

    def __init__(self):
        self._requests: Dict[str, list] = {}  # key → [timestamps]

    def is_allowed(self, key: str, limit: int, window_seconds: int) -> Tuple[bool, int]:
        """
        Check if a request is allowed under the rate limit.

        Returns:
            (is_allowed, retry_after_seconds)
        """
        now = time.time()
        window_start = now - window_seconds

        if key not in self._requests:
            self._requests[key] = []

        # Remove expired entries
        self._requests[key] = [ts for ts in self._requests[key] if ts > window_start]

        if len(self._requests[key]) >= limit:
            # Calculate retry-after
            oldest = self._requests[key][0]
            retry_after = int(oldest + window_seconds - now) + 1
            return False, max(retry_after, 1)

        self._requests[key].append(now)
        return True, 0

    def cleanup(self, max_age: int = 3600):
        """Remove all entries older than max_age seconds."""
        now = time.time()
        cutoff = now - max_age
        for key in list(self._requests.keys()):
            self._requests[key] = [ts for ts in self._requests[key] if ts > cutoff]
            if not self._requests[key]:
                del self._requests[key]


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware.

    Applies different rate limits based on endpoint:
    - /auth/login: 5/minute per IP
    - /auth/register: 3/minute per IP
    - /emergency: 10/minute per user
    - Default: 100/minute per IP
    """

    def __init__(self, app, redis_client: Optional[object] = None):
        super().__init__(app)
        self._redis = redis_client
        self._limiter = InMemoryRateLimiter()
        self._settings = get_settings()

    def _get_rate_limit(self, path: str) -> Tuple[int, int]:
        """Return (max_requests, window_seconds) for a given path."""
        if "/auth/login" in path:
            parts = self._settings.RATE_LIMIT_LOGIN.split("/")
        elif "/auth/register" in path:
            parts = self._settings.RATE_LIMIT_REGISTER.split("/")
        elif "/emergency" in path and "/ws/" not in path:
            parts = self._settings.RATE_LIMIT_EMERGENCY.split("/")
        else:
            parts = self._settings.RATE_LIMIT_DEFAULT.split("/")

        try:
            max_requests = int(parts[0])
            window_map = {"minute": 60, "hour": 3600, "second": 1}
            window_seconds = window_map.get(parts[1], 60)
        except (IndexError, ValueError):
            max_requests = 100
            window_seconds = 60

        return max_requests, window_seconds

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request, considering X-Forwarded-For."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next) -> Response:
        # Skip rate limiting for non-API paths
        if not request.url.path.startswith(self._settings.API_V1_PREFIX):
            return await call_next(request)

        # Skip for WebSocket connections
        if request.url.path.startswith(self._settings.API_V1_PREFIX + "/ws/"):
            return await call_next(request)

        # Skip if rate limiting is disabled
        if not self._settings.RATE_LIMIT_ENABLED:
            return await call_next(request)

        # Skip for health checks
        if request.url.path in ("/health", "/"):
            return await call_next(request)

        # Determine rate limit for this path
        max_requests, window_seconds = self._get_rate_limit(request.url.path)

        # Build rate limit key (IP-based by default)
        client_ip = self._get_client_ip(request)
        key = f"rl:{client_ip}:{request.url.path}"

        # Check rate limit
        if self._redis:
            allowed = self._check_redis(key, max_requests, window_seconds)
        else:
            allowed, retry_after = self._limiter.is_allowed(key, max_requests, window_seconds)

        if not allowed:
            from ..core.exceptions import RateLimitException
            response = Response(
                content='{"success":false,"message":"Too many requests. Please try again later.","error":{"type":"RateLimitException","status_code":429}}',
                status_code=429,
                media_type="application/json",
            )
            if not self._redis:
                response.headers["Retry-After"] = str(retry_after)
            return response

        response = await call_next(request)

        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(max_requests)
        response.headers["X-RateLimit-Window"] = f"{window_seconds}s"

        return response

    def _check_redis(self, key: str, limit: int, window: int) -> bool:
        """Check rate limit using Redis (distributed)."""
        try:
            import redis
            pipe = self._redis.pipeline()
            now = time.time()
            window_start = now - window

            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zcard(key)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, window)
            results = pipe.execute()

            current_count = results[1]
            return current_count < limit
        except Exception:
            # Fall back to in-memory on Redis error
            allowed, _ = self._limiter.is_allowed(key, limit, window)
            return allowed
