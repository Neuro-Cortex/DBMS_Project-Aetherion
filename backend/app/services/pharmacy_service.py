from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List
from datetime import date, datetime

from ..models.pharmacy import (
    Pharmacy, PharmacyInventory, MedicineOrder, OrderItem,
    StockAlert, DeliveryTracking,
)
from ..models.user import User
from ..schemas.pharmacy import (
    PharmacyResponse, PharmacyUpdateRequest,
    MedicineResponse, MedicineCreateRequest, MedicineUpdateRequest,
    StockUpdateRequest, OrderCreateRequest, OrderResponse,
    StockAlertResponse, PharmacyDashboardResponse,
    ClientPharmacyDashboardResponse,
)
from ..core.exceptions import NotFoundException, ConflictException, BadRequestException
from ..utils.helpers import build_pagination_meta, generate_order_number


class PharmacyService:
    """Handles all pharmacy-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # GET PHARMACY BY USER ID
    # ============================================
    def get_pharmacy_by_user_id(self, user_id: str) -> Pharmacy:
        pharmacy = self.db.query(Pharmacy).filter(Pharmacy.admin_user_id == user_id).first()
        if not pharmacy:
            raise NotFoundException("Pharmacy profile not found")
        return pharmacy

    # ============================================
    # GET PHARMACY PROFILE
    # ============================================
    def get_pharmacy_profile(self, user_id: str) -> PharmacyResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        return PharmacyResponse.model_validate(pharmacy)

    # ============================================
    # UPDATE PHARMACY PROFILE
    # ============================================
    def update_pharmacy_profile(self, user_id: str, data: PharmacyUpdateRequest) -> PharmacyResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(pharmacy, field, value)
        self.db.commit()
        self.db.refresh(pharmacy)
        return PharmacyResponse.model_validate(pharmacy)

    # ============================================
    # PHARMACY DASHBOARD
    # ============================================
    def get_pharmacy_dashboard(self, user_id: str) -> PharmacyDashboardResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        today = date.today()

        # Order stats
        today_orders = self.db.query(MedicineOrder).filter(
            MedicineOrder.pharmacy_id == pharmacy.id,
            func.date(MedicineOrder.created_at) == today,
        ).count()

        total_orders = self.db.query(MedicineOrder).filter(
            MedicineOrder.pharmacy_id == pharmacy.id,
        ).count()

        total_revenue = self.db.query(func.sum(MedicineOrder.final_amount)).filter(
            MedicineOrder.pharmacy_id == pharmacy.id,
            MedicineOrder.payment_status == "paid",
        ).scalar() or 0

        today_revenue = self.db.query(func.sum(MedicineOrder.final_amount)).filter(
            MedicineOrder.pharmacy_id == pharmacy.id,
            MedicineOrder.payment_status == "paid",
            func.date(MedicineOrder.created_at) == today,
        ).scalar() or 0

        pending_orders = self.db.query(MedicineOrder).filter(
            MedicineOrder.pharmacy_id == pharmacy.id,
            MedicineOrder.order_status.in_(["pending", "confirmed", "processing"]),
        ).count()

        # Medicine stats
        total_medicines = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharmacy.id,
        ).count()

        low_stock = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharmacy.id,
            PharmacyInventory.quantity <= PharmacyInventory.min_stock,
        ).count()

        expired = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharmacy.id,
            PharmacyInventory.expiry_date < today,
        ).count()

        # Recent orders
        recent_orders = self.db.query(MedicineOrder).filter(
            MedicineOrder.pharmacy_id == pharmacy.id,
        ).order_by(MedicineOrder.created_at.desc()).limit(5).all()

        # Stock alerts
        alerts = self.db.query(StockAlert).filter(
            StockAlert.pharmacy_id == pharmacy.id,
            StockAlert.is_resolved == False,
        ).order_by(StockAlert.created_at.desc()).limit(10).all()

        return PharmacyDashboardResponse(
            pharmacy={
                "id": pharmacy.id,
                "name": pharmacy.name,
                "is_verified": pharmacy.is_verified,
                "is_open": pharmacy.is_open,
                "rating": float(pharmacy.rating or 0),
            },
            today_orders=today_orders,
            total_orders=total_orders,
            total_medicines=total_medicines,
            low_stock_items=low_stock,
            expired_items=expired,
            total_revenue=float(total_revenue),
            today_revenue=float(today_revenue),
            pending_orders=pending_orders,
            recent_orders=[self._order_to_dict(o) for o in recent_orders],
            stock_alerts=[self._alert_to_dict(a) for a in alerts],
        )

    # ============================================
    # CLIENT PHARMACY DASHBOARD
    # ============================================
    def get_client_pharmacy_dashboard(self, user_id: str) -> ClientPharmacyDashboardResponse:
        recent_orders = self.db.query(MedicineOrder).filter(
            MedicineOrder.patient_id == user_id,
        ).order_by(MedicineOrder.created_at.desc()).limit(5).all()

        from ..models.appointment import Prescription
        active_prescriptions = self.db.query(Prescription).filter(
            Prescription.patient_id == user_id,
            Prescription.status == "active",
        ).count()

        return ClientPharmacyDashboardResponse(
            recent_orders=[self._order_to_dict(o) for o in recent_orders],
            active_prescriptions=active_prescriptions,
        )

    # ============================================
    # MEDICINES (INVENTORY)
    # ============================================
    def get_medicines(
        self, user_id: str, page: int = 1, size: int = 20,
        search: Optional[str] = None, category: Optional[str] = None,
        is_available: Optional[bool] = None,
    ) -> dict:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        query = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharmacy.id,
        )

        if search:
            term = f"%{search}%"
            query = query.filter(
                or_(
                    PharmacyInventory.medicine_name.ilike(term),
                    PharmacyInventory.generic_name.ilike(term),
                    PharmacyInventory.brand_name.ilike(term),
                )
            )
        if category:
            query = query.filter(PharmacyInventory.category == category)
        if is_available is not None:
            query = query.filter(PharmacyInventory.is_available == is_available)

        total = query.count()
        medicines = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [MedicineResponse.model_validate(m) for m in medicines],
            **build_pagination_meta(total, page, size),
        }

    def add_medicine(self, user_id: str, data: MedicineCreateRequest) -> MedicineResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        medicine = PharmacyInventory(
            pharmacy_id=pharmacy.id,
            **data.model_dump(),
        )
        self.db.add(medicine)
        self.db.commit()
        self.db.refresh(medicine)
        return MedicineResponse.model_validate(medicine)

    def update_medicine(self, user_id: str, medicine_id: str, data: MedicineUpdateRequest) -> MedicineResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        medicine = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.id == medicine_id,
            PharmacyInventory.pharmacy_id == pharmacy.id,
        ).first()
        if not medicine:
            raise NotFoundException("Medicine not found")

        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(medicine, field, value)
        self.db.commit()
        self.db.refresh(medicine)
        return MedicineResponse.model_validate(medicine)

    def delete_medicine(self, user_id: str, medicine_id: str) -> None:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        medicine = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.id == medicine_id,
            PharmacyInventory.pharmacy_id == pharmacy.id,
        ).first()
        if not medicine:
            raise NotFoundException("Medicine not found")
        self.db.delete(medicine)
        self.db.commit()

    def update_stock(self, user_id: str, medicine_id: str, quantity: int) -> MedicineResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        medicine = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.id == medicine_id,
            PharmacyInventory.pharmacy_id == pharmacy.id,
        ).first()
        if not medicine:
            raise NotFoundException("Medicine not found")

        medicine.quantity = quantity
        medicine.is_available = quantity > 0

        # Check if stock alert needed
        if quantity <= medicine.min_stock:
            existing_alert = self.db.query(StockAlert).filter(
                StockAlert.pharmacy_id == pharmacy.id,
                StockAlert.medicine_id == medicine_id,
                StockAlert.is_resolved == False,
            ).first()
            if not existing_alert:
                alert_status = "out-of-stock" if quantity == 0 else "critical" if quantity < 3 else "low"
                alert = StockAlert(
                    pharmacy_id=pharmacy.id,
                    medicine_id=medicine_id,
                    medicine_name=medicine.medicine_name,
                    current_stock=quantity,
                    min_stock=medicine.min_stock,
                    status=alert_status,
                )
                self.db.add(alert)

        self.db.commit()
        self.db.refresh(medicine)
        return MedicineResponse.model_validate(medicine)

    # ============================================
    # STOCK ALERTS
    # ============================================
    def get_stock_alerts(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        query = self.db.query(StockAlert).filter(
            StockAlert.pharmacy_id == pharmacy.id,
        ).order_by(StockAlert.created_at.desc())

        total = query.count()
        alerts = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [StockAlertResponse.model_validate(a) for a in alerts],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # ORDERS
    # ============================================
    def create_order(self, user_id: str, data: OrderCreateRequest) -> OrderResponse:
        # Verify pharmacy exists
        pharmacy = self.db.query(Pharmacy).filter(Pharmacy.id == data.pharmacy_id).first()
        if not pharmacy:
            raise NotFoundException("Pharmacy not found")

        # Calculate order totals
        total_amount = 0
        order_items = []
        for item_data in data.items:
            medicine = self.db.query(PharmacyInventory).filter(
                PharmacyInventory.id == item_data.medicine_id,
                PharmacyInventory.pharmacy_id == data.pharmacy_id,
            ).first()
            if not medicine:
                raise NotFoundException(f"Medicine not found: {item_data.medicine_id}")
            if medicine.quantity < item_data.quantity:
                raise BadRequestException(f"Insufficient stock for {medicine.medicine_name}")

            unit_price = float(medicine.discounted_price or medicine.price)
            line_total = unit_price * item_data.quantity
            total_amount += line_total

            order_items.append({
                "medicine_id": medicine.id,
                "medicine_name": medicine.medicine_name,
                "quantity": item_data.quantity,
                "unit_price": unit_price,
                "total_price": line_total,
            })

            # Reduce stock
            medicine.quantity -= item_data.quantity
            medicine.is_available = medicine.quantity > 0

        discount = 0
        final_amount = total_amount - discount

        order_number = generate_order_number("PHR")

        order = MedicineOrder(
            order_number=order_number,
            patient_id=user_id,
            pharmacy_id=data.pharmacy_id,
            prescription_id=data.prescription_id,
            total_amount=total_amount,
            discount=discount,
            final_amount=final_amount,
            payment_method=data.payment_method,
            prescription_required=any(
                self.db.query(PharmacyInventory).filter(
                    PharmacyInventory.id == i["medicine_id"],
                    PharmacyInventory.requires_prescription == True,
                ).first()
                for i in order_items
            ),
            delivery_address=data.delivery_address,
            delivery_latitude=data.delivery_latitude,
            delivery_longitude=data.delivery_longitude,
            order_status="pending",
            payment_status="pending",
            delivery_status="pending",
        )
        self.db.add(order)
        self.db.flush()

        # Create order items
        for item_dict in order_items:
            item = OrderItem(
                order_id=order.id,
                **item_dict,
            )
            self.db.add(item)

        # Update pharmacy order count
        pharmacy.total_orders = (pharmacy.total_orders or 0) + 1

        self.db.commit()
        self.db.refresh(order)

        return self._order_to_response(order)

    def get_orders(
        self, user_id: str, page: int = 1, size: int = 20,
        status: Optional[str] = None, as_pharmacy: bool = False,
    ) -> dict:
        if as_pharmacy:
            pharmacy = self.get_pharmacy_by_user_id(user_id)
            query = self.db.query(MedicineOrder).filter(MedicineOrder.pharmacy_id == pharmacy.id)
        else:
            query = self.db.query(MedicineOrder).filter(MedicineOrder.patient_id == user_id)

        if status:
            query = query.filter(MedicineOrder.order_status == status)

        query = query.order_by(MedicineOrder.created_at.desc())
        total = query.count()
        orders = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [self._order_to_response(o) for o in orders],
            **build_pagination_meta(total, page, size),
        }

    def update_order_status(self, user_id: str, order_id: str, status: str) -> OrderResponse:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        order = self.db.query(MedicineOrder).filter(
            MedicineOrder.id == order_id,
            MedicineOrder.pharmacy_id == pharmacy.id,
        ).first()
        if not order:
            raise NotFoundException("Order not found")

        valid_statuses = ["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled"]
        if status not in valid_statuses:
            raise BadRequestException(f"Invalid status. Must be one of: {valid_statuses}")

        order.order_status = status

        # Update delivery status accordingly
        if status == "confirmed":
            order.delivery_status = "assigned"
        elif status == "packed":
            order.delivery_status = "picked-up"
        elif status == "shipped":
            order.delivery_status = "in-transit"
        elif status == "delivered":
            order.delivery_status = "delivered"
            order.payment_status = "paid"

        self.db.commit()
        self.db.refresh(order)
        return self._order_to_response(order)

    # ============================================
    # MEDICINE SEARCH (public)
    # ============================================
    def search_medicines(
        self, name: Optional[str] = None, category: Optional[str] = None,
        page: int = 1, size: int = 20,
    ) -> dict:
        query = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.is_available == True,
        )

        if name:
            term = f"%{name}%"
            query = query.filter(
                or_(
                    PharmacyInventory.medicine_name.ilike(term),
                    PharmacyInventory.generic_name.ilike(term),
                    PharmacyInventory.brand_name.ilike(term),
                )
            )
        if category:
            query = query.filter(PharmacyInventory.category == category)

        total = query.count()
        medicines = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [MedicineResponse.model_validate(m) for m in medicines],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # EXPIRING MEDICINES
    # ============================================
    def get_expiring_medicines(self, user_id: str, days: int = 30) -> List[MedicineResponse]:
        pharmacy = self.get_pharmacy_by_user_id(user_id)
        from datetime import timedelta
        cutoff = date.today() + timedelta(days=days)
        medicines = self.db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharmacy.id,
            PharmacyInventory.expiry_date <= cutoff,
            PharmacyInventory.expiry_date >= date.today(),
        ).all()
        return [MedicineResponse.model_validate(m) for m in medicines]

    # ============================================
    # DELIVERY TRACKING
    # ============================================
    def track_delivery(self, order_id: str) -> dict:
        tracking = self.db.query(DeliveryTracking).filter(
            DeliveryTracking.order_id == order_id,
        ).order_by(DeliveryTracking.created_at.desc()).all()

        order = self.db.query(MedicineOrder).filter(MedicineOrder.id == order_id).first()
        if not order:
            raise NotFoundException("Order not found")

        return {
            "order_id": order_id,
            "order_status": order.order_status,
            "delivery_status": order.delivery_status,
            "tracking_number": order.tracking_number,
            "estimated_delivery": order.estimated_delivery,
            "delivery_partner": order.delivery_partner,
            "updates": [
                {
                    "status": t.status,
                    "message": t.message,
                    "location_address": t.location_address,
                    "delivery_person": t.delivery_person,
                    "created_at": str(t.created_at) if t.created_at else None,
                }
                for t in tracking
            ],
        }

    # ============================================
    # HELPER METHODS
    # ============================================
    def _order_to_dict(self, order: MedicineOrder) -> dict:
        return {
            "id": order.id,
            "order_number": order.order_number,
            "patient_id": order.patient_id,
            "pharmacy_id": order.pharmacy_id,
            "total_amount": float(order.total_amount or 0),
            "final_amount": float(order.final_amount or 0),
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "delivery_status": order.delivery_status,
            "estimated_delivery": order.estimated_delivery,
            "created_at": str(order.created_at) if order.created_at else None,
        }

    def _order_to_response(self, order: MedicineOrder) -> OrderResponse:
        # Get items
        items = self.db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        items_data = [
            {
                "medicine_id": i.medicine_id,
                "medicine_name": i.medicine_name,
                "quantity": i.quantity,
                "unit_price": float(i.unit_price or 0),
                "total_price": float(i.total_price or 0),
            }
            for i in items
        ]

        return OrderResponse(
            id=order.id,
            order_number=order.order_number,
            patient_id=order.patient_id,
            pharmacy_id=order.pharmacy_id,
            total_amount=float(order.total_amount or 0),
            discount=float(order.discount or 0),
            final_amount=float(order.final_amount or 0),
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            prescription_required=order.prescription_required,
            prescription_url=order.prescription_url,
            prescription_verified=order.prescription_verified,
            delivery_address=order.delivery_address,
            delivery_status=order.delivery_status,
            order_status=order.order_status,
            estimated_delivery=order.estimated_delivery,
            tracking_number=order.tracking_number,
            items=items_data,
            created_at=order.created_at,
        )

    def _alert_to_dict(self, alert: StockAlert) -> dict:
        return {
            "id": alert.id,
            "medicine_id": alert.medicine_id,
            "medicine_name": alert.medicine_name,
            "current_stock": alert.current_stock,
            "min_stock": alert.min_stock,
            "status": alert.status,
            "is_resolved": alert.is_resolved,
        }
