"""
CORS middleware configuration
"""
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

def setup_cors():
    """Configure CORS settings"""
    return {
        "allow_origins": settings.CORS_ORIGINS,
        "allow_credentials": True,
        "allow_methods": [
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ],
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "X-Request-ID",
            "X-API-Key",
            "Accept",
            "Origin",
            "X-Requested-With"
        ],
        "expose_headers": [
            "X-Request-ID",
            "X-Process-Time",
            "X-RateLimit-Limit",
            "X-RateLimit-Remaining"
        ],
        "max_age": 600  # 10 minutes
    }