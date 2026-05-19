"""
Patient service with health records management
"""
from typing import Optional, List, Dict, Any
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.patient_repository import PatientRepository
from app.repositories.user_repository import UserRepository
from app.models.patient import (
    PatientProfile, PatientVitals, MedicalRecord,
    VaccinationRecord
)
from app.models.blood_donor import BloodDonation
from app.integrations.cloudinary import cloudinary_client
import uuid
import logging

logger = logging.getLogger(__name__)

class PatientService:
    """Patient management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.patient_repo = PatientRepository(session)
        self.user_repo = UserRepository(session)
    
    async def create_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PatientProfile:
        """Create patient profile"""
        existing = await self.patient_repo.get_by_user_id(user_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Patient profile already exists"
            )
        
        patient = PatientProfile(user_id=user_id, **data)
        
        # Calculate BMI
        if data.get('height_cm') and data.get('weight_kg'):
            patient.bmi = patient.calculate_bmi()
        
        self.session.add(patient)
        await self.session.commit()
        return patient
    
    async def get_profile(self, user_id: uuid.UUID) -> Dict:
        """Get patient profile"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        user = await self.user_repo.get_by_id(patient.user_id)
        
        return {
            **patient.__dict__,
            "user": user.to_dict() if user else None
        }
    
    async def update_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PatientProfile:
        """Update patient profile"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        for key, value in data.items():
            if hasattr(patient, key) and value is not None:
                setattr(patient, key, value)
        
        # Recalculate BMI
        if patient.height_cm and patient.weight_kg:
            patient.bmi = patient.calculate_bmi()
        
        await self.session.commit()
        return patient
    
    async def record_vitals(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PatientVitals:
        """Record patient vitals"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        vitals = PatientVitals(
            patient_id=patient.id,
            recorded_by=user_id,
            **data
        )
        
        self.session.add(vitals)
        await self.session.commit()
        return vitals
    
    async def get_vitals(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 50
    ) -> List[PatientVitals]:
        """Get vitals history"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        return await self.patient_repo.get_vitals(patient.id, skip, limit)
    
    async def add_vaccination(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> VaccinationRecord:
        """Add vaccination record"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        vaccination = VaccinationRecord(
            patient_id=patient.id,
            **data
        )
        
        self.session.add(vaccination)
        await self.session.commit()
        return vaccination
    
    async def get_vaccinations(
        self, user_id: uuid.UUID
    ) -> List[VaccinationRecord]:
        """Get vaccination records"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        return await self.patient_repo.get_vaccinations(patient.id)
    
    async def add_medical_record(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> MedicalRecord:
        """Add medical record"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        record = MedicalRecord(
            patient_id=patient.id,
            **data
        )
        
        self.session.add(record)
        await self.session.commit()
        return record
    
    async def get_medical_records(
        self,
        user_id: uuid.UUID,
        record_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[MedicalRecord]:
        """Get medical records"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        return await self.patient_repo.get_medical_records(
            patient.id, record_type, skip, limit
        )
    
    async def upload_record_file(
        self,
        user_id: uuid.UUID,
        record_id: uuid.UUID,
        file: UploadFile
    ) -> MedicalRecord:
        """Upload medical record file"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        from sqlalchemy import select
        
        query = select(MedicalRecord).where(
            and_(
                MedicalRecord.id == record_id,
                MedicalRecord.patient_id == patient.id
            )
        )
        result = await self.session.execute(query)
        record = result.scalar_one_or_none()
        
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        
        # Upload to Cloudinary
        upload_result = await cloudinary_client.upload_file(
            file,
            folder=f"medical_records/{user_id}"
        )
        
        record.file_url = upload_result['secure_url']
        record.file_type = file.content_type
        record.file_size = file.size
        
        await self.session.commit()
        return record
    
    async def get_health_timeline(
        self,
        user_id: uuid.UUID,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> List[Dict]:
        """Get health timeline"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        return await self.patient_repo.get_health_timeline(
            patient.id, start_date, end_date
        )
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get patient dashboard"""
        patient = await self.patient_repo.get_by_user_id(user_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        from app.repositories.appointment_repository import AppointmentRepository
        app_repo = AppointmentRepository(self.session)
        
        # Get upcoming appointments
        upcoming = await app_repo.get_upcoming_appointments(patient.id, limit=5)
        
        # Get recent vitals
        vitals = await self.patient_repo.get_vitals(patient.id, limit=5)
        
        # Get statistics
        stats = await self.patient_repo.get_patient_statistics(patient.id)
        
        return {
            "profile": {
                "bmi": patient.bmi,
                "blood_group": (await self.user_repo.get_by_id(user_id)).blood_group.value if (await self.user_repo.get_by_id(user_id)).blood_group else None
            },
            "upcoming_appointments": [
                {
                    "id": str(app.id),
                    "date": app.appointment_date.isoformat(),
                    "time": app.start_time.isoformat(),
                    "doctor_id": str(app.doctor_id),
                    "status": app.status.value
                }
                for app in upcoming
            ],
            "recent_vitals": [
                {
                    "id": str(v.id),
                    "heart_rate": v.heart_rate,
                    "blood_pressure": f"{v.blood_pressure_systolic}/{v.blood_pressure_diastolic}" if v.blood_pressure_systolic else None,
                    "recorded_at": v.created_at.isoformat()
                }
                for v in vitals
            ],
            "statistics": stats
        }
    
    async def get_donation_history(
        self, user_id: uuid.UUID
    ) -> List[Dict]:
        """Get blood donation history"""
        from sqlalchemy import select
        
        query = (
            select(BloodDonation)
            .where(BloodDonation.donor_id == user_id)
            .order_by(BloodDonation.donation_date.desc())
        )
        result = await self.session.execute(query)
        donations = result.scalars().all()
        
        return [
            {
                "id": str(d.id),
                "date": d.donation_date.isoformat(),
                "blood_group": d.blood_group.value,
                "volume_ml": d.volume_ml,
                "center": d.donation_center
            }
            for d in donations
        ]
    
    async def get_medicine_history(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Dict]:
        """Get medicine history from prescriptions"""
        from app.models.appointment import Prescription, PrescriptionMedicine
        from app.models.pharmacy import Medicine
        
        query = (
            select(PrescriptionMedicine, Prescription, Medicine)
            .join(Prescription)
            .join(Medicine)
            .where(Prescription.patient_id == user_id)
            .order_by(Prescription.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        
        medicines = []
        for pm, p, m in result:
            medicines.append({
                "medicine_id": str(m.id),
                "medicine_name": m.name,
                "dosage": pm.dosage,
                "frequency": pm.frequency,
                "duration_days": pm.duration_days,
                "prescribed_date": p.created_at.isoformat(),
                "prescription_id": str(p.id)
            })
        
        return medicines
    
    async def get_connected_doctors(self, user_id: uuid.UUID) -> List[Dict]:
        """Get connected doctors (doctors the patient has visited)"""
        from app.models.appointment import Appointment
        from app.models.doctor import DoctorProfile
        
        query = (
            select(func.distinct(Appointment.doctor_id))
            .where(Appointment.patient_id == user_id)
        )
        result = await self.session.execute(query)
        doctor_ids = result.scalars().all()
        
        doctors = []
        for did in doctor_ids:
            doctor = await self.session.get(DoctorProfile, did)
            if doctor:
                user = await self.user_repo.get_by_id(doctor.user_id)
                doctors.append({
                    "doctor_id": str(doctor.id),
                    "name": user.full_name if user else "Unknown",
                    "specialization": doctor.specialization,
                    "average_rating": doctor.average_rating
                })
        
        return doctors
    
    async def get_connected_hospitals(self, user_id: uuid.UUID) -> List[Dict]:
        """Get connected hospitals"""
        from app.models.appointment import Appointment
        from app.models.hospital import HospitalProfile
        
        query = (
            select(func.distinct(Appointment.hospital_id))
            .where(
                and_(
                    Appointment.patient_id == user_id,
                    Appointment.hospital_id.isnot(None)
                )
            )
        )
        result = await self.session.execute(query)
        hospital_ids = result.scalars().all()
        
        hospitals = []
        for hid in hospital_ids:
            hospital = await self.session.get(HospitalProfile, hid)
            if hospital:
                hospitals.append({
                    "hospital_id": str(hospital.id),
                    "name": hospital.name,
                    "city": hospital.city,
                    "average_rating": hospital.average_rating
                })
        
        return hospitals