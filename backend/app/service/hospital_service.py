"""
Hospital service with bed management and ICU tracking
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.hospital_repository import HospitalRepository
from app.models.hospital import (
    HospitalProfile, HospitalDepartment, BloodStock
)
from app.models.oxygen import OxygenStock
from app.models.user import UserRole
import uuid
import logging

logger = logging.getLogger(__name__)

class HospitalService:
    """Hospital management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.hospital_repo = HospitalRepository(session)
    
    async def create_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> HospitalProfile:
        """Create hospital profile"""
        existing = await self.hospital_repo.get_by_admin_user_id(user_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Hospital profile already exists"
            )
        
        hospital = HospitalProfile(
            admin_user_id=user_id,
            available_beds=data.get('total_beds', 0),
            available_icu_beds=data.get('total_icu_beds', 0),
            available_ventilators=data.get('total_ventilators', 0),
            available_ambulances=data.get('ambulance_count', 0),
            **data
        )
        
        self.session.add(hospital)
        await self.session.commit()
        return hospital
    
    async def get_profile(self, hospital_id: uuid.UUID) -> Dict:
        """Get hospital profile"""
        hospital = await self.hospital_repo.get_by_id(hospital_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        return hospital.__dict__
    
    async def update_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> HospitalProfile:
        """Update hospital profile"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        for key, value in data.items():
            if hasattr(hospital, key) and value is not None:
                setattr(hospital, key, value)
        
        await self.session.commit()
        return hospital
    
    async def search_hospitals(
        self, filters: Dict, skip: int = 0, limit: int = 20
    ) -> List[HospitalProfile]:
        """Search hospitals"""
        return await self.hospital_repo.search_hospitals(filters, skip, limit)
    
    async def search_nearby_hospitals(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        filters: Dict,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict]:
        """Search nearby hospitals"""
        results = await self.hospital_repo.get_nearby_hospitals(
            latitude, longitude, radius_km
        )
        
        hospitals = []
        for hospital, distance in results:
            hospitals.append({
                "hospital_id": str(hospital.id),
                "name": hospital.name,
                "available_beds": hospital.available_beds,
                "available_icu_beds": hospital.available_icu_beds,
                "distance_km": round(distance, 2),
                "estimated_time_min": round(distance / 50 * 60, 0)
            })
        
        return hospitals[skip:skip+limit]
    
    async def get_icu_network(
        self, latitude: float, longitude: float, radius_km: float = 50
    ) -> List[Dict]:
        """Get ICU bed network"""
        return await self.hospital_repo.get_icu_network(
            latitude, longitude, radius_km
        )
    
    async def add_department(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> HospitalDepartment:
        """Add hospital department"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        department = HospitalDepartment(
            hospital_id=hospital.id,
            **data
        )
        
        self.session.add(department)
        await self.session.commit()
        return department
    
    async def get_departments(
        self, hospital_id: uuid.UUID
    ) -> List[HospitalDepartment]:
        """Get hospital departments"""
        return await self.hospital_repo.get_departments(hospital_id)
    
    async def update_bed_status(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> HospitalProfile:
        """Update bed availability"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        if 'available_beds' in data:
            if data['available_beds'] > hospital.total_beds:
                raise HTTPException(
                    status_code=400,
                    detail="Available beds cannot exceed total beds"
                )
            hospital.available_beds = data['available_beds']
        
        if 'available_icu_beds' in data:
            if data['available_icu_beds'] > hospital.total_icu_beds:
                raise HTTPException(
                    status_code=400,
                    detail="Available ICU beds cannot exceed total ICU beds"
                )
            hospital.available_icu_beds = data['available_icu_beds']
        
        await self.session.commit()
        return hospital
    
    async def update_blood_stock(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> BloodStock:
        """Update blood stock"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        # Check existing stock
        from sqlalchemy import select
        
        query = select(BloodStock).where(
            and_(
                BloodStock.hospital_id == hospital.id,
                BloodStock.blood_group == data['blood_group']
            )
        )
        result = await self.session.execute(query)
        stock = result.scalar_one_or_none()
        
        if stock:
            stock.quantity_units = data['quantity_units']
            if 'minimum_threshold' in data:
                stock.minimum_threshold = data['minimum_threshold']
        else:
            stock = BloodStock(
                hospital_id=hospital.id,
                **data
            )
            self.session.add(stock)
        
        await self.session.commit()
        return stock
    
    async def get_blood_stock(
        self, hospital_id: uuid.UUID, blood_group: Optional[str] = None
    ) -> List[BloodStock]:
        """Get blood stock"""
        return await self.hospital_repo.get_blood_stock(hospital_id, blood_group)
    
    async def update_oxygen_stock(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> OxygenStock:
        """Update oxygen stock"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        from sqlalchemy import select
        
        query = select(OxygenStock).where(
            OxygenStock.hospital_id == hospital.id
        )
        result = await self.session.execute(query)
        stock = result.scalar_one_or_none()
        
        if stock:
            for key, value in data.items():
                setattr(stock, key, value)
        else:
            stock = OxygenStock(
                hospital_id=hospital.id,
                **data
            )
            self.session.add(stock)
        
        await self.session.commit()
        return stock
    
    async def get_oxygen_stock(
        self, hospital_id: uuid.UUID
    ) -> Optional[OxygenStock]:
        """Get oxygen stock"""
        from sqlalchemy import select
        
        query = select(OxygenStock).where(
            OxygenStock.hospital_id == hospital_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def create_announcement(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> Dict:
        """Create emergency announcement"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        # Store announcement and broadcast via WebSocket
        announcement = {
            "hospital_id": str(hospital.id),
            "hospital_name": hospital.name,
            **data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Broadcast to realtime service
        from app.services.realtime_service import realtime_service
        await realtime_service.broadcast_hospital_update(
            str(hospital.id), announcement
        )
        
        return announcement
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get hospital dashboard"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        stats = await self.hospital_repo.get_hospital_statistics(hospital.id)
        
        return {
            "hospital": {
                "name": hospital.name,
                "available_beds": hospital.available_beds,
                "available_icu_beds": hospital.available_icu_beds,
                "available_ventilators": hospital.available_ventilators,
                "available_ambulances": hospital.available_ambulances
            },
            "statistics": stats
        }
    
    async def get_doctors(
        self, hospital_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Dict]:
        """Get hospital doctors"""
        from app.models.doctor import DoctorHospitalAffiliation, DoctorProfile
        
        query = (
            select(DoctorHospitalAffiliation, DoctorProfile)
            .join(DoctorProfile)
            .where(
                and_(
                    DoctorHospitalAffiliation.hospital_id == hospital_id,
                    DoctorHospitalAffiliation.is_active == True
                )
            )
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        
        doctors = []
        for aff, doc in result:
            doctors.append({
                "affiliation_id": str(aff.id),
                "doctor_id": str(doc.id),
                "department": aff.department,
                "position": aff.position,
                "specialization": doc.specialization
            })
        
        return doctors
    
    async def get_reviews(
        self, hospital_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[Dict]:
        """Get hospital reviews"""
        from app.models.review import Review
        
        query = (
            select(Review)
            .where(
                and_(
                    Review.target_id == hospital_id,
                    Review.review_type == 'hospital'
                )
            )
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        
        return [
            {
                "id": str(r.id),
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at.isoformat()
            }
            for r in result.scalars().all()
        ]
    
    async def get_analytics(
        self,
        user_id: uuid.UUID,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict:
        """Get hospital analytics"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        stats = await self.hospital_repo.get_hospital_statistics(hospital.id)
        
        return {
            "hospital_id": str(hospital.id),
            "statistics": stats,
            "period": {
                "start": start_date,
                "end": end_date
            }
        }