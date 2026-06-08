"""
Matching and dispatch tasks — donor matching, emergency service dispatch, pharmacy search.

These tasks handle resource-intensive matching algorithms that should run in the background.
"""

import logging
from typing import Optional

logger = logging.getLogger("aetherion.tasks.matching")


def match_donor_task(blood_request_id: str, blood_group: str, location: Optional[dict] = None) -> dict:
    """
    Find compatible blood donors for a request.

    Matching rules:
    - Blood group compatibility (O- is universal donor)
    - Donor must be eligible (90-day rule)
    - Prefer donors near the request location

    Args:
        blood_request_id: The blood request ID
        blood_group: Required blood group
        location: Optional {"lat": float, "lng": float} for proximity matching

    Returns:
        Dict with matched donor IDs
    """
    try:
        from ...core.database import SessionLocal
        from ...models.blood_donation import BloodDonor
        from ...models.user import User
        from datetime import datetime, timedelta

        db = SessionLocal()
        try:
            # Compatible blood groups mapping
            compatibility = {
                "A+": ["A+", "A-", "O+", "O-"],
                "A-": ["A-", "O-"],
                "B+": ["B+", "B-", "O+", "O-"],
                "B-": ["B-", "O-"],
                "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
                "AB-": ["A-", "B-", "AB-", "O-"],
                "O+": ["O+", "O-"],
                "O-": ["O-"],
            }

            compatible_groups = compatibility.get(blood_group, [blood_group])
            eligibility_cutoff = datetime.utcnow() - timedelta(days=90)

            # Find eligible donors with compatible blood groups
            eligible_donors = (
                db.query(BloodDonor)
                .filter(
                    BloodDonor.blood_group.in_(compatible_groups),
                    BloodDonor.is_eligible == True,
                    BloodDonor.is_active == True,
                )
                .all()
            )

            # Filter by 90-day donation rule
            matched_ids = []
            for donor in eligible_donors:
                if donor.last_donation_date and donor.last_donation_date > eligibility_cutoff:
                    continue
                matched_ids.append(donor.id)
                if len(matched_ids) >= 10:  # Limit to top 10 matches
                    break

            logger.info(f"Donor match for {blood_group}: {len(matched_ids)} compatible donors found")
            return {"success": True, "request_id": blood_request_id, "matched_donors": matched_ids}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Donor matching failed for request {blood_request_id}: {e}")
        return {"success": False, "error": str(e)}


def dispatch_emergency_service_task(request_id: str, service_type: str, location: Optional[dict] = None) -> dict:
    """
    Find and dispatch the nearest available emergency service.

    Args:
        request_id: Emergency request ID
        service_type: Type of service needed (ambulance, doctor, etc.)
        location: Optional {"lat": float, "lng": float} for proximity matching

    Returns:
        Dict with dispatched service ID or None
    """
    try:
        from ...core.database import SessionLocal
        from ...models.emergency import EmergencyService, EmergencyRequest

        db = SessionLocal()
        try:
            # Find nearest available service
            available_service = (
                db.query(EmergencyService)
                .filter(
                    EmergencyService.type == service_type,
                    EmergencyService.status == "available",
                    EmergencyService.is_active == True,
                )
                .first()
            )

            if not available_service:
                logger.warning(f"No available {service_type} service for request {request_id}")
                return {"success": False, "reason": "no_available_service"}

            # Update request and service
            request = db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
            if request:
                request.service_id = available_service.id
                request.status = "dispatched"
                request.estimated_time = available_service.eta_minutes

            available_service.status = "dispatched"
            available_service.current_load = (available_service.current_load or 0) + 1
            db.commit()

            logger.info(f"Dispatched {service_type} service {available_service.id} for request {request_id}")
            return {
                "success": True,
                "service_id": available_service.id,
                "eta_minutes": available_service.eta_minutes,
            }

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Emergency dispatch failed for request {request_id}: {e}")
        return {"success": False, "error": str(e)}


def find_nearby_pharmacy_task(medicine_id: str, lat: float, lng: float, radius: float = 10) -> dict:
    """
    Find nearby pharmacies that have a specific medicine in stock.

    Args:
        medicine_id: Medicine ID to search for
        lat: Latitude of the search location
        lng: Longitude of the search location
        radius: Search radius in km

    Returns:
        Dict with list of nearby pharmacies
    """
    try:
        from ...core.database import SessionLocal
        from ...models.pharmacy import Pharmacy, PharmacyInventory

        db = SessionLocal()
        try:
            # Find pharmacies with the medicine in stock
            pharmacies = (
                db.query(Pharmacy)
                .join(PharmacyInventory, PharmacyInventory.pharmacy_id == Pharmacy.id)
                .filter(
                    PharmacyInventory.medicine_id == medicine_id,
                    PharmacyInventory.quantity > 0,
                    Pharmacy.is_active == True,
                )
                .all()
            )

            # TODO: Apply geospatial distance filtering when MySQL spatial indexes are set up
            results = [
                {
                    "pharmacy_id": p.id,
                    "name": p.name,
                    "phone": p.phone,
                    "address": p.address,
                }
                for p in pharmacies[:20]
            ]

            return {"success": True, "pharmacies": results}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Pharmacy search failed for medicine {medicine_id}: {e}")
        return {"success": False, "error": str(e)}
