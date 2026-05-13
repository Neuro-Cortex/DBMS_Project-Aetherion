#Project Aetherion





Greek mythology:
upper air → Aether → “life / air / purity”

→ ion (suffix) → science common

===  Aetherion ===


This repository serves as the central development workspace for our Database Management System (DBMS) project. It is designed to enable structured collaboration among team members, ensuring efficient contribution, version control, and continuous integration throughout the development lifecycle.

The primary goal of this project is to build a scalable, efficient, and production-ready database system by following industry best practices in schema design, query optimization, and data integrity management. This repository will be actively used to design, implement, test, and refine all components of the system in a professional and collaborative environment.

---

##  Overview

This project focuses on developing a robust Database Management System using MySQL. It emphasizes clean architecture, efficient data handling, and real-world database implementation techniques.

---

##  Key Features

* Well-structured relational database design
* Optimized data storage and retrieval
* Support for complex SQL queries
* Implementation of constraints and relationships
* Advanced database functionalities (Triggers, Stored Procedures)
* Clean, modular, and maintainable project structure

---


##  Technology Stack for Frontend


```
├── Framework: React 18 + TypeScript
├── Styling: Tailwind CSS + Shadcn UI
├── State Management: Redux Toolkit + RTK Query
├── Routing: React Router v6
├── Animations: Framer Motion
├── Charts: Recharts
├── Forms: React Hook Form + Zod
├── Icons: Lucide React + Heroicons
├── Notifications: React Hot Toast
├── Calendar: React Big Calendar
└── Build Tool: Vite
```



##  Project Structure

```
smart-hospital-system/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Loader.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── common/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── UserAvatar.tsx
│   │   │   └── BreadCrumb.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   ├── RecentAppointments.tsx
│   │   │   └── ResourceStatus.tsx
│   │   ├── doctor/
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorProfile.tsx
│   │   │   ├── DoctorSchedule.tsx
│   │   │   └── DoctorRanking.tsx
│   │   ├── patient/
│   │   │   ├── PatientProfile.tsx
│   │   │   ├── MedicalHistory.tsx
│   │   │   ├── MedicineTracker.tsx
│   │   │   └── VaccinationTracker.tsx
│   │   ├── hospital/
│   │   │   ├── HospitalCard.tsx
│   │   │   ├── BedAvailability.tsx
│   │   │   ├── ICUTracker.tsx
│   │   │   └── EmergencyServices.tsx
│   │   ├── emergency/
│   │   │   ├── BloodDonorCard.tsx
│   │   │   ├── AmbulanceTracker.tsx
│   │   │   ├── OxygenLocator.tsx
│   │   │   └── EmergencyRequest.tsx
│   │   ├── appointment/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── AppointmentCalendar.tsx
│   │   │   └── AppointmentList.tsx
│   │   ├── pharmacy/
│   │   │   ├── MedicineSearch.tsx
│   │   │   ├── PharmacyCard.tsx
│   │   │   └── StockIndicator.tsx
│   │   ├── ai-assistant/
│   │   │   ├── ChatBot.tsx
│   │   │   ├── SymptomChecker.tsx
│   │   │   ├── PregnancyGuide.tsx
│   │   │   └── BabyCareAdvice.tsx
│   │   └── women/
│   │       ├── PregnancyTracker.tsx
│   │       ├── GynecologistCard.tsx
│   │       ├── VaccineSchedule.tsx
│   │       └── SpecialCare.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Doctors.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── Hospitals.tsx
│   │   ├── Appointments.tsx
│   │   ├── Emergency.tsx
│   │   ├── Pharmacy.tsx
│   │   ├── MedicalRecords.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── WomenHealth.tsx
│   │   ├── BloodDonors.tsx
│   │   ├── AdminPanel.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDoctor.ts
│   │   ├── useHospital.ts
│   │   ├── useAppointment.ts
│   │   └── useEmergency.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── doctorService.ts
│   │   ├── hospitalService.ts
│   │   ├── emergencyService.ts
│   │   └── aiService.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── doctorSlice.ts
│   │   │   ├── hospitalSlice.ts
│   │   │   ├── appointmentSlice.ts
│   │   │   └── emergencySlice.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── doctor.ts
│   │   ├── hospital.ts
│   │   ├── appointment.ts
│   │   └── emergency.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── themes.ts
│   │   └── animations.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```




---

##  Getting Started

To initialize the project database, run the following SQL commands:

```sql
CREATE DATABASE project_db;
USE project_db;
```

---

##  Advanced Concepts Implemented

* JOIN operations
* Subqueries
* GROUP BY and HAVING clauses
* Stored Procedures
* Triggers
* Indexing
* Transactions (ACID properties)

---

##  Collaboration

This repository is structured to support effective team collaboration. Team members can contribute through version control practices, maintain code consistency, and ensure seamless integration of features. Proper documentation and modular design help in scaling and maintaining the project efficiently.

---

##  Objective

