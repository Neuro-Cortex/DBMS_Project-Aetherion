"""
Doctor schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, time
from app.models.base import DaysOfWeek, ConsultationType

class DoctorProfileCreate(BaseModel):
    license_number: str
    specialization: str
    sub_specializations: Optional[List[str]] = []
    qualifications: List[str]
    experience_years: int = 0
    bio: Optional[str] = None
    consultation_fee: float = 0.0
    video_consultation_fee: Optional[float] = None
    languages_spoken: List[str] = ["English"]
    accepting_new_patients: bool = True
    awards: Optional[List[dict]] = []
    publications: Optional[List[dict]] = []

class DoctorProfileUpdate(BaseModel):
    specialization: Optional[str] = None
    sub_specializations: Optional[List[str]] = None
    qualifications: Optional[List[str]] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    consultation_fee: Optional[float] = None
    video_consultation_fee: Optional[float] = None
    languages_spoken: Optional[List[str]] = None
    is_available: Optional[bool] = None
    accepting_new_patients: Optional[bool] = None

class DoctorScheduleCreate(BaseModel):
    day_of_week: DaysOfWeek
    start_time: time
    end_time: time
    slot_duration_minutes: int = 30
    max_patients_per_slot: int = 1
    consultation_type: ConsultationType = ConsultationType.IN_PERSON

class DoctorScheduleUpdate(BaseModel):
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    slot_duration_minutes: Optional[int] = None
    max_patients_per_slot: Optional[int] = None
    is_available: Optional[bool] = None

class ScheduleExceptionCreate(BaseModel):
    schedule_id: str
    exception_date: datetime
    reason: str
    is_available: bool = False

class HospitalAffiliationCreate(BaseModel):
    hospital_id: str
    department: str
    position: str
    joining_date: datetime
    is_primary: bool = False

class DoctorSearchFilters(BaseModel):
    specialization: Optional[str] = None
    city: Optional[str] = None
    min_experience: Optional[int] = None
    max_fee: Optional[float] = None
    min_rating: Optional[float] = None
    available_today: Optional[bool] = None
    accepts_insurance: Optional[bool] = None
    gender: Optional[str] = None
    languages: Optional[List[str]] = None