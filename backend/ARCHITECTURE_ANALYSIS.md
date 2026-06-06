# AETHERION HEALTHCARE PLATFORM — SYSTEM ANALYSIS REPORT
## Technical Lead: Full Project Audit & Extension Plan
## Date: 2026-05-30

---

# ═══════════════════════════════════════════
# STEP 1: FULL PROJECT ANALYSIS
# ═══════════════════════════════════════════

---

## 1.1 EXISTING WORKING FEATURES

### Frontend (React — 263 files, FULLY BUILT)
- ✅ 100+ routes with role-based AuthGuard
- ✅ 9 Redux slices with full state management
- ✅ 14 service files with complete API method definitions
- ✅ 15+ type definition files (TypeScript interfaces for ALL entities)
- ✅ 6 user roles with multi-role support and role switching
- ✅ All UI components built (admin, doctor, hospital, pharmacy, patient, women-care, AI, emergency, oxygen)

### Backend (FastAPI — 20 Python files, PARTIALLY BUILT)
- ✅ FastAPI app factory with CORS middleware
- ✅ SQLAlchemy engine + session management
- ✅ Pydantic-settings configuration (DB, JWT)
- ✅ JWT utility functions (create/decode access & refresh tokens)
- ✅ Password hashing (bcrypt via passlib)
- ✅ 14 ORM model files covering ~30 tables
- ✅ Basic auth route stubs (login, register)
- ✅ Basic user route stubs (get_users, get_me)
- ✅ Core constants (UserRole, AppointmentStatus, BloodGroup enums)
- ✅ Core exception classes (AppException, NotFoundException, UnauthorizedException)
- ✅ Common response schemas (APIResponse, PaginatedResponse)

### Database (MySQL — 85 tables, FULLY DESIGNED)
- ✅ Complete 85-table schema in `schema.sql`
- ✅ 8 views, 6 stored procedures, 8 triggers
- ✅ 180+ indexes including FULLTEXT search indexes
- ✅ CHECK constraints, UNIQUE constraints, FK cascading rules
- ✅ 15 seed roles

---

## 1.2 ALREADY IMPLEMENTED MODULES (Backend)

| Module | Models | Schemas | Services | Routes | Status |
|--------|--------|---------|----------|--------|--------|
| Auth | User, UserProfile | LoginRequest, RegisterRequest, TokenResponse | AuthService (STUB) | login, register | ⚠️ STUB |
| Users | (shared with Auth) | APIResponse, PaginatedResponse | UserService (STUB) | get_users, get_me | ⚠️ STUB |
| Doctor | DoctorProfile, DoctorAvailability | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Hospital | Hospital, HospitalDepartment, HospitalBed | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Pharmacy | Pharmacy, PharmacyInventory, MedicineOrder | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Appointment | Appointment, Prescription, PrescriptionItem, PrescriptionTest | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Blood Donation | BloodDonor, BloodDonation, BloodRequest, BloodDonationCamp | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Patient | PatientHealthRecord, PatientVaccination, PatientMedication, PatientMedicalHistory, PatientSurgery | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Women's Health | WomenMenstrualCycle, WomenPregnancy, WomenPregnancyTracking, BabyVaccine, BabyVaccineRecord, BabyGrowthRecord | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Admin | AdminUser, VerificationRequest | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Messaging | Message, Notification | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Reviews | UserReview, Feedback | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| AI Assistant | AIConversation, AIMessage, AIVoiceSession | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Emergency | ❌ No models | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Oxygen | ❌ No models | ❌ None | ❌ None | ❌ None | 🔴 MISSING |
| Search | ❌ No models | ❌ None | ❌ None | ❌ None | 🔴 MISSING |

---

## 1.3 BROKEN / FAILING PARTS

### CRITICAL — Auth System is Demo-Only
```python
# auth_service.py — RETURNS HARDCODED DEMO USER
async def login(self, request):
    access_token = create_access_token({"sub": "demo-user", "role": request.role})
    # ^^^ NEVER QUERIES DATABASE — ALWAYS RETURNS "demo-user"
    return {"user": {"id": "demo-id", "email": request.email, ...}}
```

**Impact:** No real authentication works. Login always succeeds with any credentials.

### CRITICAL — Auth Middleware Returns Fake User
```python
# auth_middleware.py — RETURNS HARDCODED CurrentUser
async def get_current_user(credentials, db):
    payload = decode_token(token)
    class CurrentUser:
        def __init__(self):
            self.id = payload.get("sub", "demo")      # Always "demo"
            self.email = "demo@example.com"             # Always demo email
            self.full_name = "Demo User"                # Always demo name
    return CurrentUser()
```

**Impact:** All protected endpoints think they're serving "demo" user. No RBAC.

### CRITICAL — Register Doesn't Create User
```python
# auth_service.py — REGISTER JUST CALLS LOGIN
async def register(self, request):
    if request.password != request.confirm_password:
        raise HTTPException(...)
    return await self.login(...)  # No database insert!
```

**Impact:** Registration never persists. No user record created.

### HIGH — UserService is Empty
```python
# user_service.py — ALL METHODS ARE TODO
def get_user_by_id(self, user_id): pass     # TODO
def get_user_by_email(self, email): pass     # TODO
```

### HIGH — Email Utility References Missing Config
```python
# email.py — References SMTP settings that don't exist in Settings class
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,     # ❌ AttributeError
    MAIL_PASSWORD=settings.SMTP_PASSWORD, # ❌ AttributeError
    ...
)
```

### MEDIUM — ORM Models Have Type Mismatches
- `doctor_availability.doctor_id` = `Integer` but should be `CHAR(36)` (UUID FK to doctor_profiles)
- `appointment.doctor_id` = `Integer` but should be `CHAR(36)`
- `appointment.hospital_id` = `String(36)` but `department_id` = `Integer` (inconsistent)
- `blood_donations.donor_id` = `Integer` but should be `CHAR(36)` (UUID FK)
- Many FK columns use `Integer` instead of `CHAR(36)` to match UUID PKs

### MEDIUM — Missing ORM Models for 50+ Tables
The SQL schema has 85 tables. ORM models only cover ~30. Missing include:
- `roles`, `user_sessions`, `user_roles`, `user_role_upgrades`
- `user_addresses`, `user_emergency_contacts`, `user_notification_settings`
- `user_documents`, `password_resets`, `user_preferences`
- `doctor_earnings`, `doctor_patients`, `doctor_notifications`, `doctor_activities`
- `hospital_doctors`, `hospital_blood_bank`, `hospital_blood_stocks`
- `hospital_oxygen_stock`, `hospital_ambulances`, `hospital_activities`
- `order_items`, `stock_alerts`, `delivery_tracking`
- `oxygen_stocks`, `oxygen_centers`, `oxygen_requests`
- `emergency_services`, `emergency_requests`
- `donor_rewards`, `donor_documents`, `donation_reminders`
- `baby_health_records`, `gynecologist_consultations`
- `emergency_pregnancy_contacts`, `emergency_pregnancy_hospitals`
- `search_logs`, `audit_logs`, `security_logs`

---

