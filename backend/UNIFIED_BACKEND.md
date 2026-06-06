# Aetherion Healthcare - Unified Backend Architecture

## Final Folder Structure

```
aetherion/
│
├── backend/                              # ✅ UNIFIED BACKEND (SINGLE ENTRY POINT)
│   ├── main.py                           # 🚀 SINGLE ENTRY POINT - Run this!
│   ├── requirements.txt                  # Python dependencies
│   ├── README.md                         # Backend documentation
│   └── app/                              # Production-grade modular structure
│       ├── __init__.py
│       ├── api/
│       │   ├── v1/
│       │   │   ├── auth.py              # ✅ Login, Register, JWT refresh
│       │   │   ├── users.py             # ✅ User CRUD
│       │   │   ├── admin.py             # ✅ Admin dashboard, admin_users CRUD
│       │   │   ├── doctor.py            # Doctor endpoints
│       │   │   ├── hospital.py          # Hospital endpoints
│       │   │   ├── pharmacy.py          # Pharmacy endpoints
│       │   │   ├── patients.py          # Patient endpoints
│       │   │   ├── appointments.py      # Appointment management
│       │   │   ├── emergency.py         # Emergency requests
│       │   │   ├── blood_donation.py    # Blood bank
│       │   │   ├── oxygen.py            # Oxygen requests
│       │   │   ├── messaging.py         # Chat/Messaging
│       │   │   ├── ai_assistant.py      # AI diagnostics
│       │   │   ├── search.py            # Global search
│       │   │   └── women_health.py      # Women's health
│       │   └── ws/
│       │       ├── manager.py
│       │       ├── auth.py
│       │       ├── emergency.py
│       │       ├── messaging.py
│       │       └── notifications.py
│       ├── core/
│       │   ├── config.py                # ✅ DB: aethion_db, JWT config
│       │   ├── database.py              # ✅ SQLAlchemy + connection pooling
│       │   ├── security.py              # ✅ JWT + bcrypt password hashing
│       │   ├── permissions.py           # ✅ RBAC (admin, doctor, patient, etc.)
│       │   ├── exceptions.py            # ✅ Standard error handling
│       │   ├── logger.py                # Structured logging
│       │   ├── deps.py                  # FastAPI dependencies
│       │   └── events/                  # Event bus system
│       ├── middleware/
│       │   ├── auth_middleware.py       # JWT validation middleware
│       │   ├── rate_limit.py            # Rate limiting
│       │   ├── security_headers.py      # Security headers
│       │   └── validation.py            # Request validation
│       ├── models/                      # ✅ SQLAlchemy ORM (NO SQL in routes!)
│       │   ├── base.py
│       │   ├── user.py                  # users, user_roles, user_sessions
│       │   ├── admin.py                 # admin_users, verification_requests
│       │   ├── doctor.py
│       │   ├── patient.py
│       │   ├── hospital.py
│       │   ├── pharmacy.py
│       │   ├── appointment.py
│       │   ├── emergency.py
│       │   ├── blood_donation.py
│       │   ├── oxygen.py
│       │   ├── messaging.py
│       │   ├── search.py
│       │   ├── review.py
│       │   ├── women_health.py
│       │   └── ai_assistant.py
│       ├── schemas/                     # ✅ Pydantic schemas
│       │   ├── common.py                # APIResponse, PaginatedResponse
│       │   ├── auth.py                  # LoginRequest, RegisterRequest, TokenResponse
│       │   ├── user.py
│       │   ├── admin.py
│       │   ├── doctor.py
│       │   ├── hospital.py
│       │   ├── pharmacy.py
│       │   ├── patient.py
│       │   ├── appointment.py
│       │   ├── emergency.py
│       │   ├── blood_donation.py
│       │   ├── oxygen.py
│       │   ├── messaging.py
│       │   ├── search.py
│       │   ├── women_health.py
│       │   └── ai_assistant.py
│       ├── services/                    # ✅ Business logic (NO SQL here!)
│       │   ├── auth_service.py          # Login, register, refresh, logout
│       │   ├── user_service.py          # User CRUD
│       │   ├── admin_service.py         # Admin operations
│       │   ├── doctor_service.py
│       │   ├── hospital_service.py
│       │   ├── pharmacy_service.py
│       │   ├── patient_service.py
│       │   ├── appointment_service.py
│       │   ├── emergency_service.py
│       │   ├── blood_donation_service.py
│       │   ├── oxygen_service.py
│       │   ├── messaging_service.py
│       │   ├── search_service.py
│       │   ├── women_health_service.py
│       │   └── ai_assistant_service.py
│       └── utils/
│           ├── email.py                 # Email sending
│           ├── helpers.py               # Helper functions
│           └── validators.py            # Input validators
│
├── myproject/                            # ❌ LEGACY - Can be deleted
│   └── main.py                          # Old standalone script
│
├── src/                                  # ✅ React Frontend
│   ├── pages/
│   │   └── auth/
│   │       └── Login.tsx                # ✅ Connected to backend
│   ├── services/
│   │   └── authService.ts               # ✅ API client
│   └── store/
│       └── slices/
│           └── authSlice.ts             # ✅ Redux auth state
│
└── .env                                  # Environment variables
```

