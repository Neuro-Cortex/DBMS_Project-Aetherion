"""
Patient repository with specialized queries
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from app.models.patient import PatientProfile, PatientVitals, MedicalRecord, VaccinationRecord
from app.repositories.base import BaseRepository
import uuid

class PatientRepository(BaseRepository[PatientProfile]):
    """Patient-specific repository"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(PatientProfile, session)
    
    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[PatientProfile]:
        """Get patient profile by user ID"""
        query = select(PatientProfile).where(
            PatientProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_vitals(
        self, patient_id: uuid.UUID, skip: int = 0, limit: int = 50
    ) -> List[PatientVitals]:
        """Get patient vitals history"""
        query = (
            select(PatientVitals)
            .where(PatientVitals.patient_id == patient_id)
            .order_by(PatientVitals.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_vaccinations(
        self, patient_id: uuid.UUID
    ) -> List[VaccinationRecord]:
        """Get patient vaccination records"""
        query = (
            select(VaccinationRecord)
            .where(VaccinationRecord.patient_id == patient_id)
            .order_by(VaccinationRecord.administered_date.desc())
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_medical_records(
        self,
        patient_id: uuid.UUID,
        record_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[MedicalRecord]:
        """Get patient medical records"""
        conditions = [MedicalRecord.patient_id == patient_id]
        
        if record_type:
            conditions.append(MedicalRecord.record_type == record_type)
        
        query = (
            select(MedicalRecord)
            .where(and_(*conditions))
            .order_by(MedicalRecord.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_health_timeline(
        self,
        patient_id: uuid.UUID,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> List[Dict]:
        """Get patient health timeline"""
        # Combine appointments, vitals, vaccinations, medical records
        timeline = []
        
        # Get appointments
        from app.models.appointment import Appointment
        appointment_conditions = [Appointment.patient_id == patient_id]
        if start_date:
            appointment_conditions.append(
                Appointment.appointment_date >= start_date
            )
        if end_date:
            appointment_conditions.append(
                Appointment.appointment_date <= end_date
            )
        
        appointment_query = (
            select(Appointment)
            .where(and_(*appointment_conditions))
            .order_by(Appointment.appointment_date.desc())
        )
        result = await self.session.execute(appointment_query)
        appointments = result.scalars().all()
        
        for app in appointments:
            timeline.append({
                "type": "appointment",
                "date": app.appointment_date.isoformat(),
                "data": {
                    "id": str(app.id),
                    "doctor": str(app.doctor_id),
                    "status": app.status.value
                }
            })
        
        # Add vitals
        vitals = await self.get_vitals(patient_id)
        for vital in vitals:
            timeline.append({
                "type": "vitals",
                "date": vital.created_at.isoformat(),
                "data": {
                    "id": str(vital.id),
                    "heart_rate": vital.heart_rate,
                    "blood_pressure": f"{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}"
                }
            })
        
        # Sort by date
        timeline.sort(key=lambda x: x["date"], reverse=True)
        
        return timeline
    
    async def get_patient_statistics(self, patient_id: uuid.UUID) -> Dict:
        """Get patient statistics"""
        from app.models.appointment import Appointment
        from app.models.blood_donor import BloodDonation
        
        total_appointments = await self.session.scalar(
            select(func.count()).where(Appointment.patient_id == patient_id)
        )
        
        total_donations = await self.session.scalar(
            select(func.count()).where(BloodDonation.donor_id == patient_id)
        )
        
        return {
            "total_appointments": total_appointments or 0,
            "total_donations": total_donations or 0,
            "total_medical_records": len(await self.get_medical_records(patient_id))
        }