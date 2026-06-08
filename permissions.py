"""
Aetherion Healthcare - Dynamic Permission System
================================================
Integrates with permissions_def.py to provide:
- Dynamic role/permission checking
- Permission-based dependencies for FastAPI
- Action-level authorization for universal API
- CurrentUser with permission methods
- Audit logging for authority role
"""

from fastapi import Depends, Request
from typing import List, Optional, Set, Any
from functools import wraps

from .permissions_def import (
    Role, Permission, Feature, ActionModule, Action,
    get_permissions_for_role, get_features_for_role,
    has_permission, has_any_permission, has_all_permissions,
    get_permission_for_action, can_execute_action,
)
from .exceptions import ForbiddenException, UnauthorizedException


# ============================================
# CURRENT USER (Extended with Permissions)
# ============================================
class CurrentUser:
    """
    Represents the authenticated user with role-aware permission checking.
    """

    def __init__(
        self,
        id: str,
        email: str,
        full_name: str,
        role: str,
        roles: List[str],
        primary_role: str,
        is_active: bool = True,
        is_admin_approved: bool = False,
        is_verified: bool = False,
        permissions: Optional[Set[Permission]] = None,
        features: Optional[Set[Feature]] = None,
    ):
        self.id = id
        self.email = email
        self.full_name = full_name
        self.role = role
        self.roles = roles
        self.primary_role = primary_role
        self.is_active = is_active
        self.is_admin_approved = is_admin_approved
        self.is_verified = is_verified

        # Load permissions and features based on roles
        self._permissions = permissions or self._load_permissions()
        self._features = features or self._load_features()

    def _load_permissions(self) -> Set[Permission]:
        """Load all permissions for user's roles."""
        all_permissions = set()
        for role_str in self.roles:
            try:
                role_enum = Role(role_str)
                all_permissions.update(get_permissions_for_role(role_enum))
            except ValueError:
                # Invalid role, skip
                continue
        return all_permissions

    def _load_features(self) -> Set[Feature]:
        """Load all features for user's roles."""
        all_features = set()
        for role_str in self.roles:
            try:
                role_enum = Role(role_str)
                all_features.update(get_features_for_role(role_enum))
            except ValueError:
                # Invalid role, skip
                continue
        return all_features

    # ==================== ROLE CHECKING ====================
    def has_role(self, role: str) -> bool:
        """Check if user has a specific role."""
        return role in self.roles

    def has_any_role(self, roles: List[str]) -> bool:
        """Check if user has any of the specified roles."""
        return bool(set(self.roles) & set(roles))

    def has_all_roles(self, roles: List[str]) -> bool:
        """Check if user has all of the specified roles."""
        return set(roles).issubset(set(self.roles))

    # ==================== PERMISSION CHECKING ====================
    def has_permission(self, permission: Permission) -> bool:
        """Check if user has a specific permission."""
        return permission in self._permissions

    def has_any_permission(self, permissions: Set[Permission]) -> bool:
        """Check if user has any of the specified permissions."""
        return bool(self._permissions & permissions)

    def has_all_permissions(self, permissions: Set[Permission]) -> bool:
        """Check if user has all of the specified permissions."""
        return permissions.issubset(self._permissions)

    def has_permission_by_name(self, permission_name: str) -> bool:
        """Check permission by string name."""
        try:
            permission = Permission(permission_name)
            return self.has_permission(permission)
        except ValueError:
            return False

    def get_all_permissions(self) -> Set[str]:
        """Get all permissions as strings."""
        return {p.value for p in self._permissions}

    # ==================== FEATURE CHECKING ====================
    def has_feature(self, feature: Feature) -> bool:
        """Check if user can access a specific UI feature."""
        return feature in self._features

    def has_any_feature(self, features: Set[Feature]) -> bool:
        """Check if user can access any of the specified features."""
        return bool(self._features & features)

    def get_all_features(self) -> Set[str]:
        """Get all features as strings."""
        return {f.value for f in self._features}

    # ==================== ACTION CHECKING ====================
    def can_execute_action(self, module: ActionModule, action: Action) -> bool:
        """Check if user can execute a specific action."""
        if Permission.FULL_ACCESS in self._permissions:
            return True
        required_permission = get_permission_for_action(module, action)
        if not required_permission:
            return False
        return self.has_permission(required_permission)

    # ==================== ROLE PROPERTIES ====================
    @property
    def is_admin(self) -> bool:
        """Check if user is an admin."""
        return self.has_any_role([Role.SUPER_ADMIN.value, Role.ADMIN.value])

    @property
    def is_super_admin(self) -> bool:
        """Check if user is a super admin."""
        return self.has_role(Role.SUPER_ADMIN.value)

    @property
    def is_authority(self) -> bool:
        """Check if user is an authority (regulator)."""
        return self.has_role(Role.AUTHORITY.value)

    @property
    def is_doctor(self) -> bool:
        """Check if user is a doctor."""
        return self.has_role(Role.DOCTOR.value)

    @property
    def is_patient(self) -> bool:
        """Check if user is a patient."""
        return self.has_role(Role.PATIENT.value)

    @property
    def is_hospital(self) -> bool:
        """Check if user is a hospital admin."""
        return self.has_role(Role.HOSPITAL_ADMIN.value)

    @property
    def is_pharmacy(self) -> bool:
        """Check if user is a pharmacy admin."""
        return self.has_role(Role.PHARMACY_ADMIN.value)

    @property
    def is_blood_donor(self) -> bool:
        """Check if user is a blood donor."""
        return self.has_role(Role.BLOOD_DONOR.value)

    @property
    def is_emergency_volunteer(self) -> bool:
        """Check if user is an emergency volunteer."""
        return self.has_role(Role.EMERGENCY_VOLUNTEER.value)

    # ==================== PERMISSION SUMMARY ====================
    def get_permission_summary(self) -> dict:
        """Get a summary of user's permissions for frontend."""
        return {
            "role": self.primary_role,
            "roles": self.roles,
            "permissions": self.get_all_permissions(),
            "features": self.get_all_features(),
            "is_full_access": Permission.FULL_ACCESS in self._permissions,
        }


