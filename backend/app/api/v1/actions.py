"""
Aetherion Healthcare - Universal Action Router
================================================
Dynamic API router that handles all actions through a single pattern:
/api/v1/actions/{module}/{action}

Features:
- Automatic permission validation
- Service dispatch based on module
- Audit logging for authority role
- Unified error handling
- Action tracking
"""

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from typing import Any, Dict, Optional
from datetime import datetime

from ...core.database import get_db
from ...core.permissions import CurrentUser, AuditLogger, require_action
from ...core.permissions_def import ActionModule, Action, get_permission_for_action, ACTION_PERMISSIONS
from ...core.exceptions import ForbiddenException, BadRequestException, NotFoundException
from ...schemas.common import APIResponse

router = APIRouter(prefix="/actions", tags=["Universal Actions"])


# ============================================
# HELPER FUNCTIONS
# ============================================
def _get_current_user():
    """Lazy import to avoid circular dependency with auth_middleware."""
    from ...middleware.auth_middleware import get_current_user
    return get_current_user


def _get_available_actions(current_user: CurrentUser) -> list:
    """Get all actions the user can execute."""
    available_actions = []

    for (module_enum, action_enum), permission in ACTION_PERMISSIONS.items():
        can_execute = current_user.has_permission(permission)

        available_actions.append({
            "module": module_enum.value,
            "action": action_enum.value,
            "permission": permission.value,
            "allowed": can_execute,
        })

    return available_actions


# ============================================
# ACTION HANDLER MAPPING
# ============================================
ACTION_HANDLERS: Dict[tuple[ActionModule, Action], str] = {
    # Appointments
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_LIST): "appointment_service.list_appointments",
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_VIEW): "appointment_service.get_appointment",
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_BOOK): "appointment_service.book_appointment",
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_CANCEL): "appointment_service.cancel_appointment",
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_RESCHEDULE): "appointment_service.reschedule_appointment",
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_ACCEPT): "appointment_service.accept_appointment",
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_REJECT): "appointment_service.reject_appointment",

    # Prescriptions
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_LIST): "prescription_service.list_prescriptions",
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_VIEW): "prescription_service.get_prescription",
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_CREATE): "prescription_service.create_prescription",
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_UPDATE): "prescription_service.update_prescription",
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_REVOKE): "prescription_service.revoke_prescription",
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_DOWNLOAD): "prescription_service.download_prescription",

    # Patients
    (ActionModule.PATIENT, Action.PATIENT_LIST): "patient_service.list_patients",
    (ActionModule.PATIENT, Action.PATIENT_VIEW): "patient_service.get_patient",
    (ActionModule.PATIENT, Action.PATIENT_SEARCH): "patient_service.search_patients",
    (ActionModule.PATIENT, Action.PATIENT_MEDICAL_RECORDS): "patient_service.get_medical_records",

    # Doctors
    (ActionModule.DOCTOR, Action.DOCTOR_LIST): "doctor_service.list_doctors",
    (ActionModule.DOCTOR, Action.DOCTOR_VIEW): "doctor_service.get_doctor",
    (ActionModule.DOCTOR, Action.DOCTOR_SEARCH): "doctor_service.search_doctors",

    # Hospitals
    (ActionModule.HOSPITAL, Action.HOSPITAL_LIST): "hospital_service.list_hospitals",
    (ActionModule.HOSPITAL, Action.HOSPITAL_VIEW): "hospital_service.get_hospital",
    (ActionModule.HOSPITAL, Action.HOSPITAL_BED_ALLOCATE): "hospital_service.allocate_bed",
    (ActionModule.HOSPITAL, Action.HOSPITAL_BED_RELEASE): "hospital_service.release_bed",

    # Pharmacy
    (ActionModule.PHARMACY, Action.PHARMACY_LIST): "pharmacy_service.list_pharmacies",
    (ActionModule.PHARMACY, Action.PHARMACY_VIEW): "pharmacy_service.get_pharmacy",
    (ActionModule.PHARMACY, Action.PHARMACY_INVENTORY_ADD): "pharmacy_service.add_medicine",
    (ActionModule.PHARMACY, Action.PHARMACY_PRESCRIPTION_VERIFY): "pharmacy_service.verify_prescription",

    # Emergency
    (ActionModule.EMERGENCY, Action.EMERGENCY_CREATE): "emergency_service.create_request",
    (ActionModule.EMERGENCY, Action.EMERGENCY_LIST): "emergency_service.list_requests",
    (ActionModule.EMERGENCY, Action.EMERGENCY_UPDATE): "emergency_service.update_request",
    (ActionModule.EMERGENCY, Action.EMERGENCY_CANCEL): "emergency_service.cancel_request",

    # Blood Donation
    (ActionModule.BLOOD_DONATION, Action.BLOOD_DONOR_REGISTER): "blood_service.register_donor",
    (ActionModule.BLOOD_DONATION, Action.BLOOD_REQUEST_CREATE): "blood_service.create_request",
    (ActionModule.BLOOD_DONATION, Action.BLOOD_INVENTORY_VIEW): "blood_service.get_inventory",

    # Oxygen
    (ActionModule.OXYGEN, Action.OXYGEN_REQUEST_CREATE): "oxygen_service.create_request",
    (ActionModule.OXYGEN, Action.OXYGEN_REQUEST_VIEW): "oxygen_service.get_request",

    # Users (Admin)
    (ActionModule.USER, Action.USER_LIST): "user_service.list_users",
    (ActionModule.USER, Action.USER_VIEW): "user_service.get_user",
    (ActionModule.USER, Action.USER_CREATE): "user_service.create_user",
    (ActionModule.USER, Action.USER_UPDATE): "user_service.update_user",
    (ActionModule.USER, Action.USER_DELETE): "user_service.delete_user",
    (ActionModule.USER, Action.USER_BLOCK): "user_service.block_user",
    (ActionModule.USER, Action.USER_UNBLOCK): "user_service.unblock_user",

    # Admin
    (ActionModule.ADMIN, Action.ADMIN_STATS): "admin_service.get_dashboard",
    (ActionModule.ADMIN, Action.ADMIN_VERIFICATIONS): "admin_service.get_verifications",
    (ActionModule.ADMIN, Action.ADMIN_AUDIT_LOGS): "admin_service.get_audit_logs",

    # Authority
    (ActionModule.AUTHORITY, Action.AUTHORITY_AUDIT_LOGS): "admin_service.get_audit_logs",
    (ActionModule.AUTHORITY, Action.AUTHORITY_COMPLIANCE_REPORTS): "admin_service.get_compliance_reports",
    (ActionModule.AUTHORITY, Action.AUTHORITY_SYSTEM_LOGS): "admin_service.get_system_logs",
    (ActionModule.AUTHORITY, Action.AUTHORITY_INCIDENT_INVESTIGATE): "admin_service.investigate_incident",
}


