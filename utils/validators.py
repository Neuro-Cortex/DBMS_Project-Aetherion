from pydantic import field_validator
import re
from typing import Optional


def validate_phone(value: Optional[str]) -> Optional[str]:
    """Validate phone number format."""
    if value is None:
        return value
    cleaned = re.sub(r'[\s\-\(\)]', '', value)
    if not re.match(r'^\+?\d{7,15}$', cleaned):
        raise ValueError('Invalid phone number format')
    return cleaned


def validate_blood_group(value: Optional[str]) -> Optional[str]:
    """Validate blood group."""
    if value is None:
        return value
    valid_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    if value not in valid_groups:
        raise ValueError(f'Invalid blood group. Must be one of: {valid_groups}')
    return value


def validate_gender(value: Optional[str]) -> Optional[str]:
    """Validate gender value."""
    if value is None:
        return value
    valid = ['male', 'female', 'other', 'prefer-not-to-say']
    if value not in valid:
        raise ValueError(f'Invalid gender. Must be one of: {valid}')
    return value


def validate_role_name(value: str) -> str:
    """Validate role name."""
    valid_roles = [
        'super_admin', 'admin', 'admin_applicant', 'moderator',
        'doctor', 'hospital', 'hospital_admin', 'pharmacy', 'pharmacy_admin',
        'patient', 'client', 'blood_donor', 'emergency_volunteer', 'normal_user',
    ]
    if value not in valid_roles:
        raise ValueError(f'Invalid role. Must be one of: {valid_roles}')
    return value
