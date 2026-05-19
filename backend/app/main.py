"""
Aetherion Healthcare Platform - Main Application Entry Point
AI-powered smart healthcare ecosystem
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db, close_db
from app.core.cache import cache_manager
from app.core.logging import app_logger
from app.core.events import startup_handler, shutdown_handler
from app.core.middleware import setup_middleware
from app.api.errors import setup_error_handlers
from app.api.v1.router import api_router
from app.middleware.rate_limiter import RateLimiter
from app.middleware.logging import LoggingMiddleware
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    app_logger.info("Starting Aetherion Healthcare Platform...")
    await startup_handler(app)
    yield
    # Shutdown
    app_logger.info("Shutting down Aetherion Healthcare Platform...")
    await shutdown_handler(app)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered smart healthcare ecosystem for managing hospitals, doctors, blood donation, emergency services, and more.",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Setup middleware
setup_middleware(app)

# Setup error handlers
setup_error_handlers(app)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": f"{settings.API_V1_PREFIX}/docs" if settings.DEBUG else None
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    from app.core.database import db_manager
    
    db_healthy = await db_manager.check_connection()
    
    return {
        "status": "healthy" if db_healthy else "degraded",
        "database": "connected" if db_healthy else "disconnected",
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV
    }

# Metrics endpoint for monitoring
@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return {"message": "Metrics endpoint"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS if not settings.DEBUG else 1,
        log_level="info" if not settings.DEBUG else "debug"
    )