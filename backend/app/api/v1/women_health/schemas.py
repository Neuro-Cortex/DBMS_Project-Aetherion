"""
Women health schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime, date

class WomenHealthProfileCreate(BaseModel):
    last_menstrual_period: Optional[date] = None
    cycle_length_days: Optional[int] = None
    period_duration_days: Optional[int] = None
    previous_pregnancies: int = 0
    previous_deliveries: int = 0
    complications_history: Optional[List[str]] = []

class PregnancyRecordCreate(BaseModel):
    pregnancy_number: int
    start_date: date
    expected_delivery_date: date
    trimester: int = 1

class PregnancyRecordUpdate(BaseModel):
    trimester: Optional[int] = None
    weight_gain_kg: Optional[float] = None
    next_appointment: Optional[datetime] = None
    delivery_type: Optional[str] = None
    delivery_complications: Optional[str] = None
    actual_delivery_date: Optional[date] = None

class MenstrualLogCreate(BaseModel):
    period_start: date
    period_end: Optional[date] = None
    flow_intensity: Optional[str] = None
    symptoms: Optional[List[str]] = []
    pain_level: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[str] = None
    notes: Optional[str] = None

class GynecologistVisitCreate(BaseModel):
    doctor_id: Optional[str] = None
    visit_date: datetime
    visit_type: str
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    next_visit: Optional[date] = None
    notes: Optional[str] = None

class BabyRecordCreate(BaseModel):
    name: str
    date_of_birth: date
    gender: str
    birth_weight_kg: Optional[float] = None
    birth_height_cm: Optional[float] = None

class BabyGrowthRecord(BaseModel):
    date: date
    weight_kg: float
    height_cm: float
    head_circumference_cm: Optional[float] = None
    notes: Optional[str] = None

class VaccineSchedule(BaseModel):
    vaccine_name: str
    due_date: date
    dose_number: int = 1
    notes: Optional[str] = None