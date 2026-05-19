"""
Appointment schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date, time
from app.models.base import ConsultationType

class AppointmentCreate(BaseModel):
    doctor_id: str
    hospital_id: Optional[str] = None
    appointment_date: date
    start_time: time
    consultation_type: ConsultationType = ConsultationType.IN_PERSON
    reason: str = Field(..., min_length=10)
    symptoms: Optional[List[str]] = []
    is_follow_up: bool = False
    previous_appointment_id: Optional[str] = None

class AppointmentReschedule(BaseModel):
    appointment_date: date
    start_time: time

class AppointmentCancel(BaseModel):
    cancellation_reason: str = Field(..., min_length=10)

class PrescriptionCreate(BaseModel):
    diagnosis: str
    notes: Optional[str] = None
    valid_until: Optional[date] = None
    is_digital_signature: bool = False

class MedicinePrescription(BaseModel):
    medicine_id: str
    dosage: str
    frequency: str
    duration_days: int
    quantity: int
    instructions: Optional[str] = None
    before_food: bool = True

class TestPrescription(BaseModel):
    test_name: str
    test_code: Optional[str] = None
    instructions: Optional[str] = None
    is_urgent: bool = False

class AppointmentNote(BaseModel):
    notes: str
    is_private: bool = False

class VideoConsultationSetup(BaseModel):
    meeting_link: Optional[str] = None
    meeting_id: Optional[str] = None
    meeting_password: Optional[str] = None