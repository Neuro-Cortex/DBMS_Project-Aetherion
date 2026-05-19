"""
Redis caching configuration and utilities
"""
from typing import Optional, Any
import redis.asyncio as redis
from redis.asyncio import Redis
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class CacheManager:
    """Redis cache manager for high-performance caching"""
    
    def __init__(self):
        self.redis_client: Optional[Redis] = None
    
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=50
            )
            await self.redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.error(f"Redis connection failed: {e}")
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = await self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache with expiration"""
        try:
            serialized = json.dumps(value)
            await self.redis_client.setex(key, expire, serialized)
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            await self.redis_client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False
    
    async def delete_pattern(self, pattern: str) -> bool:
        """Delete keys matching pattern"""
        try:
            async for key in self.redis_client.scan_iter(pattern):
                await self.redis_client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache pattern delete error: {e}")
            return False
    
    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment counter"""
        try:
            return await self.redis_client.incrby(key, amount)
        except Exception as e:
            logger.error(f"Cache increment error: {e}")
            return None
    
    async def close(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()
            logger.info("Redis connection closed")

# Global cache instance
cache_manager = CacheManager()