from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .doctor import router as doctor_router, public_router as doctors_public_router
from .appointments import router as appointments_router
from .hospital import router as hospital_router, public_router as hospitals_public_router
from .pharmacy import router as pharmacy_router
from .patients import router as patients_router
from .emergency import router as emergency_router
from .blood_donation import router as blood_donation_router
from .oxygen import router as oxygen_router
from .admin import router as admin_router
from .messaging import router as messaging_router
from .ai_assistant import router as ai_assistant_router
from .search import router as search_router
from .women_health import router as women_health_router
from .actions import router as actions_router
from .system import router as system_router

api_router = APIRouter()

# Auth & Users (Phase 1)
api_router.include_router(auth_router)
api_router.include_router(users_router)

# Doctor Module (Phase 2)
api_router.include_router(doctor_router)
api_router.include_router(doctors_public_router)

# Appointment Module (Phase 2)
api_router.include_router(appointments_router)

# Hospital Module (Phase 2)
api_router.include_router(hospital_router)
api_router.include_router(hospitals_public_router)

# Pharmacy Module (Phase 2)
api_router.include_router(pharmacy_router)

# Patient Module (Phase 2)
api_router.include_router(patients_router)

# Emergency Module (Phase 3)
api_router.include_router(emergency_router)

# Blood Donation Module (Phase 3)
api_router.include_router(blood_donation_router)

# Oxygen Module (Phase 3)
api_router.include_router(oxygen_router)

# Admin Module (Phase 3)
api_router.include_router(admin_router)

# Messaging & Notifications Module (Phase 3)
api_router.include_router(messaging_router)

# AI Assistant Module (Phase 3)
api_router.include_router(ai_assistant_router)

# Global Search Module (Phase 3)
api_router.include_router(search_router)

# Women's Health Module (Phase 4)
api_router.include_router(women_health_router)

# Role-Aware System (Universal Action API & Discovery)
api_router.include_router(actions_router)
api_router.include_router(system_router)
