"""
Pharmacy service with inventory and order management
"""
from typing import Optional, List, Dict, Any
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.pharmacy_repository import PharmacyRepository
from app.models.pharmacy import (
    PharmacyProfile, Medicine, PharmacyInventory,
    MedicineOrder, OrderItem
)
from app.integrations.cloudinary import cloudinary_client
import uuid
import logging

logger = logging.getLogger(__name__)

class PharmacyService:
    """Pharmacy management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.pharmacy_repo = PharmacyRepository(session)
    
    async def create_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PharmacyProfile:
        """Create pharmacy profile"""
        existing = await self.pharmacy_repo.get_by_user_id(user_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Pharmacy profile already exists"
            )
        
        pharmacy = PharmacyProfile(user_id=user_id, **data)
        self.session.add(pharmacy)
        await self.session.commit()
        return pharmacy
    
    async def get_profile(self, pharmacy_id: uuid.UUID) -> PharmacyProfile:
        """Get pharmacy profile"""
        pharmacy = await self.pharmacy_repo.get_by_id(pharmacy_id)
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        return pharmacy
    
    async def search_pharmacies(
        self,
        city: Optional[str] = None,
        is_24x7: Optional[bool] = None,
        home_delivery: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[PharmacyProfile]:
        """Search pharmacies"""
        return await self.pharmacy_repo.search_pharmacies(
            city, is_24x7, home_delivery, skip, limit
        )
    
    async def search_nearby_pharmacies(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict]:
        """Search nearby pharmacies"""
        results = await self.pharmacy_repo.search_nearby_pharmacies(
            latitude, longitude, radius_km, skip, limit
        )
        
        pharmacies = []
        for pharmacy, distance in results:
            pharmacies.append({
                "pharmacy_id": str(pharmacy.id),
                "name": pharmacy.name,
                "distance_km": round(distance, 2),
                "is_24x7": pharmacy.is_24x7,
                "home_delivery": pharmacy.home_delivery_available
            })
        
        return pharmacies
    
    async def add_medicine(self, data: Dict[str, Any]) -> Medicine:
        """Add medicine to catalog"""
        medicine = Medicine(**data)
        self.session.add(medicine)
        await self.session.commit()
        return medicine
    
    async def search_medicines(
        self,
        query: str,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Medicine]:
        """Search medicines"""
        return await self.pharmacy_repo.search_medicines(
            query, category, skip, limit
        )
    
    async def get_medicine(self, medicine_id: uuid.UUID) -> Medicine:
        """Get medicine details"""
        medicine = await self.session.get(Medicine, medicine_id)
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")
        return medicine
    
    async def compare_medicines(
        self, medicine_ids: List[uuid.UUID]
    ) -> List[Dict]:
        """Compare medicines"""
        medicines = []
        for mid in medicine_ids:
            medicine = await self.session.get(Medicine, mid)
            if medicine:
                medicines.append({
                    "id": str(medicine.id),
                    "name": medicine.name,
                    "generic_name": medicine.generic_name,
                    "manufacturer": medicine.manufacturer,
                    "category": medicine.category,
                    "strength": medicine.strength,
                    "form": medicine.form.value,
                    "side_effects": medicine.side_effects,
                    "requires_prescription": medicine.requires_prescription,
                    "average_rating": medicine.average_rating
                })
        return medicines
    
    async def add_inventory(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> PharmacyInventory:
        """Add inventory item"""
        pharmacy = await self.pharmacy_repo.get_by_user_id(user_id)
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        inventory = PharmacyInventory(
            pharmacy_id=pharmacy.id,
            **data
        )
        
        self.session.add(inventory)
        await self.session.commit()
        return inventory
    
    async def update_inventory(
        self,
        user_id: uuid.UUID,
        inventory_id: uuid.UUID,
        data: Dict[str, Any]
    ) -> PharmacyInventory:
        """Update inventory"""
        pharmacy = await self.pharmacy_repo.get_by_user_id(user_id)
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        inventory = await self.session.get(PharmacyInventory, inventory_id)
        if not inventory or inventory.pharmacy_id != pharmacy.id:
            raise HTTPException(status_code=404, detail="Inventory not found")
        
        for key, value in data.items():
            if hasattr(inventory, key) and value is not None:
                setattr(inventory, key, value)
        
        await self.session.commit()
        return inventory
    
    async def get_inventory(
        self,
        user_id: uuid.UUID,
        low_stock_only: bool = False,
        expiring_soon: bool = False,
        skip: int = 0,
        limit: int = 50
    ) -> List[PharmacyInventory]:
        """Get pharmacy inventory"""
        pharmacy = await self.pharmacy_repo.get_by_user_id(user_id)
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        return await self.pharmacy_repo.get_inventory(
            pharmacy.id, low_stock_only, expiring_soon, skip, limit
        )
    
    async def create_order(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> MedicineOrder:
        """Create medicine order"""
        pharmacy = await self.pharmacy_repo.get_by_id(
            uuid.UUID(data['pharmacy_id'])
        )
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        # Calculate total
        total = 0
        for item in data['items']:
            inventory = await self.session.get(
                PharmacyInventory,
                uuid.UUID(item['inventory_id'])
            )
            if not inventory:
                raise HTTPException(
                    status_code=404,
                    detail=f"Inventory {item['inventory_id']} not found"
                )
            
            if inventory.quantity < item['quantity']:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {item['inventory_id']}"
                )
            
            item_total = inventory.price * item['quantity']
            if inventory.discount_percentage:
                item_total *= (1 - inventory.discount_percentage / 100)
            total += item_total
        
        order = MedicineOrder(
            user_id=user_id,
            pharmacy_id=uuid.UUID(data['pharmacy_id']),
            total_amount=total,
            final_amount=total,
            delivery_address=data['delivery_address'],
            delivery_instructions=data.get('delivery_instructions'),
            payment_method=data['payment_method'],
            prescription_id=uuid.UUID(data['prescription_id']) if data.get('prescription_id') else None
        )
        
        self.session.add(order)
        await self.session.flush()
        
        # Add order items
        for item in data['items']:
            inventory = await self.session.get(
                PharmacyInventory,
                uuid.UUID(item['inventory_id'])
            )
            
            order_item = OrderItem(
                order_id=order.id,
                medicine_id=inventory.medicine_id,
                quantity=item['quantity'],
                unit_price=inventory.price,
                total_price=inventory.price * item['quantity']
            )
            
            self.session.add(order_item)
            
            # Reduce inventory
            inventory.quantity -= item['quantity']
        
        await self.session.commit()
        return order
    
    async def get_order(
        self, user_id: uuid.UUID, order_id: uuid.UUID
    ) -> MedicineOrder:
        """Get order details"""
        order = await self.session.get(MedicineOrder, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check access
        pharmacy = await self.pharmacy_repo.get_by_user_id(user_id)
        if order.user_id != user_id and (
            not pharmacy or order.pharmacy_id != pharmacy.id
        ):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return order
    
    async def update_order_status(
        self,
        user_id: uuid.UUID,
        order_id: uuid.UUID,
        status: str,
        notes: Optional[str] = None
    ) -> MedicineOrder:
        """Update order status"""
        pharmacy = await self.pharmacy_repo.get_by_user_id(user_id)
        if not pharmacy:
            raise HTTPException(status_code=403, detail="Access denied")
        
        order = await self.session.get(MedicineOrder, order_id)
        if not order or order.pharmacy_id != pharmacy.id:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.status = status
        if notes:
            order.delivery_instructions = notes
        
        await self.session.commit()
        return order
    
    async def get_user_orders(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[MedicineOrder]:
        """Get user orders"""
        return await self.pharmacy_repo.get_orders(user_id, status, skip, limit)
    
    async def upload_prescription(
        self,
        user_id: uuid.UUID,
        order_id: Optional[uuid.UUID],
        file: UploadFile
    ) -> Dict:
        """Upload prescription file"""
        result = await cloudinary_client.upload_file(
            file,
            folder=f"prescriptions/{user_id}"
        )
        
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to upload prescription"
            )
        
        return {
            "file_url": result['secure_url'],
            "public_id": result['public_id']
        }
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get pharmacy dashboard"""
        pharmacy = await self.pharmacy_repo.get_by_user_id(user_id)
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        orders = await self.pharmacy_repo.get_pharmacy_orders(pharmacy.id, limit=10)
        inventory = await self.pharmacy_repo.get_inventory(
            pharmacy.id, low_stock_only=True
        )
        
        return {
            "total_orders": len(orders),
            "low_stock_items": len(inventory),
            "recent_orders": [
                {
                    "id": str(o.id),
                    "status": o.status.value,
                    "total": o.final_amount,
                    "created_at": o.created_at.isoformat()
                }
                for o in orders[:5]
            ]
        }
    
    async def get_client_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get client pharmacy dashboard"""
        orders = await self.pharmacy_repo.get_orders(user_id, limit=10)
        
        return {
            "total_orders": len(orders),
            "active_orders": len([o for o in orders if o.status.value not in ['delivered', 'cancelled']]),
            "recent_orders": [
                {
                    "id": str(o.id),
                    "status": o.status.value,
                    "total": o.final_amount,
                    "created_at": o.created_at.isoformat()
                }
                for o in orders[:5]
            ]
        }
    
    async def compare_prices(
        self,
        medicine_name: str,
        city: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_km: float = 10
    ) -> List[Dict]:
        """Compare medicine prices across pharmacies"""
        return await self.pharmacy_repo.compare_medicine_prices(
            medicine_name, latitude, longitude, radius_km
        )