To develop a high-performance, scalable, and maintainable database system that reflects real-world industry standards and demonstrates strong understanding of database design and management principles.

---
Backend API (FastAPI)

Features:
JWT Authentication & Authorization
Doctor Management
Hospital Management
Appointment Booking System
Emergency Services
Pharmacy Management
Medical Records
Blood Donor System
Pregnancy Tracking
AI Health Assistant
Notifications (Email/SMS)
Payment Integration
Dashboard Analytics
Rate Limiting & Middleware Support
Docker Support
Unit Testing with Pytest
Alembic Database Migration

```
backend-python/
smart-hospital-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                     # Dependencies injection
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py               # Main API router
│   │       ├── auth.py                 # Authentication endpoints
│   │       ├── users.py                # User management
│   │       ├── doctors.py              # Doctor endpoints
│   │       ├── patients.py             # Patient endpoints
│   │       ├── hospitals.py            # Hospital endpoints
│   │       ├── appointments.py         # Appointment endpoints
│   │       ├── emergency.py            # Emergency services
│   │       ├── pharmacy.py             # Pharmacy endpoints
│   │       ├── ai_assistant.py         # AI chatbot/symptom checker
│   │       ├── women_health.py         # Women health endpoints
│   │       ├── blood_donors.py         # Blood donor management
│   │       ├── dashboard.py            # Analytics dashboard
│   │       ├── notifications.py        # Push notifications
│   │       └── admin.py                # Admin panel endpoints
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                   # Application settings
│   │   ├── security.py                 # Security utilities
│   │   ├── dependencies.py             # Common dependencies
│   │   ├── exceptions.py               # Custom exceptions
│   │   ├── middleware.py               # Custom middleware
│   │   ├── logging_config.py           # Logging configuration
│   │   └── rate_limiter.py            # Rate limiting
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                     # Base model
│   │   ├── user.py                     # User models
│   │   ├── doctor.py                   # Doctor models
│   │   ├── patient.py                  # Patient models
│   │   ├── hospital.py                 # Hospital models
│   │   ├── appointment.py              # Appointment models
│   │   ├── pharmacy.py                 # Pharmacy models
│   │   ├── emergency.py                # Emergency models
│   │   ├── women_health.py             # Women health models
│   │   ├── blood_donor.py              # Blood donor models
│   │   ├── notification.py             # Notification models
│   │   ├── review.py                   # Review/rating models
│   │   ├── transaction.py              # Payment transaction models
│   │   └── audit.py                    # Audit log models
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py                     # Auth schemas
│   │   ├── user.py                     # User schemas
│   │   ├── doctor.py                   # Doctor schemas
│   │   ├── patient.py                  # Patient schemas
│   │   ├── hospital.py                 # Hospital schemas
│   │   ├── appointment.py              # Appointment schemas
│   │   ├── pharmacy.py                 # Pharmacy schemas
│   │   ├── emergency.py                # Emergency schemas
│   │   ├── women_health.py             # Women health schemas
│   │   ├── blood_donor.py              # Blood donor schemas
│   │   ├── dashboard.py                # Dashboard schemas
│   │   └── common.py                   # Common schemas (pagination, etc.)
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py             # Authentication service
│   │   ├── user_service.py             # User service
│   │   ├── doctor_service.py           # Doctor service
│   │   ├── patient_service.py          # Patient service
│   │   ├── hospital_service.py         # Hospital service
│   │   ├── appointment_service.py      # Appointment service
│   │   ├── pharmacy_service.py         # Pharmacy service
│   │   ├── emergency_service.py        # Emergency service
│   │   ├── ai_service.py               # AI/ML service
│   │   ├── notification_service.py     # Notification service
│   │   ├── payment_service.py          # Payment processing
│   │   ├── search_service.py           # Search functionality
│   │   ├── analytics_service.py        # Analytics & reporting
│   │   ├── blood_donor_service.py      # Blood donor service
│   │   ├── women_health_service.py     # Women health service
│   │   ├── realtime_service.py         # WebSocket realtime service
│   │   └── file_service.py            # File/Image handling
│   │
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── base.py                     # Base repository
│   │   ├── user_repo.py
│   │   ├── doctor_repo.py
│   │   ├── patient_repo.py
│   │   ├── hospital_repo.py
│   │   ├── appointment_repo.py
│   │   ├── pharmacy_repo.py
│   │   ├── emergency_repo.py
│   │   └── blood_donor_repo.py
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── hashing.py                  # Password hashing
│   │   ├── jwt.py                      # JWT utilities
│   │   ├── validators.py               # Custom validators
│   │   ├── pagination.py               # Pagination helpers
│   │   ├── file_upload.py              # File upload helpers
│   │   ├── geolocation.py              # Geolocation utilities
│   │   └── serializers.py              # Object serialization
│   │
│   ├── tasks/                          # Celery background tasks
│   │   ├── __init__.py
│   │   ├── celery_app.py               # Celery configuration
│   │   ├── email_tasks.py              # Email tasks
│   │   ├── notification_tasks.py       # Push notification tasks
│   │   ├── report_tasks.py             # Report generation
│   │   ├── backup_tasks.py             # Database backup
│   │   └── cleanup_tasks.py            # Data cleanup
│   │
│   ├── websocket/
│   │   ├── __init__.py
│   │   ├── manager.py                  # WebSocket manager
│   │   ├── chat_handler.py             # Chat handling
│   │   └── realtime_handler.py         # Realtime updates
│   │
│   └── ml/
│       ├── __init__.py
│       ├── symptom_checker.py          # Symptom analysis
│       ├── appointment_optimizer.py    # Smart scheduling
│       ├── emergency_predictor.py      # Emergency prediction
│       └── health_risk_assessment.py   # Risk assessment
│
├── migrations/                          # Alembic migrations
│   ├── versions/
│   └── env.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                     # Test configurations
│   ├── test_auth.py
│   ├── test_doctors.py
│   ├── test_patients.py
│   ├── test_hospitals.py
│   ├── test_appointments.py
│   └── test_emergency.py
│
├── logs/                                # Application logs
├── media/                               # Uploaded files
│   ├── profiles/
│   ├── documents/
│   └── medical_records/
│
├── scripts/
│   ├── seed_data.py                    # Database seeding
│   ├── backup.sh                       # Backup script
│   └── deploy.sh                       # Deployment script
│
├── requirements/
│   ├── base.txt                        # Core dependencies
│   ├── dev.txt                         # Development dependencies
│   ├── prod.txt                        # Production dependencies
│   └── ml.txt                          # ML dependencies
│
├── alembic.ini
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── .env.production
├── .gitignore
├── Makefile
└── README.md


smart-hospital-database/
├── config/
│   ├── database.php                 # MongoDB connection config
│   ├── mongodb.php                  # MongoDB client settings
│   └── collections.php             # Collections configuration
│
├── src/
│   ├── Core/
│   │   ├── MongoDBManager.php       # Main MongoDB manager
│   │   ├── MongoQueryBuilder.php    # Advanced query builder
│   │   ├── Collection.php           # Collection base class
│   │   ├── MongoMigration.php       # Migration system
│   │   └── MongoGridFS.php          # File storage (GridFS)
│   │
│   ├── Models/
│   │   ├── BaseModel.php            # Base MongoDB model
│   │   ├── User.php
│   │   ├── Doctor.php
│   │   ├── Patient.php
│   │   ├── Hospital.php
│   │   ├── Appointment.php
│   │   ├── Pharmacy.php
│   │   ├── Emergency.php
│   │   ├── BloodDonor.php
│   │   ├── MedicalRecord.php
│   │   ├── Prescription.php
│   │   ├── Invoice.php
│   │   └── AuditLog.php
│   │
│   ├── Migrations/
│   │   ├── MigrationManager.php
│   │   ├── CreateUsersCollection.php
│   │   ├── CreateDoctorsCollection.php
│   │   ├── CreatePatientsCollection.php
│   │   ├── CreateHospitalsCollection.php
│   │   ├── CreateAppointmentsCollection.php
│   │   ├── CreateIndexes.php
│   │   └── CreateRelations.php
│   │
│   ├── Seeds/
│   │   ├── DatabaseSeeder.php
│   │   ├── UsersSeeder.php
│   │   ├── DoctorsSeeder.php
│   │   ├── HospitalsSeeder.php
│   │   └── SampleDataSeeder.php
│   │
│   ├── Validators/
│   │   ├── SchemaValidator.php      # JSON Schema validation
│   │   └── Rules.php
│   │
│   └── Utils/
│       ├── AggregationPipeline.php
│       ├── BackupManager.php
│       └── IndexManager.php
│
├── public/
│   └── admin/
│       ├── index.php                # Database admin panel
│       ├── collections.php          # View collections
│       ├── queries.php              # Run queries
│       └── api/
│           └── database_api.php     # REST API for DB operations
│
├── composer.json
├── .env
└── README.md








```

