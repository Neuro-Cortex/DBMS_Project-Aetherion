from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# DONOR SCHEMAS
# ============================================
class DonorRegisterRequest(BaseModel):
    blood_group: str = Field(...)
    age: Optional[int] = Field(None, ge=18, le=65)
    weight_kg: Optional[float] = Field(None, ge=45)
    gender: Optional[str] = None
    is_emergency_donor: bool = False
    medical_conditions: Optional[List[str]] = None
    is_on_medication: bool = False
    current_medications: Optional[List[str]] = None
    has_tattoo: bool = False
    has_piercing: bool = False
    has_traveled_abroad: bool = False


class DonorProfileResponse(BaseModel):
    id: str
    user_id: str
    blood_group: str
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    gender: Optional[str] = None
    last_donation_date: Optional[date] = None
    total_donations: int = 0
    next_eligible_date: Optional[date] = None
    is_eligible: bool = True
    is_available: bool = True
    is_emergency_donor: bool = False
    status: Optional[str] = None
    reward_points: int = 0
    lives_saved: int = 0
    donated_units: int = 0
    # Joined user info
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None

    model_config = {"from_attributes": True}


class DonorProfileUpdateRequest(BaseModel):
    is_available: Optional[bool] = None
    is_emergency_donor: Optional[bool] = None
    medical_conditions: Optional[List[str]] = None
    is_on_medication: Optional[bool] = None
    current_medications: Optional[List[str]] = None


# ============================================
# BLOOD DONATION (RECORD)
# ============================================
class BloodDonationResponse(BaseModel):
    id: str
    donor_id: str
    donation_date: date
    blood_group: str
    units: int = 1
    donation_type: Optional[str] = None
    location: Optional[str] = None
    hospital_name: Optional[str] = None
    certificate_url: Optional[str] = None
    reward_points_earned: int = 0
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# BLOOD REQUEST
# ============================================
class BloodRequestCreate(BaseModel):
    patient_name: str = Field(...)
    patient_age: Optional[int] = None
    blood_group: str = Field(...)
    units_required: int = Field(..., ge=1)
    urgency: str = Field(default="normal")
    reason: Optional[str] = None
    doctor_name: Optional[str] = None
    hospital_id: Optional[str] = None
    required_by_date: Optional[date] = None


class BloodRequestResponse(BaseModel):
    id: str
    request_number: Optional[str] = None
    requested_by: Optional[str] = None
    hospital_id: Optional[str] = None
    patient_name: Optional[str] = None
    blood_group: Optional[str] = None
    units_required: Optional[int] = None
    urgency: Optional[str] = None
    reason: Optional[str] = None
    doctor_name: Optional[str] = None
    status: Optional[str] = None
    required_by_date: Optional[date] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# BLOOD DONATION CAMP
# ============================================
class BloodDonationCampResponse(BaseModel):
    id: str
    name: str
    organizer: Optional[str] = None
    camp_date: Optional[date] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    expected_donors: int = 0
    registered_donors: int = 0
    blood_groups_needed: Optional[List] = None
    contact_phone: Optional[str] = None
    status: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================
# ELIGIBILITY
# ============================================
class EligibilityResponse(BaseModel):
    is_eligible: bool = False
    next_eligible_date: Optional[str] = None
    reason: Optional[str] = None


# ============================================
# DONOR STATS
# ============================================
class DonorStatsResponse(BaseModel):
    total_donations: int = 0
    donated_units: int = 0
    lives_saved: int = 0
    reward_points: int = 0
    last_donation: Optional[str] = None
    next_eligible: Optional[str] = None
