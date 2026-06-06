from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta
from typing import Optional

from ..models.user import (
    User, UserProfile, UserSession, UserRole, Role, PasswordReset,
)
from ..schemas.auth import (
    LoginRequest, RegisterRequest, TokenResponse, UserBasicResponse,
    RefreshTokenResponse,
)
from ..core.security import (
    hash_password, verify_password, create_access_token, create_refresh_token, decode_token,
)
from ..core.exceptions import (
    UnauthorizedException, ConflictException, BadRequestException, NotFoundException,
)
from ..core.config import get_settings

settings = get_settings()


class AuthService:
    """Handles all authentication operations with real database queries."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # LOGIN
    # ============================================
    async def login(self, request: LoginRequest) -> TokenResponse:
        user = self.db.query(User).filter(User.email == request.email).first()
        if not user:
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")

        if not verify_password(request.password, user.password_hash):
            # Track failed attempt via security log
            raise UnauthorizedException("Invalid email or password")

        # Load user roles
        roles = self._get_user_roles(user.id)
        primary_role = self._get_primary_role_name(user.primary_role_id)

        # Create tokens
        token_data = {"sub": user.id, "role": primary_role, "roles": roles}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token({"sub": user.id})

        # Store refresh token in user_sessions
        self._create_session(user.id, refresh_token)

        # Update online status
        user.is_online = True
        self.db.commit()

        user_response = self._build_user_response(user, roles, primary_role)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response,
        )

    # ============================================
    # REGISTER
    # ============================================
    async def register(self, request: RegisterRequest) -> TokenResponse:
        if request.password != request.confirm_password:
            raise BadRequestException("Passwords do not match")

        # Check if email already exists
        existing = self.db.query(User).filter(User.email == request.email).first()
        if existing:
            raise ConflictException("An account with this email already exists")

        # Resolve role
        role_name = request.role or "patient"
        role = self.db.query(Role).filter(Role.name == role_name).first()
        if not role:
            # Fallback to client role if specific role not found
            role = self.db.query(Role).filter(Role.name == "client").first()
        if not role:
            role = self.db.query(Role).first()  # Absolute fallback

        # Create user
        user = User(
            email=request.email,
            full_name=request.full_name,
            phone=request.phone,
            password_hash=hash_password(request.password),
            gender=request.gender,
            primary_role_id=role.id if role else "",
            is_verified=False,
            is_active=True,
            is_admin_approved=False,
        )
        self.db.add(user)
        self.db.flush()  # Get user.id

        # Create user profile
        profile = UserProfile(
            user_id=user.id,
            first_name=request.full_name.split(" ")[0] if request.full_name else "",
            last_name=" ".join(request.full_name.split(" ")[1:]) if request.full_name and " " in request.full_name else "",
        )
        self.db.add(profile)

        # Assign role
        if role:
            user_role = UserRole(user_id=user.id, role_id=role.id)
            self.db.add(user_role)

        self.db.commit()
        self.db.refresh(user)

        # Auto-login after registration
        roles = self._get_user_roles(user.id)
        primary_role = self._get_primary_role_name(user.primary_role_id)

        token_data = {"sub": user.id, "role": primary_role, "roles": roles}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token({"sub": user.id})

        self._create_session(user.id, refresh_token)
        self.db.commit()

        user_response = self._build_user_response(user, roles, primary_role)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response,
        )

    # ============================================
    # REFRESH TOKEN (with rotation)
    # ============================================
    async def refresh_token(self, refresh_token_str: str) -> RefreshTokenResponse:
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token")

        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Invalid token payload")

        # Verify session exists and not revoked
        session = (
            self.db.query(UserSession)
            .filter(
                UserSession.refresh_token == refresh_token_str,
                UserSession.user_id == user_id,
                UserSession.is_revoked == False,
                UserSession.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not session:
            raise UnauthorizedException("Refresh token expired or revoked")

        # Verify user still active
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise UnauthorizedException("User account is deactivated")

        # ── Token rotation: revoke old refresh token ──
        session.is_revoked = True

        # Create new token pair
        roles = self._get_user_roles(user.id)
        primary_role = self._get_primary_role_name(user.primary_role_id)

        token_data = {"sub": user.id, "role": primary_role, "roles": roles}
        new_access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token({"sub": user.id})

        # Store new refresh token session
        self._create_session(user.id, new_refresh_token)
        self.db.commit()

        return RefreshTokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    # ============================================
    # LOGOUT
    # ============================================
    async def logout(self, user_id: str, refresh_token: Optional[str] = None) -> None:
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.is_online = False

        if refresh_token:
            self.db.query(UserSession).filter(
                UserSession.refresh_token == refresh_token,
                UserSession.user_id == user_id,
            ).update({"is_revoked": True})
        else:
            # Revoke all sessions for this user
            self.db.query(UserSession).filter(
                UserSession.user_id == user_id,
            ).update({"is_revoked": True})

        self.db.commit()

    # ============================================
    # FORGOT PASSWORD
    # ============================================
    async def forgot_password(self, email: str) -> str:
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            # Don't reveal whether email exists — return success anyway
            return "If an account with this email exists, a reset link has been sent."

        # Generate reset token
        import uuid
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=1)

        password_reset = PasswordReset(
            user_id=user.id,
            token=token,
            expires_at=expires_at,
        )
        self.db.add(password_reset)
        self.db.commit()

        # TODO: Send actual email with reset link
        # reset_url = settings.PASSWORD_RESET_URL.format(
        #     frontend_url=settings.FRONTEND_URL, token=token
        # )
        # await send_email(user.email, "Password Reset", f"Click: {reset_url}")

        return "If an account with this email exists, a reset link has been sent."

    # ============================================
    # RESET PASSWORD
    # ============================================
    async def reset_password(self, token: str, new_password: str) -> None:
        reset_record = (
            self.db.query(PasswordReset)
            .filter(
                PasswordReset.token == token,
                PasswordReset.used_at.is_(None),
                PasswordReset.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not reset_record:
            raise BadRequestException("Invalid or expired reset token")

        user = self.db.query(User).filter(User.id == reset_record.user_id).first()
        if not user:
            raise NotFoundException("User not found")

        user.password_hash = hash_password(new_password)
        reset_record.used_at = datetime.utcnow()
        self.db.commit()

    # ============================================
    # CHANGE PASSWORD
    # ============================================
    async def change_password(self, user_id: str, current_password: str, new_password: str) -> None:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundException("User not found")

        if not verify_password(current_password, user.password_hash):
            raise BadRequestException("Current password is incorrect")

        user.password_hash = hash_password(new_password)
        self.db.commit()

    # ============================================
    # VERIFY EMAIL
    # ============================================
    async def verify_email(self, token: str) -> None:
        # Token format: "verify-{user_id}"
        # In production, use a proper email verification token table
        if token.startswith("verify-"):
            user_id = token.replace("verify-", "")
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_verified = True
                self.db.commit()
        else:
            raise BadRequestException("Invalid verification token")

    # ============================================
    # HELPER METHODS
    # ============================================
    def _get_user_roles(self, user_id: str) -> list[str]:
        role_rows = (
            self.db.query(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .filter(UserRole.user_id == user_id, UserRole.is_active == True, Role.is_active == True)
            .all()
        )
        return [r[0] for r in role_rows]

    def _get_primary_role_name(self, primary_role_id: str) -> str:
        if not primary_role_id:
            return "client"
        role = self.db.query(Role).filter(Role.id == primary_role_id).first()
        return role.name if role else "client"

    def _create_session(self, user_id: str, refresh_token: str) -> None:
        session = UserSession(
            user_id=user_id,
            refresh_token=refresh_token,
            expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        self.db.add(session)

    def _build_user_response(self, user: User, roles: list[str], primary_role: str) -> UserBasicResponse:
        return UserBasicResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            gender=user.gender,
            profile_image=user.profile_image,
            blood_group=user.blood_group,
            primary_role=primary_role,
            roles=roles,
            upgrades=[],  # TODO: load from user_role_upgrades
            is_verified=user.is_verified,
            is_admin_approved=user.is_admin_approved,
            is_active=user.is_active,
            is_online=user.is_online,
            created_at=user.created_at,
        )
