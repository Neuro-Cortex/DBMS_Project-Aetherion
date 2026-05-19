"""
Hospital schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import time, datetime

class HospitalProfileCreate(BaseModel):
    name: str
    registration_number: str
    type: str
    category: str
    phone: str
    email: str
    website: Optional[str] = None
    emergency_phone: Optional[str] = None
    address: str
    city: str
    state: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    latitude: float
    longitude: float
    total_beds: int = 0
    total_icu_beds: int = 0
    total_ventilators: int = 0
    emergency_services_available: bool = False
    ambulance_count: int = 0
    trauma_center: bool = False
    has_blood_bank: bool = False
    facilities: Optional[List[str]] = []
    specializations: Optional[List[str]] = []
    insurance_partners: Optional[List[str]] = []
    accepts_insurance: bool = False
    open_time: time = time(0, 0)
    close_time: time = time(23, 59)
    is_24x7: bool = False
    visiting_hours_start: Optional[time] = None
    visiting_hours_end: Optional[time] = None
    accreditations: Optional[List[str]] = []

class HospitalProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    emergency_phone: Optional[str] = None
    address: Optional[str] = None
    total_beds: Optional[int] = None
    available_beds: Optional[int] = None
    total_icu_beds: Optional[int] = None
    available_icu_beds: Optional[int] = None
    available_ventilators: Optional[int] = None
    emergency_services_available: Optional[bool] = None
    ambulance_count: Optional[int] = None
    is_operational: Optional[bool] = None
    facilities: Optional[List[str]] = None
    insurance_partners: Optional[List[str]] = None
    open_time: Optional[time] = None
    close_time: Optional[time] = None

class DepartmentCreate(BaseModel):
    name: str
    head_doctor_id: Optional[str] = None
    total_beds: int = 0
    phone_extension: Optional[str] = None

class BloodStockUpdate(BaseModel):
    blood_group: str
    quantity_units: int
    minimum_threshold: Optional[int] = 10

class OxygenStockUpdate(BaseModel):
    total_capacity_liters: int
    available_liters: int
    total_cylinders: int
    available_cylinders: int
    large_cylinders: int = 0
    medium_cylinders: int = 0
    small_cylinders: int = 0
    portable_cylinders: int = 0

class BedStatusUpdate(BaseModel):
    total_beds: Optional[int] = None
    available_beds: Optional[int] = None
    total_icu_beds: Optional[int] = None
    available_icu_beds: Optional[int] = None
    available_ventilators: Optional[int] = None

class EmergencyAnnouncement(BaseModel):
    title: str
    message: str
    severity: str = "medium"
    affected_departments: Optional[List[str]] = None