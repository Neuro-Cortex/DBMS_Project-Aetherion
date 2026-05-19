"""
Doctor repository with specialized queries
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, case
from app.models.doctor import DoctorProfile, DoctorSchedule, DoctorHospitalAffiliation
from app.models.user import User
from app.repositories.base import BaseRepository
import uuid

class DoctorRepository(BaseRepository[DoctorProfile]):
    """Doctor-specific repository"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(DoctorProfile, session)
    
    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[DoctorProfile]:
        """Get doctor profile by user ID"""
        query = select(DoctorProfile).where(
            DoctorProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_license(self, license_number: str) -> Optional[DoctorProfile]:
        """Get doctor by license number"""
        query = select(DoctorProfile).where(
            DoctorProfile.license_number == license_number
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def search_doctors(
        self,
        filters: Dict[str, Any],
        skip: int = 0,
        limit: int = 20
    ) -> List[DoctorProfile]:
        """Search doctors with filters"""
        conditions = [DoctorProfile.is_verified == True]
        
        if filters.get("specialization"):
            conditions.append(
                DoctorProfile.specialization.ilike(f"%{filters['specialization']}%")
            )
        
        if filters.get("min_experience"):
            conditions.append(
                DoctorProfile.experience_years >= filters["min_experience"]
            )
        
        if filters.get("max_fee"):
            conditions.append(
                DoctorProfile.consultation_fee <= filters["max_fee"]
            )
        
        if filters.get("min_rating"):
            conditions.append(
                DoctorProfile.average_rating >= filters["min_rating"]
            )
        
        if filters.get("available_today"):
            conditions.append(DoctorProfile.is_available == True)
        
        query = (
            select(DoctorProfile)
            .where(and_(*conditions))
            .order_by(DoctorProfile.average_rating.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def search_nearby_doctors(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        filters: Dict[str, Any],
        skip: int = 0,
        limit: int = 20
    ) -> List[tuple]:
        """Search doctors by location"""
        conditions = [DoctorProfile.is_verified == True]
        
        if filters.get("specialization"):
            conditions.append(
                DoctorProfile.specialization.ilike(f"%{filters['specialization']}%")
            )
        
        # Join with user for location
        distance_query = (
            6371 * func.acos(
                func.cos(func.radians(latitude)) *
                func.cos(func.radians(User.latitude)) *
                func.cos(func.radians(User.longitude) - func.radians(longitude)) +
                func.sin(func.radians(latitude)) *
                func.sin(func.radians(User.latitude))
            )
        )
        
        query = (
            select(DoctorProfile, distance_query.label("distance"))
            .join(User, DoctorProfile.user_id == User.id)
            .where(and_(*conditions))
            .having(distance_query <= radius_km)
            .order_by("distance")
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(query)
        return result.all()
    
    async def get_rankings(
        self,
        specialization: Optional[str] = None,
        limit: int = 10
    ) -> List[DoctorProfile]:
        """Get doctor rankings"""
        conditions = [DoctorProfile.is_verified == True]
        
        if specialization:
            conditions.append(
                DoctorProfile.specialization == specialization
            )
        
        query = (
            select(DoctorProfile)
            .where(and_(*conditions))
            .order_by(
                DoctorProfile.average_rating.desc(),
                DoctorProfile.total_consultations.desc()
            )
            .limit(limit)
        )
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_doctor_schedules(
        self, doctor_id: uuid.UUID
    ) -> List[DoctorSchedule]:
        """Get doctor schedules"""
        query = select(DoctorSchedule).where(
            DoctorSchedule.doctor_id == doctor_id,
            DoctorSchedule.is_available == True
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_doctor_hospitals(
        self, doctor_id: uuid.UUID
    ) -> List[DoctorHospitalAffiliation]:
        """Get doctor hospital affiliations"""
        query = select(DoctorHospitalAffiliation).where(
            DoctorHospitalAffiliation.doctor_id == doctor_id,
            DoctorHospitalAffiliation.is_active == True
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_doctor_statistics(self, doctor_id: uuid.UUID) -> Dict:
        """Get doctor statistics"""
        from app.models.appointment import Appointment
        
        total_patients_query = select(func.count(func.distinct(Appointment.patient_id))).where(
            Appointment.doctor_id == doctor_id
        )
        result = await self.session.execute(total_patients_query)
        total_patients = result.scalar()
        
        total_appointments_query = select(func.count()).where(
            Appointment.doctor_id == doctor_id
        )
        result = await self.session.execute(total_appointments_query)
        total_appointments = result.scalar()
        
        today_appointments_query = select(func.count()).where(
            Appointment.doctor_id == doctor_id,
            func.date(Appointment.appointment_date) == func.current_date()
        )
        result = await self.session.execute(today_appointments_query)
        today_appointments = result.scalar()
        
        return {
            "total_patients": total_patients or 0,
            "total_appointments": total_appointments or 0,
            "today_appointments": today_appointments or 0
        }