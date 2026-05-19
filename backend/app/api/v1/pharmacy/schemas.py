"""
Pharmacy schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, time
from app.models.base import MedicineForm

class PharmacyProfileCreate(BaseModel):
    name: str
    license_number: str
    phone: str
    email: str
    address: str
    city: str
    country: str
    postal_code: Optional[str] = None
    latitude: float
    longitude: float
    open_time: str
    close_time: str
    is_24x7: bool = False
    home_delivery_available: bool = False
    delivery_radius_km: Optional[float] = None
    minimum_order_amount: Optional[float] = None

class MedicineCreate(BaseModel):
    name: str
    generic_name: Optional[str] = None
    brand_name: Optional[str] = None
    manufacturer: str
    category: str
    form: MedicineForm
    strength: str
    description: Optional[str] = None
    uses: Optional[List[str]] = []
    side_effects: Optional[List[str]] = []
    dosage_instructions: Optional[str] = None
    contraindications: Optional[List[str]] = []
    requires_prescription: bool = False
    is_controlled_substance: bool = False
    drug_interactions: Optional[List[str]] = []
    storage_instructions: Optional[str] = None
    image_url: Optional[str] = None

class InventoryAdd(BaseModel):
    medicine_id: str
    quantity: int
    price: float
    discount_percentage: float = 0
    batch_number: str
    expiry_date: datetime
    manufacturing_date: datetime
    minimum_stock_threshold: int = 10

class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    price: Optional[float] = None
    discount_percentage: Optional[float] = None
    is_available: Optional[bool] = None
    minimum_stock_threshold: Optional[int] = None

class OrderCreate(BaseModel):
    pharmacy_id: str
    items: List[dict]
    delivery_address: str
    delivery_instructions: Optional[str] = None
    payment_method: str
    prescription_id: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class MedicineSearchFilters(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    requires_prescription: Optional[bool] = None
    form: Optional[MedicineForm] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None