## 1.4 MISSING FEATURES / APIs

Based on frontend service files, the following API endpoints are expected but DO NOT EXIST:

### Auth Module (12 endpoints expected, 2 exist as stubs)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/auth/login` | POST | authService.login | ⚠️ STUB |
| `/api/v1/auth/register` | POST | authService.register | ⚠️ STUB |
| `/api/v1/auth/refresh` | POST | authService.refreshToken | 🔴 MISSING |
| `/api/v1/auth/logout` | POST | authService.logout | 🔴 MISSING |
| `/api/v1/auth/forgot-password` | POST | authService.forgotPassword | 🔴 MISSING |
| `/api/v1/auth/reset-password` | POST | authService.resetPassword | 🔴 MISSING |
| `/api/v1/auth/verify-email` | POST | authService.verifyEmail | 🔴 MISSING |
| `/api/v1/auth/change-password` | POST | authService.changePassword | 🔴 MISSING |
| `/api/v1/auth/profile` | GET | authService.getProfile | 🔴 MISSING |
| `/api/v1/auth/profile` | PUT | authService.updateProfile | 🔴 MISSING |
| `/api/v1/auth/role-selection` | POST | authService.selectRole | 🔴 MISSING |
| `/api/v1/auth/switch-role` | POST | authService.switchRole | 🔴 MISSING |

### Doctor Module (20+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/doctors` | GET | doctorService.getDoctors | 🔴 MISSING |
| `/api/v1/doctors/{id}` | GET | doctorService.getDoctorById | 🔴 MISSING |
| `/api/v1/doctors/search` | GET | doctorService.searchDoctors | 🔴 MISSING |
| `/api/v1/doctor/register` | POST | doctorService.register | 🔴 MISSING |
| `/api/v1/doctor/profile` | GET | doctorService.getProfile | 🔴 MISSING |
| `/api/v1/doctor/profile` | PUT | doctorService.updateProfile | 🔴 MISSING |
| `/api/v1/doctor/dashboard` | GET | doctorService.getDashboardData | 🔴 MISSING |
| `/api/v1/doctor/schedule` | GET/PUT | doctorService.getSchedule/updateSchedule | 🔴 MISSING |
| `/api/v1/doctor/patients` | GET | doctorService.getPatients | 🔴 MISSING |
| `/api/v1/doctor/appointments` | GET | doctorService.getAppointments | 🔴 MISSING |
| `/api/v1/doctor/prescriptions` | GET/POST | doctorService.getPrescriptions/createPrescription | 🔴 MISSING |
| `/api/v1/doctor/earnings` | GET | doctorService.getEarnings | 🔴 MISSING |
| `/api/v1/doctor/notifications` | GET | doctorService.getNotifications | 🔴 MISSING |
| `/api/v1/doctor/reviews` | GET | doctorService.getReviews | 🔴 MISSING |
| `/api/v1/doctor/ranking` | GET | (DoctorRanking component) | 🔴 MISSING |
| `/api/v1/doctor/availability` | GET/PUT | DoctorSchedule component | 🔴 MISSING |
| `/api/v1/doctor/women-care` | GET | WomenCare component | 🔴 MISSING |
| `/api/v1/doctor/analytics` | GET | Analytics component | 🔴 MISSING |
| `/api/v1/doctor/settings` | GET/PUT | Settings component | 🔴 MISSING |
| `/api/v1/doctor/emergency` | GET | Emergency component | 🔴 MISSING |

### Hospital Module (25+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/hospitals` | GET | hospitalService.getHospitals | 🔴 MISSING |
| `/api/v1/hospitals/{id}` | GET | hospitalService.getHospitalById | 🔴 MISSING |
| `/api/v1/hospital/profile` | GET/PUT | hospitalService.getProfile/updateProfile | 🔴 MISSING |
| `/api/v1/hospital/dashboard` | GET | hospitalService.getDashboardData | 🔴 MISSING |
| `/api/v1/hospital/doctors` | GET/POST | hospitalService.getDoctors/addDoctor | 🔴 MISSING |
| `/api/v1/hospital/departments` | GET/POST | hospitalService.getDepartments | 🔴 MISSING |
| `/api/v1/hospital/blood-bank` | GET/PUT | hospitalService.getBloodBank | 🔴 MISSING |
| `/api/v1/hospital/blood-stocks` | GET/PUT | hospitalService.getBloodStocks | 🔴 MISSING |
| `/api/v1/hospital/oxygen` | GET/PUT | hospitalService.getOxygenStock | 🔴 MISSING |
| `/api/v1/hospital/ambulances` | GET/POST | hospitalService.getAmbulances | 🔴 MISSING |
| `/api/v1/hospital/beds` | GET/POST | hospitalService.getBeds/bookBed | 🔴 MISSING |
| `/api/v1/hospital/activities` | GET | hospitalService.getActivities | 🔴 MISSING |
| `/api/v1/hospital/nearby` | GET | (search hospitals by location) | 🔴 MISSING |
| `/api/v1/hospital/announcements` | GET/POST | hospitalService.getAnnouncements | 🔴 MISSING |
| `/api/v1/hospital/analytics` | GET | hospitalService.getAnalytics | 🔴 MISSING |

### Pharmacy Module (20+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/pharmacy/login` | POST | pharmacyService.pharmacyLogin | 🔴 MISSING |
| `/api/v1/pharmacy/register` | POST | pharmacyService.pharmacyRegister | 🔴 MISSING |
| `/api/v1/pharmacy/dashboard` | GET | pharmacyService.getPharmacyDashboard | 🔴 MISSING |
| `/api/v1/pharmacy/client-dashboard` | GET | pharmacyService.getClientPharmacyDashboard | 🔴 MISSING |
| `/api/v1/pharmacy/medicines` | GET/POST | pharmacyService.getMedicines/addMedicine | 🔴 MISSING |
| `/api/v1/pharmacy/medicines/{id}` | GET/PUT/DEL | pharmacyService.updateMedicine | 🔴 MISSING |
| `/api/v1/pharmacy/orders` | GET/POST | pharmacyService.getOrders/placeOrder | 🔴 MISSING |
| `/api/v1/pharmacy/orders/{id}` | GET/PUT | pharmacyService.updateOrderStatus | 🔴 MISSING |
| `/api/v1/pharmacy/prescriptions` | GET | pharmacyService.getPrescriptions | 🔴 MISSING |
| `/api/v1/pharmacy/stock-alerts` | GET | pharmacyService.getStockAlerts | 🔴 MISSING |
| `/api/v1/pharmacy/delivery/{id}` | GET | pharmacyService.getDeliveryTracking | 🔴 MISSING |
| `/api/v1/pharmacy/search` | GET | (MedicineSearch component) | 🔴 MISSING |
| `/api/v1/pharmacy/reminders` | GET/POST | pharmacyService.getMedicineReminders | 🔴 MISSING |

