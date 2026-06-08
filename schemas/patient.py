from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# PATIENT PROFILE RESPONSE
# ============================================
class PatientProfileResponse(BaseModel):
    id: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    blood_group: Optional[str] = None
    profile_image: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: Optional[datetime] = None
    # Profile fields
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: Optional[List[str]] = None
    chronic_conditions: Optional[List[str]] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    # Emergency contacts
    emergency_contacts: List[dict] = []
    # Addresses
    addresses: List[dict] = []

    model_config = {"from_attributes": True}


# ============================================
# HEALTH RECORD
# ============================================
class HealthRecordResponse(BaseModel):
    id: str
    patient_id: str
    record_type: Optional[str] = None
    title: str
    description: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    recorded_by: Optional[str] = None
    is_shared: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class HealthRecordCreateRequest(BaseModel):
    record_type: str = Field(...)
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    file_url: Optional[str] = Field(None, max_length=500)
    file_type: Optional[str] = Field(None, max_length=50)
    file_size: Optional[int] = None
    is_shared: bool = False


# ============================================
# PRESCRIPTION RESPONSE
# ============================================
class PatientPrescriptionResponse(BaseModel):
    id: str
    doctor_id: str
    patient_id: str
    appointment_id: Optional[str] = None
    diagnosis: Optional[str] = None
    advice: Optional[str] = None
    follow_up_date: Optional[date] = None
    valid_until: Optional[date] = None
    status: Optional[str] = None
    is_digital: bool = True
    pdf_url: Optional[str] = None
    created_at: Optional[datetime] = None
    # Joined
    doctor_name: Optional[str] = None
    hospital_name: Optional[str] = None
    medications: List[dict] = []
    tests: List[dict] = []

    model_config = {"from_attributes": True}


# ============================================
# VACCINATION
# ============================================
class VaccinationResponse(BaseModel):
    id: str
    patient_id: str
    vaccine_name: str
    disease: Optional[str] = None
    dose_number: int = 1
    administered_at: Optional[date] = None
    next_due_date: Optional[date] = None
    administered_by: Optional[str] = None
    facility_name: Optional[str] = None
    status: Optional[str] = None
    certificate_url: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# MEDICATION
# ============================================
class MedicationResponse(BaseModel):
    id: str
    patient_id: str
    medicine_name: str
    dosage: str
    frequency: str
    route: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool = True
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# MEDICAL HISTORY
# ============================================
class MedicalHistoryResponse(BaseModel):
    id: str
    patient_id: str
    condition_name: str
    diagnosed_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# SURGERY
# ============================================
class SurgeryResponse(BaseModel):
    id: str
    patient_id: str
    surgery_name: str
    surgery_date: Optional[date] = None
    hospital: Optional[str] = None
    doctor_name: Optional[str] = None
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# HEALTH TIMELINE EVENT
# ============================================
class HealthTimelineEvent(BaseModel):
    id: str
    type: str
    title: str
    description: Optional[str] = None
    date: str
    icon: Optional[str] = None
    color: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# PATIENT CREATE REQUEST SCHEMAS
# ============================================
class VaccinationCreateRequest(BaseModel):
    vaccine_name: str = Field(..., min_length=1, max_length=255)
    disease: Optional[str] = None
    dose_number: int = Field(default=1, ge=1)
    scheduled_date: Optional[date] = None
    administered_at: Optional[date] = None
    administered_by: Optional[str] = None
    facility_name: Optional[str] = None
    hospital_name: Optional[str] = None
    batch_number: Optional[str] = None
    status: str = Field(default="scheduled", pattern="^(scheduled|completed|missed|delayed)$")
    side_effects: Optional[str] = None
    notes: Optional[str] = None


class MedicationCreateRequest(BaseModel):
    medicine_name: str = Field(..., min_length=1, max_length=255)
    dosage: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., min_length=1, max_length=100)
    route: str = "oral"
    start_date: date
    end_date: Optional[date] = None
    prescribed_by: Optional[str] = None
    prescription_id: Optional[str] = None
    is_active: bool = True
    reminder_time: Optional[str] = None
    reminder_enabled: bool = False
    notes: Optional[str] = None


class MedicalHistoryCreateRequest(BaseModel):
    condition_name: str = Field(..., min_length=1, max_length=255)
    diagnosed_date: Optional[date] = None
    status: str = Field(default="active", pattern="^(active|resolved|managed|ongoing)$")
    notes: Optional[str] = None


class SurgeryCreateRequest(BaseModel):
    surgery_name: str = Field(..., min_length=1, max_length=255)
    surgery_date: Optional[date] = None
    hospital: Optional[str] = None
    doctor_name: Optional[str] = None
    notes: Optional[str] = None


class PatientProfileUpdateRequest(BaseModel):
    bio: Optional[str] = None
    height_cm: Optional[float] = Field(default=None, ge=30, le=300)
    weight_kg: Optional[float] = Field(default=None, ge=1, le=500)
    allergies: Optional[list] = None
    chronic_conditions: Optional[list] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    language_preference: Optional[str] = None
