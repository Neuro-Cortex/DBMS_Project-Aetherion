# Aetherion Healthcare Platform

AI-powered smart healthcare ecosystem for managing hospitals, doctors, blood donation, emergency services, oxygen management, pharmacies, women healthcare, and real-time medical support.

## Features

- Smart Authentication & Role-Based Account System
- Smart Client/Patient Panel with Health Records
- Smart Doctor Panel with Scheduling
- Smart Hospital Authority Panel with ICU Management
- Smart Blood Donation System with Donor Matching
- Smart Oxygen Network System
- Smart Admin Panel with Analytics
- Women Extra Caring Section
- Smart Pharmacy Management System
- AI & Smart Automation Features
- Real-time Communication System

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL
- **Cache**: Redis
- **Tasks**: Celery
- **Auth**: JWT, OTP, 2FA
- **Real-time**: WebSocket
- **Storage**: Cloudinary
- **Email**: SendGrid
- **SMS**: Twilio
- **Push**: Firebase
- **Maps**: Google Maps API

## Setup

1. Clone repository
2. Install dependencies: `pip install -r requirements.txt`
3. Copy .env.example to .env and configure
4. Run database migrations: `alembic upgrade head`
5. Seed data: `python scripts/seed_data.py`
6. Start server: `uvicorn app.main:app --reload`

## Docker Setup

```bash
docker-compose up -d