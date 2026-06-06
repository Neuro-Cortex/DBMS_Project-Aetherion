from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class OxygenStockResponse(BaseModel):
    id: str
    hospital_id: str
    hospital_name: Optional[str] = None
    total_cylinders: int = 0
    available_cylinders: int = 0
    in_use_cylinders: int = 0
    reserved_cylinders: int = 0
    cylinder_types: Optional[dict] = None
    status: Optional[str] = "sufficient"
    emergency_support: bool = True
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    last_refilled: Optional[date] = None
    next_refill_date: Optional[date] = None

    model_config = {"from_attributes": True}


class OxygenStockUpdateRequest(BaseModel):
    total_cylinders: Optional[int] = Field(None, ge=0)
    available_cylinders: Optional[int] = Field(None, ge=0)
    in_use_cylinders: Optional[int] = Field(None, ge=0)
    reserved_cylinders: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None


class OxygenCenterResponse(BaseModel):
    id: str
    name: str
    type: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_open: bool = True
    is_emergency_ready: bool = False
    operating_hours: Optional[str] = None
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    rating: float = 0.0

    model_config = {"from_attributes": True}


class OxygenRequestCreate(BaseModel):
    patient_name: str = Field(...)
    patient_age: Optional[int] = None
    patient_condition: Optional[str] = None
    oxygen_type: Optional[str] = None
    cylinders_needed: int = Field(..., ge=1)
    urgency: str = Field(default="normal")
    hospital_name: Optional[str] = None
    doctor_name: Optional[str] = None
    delivery_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    hospital_id: Optional[str] = None
    required_date: Optional[date] = None


class OxygenRequestResponse(BaseModel):
    id: str
    request_number: Optional[str] = None
    patient_name: Optional[str] = None
    cylinders_needed: Optional[int] = None
    urgency: Optional[str] = None
    status: Optional[str] = None
    delivery_address: Optional[str] = None
    contact_phone: Optional[str] = None
    requested_by: Optional[str] = None
    hospital_id: Optional[str] = None
    required_date: Optional[date] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class OxygenAlertResponse(BaseModel):
    id: str
    type: Optional[str] = None
    title: str
    message: Optional[str] = None
    hospital_name: Optional[str] = None
    priority: Optional[str] = None
    is_read: bool = False

    model_config = {"from_attributes": True}


class OxygenDashboardResponse(BaseModel):
    total_centers: int = 0
    total_cylinders: int = 0
    available_cylinders: int = 0
    critical_alerts: int = 0
    pending_requests: int = 0