Tech Stack
Backend Framework: FastAPI
Database: PostgreSQL / MySQL
ORM: SQLAlchemy
Authentication: JWT
Migration: Alembic
Containerization: Docker
Testing: Pytest
AI Integration: OpenAI / Gemini API
Notifications: Email & SMS APIs
Installation
1. Clone Repository
git clone https://github.com/your-username/healthcare-backend.git
cd healthcare-backend
2. Create Virtual Environment
python -m venv venv
Activate Environment
Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate
3. Install Dependencies
pip install -r requirements.txt
4. Configure Environment Variables

Create a .env file:

DATABASE_URL=postgresql://user:password@localhost/db_name

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password

SMS_API_KEY=your_sms_api_key

OPENAI_API_KEY=your_openai_key
Database Migration
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
Run Development Server
uvicorn app.main:app --reload

Or

python run.py
Run with Docker
docker-compose up --build
API Documentation

After running the server:

Swagger UI

http://localhost:8000/docs

ReDoc

http://localhost:8000/redoc
Authentication

This project uses JWT Token Authentication.

Login Flow
User Login
Receive Access Token
Use Bearer Token in Headers

Example:

Authorization: Bearer your_access_token
Running Tests
pytest
Core Modules
Module	Description
Auth	Login/Register/JWT
Users	User Profile Management
Doctors	Doctor Profiles & Availability
Hospitals	Hospital Information
Appointments	Appointment Booking
Emergency	Emergency Services
Pharmacy	Medicine & Pharmacy
Medical Records	Patient Medical History
Blood Donors	Blood Donation System
Pregnancy	Pregnancy Monitoring
AI Assistant	AI Healthcare Support
Notifications	Email/SMS Alerts
Dashboard	Analytics & Reports
Security Features
Password Hashing
JWT Authentication
Rate Limiting
Input Validation
CORS Protection
Secure Environment Variables
Future Improvements
Video Consultation
Real-time Chat
Mobile App API
Prescription OCR
AI Disease Prediction
Multi-language Support
Admin Panel
Contributing

