from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# DOCTOR PROFILE SCHEMAS
# ============================================
class DoctorProfileResponse(BaseModel):
    id: str
    user_id: str
    specialization: str
    sub_specializations: Optional[List[str]] = None
    license_number: Optional[str] = None
    medical_council: Optional[str] = None
    experience_years: int = 0
    qualifications: Optional[List] = None
    consultation_fee: float = 0
    follow_up_fee: float = 0
    video_consultation_fee: float = 0
    hospital_affiliation: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    languages: Optional[List[str]] = None
    is_verified: bool = False
    rating: float = 0.0
    review_count: int = 0
    total_patients: int = 0
    total_consultations: int = 0
    success_rate: float = 0.0
    about: Optional[str] = None
    profile_image: Optional[str] = None
    cover_image: Optional[str] = None
    achievements: Optional[List] = None
    awards: Optional[List] = None
    publications: Optional[List] = None
    memberships: Optional[List] = None
    status: str = "offline"
    is_online: bool = False
    is_active: bool = True
    max_patients_per_day: int = 30
    consultation_duration: int = 15
    consultation_modes: Optional[List] = None
    # User fields joined
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class DoctorProfileUpdateRequest(BaseModel):
    specialization: Optional[str] = Field(None, max_length=150)
    sub_specializations: Optional[List[str]] = None
    medical_council: Optional[str] = Field(None, max_length=150)
    experience_years: Optional[int] = Field(None, ge=0)
    qualifications: Optional[List] = None
    consultation_fee: Optional[float] = Field(None, ge=0)
    follow_up_fee: Optional[float] = Field(None, ge=0)
    video_consultation_fee: Optional[float] = Field(None, ge=0)
    hospital_affiliation: Optional[str] = Field(None, max_length=255)
    department: Optional[str] = Field(None, max_length=100)
    designation: Optional[str] = Field(None, max_length=100)
    languages: Optional[List[str]] = None
    about: Optional[str] = None
    achievements: Optional[List] = None
    awards: Optional[List] = None
    publications: Optional[List] = None
    memberships: Optional[List] = None
    max_patients_per_day: Optional[int] = Field(None, ge=1, le=100)
    consultation_duration: Optional[int] = Field(None, ge=5, le=120)
    consultation_modes: Optional[List[str]] = None


# ============================================
# DOCTOR LIST ITEM (for search/browse)
# ============================================
class DoctorListItemResponse(BaseModel):
    id: str
    user_id: str
    specialization: str
    experience_years: int = 0
    consultation_fee: float = 0
    hospital_affiliation: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    total_patients: int = 0
    about: Optional[str] = None
    profile_image: Optional[str] = None
    status: str = "offline"
    is_online: bool = False
    is_verified: bool = False
    # User fields
    full_name: Optional[str] = None
    gender: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# DOCTOR AVAILABILITY
# ============================================
class DoctorAvailabilityResponse(BaseModel):
    id: str
    doctor_id: str
    day_of_week: int
    start_time: str
    end_time: str
    max_patients: int = 10
    current_patients: int = 0
    is_available: bool = True

    model_config = {"from_attributes": True}


class DoctorAvailabilityCreateRequest(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6)
    start_time: str = Field(..., max_length=10)
    end_time: str = Field(..., max_length=10)
    max_patients: int = Field(default=10, ge=1, le=100)
    is_available: bool = True


class WeeklyScheduleUpdateRequest(BaseModel):
    schedule: List[DoctorAvailabilityCreateRequest]


# ============================================
# DOCTOR DASHBOARD
# ============================================
class DoctorDashboardResponse(BaseModel):
    today_appointments: int = 0
    upcoming_appointments: int = 0
    total_patients: int = 0
    total_consultations: int = 0
    completed_appointments: int = 0
    cancelled_appointments: int = 0
    average_rating: float = 0.0
    total_reviews: int = 0
    today_earnings: float = 0.0
    this_week_earnings: float = 0.0
    this_month_earnings: float = 0.0
    total_earnings: float = 0.0
    recent_activities: List[dict] = []
    notifications: List[dict] = []


# ============================================
# DOCTOR PATIENT (relationship)
# ============================================
class DoctorPatientResponse(BaseModel):
    id: str
    doctor_id: str
    patient_id: str
    total_visits: int = 0
    last_visit: Optional[date] = None
    is_active: bool = True
    # Joined patient info
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    profile_image: Optional[str] = None
    blood_group: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# DOCTOR NOTIFICATION
# ============================================
class DoctorNotificationResponse(BaseModel):
    id: str
    doctor_id: str
    type: str
    title: str
    message: str
    is_read: bool = False
    action_url: Optional[str] = None
    priority: str = "medium"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# DOCTOR EARNINGS
# ============================================
class DoctorEarningsResponse(BaseModel):
    id: str
    doctor_id: str
    earning_date: date
    consultations: int = 0
    video_consultations: int = 0
    follow_ups: int = 0
    total_amount: float = 0

    model_config = {"from_attributes": True}


# ============================================
# DOCTOR ACTIVITY
# ============================================
class DoctorActivityResponse(BaseModel):
    id: str
    doctor_id: str
    type: str
    description: str
    patient_name: Optional[str] = None
    status: str = "completed"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# DOCTOR PROFILE CREATE REQUEST
# ============================================
class DoctorProfileCreateRequest(BaseModel):
    """Schema for creating a new doctor profile during registration."""
    specialization: str = Field(..., min_length=1, max_length=150)
    sub_specializations: Optional[List[str]] = None
    license_number: str = Field(..., min_length=1, max_length=100)
    medical_council: Optional[str] = None
    experience_years: int = Field(default=0, ge=0)
    qualifications: List[dict] = Field(default_factory=list)
    consultation_fee: float = Field(default=0, ge=0)
    follow_up_fee: float = Field(default=0, ge=0)
    video_consultation_fee: float = Field(default=0, ge=0)
    hospital_affiliation: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    languages: Optional[List[str]] = None
    consultation_duration: int = Field(default=15, ge=5, le=120)
    max_patients_per_day: int = Field(default=30, ge=1, le=100)
    consultation_modes: Optional[List[str]] = None
    about: Optional[str] = None
    achievements: Optional[List[str]] = None
    awards: Optional[List[dict]] = None
    publications: Optional[List[dict]] = None
    memberships: Optional[List[str]] = None
