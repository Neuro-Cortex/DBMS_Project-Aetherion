from sqlalchemy import (
    Column, String, Integer, Boolean, DECIMAL, JSON, Text, Date, Time,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# PHARMACIES
# ============================================
class Pharmacy(Base, BaseModel):
    __tablename__ = "pharmacies"

    admin_user_id = Column(CHAR(36), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), unique=True, nullable=False)
    license_number = Column(String(100), unique=True, nullable=False)
    gst_number = Column(String(50))
    pharmacist_name = Column(String(150), nullable=False)
    pharmacist_license = Column(String(100))
    owner_name = Column(String(150))
    operating_hours = Column(String(255))
    opening_time = Column(Time)
    closing_time = Column(Time)
    is_24x7 = Column(Boolean, default=False)
    phone = Column(String(20))
    emergency_phone = Column(String(20))
    email = Column(String(255))
    street = Column(String(255))
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100))
    zip_code = Column(String(20))
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    delivery_available = Column(Boolean, default=False)
    delivery_radius = Column(DECIMAL(5, 1), default=0)
    emergency_service = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_open = Column(Boolean, default=True)
    status = Column(SQLEnum("active", "inactive", "suspended"), default="active")
    verified_by = Column(CHAR(36), ForeignKey("users.id"))
    rating = Column(DECIMAL(2, 1), default=0.0)
    review_count = Column(Integer, default=0)
    total_orders = Column(Integer, default=0)
    services = Column(JSON)


# ============================================
# PHARMACY INVENTORY (Medicines)
# ============================================
class PharmacyInventory(Base, BaseModel):
    __tablename__ = "pharmacy_inventory"

    pharmacy_id = Column(CHAR(36), ForeignKey("pharmacies.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(255), nullable=False)
    generic_name = Column(String(255))
    brand_name = Column(String(255))
    category = Column(String(100), index=True)
    type = Column(SQLEnum("prescription", "otc"), default="prescription")
    description = Column(Text)
    usage_instructions = Column(Text)
    dosage = Column(String(100))
    side_effects = Column(JSON)
    precautions = Column(JSON)
    contraindications = Column(JSON)
    manufacturer = Column(String(255))
    manufactured_date = Column(Date)
    expiry_date = Column(Date, index=True)
    batch_number = Column(String(100))
    price = Column(DECIMAL(10, 2), nullable=False)
    discounted_price = Column(DECIMAL(10, 2))
    quantity = Column(Integer, nullable=False, default=0)
    min_stock = Column(Integer, default=10)
    max_stock = Column(Integer, default=1000)
    unit = Column(String(20), default="tablet")
    pack_size = Column(String(50))
    strength = Column(String(50))
    form = Column(SQLEnum("tablet", "capsule", "syrup", "injection", "cream", "ointment", "drops", "inhaler", "spray", "powder", "gel", "other"), default="tablet")
    requires_prescription = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    is_expired = Column(Boolean, default=False)
    rating = Column(DECIMAL(2, 1), default=0.0)
    review_count = Column(Integer, default=0)
    image_url = Column(String(500))


# ============================================
# MEDICINE ORDERS
# ============================================
class MedicineOrder(Base, BaseModel):
    __tablename__ = "medicine_orders"

    order_number = Column(String(50), unique=True, nullable=False)
    patient_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    pharmacy_id = Column(CHAR(36), ForeignKey("pharmacies.id"), nullable=False, index=True)
    prescription_id = Column(CHAR(36), ForeignKey("prescriptions.id", ondelete="SET NULL"), nullable=True)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    discount = Column(DECIMAL(10, 2), default=0)
    final_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(SQLEnum("cash", "card", "online", "insurance"), default="cash")
    payment_status = Column(SQLEnum("pending", "paid", "refunded", "failed"), default="pending")
    prescription_required = Column(Boolean, default=False)
    prescription_url = Column(String(500))
    prescription_verified = Column(Boolean, default=False)
    delivery_address = Column(Text)
    delivery_latitude = Column(DECIMAL(10, 7))
    delivery_longitude = Column(DECIMAL(10, 7))
    delivery_status = Column(SQLEnum("pending", "assigned", "picked-up", "in-transit", "delivered", "failed"), default="pending")
    delivery_partner = Column(String(150))
    tracking_number = Column(String(100))
    estimated_delivery = Column(String(30))
    order_status = Column(SQLEnum("pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled", "refunded"), default="pending")
    cancelled_at = Column(Date, nullable=True)
    cancellation_reason = Column(String(500))


# ============================================
# ORDER ITEMS (Line Items)
# ============================================
class OrderItem(Base, BaseModel):
    __tablename__ = "order_items"

    order_id = Column(CHAR(36), ForeignKey("medicine_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_id = Column(CHAR(36), ForeignKey("pharmacy_inventory.id"), nullable=False)
    medicine_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)


# ============================================
# STOCK ALERTS
# ============================================
class StockAlert(Base, BaseModel):
    __tablename__ = "stock_alerts"

    pharmacy_id = Column(CHAR(36), ForeignKey("pharmacies.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_id = Column(CHAR(36), ForeignKey("pharmacy_inventory.id"), nullable=False)
    medicine_name = Column(String(255), nullable=False)
    current_stock = Column(Integer, default=0)
    min_stock = Column(Integer, default=10)
    status = Column(SQLEnum("low", "critical", "out-of-stock", "expired"), default="low")
    is_resolved = Column(Boolean, default=False)


# ============================================
# DELIVERY TRACKING
# ============================================
class DeliveryTracking(Base, BaseModel):
    __tablename__ = "delivery_tracking"

    order_id = Column(CHAR(36), ForeignKey("medicine_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(SQLEnum("pending", "assigned", "picked-up", "in-transit", "delivered", "failed"), default="pending")
    message = Column(Text)
    location_address = Column(String(255))
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    delivery_person = Column(String(150))
    delivery_phone = Column(String(20))
