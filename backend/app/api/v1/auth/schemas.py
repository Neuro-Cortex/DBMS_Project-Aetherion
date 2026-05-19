"""
Authentication schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from app.models.base import UserRole, Gender, BloodGroup

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_info: Optional[dict] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    gender: Gender
    date_of_birth: Optional[datetime] = None
    phone: Optional[str] = None
    roles: List[UserRole] = [UserRole.PATIENT]
    blood_group: Optional[BloodGroup] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain a number')
        if not any(c in '!@#$%^&*()' for c in v):
            raise ValueError('Password must contain a special character')
        return v

class OTPVerification(BaseModel):
    user_id: str
    otp_code: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    user_id: str
    otp_code: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class TwoFactorSetupRequest(BaseModel):
    code: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str