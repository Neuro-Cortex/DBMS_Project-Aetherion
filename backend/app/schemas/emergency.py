from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============================================
# EMERGENCY SERVICE SCHEMAS
# ============================================
class EmergencyServiceResponse(BaseModel):
    id: str
    name: str
    type: Optional[str] = None
    status: Optional[str] = None
    provider: Optional[str] = None
    phone: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    eta_minutes: Optional[int] = None
    capacity: Optional[int] = None
    current_load: Optional[int] = None
    vehicle_number: Optional[str] = None
    equipment: Optional[List] = None
    rating: float = 0.0
    price: float = 0
    hospital_id: Optional[str] = None
    is_active: bool = True

    model_config = {"from_attributes": True}


# ============================================
# EMERGENCY REQUEST SCHEMAS
# ============================================
class EmergencyRequestCreate(BaseModel):
    type: str = Field(..., description="ambulance, blood, oxygen, doctor, emergency-room")
    priority: str = Field(default="medium", description="low, medium, high, critical")
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    location_address: str = Field(...)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None
    hospital_id: Optional[str] = None


class SOSRequest(BaseModel):
    location_address: str = Field(...)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    notes: Optional[str] = None
    type: str = Field(default="ambulance")
    priority: str = Field(default="critical")


class EmergencyCancelRequest(BaseModel):
    cancellation_reason: str = Field(..., min_length=1, max_length=500)


class EmergencyRequestResponse(BaseModel):
    id: str
    type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    location_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None
    service_id: Optional[str] = None
    hospital_id: Optional[str] = None
    estimated_time: Optional[int] = None
    cancellation_reason: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# EMERGENCY DASHBOARD
# ============================================
class EmergencyDashboardResponse(BaseModel):
    active_requests: int = 0
    pending_requests: int = 0
    dispatched_requests: int = 0
    completed_today: int = 0
    available_ambulances: int = 0
    nearby_hospitals: int = 0