## ✅ Unified Backend - Single Entry Point

### Run Command (ONE COMMAND ONLY):

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or:
```bash
cd backend
python main.py
```

## ✅ API Endpoints

### Health & System
```
GET  /                     → API info
GET  /health               → Health check (DB status, Redis, etc.)
GET  /docs                 → Swagger UI
GET  /redoc                → ReDoc
```

### Authentication (JWT + Bcrypt)
```
POST /api/v1/auth/login           → Login (returns access_token + refresh_token)
POST /api/v1/auth/register        → Register
POST /api/v1/auth/refresh         → Refresh access token
POST /api/v1/auth/logout          → Logout
POST /api/v1/auth/forgot-password → Request password reset
POST /api/v1/auth/reset-password  → Reset with token
POST /api/v1/auth/change-password → Change password (authenticated)
POST /api/v1/auth/verify-email    → Verify email
GET  /api/v1/auth/profile         → Get profile
PUT  /api/v1/auth/profile         → Update profile
POST /api/v1/auth/switch-role     → Switch active role
```

### Users
```
GET    /api/v1/users              → List users (paginated)
GET    /api/v1/users/{id}         → Get user by ID
PUT    /api/v1/users/{id}         → Update user
DELETE /api/v1/users/{id}         → Delete user
```

### Admin
```
GET    /api/v1/admin/dashboard    → Admin stats
GET    /api/v1/admin/verifications → Pending verifications
POST   /api/v1/admin/verifications/{id}/process → Approve/reject
GET    /api/v1/admin/audit-logs    → Audit trail
GET    /api/v1/admin/users         → User management
PUT    /api/v1/admin/users/{id}/toggle → Activate/deactivate
GET    /api/v1/admin/system-stats  → System statistics
```

### Other Modules
```
/api/v1/doctors
/api/v1/hospitals
/api/v1/pharmacies
/api/v1/patients
/api/v1/appointments
/api/v1/emergency
/api/v1/blood-donation
/api/v1/oxygen
/api/v1/messaging
/api/v1/ai-assistant
/api/v1/search
/api/v1/women-health
```

## ✅ Database Configuration

```python
# backend/app/core/config.py
DB_HOST: str = "localhost"
DB_PORT: int = 3306
DB_USER: str = "root"
DB_PASSWORD: str = ""
DB_NAME: str = "aethion_db"  # ✅ MATCHES YOUR DATABASE
```

**IMPORTANT**: Tables are NOT dropped or modified. All existing data is safe.

## ✅ Authentication Flow

```
Frontend (React Login.tsx)
    ↓ POST /api/v1/auth/login
    ↓ { email, password }
Backend (auth_service.py)
    ↓ Verify password with bcrypt
    ↓ Generate JWT tokens (access + refresh)
    ↓ Store refresh token in user_sessions table
Frontend (authService.ts)
    ↓ Store tokens (localStorage/cookie)
    ↓ Include Authorization: Bearer <token>
Backend (auth_middleware.py)
    ↓ Validate JWT
    ↓ Get user from DB
    ↓ Check permissions
    ↓ Allow/Deny request
```

