"""
Hospital repository with specialized queries
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from app.models.hospital import HospitalProfile, HospitalDepartment, BloodStock
from app.models.doctor import DoctorHospitalAffiliation
from app.repositories.base import BaseRepository
import uuid

class HospitalRepository(BaseRepository[HospitalProfile]):
    """Hospital-specific repository"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(HospitalProfile, session)
    
    async def get_by_admin_user_id(self, user_id: uuid.UUID) -> Optional[HospitalProfile]:
        """Get hospital by admin user ID"""
        query = select(HospitalProfile).where(
            HospitalProfile.admin_user_id == user_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def search_hospitals(
        self,
        filters: Dict[str, Any],
        skip: int = 0,
        limit: int = 20
    ) -> List[HospitalProfile]:
        """Search hospitals with filters"""
        conditions = [HospitalProfile.is_verified == True]
        
        if filters.get("city"):
            conditions.append(HospitalProfile.city.ilike(f"%{filters['city']}%"))
        
        if filters.get("emergency_services"):
            conditions.append(
                HospitalProfile.emergency_services_available == True
            )
        
        if filters.get("has_icu_beds"):
            conditions.append(HospitalProfile.available_icu_beds > 0)
        
        if filters.get("has_blood_bank"):
            conditions.append(HospitalProfile.has_blood_bank == True)
        
        query = (
            select(HospitalProfile)
            .where(and_(*conditions))
            .order_by(HospitalProfile.average_rating.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_nearby_hospitals(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 20,
        emergency_only: bool = False
    ) -> List[tuple]:
        """Get nearby hospitals"""
        conditions = [
            HospitalProfile.is_verified == True,
            HospitalProfile.is_operational == True
        ]
        
        if emergency_only:
            conditions.append(
                HospitalProfile.emergency_services_available == True
            )
        
        distance_query = (
            6371 * func.acos(
                func.cos(func.radians(latitude)) *
                func.cos(func.radians(HospitalProfile.latitude)) *
                func.cos(func.radians(HospitalProfile.longitude) - func.radians(longitude)) +
                func.sin(func.radians(latitude)) *
                func.sin(func.radians(HospitalProfile.latitude))
            )
        )
        
        query = (
            select(HospitalProfile, distance_query.label("distance"))
            .where(and_(*conditions))
            .having(distance_query <= radius_km)
            .order_by("distance")
        )
        
        result = await self.session.execute(query)
        return result.all()
    
    async def get_icu_network(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 50
    ) -> List[Dict]:
        """Get ICU bed network"""
        conditions = [
            HospitalProfile.is_verified == True,
            HospitalProfile.is_operational == True,
            HospitalProfile.available_icu_beds > 0
        ]
        
        distance_query = (
            6371 * func.acos(
                func.cos(func.radians(latitude)) *
                func.cos(func.radians(HospitalProfile.latitude)) *
                func.cos(func.radians(HospitalProfile.longitude) - func.radians(longitude)) +
                func.sin(func.radians(latitude)) *
                func.sin(func.radians(HospitalProfile.latitude))
            )
        )
        
        query = (
            select(
                HospitalProfile,
                distance_query.label("distance")
            )
            .where(and_(*conditions))
            .having(distance_query <= radius_km)
            .order_by("distance")
        )
        
        result = await self.session.execute(query)
        
        icu_network = []
        for hospital, distance in result:
            icu_network.append({
                "hospital_id": str(hospital.id),
                "name": hospital.name,
                "available_icu_beds": hospital.available_icu_beds,
                "total_icu_beds": hospital.total_icu_beds,
                "available_ventilators": hospital.available_ventilators,
                "distance_km": round(distance, 2),
                "estimated_time_min": round(distance / 50 * 60, 0),  # Assuming 50km/h
                "latitude": hospital.latitude,
                "longitude": hospital.longitude,
                "phone": hospital.phone,
                "emergency_phone": hospital.emergency_phone
            })
        
        return icu_network
    
    async def get_departments(
        self, hospital_id: uuid.UUID
    ) -> List[HospitalDepartment]:
        """Get hospital departments"""
        query = select(HospitalDepartment).where(
            HospitalDepartment.hospital_id == hospital_id
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_blood_stock(
        self,
        hospital_id: uuid.UUID,
        blood_group: Optional[str] = None
    ) -> List[BloodStock]:
        """Get hospital blood stock"""
        conditions = [BloodStock.hospital_id == hospital_id]
        
        if blood_group:
            conditions.append(BloodStock.blood_group == blood_group)
        
        query = select(BloodStock).where(and_(*conditions))
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_hospital_statistics(self, hospital_id: uuid.UUID) -> Dict:
        """Get hospital statistics"""
        from app.models.appointment import Appointment
        
        total_doctors = await self.session.scalar(
            select(func.count()).where(
                DoctorHospitalAffiliation.hospital_id == hospital_id,
                DoctorHospitalAffiliation.is_active == True
            )
        )
        
        total_departments = await self.session.scalar(
            select(func.count()).where(
                HospitalDepartment.hospital_id == hospital_id
            )
        )
        
        hospital = await self.get(hospital_id)
        
        return {
            "total_doctors": total_doctors or 0,
            "total_departments": total_departments or 0,
            "total_beds": hospital.total_beds if hospital else 0,
            "available_beds": hospital.available_beds if hospital else 0,
            "icu_beds_available": hospital.available_icu_beds if hospital else 0,
            "ventilators_available": hospital.available_ventilators if hospital else 0
        }