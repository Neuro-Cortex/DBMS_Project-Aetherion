from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# ============================================
# ADMIN VERIFICATION
# ============================================
class VerificationActionRequest(BaseModel):
    status: str = Field(..., description="approved, rejected, or more-info")
    rejection_reason: Optional[str] = None
    notes: Optional[str] = None


class VerificationRequestResponse(BaseModel):
    id: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    entity_name: Optional[str] = None
    documents: Optional[List] = None
    status: Optional[str] = None
    reviewed_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# ADMIN DASHBOARD
# ============================================
class AdminDashboardResponse(BaseModel):
    total_users: int = 0
    total_doctors: int = 0
    total_hospitals: int = 0
    total_pharmacies: int = 0
    total_appointments: int = 0
    pending_verifications: int = 0
    active_emergencies: int = 0
    total_revenue: float = 0.0
    recent_signups: int = 0


# ============================================
# AUDIT LOG
# ============================================
class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    old_values: Optional[Any] = None
    new_values: Optional[Any] = None
    ip_address: Optional[str] = None
    severity: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# FEEDBACK
# ============================================
class FeedbackResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    type: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    response: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class FeedbackResolveRequest(BaseModel):
    response: str = Field(...)
    status: str = Field(default="resolved")