### Appointment Module (12+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/appointments` | GET/POST | apiService.getAppointments/createAppointment | 🔴 MISSING |
| `/api/v1/appointments/{id}` | GET/PUT | apiService.getAppointmentById/updateAppointment | 🔴 MISSING |
| `/api/v1/appointments/{id}/cancel` | POST | apiService.cancelAppointment | 🔴 MISSING |
| `/api/v1/appointments/{id}/reschedule` | PUT | apiService.rescheduleAppointment | 🔴 MISSING |
| `/api/v1/appointments/user/{userId}` | GET | apiService.getAppointments | 🔴 MISSING |
| `/api/v1/appointments/doctor/{doctorId}` | GET | apiService.getDoctorAppointments | 🔴 MISSING |
| `/api/v1/appointments/search` | GET | apiService.searchAppointments | 🔴 MISSING |
| `/api/v1/appointments/filter` | POST | apiService.filterAppointments | 🔴 MISSING |
| `/api/v1/appointments/statistics` | GET | apiService.getAppointmentStatistics | 🔴 MISSING |
| `/api/v1/doctors/{id}/available-slots` | GET | apiService.getAvailableTimeSlots | 🔴 MISSING |

### Emergency Module (8+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/emergency/services` | GET | emergencyService.getServices | 🔴 MISSING |
| `/api/v1/emergency/request` | POST | emergencyService.createEmergencyRequest | 🔴 MISSING |
| `/api/v1/emergency/sos` | POST | emergencySlice.sendEmergencySOS | 🔴 MISSING |
| `/api/v1/emergency/nearby-hospitals` | GET | emergencySlice.fetchNearbyHospitals | 🔴 MISSING |
| `/api/v1/emergency/ambulances` | GET | emergencySlice.fetchAvailableAmbulances | 🔴 MISSING |
| `/api/v1/emergency/{id}/status` | PUT | emergencySlice.updateEmergencyStatus | 🔴 MISSING |
| `/api/v1/emergency/{id}/cancel` | PUT | emergencySlice.cancelEmergency | 🔴 MISSING |
| `/api/v1/emergency/blood-donors` | GET | emergencyService.getBloodDonors | 🔴 MISSING |

### Blood Donation Module (15+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/blood-donor/register` | POST | bloodDonationService.registerDonor | 🔴 MISSING |
| `/api/blood-donor/profile` | GET/PUT | bloodDonationService.getDonorProfile/updateProfile | 🔴 MISSING |
| `/api/blood-donor/donations` | GET/POST | bloodDonationService.getDonationHistory/recordDonation | 🔴 MISSING |
| `/api/blood-donor/stock` | GET | bloodDonationService.getBloodStock | 🔴 MISSING |
| `/api/blood-donor/requests` | GET/POST | bloodDonationService.getBloodRequests/createBloodRequest | 🔴 MISSING |
| `/api/blood-donor/emergency-alerts` | GET | bloodDonationService.getEmergencyAlerts | 🔴 MISSING |
| `/api/blood-donor/camps` | GET | bloodDonationService.getDonationCamps | 🔴 MISSING |
| `/api/blood-donor/stats` | GET | bloodDonationService.getDonorStats | 🔴 MISSING |
| `/api/blood-donor/certificates` | GET | bloodDonationService.getCertificates | 🔴 MISSING |
| `/api/blood-donor/rewards` | GET | bloodDonationService.getRewards | 🔴 MISSING |
| `/api/blood-donor/search` | POST | bloodDonationService.searchDonors | 🔴 MISSING |

### Oxygen Module (10+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/oxygen/dashboard` | GET | oxygenService.getDashboardData | 🔴 MISSING |
| `/api/oxygen/stocks` | GET | oxygenService.getAllStocks | 🔴 MISSING |
| `/api/oxygen/stocks/{hospitalId}` | GET | oxygenService.getHospitalStock | 🔴 MISSING |
| `/api/oxygen/stocks/{stockId}` | PUT | oxygenService.updateStock | 🔴 MISSING |
| `/api/oxygen/centers/nearby` | GET | oxygenService.getNearbyCenters | 🔴 MISSING |
| `/api/oxygen/requests` | GET/POST | oxygenService.getRequests/createRequest | 🔴 MISSING |
| `/api/oxygen/alerts` | GET | oxygenService.getAlerts | 🔴 MISSING |

### Women's Health Module (15+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/women-care/dashboard` | GET | womenCareService.getDashboardData | 🔴 MISSING |
| `/api/women-care/pregnancy` | GET/PUT | womenCareService.getPregnancyRecord/updatePregnancyRecord | 🔴 MISSING |
| `/api/women-care/pregnancy/weight` | POST | womenCareService.addWeightRecord | 🔴 MISSING |
| `/api/women-care/pregnancy/blood-pressure` | POST | womenCareService.addBloodPressureRecord | 🔴 MISSING |
| `/api/women-care/menstrual-cycle` | GET/PUT | womenCareService.getMenstrualCycle | 🔴 MISSING |
| `/api/women-care/baby-vaccines` | GET/POST | womenCareService.getBabyVaccines/addVaccineRecord | 🔴 MISSING |
| `/api/women-care/baby-growth` | GET/POST | womenCareService.getBabyGrowth/addGrowthRecord | 🔴 MISSING |
| `/api/women-care/consultations` | GET/POST | womenCareService.getConsultations | 🔴 MISSING |
| `/api/women-care/notifications` | GET | womenCareService.getNotifications | 🔴 MISSING |
| `/api/women-care/emergency` | GET | womenCareService.getEmergencyInfo | 🔴 MISSING |

### Admin Module (20+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/admin/login` | POST | adminService.login | 🔴 MISSING |
| `/api/admin/dashboard` | GET | adminService.getDashboardData | 🔴 MISSING |
| `/api/admin/users` | GET/POST | adminService.getUsers | 🔴 MISSING |
| `/api/admin/users/{id}` | GET/PUT/DEL | adminService.getUserDetails/updateUser | 🔴 MISSING |
| `/api/admin/doctor-verifications` | GET/PUT | adminService.getDoctorVerifications/approveDoctor | 🔴 MISSING |
| `/api/admin/hospital-verifications` | GET/PUT | adminService.getHospitalVerifications | 🔴 MISSING |
| `/api/admin/pharmacy-verifications` | GET/PUT | adminService.getPharmacyVerifications | 🔴 MISSING |
| `/api/admin/analytics` | GET | adminService.getAnalytics | 🔴 MISSING |
| `/api/admin/blood-stock` | GET | adminService.getBloodStockAnalytics | 🔴 MISSING |
| `/api/admin/reports` | GET/POST | adminService.generateReport | 🔴 MISSING |
| `/api/admin/feedback` | GET/PUT | adminService.getFeedbacks | 🔴 MISSING |
| `/api/admin/emergency-alerts` | GET | adminService.getEmergencyAlerts | 🔴 MISSING |
| `/api/admin/security-logs` | GET | adminService.getSecurityLogs | 🔴 MISSING |
| `/api/admin/audit-logs` | GET | adminService.getAuditLogs | 🔴 MISSING |
| `/api/admin/settings` | GET/PUT | adminService.getSettings | 🔴 MISSING |

