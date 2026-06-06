# Role-Aware Healthcare System - Complete Documentation

## 🏥 Overview

Aetherion Healthcare is a **Role-Aware Service Engine** where:
- **Backend defines intelligence** → Permissions, features, actions
- **Frontend visualizes intelligence** → Auto-builds UI based on backend responses
- **Universal Action API** → Single endpoint pattern for all actions
- **Dynamic RBAC** → Role-based access control at every level

## 🎯 Core Philosophy

> "Backend defines intelligence. Frontend only visualizes intelligence."

### How It Works:

1. **Frontend**: "I am logged in. What can I do?"
2. **Backend**: "You have these permissions, features, and actions."
3. **Frontend**: "Okay, I'll build the UI based on what you told me."
4. **User**: "I want to book an appointment."
5. **Frontend**: Sends request to `POST /api/v1/actions/appointment/book`
6. **Backend**: Validates permissions → Executes action → Returns result

## 🔐 Role System

### Supported Roles

| Role | Level | Description |
|------|-------|-------------|
| **patient** | 1 | End-users seeking healthcare |
| **blood_donor** | 1 | Registered blood donors |
| **emergency_volunteer** | 1 | Emergency response volunteers |
| **doctor** | 2 | Medical professionals |
| **hospital_admin** | 2 | Hospital administrators |
| **pharmacy_admin** | 2 | Pharmacy managers |
| **admin** | 3 | Platform administrators |
| **super_admin** | 3 | Full platform access |
| **authority** | 4 | Regulatory/audit officers |

## 📋 Permission System

### Permission Categories

```
patient.*          → Patient-specific actions
doctor.*           → Doctor-specific actions
hospital.*         → Hospital management actions
pharmacy.*         → Pharmacy management actions
admin.*            → Admin actions
authority.*        → Audit and compliance actions
appointment.*      → Appointment actions
prescription.*     → Prescription actions
emergency.*        → Emergency actions
blood_donation.*   → Blood donation actions
oxygen.*           → Oxygen supply actions
```

### Example Permissions

```python
# Patient permissions
patient.view_profile
patient.update_profile
patient.view_medical_records
appointment.book
appointment.cancel
prescription.view

# Doctor permissions
doctor.view_patients
doctor.write_prescription
doctor.manage_appointments
doctor.start_consultation

# Hospital permissions
hospital.manage_beds
hospital.allocate_bed
hospital.manage_staff
hospital.manage_emergency_queue

# Pharmacy permissions
pharmacy.manage_inventory
pharmacy.verify_prescription
pharmacy.dispense_medicine

# Authority permissions
authority.view_audit_logs
authority.view_compliance_reports
authority.investigate_incidents
```

## 🌐 Universal Action API

### Pattern

```
POST /api/v1/actions/{module}/{action}
GET  /api/v1/actions/{module}/{action}
```

### Example Requests

```bash
# Book an appointment
POST /api/v1/actions/appointment/book
{
  "data": {
    "doctor_id": "uuid",
    "date": "2024-01-15",
    "time": "10:00"
  }
}

# Create a prescription
POST /api/v1/actions/prescription/create
{
  "data": {
    "patient_id": "uuid",
    "medicines": [...],
    "dosage": "..."
  }
}

# Allocate hospital bed
POST /api/v1/actions/hospital/bed_allocate
{
  "data": {
    "patient_id": "uuid",
    "bed_type": "icu"
  }
}

# View audit logs (authority only)
GET /api/v1/actions/authority/audit_logs
```

### Automatic Permission Check

Every action automatically checks:
1. Is user authenticated? (JWT token)
2. Is user active?
3. Does user have the required permission?
4. If authority: Log to audit trail

If any check fails → `403 Forbidden`

## 🧩 Frontend Auto-Driven System

### Step 1: Login

```javascript
// Frontend: Login
const response = await authService.login({
  email: "doctor@example.com",
  password: "password123",
  role: "doctor"
});

// Response
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "user": { ... }
  }
}
```

### Step 2: Get User Permissions & Features

```javascript
// Frontend: Get what user can do
const response = await fetch('/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data } = await response.json();

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "doctor@example.com",
      "full_name": "Dr. John Doe",
      "role": "doctor",
      "roles": ["doctor"],
      "primary_role": "doctor"
    },
    "permissions": [
      "doctor.view_patients",
      "doctor.write_prescription",
      "doctor.manage_appointments",
      "appointment.view",
      ...
    ],
    "features": [
      "dashboard",
      "patient_list",
      "patient_details",
      "write_prescription",
      "my_appointments_doctor",
      ...
    ],
    "can_execute_actions": [
      {
        "module": "appointment",
        "action": "accept",
        "permission": "doctor.accept_appointment",
        "allowed": true
      },
      ...
    ],
    "dashboard_config": {
      "layout": "doctor",
      "widgets": [
        {
          "id": "appointments_today",
          "title": "Today's Appointments",
          "type": "list",
          "permission": "doctor.view_appointments",
          "route": "/doctor/appointments"
        },
        ...
      ]
    },
    "is_full_access": false
  }
}
```

