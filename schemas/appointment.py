from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# APPOINTMENT REQUEST SCHEMAS
# ============================================
class BookAppointmentRequest(BaseModel):
    doctor_id: str = Field(..., min_length=1)
    patient_id: str = Field(..., min_length=1)
    hospital_id: Optional[str] = None
    department_id: Optional[str] = None
    appointment_date: date = Field(...)
    start_time: str = Field(..., max_length=10)
    type: str = Field(default="consultation")
    location: str = Field(default="in-person")
    priority: str = Field(default="medium")
    reason: Optional[str] = None
    symptoms: Optional[List[str]] = None
    notes: Optional[str] = None
    is_emergency: bool = False


class CancelAppointmentRequest(BaseModel):
    cancellation_reason: str = Field(..., min_length=1, max_length=500)


class RescheduleAppointmentRequest(BaseModel):
    new_date: date = Field(...)
    new_time: str = Field(..., max_length=10)
    reason: Optional[str] = None


# ============================================
# APPOINTMENT RESPONSE SCHEMAS
# ============================================
class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    hospital_id: Optional[str] = None
    department_id: Optional[str] = None
    appointment_date: Optional[date] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    type: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    priority: Optional[str] = None
    reason: Optional[str] = None
    symptoms: Optional[List] = None
    notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    is_emergency: bool = False
    is_first_visit: bool = True
    video_call_url: Optional[str] = None
    meeting_link: Optional[str] = None
    fee: float = 0
    payment_status: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    # Joined fields
    doctor_name: Optional[str] = None
    doctor_specialty: Optional[str] = None
    doctor_avatar: Optional[str] = None
    patient_name: Optional[str] = None
    patient_avatar: Optional[str] = None
    hospital_name: Optional[str] = None

    model_config = {"from_attributes": True}


class AppointmentStatsResponse(BaseModel):
    total: int = 0
    scheduled: int = 0
    confirmed: int = 0
    in_progress: int = 0
    completed: int = 0
    cancelled: int = 0
    no_show: int = 0
    completion_rate: float = 0.0
    cancellation_rate: float = 0.0


# ============================================
# PRESCRIPTION REQUEST SCHEMAS
# ============================================
class PrescriptionItemCreateRequest(BaseModel):
    medicine_name: str = Field(..., min_length=1, max_length=255)
    dosage: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., min_length=1, max_length=100)
    duration: Optional[str] = None
    timing: Optional[str] = Field(default=None, pattern="^(before-food|after-food|with-food|empty-stomach)$")
    route: str = "oral"
    quantity: int = Field(default=1, ge=1)
    refills: int = Field(default=0, ge=0)
    instructions: Optional[str] = None
    is_otc: bool = False


class PrescriptionTestCreateRequest(BaseModel):
    test_name: str = Field(..., min_length=1, max_length=255)
    test_type: Optional[str] = None
    instructions: Optional[str] = None
    is_urgent: bool = False


class PrescriptionCreateRequest(BaseModel):
    appointment_id: Optional[str] = None
    patient_id: str = Field(..., min_length=1)
    hospital_id: Optional[str] = None
    diagnosis: Optional[str] = None
    symptoms: Optional[List[str]] = None
    advice: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[date] = None
    valid_until: Optional[date] = None
    items: List[PrescriptionItemCreateRequest] = Field(default_factory=list)
    tests: List[PrescriptionTestCreateRequest] = Field(default_factory=list)


# ============================================
# PRESCRIPTION RESPONSE SCHEMAS
# ============================================
class PrescriptionItemResponse(BaseModel):
    id: str
    medicine_name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    timing: Optional[str] = None
    route: Optional[str] = None
    quantity: Optional[int] = None
    refills: Optional[int] = None
    instructions: Optional[str] = None
    is_otc: bool = False

    model_config = {"from_attributes": True}


class PrescriptionTestResponse(BaseModel):
    id: str
    test_name: str
    test_type: Optional[str] = None
    instructions: Optional[str] = None
    is_urgent: bool = False
    result_url: Optional[str] = None

    model_config = {"from_attributes": True}


class PrescriptionResponse(BaseModel):
    id: str
    appointment_id: Optional[str] = None
    doctor_id: str
    patient_id: str
    hospital_id: Optional[str] = None
    diagnosis: Optional[str] = None
    symptoms: Optional[List] = None
    advice: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[date] = None
    valid_until: Optional[date] = None
    is_digital: bool = True
    digital_signature: Optional[str] = None
    pdf_url: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None
    # Joined
    items: List[PrescriptionItemResponse] = []
    tests: List[PrescriptionTestResponse] = []
    doctor_name: Optional[str] = None
    patient_name: Optional[str] = None

    model_config = {"from_attributes": True}