### Patient/Client Module (15+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/patients/{id}/profile` | GET/PUT | clientSlice | 🔴 MISSING |
| `/api/v1/patients/{id}/health-records` | GET/POST | HealthRecords component | 🔴 MISSING |
| `/api/v1/patients/{id}/medical-reports` | GET | MedicalReports component | 🔴 MISSING |
| `/api/v1/patients/{id}/prescriptions` | GET | Prescriptions component | 🔴 MISSING |
| `/api/v1/patients/{id}/vaccinations` | GET/POST | VaccinationTracker component | 🔴 MISSING |
| `/api/v1/patients/{id}/medications` | GET/POST | MedicineTracker component | 🔴 MISSING |
| `/api/v1/patients/{id}/timeline` | GET | HealthTimeline component | 🔴 MISSING |
| `/api/v1/patients/{id}/recommendations` | GET | Recommendations component | 🔴 MISSING |
| `/api/v1/patients/{id}/emergency-requests` | GET/POST | EmergencyRequest component | 🔴 MISSING |
| `/api/v1/patients/{id}/orders` | GET | ClientOrders component | 🔴 MISSING |
| `/api/v1/patients/{id}/blood-donations` | GET/POST | bloodDonation page | 🔴 MISSING |
| `/api/v1/patients/{id}/wellness/*` | GET/POST | MentalHealth/Nutrition/Sleep/Fitness | 🔴 MISSING |

### Search Module (3 endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/search` | GET | searchService.search | 🔴 MISSING |
| `/api/v1/search/doctors` | GET | searchService.searchDoctors | 🔴 MISSING |
| `/api/v1/search/suggestions` | GET | SmartSearch component | 🔴 MISSING |

### Messaging & Notifications (6+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/messages` | GET/POST | Messages components | 🔴 MISSING |
| `/api/v1/messages/{id}` | PUT | mark as read | 🔴 MISSING |
| `/api/v1/notifications` | GET | NotificationBell/Center | 🔴 MISSING |
| `/api/v1/notifications/{id}/read` | PUT | mark notification read | 🔴 MISSING |
| `/api/v1/notifications/read-all` | PUT | mark all read | 🔴 MISSING |

### Reviews & Feedback (4+ endpoints expected, 0 exist)
| Endpoint | Method | Frontend Service | Backend Status |
|----------|--------|------------------|----------------|
| `/api/v1/reviews` | GET/POST | review components | 🔴 MISSING |
| `/api/v1/feedback` | GET/POST | Feedback page | 🔴 MISSING |
| `/api/v1/feedback/{id}` | PUT | admin response | 🔴 MISSING |

---

## 1.5 DATA FLOW ISSUES

### Issue 1: Port Mismatch
- **Frontend** expects API at `http://localhost:5000/api` (from service files)
- **FastAPI backend** runs on port 8000 with prefix `/api/v1`
- **Flask backend** (app2/) runs on port 5000 with prefix `/api`
- **Resolution needed:** Decide which backend to use as primary, configure frontend accordingly

### Issue 2: API Prefix Mismatch
- Frontend services call `/api/doctor/profile`, `/api/hospital/dashboard`, etc.
- FastAPI routes are at `/api/v1/auth/login`, `/api/v1/users/`
- Need to align: either change frontend or add route prefixes matching frontend expectations

### Issue 3: Auth Token Storage
- Frontend authSlice explicitly removes token from Redux (no localStorage save)
- Frontend AppRoutes uses `sessionStorage.getItem('auth_token')` for auth check
- Backend creates JWT tokens but doesn't return them in format frontend expects
- Frontend expects: `{ access_token, refresh_token, token_type, user: {...} }`
- Need to ensure login response matches this contract

### Issue 4: Role Naming Inconsistency
- Frontend authSlice defines: `normal_user, client, doctor, hospital, hospital_admin, hospital_authority, pharmacy, pharmacy_admin, admin, admin_applicant, blood_donor, emergency_volunteer`
- Frontend routeConfig uses: `patient, doctor, hospital, pharmacy, admin, super_admin`
- Backend constants define: `SUPER_ADMIN, ADMIN, MODERATOR, DOCTOR, HOSPITAL, PHARMACY, PATIENT, CLIENT, BLOOD_DONOR`
- Database roles table seeds 15 roles
- Need to reconcile: map frontend role names to backend/database roles consistently

### Issue 5: Dual Backend Conflict
- `backend/app/` — FastAPI (port 8000, `/api/v1` prefix)
- `backend/app2/` — Flask (port 5000, `/api` prefix)
- `backend/flask_app.py` — Monolithic Flask (port 5000)
- Frontend points to port 5000 by default
- **Decision needed:** FastAPI is the target. Need to either remove Flask or configure proxy

---

# ═══════════════════════════════════════════
# STEP 2: SYSTEM UNDERSTANDING (MAPPING)
# ═══════════════════════════════════════════

---

## 2.1 FRONTEND → API → BACKEND → DATABASE MAPPING

