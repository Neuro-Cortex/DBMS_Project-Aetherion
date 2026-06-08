from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from datetime import datetime

from ..models.doctor import DoctorProfile
from ..models.hospital import Hospital
from ..models.pharmacy import Pharmacy, PharmacyInventory
from ..models.user import User
from ..models.search import SearchLog
from ..schemas.search import SearchResultItem, SearchResponse, SearchLogResponse
from ..utils.helpers import build_pagination_meta


class SearchService:
    def __init__(self, db: Session):
        self.db = db

    def global_search(
        self, query: str, user_id: Optional[str] = None,
        search_type: Optional[str] = None,
        page: int = 1, size: int = 20,
    ) -> SearchResponse:
        results = []
        term = f"%{query}%"

        if not search_type or search_type == "doctor":
            doctor_results = (
                self.db.query(DoctorProfile, User)
                .join(User, User.id == DoctorProfile.user_id)
                .filter(
                    DoctorProfile.is_active == True,
                    User.is_active == True,
                    or_(
                        User.full_name.ilike(term),
                        DoctorProfile.specialization.ilike(term),
                        DoctorProfile.hospital_affiliation.ilike(term),
                    ),
                )
                .offset(0).limit(size)
                .all()
            )
            for doc, user in doctor_results:
                results.append(SearchResultItem(
                    id=doc.id,
                    title=user.full_name or "Doctor",
                    type="doctor",
                    description=f"{doc.specialization} • {doc.experience_years or 0} yrs exp",
                    rating=float(doc.rating or 0),
                    location=doc.hospital_affiliation,
                    price=float(doc.consultation_fee or 0),
                    availability=doc.status,
                    image=doc.profile_image,
                    extra={"specialization": doc.specialization, "is_verified": doc.is_verified},
                ))

        if not search_type or search_type == "hospital":
            hospital_results = (
                self.db.query(Hospital)
                .filter(
                    Hospital.is_active == True,
                    or_(
                        Hospital.name.ilike(term),
                        Hospital.city.ilike(term),
                        Hospital.state.ilike(term),
                    ),
                )
                .offset(0).limit(size)
                .all()
            )
            for h in hospital_results:
                results.append(SearchResultItem(
                    id=h.id,
                    title=h.name,
                    type="hospital",
                    description=f"{h.type or 'Hospital'} • {h.city}, {h.state}",
                    rating=float(h.rating or 0),
                    location=f"{h.city}, {h.state}",
                    availability=h.emergency_service,
                    extra={"total_beds": h.total_beds, "available_beds": h.available_beds, "is_verified": h.is_verified},
                ))

        if not search_type or search_type == "pharmacy":
            pharmacy_results = (
                self.db.query(Pharmacy)
                .filter(
                    Pharmacy.is_active == True,
                    or_(
                        Pharmacy.name.ilike(term),
                        Pharmacy.city.ilike(term),
                    ),
                )
                .offset(0).limit(size)
                .all()
            )
            for p in pharmacy_results:
                results.append(SearchResultItem(
                    id=p.id,
                    title=p.name,
                    type="pharmacy",
                    description=f"Pharmacy • {p.city}",
                    rating=float(p.rating or 0),
                    location=f"{p.city}, {p.state}",
                    extra={"is_24x7": p.is_24x7, "delivery_available": p.delivery_available},
                ))

        if not search_type or search_type == "medicine":
            medicine_results = (
                self.db.query(PharmacyInventory)
                .filter(
                    PharmacyInventory.is_available == True,
                    or_(
                        PharmacyInventory.medicine_name.ilike(term),
                        PharmacyInventory.generic_name.ilike(term),
                        PharmacyInventory.brand_name.ilike(term),
                    ),
                )
                .offset(0).limit(size)
                .all()
            )
            for m in medicine_results:
                results.append(SearchResultItem(
                    id=m.id,
                    title=m.medicine_name,
                    type="medicine",
                    description=f"{m.generic_name or ''} • {m.category or ''}",
                    price=float(m.discounted_price or m.price or 0),
                    image=m.image_url,
                    extra={"form": m.form, "requires_prescription": m.requires_prescription, "pharmacy_id": m.pharmacy_id},
                ))

        # Sort by rating desc
        results.sort(key=lambda x: x.rating or 0, reverse=True)

        # Paginate
        total = len(results)
        pages = (total + size - 1) // size if size > 0 else 0
        paginated = results[(page - 1) * size: page * size]

        # Log search
        if user_id:
            log = SearchLog(
                user_id=user_id,
                query=query,
                type=search_type,
                results_count=total,
            )
            self.db.add(log)
            self.db.commit()

        return SearchResponse(
            query=query,
            results=paginated,
            total=total,
            page=page,
            size=size,
            pages=pages,
        )

    def get_search_history(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(SearchLog).filter(
            SearchLog.user_id == user_id,
        ).order_by(SearchLog.created_at.desc())

        total = query.count()
        logs = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [SearchLogResponse.model_validate(l) for l in logs],
            **build_pagination_meta(total, page, size),
        }
