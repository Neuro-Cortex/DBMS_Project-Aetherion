"""
Pharmacy repository with specialized queries
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from app.models.pharmacy import PharmacyProfile, Medicine, PharmacyInventory, MedicineOrder
from app.repositories.base import BaseRepository
import uuid

class PharmacyRepository(BaseRepository[PharmacyProfile]):
    """Pharmacy-specific repository"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(PharmacyProfile, session)
    
    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[PharmacyProfile]:
        """Get pharmacy by user ID"""
        query = select(PharmacyProfile).where(
            PharmacyProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def search_pharmacies(
        self,
        city: Optional[str] = None,
        is_24x7: Optional[bool] = None,
        home_delivery: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[PharmacyProfile]:
        """Search pharmacies"""
        conditions = [PharmacyProfile.is_verified == True]
        
        if city:
            conditions.append(PharmacyProfile.city.ilike(f"%{city}%"))
        
        if is_24x7 is not None:
            conditions.append(PharmacyProfile.is_24x7 == is_24x7)
        
        if home_delivery is not None:
            conditions.append(
                PharmacyProfile.home_delivery_available == home_delivery
            )
        
        query = (
            select(PharmacyProfile)
            .where(and_(*conditions))
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def search_nearby_pharmacies(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        skip: int = 0,
        limit: int = 20
    ) -> List[tuple]:
        """Search nearby pharmacies"""
        conditions = [
            PharmacyProfile.is_verified == True,
            PharmacyProfile.is_operational == True
        ]
        
        distance_query = (
            6371 * func.acos(
                func.cos(func.radians(latitude)) *
                func.cos(func.radians(PharmacyProfile.latitude)) *
                func.cos(func.radians(PharmacyProfile.longitude) - func.radians(longitude)) +
                func.sin(func.radians(latitude)) *
                func.sin(func.radians(PharmacyProfile.latitude))
            )
        )
        
        query = (
            select(PharmacyProfile, distance_query.label("distance"))
            .where(and_(*conditions))
            .having(distance_query <= radius_km)
            .order_by("distance")
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(query)
        return result.all()
    
    async def search_medicines(
        self,
        query_text: str,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Medicine]:
        """Search medicines"""
        conditions = [
            or_(
                Medicine.name.ilike(f"%{query_text}%"),
                Medicine.generic_name.ilike(f"%{query_text}%"),
                Medicine.brand_name.ilike(f"%{query_text}%")
            )
        ]
        
        if category:
            conditions.append(Medicine.category == category)
        
        query = (
            select(Medicine)
            .where(and_(*conditions))
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_inventory(
        self,
        pharmacy_id: uuid.UUID,
        low_stock_only: bool = False,
        expiring_soon: bool = False,
        skip: int = 0,
        limit: int = 50
    ) -> List[PharmacyInventory]:
        """Get pharmacy inventory"""
        conditions = [PharmacyInventory.pharmacy_id == pharmacy_id]
        
        if low_stock_only:
            conditions.append(
                PharmacyInventory.quantity <= PharmacyInventory.minimum_stock_threshold
            )
        
        if expiring_soon:
            conditions.append(
                PharmacyInventory.expiry_date <= func.current_date() + 30
            )
        
        query = (
            select(PharmacyInventory)
            .where(and_(*conditions))
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_orders(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[MedicineOrder]:
        """Get user orders"""
        conditions = [MedicineOrder.user_id == user_id]
        
        if status:
            conditions.append(MedicineOrder.status == status)
        
        query = (
            select(MedicineOrder)
            .where(and_(*conditions))
            .order_by(MedicineOrder.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_pharmacy_orders(
        self,
        pharmacy_id: uuid.UUID,
        skip: int = 0,
        limit: int = 50
    ) -> List[MedicineOrder]:
        """Get pharmacy orders"""
        query = (
            select(MedicineOrder)
            .where(MedicineOrder.pharmacy_id == pharmacy_id)
            .order_by(MedicineOrder.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def compare_medicine_prices(
        self,
        medicine_name: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_km: float = 10
    ) -> List[Dict]:
        """Compare medicine prices across pharmacies"""
        # Find medicine ID
        medicine_query = select(Medicine).where(
            Medicine.name.ilike(f"%{medicine_name}%")
        ).limit(1)
        result = await self.session.execute(medicine_query)
        medicine = result.scalar_one_or_none()
        
        if not medicine:
            return []
        
        # Get inventory across pharmacies
        conditions = [
            PharmacyInventory.medicine_id == medicine.id,
            PharmacyInventory.is_available == True,
            PharmacyInventory.quantity > 0
        ]
        
        query = (
            select(
                PharmacyInventory,
                PharmacyProfile.name,
                PharmacyProfile.latitude,
                PharmacyProfile.longitude
            )
            .join(PharmacyProfile)
            .where(and_(*conditions))
        )
        
        result = await self.session.execute(query)
        
        comparisons = []
        for inv, name, lat, lon in result:
            comparison = {
                "pharmacy_name": name,
                "price": inv.price,
                "discount": inv.discount_percentage,
                "final_price": inv.price * (1 - inv.discount_percentage / 100),
                "quantity_available": inv.quantity,
                "expiry_date": inv.expiry_date.isoformat()
            }
            
            if latitude and longitude and lat and lon:
                from app.utils.geolocation import GeoUtils
                distance = GeoUtils.calculate_distance(latitude, longitude, lat, lon)
                comparison["distance_km"] = round(distance, 2)
            
            comparisons.append(comparison)
        
        # Sort by price
        comparisons.sort(key=lambda x: x["final_price"])
        
        return comparisons