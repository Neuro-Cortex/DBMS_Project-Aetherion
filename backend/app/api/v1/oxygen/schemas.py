"""
Oxygen schemas
"""
from pydantic import BaseModel, Field
from typing import Optional

class OxygenStockCreate(BaseModel):
    total_capacity_liters: int
    available_liters: int
    total_cylinders: int
    available_cylinders: int
    large_cylinders: int = 0
    medium_cylinders: int = 0
    small_cylinders: int = 0
    portable_cylinders: int = 0
    minimum_threshold_liters: int = 1000
    emergency_reserve_liters: int = 500

class OxygenStockUpdate(BaseModel):
    available_liters: Optional[int] = None
    available_cylinders: Optional[int] = None
    large_cylinders: Optional[int] = None
    medium_cylinders: Optional[int] = None
    small_cylinders: Optional[int] = None
    portable_cylinders: Optional[int] = None
    is_critical_low: Optional[bool] = None

class OxygenRequestCreate(BaseModel):
    hospital_id: Optional[str] = None
    oxygen_type: str
    quantity_liters: int
    cylinders_count: int = 0
    is_emergency: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    delivery_required: bool = False
    delivery_address: Optional[str] = None
    patient_condition: Optional[str] = None
    notes: Optional[str] = None

class SupplierCreate(BaseModel):
    name: str
    contact_person: str
    phone: str
    email: str
    address: str
    city: str
    country: str
    latitude: float
    longitude: float
    daily_capacity_liters: int
    minimum_order_liters: int = 100
    delivery_available: bool = False
    delivery_radius_km: Optional[float] = None
    price_per_liter: float
    emergency_surcharge_percentage: float = 0