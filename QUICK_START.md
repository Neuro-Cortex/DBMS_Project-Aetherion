# Project Root Quick Start

## 🚀 Start Everything

### 1. Start Backend (Terminal 1)

```bash
cd backend

# Windows
start.bat

# Linux/Mac
./start.sh

# Or manually
uvicorn main:app --reload
```

Backend will be at: **http://localhost:8000**

### 2. Start Frontend (Terminal 2)

```bash
npm run dev
```

Frontend will be at: **http://localhost:5173**

## 📊 Project Structure

```
aetherion/
│
├── backend/                    # FastAPI Backend
│   ├── main.py                # 🚀 Single entry point
│   ├── start.bat              # Windows startup
│   ├── start.sh               # Linux/Mac startup
│   ├── test_backend.py        # Test suite
│   ├── requirements.txt       # Dependencies
│   ├── QUICK_START.md         # Backend quick start
│   ├── README.md              # Full backend docs
│   └── app/                   # Production-grade structure
│
├── src/                        # React Frontend
│   ├── pages/auth/Login.tsx   # Login page
│   ├── services/authService.ts# API client
│   └── store/slices/authSlice.ts # Redux auth
│
├── .env                        # Environment variables
├── package.json               # Frontend dependencies
└── index.html                 # Frontend entry
```

## 🔑 Demo Login Credentials

Use these in the React frontend login form:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aetherion.com | admin123 |
| Doctor | pollob@gmail.com | 123456 |
| Patient | syeda@gmail.com | 123456 |
| Hospital | hospital@aetherion.com | hospital123 |
| Pharmacy | pharmacy@aetherion.com | pharmacy123 |

## ✅ Verification

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Test Backend
```bash
cd backend
python test_backend.py
```

## 📚 Documentation

- **Backend Quick Start**: `backend/QUICK_START.md`
- **Backend Full Docs**: `backend/README.md`
- **Backend Architecture**: `backend/UNIFIED_BACKEND.md`

## 🐛 Troubleshooting

### Backend won't start
1. Ensure MySQL is running
2. Check database `aethion_db` exists
3. Verify credentials in `backend/app/core/config.py`

### Frontend can't connect
1. Ensure backend is running on port 8000
2. Check CORS settings in `backend/app/core/config.py`
3. Verify API base URL in frontend config

### Login fails
1. Verify database has demo users
2. Check password hashing (should be bcrypt)
3. Review backend logs for errors

## 🎯 Next Steps

1. **Explore API Docs**: http://localhost:8000/docs
2. **Test Endpoints**: Use Swagger UI or curl
3. **Customize**: Modify `.env` for your configuration
4. **Deploy**: See `backend/README.md` for deployment guide

---

**System is ready! Start both backend and frontend.** 🚀