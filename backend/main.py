"""
Aetherion Healthcare - Unified FastAPI Backend
================================================
Single entry point for the production backend system.

Run with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import from app module
from app.core.config import get_settings
from app.core.database import engine, check_database_connection, get_database_info
from app.core.exceptions import get_exception_handlers
from app.core.logger import setup_logging, get_logger, generate_request_id, RequestContext
from app.core.events import register_default_handlers, get_event_bus
from app.api.v1 import api_router
from app.api.ws import ws_router
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.validation import ValidationMiddleware

# Import all models to ensure they're registered with Base.metadata
from app.models import *  # noqa: F401, F403

# Initialize structured logging
settings = get_settings()
setup_logging(log_level=settings.LOG_LEVEL, log_format=settings.LOG_FORMAT if not settings.is_development else "text")
logger = get_logger(__name__)


# ============================================
# LIFESPAN (Startup/Shutdown)
# ============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("=" * 60)
    logger.info("AETHERION HEALTHCARE API STARTING")
    logger.info("=" * 60)
    logger.info(f"Database: {settings.DB_NAME} @ {settings.DB_HOST}:{settings.DB_PORT}")
    logger.info(f"API Prefix: {settings.API_V1_PREFIX}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Version: {settings.APP_VERSION}")

    # Verify database connection
    if check_database_connection():
        logger.info("✅ Database connection verified")
    else:
        logger.error("❌ Database connection failed - API may not function correctly")

    # Register event handlers
    register_default_handlers()
    logger.info("✅ Event handlers registered")

    # Initialize event bus
    get_event_bus()
    logger.info("✅ Event bus initialized")

    logger.info("=" * 60)
    logger.info("AETHERION HEALTHCARE API READY")
    logger.info("=" * 60)

    yield

    logger.info("=" * 60)
    logger.info("AETHERION HEALTHCARE API SHUTTING DOWN")
    logger.info("=" * 60)
    engine.dispose()
    logger.info("Database engine disposed")


# ============================================
# APP FACTORY
# ============================================
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Unified backend for Aetherion Healthcare Platform",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)


# ============================================
# GLOBAL EXCEPTION HANDLERS
# ============================================
for exc_class, handler in get_exception_handlers().items():
    app.add_exception_handler(exc_class, handler)


# ============================================
# MIDDLEWARE (order matters — last added = first executed)
# ============================================

# 1. Security headers (outermost — applied to all responses)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Rate limiting
app.add_middleware(RateLimitMiddleware, redis_client=None)  # Redis injected at startup

# 3. Request validation
app.add_middleware(ValidationMiddleware)

# 4. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"] if settings.CORS_ALLOW_METHODS == "*" else settings.CORS_ALLOW_METHODS.split(","),
    allow_headers=["*"] if settings.CORS_ALLOW_HEADERS == "*" else settings.CORS_ALLOW_HEADERS.split(","),
)


# ============================================
# REQUEST ID + LOGGING MIDDLEWARE
# ============================================
@app.middleware("http")
async def request_middleware(request: Request, call_next):
    """Add request ID tracking and structured request logging."""
    request_id = request.headers.get("X-Request-ID") or generate_request_id()
    request.state.request_id = request_id
    RequestContext.set_request_id(request_id)

    start_time = datetime.utcnow()
    response: Response = await call_next(request)
    duration = (datetime.utcnow() - start_time).total_seconds() * 1000

    response.headers["X-Request-ID"] = request_id

    if request.url.path.startswith(settings.API_V1_PREFIX):
        logger.info(
            f"{request.method} {request.url.path} [{response.status_code}] {duration:.1f}ms",
            extra={"request_id": request_id},
        )

    RequestContext.clear()
    return response


# ============================================
# ROUTES
# ============================================

# Include all API v1 routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Include WebSocket routes
app.include_router(ws_router, prefix=settings.API_V1_PREFIX)


# ============================================
# ROOT ENDPOINT
# ============================================
@app.get("/", tags=["System"])
async def root():
    """
    Root endpoint - API information.

    Response:
    ```json
    {
        "success": true,
        "message": "Aetherion Healthcare API",
        "data": {
            "name": "Aetherion Healthcare API",
            "version": "1.0.0",
            "status": "ok",
            "environment": "development",
            "docs": "/docs",
            "api_prefix": "/api/v1"
        }
    }
    ```
    """
    return {
        "success": True,
        "message": "Aetherion Healthcare API",
        "data": {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "ok",
            "environment": settings.ENVIRONMENT,
            "docs": "/docs",
            "api_prefix": settings.API_V1_PREFIX,
        },
    }


# ============================================
# HEALTH CHECK ENDPOINT
# ============================================
@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint - API and database status.

    Response:
    ```json
    {
        "success": true,
        "message": "Health check completed",
        "data": {
            "status": "healthy",
            "version": "1.0.0",
            "environment": "development",
            "database": {
                "status": "connected",
                "host": "localhost",
                "port": 3306,
                "database": "aethion_db",
                "pool_size": 20
            },
            "redis": "unconfigured",
            "timestamp": "2024-01-01T00:00:00.000000"
        }
    }
    ```
    """
    db_connected = check_database_connection()
    db_info = get_database_info()

    # Check Redis connectivity
    redis_status = "unconfigured"
    try:
        from app.core.deps import get_redis
        redis_client = get_redis()
        if redis_client:
            redis_client.ping()
            redis_status = "connected"
    except Exception:
        redis_status = "disconnected"

    health_data = {
        "status": "healthy" if db_connected else "degraded",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": "connected" if db_connected else "disconnected",
            **db_info,
        },
        "redis": redis_status,
        "timestamp": datetime.utcnow().isoformat(),
    }

    return {
        "success": True,
        "message": "Health check completed",
        "data": health_data,
    }


# ============================================
# MAIN ENTRY POINT
# ============================================
if __name__ == "__main__":
    import uvicorn

    logger.info("Starting Aetherion Healthcare API server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.is_development,
        log_level=settings.LOG_LEVEL.lower(),
    )