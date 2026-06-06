from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from ..core.database import get_db
from ..core.security import decode_token
from ..core.logger import get_logger
from ..models.user import User, UserRole, Role
from ..core.permissions import CurrentUser
from ..core.exceptions import UnauthorizedException

security = HTTPBearer()
logger = get_logger("auth_middleware")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> CurrentUser:
    """
    Extract and validate the current user from the JWT access token.
    Queries the database for the real user with their roles.
    """
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise UnauthorizedException("Invalid or expired token")

    if payload.get("type") != "access":
        raise UnauthorizedException("Invalid token type. Access token required.")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")

    # Query real user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise UnauthorizedException("User not found")

    if not user.is_active:
        raise UnauthorizedException("Account is deactivated")

    # Load roles from database
    role_rows = (
        db.query(Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .filter(UserRole.user_id == user_id, UserRole.is_active == True, Role.is_active == True)
        .all()
    )
    roles = [r[0] for r in role_rows]

    # Get primary role name
    primary_role = payload.get("role", "client")
    if not roles:
        # Fallback: try to get from primary_role_id
        if user.primary_role_id:
            role_obj = db.query(Role).filter(Role.id == user.primary_role_id).first()
            if role_obj:
                primary_role = role_obj.name
                roles = [primary_role]
        else:
            primary_role = "client"
            roles = ["client"]

    return CurrentUser(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=primary_role,
        roles=roles,
        primary_role=primary_role,
        is_active=user.is_active,
        is_admin_approved=user.is_admin_approved,
        is_verified=user.is_verified,
    )


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[CurrentUser]:
    """
    Optional auth dependency — returns None if no token provided.
    Used for endpoints that work for both authenticated and anonymous users.
    """
    if not credentials:
        return None

    try:
        return await get_current_user(credentials, db)
    except (UnauthorizedException, HTTPException):
        return None
