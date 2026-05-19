"""
Authentication middleware
"""
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import security_manager
from app.core.cache import cache_manager
import logging

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware for token validation"""
    
    # Public paths that don't require authentication
    PUBLIC_PATHS = [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/v1/auth/verify-email",
        "/api/v1/auth/refresh-token",
        "/health",
        "/docs",
        "/redoc",
        "/openapi.json"
    ]
    
    async def dispatch(self, request: Request, call_next):
        """Process request with authentication"""
        
        # Skip authentication for public paths
        if self._is_public_path(request.url.path):
            return await call_next(request)
        
        # Get authorization header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            # Allow OPTIONS requests for CORS
            if request.method == "OPTIONS":
                return await call_next(request)
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header required"
            )
        
        # Validate token
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            
            try:
                payload = security_manager.decode_token(token)
                
                # Check if token is blacklisted
                jti = payload.get("jti")
                if jti:
                    is_blacklisted = await cache_manager.get(f"blacklist:{jti}")
                    if is_blacklisted:
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token has been revoked"
                        )
                
                # Add user info to request state
                request.state.user_id = payload.get("sub")
                request.state.user_roles = payload.get("roles", [])
                request.state.token_type = payload.get("type")
                
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization format"
            )
        
        # Process request
        response = await call_next(request)
        return response
    
    def _is_public_path(self, path: str) -> bool:
        """Check if path is public"""
        return any(path.startswith(public) for public in self.PUBLIC_PATHS)