### Complete Data Flow for Each Module:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│ Login.tsx → authService.login(email, password)                         │
│           → POST /api/v1/auth/login { email, password, role }          │
│           → AuthService.login() → JWT create → return tokens           │
│           → DB: users (verify email+password_hash)                     │
│           → DB: user_sessions (store refresh token)                    │
│           → DB: user_roles (load user roles)                           │
│                                                                         │
│ Register.tsx → authService.register(data)                              │
│             → POST /api/v1/auth/register { full_name, email, ... }     │
│             → AuthService.register() → hash password → insert user     │
│             → DB: users (create record)                                │
│             → DB: user_profiles (create profile)                       │
│             → DB: user_roles (assign default role)                     │
│                                                                         │
│ AuthGuard → sessionStorage.getItem('auth_token')                       │
│           → GET /api/v1/auth/profile (validate token)                  │
│           → get_current_user() → decode JWT → load user from DB        │
└─────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DOCTOR MODULE FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│ DoctorDashboard → doctorService.getDashboardData()                     │
│                → GET /api/v1/doctor/dashboard                          │
│                → DoctorService.get_dashboard()                         │
│                → DB: doctor_profiles + appointments + patients + stats │
│                                                                         │
│ DoctorProfile → doctorService.getProfile()                             │
│              → GET /api/v1/doctor/profile                              │
│              → DB: doctor_profiles JOIN users JOIN user_profiles        │
│                                                                         │
│ DoctorSchedule → doctorService.getSchedule()                           │
│               → GET /api/v1/doctor/schedule                            │
│               → DB: doctor_availability                                │
│                                                                         │
│ Prescriptions → doctorService.getPrescriptions()                       │
│              → GET /api/v1/doctor/prescriptions                        │
│              → DB: prescriptions JOIN prescription_items                │
│              → DB: prescription_tests                                   │
│                                                                         │
│ Patients → doctorService.getPatients()                                 │
│         → GET /api/v1/doctor/patients                                  │
│         → DB: doctor_patients JOIN users JOIN patient_health_records   │
│                                                                         │
│ Earnings → doctorService.getEarnings()                                 │
│         → GET /api/v1/doctor/earnings                                  │
│         → DB: doctor_earnings                                          │
│                                                                         │
│ Analytics → GET /api/v1/doctor/analytics                               │
│          → DB: appointments (aggregate) + doctor_earnings (aggregate)  │
└─────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      HOSPITAL MODULE FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│ HospitalDashboard → hospitalService.getDashboardData()                 │
│                  → GET /api/v1/hospital/dashboard                      │
│                  → DB: hospitals + hospital_departments + beds          │
│                  → DB: hospital_blood_bank + hospital_blood_stocks      │
│                  → DB: hospital_oxygen_stock + hospital_ambulances      │
│                  → DB: hospital_activities                              │
│                                                                         │
│ BedAvailability → hospitalService.getBeds()                            │
│               → GET /api/v1/hospital/beds                              │
│               → DB: hospital_beds                                       │
│                                                                         │
│ ICUTracker → GET /api/v1/hospital/beds?type=icu                        │
│           → DB: hospital_beds (filtered by icu bed types)              │
│                                                                         │
│ HospitalDoctors → hospitalService.getDoctors()                         │
│               → GET /api/v1/hospital/doctors                           │
│               → DB: hospital_doctors JOIN doctor_profiles              │
│                                                                         │
│ BloodBank → hospitalService.getBloodBank()                             │
│          → GET /api/v1/hospital/blood-bank                             │
│          → DB: hospital_blood_bank + hospital_blood_stocks             │
│                                                                         │
│ Oxygen → hospitalService.getOxygenStock()                              │
│       → GET /api/v1/hospital/oxygen                                    │
│       → DB: hospital_oxygen_stock                                      │
│                                                                         │
│ Ambulances → hospitalService.getAmbulances()                           │
│          → GET /api/v1/hospital/ambulances                             │
│          → DB: hospital_ambulances                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHARMACY MODULE FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│ PharmacyDashboard → pharmacyService.getPharmacyDashboard()             │
│                  → GET /api/v1/pharmacy/dashboard                      │
│                  → DB: pharmacies + medicine_orders + pharmacy_inventory│
│                  → DB: stock_alerts                                     │
│                                                                         │
│ MedicineSearch → pharmacyService.getMedicines()                        │
│              → GET /api/v1/pharmacy/medicines?search=...               │
│              → DB: pharmacy_inventory (FULLTEXT search)                 │
│                                                                         │
│ PlaceOrder → pharmacyService.placeOrder()                              │
│          → POST /api/v1/pharmacy/orders                                │
│          → DB: medicine_orders + order_items                            │
│                                                                         │
│ StockIndicator → pharmacyService.getStockAlerts()                      │
│              → GET /api/v1/pharmacy/stock-alerts                       │
│              → DB: stock_alerts + pharmacy_inventory                    │
│                                                                         │
│ DeliveryTracking → pharmacyService.getDeliveryTracking()               │
│                → GET /api/v1/pharmacy/delivery/{orderId}               │
│                → DB: delivery_tracking                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 MISSING API ENDPOINTS SUMMARY

| Module | Expected Endpoints | Existing | Missing | Completion % |
|--------|-------------------|----------|---------|-------------|
| Auth | 12 | 2 (stubs) | 10 | 0% |
| Users | 8 | 2 (stubs) | 6 | 0% |
| Doctor | 20 | 0 | 20 | 0% |
| Hospital | 25 | 0 | 25 | 0% |
| Pharmacy | 20 | 0 | 20 | 0% |
| Appointment | 12 | 0 | 12 | 0% |
| Emergency | 8 | 0 | 8 | 0% |
| Blood Donation | 15 | 0 | 15 | 0% |
| Oxygen | 10 | 0 | 10 | 0% |
| Women's Health | 15 | 0 | 15 | 0% |
| Admin | 20 | 0 | 20 | 0% |
| Patient/Client | 15 | 0 | 15 | 0% |
| Search | 3 | 0 | 3 | 0% |
| Messaging | 6 | 0 | 6 | 0% |
| Reviews/Feedback | 4 | 0 | 4 | 0% |
| AI Assistant | 6 | 0 | 6 | 0% |
| **TOTAL** | **199** | **2** | **197** | **~1%** |

---

## 2.3 MISSING DATABASE RELATIONS (ORM Layer)

The SQL schema has 85 tables. Only ~30 have ORM models. Missing ORM models:

### Auth & User Tables (7 missing)
- `roles` — Role definitions with priority hierarchy
- `user_sessions` — JWT refresh token storage
- `user_roles` — Many-to-many users↔roles junction
- `user_role_upgrades` — Role upgrade workflow
- `user_addresses` — Multi-address with geolocation
- `user_emergency_contacts` — Emergency contact list
- `user_notification_settings` — Per-user notification preferences
- `user_documents` — Uploaded documents with verification
- `password_resets` — Password reset tokens
- `user_preferences` — App preferences

### Doctor Tables (4 missing)
- `doctor_earnings` — Daily revenue tracking
- `doctor_patients` — Doctor-patient relationship
- `doctor_notifications` — Doctor notification queue
- `doctor_activities` — Activity feed

### Hospital Tables (6 missing)
- `hospital_doctors` — Hospital-doctor affiliation
- `hospital_blood_bank` — Hospital blood bank
- `hospital_blood_stocks` — Blood group inventory
- `hospital_oxygen_stock` — Oxygen inventory
- `hospital_ambulances` — Fleet management
- `hospital_activities` — Activity log

### Pharmacy Tables (3 missing)
- `order_items` — Medicine order line items
- `stock_alerts` — Low stock alerts
- `delivery_tracking` — Delivery tracking updates

### Oxygen Tables (3 missing)
- `oxygen_stocks` — Oxygen center inventory
- `oxygen_centers` — Oxygen supply centers
- `oxygen_requests` — Oxygen supply requests

### Emergency Tables (2 missing)
- `emergency_services` — Emergency service providers
- `emergency_requests` — Emergency request tracking

### Blood Donation Tables (3 missing)
- `donor_rewards` — Donor reward system
- `donor_documents` — Donor verification documents
- `donation_reminders` — Donation reminders

### Women's Health Tables (3 missing)
- `baby_health_records` — Baby health tracking
- `gynecologist_consultations` — Consultation records
- `emergency_pregnancy_contacts` — Emergency contacts

### System Tables (3 missing)
- `search_logs` — Search analytics
- `audit_logs` — Audit trail
- `security_logs` — Security event logging

---

## 2.4 MISMATCH BETWEEN FRONTEND AND BACKEND

### Mismatch 1: API URL Format
```
Frontend expects:  http://localhost:5000/api/doctor/profile
Backend provides:  http://localhost:8000/api/v1/auth/login

Fix: Add route prefixes matching frontend expectations
     OR configure VITE_API_URL in frontend .env
```

### Mismatch 2: Login Response Format
```
Frontend expects:
{
  "user": { id, name, email, role, roles, primaryRole, upgrades, ... },
  "token": "...",
  "refreshToken": "..."
}

Backend returns:
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "user": { id, email, full_name, role, is_active }
}

Fix: Align response format — add roles, primaryRole, upgrades to user object
     Ensure token field naming matches frontend expectations
```

