"""
Core middleware configuration
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.middleware.rate_limiter import RateLimiter
from app.middleware.logging import LoggingMiddleware
from app.middleware.auth import AuthMiddleware
from app.core.config import settings

def setup_middleware(app: FastAPI):
    """Configure all middleware"""
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time"]
    )
    
    # Trusted Host
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"] if settings.DEBUG else settings.CORS_ORIGINS
    )
    
    # GZip compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Custom middleware
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RateLimiter, requests_per_minute=settings.RATE_LIMIT_REQUESTS)
    app.add_middleware(AuthMiddleware)