# ============================================
# FASTAPI DEPENDENCIES (Role-Based)
# ============================================
def require_role(*allowed_roles: str):
    """
    FastAPI dependency that enforces role-based access control.
    Usage: @router.get("/", dependencies=[Depends(require_role("admin", "super_admin"))])
    """
    async def role_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_active:
            raise ForbiddenException("Account is deactivated")
        if not current_user.has_any_role(list(allowed_roles)):
            raise ForbiddenException(
                f"Access denied. Required role: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker


def require_admin():
    """Shortcut for admin-only endpoints."""
    return require_role(Role.SUPER_ADMIN.value, Role.ADMIN.value)


def require_super_admin():
    """Shortcut for super admin-only endpoints."""
    return require_role(Role.SUPER_ADMIN.value)


def require_doctor():
    """Shortcut for doctor-only endpoints."""
    return require_role(Role.DOCTOR.value)


def require_patient():
    """Shortcut for patient/client endpoints."""
    return require_role(Role.PATIENT.value)


def require_hospital():
    """Shortcut for hospital endpoints."""
    return require_role(Role.HOSPITAL_ADMIN.value)


def require_pharmacy():
    """Shortcut for pharmacy endpoints."""
    return require_role(Role.PHARMACY_ADMIN.value)


def require_authority():
    """Shortcut for authority (regulator) endpoints."""
    return require_role(Role.AUTHORITY.value)


def require_verified():
    """
    Dependency that requires the user to be verified.
    Can be combined with require_role using multiple dependencies.
    """
    async def verification_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_verified:
            raise ForbiddenException("Email verification required")
        return current_user
    return verification_checker


def require_approved():
    """
    Dependency that requires the user to be admin-approved.
    Used for doctors, hospitals, pharmacies who need approval.
    """
    async def approval_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_admin_approved:
            raise ForbiddenException("Admin approval required")
        return current_user
    return approval_checker


def require_active():
    """
    Dependency that requires the user to be active.
    """
    async def active_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_active:
            raise ForbiddenException("Account is deactivated")
        return current_user
    return active_checker


# ============================================
# FASTAPI DEPENDENCIES (Permission-Based)
# ============================================
def require_permission(*required_permissions: Permission):
    """
    FastAPI dependency that enforces permission-based access control.
    Usage: @router.post("/", dependencies=[Depends(require_permission(Permission.APPOINTMENT_BOOK))])
    """
    async def permission_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_active:
            raise ForbiddenException("Account is deactivated")
        if not current_user.has_all_permissions(set(required_permissions)):
            raise ForbiddenException(
                f"Access denied. Required permission: {', '.join([p.value for p in required_permissions])}"
            )
        return current_user
    return permission_checker


def require_any_permission(*allowed_permissions: Permission):
    """
    FastAPI dependency that requires any of the specified permissions.
    Usage: @router.get("/", dependencies=[Depends(require_any_permission(Permission.VIEW_PATIENTS, Permission.VIEW_APPOINTMENTS))])
    """
    async def permission_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_active:
            raise ForbiddenException("Account is deactivated")
        if not current_user.has_any_permission(set(allowed_permissions)):
            raise ForbiddenException(
                f"Access denied. Required one of: {', '.join([p.value for p in allowed_permissions])}"
            )
        return current_user
    return permission_checker


# ============================================
# FASTAPI DEPENDENCIES (Action-Based)
# ============================================
def require_action(module: ActionModule, action: Action):
    """
    FastAPI dependency that checks if user can execute a specific action.
    Used with the universal action API.
    Usage: @router.post("/actions/{module}/{action}", dependencies=[Depends(require_action(ActionModule.APPOINTMENT, Action.APPOINTMENT_BOOK))])
    """
    async def action_checker(current_user: CurrentUser = Depends(_get_current_user)) -> CurrentUser:
        if not current_user.is_active:
            raise ForbiddenException("Account is deactivated")
        if not current_user.can_execute_action(module, action):
            required_permission = get_permission_for_action(module, action)
            raise ForbiddenException(
                f"Access denied. Action '{action.value}' on module '{module.value}' requires permission: {required_permission.value if required_permission else 'unknown'}"
            )
        return current_user
    return action_checker


# ============================================
# PERMISSION DECORATOR (For Service Methods)
# ============================================
def check_permission(permission: Permission):
    """
    Decorator for service methods to check permissions.
    Usage:
        @check_permission(Permission.APPOINTMENT_BOOK)
        def book_appointment(self, user_id, ...):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            # Extract current_user from kwargs or args
            current_user = kwargs.get('current_user')
            if not current_user and args:
                # Try to get from first positional argument
                current_user = args[0]

            if not current_user:
                raise UnauthorizedException("User authentication required")

            if not isinstance(current_user, CurrentUser):
                raise UnauthorizedException("Invalid user object")

            if not current_user.has_permission(permission):
                raise ForbiddenException(f"Permission required: {permission.value}")

            return await func(self, *args, **kwargs)
        return wrapper
    return decorator


def check_roles(*allowed_roles: str):
    """
    Decorator for service methods to check roles.
    Usage:
        @check_roles("admin", "super_admin")
        def delete_user(self, user_id, ...):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user and args:
                current_user = args[0]

            if not current_user:
                raise UnauthorizedException("User authentication required")

            if not isinstance(current_user, CurrentUser):
                raise UnauthorizedException("Invalid user object")

            if not current_user.has_any_role(list(allowed_roles)):
                raise ForbiddenException(f"Access denied. Required role: {', '.join(allowed_roles)}")

            return await func(self, *args, **kwargs)
        return wrapper
    return decorator


# ============================================
# AUDIT LOGGING FOR AUTHORITY
# ============================================
class AuditLogger:
    """
    Audit logger for authority role to track all system actions.
    """

    @staticmethod
    async def log_action(
        request: Request,
        current_user: CurrentUser,
        action: str,
        module: str,
        resource_id: Optional[str] = None,
        metadata: Optional[dict] = None,
        success: bool = True,
        error_message: Optional[str] = None,
    ):
        """
        Log an action to the audit trail.
        Automatically called for authority users or can be used manually.
        """
        from sqlalchemy.orm import Session
        from ..core.database import get_db
        from ..models.search import AuditLog

        # Get database session
        db_gen = get_db()
        db: Session = next(db_gen)

        try:
            audit_log = AuditLog(
                user_id=current_user.id,
                action=action,
                resource_type=module,
                resource_id=resource_id,
                ip_address=request.client.host if request else None,
                user_agent=request.headers.get("user-agent") if request else None,
                success=success,
                error_message=error_message,
                metadata=metadata or {},
            )
            db.add(audit_log)
            db.commit()
        except Exception as e:
            # Don't fail the request if audit logging fails
            print(f"Audit logging failed: {e}")
        finally:
            db.close()

    @staticmethod
    def should_log(current_user: CurrentUser) -> bool:
        """
        Check if the current user should be logged (authority role).
        """
        return current_user.is_authority or current_user.is_super_admin


# ============================================
# HELPER FUNCTION
# ============================================
def _get_current_user():
    """Lazy import to avoid circular dependency with auth_middleware."""
    from ..middleware.auth_middleware import get_current_user
    return get_current_user