### Mismatch 3: User Role Names
```
Frontend routeConfig uses:  patient, doctor, hospital, pharmacy, admin, super_admin
Frontend authSlice uses:    client, doctor, hospital, pharmacy, admin, blood_donor
Backend constants use:      PATIENT, DOCTOR, HOSPITAL, PHARMACY, ADMIN, SUPER_ADMIN
Database seeds:             15 roles including sub-roles

Fix: Create a role mapping utility that normalizes role names
     Use database role names as source of truth
```

### Mismatch 4: Foreign Key Types
```
SQL Schema:   CHAR(36) UUID for all PKs and FKs
ORM Models:   Mix of String(36) and Integer for FK columns
              doctor_availability.doctor_id = Integer ❌ (should be CHAR(36))
              appointment.doctor_id = Integer ❌ (should be CHAR(36))
              blood_donations.donor_id = Integer ❌ (should be CHAR(36))

Fix: Update ORM model FK columns to String(36) matching UUID PKs
```

### Mismatch 5: Pagination Format
```
Frontend expects:
{
  items: [...],
  total: 100,
  page: 1,
  size: 20,
  pages: 5
}

Backend defines:
class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    size: int
    pages: int

Status: ✅ Match — just needs implementation
```

---

# ═══════════════════════════════════════════
# STEP 3: EXTENSION STRATEGY (NO REBUILD)
# ═══════════════════════════════════════════

---

## 3.1 EXISTING SYSTEM SUMMARY

| Component | Status | Action Required |
|-----------|--------|----------------|
| FastAPI App Factory | ✅ Working | Extend: add rate limiting, request logging |
| Config (pydantic-settings) | ✅ Working | Extend: add SMTP, Redis, CORS settings |
| Database Connection | ✅ Working | Keep as-is |
| ORM Models (30 tables) | ⚠️ Partial | Fix: FK type mismatches; Add: 55 missing models |
| Auth Routes (2) | ⚠️ Stub | Fix: implement real login/register with DB |
| Auth Middleware | ⚠️ Stub | Fix: real user lookup, RBAC |
| Auth Service | ⚠️ Stub | Fix: real password verification, token creation |
| JWT Utilities | ✅ Working | Keep as-is |
| Password Hashing | ✅ Working | Keep as-is |
| Core Exceptions | ✅ Working | Extend: add more exception types |
| Core Constants | ✅ Working | Extend: add more enums |
| Common Schemas | ✅ Working | Extend: add more response types |
| Auth Schemas | ⚠️ Partial | Extend: add more request/response models |
| All other modules | 🔴 Missing | Add: schemas, services, routes for ALL modules |

---

## 3.2 PROBLEMS IDENTIFIED (Priority Order)

### P0 — CRITICAL (System non-functional without these)
1. Auth login/register doesn't query database
2. Auth middleware returns hardcoded demo user
3. No RBAC — any token grants any access
4. No refresh token management
5. No session management

### P1 — HIGH (Core features missing)
6. No doctor module APIs
7. No hospital module APIs
8. No pharmacy module APIs
9. No appointment module APIs
10. No emergency module APIs
11. No blood donation module APIs
12. No admin module APIs
13. No patient/client module APIs
14. FK type mismatches in ORM models
15. 55 missing ORM models

### P2 — MEDIUM (Secondary features missing)
16. No women's health APIs
17. No oxygen module APIs
18. No search functionality
19. No messaging/notifications APIs
20. No review/feedback APIs
21. No AI assistant APIs
22. Email utility broken (missing SMTP config)

### P3 — LOW (Polish & optimization)
23. No rate limiting
24. No audit logging
25. No API request/response logging
26. No Alembic migrations configured
27. No WebSocket support for real-time features
28. No health check for database connectivity

---

## 3.3 REQUIRED FIXES (Detailed)

### Fix 1: Auth Service — Real Login
```
Current: Returns hardcoded demo user
Required: Query users table by email, verify password_hash, load roles,
          create JWT with real user_id and roles, store refresh token in
          user_sessions table, return proper response format
Files: app/services/auth_service.py, app/middleware/auth_middleware.py
Risk: LOW — extending existing stub, no breaking change
```

### Fix 2: Auth Service — Real Register
```
Current: Just calls login (doesn't create user)
Required: Validate input, hash password, insert into users table,
          create user_profiles record, assign default role in user_roles,
          send verification email, return proper response
Files: app/services/auth_service.py
Risk: LOW — extending existing stub
```

### Fix 3: Auth Middleware — Real User Lookup
```
Current: Returns hardcoded CurrentUser class
Required: Decode JWT, extract user_id from "sub" claim, query users table,
          load roles from user_roles table, return proper CurrentUser object
          with all fields that routes need (id, email, full_name, role, roles,
          primaryRole, is_active, is_admin_approved)
Files: app/middleware/auth_middleware.py
Risk: LOW — all existing routes already depend on this, just making it real
```

### Fix 4: RBAC Dependency
```
Current: No role checking at all
Required: Create require_role() and require_permission() FastAPI dependencies
          that check current_user.role against allowed roles for each endpoint
Files: NEW app/core/permissions.py, extend app/middleware/auth_middleware.py
Risk: LOW — additive only, doesn't break existing routes
```

### Fix 5: ORM FK Type Mismatches
```
Current: doctor_availability.doctor_id = Integer
Required: Change to String(36) to match UUID PKs
Files: app/models/doctor.py, app/models/appointment.py, app/models/blood_donation.py
Risk: MEDIUM — existing code that references these will need import updates
       but since no real data exists yet, this is safe
```

### Fix 6: Email Config
```
Current: References SMTP_USER, SMTP_PASSWORD which don't exist in Settings
Required: Add SMTP config fields to Settings class, or make email utility
          gracefully skip if not configured
Files: app/config.py, app/utils/email.py
Risk: LOW — additive change
```

---

## 3.4 NEW ADDITIONS (Module by Module)

### Addition Priority Order:

**Phase 1: Foundation (CRITICAL)**
1. Fix auth service + middleware (P0)
2. Add RBAC dependencies (P0)
3. Add missing auth schemas (P0)
4. Fix ORM model FK types (P1)
5. Add missing ORM models for auth tables (P1)
6. Add user profile CRUD (P1)

**Phase 2: Core Modules (HIGH)**
7. Doctor module: schemas + service + routes (P1)
8. Hospital module: schemas + service + routes (P1)
9. Pharmacy module: schemas + service + routes (P1)
10. Appointment module: schemas + service + routes (P1)
11. Patient module: schemas + service + routes (P1)

**Phase 3: Emergency & Blood (HIGH)**
12. Emergency module: models + schemas + service + routes (P1)
13. Blood donation module: schemas + service + routes (P1)
14. Oxygen module: models + schemas + service + routes (P2)

**Phase 4: Admin & Search (MEDIUM)**
15. Admin module: schemas + service + routes (P1)
16. Search module: models + schemas + service + routes (P2)