### Step 3: Build UI Dynamically

```javascript
// Frontend: Build UI based on permissions
function buildDashboard(permissions, features, dashboardConfig) {
  const widgets = dashboardConfig.widgets.filter(widget => {
    // Only show widgets user has permission for
    return !widget.permission || permissions.includes(widget.permission);
  });

  return widgets.map(widget => renderWidget(widget));
}

function renderWidget(widget) {
  // Auto-generate widget component
  return `
    <div class="widget ${widget.type}">
      <h3>${widget.title}</h3>
      <!-- Widget content loaded via action API -->
    </div>
  `;
}
```

### Step 4: Execute Actions

```javascript
// Frontend: Execute action
async function executeAction(module, action, data) {
  const response = await fetch(`/api/v1/actions/${module}/${action}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  });

  // Backend automatically checks permissions
  // Returns result or 403 if not allowed
  return await response.json();
}

// Usage
await executeAction('appointment', 'book', {
  doctor_id: 'uuid',
  date: '2024-01-15',
  time: '10:00'
});
```

## 🔍 System Discovery APIs

### Get All Features for Role

```bash
GET /api/v1/system/features

Response:
{
  "success": true,
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
    "categories": [...],
    "total": 15
  }
}
```

### Discover Available Actions

```bash
GET /api/v1/actions/discover

Response:
{
  "success": true,
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
```

### Get API by Role (For Auto-Client Generation)

```bash
GET /api/v1/system/openapi-roles?role=doctor

Response:
{
  "success": true,
  "data": {
    "role": "doctor",
    "endpoints": [
      {
        "path": "/api/v1/actions/appointment/book",
        "method": "POST",
        "permission": "appointment.book",
        "description": "Book an appointment"
      },
      ...
    ],
    "total": 25
  }
}
```

### Get All Role Definitions (Admin Only)

```bash
GET /api/v1/system/roles

Response:
{
  "success": true,
  "data": {
    "roles": [
      {
        "name": "doctor",
        "display_name": "Doctor",
        "permissions": [...],
        "features": [...],
        "level": 2,
        "permission_count": 15,
        "feature_count": 8
      },
      ...
    ],
    "total": 9
  }
}
```

## 🏗️ Backend Architecture

### File Structure

```
backend/app/
├── core/
│   ├── permissions_def.py    # Role, Permission, Feature, Action definitions
│   ├── permissions.py         # CurrentUser with permission methods
│   ├── database.py            # Database connection
│   ├── security.py            # JWT, password hashing
│   └── exceptions.py          # Custom exceptions
│
├── api/v1/
│   ├── actions.py             # Universal action router
│   ├── system.py              # Discovery APIs
│   └── auth.py                # Enhanced auth with permissions
│
├── middleware/
│   └── auth_middleware.py     # JWT validation, loads permissions
│
└── services/
    └── *_service.py           # Business logic
```

### Permission Checking Flow

```
Request
  ↓
auth_middleware.py
  ↓ Validate JWT
  ↓ Load user from DB
  ↓ Create CurrentUser
  ↓ Auto-load permissions & features
  ↓
Endpoint (e.g., /actions/appointment/book)
  ↓
Permission Check (automatic)
  ↓ current_user.can_execute_action(module, action)
  ↓
Service Layer
  ↓ Execute business logic
  ↓
Database
```

## 🔐 Authority Role (Audit System)

### Automatic Audit Logging

For users with `authority` or `super_admin` role:
- Every action is automatically logged
- Includes: user, action, module, timestamp, IP, result
- Stored in `audit_logs` table

### Audit Log Entry

```python
{
  "user_id": "uuid",
  "action": "appointment.book",
  "resource_type": "appointment",
  "resource_id": "uuid",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "success": true,
  "error_message": null,
  "metadata": {"data": {...}},
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Authority Endpoints

```bash
# View audit logs
GET /api/v1/actions/authority/audit_logs

# Generate compliance reports
GET /api/v1/actions/authority/compliance_reports

# Investigate incidents
POST /api/v1/actions/authority/incident_investigate
```

## 🎨 Frontend Integration Guide

### React Integration

```typescript
// src/context/RoleContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

interface RoleContextType {
  permissions: string[];
  features: string[];
  canExecute: (module: string, action: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasFeature: (feature: string) => boolean;
}

const RoleContext = createContext<RoleContextType>(null!);

export function RoleProvider({ children, token }) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [canExecuteActions, setCanExecuteActions] = useState<any[]>([]);

  useEffect(() => {
    // Load permissions on mount
    fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPermissions(data.data.permissions);
        setFeatures(data.data.features);
        setCanExecuteActions(data.data.can_execute_actions);
      });
  }, [token]);

  const canExecute = (module: string, action: string) => {
    return canExecuteActions.some(
      a => a.module === module && a.action === action && a.allowed
    );
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasFeature = (feature: string) => {
    return features.includes(feature);
  };

  return (
    <RoleContext.Provider
      value={{ permissions, features, canExecute, hasPermission, hasFeature }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
```

### Component Example

```typescript
// src/components/Dashboard.tsx
import { useRole } from '../context/RoleContext';

export function Dashboard() {
  const { features, hasFeature, hasPermission } = useRole();

  return (
    <div className="dashboard">
      {/* Auto-generate navigation based on features */}
      {hasFeature('patient_list') && (
        <Link to="/doctor/patients">Patients</Link>
      )}
      {hasFeature('write_prescription') && (
        <Link to="/doctor/prescriptions/create">Write Prescription</Link>
      )}

      {/* Auto-generate widgets based on dashboard config */}
      {hasPermission('doctor.view_appointments') && (
        <AppointmentsWidget />
      )}
      {hasPermission('doctor.view_patients') && (
        <PatientsWidget />
      )}
    </div>
  );
}
```

### Action Hook

```typescript
// src/hooks/useAction.ts
import { useRole } from '../context/RoleContext';

export function useAction() {
  const { canExecute } = useRole();

  async function execute(module: string, action: string, data?: any) {
    if (!canExecute(module, action)) {
      throw new Error('Permission denied');
    }

    const response = await fetch(`/api/v1/actions/${module}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ data })
    });

    return await response.json();
  }

  return { execute };
}

