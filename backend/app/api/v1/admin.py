from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.admin import VerificationActionRequest, FeedbackResolveRequest
from ...services.admin_service import AdminService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser, require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_admin_dashboard(db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.get_dashboard()
    return APIResponse(success=True, message="Dashboard retrieved", data=result)


@router.get("/verifications", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_verifications(status: Optional[str] = Query(None), page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.get_verifications(status=status, page=page, size=size)
    return APIResponse(success=True, message="Verifications retrieved", data=result)


@router.put("/verifications/{verification_id}", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def process_verification(verification_id: str, data: VerificationActionRequest, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    service = AdminService(db)
    result = service.process_verification(verification_id, current_user.id, data)
    event_bus = get_event_bus()
    event_type = EventType.VERIFICATION_APPROVED if data.status == "approved" else EventType.VERIFICATION_REJECTED
    await event_bus.dispatch(
        Event(type=event_type, payload={"verification_id": verification_id, "admin_id": current_user.id, "status": data.status, "notes": data.notes if hasattr(data, "notes") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message=f"Verification {data.status}", data=result)


@router.get("/audit-logs", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_audit_logs(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), user_id: Optional[str] = Query(None), action: Optional[str] = Query(None), db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.get_audit_logs(page=page, size=size, user_id=user_id, action=action)
    return APIResponse(success=True, message="Audit logs retrieved", data=result)


@router.get("/feedback", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_feedback(status: Optional[str] = Query(None), page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.get_feedback(status=status, page=page, size=size)
    return APIResponse(success=True, message="Feedback retrieved", data=result)


@router.put("/feedback/{feedback_id}/resolve", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def resolve_feedback(feedback_id: str, data: FeedbackResolveRequest, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.resolve_feedback(feedback_id, current_user.id, data)
    return APIResponse(success=True, message="Feedback resolved", data=result)


@router.patch("/users/{user_id}/toggle-active", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def toggle_user_active(user_id: str, isActive: bool = Body(..., embed=True), db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.toggle_user_active(user_id, isActive)
    return APIResponse(success=True, message="User status updated", data=result)


@router.get("/users", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_users(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all registered users with their role, status, and verification info."""
    service = AdminService(db)
    result = service.get_users(page=page, size=size, search=search, role=role, status=status)
    return APIResponse(success=True, message="Users retrieved", data=result)


@router.get("/stats", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_system_stats(db: Session = Depends(get_db)):
    service = AdminService(db)
    result = service.get_system_stats()
    return APIResponse(success=True, message="Stats retrieved", data=result)