**Phase 5: Specialized (MEDIUM)**
17. Women's health module: schemas + service + routes (P2)
18. AI assistant module: schemas + service + routes (P2)
19. Messaging/notifications: schemas + service + routes (P2)
20. Reviews/feedback: schemas + service + routes (P2)

**Phase 6: Infrastructure (LOW)**
21. Rate limiting middleware (P3)
22. Audit logging middleware (P3)
23. Alembic migration setup (P3)
24. WebSocket support (P3)

---

## 3.5 RISK ASSESSMENT

| Change | Risk | Mitigation |
|--------|------|-----------|
| Fix auth service | LOW | No real users exist yet; stub returns demo data |
| Fix auth middleware | LOW | Current code always returns demo user — making it real won't break anything |
| Fix ORM FK types | MEDIUM | No real data in DB; migration can alter columns safely |
| Add new ORM models | LOW | Purely additive; no existing code depends on them |
| Add new route modules | LOW | Purely additive; new routers with new prefixes |
| Add RBAC | MEDIUM | Need to ensure all existing stub routes still work without roles |
| Add rate limiting | LOW | Can be added as optional middleware |
| Add Alembic | LOW | Additive; just migration tracking |

### HIGH-RISK AREAS TO WATCH:
1. **Changing login response format** — Frontend authSlice expects specific shape. Must maintain backward compatibility by keeping existing fields while adding new ones.
2. **Role name changes** — Frontend uses different role names in different places. Need a mapping layer.
3. **API URL prefix** — Changing from `/api/v1` to match frontend's `/api` could break existing docs.

---

## 3.6 TARGET FILE STRUCTURE (Extension Only)

```
backend/app/
├── __init__.py                          # ✅ EXISTS — no change
├── main.py                              # ✅ EXISTS — EXTEND: add rate limit, logging, new routers
├── config.py                            # ✅ EXISTS — EXTEND: add SMTP, Redis, rate limit config
├── database.py                          # ✅ EXISTS — no change
│
├── core/
│   ├── __init__.py                      # ✅ EXISTS — no change
│   ├── constants.py                     # ✅ EXISTS — EXTEND: add more enums
│   ├── exceptions.py                    # ✅ EXISTS — EXTEND: add more exception types
│   ├── permissions.py                   # 🆕 NEW: RBAC dependencies
│   └── security.py                      # 🆕 NEW: input validation, rate limit helpers
│
├── models/
│   ├── __init__.py                      # ✅ EXISTS — EXTEND: import all models for Alembic
│   ├── base.py                          # ✅ EXISTS — no change
│   ├── user.py                          # ✅ EXISTS — EXTEND: fix types, add missing models
│   ├── doctor.py                        # ✅ EXISTS — FIX: FK types, ADD: missing models
│   ├── hospital.py                      # ✅ EXISTS — FIX: FK types, ADD: missing models
│   ├── pharmacy.py                      # ✅ EXISTS — ADD: missing models (order_items, etc.)
│   ├── appointment.py                   # ✅ EXISTS — FIX: FK types
│   ├── blood_donation.py                # ✅ EXISTS — FIX: FK types, ADD: missing models
│   ├── patient.py                       # ✅ EXISTS — no change
│   ├── women_health.py                  # ✅ EXISTS — ADD: missing models
│   ├── admin.py                         # ✅ EXISTS — ADD: missing models
│   ├── messaging.py                     # ✅ EXISTS — no change
│   ├── review.py                        # ✅ EXISTS — no change
│   ├── ai_assistant.py                  # ✅ EXISTS — no change
│   ├── emergency.py                     # 🆕 NEW: emergency models
│   ├── oxygen.py                        # 🆕 NEW: oxygen models
│   └── search.py                        # 🆕 NEW: search log model
│
├── schemas/
│   ├── __init__.py                      # ✅ EXISTS — no change
│   ├── common.py                        # ✅ EXISTS — EXTEND: add more response types
│   ├── auth.py                          # ✅ EXISTS — EXTEND: add more schemas
│   ├── user.py                          # 🆕 NEW: user profile schemas
│   ├── doctor.py                        # 🆕 NEW: doctor module schemas
│   ├── hospital.py                      # 🆕 NEW: hospital module schemas
│   ├── pharmacy.py                      # 🆕 NEW: pharmacy module schemas
│   ├── appointment.py                   # 🆕 NEW: appointment module schemas
│   ├── blood_donation.py                # 🆕 NEW: blood donation schemas
│   ├── emergency.py                     # 🆕 NEW: emergency schemas
│   ├── oxygen.py                        # 🆕 NEW: oxygen schemas
│   ├── women_health.py                  # 🆕 NEW: women's health schemas
│   ├── admin.py                         # 🆕 NEW: admin schemas
│   ├── patient.py                       # 🆕 NEW: patient schemas
│   ├── messaging.py                     # 🆕 NEW: messaging schemas
│   ├── review.py                        # 🆕 NEW: review schemas
│   ├── ai_assistant.py                  # 🆕 NEW: AI assistant schemas
│   └── search.py                        # 🆕 NEW: search schemas
│
├── services/
│   ├── __init__.py                      # ✅ EXISTS — no change
│   ├── auth_service.py                  # ✅ EXISTS — FIX: real implementation
│   ├── user_service.py                  # ✅ EXISTS — FIX: real implementation
│   ├── doctor_service.py                # 🆕 NEW
│   ├── hospital_service.py              # 🆕 NEW
│   ├── pharmacy_service.py              # 🆕 NEW
│   ├── appointment_service.py           # 🆕 NEW
│   ├── blood_donation_service.py        # 🆕 NEW
│   ├── emergency_service.py             # 🆕 NEW
│   ├── oxygen_service.py                # 🆕 NEW
│   ├── women_health_service.py          # 🆕 NEW
│   ├── admin_service.py                 # 🆕 NEW
│   ├── patient_service.py               # 🆕 NEW
│   ├── messaging_service.py             # 🆕 NEW
│   ├── review_service.py                # 🆕 NEW
│   ├── ai_service.py                    # 🆕 NEW
│   └── search_service.py                # 🆕 NEW
│
├── api/
│   ├── __init__.py                      # ✅ EXISTS — no change
│   └── v1/
│       ├── __init__.py                  # ✅ EXISTS — EXTEND: register new routers
│       ├── auth.py                      # ✅ EXISTS — EXTEND: add more endpoints
│       ├── users.py                     # ✅ EXISTS — FIX: real implementation
│       ├── doctor.py                    # 🆕 NEW
│       ├── hospital.py                  # 🆕 NEW
│       ├── pharmacy.py                  # 🆕 NEW
│       ├── appointment.py               # 🆕 NEW
│       ├── blood_donation.py            # 🆕 NEW
│       ├── emergency.py                 # 🆕 NEW
│       ├── oxygen.py                    # 🆕 NEW
│       ├── women_health.py              # 🆕 NEW
│       ├── admin.py                     # 🆕 NEW
│       ├── patient.py                   # 🆕 NEW
│       ├── messaging.py                 # 🆕 NEW
│       ├── review.py                    # 🆕 NEW
│       ├── ai_assistant.py              # 🆕 NEW
│       └── search.py                    # 🆕 NEW
│
├── middleware/
│   ├── __init__.py                      # ✅ EXISTS — no change
│   ├── auth_middleware.py               # ✅ EXISTS — FIX: real user lookup + RBAC
│   ├── rate_limit.py                    # 🆕 NEW
│   └── audit_log.py                     # 🆕 NEW
│
├── repositories/
│   ├── __init__.py                      # 🆕 NEW
│   ├── base.py                          # 🆕 NEW: generic CRUD repository
│   ├── user_repo.py                     # 🆕 NEW
│   ├── doctor_repo.py                   # 🆕 NEW
│   ├── hospital_repo.py                 # 🆕 NEW
│   ├── pharmacy_repo.py                 # 🆕 NEW
│   ├── appointment_repo.py              # 🆕 NEW
│   └── ...                              # 🆕 NEW: one per module
│
├── utils/
│   ├── __init__.py                      # ✅ EXISTS — no change
│   ├── security.py                      # ✅ EXISTS — no change (works correctly)
│   ├── helpers.py                       # ✅ EXISTS — EXTEND: add more utilities
│   ├── email.py                         # ✅ EXISTS — FIX: add SMTP config to Settings
│   └── validators.py                    # 🆕 NEW: custom Pydantic validators
│
└── alembic/                             # 🆕 NEW: migration tracking
    ├── env.py
    ├── versions/
    └── alembic.ini
```