// Usage
function BookAppointmentButton() {
  const { execute } = useAction();

  const handleBook = async () => {
    try {
      const result = await execute('appointment', 'book', {
        doctor_id: 'uuid',
        date: '2024-01-15',
        time: '10:00'
      });

      toast.success('Appointment booked!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return <button onClick={handleBook}>Book Appointment</button>;
}
```

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| Authentication | JWT tokens (15 min access, 7 days refresh) |
| Password Hashing | Bcrypt |
| Permission Validation | Automatic on every action |
| Role Hierarchy | 4 levels (user → provider → admin → authority) |
| Audit Logging | Automatic for authority role |
| Token Rotation | Refresh tokens are one-time use |
| SQL Injection | SQLAlchemy ORM (no raw SQL) |
| CORS | Configured per environment |
| Rate Limiting | Per-endpoint configuration |

## 📊 Role Permission Summary

| Role | Permissions | Features | Level |
|------|-------------|----------|-------|
| patient | ~20 | ~13 | 1 |
| blood_donor | ~5 | ~5 | 1 |
| emergency_volunteer | ~3 | ~4 | 1 |
| doctor | ~15 | ~8 | 2 |
| hospital_admin | ~25 | ~10 | 2 |
| pharmacy_admin | ~15 | ~7 | 2 |
| admin | ~80 (all except authority) | ~20 | 3 |
| super_admin | ~90 (all) | ~30 | 3 |
| authority | ~20 (read-only + audit) | ~10 | 4 |

## 🚀 Quick Start

### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Frontend Integration

```typescript
// 1. Login
const { access_token } = await authService.login({ email, password });

// 2. Get permissions
const { data } = await fetch('/api/v1/auth/me', {
  headers: { Authorization: `Bearer ${access_token}` }
}).then(r => r.json());

// 3. Build UI based on data.permissions and data.features

// 4. Execute actions
await fetch('/api/v1/actions/appointment/book', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ data: { doctor_id, date, time } })
});
```

## 📚 API Endpoints Summary

### Discovery APIs
- `GET /api/v1/auth/me` - User profile with permissions & features
- `GET /api/v1/system/features` - Role-based feature list
- `GET /api/v1/system/openapi-roles` - API by role
- `GET /api/v1/system/roles` - All role definitions (admin)
- `GET /api/v1/system/permissions` - All permissions
- `GET /api/v1/system/actions` - All action definitions
- `GET /api/v1/system/dashboard-config` - Dashboard config by role

### Universal Action API
- `POST /api/v1/actions/{module}/{action}` - Execute any action
- `GET /api/v1/actions/{module}/{action}` - Read-only actions
- `GET /api/v1/actions/discover` - Available actions for user

## 🎯 Key Takeaways

1. **Backend is the source of truth** - All permissions, features, actions defined in backend
2. **Frontend is auto-driven** - UI builds itself based on backend responses
3. **Universal action API** - Single pattern for all operations
4. **Automatic permission check** - No manual checks needed in endpoints
5. **Audit logging** - Automatic for authority role
6. **Scalable** - Easy to add new roles, permissions, features
7. **Secure** - RBAC at every level

---

**Backend defines intelligence. Frontend only visualizes intelligence.**