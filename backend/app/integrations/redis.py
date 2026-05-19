"""
Redis integration for caching and real-time features
"""
import redis.asyncio as redis
from typing import Optional, Any, Dict, List
import json
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    """Redis client wrapper"""
    
    def __init__(self):
        self._redis: Optional[redis.Redis] = None
    
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self._redis = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=50
            )
            await self._redis.ping()
            logger.info("Redis integration initialized")
        except Exception as e:
            logger.error(f"Redis integration failed: {e}")
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis"""
        try:
            value = await self._redis.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None
    
    async def set(
        self,
        key: str,
        value: Any,
        expire: int = 3600
    ) -> bool:
        """Set value in Redis"""
        try:
            if not isinstance(value, str):
                value = json.dumps(value)
            await self._redis.setex(key, expire, value)
            return True
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis"""
        try:
            await self._redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return await self._redis.exists(key) > 0
        except Exception as e:
            return False
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration on key"""
        try:
            await self._redis.expire(key, seconds)
            return True
        except Exception as e:
            return False
    
    async def keys(self, pattern: str) -> List[str]:
        """Get keys matching pattern"""
        try:
            return await self._redis.keys(pattern)
        except Exception as e:
            return []
    
    async def hset(self, name: str, key: str, value: Any) -> bool:
        """Set hash field"""
        try:
            await self._redis.hset(name, key, json.dumps(value))
            return True
        except Exception as e:
            return False
    
    async def hget(self, name: str, key: str) -> Optional[Any]:
        """Get hash field"""
        try:
            value = await self._redis.hget(name, key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            return None
    
    async def hgetall(self, name: str) -> Dict[str, Any]:
        """Get all hash fields"""
        try:
            data = await self._redis.hgetall(name)
            return {k: json.loads(v) for k, v in data.items()}
        except Exception as e:
            return {}
    
    async def publish(self, channel: str, message: Any) -> bool:
        """Publish message to channel"""
        try:
            await self._redis.publish(channel, json.dumps(message))
            return True
        except Exception as e:
            return False
    
    async def subscribe(self, channel: str):
        """Subscribe to channel"""
        try:
            pubsub = self._redis.pubsub()
            await pubsub.subscribe(channel)
            return pubsub
        except Exception as e:
            return None
    
    async def close(self):
        """Close Redis connection"""
        if self._redis:
            await self._redis.close()

redis_client = RedisClient()