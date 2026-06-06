from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ============================================
# REQUEST SCHEMAS
# ============================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    role: Optional[str] = None


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)
    phone: str = Field(..., min_length=7, max_length=20)
    role: str = Field(default="patient")
    gender: Optional[str] = None

    model_config = {"from_attributes": True}


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_new_password: str = Field(..., min_length=8, max_length=128)


class VerifyEmailRequest(BaseModel):
    token: str


class RoleSwitchRequest(BaseModel):
    role: str


# ============================================
# RESPONSE SCHEMAS
# ============================================
class UserBasicResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    profile_image: Optional[str] = None
    blood_group: Optional[str] = None
    primary_role: str
    roles: List[str]
    upgrades: List[str] = []
    is_verified: bool = False
    is_admin_approved: bool = False
    is_active: bool = True
    is_online: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900  # 15 minutes in seconds
    user: UserBasicResponse


class AuthResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: TokenResponse


class RefreshTokenResponse(BaseModel):
    access_token: str
    refresh_token: str  # New refresh token (rotation)
    token_type: str = "bearer"
    expires_in: int = 900


class AdminActionConfirm(BaseModel):
    """Schema for admin actions that require password re-authentication."""
    password: str = Field(..., min_length=6)


class MessageResponse(BaseModel):
    success: bool = True
    message: str
