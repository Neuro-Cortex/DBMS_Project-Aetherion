from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# PHARMACY CREATE REQUEST
# ============================================
class PharmacyCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    registration_number: str = Field(..., min_length=1, max_length=100)
    license_number: str = Field(..., min_length=1, max_length=100)
    gst_number: Optional[str] = None
    pharmacist_name: str = Field(..., min_length=1, max_length=150)
    pharmacist_license: Optional[str] = None
    owner_name: Optional[str] = None
    operating_hours: Optional[str] = None
    is_24x7: bool = False
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    street: Optional[str] = None
    city: str = Field(..., min_length=1)
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    delivery_available: bool = False
    delivery_radius: float = 0
    emergency_service: bool = False
    services: Optional[list] = None


# ============================================
# PHARMACY RESPONSE SCHEMAS
# ============================================
class PharmacyResponse(BaseModel):
    id: str
    admin_user_id: str
    name: str
    registration_number: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    delivery_available: bool = False
    delivery_radius: float = 0
    emergency_service: bool = False
    is_verified: bool = False
    is_active: bool = True
    is_open: bool = True
    status: Optional[str] = "active"
    rating: float = 0.0
    review_count: int = 0
    total_orders: int = 0
    services: Optional[List] = None
    is_24x7: bool = False
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PharmacyUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    emergency_phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    street: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    delivery_available: Optional[bool] = None
    delivery_radius: Optional[float] = None
    emergency_service: Optional[bool] = None
    operating_hours: Optional[str] = None
    services: Optional[List] = None


# ============================================
# MEDICINE / INVENTORY SCHEMAS
# ============================================
class MedicineResponse(BaseModel):
    id: str
    pharmacy_id: str
    medicine_name: str
    generic_name: Optional[str] = None
    brand_name: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    usage_instructions: Optional[str] = None
    dosage: Optional[str] = None
    side_effects: Optional[List] = None
    precautions: Optional[List] = None
    manufacturer: Optional[str] = None
    expiry_date: Optional[date] = None
    batch_number: Optional[str] = None
    price: float = 0
    discounted_price: Optional[float] = None
    quantity: int = 0
    min_stock: int = 10
    unit: Optional[str] = "tablet"
    pack_size: Optional[str] = None
    strength: Optional[str] = None
    form: Optional[str] = None
    requires_prescription: bool = True
    is_available: bool = True
    is_expired: bool = False
    rating: float = 0.0
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class MedicineCreateRequest(BaseModel):
    medicine_name: str = Field(..., max_length=255)
    generic_name: Optional[str] = Field(None, max_length=255)
    brand_name: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    type: Optional[str] = "prescription"
    description: Optional[str] = None
    usage_instructions: Optional[str] = None
    dosage: Optional[str] = Field(None, max_length=100)
    side_effects: Optional[List] = None
    precautions: Optional[List] = None
    manufacturer: Optional[str] = Field(None, max_length=255)
    expiry_date: Optional[date] = None
    batch_number: Optional[str] = Field(None, max_length=100)
    price: float = Field(...)
    discounted_price: Optional[float] = None
    quantity: int = Field(..., ge=0)
    min_stock: int = Field(default=10, ge=0)
    unit: Optional[str] = "tablet"
    pack_size: Optional[str] = None
    strength: Optional[str] = None
    form: Optional[str] = "tablet"
    requires_prescription: bool = True


class MedicineUpdateRequest(BaseModel):
    medicine_name: Optional[str] = Field(None, max_length=255)
    generic_name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    discounted_price: Optional[float] = None
    quantity: Optional[int] = Field(None, ge=0)
    is_available: Optional[bool] = None
    description: Optional[str] = None


class StockUpdateRequest(BaseModel):
    quantity: int = Field(...)


# ============================================
# ORDER SCHEMAS
# ============================================
class OrderItemCreate(BaseModel):
    medicine_id: str
    quantity: int = Field(..., ge=1)


class OrderCreateRequest(BaseModel):
    pharmacy_id: str = Field(...)
    prescription_id: Optional[str] = None
    items: List[OrderItemCreate] = Field(..., min_length=1)
    delivery_address: Optional[str] = None
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None
    payment_method: str = Field(default="cash")


class OrderResponse(BaseModel):
    id: str
    order_number: Optional[str] = None
    patient_id: Optional[str] = None
    pharmacy_id: str
    total_amount: float = 0
    discount: float = 0
    final_amount: float = 0
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    prescription_required: bool = False
    prescription_url: Optional[str] = None
    prescription_verified: bool = False
    delivery_address: Optional[str] = None
    delivery_status: Optional[str] = None
    order_status: Optional[str] = None
    estimated_delivery: Optional[str] = None
    tracking_number: Optional[str] = None
    items: Optional[List] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class OrderStatusUpdateRequest(BaseModel):
    status: str = Field(...)


# ============================================
# STOCK ALERT
# ============================================
class StockAlertResponse(BaseModel):
    id: str
    pharmacy_id: str
    medicine_id: str
    medicine_name: str
    current_stock: int = 0
    min_stock: int = 10
    status: Optional[str] = "low"
    is_resolved: bool = False

    model_config = {"from_attributes": True}


# ============================================
# PHARMACY DASHBOARD
# ============================================
class PharmacyDashboardResponse(BaseModel):
    pharmacy: Optional[dict] = None
    today_orders: int = 0
    total_orders: int = 0
    total_medicines: int = 0
    low_stock_items: int = 0
    expired_items: int = 0
    total_revenue: float = 0
    today_revenue: float = 0
    pending_orders: int = 0
    recent_orders: List[dict] = []
    stock_alerts: List[dict] = []


# ============================================
# CLIENT PHARMACY DASHBOARD
# ============================================
class ClientPharmacyDashboardResponse(BaseModel):
    recent_orders: List[dict] = []
    active_prescriptions: int = 0
    favorite_pharmacies: List[dict] = []
