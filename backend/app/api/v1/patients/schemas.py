"""
Patient schemas
"""
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class PatientProfileCreate(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    chronic_diseases: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    current_medications: Optional[List[str]] = []
    past_surgeries: Optional[List[Dict]] = []
    family_history: Optional[List[Dict]] = []
    smoking_status: Optional[str] = None
    alcohol_consumption: Optional[str] = None
    exercise_frequency: Optional[str] = None
    diet_preferences: Optional[str] = None

class PatientProfileUpdate(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    chronic_diseases: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
    smoking_status: Optional[str] = None
    alcohol_consumption: Optional[str] = None
    exercise_frequency: Optional[str] = None
    diet_preferences: Optional[str] = None

class VitalsRecord(BaseModel):
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    heart_rate: Optional[int] = None
    temperature_celsius: Optional[float] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None
    blood_sugar: Optional[float] = None
    notes: Optional[str] = None

class VaccinationRecord(BaseModel):
    vaccine_name: str
    dose_number: int = 1
    administered_date: datetime
    next_due_date: Optional[datetime] = None
    administered_by: Optional[str] = None
    batch_number: Optional[str] = None
    notes: Optional[str] = None

class MedicalRecordCreate(BaseModel):
    record_type: str
    title: str
    description: Optional[str] = None
    diagnosis: Optional[str] = None
    symptoms: Optional[List[str]] = None
    treatment_plan: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    is_confidential: bool = False

class HealthTimelineQuery(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    record_types: Optional[List[str]] = None