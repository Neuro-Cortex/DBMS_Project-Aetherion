"""
Application startup and shutdown events
"""
from fastapi import FastAPI
from app.core.database import init_db, close_db
from app.core.cache import cache_manager
from app.core.logging import app_logger
import asyncio

async def startup_handler(app: FastAPI):
    """Execute on application startup"""
    app_logger.info("Starting Aetherion Healthcare Platform...")
    
    # Initialize database
    await init_db()
    app_logger.info("Database initialized")
    
    # Initialize Redis cache
    await cache_manager.initialize()
    app_logger.info("Redis cache initialized")
    
    # Start background tasks
    # Additional startup tasks
    
    app_logger.info("Application startup complete")

async def shutdown_handler(app: FastAPI):
    """Execute on application shutdown"""
    app_logger.info("Shutting down Aetherion Healthcare Platform...")
    
    # Close database connections
    await close_db()
    app_logger.info("Database connections closed")
    
    # Close Redis connections
    await cache_manager.close()
    app_logger.info("Redis connections closed")
    
    app_logger.info("Application shutdown complete")