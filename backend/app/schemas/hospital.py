from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# HOSPITAL RESPONSE SCHEMAS
# ============================================
class HospitalResponse(BaseModel):
    id: str
    admin_user_id: str
    name: str
    registration_number: Optional[str] = None
    type: Optional[str] = None
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: str = "USA"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_beds: int = 0
    available_beds: int = 0
    icu_total_beds: int = 0
    icu_available_beds: int = 0
    ambulance_count: int = 0
    ambulance_available: int = 0
    emergency_service: Optional[str] = None
    total_doctors: int = 0
    total_nurses: int = 0
    rating: float = 0.0
    review_count: int = 0
    is_verified: bool = False
    is_active: bool = True
    services: Optional[List] = None
    facilities: Optional[List] = None
    insurance_accepted: Optional[List] = None
    working_hours: Optional[dict] = None
    visiting_hours: Optional[dict] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class HospitalListItemResponse(BaseModel):
    id: str
    name: str
    type: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    total_beds: int = 0
    available_beds: int = 0
    icu_available_beds: int = 0
    rating: float = 0.0
    is_verified: bool = False
    emergency_service: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    model_config = {"from_attributes": True}


class HospitalUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    emergency_phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    website: Optional[str] = Field(None, max_length=500)
    street: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    zip_code: Optional[str] = Field(None, max_length=20)
    total_beds: Optional[int] = Field(None, ge=0)
    available_beds: Optional[int] = Field(None, ge=0)
    services: Optional[List] = None
    facilities: Optional[List] = None
    working_hours: Optional[dict] = None
    visiting_hours: Optional[dict] = None


# ============================================
# HOSPITAL CREATE REQUEST
# ============================================
class HospitalCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    registration_number: str = Field(..., min_length=1, max_length=100)
    type: str = Field(default="general", pattern="^(government|private|charitable|multispecialty|community|teaching|specialized|general)$")
    phone: str = Field(..., min_length=1, max_length=20)
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    street: Optional[str] = None
    city: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    zip_code: Optional[str] = None
    country: str = "USA"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_beds: int = 0
    icu_total_beds: int = 0
    ambulance_count: int = 0
    services: Optional[list] = None
    facilities: Optional[list] = None
    insurance_accepted: Optional[list] = None
    working_hours: Optional[dict] = None
    visiting_hours: Optional[dict] = None


# ============================================
# HOSPITAL DASHBOARD
# ============================================
class HospitalDashboardResponse(BaseModel):
    hospital: Optional[dict] = None
    total_beds: int = 0
    available_beds: int = 0
    icu_beds: int = 0
    icu_available: int = 0
    total_doctors: int = 0
    total_patients: int = 0
    ambulance_count: int = 0
    ambulance_available: int = 0
    blood_bank_available: bool = False
    oxygen_status: Optional[str] = None
    recent_activities: List[dict] = []


# ============================================
# HOSPITAL DOCTOR
# ============================================
class HospitalDoctorResponse(BaseModel):
    id: str
    hospital_id: str
    doctor_id: str
    department_id: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None
    is_active: bool = True
    # Joined doctor info
    full_name: Optional[str] = None
    specialization: Optional[str] = None
    profile_image: Optional[str] = None
    status: Optional[str] = None

    model_config = {"from_attributes": True}


class HospitalDoctorCreateRequest(BaseModel):
    doctor_id: str = Field(...)
    department_id: Optional[str] = None
    designation: Optional[str] = Field(None, max_length=100)


# ============================================
# HOSPITAL DEPARTMENT
# ============================================
class HospitalDepartmentResponse(BaseModel):
    id: str
    hospital_id: str
    name: str
    description: Optional[str] = None
    head_doctor_id: Optional[str] = None
    total_beds: int = 0
    available_beds: int = 0
    total_doctors: int = 0
    is_active: bool = True

    model_config = {"from_attributes": True}


class HospitalDepartmentCreateRequest(BaseModel):
    name: str = Field(..., max_length=150)
    description: Optional[str] = None
    head_doctor_id: Optional[str] = None
    total_beds: Optional[int] = 0


# ============================================
# HOSPITAL BED
# ============================================
class HospitalBedResponse(BaseModel):
    id: str
    hospital_id: str
    department_id: Optional[str] = None
    bed_number: str
    bed_type: Optional[str] = None
    floor: Optional[str] = None
    ward: Optional[str] = None
    status: Optional[str] = "available"
    price_per_day: float = 0
    features: Optional[List] = None
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    has_ventilator: bool = False
    has_monitor: bool = False

    model_config = {"from_attributes": True}


class BedBookingRequest(BaseModel):
    bed_type: str = Field(...)
    patient_id: str = Field(...)
    patient_name: str = Field(...)
    reason: Optional[str] = None
    expected_stay: Optional[int] = None


# ============================================
# BLOOD STOCK
# ============================================
class BloodStockResponse(BaseModel):
    id: str
    blood_bank_id: str
    blood_group: str
    units: int = 0
    expiry_date: Optional[date] = None
    status: Optional[str] = "sufficient"

    model_config = {"from_attributes": True}


class BloodStockUpdateRequest(BaseModel):
    blood_group: str = Field(...)
    units: int = Field(...)


# ============================================
# OXYGEN STOCK
# ============================================
class OxygenStockResponse(BaseModel):
    id: str
    hospital_id: str
    total_cylinders: int = 0
    available_cylinders: int = 0
    in_use_cylinders: int = 0
    reserved_cylinders: int = 0
    cylinder_types: Optional[dict] = None
    status: Optional[str] = "sufficient"
    last_refilled: Optional[date] = None
    next_refill_date: Optional[date] = None

    model_config = {"from_attributes": True}


class OxygenStockUpdateRequest(BaseModel):
    total_cylinders: Optional[int] = Field(None, ge=0)
    available_cylinders: Optional[int] = Field(None, ge=0)
    in_use_cylinders: Optional[int] = Field(None, ge=0)
    reserved_cylinders: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None


# ============================================
# AMBULANCE
# ============================================
class AmbulanceResponse(BaseModel):
    id: str
    hospital_id: str
    vehicle_number: str
    type: Optional[str] = "basic"
    status: Optional[str] = "available"
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    has_oxygen: bool = True
    has_ac: bool = True
    current_address: Optional[str] = None

    model_config = {"from_attributes": True}


class AmbulanceStatusUpdateRequest(BaseModel):
    status: str = Field(...)


class AmbulanceCreateRequest(BaseModel):
    vehicle_number: str = Field(...)
    type: Optional[str] = "basic"
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None


# ============================================
# HOSPITAL STATS
# ============================================
class HospitalStatsResponse(BaseModel):
    total_hospitals: int = 0
    total_beds: int = 0
    available_beds: int = 0
    icu_beds: int = 0
    available_icu_beds: int = 0
