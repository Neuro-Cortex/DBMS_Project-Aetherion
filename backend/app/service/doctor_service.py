"""
Doctor service with profile management and scheduling
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.doctor_repository import DoctorRepository
from app.repositories.user_repository import UserRepository
from app.models.doctor import (
    DoctorProfile, DoctorSchedule, ScheduleException,
    DoctorHospitalAffiliation
)
from app.models.user import UserRole
import uuid
import logging

logger = logging.getLogger(__name__)

class DoctorService:
    """Doctor management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.doctor_repo = DoctorRepository(session)
        self.user_repo = UserRepository(session)
    
    async def create_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> DoctorProfile:
        """Create doctor profile"""
        # Check existing profile
        existing = await self.doctor_repo.get_by_user_id(user_id)
        if existing:
            raise HTTPException(status_code=400, detail="Doctor profile already exists")
        
        # Check license uniqueness
        license_check = await self.doctor_repo.get_by_license(data['license_number'])
        if license_check:
            raise HTTPException(status_code=400, detail="License number already registered")
        
        doctor = DoctorProfile(
            user_id=user_id,
            **data
        )
        
        self.session.add(doctor)
        
        # Add doctor role to user
        user = await self.user_repo.get_by_id(user_id)
        if user and UserRole.DOCTOR not in user.roles:
            user.add_role(UserRole.DOCTOR)
        
        await self.session.commit()
        return doctor
    
    async def get_profile(self, doctor_id: uuid.UUID) -> Dict:
        """Get doctor profile with related data"""
        doctor = await self.doctor_repo.get_by_id(doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        # Get user info
        user = await self.user_repo.get_by_id(doctor.user_id)
        
        # Get schedules
        schedules = await self.doctor_repo.get_doctor_schedules(doctor_id)
        
        # Get hospital affiliations
        hospitals = await self.doctor_repo.get_doctor_hospitals(doctor_id)
        
        # Get statistics
        stats = await self.doctor_repo.get_doctor_statistics(doctor_id)
        
        return {
            **doctor.to_dict(),
            "user": user.to_dict() if user else None,
            "schedules": [
                {
                    "id": str(s.id),
                    "day": s.day_of_week.value,
                    "start_time": s.start_time.isoformat(),
                    "end_time": s.end_time.isoformat(),
                    "slot_duration": s.slot_duration_minutes,
                    "consultation_type": s.consultation_type.value
                }
                for s in schedules
            ],
            "hospitals": [
                {
                    "hospital_id": str(h.hospital_id),
                    "department": h.department,
                    "position": h.position
                }
                for h in hospitals
            ],
            "statistics": stats
        }
    
    async def update_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> DoctorProfile:
        """Update doctor profile"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        for key, value in data.items():
            if hasattr(doctor, key) and value is not None:
                setattr(doctor, key, value)
        
        await self.session.commit()
        return doctor
    
    async def search_doctors(
        self, filters: Dict, skip: int = 0, limit: int = 20
    ) -> List[Dict]:
        """Search doctors"""
        doctors = await self.doctor_repo.search_doctors(filters, skip, limit)
        
        return [
            {
                **doctor.to_dict(),
                "user": (await self.user_repo.get_by_id(doctor.user_id)).to_dict()
            }
            for doctor in doctors
        ]
    
    async def search_nearby_doctors(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        filters: Dict,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict]:
        """Search nearby doctors"""
        results = await self.doctor_repo.search_nearby_doctors(
            latitude, longitude, radius_km, filters, skip, limit
        )
        
        doctors = []
        for doctor, distance in results:
            user = await self.user_repo.get_by_id(doctor.user_id)
            doctors.append({
                **doctor.to_dict(),
                "distance_km": round(distance, 2),
                "user": user.to_dict() if user else None
            })
        
        return doctors
    
    async def add_schedule(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> DoctorSchedule:
        """Add doctor schedule"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        schedule = DoctorSchedule(
            doctor_id=doctor.id,
            **data
        )
        
        self.session.add(schedule)
        await self.session.commit()
        return schedule
    
    async def get_schedule(self, doctor_id: uuid.UUID) -> List[DoctorSchedule]:
        """Get doctor schedule"""
        return await self.doctor_repo.get_doctor_schedules(doctor_id)
    
    async def update_schedule(
        self,
        user_id: uuid.UUID,
        schedule_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> DoctorSchedule:
        """Update schedule"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        from sqlalchemy import select, update
        
        query = select(DoctorSchedule).where(
            and_(
                DoctorSchedule.id == schedule_id,
                DoctorSchedule.doctor_id == doctor.id
            )
        )
        result = await self.session.execute(query)
        schedule = result.scalar_one_or_none()
        
        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule not found")
        
        for key, value in data.items():
            if hasattr(schedule, key) and value is not None:
                setattr(schedule, key, value)
        
        await self.session.commit()
        return schedule
    
    async def delete_schedule(
        self, user_id: uuid.UUID, schedule_id: uuid.UUID
    ) -> bool:
        """Delete schedule"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        from sqlalchemy import delete
        
        query = delete(DoctorSchedule).where(
            and_(
                DoctorSchedule.id == schedule_id,
                DoctorSchedule.doctor_id == doctor.id
            )
        )
        result = await self.session.execute(query)
        await self.session.commit()
        
        return result.rowcount > 0
    
    async def add_schedule_exception(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> ScheduleException:
        """Add schedule exception"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        exception = ScheduleException(**data)
        self.session.add(exception)
        await self.session.commit()
        return exception
    
    async def add_hospital_affiliation(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> DoctorHospitalAffiliation:
        """Add hospital affiliation"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        affiliation = DoctorHospitalAffiliation(
            doctor_id=doctor.id,
            **data
        )
        
        self.session.add(affiliation)
        await self.session.commit()
        return affiliation
    
    async def get_patients(
        self, doctor_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Dict]:
        """Get doctor's patients"""
        from app.models.appointment import Appointment
        from app.models.patient import PatientProfile
        
        query = (
            select(func.distinct(Appointment.patient_id))
            .where(Appointment.doctor_id == doctor_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        patient_ids = result.scalars().all()
        
        patients = []
        for pid in patient_ids:
            patient = await self.session.get(PatientProfile, pid)
            if patient:
                user = await self.user_repo.get_by_id(patient.user_id)
                patients.append({
                    "patient_id": str(patient.id),
                    "user": user.to_dict() if user else None
                })
        
        return patients
    
    async def get_reviews(
        self, doctor_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Dict]:
        """Get doctor reviews"""
        from app.models.review import Review
        
        query = (
            select(Review)
            .where(
                and_(
                    Review.target_id == doctor_id,
                    Review.review_type == 'doctor'
                )
            )
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        reviews = result.scalars().all()
        
        return [
            {
                "id": str(r.id),
                "rating": r.rating,
                "title": r.title,
                "comment": r.comment,
                "is_anonymous": r.is_anonymous,
                "helpful_count": r.helpful_count,
                "created_at": r.created_at.isoformat()
            }
            for r in reviews
        ]
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get doctor dashboard"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        from app.repositories.appointment_repository import AppointmentRepository
        app_repo = AppointmentRepository(self.session)
        
        # Get today's appointments
        today_appointments = await app_repo.get_today_appointments(doctor.id)
        
        # Get statistics
        stats = await self.doctor_repo.get_doctor_statistics(doctor.id)
        
        # Get appointment stats
        app_stats = await app_repo.get_appointment_statistics(doctor.id)
        
        return {
            "profile": doctor.to_dict(),
            "today_appointments": [
                {
                    "id": str(app.id),
                    "time": app.start_time.isoformat(),
                    "status": app.status.value,
                    "patient_id": str(app.patient_id)
                }
                for app in today_appointments
            ],
            "statistics": {
                **stats,
                **app_stats
            }
        }
    
    async def toggle_online_status(
        self, user_id: uuid.UUID, is_online: bool
    ) -> DoctorProfile:
        """Toggle online status"""
        doctor = await self.doctor_repo.get_by_user_id(user_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        doctor.is_online = is_online
        await self.session.commit()
        return doctor
    
    async def get_rankings(
        self, specialization: Optional[str] = None, limit: int = 10
    ) -> List[Dict]:
        """Get doctor rankings"""
        doctors = await self.doctor_repo.get_rankings(specialization, limit)
        
        return [
            {
                "rank": i + 1,
                **doctor.to_dict(),
                "user": (await self.user_repo.get_by_id(doctor.user_id)).to_dict()
            }
            for i, doctor in enumerate(doctors)
        ]
    
    async def compare_doctors(self, doctor_ids: List[uuid.UUID]) -> List[Dict]:
        """Compare multiple doctors"""
        comparison = []
        
        for doctor_id in doctor_ids:
            doctor = await self.doctor_repo.get_by_id(doctor_id)
            if doctor:
                user = await self.user_repo.get_by_id(doctor.user_id)
                comparison.append({
                    **doctor.to_dict(),
                    "user": user.to_dict() if user else None
                })
        
        return comparison