Contributions are welcome.






fork → create branch → commit → push → pull request
License

This project is licensed under the MIT License.

Author

Developed using FastAPI and Python.










```


aetherion/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 docker-compose.yml
├── 📄 .env.example
├── 📄 Makefile
├── 📄 LICENSE
│
├── 📂 frontend/                          # React + TypeScript Frontend
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 vite.config.ts
│   ├── 📄 tailwind.config.js
│   ├── 📄 index.html
│   ├── 📄 .env.example
│   │
│   ├── 📂 public/
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🖼️ logo.svg
│   │   ├── 🖼️ og-image.png
│   │   ├── 📄 manifest.json
│   │   └── 📂 icons/
│   │       ├── icon-72x72.png
│   │       ├── icon-96x96.png
│   │       └── icon-512x512.png
│   │
│   └── 📂 src/
│       ├── 📄 App.tsx
│       ├── 📄 main.tsx
│       ├── 📄 vite-env.d.ts
│       │
│       ├── 📂 assets/
│       │   ├── 📂 images/
│       │   └── 📂 fonts/
│       │
│       ├── 📂 config/
│       │   ├── 📄 constants.ts
│       │   ├── 📄 routes.ts
│       │   ├── 📄 navigation.ts
│       │   └── 📄 api.config.ts
│       │
│       ├── 📂 types/
│       │   ├── 📄 index.ts
│       │   ├── 📄 user.ts
│       │   ├── 📄 doctor.ts
│       │   ├── 📄 patient.ts
│       │   ├── 📄 hospital.ts
│       │   ├── 📄 appointment.ts
│       │   ├── 📄 pharmacy.ts
│       │   ├── 📄 emergency.ts
│       │   ├── 📄 bloodDonor.ts
│       │   └── 📄 oxygen.ts
│       │
│       ├── 📂 components/
│       │   ├── 📂 ui/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Tabs.tsx
│       │   │   ├── Avatar.tsx
│       │   │   ├── Dropdown.tsx
│       │   │   ├── Loader.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   ├── Toast.tsx
│       │   │   ├── Tooltip.tsx
│       │   │   └── ScrollArea.tsx
│       │   │
│       │   ├── 📂 layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── DashboardLayout.tsx
│       │   │   ├── MobileNav.tsx
│       │   │   └── TopBar.tsx
│       │   │
│       │   ├── 📂 common/
│       │   │   ├── SearchBar.tsx
│       │   │   ├── NotificationBell.tsx
│       │   │   ├── UserAvatar.tsx
│       │   │   ├── BreadCrumb.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   ├── ErrorBoundary.tsx
│       │   │   ├── LoadingScreen.tsx
│       │   │   ├── Pagination.tsx
│       │   │   └── FileUpload.tsx
│       │   │
│       │   ├── 📂 auth/
│       │   │   ├── LoginForm.tsx
│       │   │   ├── RegisterForm.tsx
│       │   │   ├── RoleSelector.tsx
│       │   │   ├── OTPVerification.tsx
│       │   │   ├── ForgotPassword.tsx
│       │   │   └── TwoFactorAuth.tsx
│       │   │
│       │   ├── 📂 dashboard/
│       │   │   ├── StatCard.tsx
│       │   │   ├── ActivityChart.tsx
│       │   │   ├── RecentAppointments.tsx
│       │   │   ├── ResourceStatus.tsx
│       │   │   ├── RevenueChart.tsx
│       │   │   ├── PatientFlowChart.tsx
│       │   │   └── LiveFeed.tsx
│       │   │
│       │   ├── 📂 doctor/
│       │   │   ├── DoctorCard.tsx
│       │   │   ├── DoctorProfile.tsx
│       │   │   ├── DoctorSchedule.tsx
│       │   │   ├── DoctorRanking.tsx
│       │   │   ├── DoctorComparison.tsx
│       │   │   ├── DoctorAvailability.tsx
│       │   │   └── DoctorReviews.tsx
│       │   │
│       │   ├── 📂 patient/
│       │   │   ├── PatientProfile.tsx
│       │   │   ├── MedicalHistory.tsx
│       │   │   ├── MedicineTracker.tsx
│       │   │   ├── VaccinationTracker.tsx
│       │   │   ├── HealthTimeline.tsx
│       │   │   └── ReportViewer.tsx
│       │   │
│       │   ├── 📂 hospital/
│       │   │   ├── HospitalCard.tsx
│       │   │   ├── BedAvailability.tsx
│       │   │   ├── ICUTracker.tsx
│       │   │   ├── EmergencyServices.tsx
│       │   │   ├── HospitalRating.tsx
│       │   │   └── DepartmentList.tsx
│       │   │
│       │   ├── 📂 emergency/
│       │   │   ├── BloodDonorCard.tsx
│       │   │   ├── AmbulanceTracker.tsx
│       │   │   ├── OxygenLocator.tsx
│       │   │   ├── EmergencyRequest.tsx
│       │   │   ├── SOSButton.tsx
│       │   │   └── NearbyHelp.tsx
│       │   │
│       │   ├── 📂 appointment/
│       │   │   ├── BookingForm.tsx
│       │   │   ├── AppointmentCalendar.tsx
│       │   │   ├── AppointmentList.tsx
│       │   │   ├── VideoConsultation.tsx
│       │   │   └── AppointmentStatus.tsx
│       │   │
│       │   ├── 📂 pharmacy/
│       │   │   ├── MedicineSearch.tsx
│       │   │   ├── PharmacyCard.tsx
│       │   │   ├── StockIndicator.tsx
│       │   │   ├── MedicineCompare.tsx
│       │   │   ├── PrescriptionUpload.tsx
│       │   │   └── OrderTracker.tsx
│       │   │
│       │   ├── 📂 women/
│       │   │   ├── PregnancyTracker.tsx
│       │   │   ├── GynecologistCard.tsx
│       │   │   ├── VaccineSchedule.tsx
│       │   │   ├── SpecialCare.tsx
│       │   │   ├── MenstrualTracker.tsx
│       │   │   └── BabyGrowthChart.tsx
│       │   │
│       │   └── 📂 ai-assistant/
│       │       ├── ChatBot.tsx
│       │       ├── SymptomChecker.tsx
│       │       ├── HealthRecommendation.tsx
│       │       └── MedicineReminder.tsx
│       │
│       ├── 📂 pages/
│       │   ├── 📄 Home.tsx
│       │   ├── 📄 Login.tsx
│       │   ├── 📄 Register.tsx
│       │   ├── 📂 dashboard/
│       │   │   ├── PatientDashboard.tsx
│       │   │   ├── DoctorDashboard.tsx
│       │   │   ├── HospitalDashboard.tsx
│       │   │   ├── PharmacyDashboard.tsx
│       │   │   └── AdminDashboard.tsx
│       │   ├── 📄 Doctors.tsx
│       │   ├── 📄 DoctorProfile.tsx
│       │   ├── 📄 Hospitals.tsx
│       │   ├── 📄 Appointments.tsx
│       │   ├── 📄 Emergency.tsx
│       │   ├── 📄 Pharmacy.tsx
│       │   ├── 📄 MedicalRecords.tsx
│       │   ├── 📄 AIAssistant.tsx
│       │   ├── 📄 WomenHealth.tsx
│       │   ├── 📄 BloodDonors.tsx
│       │   ├── 📄 OxygenNetwork.tsx
│       │   ├── 📄 AdminPanel.tsx
│       │   ├── 📄 Profile.tsx
│       │   ├── 📄 Settings.tsx
│       │   └── 📄 NotFound.tsx
│       │
│       ├── 📂 hooks/
│       │   ├── 📄 useAuth.ts
│       │   ├── 📄 useDoctor.ts
│       │   ├── 📄 useHospital.ts
│       │   ├── 📄 useAppointment.ts
│       │   ├── 📄 useEmergency.ts
│       │   ├── 📄 usePharmacy.ts
│       │   ├── 📄 useGeolocation.ts
│       │   ├── 📄 useWebSocket.ts
│       │   ├── 📄 useDebounce.ts
│       │   └── 📄 useMediaQuery.ts
│       │
│       ├── 📂 services/
│       │   ├── 📄 api.ts
│       │   ├── 📄 authService.ts
│       │   ├── 📄 doctorService.ts
│       │   ├── 📄 hospitalService.ts
│       │   ├── 📄 emergencyService.ts
│       │   ├── 📄 pharmacyService.ts
│       │   ├── 📄 appointmentService.ts
│       │   ├── 📄 womenHealthService.ts
│       │   └── 📄 aiService.ts
│       │
│       ├── 📂 store/
│       │   ├── 📄 index.ts
│       │   └── 📂 slices/
│       │       ├── authSlice.ts
│       │       ├── doctorSlice.ts
│       │       ├── hospitalSlice.ts
│       │       ├── appointmentSlice.ts
│       │       ├── emergencySlice.ts
│       │       ├── pharmacySlice.ts
│       │       └── uiSlice.ts
│       │
│       ├── 📂 utils/
│       │   ├── 📄 constants.ts
│       │   ├── 📄 helpers.ts
│       │   ├── 📄 validators.ts
│       │   ├── 📄 formatters.ts
│       │   ├── 📄 dateUtils.ts
│       │   └── 📄 geolocation.ts
│       │
│       ├── 📂 styles/
│       │   ├── 📄 globals.css
│       │   ├── 📄 themes.ts
│       │   └── 📄 animations.ts
│       │
│       └── 📂 lib/
│           ├── 📄 axios.ts
│           └── 📄 firebase.ts
│                   





=======================================================================================================================================
                                                         # Python FastAPI Backend
=======================================================================================================================================





├── 📂 backend/                          
│   ├── 📄 requirements.txt
│   ├── 📄 Dockerfile
│   ├── 📄 alembic.ini
│   ├── 📄 pyproject.toml
│   ├── 📄 .env.example
│   │
│   ├── 📂 app/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 main.py
│   │   │
│   │   ├── 📂 api/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 deps.py
│   │   │   └── 📂 v1/
│   │   │       ├── 📄 __init__.py
│   │   │       ├── 📄 router.py
│   │   │       ├── 📄 auth.py
│   │   │       ├── 📄 users.py
│   │   │       ├── 📄 doctors.py
│   │   │       ├── 📄 patients.py
│   │   │       ├── 📄 hospitals.py
│   │   │       ├── 📄 appointments.py
│   │   │       ├── 📄 emergency.py
│   │   │       ├── 📄 pharmacy.py
│   │   │       ├── 📄 blood_donors.py
│   │   │       ├── 📄 oxygen.py
│   │   │       ├── 📄 ai_assistant.py
│   │   │       ├── 📄 women_health.py
│   │   │       ├── 📄 dashboard.py
│   │   │       ├── 📄 notifications.py
│   │   │       └── 📄 admin.py
│   │   │
│   │   ├── 📂 core/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 config.py
│   │   │   ├── 📄 security.py
│   │   │   ├── 📄 database.py
│   │   │   ├── 📄 dependencies.py
│   │   │   ├── 📄 exceptions.py
│   │   │   ├── 📄 middleware.py
│   │   │   └── 📄 rate_limiter.py
│   │   │
│   │   ├── 📂 models/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 base.py
│   │   │   ├── 📄 user.py
│   │   │   ├── 📄 doctor.py
│   │   │   ├── 📄 patient.py
│   │   │   ├── 📄 hospital.py
│   │   │   ├── 📄 appointment.py
│   │   │   ├── 📄 pharmacy.py
│   │   │   ├── 📄 emergency.py
│   │   │   ├── 📄 blood_donor.py
│   │   │   ├── 📄 oxygen.py
│   │   │   ├── 📄 women_health.py
│   │   │   ├── 📄 notification.py
│   │   │   ├── 📄 review.py
│   │   │   ├── 📄 transaction.py
│   │   │   └── 📄 audit.py
│   │   │
│   │   ├── 📂 schemas/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 auth.py
│   │   │   ├── 📄 user.py
│   │   │   ├── 📄 doctor.py
│   │   │   ├── 📄 patient.py
│   │   │   ├── 📄 hospital.py
│   │   │   ├── 📄 appointment.py
│   │   │   ├── 📄 pharmacy.py
│   │   │   ├── 📄 emergency.py
│   │   │   ├── 📄 blood_donor.py
│   │   │   ├── 📄 oxygen.py
│   │   │   ├── 📄 women_health.py
│   │   │   └── 📄 common.py
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 auth_service.py
│   │   │   ├── 📄 user_service.py
│   │   │   ├── 📄 doctor_service.py
│   │   │   ├── 📄 patient_service.py
│   │   │   ├── 📄 hospital_service.py
│   │   │   ├── 📄 appointment_service.py
│   │   │   ├── 📄 pharmacy_service.py
│   │   │   ├── 📄 emergency_service.py
│   │   │   ├── 📄 ai_service.py
│   │   │   ├── 📄 notification_service.py
│   │   │   ├── 📄 payment_service.py
│   │   │   ├── 📄 search_service.py
│   │   │   ├── 📄 analytics_service.py
│   │   │   ├── 📄 blood_donor_service.py
│   │   │   ├── 📄 oxygen_service.py
│   │   │   ├── 📄 women_health_service.py
│   │   │   ├── 📄 realtime_service.py
│   │   │   └── 📄 file_service.py
│   │   │
│   │   ├── 📂 repositories/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 base.py
│   │   │   ├── 📄 user_repo.py
│   │   │   ├── 📄 doctor_repo.py
│   │   │   ├── 📄 patient_repo.py
│   │   │   ├── 📄 hospital_repo.py
│   │   │   ├── 📄 appointment_repo.py
│   │   │   ├── 📄 pharmacy_repo.py
│   │   │   └── 📄 blood_donor_repo.py
│   │   │
│   │   ├── 📂 utils/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 hashing.py
│   │   │   ├── 📄 jwt.py
│   │   │   ├── 📄 validators.py
│   │   │   ├── 📄 pagination.py
│   │   │   └── 📄 geolocation.py
│   │   │
│   │   ├── 📂 tasks/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 celery_app.py
│   │   │   ├── 📄 email_tasks.py
│   │   │   └── 📄 notification_tasks.py
│   │   │
│   │   └── 📂 ml/
│   │       ├── 📄 __init__.py
│   │       ├── 📄 symptom_checker.py
│   │       └── 📄 health_risk.py
│   │
│   ├── 📂 migrations/
│   │   ├── 📄 env.py
│   │   └── 📂 versions/
│   │
│   ├── 📂 tests/
│   │   ├── 📄 conftest.py
│   │   ├── 📄 test_auth.py
│   │   ├── 📄 test_doctors.py
│   │   └── 📄 test_hospitals.py
│   │
│   └── 📂 scripts/
│       ├── 📄 seed_data.py
│       └── 📄 backup.sh
│
===============================================================================================================================================
                                                                  # MySQL Database (99 Tables)
===============================================================================================================================================



├── 📂 database/                           
│   ├── 📄 README.md
│   ├── 📄 master_schema.sql               # ALL 99 tables in ONE file
│   │
│   ├── 📂 schema/                         # Individual table files (99 files)
│   │   ├── 📄 001_core_users.sql
│   │   ├── 📄 002_core_roles.sql
│   │   ├── 📄 003_core_user_roles.sql
│   │   ├── 📄 004_core_sessions.sql
│   │   ├── 📄 005_core_otp_codes.sql
│   │   ├── 📄 006_core_refresh_tokens.sql
│   │   ├── 📄 007_core_password_resets.sql
│   │   ├── 📄 008_core_activity_logs.sql
│   │   ├── 📄 009_patient_profiles.sql
│   │   ├── 📄 010_patient_vitals.sql
│   │   ├── 📄 011_patient_allergies.sql
│   │   ├── 📄 012_patient_chronic_diseases.sql
│   │   ├── 📄 013_patient_medications.sql
│   │   ├── 📄 014_patient_family_history.sql
│   │   ├── 📄 015_patient_lifestyle.sql
│   │   ├── 📄 016_patient_immunizations.sql
│   │   ├── 📄 017_patient_health_metrics.sql
│   │   ├── 📄 018_doctor_profiles.sql
│   │   ├── 📄 019_doctor_specializations.sql
│   │   ├── 📄 020_doctor_qualifications.sql
│   │   ├── 📄 021_doctor_experience.sql
│   │   ├── 📄 022_doctor_schedules.sql
│   │   ├── 📄 023_doctor_availability_exceptions.sql
│   │   ├── 📄 024_doctor_consultation_fees.sql
│   │   ├── 📄 025_doctor_languages.sql
│   │   ├── 📄 026_doctor_awards.sql
│   │   ├── 📄 027_doctor_publications.sql
│   │   ├── 📄 028_hospital_profiles.sql
│   │   ├── 📄 029_hospital_departments.sql
│   │   ├── 📄 030_hospital_beds.sql
│   │   ├── 📄 031_hospital_icu_beds.sql
│   │   ├── 📄 032_hospital_emergency_services.sql
│   │   ├── 📄 033_hospital_ambulances.sql
│   │   ├── 📄 034_hospital_facilities.sql
│   │   ├── 📄 035_hospital_accreditations.sql
│   │   ├── 📄 036_hospital_insurance_partners.sql
│   │   ├── 📄 037_hospital_visiting_hours.sql
│   │   ├── 📄 038_hospital_admins.sql
│   │   ├── 📄 039_hospital_doctor_affiliations.sql
│   │   ├── 📄 040_appointments.sql
│   │   ├── 📄 041_appointment_vitals.sql
│   │   ├── 📄 042_appointment_notes.sql
│   │   ├── 📄 043_prescriptions.sql
│   │   ├── 📄 044_prescription_medicines.sql
│   │   ├── 📄 045_prescription_tests.sql
│   │   ├── 📄 046_medical_records.sql
│   │   ├── 📄 047_lab_reports.sql
│   │   ├── 📄 048_imaging_reports.sql
│   │   ├── 📄 049_surgery_records.sql
│   │   ├── 📄 050_discharge_summaries.sql
│   │   ├── 📄 051_blood_donors.sql
│   │   ├── 📄 052_blood_donations.sql
│   │   ├── 📄 053_blood_requests.sql
│   │   ├── 📄 054_blood_stock.sql
│   │   ├── 📄 055_blood_camps.sql
│   │   ├── 📄 056_blood_donor_rewards.sql
│   │   ├── 📄 057_oxygen_stock.sql
│   │   ├── 📄 058_oxygen_requests.sql
│   │   ├── 📄 059_oxygen_suppliers.sql
│   │   ├── 📄 060_oxygen_cylinder_tracking.sql
│   │   ├── 📄 061_pharmacies.sql
│   │   ├── 📄 062_pharmacy_staff.sql
│   │   ├── 📄 063_medicines.sql
│   │   ├── 📄 064_medicine_categories.sql
│   │   ├── 📄 065_medicine_manufacturers.sql
│   │   ├── 📄 066_pharmacy_inventory.sql
│   │   ├── 📄 067_medicine_orders.sql
│   │   ├── 📄 068_medicine_order_items.sql
│   │   ├── 📄 069_medicine_deliveries.sql
│   │   ├── 📄 070_medicine_price_comparison.sql
│   │   ├── 📄 071_emergency_requests.sql
│   │   ├── 📄 072_emergency_contacts.sql
│   │   ├── 📄 073_emergency_volunteers.sql
│   │   ├── 📄 074_emergency_ambulance_requests.sql
│   │   ├── 📄 075_emergency_sos_alerts.sql
│   │   ├── 📄 076_women_health_profiles.sql
│   │   ├── 📄 077_pregnancy_tracking.sql
│   │   ├── 📄 078_pregnancy_appointments.sql
│   │   ├── 📄 079_baby_vaccine_schedule.sql
│   │   ├── 📄 080_menstrual_cycle_tracking.sql
│   │   ├── 📄 081_gynecologist_consultations.sql
│   │   ├── 📄 082_child_growth_records.sql
│   │   ├── 📄 083_notifications.sql
│   │   ├── 📄 084_notification_templates.sql
│   │   ├── 📄 085_push_notification_tokens.sql
│   │   ├── 📄 086_reviews_ratings.sql
│   │   ├── 📄 087_doctor_reviews.sql
│   │   ├── 📄 088_hospital_reviews.sql
│   │   ├── 📄 089_medicine_reviews.sql
│   │   ├── 📄 090_payment_transactions.sql
│   │   ├── 📄 091_payment_methods.sql
│   │   ├── 📄 092_insurance_claims.sql
│   │   ├── 📄 093_health_blogs.sql
│   │   ├── 📄 094_health_tips.sql
│   │   ├── 📄 095_ai_chat_history.sql
│   │   ├── 📄 096_ai_symptom_checks.sql
│   │   ├── 📄 097_system_settings.sql
│   │   ├── 📄 098_feedback_support.sql
│   │   └── 📄 099_audit_trails.sql
│   │
│   ├── 📂 procedures/
│   │   ├── 📄 sp_calculate_donor_eligibility.sql
│   │   ├── 📄 sp_book_appointment.sql
│   │   ├── 📄 sp_update_blood_stock.sql
│   │   ├── 📄 sp_send_emergency_alert.sql
│   │   ├── 📄 sp_generate_report.sql
│   │   ├── 📄 sp_process_payment.sql
│   │   ├── 📄 sp_check_medicine_expiry.sql
│   │   └── 📄 sp_calculate_hospital_rating.sql
│   │
│   ├── 📂 triggers/
│   │   ├── 📄 trg_after_blood_donation.sql
│   │   ├── 📄 trg_after_appointment.sql
│   │   ├── 📄 trg_medicine_expiry_alert.sql
│   │   ├── 📄 trg_oxygen_stock_alert.sql
│   │   ├── 📄 trg_after_prescription.sql
│   │   └── 📄 trg_after_user_registration.sql
│   │
│   ├── 📂 views/
│   │   ├── 📄 vw_doctor_availability.sql
│   │   ├── 📄 vw_blood_stock_summary.sql
│   │   ├── 📄 vw_hospital_bed_status.sql
│   │   ├── 📄 vw_patient_appointment_history.sql
│   │   └── 📄 vw_revenue_analytics.sql
│   │
│   ├── 📂 seeds/
│   │   ├── 📄 seed_roles.sql
│   │   ├── 📄 seed_admin.sql
│   │   ├── 📄 seed_blood_groups.sql
│   │   ├── 📄 seed_departments.sql
│   │   ├── 📄 seed_specializations.sql
│   │   └── 📄 seed_medicine_categories.sql
│   │
│   └── 📂 docs/
│       ├── 📄 ER_DIAGRAM.md
│       ├── 📄 SCHEMA_DOCUMENTATION.md
│       └── 📄 API_MAPPING.md
│
├── 📂 docs/                               # Project Documentation
│   ├── 📄 PROJECT_OVERVIEW.md
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 API_DOCUMENTATION.md
│   ├── 📄 SETUP_GUIDE.md
│   ├── 📄 CONTRIBUTING.md
│   ├── 📄 DEPLOYMENT.md
│   └── 📄 CHANGELOG.md
│
└── 📂 deployment/
    ├── 📄 nginx.conf
    ├── 📄 docker-compose.prod.yml
    └── 📂 scripts/
        ├── 📄 deploy.sh
        └── 📄 backup.sh




```







