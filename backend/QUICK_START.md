# Quick Start Guide - Aetherion Healthcare Backend

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd backend

# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

Or manually:

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Verify Database

Ensure MySQL is running:

```sql
-- Check if database exists
SHOW DATABASES;

-- Create if needed
CREATE DATABASE IF NOT EXISTS aethion_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Start Server

```bash
# From backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or simply:
```bash
python main.py
```

## ✅ Verify It's Working

Open your browser:

- **API Info**: http://localhost:8000/
- **Health Check**: http://localhost:8000/health
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Or test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Login (admin)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aetherion.com","password":"admin123"}'
```

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aetherion.com | admin123 |
| Doctor | pollob@gmail.com | 123456 |
| Patient | syeda@gmail.com | 123456 |
| Hospital | hospital@aetherion.com | hospital123 |
| Pharmacy | pharmacy@aetherion.com | pharmacy123 |

## 📊 Main API Endpoints

```
Health & System
GET  /                     → API information
GET  /health               → System health check

Authentication
POST /api/v1/auth/login           → Login (returns JWT tokens)
POST /api/v1/auth/register        → Register new user
POST /api/v1/auth/refresh         → Refresh access token
POST /api/v1/auth/logout          → Logout
POST /api/v1/auth/forgot-password → Request password reset
POST /api/v1/auth/reset-password  → Reset with token
GET  /api/v1/auth/profile         → Get user profile
PUT  /api/v1/auth/profile         → Update profile

Users
GET    /api/v1/users              → List users (paginated)
GET    /api/v1/users/{id}         → Get user by ID

Admin
GET    /api/v1/admin/dashboard    → Admin dashboard stats
GET    /api/v1/admin/verifications → Verification requests
GET    /api/v1/admin/users         → User management

Other Modules
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

## 🧪 Test the Backend

Run the comprehensive test suite:

```bash
cd backend
python test_backend.py
```

This will test:
- Database connection
- Health endpoints
- Authentication
- Protected endpoints
- User endpoints
- Admin endpoints

## 🔧 Troubleshooting

### Database Connection Error

**Error**: `Can't connect to MySQL server`

**Solution**:
1. Ensure MySQL is running:
   ```bash
   # Windows
   net start MySQL80

   # Linux/Mac
   sudo systemctl start mysql
   ```

2. Verify database exists:
   ```sql
   mysql -u root -p
   SHOW DATABASES;
   ```

3. Check credentials in `app/core/config.py`

### Port Already in Use

**Error**: `Address already in use`

**Solution**: Change port:
```bash
uvicorn main:app --reload --port 8001
```

### Import Errors

**Error**: `ModuleNotFoundError`

**Solution**: Ensure virtual environment is activated and dependencies installed:
```bash
# Windows
venv\Scripts\activate
pip install -r requirements.txt

# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt
```

### JWT Secret Key

**Warning**: Using default JWT secret key

**Solution**: Set a strong secret in `.env`:
```env
JWT_SECRET_KEY=your-very-secure-secret-key-here
```

## 📁 Project Structure

```
backend/
├── main.py                 # Single entry point - RUN THIS
├── requirements.txt        # Python dependencies
├── start.bat              # Windows startup script
├── start.sh               # Linux/Mac startup script
├── test_backend.py        # Test suite
├── README.md              # Full documentation
├── UNIFIED_BACKEND.md     # Architecture overview
└── app/
    ├── api/               # API routes
    ├── core/              # Core config, DB, security
    ├── middleware/        # Custom middleware
    ├── models/            # SQLAlchemy ORM
    ├── schemas/           # Pydantic schemas
    ├── services/          # Business logic
    └── utils/             # Utilities
```

## 🌐 Frontend Connection

The React frontend connects to this backend:

1. **Frontend**: `src/services/authService.ts`
2. **Backend**: `http://localhost:8000`
3. **Login Flow**:
   - Frontend sends `POST /api/v1/auth/login`
   - Backend returns `{ access_token, refresh_token, user }`
   - Frontend stores tokens and includes `Authorization: Bearer <token>` header

## 🚀 Production Deployment

1. **Set environment variables**:
   ```env
   ENVIRONMENT=production
   DEBUG=false
   JWT_SECRET_KEY=your-strong-secret
   DB_PASSWORD=your-db-password
   ```

2. **Use production server**:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
   ```

3. **Enable SSL/TLS**:
   - Use Nginx as reverse proxy
   - Configure SSL certificates (Let's Encrypt)

4. **Database backups**:
   - Set up automated backups
   - Use `mysqldump` for backups

5. **Monitoring**:
   - Set up logging aggregation (ELK stack)
   - Monitor with Prometheus/Grafana

## 📚 Additional Resources

- **Full Documentation**: `backend/README.md`
- **Architecture Overview**: `backend/UNIFIED_BACKEND.md`
- **API Documentation**: http://localhost:8000/docs

## 🆘 Need Help?

1. Check the logs for errors
2. Run `python test_backend.py` to diagnose issues
3. Review `backend/README.md` for detailed information
4. Check database connection and credentials

---

**Backend is ready! Start with `uvicorn main:app --reload`** 🚀