# ============================================
# SERVICE DISPATCHER
# ============================================
async def dispatch_action(
    module: ActionModule,
    action: Action,
    request: Request,
    current_user: CurrentUser,
    db: Session,
    data: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Dispatch an action to the appropriate service handler.
    """
    handler_path = ACTION_HANDLERS.get((module, action))

    if not handler_path:
        raise BadRequestException(f"Action '{action.value}' not supported for module '{module.value}'")

    # Parse handler path: "service_name.method_name"
    try:
        service_name, method_name = handler_path.split(".")
    except ValueError:
        raise BadRequestException(f"Invalid handler configuration for action '{action.value}'")

    # Import service dynamically
    try:
        service_module = __import__(
            f"app.services.{service_name}",
            fromlist=[service_name.replace("_service", "").capitalize()]
        )
        service_class = getattr(service_module, service_name.replace("_service", "").capitalize() + "Service")
        service_instance = service_class(db)
    except (ImportError, AttributeError) as e:
        raise BadRequestException(f"Service not found: {service_name}")

    # Get method
    try:
        handler_method = getattr(service_instance, method_name)
    except AttributeError:
        raise BadRequestException(f"Method '{method_name}' not found in service '{service_name}'")

    # Call handler with appropriate arguments
    try:
        # Prepare kwargs
        kwargs = {
            "current_user": current_user,
            "request": request,
        }

        # Add data and params
        if data:
            kwargs.update(data)
        if params:
            kwargs.update(params)

        # Call the handler
        result = await handler_method(**kwargs)

        # Log to audit trail if needed
        if AuditLogger.should_log(current_user):
            await AuditLogger.log_action(
                request=request,
                current_user=current_user,
                action=f"{module.value}.{action.value}",
                module=module.value,
                resource_id=params.get("id") if params else None,
                metadata={"data": data} if data else None,
                success=True,
            )

        return result

    except Exception as e:
        # Log failure to audit trail
        if AuditLogger.should_log(current_user):
            await AuditLogger.log_action(
                request=request,
                current_user=current_user,
                action=f"{module.value}.{action.value}",
                module=module.value,
                resource_id=params.get("id") if params else None,
                metadata={"data": data} if data else None,
                success=False,
                error_message=str(e),
            )

        # Re-raise known exceptions
        if isinstance(e, (ForbiddenException, BadRequestException, NotFoundException)):
            raise e

        # Wrap unknown exceptions
        raise BadRequestException(f"Action execution failed: {str(e)}")


# ============================================
# UNIVERSAL ACTION ENDPOINT
# ============================================
@router.post("/{module}/{action}", response_model=APIResponse)
async def execute_action(
    module: str,
    action: str,
    request: Request,
    data: Optional[Dict[str, Any]] = None,
    current_user: CurrentUser = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """
    Universal action endpoint - Execute any action on any module.

    Pattern: POST /api/v1/actions/{module}/{action}

    Modules:
      - appointment: book, cancel, reschedule, accept, reject
      - prescription: create, update, revoke, download
      - patient: list, view, search, medical_records
      - doctor: list, view, search
      - hospital: list, view, bed_allocate, bed_release
      - pharmacy: list, view, inventory_add, prescription_verify
      - emergency: create, list, update, cancel
      - blood_donation: donor_register, request_create, inventory_view
      - oxygen: request_create, request_view
      - user: list, view, create, update, delete, block, unblock
      - admin: stats, verifications, audit_logs
      - authority: audit_logs, compliance_reports, system_logs, incident_investigate

    Permission: Automatically validated based on action and user role.

    Request Body (JSON):
      {
        "data": { ... },  // Action-specific data
        "params": { ... } // Path/query parameters
      }

    Response:
      {
        "success": true,
        "message": "Action executed successfully",
        "data": { ... }  // Action-specific response
      }
    """
    # Parse module and action
    try:
        module_enum = ActionModule(module.lower())
    except ValueError:
        raise BadRequestException(f"Invalid module: {module}. Available: {[m.value for m in ActionModule]}")

    try:
        action_enum = Action(action.lower())
    except ValueError:
        raise BadRequestException(f"Invalid action: {action}. Available: {[a.value for a in Action]}")

    # Check permission
    if not current_user.can_execute_action(module_enum, action_enum):
        required_permission = get_permission_for_action(module_enum, action_enum)
        raise ForbiddenException(
            f"Access denied. Action '{action}' on module '{module}' requires permission: {required_permission.value if required_permission else 'unknown'}"
        )

    # Extract data and params from request body
    request_body = data or {}
    action_data = request_body.get("data", {})
    action_params = request_body.get("params", {})

    # Extract path parameters
    path_params = dict(request.path_params)
    action_params.update(path_params)

    # Extract query parameters
    query_params = dict(request.query_params)
    action_params.update(query_params)

    # Dispatch action
    result = await dispatch_action(
        module=module_enum,
        action=action_enum,
        request=request,
        current_user=current_user,
        db=db,
        data=action_data,
        params=action_params,
    )

    return APIResponse(
        success=True,
        message=f"Action '{action}' on module '{module}' executed successfully",
        data=result,
    )


@router.get("/{module}/{action}", response_model=APIResponse)
async def get_action(
    module: str,
    action: str,
    request: Request,
    current_user: CurrentUser = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """
    GET version of universal action endpoint for read-only actions.

    Same as POST but doesn't accept request body.
    """
    return await execute_action(
        module=module,
        action=action,
        request=request,
        data={"params": {}},
        current_user=current_user,
        db=db,
    )


# ============================================
# ACTION DISCOVERY ENDPOINT
# ============================================
@router.get("/discover", response_model=APIResponse)
async def discover_actions(
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Discover all available actions for the current user.

    Returns:
      {
        "success": true,
        "message": "Actions discovered",
        "data": {
          "actions": [
            {
              "module": "appointment",
              "action": "book",
              "permission": "appointment.book",
              "allowed": true
            },
            ...
          ],
          "total": 42
        }
      }
    """
    user_actions = []

    for (module_enum, action_enum), handler_path in ACTION_HANDLERS.items():
        required_permission = get_permission_for_action(module_enum, action_enum)

        # Check if user can execute this action
        can_execute = current_user.can_execute_action(module_enum, action_enum)

        user_actions.append({
            "module": module_enum.value,
            "action": action_enum.value,
            "handler": handler_path,
            "permission": required_permission.value if required_permission else None,
            "allowed": can_execute,
        })

    return APIResponse(
        success=True,
        message=f"Discovered {len(user_actions)} actions for user",
        data={
            "actions": user_actions,
            "total": len(user_actions),
        },
    )


# ============================================
# HELPER FUNCTION
# ============================================
def _get_current_user():
    """Lazy import to avoid circular dependency with auth_middleware."""
    from ...middleware.auth_middleware import get_current_user
    return get_current_user