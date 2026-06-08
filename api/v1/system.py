"""
Aetherion Healthcare - System Discovery API
===========================================
Frontend uses these endpoints to:
- Get user permissions and features
- Discover available UI modules
- Get role-based configuration
- Auto-build UI based on permissions

Frontend Flow:
1. Login → Get JWT token
2. GET /api/v1/auth/me → Get permissions, features, role config
3. GET /api/v1/system/features → Get role-based feature list
4. GET /api/v1/system/openapi-roles → Get API documentation by role
5. Frontend builds UI automatically
"""

from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.permissions import CurrentUser, _get_current_user
from ...core.permissions_def import (
    Role, Feature, ActionModule, Action,
    ROLE_PERMISSIONS, ROLE_FEATURES,
    ACTION_PERMISSIONS, get_permission_for_action,
)
from ...schemas.common import APIResponse

router = APIRouter(prefix="/system", tags=["System Discovery"])


# ============================================
# AUTH ME (User Profile with Permissions)
# ============================================
@router.get("/auth/me", response_model=APIResponse)
async def get_auth_me(
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get current user profile with permissions and features.

    This is the KEY endpoint for frontend auto-UI generation.

    Response:
      {
        "success": true,
        "message": "User profile retrieved",
        "data": {
          "user": {
            "id": "uuid",
            "email": "user@example.com",
            "full_name": "John Doe",
            "role": "doctor",
            "roles": ["doctor"],
            "primary_role": "doctor"
          },
          "permissions": [
            "doctor.view_patients",
            "doctor.write_prescription",
            "doctor.manage_appointments",
            ...
          ],
          "features": [
            "dashboard",
            "profile",
            "patient_list",
            "patient_details",
            "write_prescription",
            ...
          ],
          "can_execute_actions": [
            {
              "module": "appointment",
              "action": "accept",
              "allowed": true
            },
            ...
          ],
          "dashboard_config": {
            "layout": "doctor",
            "widgets": [...],
            "navigation": [...]
          },
          "is_full_access": false
        }
      }
    """
    # Get permission summary
    permission_summary = current_user.get_permission_summary()

    # Get dashboard configuration based on role
    dashboard_config = _get_dashboard_config(current_user.primary_role)

    # Get available actions
    can_execute_actions = _get_available_actions(current_user)

    return APIResponse(
        success=True,
        message="User profile retrieved with permissions",
        data={
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "role": current_user.primary_role,
                "roles": current_user.roles,
                "primary_role": current_user.primary_role,
                "is_active": current_user.is_active,
                "is_verified": current_user.is_verified,
                "is_admin_approved": current_user.is_admin_approved,
            },
            "permissions": permission_summary["permissions"],
            "features": permission_summary["features"],
            "can_execute_actions": can_execute_actions,
            "dashboard_config": dashboard_config,
            "is_full_access": permission_summary["is_full_access"],
        },
    )


# ============================================
# SYSTEM FEATURES (Role-Based)
# ============================================
@router.get("/features", response_model=APIResponse)
async def get_system_features(
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get all available features for the current user's role.

    Response:
      {
        "success": true,
        "message": "Features retrieved",
        "data": {
          "features": [
            {
              "id": "dashboard",
              "name": "Dashboard",
              "icon": "layout",
              "route": "/doctor/dashboard",
              "permission": "doctor.view_dashboard",
              "enabled": true,
              "category": "core"
            },
            ...
          ],
          "categories": [
            {
              "id": "core",
              "name": "Core",
              "features": ["dashboard", "profile", "notifications"]
            },
            ...
          ]
        }
      }
    """
    user_features = current_user.get_all_features()

    # Get feature definitions
    feature_definitions = _get_feature_definitions(user_features)

    # Group by category
    categories = _group_features_by_category(feature_definitions)

    return APIResponse(
        success=True,
        message=f"Retrieved {len(feature_definitions)} features for role: {current_user.primary_role}",
        data={
            "features": feature_definitions,
            "categories": categories,
            "total": len(feature_definitions),
        },
    )


# ============================================
# OPENAPI BY ROLE (API Discovery)
# ============================================
@router.get("/openapi-roles", response_model=APIResponse)
async def get_openapi_by_role(
    role: str = None,
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get API endpoints grouped by role.

    Useful for frontend to auto-generate API clients or documentation.

    Query params:
      - role: Filter by specific role (optional, defaults to current user's role)

    Response:
      {
        "success": true,
        "message": "API endpoints retrieved",
        "data": {
          "role": "doctor",
          "endpoints": [
            {
              "path": "/api/v1/actions/appointment/book",
              "method": "POST",
              "permission": "appointment.book",
              "description": "Book an appointment",
              "parameters": {...},
              "response": {...}
            },
            ...
          ],
          "total": 42
        }
      }
    """
    target_role = role or current_user.primary_role

    # Get all endpoints for the role
    role_endpoints = _get_endpoints_for_role(target_role)

    return APIResponse(
        success=True,
        message=f"Retrieved {len(role_endpoints)} endpoints for role: {target_role}",
        data={
            "role": target_role,
            "endpoints": role_endpoints,
            "total": len(role_endpoints),
        },
    )


# ============================================
# ROLE DEFINITIONS (All Roles)
# ============================================
@router.get("/roles", response_model=APIResponse)
async def get_role_definitions(
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get all role definitions with permissions and features.

    Only accessible to admins and authority roles.

    Response:
      {
        "success": true,
        "message": "Role definitions retrieved",
        "data": {
          "roles": [
            {
              "name": "doctor",
              "display_name": "Doctor",
              "permissions": [...],
              "features": [...],
              "level": 2
            },
            ...
          ]
        }
      }
    """
    # Only admin and authority can view all roles
    if not (current_user.is_admin or current_user.is_authority):
        from ...core.exceptions import ForbiddenException
        raise ForbiddenException("Only admins and authority can view all role definitions")

    role_definitions = []

    for role_enum, permissions in ROLE_PERMISSIONS.items():
        features = ROLE_FEATURES.get(role_enum, set())

        role_definitions.append({
            "name": role_enum.value,
            "display_name": _get_role_display_name(role_enum),
            "permissions": [p.value for p in permissions],
            "features": [f.value for f in features],
            "level": _get_role_level(role_enum),
            "permission_count": len(permissions),
            "feature_count": len(features),
        })

    return APIResponse(
        success=True,
        message="Role definitions retrieved",
        data={
            "roles": role_definitions,
            "total": len(role_definitions),
        },
    )


# ============================================
# ACTION DEFINITIONS (All Actions)
# ============================================
@router.get("/actions", response_model=APIResponse)
async def get_action_definitions(
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get all available actions with their permissions.

    Response:
      {
        "success": true,
        "message": "Action definitions retrieved",
        "data": {
          "actions": [
            {
              "module": "appointment",
              "action": "book",
              "permission": "appointment.book",
              "description": "Book a new appointment"
            },
            ...
          ],
          "modules": ["appointment", "prescription", "patient", ...],
          "total": 42
        }
      }
    """
    action_definitions = []

    for (module_enum, action_enum), permission in ACTION_PERMISSIONS.items():
        action_definitions.append({
            "module": module_enum.value,
            "action": action_enum.value,
            "permission": permission.value,
            "description": _get_action_description(module_enum, action_enum),
        })

    modules = list(set(a["module"] for a in action_definitions))

    return APIResponse(
        success=True,
        message=f"Retrieved {len(action_definitions)} action definitions",
        data={
            "actions": action_definitions,
            "modules": modules,
            "total": len(action_definitions),
        },
    )


# ============================================
# PERMISSION DEFINITIONS (All Permissions)
# ============================================
@router.get("/permissions", response_model=APIResponse)
async def get_permission_definitions(
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get all permission definitions.

    Response:
      {
        "success": true,
        "message": "Permission definitions retrieved",
        "data": {
          "permissions": [
            {
              "name": "doctor.view_patients",
              "category": "doctor",
              "description": "View patient list"
            },
            ...
          ],
          "categories": ["doctor", "hospital", "pharmacy", ...],
          "total": 84
        }
      }
    """
    permission_definitions = []

    for permission_enum in list(Permission):
        # Skip FULL_ACCESS (it's a meta-permission)
        if permission_enum == Permission.FULL_ACCESS:
            continue

        category = permission_enum.value.split(".")[0]
        permission_definitions.append({
            "name": permission_enum.value,
            "category": category,
            "description": _get_permission_description(permission_enum),
        })

    categories = list(set(p["category"] for p in permission_definitions))

    return APIResponse(
        success=True,
        message=f"Retrieved {len(permission_definitions)} permission definitions",
        data={
            "permissions": permission_definitions,
            "categories": categories,
            "total": len(permission_definitions),
        },
    )


# ============================================
# DASHBOARD CONFIGURATION (By Role)
# ============================================
@router.get("/dashboard-config", response_model=APIResponse)
async def get_dashboard_configuration(
    role: str = None,
    current_user: CurrentUser = Depends(_get_current_user),
):
    """
    Get dashboard configuration for a specific role.

    Query params:
      - role: Target role (optional, defaults to current user's role)

    Response:
      {
        "success": true,
        "message": "Dashboard configuration retrieved",
        "data": {
          "role": "doctor",
          "layout": "doctor",
          "widgets": [
            {
              "id": "appointments_today",
              "title": "Today's Appointments",
              "type": "list",
              "permission": "doctor.view_appointments",
              "size": "large"
            },
            ...
          ],
          "navigation": [...],
          "quick_actions": [...]
        }
      }
    """
    target_role = role or current_user.primary_role

    dashboard_config = _get_dashboard_config(target_role)

    return APIResponse(
        success=True,
        message="Dashboard configuration retrieved",
        data=dashboard_config,
    )


# ============================================
# HELPER FUNCTIONS
# ============================================

def _get_dashboard_config(role: str) -> Dict[str, Any]:
    """Get dashboard configuration based on role."""
    configs = {
        Role.PATIENT.value: {
            "layout": "patient",
            "title": "Patient Dashboard",
            "widgets": [
                {
                    "id": "upcoming_appointments",
                    "title": "Upcoming Appointments",
                    "type": "list",
                    "permission": Permission.APPOINTMENT_VIEW.value,
                    "size": "large",
                    "route": "/patient/appointments",
                },
                {
                    "id": "my_prescriptions",
                    "title": "My Prescriptions",
                    "type": "list",
                    "permission": Permission.PRESCRIPTION_VIEW.value,
                    "size": "medium",
                    "route": "/patient/prescriptions",
                },
                {
                    "id": "quick_actions",
                    "title": "Quick Actions",
                    "type": "actions",
                    "permission": None,
                    "size": "small",
                    "actions": [
                        {
                            "label": "Book Appointment",
                            "action": "appointment.book",
                            "permission": Permission.APPOINTMENT_BOOK.value,
                            "route": "/patient/appointments/book",
                        },
                        {
                            "label": "Find Doctor",
                            "action": "doctor.search",
                            "permission": Permission.SEARCH_DOCTORS.value,
                            "route": "/patient/find-doctor",
                        },
                    ],
                },
            ],
        },
        Role.DOCTOR.value: {
            "layout": "doctor",
            "title": "Doctor Dashboard",
            "widgets": [
                {
                    "id": "appointments_today",
                    "title": "Today's Appointments",
                    "type": "list",
                    "permission": Permission.DOCTOR_VIEW_APPOINTMENTS.value,
                    "size": "large",
                    "route": "/doctor/appointments",
                },
                {
                    "id": "patient_list",
                    "title": "Recent Patients",
                    "type": "list",
                    "permission": Permission.DOCTOR_VIEW_PATIENTS.value,
                    "size": "medium",
                    "route": "/doctor/patients",
                },
                {
                    "id": "quick_actions",
                    "title": "Quick Actions",
                    "type": "actions",
                    "permission": None,
                    "size": "small",
                    "actions": [
                        {
                            "label": "Write Prescription",
                            "action": "prescription.create",
                            "permission": Permission.DOCTOR_WRITE_PRESCRIPTION.value,
                            "route": "/doctor/prescriptions/create",
                        },
                        {
                            "label": "View Medical Records",
                            "action": "patient.medical_records",
                            "permission": Permission.DOCTOR_VIEW_MEDICAL_RECORDS.value,
                            "route": "/doctor/patients",
                        },
                    ],
                },
            ],
        },
        Role.HOSPITAL_ADMIN.value: {
            "layout": "hospital",
            "title": "Hospital Dashboard",
            "widgets": [
                {
                    "id": "bed_status",
                    "title": "Bed Status",
                    "type": "stats",
                    "permission": Permission.HOSPITAL_VIEW_BED_STATUS.value,
                    "size": "large",
                    "route": "/hospital/beds",
                },
                {
                    "id": "emergency_queue",
                    "title": "Emergency Queue",
                    "type": "list",
                    "permission": Permission.HOSPITAL_MANAGE_EMERGENCY_QUEUE.value,
                    "size": "medium",
                    "route": "/hospital/emergency",
                },
                {
                    "id": "staff_status",
                    "title": "Staff Status",
                    "type": "list",
                    "permission": Permission.HOSPITAL_MANAGE_STAFF.value,
                    "size": "medium",
                    "route": "/hospital/staff",
                },
            ],
        },
        Role.PHARMACY_ADMIN.value: {
            "layout": "pharmacy",
            "title": "Pharmacy Dashboard",
            "widgets": [
                {
                    "id": "inventory_alerts",
                    "title": "Inventory Alerts",
                    "type": "list",
                    "permission": Permission.PHARMACY_VIEW_STOCK_ALERTS.value,
                    "size": "large",
                    "route": "/pharmacy/inventory",
                },
                {
                    "id": "prescription_queue",
                    "title": "Prescription Queue",
                    "type": "list",
                    "permission": Permission.PHARMACY_VIEW_PRESCRIPTIONS.value,
                    "size": "medium",
                    "route": "/pharmacy/prescriptions",
                },
            ],
        },
        Role.ADMIN.value: {
            "layout": "admin",
            "title": "Admin Dashboard",
            "widgets": [
                {
                    "id": "system_stats",
                    "title": "System Statistics",
                    "type": "stats",
                    "permission": Permission.ADMIN_VIEW_STATISTICS.value,
                    "size": "large",
                    "route": "/admin/stats",
                },
                {
                    "id": "pending_verifications",
                    "title": "Pending Verifications",
                    "type": "list",
                    "permission": Permission.ADMIN_VIEW_USERS.value,
                    "size": "medium",
                    "route": "/admin/verifications",
                },
                {
                    "id": "recent_activity",
                    "title": "Recent Activity",
                    "type": "list",
                    "permission": Permission.ADMIN_VIEW_STATISTICS.value,
                    "size": "medium",
                    "route": "/admin/activity",
                },
            ],
        },
        Role.AUTHORITY.value: {
            "layout": "authority",
            "title": "Authority Dashboard",
            "widgets": [
                {
                    "id": "audit_logs",
                    "title": "Recent Audit Logs",
                    "type": "list",
                    "permission": Permission.AUTHORITY_VIEW_AUDIT_LOGS.value,
                    "size": "large",
                    "route": "/authority/audit-logs",
                },
                {
                    "id": "compliance_status",
                    "title": "Compliance Status",
                    "type": "stats",
                    "permission": Permission.AUTHORITY_VIEW_COMPLIANCE_REPORTS.value,
                    "size": "medium",
                    "route": "/authority/compliance",
                },
            ],
        },
    }

    return configs.get(role, {
        "layout": "default",
        "title": "Dashboard",
        "widgets": [],
    })


def _get_available_actions(current_user: CurrentUser) -> List[Dict[str, Any]]:
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


def _get_feature_definitions(features: set) -> List[Dict[str, Any]]:
    """Get detailed feature definitions."""
    feature_info = {
        Feature.DASHBOARD.value: {"name": "Dashboard", "icon": "layout", "category": "core"},
        Feature.PROFILE.value: {"name": "Profile", "icon": "user", "category": "core"},
        Feature.NOTIFICATIONS.value: {"name": "Notifications", "icon": "bell", "category": "core"},
        Feature.MESSAGING.value: {"name": "Messaging", "icon": "message-square", "category": "core"},
        Feature.SEARCH.value: {"name": "Search", "icon": "search", "category": "core"},
        Feature.MY_APPOINTMENTS.value: {"name": "My Appointments", "icon": "calendar", "category": "patient"},
        Feature.MY_PRESCRIPTIONS.value: {"name": "My Prescriptions", "icon": "file-text", "category": "patient"},
        Feature.MEDICAL_RECORDS.value: {"name": "Medical Records", "icon": "heart", "category": "patient"},
        Feature.FIND_DOCTORS.value: {"name": "Find Doctors", "icon": "stethoscope", "category": "patient"},
        Feature.FIND_HOSPITALS.value: {"name": "Find Hospitals", "icon": "building", "category": "patient"},
        Feature.PATIENT_LIST.value: {"name": "Patient List", "icon": "users", "category": "doctor"},
        Feature.PATIENT_DETAILS.value: {"name": "Patient Details", "icon": "user", "category": "doctor"},
        Feature.WRITE_PRESCRIPTION.value: {"name": "Write Prescription", "icon": "file-plus", "category": "doctor"},
        Feature.HOSPITAL_DASHBOARD.value: {"name": "Hospital Dashboard", "icon": "layout", "category": "hospital"},
        Feature.BED_MANAGEMENT.value: {"name": "Bed Management", "icon": "bed", "category": "hospital"},
        Feature.ICU_MANAGEMENT.value: {"name": "ICU Management", "icon": "activity", "category": "hospital"},
        Feature.PHARMACY_DASHBOARD.value: {"name": "Pharmacy Dashboard", "icon": "layout", "category": "pharmacy"},
        Feature.MEDICINE_INVENTORY.value: {"name": "Medicine Inventory", "icon": "package", "category": "pharmacy"},
        Feature.ADMIN_DASHBOARD.value: {"name": "Admin Dashboard", "icon": "layout", "category": "admin"},
        Feature.USER_MANAGEMENT.value: {"name": "User Management", "icon": "users", "category": "admin"},
        Feature.AUTHORITY_DASHBOARD.value: {"name": "Authority Dashboard", "icon": "shield", "category": "authority"},
        Feature.COMPLIANCE_REPORTS.value: {"name": "Compliance Reports", "icon": "file-check", "category": "authority"},
    }

    definitions = []

    for feature_id in features:
        info = feature_info.get(feature_id, {
            "name": feature_id.replace("_", " ").title(),
            "icon": "circle",
            "category": "other",
        })

        definitions.append({
            "id": feature_id,
            **info,
            "route": f"/{info['category']}/{feature_id}",
        })

    return definitions


def _group_features_by_category(features: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Group features by category."""
    categories = {}

    for feature in features:
        category = feature["category"]

        if category not in categories:
            categories[category] = {
                "id": category,
                "name": category.capitalize(),
                "features": [],
            }

        categories[category]["features"].append(feature["id"])

    return list(categories.values())


def _get_endpoints_for_role(role: str) -> List[Dict[str, Any]]:
    """Get all endpoints accessible by a role."""
    endpoints = []

    for (module_enum, action_enum), permission in ACTION_PERMISSIONS.items():
        # Check if role has permission
        try:
            role_enum = Role(role)
            if permission in ROLE_PERMISSIONS.get(role_enum, set()):
                endpoints.append({
                    "path": f"/api/v1/actions/{module_enum.value}/{action_enum.value}",
                    "method": "POST",
                    "permission": permission.value,
                    "description": _get_action_description(module_enum, action_enum),
                })
        except ValueError:
            continue

    return endpoints


def _get_role_display_name(role_enum: Role) -> str:
    """Get display name for a role."""
    display_names = {
        Role.PATIENT: "Patient",
        Role.DOCTOR: "Doctor",
        Role.HOSPITAL_ADMIN: "Hospital Admin",
        Role.PHARMACY_ADMIN: "Pharmacy Admin",
        Role.ADMIN: "Admin",
        Role.SUPER_ADMIN: "Super Admin",
        Role.AUTHORITY: "Authority",
        Role.BLOOD_DONOR: "Blood Donor",
        Role.EMERGENCY_VOLUNTEER: "Emergency Volunteer",
    }
    return display_names.get(role_enum, role_enum.value.replace("_", " ").title())


def _get_role_level(role_enum: Role) -> int:
    """Get hierarchical level for a role."""
    levels = {
        Role.PATIENT: 1,
        Role.BLOOD_DONOR: 1,
        Role.EMERGENCY_VOLUNTEER: 1,
        Role.DOCTOR: 2,
        Role.HOSPITAL_ADMIN: 2,
        Role.PHARMACY_ADMIN: 2,
        Role.ADMIN: 3,
        Role.SUPER_ADMIN: 3,
        Role.AUTHORITY: 4,
    }
    return levels.get(role_enum, 0)


def _get_action_description(module_enum: ActionModule, action_enum: Action) -> str:
    """Get description for an action."""
    descriptions = {
        (ActionModule.APPOINTMENT, Action.APPOINTMENT_BOOK): "Book a new appointment",
        (ActionModule.APPOINTMENT, Action.APPOINTMENT_CANCEL): "Cancel an appointment",
        (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_CREATE): "Create a new prescription",
        (ActionModule.PATIENT, Action.PATIENT_VIEW): "View patient details",
        # Add more as needed
    }
    return descriptions.get((module_enum, action_enum), f"{action_enum.value} {module_enum.value}")


def _get_permission_description(permission_enum: Permission) -> str:
    """Get description for a permission."""
    descriptions = {
        Permission.PATIENT_VIEW_PROFILE: "View own profile",
        Permission.APPOINTMENT_BOOK: "Book new appointments",
        Permission.DOCTOR_VIEW_PATIENTS: "View patient list",
        Permission.DOCTOR_WRITE_PRESCRIPTION: "Write prescriptions",
        # Add more as needed
    }
    return descriptions.get(permission_enum, permission_enum.value.replace("_", " ").title())


# Import Permission at the end to avoid circular import
from ...core.permissions_def import Permission