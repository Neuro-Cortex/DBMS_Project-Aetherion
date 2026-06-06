# Aetherion Healthcare - Unified Backend

This is the production-grade, unified FastAPI backend for the Aetherion Healthcare Platform.

## Quick Start

### Prerequisites
- Python 3.10+
- MySQL 8.0+
- pip

### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Database Setup

Ensure MySQL is running and the database `aethion_db` exists:

```sql
CREATE DATABASE IF NOT EXISTS aethion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The database configuration is in `app/core/config.py`:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `` (empty)
- Database: `aethion_db`

### Running the Server

```bash
# From backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly:
```bash
python main.py
```

### API Documentation

Once the server is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Root**: http://localhost:8000/

## Architecture

```
backend/
├── main.py                    # Single entry point
├── requirements.txt           # Python dependencies
└── app/
    ├── __init__.py
    ├── api/                   # API routes
    │   ├── v1/               # REST API v1
    │   │   ├── auth.py       # Authentication endpoints
    │   │   ├── users.py      # User management
    │   │   ├── admin.py      # Admin endpoints
    │   │   ├── doctor.py     # Doctor module
    │   │   ├── hospital.py   # Hospital module
    │   │   ├── pharmacy.py   # Pharmacy module
    │   │   ├── patients.py   # Patient module
    │   │   ├── appointments.py
    │   │   ├── emergency.py  # Emergency requests
    │   │   ├── blood_donation.py
    │   │   ├── oxygen.py
    │   │   ├── messaging.py
    │   │   ├── ai_assistant.py
    │   │   ├── search.py
    │   │   └── women_health.py
    │   └── ws/               # WebSocket routes
    │       ├── manager.py
    │       ├── auth.py
    │       ├── emergency.py
    │       ├── messaging.py
    │       └── notifications.py
    ├── core/                  # Core functionality
    │   ├── config.py         # Configuration (env vars)
    │   ├── database.py       # Database connection & session
    │   ├── security.py       # JWT & password hashing
    │   ├── permissions.py    # Role-based access control
    │   ├── exceptions.py     # Custom exceptions
    │   ├── logger.py         # Structured logging
    │   ├── deps.py           # FastAPI dependencies
    │   ├── celery_app.py     # Celery configuration
    │   └── events/           # Event system
    ├── middleware/            # Custom middleware
    │   ├── auth_middleware.py
    │   ├── rate_limit.py
    │   ├── security_headers.py
    │   └── validation.py
    ├── models/                # SQLAlchemy ORM models
    │   ├── base.py
    │   ├── user.py
    │   ├── admin.py
    │   ├── doctor.py
    │   ├── patient.py
    │   ├── hospital.py
    │   ├── pharmacy.py
    │   ├── appointment.py
    │   ├── emergency.py
    │   ├── blood_donation.py
    │   ├── oxygen.py
    │   ├── messaging.py
    │   ├── search.py
    │   ├── review.py
    │   ├── women_health.py
    │   └── ai_assistant.py
    ├── schemas/               # Pydantic schemas (request/response)
    │   ├── common.py         # Shared schemas
    │   ├── auth.py
    │   ├── user.py
    │   ├── admin.py
    │   ├── doctor.py
    │   ├── hospital.py
    │   ├── pharmacy.py
    │   ├── patient.py
    │   ├── appointment.py
    │   ├── emergency.py
    │   ├── blood_donation.py
    │   ├── oxygen.py
    │   ├── messaging.py
    │   ├── search.py
    │   ├── women_health.py
    │   └── ai_assistant.py
    ├── services/              # Business logic layer
    │   ├── auth_service.py
    │   ├── user_service.py
    │   ├── admin_service.py
    │   ├── doctor_service.py
    │   ├── hospital_service.py
    │   ├── pharmacy_service.py
    │   ├── patient_service.py
    │   ├── appointment_service.py
    │   ├── emergency_service.py
    │   ├── blood_donation_service.py
    │   ├── oxygen_service.py
    │   ├── messaging_service.py
    │   ├── search_service.py
    │   ├── women_health_service.py
    │   └── ai_assistant_service.py
    └── utils/                 # Utility functions
        ├── email.py
        ├── helpers.py
        └── validators.py
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /auth/login` - User login (JWT tokens)
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)
- `POST /auth/verify-email` - Verify email address
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update profile
- `POST /auth/switch-role` - Switch active role

### Users (`/api/v1/users`)
- CRUD operations for users
- Search and filtering
- Role management

### Admin (`/api/v1/admin`)
- Dashboard statistics
- User management
- Verification requests
- Audit logs
- System monitoring

### Other Modules
- Doctors (`/api/v1/doctors`)
- Hospitals (`/api/v1/hospitals`)
- Pharmacies (`/api/v1/pharmacies`)
- Patients (`/api/v1/patients`)
- Appointments (`/api/v1/appointments`)
- Emergency (`/api/v1/emergency`)
- Blood Donation (`/api/v1/blood-donation`)
- Oxygen (`/api/v1/oxygen`)
- Messaging (`/api/v1/messaging`)
- AI Assistant (`/api/v1/ai-assistant`)
- Search (`/api/v1/search`)
- Women's Health (`/api/v1/women-health`)

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error responses:
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

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send credentials to `/api/v1/auth/login`
2. **Receive**: Get `access_token` (15 min) and `refresh_token` (7 days)
3. **Use**: Include `Authorization: Bearer <access_token>` header
4. **Refresh**: Use `/api/v1/auth/refresh` to get new tokens

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | syeda@gmail.com | 123456 |
| Doctor | pollob@gmail.com | 123456 |
| Hospital | hospital@aetherion.com | hospital123 |
| Pharmacy | pharmacy@aetherion.com | pharmacy123 |
| Admin | admin@aetherion.com | admin123 |

## Security Features

- **Password Hashing**: Bcrypt
- **JWT Authentication**: HS256 algorithm
- **Token Rotation**: Refresh tokens are one-time use
- **Rate Limiting**: Configurable per endpoint
- **CORS**: Configured for frontend
- **Security Headers**: HSTS, X-Frame-Options, etc.
- **Request Validation**: Pydantic schemas
- **RBAC**: Role-based access control

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=aethion_db

# JWT
JWT_SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Environment
ENVIRONMENT=development
DEBUG=true

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Development

### Database Migrations

For production, use Alembic for migrations:
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Running Tests

```bash
pytest backend/tests/ -v
```

### Code Quality

```bash
# Type checking
mypy app/

# Linting
ruff check app/

# Formatting
ruff format app/
```

## Troubleshooting

### Database Connection Error

1. Ensure MySQL is running: `mysql -u root -p`
2. Check database exists: `SHOW DATABASES;`
3. Verify credentials in `.env` file

### Import Errors

1. Ensure virtual environment is activated
2. Reinstall dependencies: `pip install -r requirements.txt`

### Port Already in Use

Change the port:
```bash
uvicorn main:app --reload --port 8001
```

## Production Deployment

1. Set `ENVIRONMENT=production`
2. Use a strong `JWT_SECRET_KEY`
3. Configure Redis for rate limiting
4. Set up proper SSL/TLS
5. Use a production WSGI server (Gunicorn + Uvicorn workers)
6. Configure proper logging
7. Set up database backups
8. Use environment variables for all secrets

## License

MIT

## Support

For issues or questions, contact the development team.