---

## 3.7 IMPLEMENTATION ORDER (MANDATORY)

```
PHASE 1 — FOUNDATION FIX (No new modules, just fix what's broken)
├── 1.1 Fix config.py — add SMTP, rate limit, CORS origin settings
├── 1.2 Fix auth_service.py — real login/register with DB queries
├── 1.3 Fix auth_middleware.py — real user lookup from DB
├── 1.4 Add core/permissions.py — RBAC dependency functions
├── 1.5 Extend core/constants.py — add all missing enums
├── 1.6 Extend core/exceptions.py — add ForbiddenException, etc.
├── 1.7 Fix ORM models — FK type mismatches (Integer → String(36))
├── 1.8 Add missing ORM models — auth tables (roles, user_sessions, etc.)
├── 1.9 Add auth schemas — refresh token, forgot password, profile update
├── 1.10 Extend auth routes — refresh, logout, forgot-password, profile
└── 1.11 Fix user_service.py — real CRUD operations

PHASE 2 — REPOSITORY LAYER (Reusable CRUD base)
├── 2.1 Add repositories/base.py — generic CRUD with pagination
├── 2.2 Add repositories/user_repo.py
└── 2.3 Add utils/validators.py — phone, blood group, date validators

PHASE 3 — CORE MODULES (Doctor, Hospital, Pharmacy, Appointment, Patient)
├── 3.1 Add missing ORM models for each module
├── 3.2 Add schemas for each module
├── 3.3 Add repositories for each module
├── 3.4 Add services for each module
├── 3.5 Add routes for each module
└── 3.6 Register all routers in api/v1/__init__.py

PHASE 4 — EMERGENCY & BLOOD
├── 4.1 Add emergency models + schemas + service + routes
├── 4.2 Add blood donation missing models + schemas + service + routes
└── 4.3 Add oxygen models + schemas + service + routes

PHASE 5 — ADMIN & SEARCH
├── 5.1 Add admin schemas + service + routes
├── 5.2 Add search models + schemas + service + routes
└── 5.3 Add audit/security log models

PHASE 6 — SPECIALIZED MODULES
├── 6.1 Add women's health schemas + service + routes
├── 6.2 Add AI assistant schemas + service + routes
├── 6.3 Add messaging schemas + service + routes
└── 6.4 Add review/feedback schemas + service + routes

PHASE 7 — INFRASTRUCTURE
├── 7.1 Add rate limiting middleware
├── 7.2 Add audit logging middleware
├── 7.3 Setup Alembic migrations
└── 7.4 Add WebSocket support for notifications
```

---

## 3.8 CODE GENERATION RULES

For every file I create or modify:

1. **NEVER delete existing code** — only extend
2. **NEVER change existing function signatures** — only add new parameters with defaults
3. **NEVER remove existing imports** — only add new ones
4. **NEVER rename existing variables** — only add new ones
5. **Always use UUID CHAR(36) for all FK columns** matching the SQL schema
6. **Always use the existing Base from app/database.py**
7. **Always use the existing BaseModel mixin from app/models/base.py**
8. **Always follow existing naming conventions** (snake_case for Python)
9. **Always add proper type hints** (Python 3.11+)
10. **Always add docstrings** to service classes and complex methods
11. **Always validate input with Pydantic** before database operations
12. **Always use parameterized queries** via SQLAlchemy (SQL injection prevention)
13. **Always return consistent APIResponse format** matching frontend expectations

---

## 3.9 SECURITY ARCHITECTURE

### JWT Authentication Flow:
```
Login → Verify credentials → Create access_token (15min) + refresh_token (7d)
      → Store refresh_token in user_sessions table
      → Return { access_token, refresh_token, user }

API Request → Auth middleware extracts Bearer token
           → Decode JWT → verify expiry + type="access"
           → Query users table by sub (user_id)
           → Load roles from user_roles
           → Inject CurrentUser into request

Refresh → POST /auth/refresh with refresh_token
       → Decode JWT → verify expiry + type="refresh"
       → Query user_sessions to validate token exists
       → Create new access_token
       → Optionally rotate refresh_token

Logout → POST /auth/logout
      → Delete refresh_token from user_sessions
      → Client clears sessionStorage
```

### RBAC Flow:
```
@router.get("/admin/users", dependencies=[Depends(require_role("admin", "super_admin"))])
@router.get("/doctor/patients", dependencies=[Depends(require_role("doctor"))])
@router.post("/appointments", dependencies=[Depends(require_role("patient", "doctor"))])

require_role(*allowed_roles):
  1. Get current_user from auth middleware
  2. Check if current_user.primary_role in allowed_roles
  3. If not → raise ForbiddenException (403)
  4. If yes → allow request
```

### Input Validation:
- All request bodies validated with Pydantic v2
- Email validation with EmailStr
- Phone number regex validation
- Blood group enum validation
- Date range validation
- Pagination parameter bounds checking
- SQL injection prevention via SQLAlchemy ORM (parameterized queries)

### Rate Limiting:
- Login: 5 attempts per minute per IP
- Register: 3 attempts per minute per IP
- API general: 100 requests per minute per user
- Emergency SOS: 10 per minute per user

---

## 3.10 ESTIMATED SCOPE

| Item | Count |
|------|-------|
| Files to FIX (existing) | ~8 |
| Files to EXTEND (existing) | ~6 |
| NEW files to CREATE | ~60 |
| Total endpoints to implement | ~197 |
| ORM models to add | ~55 |
| Pydantic schemas to create | ~150+ |
| Services to implement | ~16 |

**Estimated effort:** 197 API endpoints across 16 modules, building on existing 30 ORM models and 85-table SQL schema.

---

*END OF ANALYSIS REPORT*
*Ready to proceed with implementation upon approval.*
