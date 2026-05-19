"""
Oxygen network service with stock tracking and emergency requests
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.repositories.hospital_repository import HospitalRepository
from app.models.oxygen import OxygenStock, OxygenRequest, OxygenSupplier
from app.models.hospital import HospitalProfile
import uuid
import logging

logger = logging.getLogger(__name__)

class OxygenService:
    """Oxygen network management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.hospital_repo = HospitalRepository(session)
    
    async def create_stock(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> OxygenStock:
        """Create oxygen stock record"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        # Check existing
        query = select(OxygenStock).where(
            OxygenStock.hospital_id == hospital.id
        )
        result = await self.session.execute(query)
        existing = result.scalar_one_or_none()
        
        if existing:
            raise HTTPException(status_code=400, detail="Stock record already exists")
        
        stock = OxygenStock(hospital_id=hospital.id, **data)
        self.session.add(stock)
        await self.session.commit()
        return stock
    
    async def update_stock(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> OxygenStock:
        """Update oxygen stock"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        query = select(OxygenStock).where(
            OxygenStock.hospital_id == hospital.id
        )
        result = await self.session.execute(query)
        stock = result.scalar_one_or_none()
        
        if not stock:
            raise HTTPException(status_code=404, detail="Stock record not found")
        
        for key, value in data.items():
            if hasattr(stock, key) and value is not None:
                setattr(stock, key, value)
        
        # Update critical status
        stock.is_critical_low = stock.available_liters <= stock.emergency_reserve_liters
        
        await self.session.commit()
        return stock
    
    async def get_stock(self, hospital_id: uuid.UUID) -> Dict:
        """Get oxygen stock for hospital"""
        query = select(OxygenStock).where(
            OxygenStock.hospital_id == hospital_id
        )
        result = await self.session.execute(query)
        stock = result.scalar_one_or_none()
        
        if not stock:
            return {"available": False}
        
        return {
            "available": True,
            "total_capacity_liters": stock.total_capacity_liters,
            "available_liters": stock.available_liters,
            "available_percentage": stock.available_percentage,
            "total_cylinders": stock.total_cylinders,
            "available_cylinders": stock.available_cylinders,
            "is_critical_low": stock.is_critical_low
        }
    
    async def check_availability(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        emergency_only: bool = False
    ) -> List[Dict]:
        """Check oxygen availability nearby"""
        hospitals = await self.hospital_repo.get_nearby_hospitals(
            latitude, longitude, radius_km, emergency_only
        )
        
        availability = []
        for hospital, distance in hospitals:
            stock = await self.get_stock(hospital.id)
            availability.append({
                "hospital_id": str(hospital.id),
                "name": hospital.name,
                "distance_km": round(distance, 2),
                "oxygen_stock": stock
            })
        
        return availability
    
    async def create_request(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> OxygenRequest:
        """Request oxygen supply"""
        request = OxygenRequest(requester_id=user_id, **data)
        self.session.add(request)
        await self.session.commit()
        return request
    
    async def get_request(
        self, user_id: uuid.UUID, request_id: uuid.UUID
    ) -> OxygenRequest:
        """Get oxygen request details"""
        request = await self.session.get(OxygenRequest, request_id)
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
        
        if request.requester_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return request
    
    async def get_user_requests(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[OxygenRequest]:
        """Get user's oxygen requests"""
        conditions = [OxygenRequest.requester_id == user_id]
        
        if status:
            conditions.append(OxygenRequest.status == status)
        
        query = (
            select(OxygenRequest)
            .where(and_(*conditions))
            .order_by(OxygenRequest.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def fulfill_request(
        self, user_id: uuid.UUID, request_id: uuid.UUID
    ) -> OxygenRequest:
        """Fulfill oxygen request"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=403, detail="Access denied")
        
        request = await self.session.get(OxygenRequest, request_id)
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
        
        # Check stock
        stock = await self.get_stock(hospital.id)
        if not stock.get('available') or stock['available_liters'] < request.quantity_liters:
            raise HTTPException(status_code=400, detail="Insufficient oxygen stock")
        
        # Update stock
        query = select(OxygenStock).where(
            OxygenStock.hospital_id == hospital.id
        )
        result = await self.session.execute(query)
        oxygen_stock = result.scalar_one()
        
        oxygen_stock.available_liters -= request.quantity_liters
        oxygen_stock.is_critical_low = oxygen_stock.available_liters <= oxygen_stock.emergency_reserve_liters
        
        # Update request
        request.status = 'fulfilled'
        request.fulfilled_by = hospital.id
        request.fulfilled_at = datetime.utcnow()
        
        await self.session.commit()
        return request
    
    async def add_supplier(self, data: Dict[str, Any]) -> OxygenSupplier:
        """Add oxygen supplier"""
        supplier = OxygenSupplier(**data)
        self.session.add(supplier)
        await self.session.commit()
        return supplier
    
    async def get_suppliers(
        self, skip: int = 0, limit: int = 20
    ) -> List[OxygenSupplier]:
        """Get oxygen suppliers"""
        query = select(OxygenSupplier).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_nearby_suppliers(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict]:
        """Get nearby oxygen suppliers"""
        distance_query = (
            6371 * func.acos(
                func.cos(func.radians(latitude)) *
                func.cos(func.radians(OxygenSupplier.latitude)) *
                func.cos(func.radians(OxygenSupplier.longitude) - func.radians(longitude)) +
                func.sin(func.radians(latitude)) *
                func.sin(func.radians(OxygenSupplier.latitude))
            )
        )
        
        query = (
            select(OxygenSupplier, distance_query.label("distance"))
            .having(distance_query <= radius_km)
            .order_by("distance")
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(query)
        
        suppliers = []
        for supplier, distance in result:
            suppliers.append({
                "supplier_id": str(supplier.id),
                "name": supplier.name,
                "distance_km": round(distance, 2),
                "price_per_liter": supplier.price_per_liter,
                "delivery_available": supplier.delivery_available,
                "contact": supplier.phone
            })
        
        return suppliers
    
    async def get_alerts(self) -> List[Dict]:
        """Get critical oxygen alerts"""
        query = select(OxygenStock, HospitalProfile).join(HospitalProfile).where(
            OxygenStock.is_critical_low == True
        )
        result = await self.session.execute(query)
        
        alerts = []
        for stock, hospital in result:
            alerts.append({
                "hospital_id": str(hospital.id),
                "hospital_name": hospital.name,
                "available_liters": stock.available_liters,
                "emergency_reserve": stock.emergency_reserve_liters,
                "city": hospital.city
            })
        
        return alerts
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get oxygen dashboard"""
        hospital = await self.hospital_repo.get_by_admin_user_id(user_id)
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        stock = await self.get_stock(hospital.id)
        
        return {
            "oxygen_stock": stock,
            "hospital_name": hospital.name
        }
    
    async def update_cylinder_tracking(
        self,
        cylinder_id: str,
        latitude: float,
        longitude: float,
        status: str
    ) -> Dict:
        """Update cylinder tracking location"""
        # This would track individual cylinders with GPS
        return {
            "cylinder_id": cylinder_id,
            "latitude": latitude,
            "longitude": longitude,
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }
    
    async def get_cylinder_tracking(self, cylinder_id: str) -> Dict:
        """Get cylinder tracking info"""
        return {
            "cylinder_id": cylinder_id,
            "status": "unknown"
        }