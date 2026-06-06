"""
Women's Health Schemas — Aetherion Healthcare

Pydantic models for request validation and response serialization.
"""

from typing import Optional, List
from datetime import date
from pydantic import BaseModel, Field


# ================================================================
# MENSTRUAL CYCLE
# ================================================================

class MenstrualCycleCreateRequest(BaseModel):
    start_date: date
    cycle_length: int = Field(default=28, ge=14, le=45)
    period_length: int = Field(default=5, ge=1, le=14)
    flow_intensity: Optional[str] = Field(default="medium", pattern="^(light|medium|heavy|very_heavy)$")
    is_regular: bool = True
    symptoms: Optional[list] = None
    mood: Optional[str] = None
    notes: Optional[str] = None
    reminder_enabled: bool = False
    reminder_days: int = Field(default=2, ge=1, le=7)


class MenstrualCycleResponse(BaseModel):
    id: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    cycle_length: Optional[int] = None
    period_length: Optional[int] = None
    flow_intensity: Optional[str] = None
    is_regular: Optional[bool] = None
    symptoms: Optional[list] = None
    mood: Optional[str] = None
    notes: Optional[str] = None
    next_period_date: Optional[str] = None
    ovulation_date: Optional[str] = None
    fertile_window_start: Optional[str] = None
    fertile_window_end: Optional[str] = None
    reminder_enabled: Optional[bool] = None
    reminder_days: Optional[int] = None


# ================================================================
# PREGNANCY
# ================================================================

class PregnancyCreateRequest(BaseModel):
    lmp_date: date = Field(..., description="Last Menstrual Period date")
    pregnancy_number: int = Field(default=1, ge=1)
    is_first_pregnancy: bool = True
    previous_pregnancies: int = Field(default=0, ge=0)
    high_risk: bool = False
    risk_notes: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    notes: Optional[str] = None


class PregnancyUpdateRequest(BaseModel):
    high_risk: Optional[bool] = None
    risk_notes: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    baby_gender: Optional[str] = Field(default=None, pattern="^(boy|girl|unknown)$")
    baby_name: Optional[str] = None
    notes: Optional[str] = None
    complications: Optional[list] = None


class PregnancyTrackingCreateRequest(BaseModel):
    week_number: Optional[int] = Field(default=None, ge=1, le=42)
    weight_kg: Optional[float] = Field(default=None, ge=20, le=250)
    blood_pressure_systolic: Optional[int] = Field(default=None, ge=60, le=250)
    blood_pressure_diastolic: Optional[int] = Field(default=None, ge=40, le=150)
    blood_sugar: Optional[float] = Field(default=None, ge=30, le=500)
    hemoglobin: Optional[float] = Field(default=None, ge=4, le=20)
    fetal_movement_count: Optional[int] = Field(default=None, ge=0)
    symptoms: Optional[list] = None
    notes: Optional[str] = None
    recorded_at: Optional[date] = None


class PregnancyResponse(BaseModel):
    id: str
    lmp_date: Optional[str] = None
    estimated_due_date: Optional[str] = None
    current_week: Optional[int] = None
    current_trimester: Optional[str] = None
    pregnancy_number: Optional[int] = None
    is_first_pregnancy: Optional[bool] = None
    high_risk: Optional[bool] = None
    risk_notes: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    baby_gender: Optional[str] = None
    baby_name: Optional[str] = None
    status: Optional[str] = None
    complications: Optional[list] = None
    notes: Optional[str] = None


# ================================================================
# BABY VACCINES
# ================================================================

class BabyVaccineRecordCreateRequest(BaseModel):
    baby_id: str
    vaccine_name: str = Field(..., min_length=1, max_length=255)
    disease: Optional[str] = None
    dose_number: int = Field(default=1, ge=1)
    scheduled_date: date
    administered_date: Optional[date] = None
    administered_by: Optional[str] = None
    hospital_name: Optional[str] = None
    batch_number: Optional[str] = None
    status: str = Field(default="scheduled", pattern="^(scheduled|completed|missed|delayed)$")
    next_dose_date: Optional[date] = None
    side_effects: Optional[str] = None
    certificate_url: Optional[str] = None


class VaccineStatusUpdateRequest(BaseModel):
    status: Optional[str] = Field(default=None, pattern="^(scheduled|completed|missed|delayed)$")
    administered_date: Optional[date] = None
    next_dose_date: Optional[date] = None
    side_effects: Optional[str] = None


# ================================================================
# BABY GROWTH
# ================================================================

class BabyGrowthCreateRequest(BaseModel):
    baby_id: str
    record_date: Optional[date] = None
    age_months: int = Field(default=0, ge=0)
    weight_kg: Optional[float] = Field(default=None, ge=0.5, le=100)
    height_cm: Optional[float] = Field(default=None, ge=20, le=200)
    head_circumference_cm: Optional[float] = Field(default=None, ge=10, le=80)
    percentile: Optional[float] = None
    notes: Optional[str] = None


# ================================================================
# GYNECOLOGIST CONSULTATION
# ================================================================

class ConsultationCreateRequest(BaseModel):
    doctor_name: str = Field(..., min_length=1, max_length=150)
    doctor_specialization: Optional[str] = None
    hospital_name: Optional[str] = None
    date: date
    time: Optional[str] = None
    type: str = Field(default="in-person", pattern="^(in-person|video|phone)$")
    reason: Optional[str] = None
    notes: Optional[str] = None


class ConsultationUpdateRequest(BaseModel):
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    reports: Optional[list] = None
    follow_up_date: Optional[date] = None
    status: Optional[str] = Field(default=None, pattern="^(scheduled|completed|cancelled)$")
    notes: Optional[str] = None


# ================================================================
# DASHBOARD
# ================================================================

class WomenCareDashboardResponse(BaseModel):
    pregnancy: Optional[dict] = None
    menstrual_cycle: Optional[dict] = None
    baby_count: int = 0
    upcoming_vaccines: List[dict] = []
    health_tips: List[str] = []
