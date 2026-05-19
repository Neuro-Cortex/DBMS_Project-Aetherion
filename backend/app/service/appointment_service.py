"""
Appointment service with booking, scheduling, and prescription management
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.doctor_repository import DoctorRepository
from app.models.appointment import (
    Appointment, Prescription, PrescriptionMedicine, PrescribedTest
)
from app.models.doctor import DoctorSchedule
from datetime import datetime, date, time, timedelta
import uuid
import logging

logger = logging.getLogger(__name__)

class AppointmentService:
    """Appointment management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.appointment_repo = AppointmentRepository(session)
        self.doctor_repo = DoctorRepository(session)
    
    async def book_appointment(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> Appointment:
        """Book new appointment"""
        
        # Validate doctor exists and is available
        doctor = await self.doctor_repo.get_by_id(uuid.UUID(data['doctor_id']))
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        if not doctor.is_available:
            raise HTTPException(status_code=400, detail="Doctor is not available")
        
        # Check if slot is available
        is_available = await self.appointment_repo.check_slot_availability(
            uuid.UUID(data['doctor_id']),
            data['appointment_date'],
            data['start_time']
        )
        
        if not is_available:
            raise HTTPException(
                status_code=400,
                detail="Appointment slot is already booked"
            )
        
        # Calculate end time based on doctor's slot duration
        schedules = await self.doctor_repo.get_doctor_schedules(doctor.id)
        slot_duration = 30  # default
        if schedules:
            slot_duration = schedules[0].slot_duration_minutes
        
        start_time = data['start_time']
        end_time = (
            datetime.combine(date.today(), start_time) + 
            timedelta(minutes=slot_duration)
        ).time()
        
        appointment = Appointment(
            patient_id=user_id,
            doctor_id=uuid.UUID(data['doctor_id']),
            hospital_id=uuid.UUID(data['hospital_id']) if data.get('hospital_id') else None,
            appointment_date=data['appointment_date'],
            start_time=start_time,
            end_time=end_time,
            consultation_type=data.get('consultation_type', 'in_person'),
            reason=data['reason'],
            symptoms=data.get('symptoms', []),
            consultation_fee=doctor.consultation_fee
        )
        
        self.session.add(appointment)
        await self.session.commit()
        await self.session.refresh(appointment)
        
        return appointment
    
    async def get_appointment(
        self, user_id: uuid.UUID, appointment_id: uuid.UUID
    ) -> Appointment:
        """Get appointment details"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Check access - patient or doctor
        if (
            str(appointment.patient_id) != str(user_id) and 
            str(appointment.doctor_id) != str(user_id)
        ):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return appointment
    
    async def get_upcoming_appointments(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Appointment]:
        """Get upcoming appointments"""
        return await self.appointment_repo.get_upcoming_appointments(
            user_id, skip, limit
        )
    
    async def get_appointment_history(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Appointment]:
        """Get appointment history"""
        return await self.appointment_repo.get_appointment_history(
            user_id, status, skip, limit
        )
    
    async def reschedule_appointment(
        self,
        user_id: uuid.UUID,
        appointment_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> Appointment:
        """Reschedule appointment"""
        appointment = await self.get_appointment(user_id, appointment_id)
        
        if not appointment.can_cancel():
            raise HTTPException(
                status_code=400,
                detail="Appointment can only be rescheduled 24 hours before"
            )
        
        # Check new slot availability
        is_available = await self.appointment_repo.check_slot_availability(
            appointment.doctor_id,
            data['appointment_date'],
            data['start_time']
        )
        
        if not is_available:
            raise HTTPException(
                status_code=400,
                detail="New appointment slot is not available"
            )
        
        appointment.appointment_date = data['appointment_date']
        appointment.start_time = data['start_time']
        appointment.status = 'rescheduled'
        
        await self.session.commit()
        return appointment
    
    async def cancel_appointment(
        self,
        user_id: uuid.UUID,
        appointment_id: uuid.UUID,
        reason: str
    ) -> Appointment:
        """Cancel appointment"""
        appointment = await self.get_appointment(user_id, appointment_id)
        
        if not appointment.can_cancel():
            raise HTTPException(
                status_code=400,
                detail="Appointment can only be cancelled 24 hours before"
            )
        
        appointment.status = 'cancelled'
        appointment.cancelled_at = datetime.utcnow()
        appointment.cancellation_reason = reason
        
        await self.session.commit()
        return appointment
    
    async def create_prescription(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> Prescription:
        """Create prescription for appointment"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        if str(appointment.doctor_id) != str(doctor_id):
            raise HTTPException(status_code=403, detail="Only the doctor can create prescriptions")
        
        # Check if prescription already exists
        existing = await self.appointment_repo.get_prescription(appointment_id)
        if existing:
            raise HTTPException(status_code=400, detail="Prescription already exists")
        
        prescription = Prescription(
            appointment_id=appointment_id,
            patient_id=appointment.patient_id,
            doctor_id=doctor_id,
            diagnosis=data['diagnosis'],
            notes=data.get('notes'),
            valid_until=data.get('valid_until'),
            is_digital_signature=data.get('is_digital_signature', False)
        )
        
        self.session.add(prescription)
        await self.session.commit()
        await self.session.refresh(prescription)
        
        return prescription
    
    async def add_prescription_medicine(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> PrescriptionMedicine:
        """Add medicine to prescription"""
        prescription = await self.appointment_repo.get_prescription(appointment_id)
        
        if not prescription:
            raise HTTPException(status_code=404, detail="Prescription not found")
        
        if str(prescription.doctor_id) != str(doctor_id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        medicine = PrescriptionMedicine(
            prescription_id=prescription.id,
            **data
        )
        
        self.session.add(medicine)
        await self.session.commit()
        return medicine
    
    async def add_prescription_test(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> PrescribedTest:
        """Add test to prescription"""
        prescription = await self.appointment_repo.get_prescription(appointment_id)
        
        if not prescription:
            raise HTTPException(status_code=404, detail="Prescription not found")
        
        if str(prescription.doctor_id) != str(doctor_id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        test = PrescribedTest(
            prescription_id=prescription.id,
            **data
        )
        
        self.session.add(test)
        await self.session.commit()
        return test
    
    async def add_note(
        self,
        user_id: uuid.UUID,
        appointment_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> Appointment:
        """Add note to appointment"""
        appointment = await self.get_appointment(user_id, appointment_id)
        
        appointment.notes = data['notes']
        await self.session.commit()
        
        return appointment
    
    async def setup_video_consultation(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> Appointment:
        """Setup video consultation"""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        if str(appointment.doctor_id) != str(doctor_id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        appointment.meeting_link = data.get('meeting_link')
        appointment.meeting_id = data.get('meeting_id')
        appointment.meeting_password = data.get('meeting_password')
        appointment.consultation_type = 'video'
        
        await self.session.commit()
        return appointment
    
    async def view_prescription(
        self, user_id: uuid.UUID, appointment_id: uuid.UUID
    ) -> Dict:
        """View prescription details"""
        appointment = await self.get_appointment(user_id, appointment_id)
        prescription = await self.appointment_repo.get_prescription(appointment_id)
        
        if not prescription:
            raise HTTPException(status_code=404, detail="No prescription found")
        
        return {
            "prescription_id": str(prescription.id),
            "diagnosis": prescription.diagnosis,
            "notes": prescription.notes,
            "medicines": [
                {
                    "id": str(m.id),
                    "dosage": m.dosage,
                    "frequency": m.frequency,
                    "duration_days": m.duration_days,
                    "instructions": m.instructions
                }
                for m in prescription.medicines
            ],
            "tests": [
                {
                    "id": str(t.id),
                    "test_name": t.test_name,
                    "is_urgent": t.is_urgent
                }
                for t in prescription.tests
            ]
        }
    
    async def get_available_slots(
        self, doctor_id: uuid.UUID, date_str: str
    ) -> List[Dict]:
        """Get available appointment slots for doctor on a date"""
        appointment_date = date.fromisoformat(date_str)
        day_of_week = appointment_date.strftime("%A").lower()
        
        # Get doctor's schedule for the day
        schedules = await self.doctor_repo.get_doctor_schedules(doctor_id)
        
        available_slots = []
        for schedule in schedules:
            if schedule.day_of_week.value == day_of_week and schedule.is_available:
                current_time = schedule.start_time
                
                while current_time < schedule.end_time:
                    slot_end = (
                        datetime.combine(date.today(), current_time) +
                        timedelta(minutes=schedule.slot_duration_minutes)
                    ).time()
                    
                    # Check if slot is available
                    is_available = await self.appointment_repo.check_slot_availability(
                        doctor_id,
                        appointment_date,
                        current_time
                    )
                    
                    if is_available:
                        available_slots.append({
                            "start_time": current_time.isoformat(),
                            "end_time": slot_end.isoformat(),
                            "consultation_type": schedule.consultation_type.value
                        })
                    
                    current_time = slot_end
        
        return available_slots
    
    async def get_doctor_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get doctor's appointment dashboard"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        today_appointments = await self.appointment_repo.get_today_appointments(doctor.id)
        stats = await self.appointment_repo.get_appointment_statistics(doctor.id)
        
        return {
            "today_appointments": [
                {
                    "id": str(app.id),
                    "time": app.start_time.isoformat(),
                    "status": app.status.value,
                    "patient_id": str(app.patient_id)
                }
                for app in today_appointments
            ],
            "statistics": stats
        }