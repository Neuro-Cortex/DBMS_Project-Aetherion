import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .core.config import get_settings
from .core.database import engine, check_database_connection, get_database_info
from .core.exceptions import get_exception_handlers
from .core.logger import setup_logging, get_logger, generate_request_id, RequestContext
from .core.events import register_default_handlers, get_event_bus
from .api.v1 import api_router
from .api.ws import ws_router
from .middleware.rate_limit import RateLimitMiddleware
from .middleware.security_headers import SecurityHeadersMiddleware
from .middleware.validation import ValidationMiddleware
from .models import *  # noqa: Ensure all models are registered with Base.metadata

# Initialize structured logging
settings = get_settings()
setup_logging(log_level=settings.LOG_LEVEL, log_format=settings.LOG_FORMAT if not settings.is_development else "text")
logger = get_logger("main")


# ============================================
# LIFESPAN (Startup/Shutdown)
# ============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("Aetherion Healthcare API starting...")
    logger.info(f"Database: {settings.DB_NAME}")
    logger.info(f"API Prefix: {settings.API_V1_PREFIX}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")

    # Verify database connection
    if check_database_connection():
        logger.info("Database connection verified")
    else:
        logger.error("Database connection failed")

    # Register event handlers
    register_default_handlers()
    logger.info("Event handlers registered")

    # Initialize event bus
    get_event_bus()
    logger.info("Event bus initialized")

    yield

    logger.info("Aetherion Healthcare API shutting down...")
    engine.dispose()


# ============================================
# APP FACTORY
# ============================================
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
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
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(ws_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    db_connected = check_database_connection()
    db_info = get_database_info()

    # Check Redis connectivity
    redis_status = "unconfigured"
    try:
        from .core.deps import get_redis
        redis_client = get_redis()
        if redis_client:
            redis_client.ping()
            redis_status = "connected"
    except Exception:
        redis_status = "disconnected"

    return {
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