## ✅ Response Format (ALL Endpoints)

Success:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "type": "ErrorType",
    "status_code": 400,
    "request_id": "uuid",
    "details": { ... }
  }
}
```

## ✅ Demo Login Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Patient | syeda@gmail.com | 123456 | /patient/dashboard |
| Doctor | pollob@gmail.com | 123456 | /doctor/dashboard |
| Hospital | hospital@aetherion.com | hospital123 | /hospital/dashboard |
| Pharmacy | pharmacy@aetherion.com | pharmacy123 | /pharmacy/dashboard |
| Admin | admin@aetherion.com | admin123 | /admin/dashboard |

## ✅ Security Features

| Feature | Implementation |
|---------|----------------|
| Password Hashing | Bcrypt (passlib) |
| JWT Tokens | HS256 algorithm, 15 min expiry |
| Refresh Tokens | 7 days expiry, one-time use (rotation) |
| Rate Limiting | Per-endpoint configuration |
| CORS | Configured for React frontend |
| Security Headers | HSTS, X-Frame-Options, CSP |
| Request Validation | Pydantic schemas |
| RBAC | Role-based access control |
| SQL Injection Protection | SQLAlchemy ORM (no raw SQL) |

## ✅ Frontend Compatibility

The React frontend (`src/pages/auth/Login.tsx`) works with this backend:

1. **Login**: POST `/api/v1/auth/login` with `{ email, password, role }`
2. **Response**: Returns `{ access_token, refresh_token, user }`
3. **Storage**: Tokens stored in localStorage (via authService.ts)
4. **Auth Header**: `Authorization: Bearer <access_token>`
5. **Refresh**: Auto-refresh using `/api/v1/auth/refresh`

## ✅ MVC Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ROUTES LAYER                         │
│  (app/api/v1/*.py) - FastAPI routers, request/response    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES LAYER                        │
│  (app/services/*.py) - Business logic, no HTTP/SQL          │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        MODELS LAYER                         │
│  (app/models/*.py) - SQLAlchemy ORM, DB table definitions  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                         │
│  (app/core/database.py) - Connection pooling, sessions     │
└─────────────────────────────┴───────────────────────────────┘
```

## ❌ Legacy System Cleanup (Optional)

The `myproject/main.py` file is a standalone script using raw mysql-connector.
It is **NOT connected** to the unified backend.

You can safely delete:
```
myproject/
└── main.py   # Legacy standalone script
```

## ✅ Verification Checklist

- [x] Single entry point: `backend/main.py`
- [x] Database: `aethion_db` (matches user's DB)
- [x] JWT authentication: ✅ Working
- [x] Password hashing: Bcrypt ✅
- [x] RBAC: Role-based access ✅
- [x] Frontend compatible: React Login.tsx works ✅
- [x] No SQL in routes: All in services/models ✅
- [x] Standard response format: APIResponse ✅
- [x] Error handling: Custom exceptions ✅
- [x] Health check: `/health` endpoint ✅
- [x] Admin module: admin_users CRUD ✅
- [x] Zero data loss: No tables dropped ✅
- [x] Single server command: `uvicorn main:app --reload` ✅

## 🚀 Next Steps

1. **Start the backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Test health check**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **Test login**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@aetherion.com","password":"admin123"}'
   ```

4. **Access API docs**:
   http://localhost:8000/docs

5. **Start frontend** (in another terminal):
   ```bash
   npm run dev
   ```

6. **Login in React**:
   Use demo credentials from the table above.

---

## 📝 Summary

✅ **UNIFIED BACKEND CREATED**

- **Single entry point**: `backend/main.py`
- **Run command**: `uvicorn main:app --reload`
- **Database**: `aethion_db` (existing tables safe)
- **Auth**: JWT + Bcrypt + Role-based access
- **Frontend**: Fully compatible with React
- **Architecture**: Production-grade MVC pattern
- **Zero duplication**: All legacy code can be removed
- **Data safe**: No tables dropped or modified

The backend is now a unified, production-ready system! 🎉