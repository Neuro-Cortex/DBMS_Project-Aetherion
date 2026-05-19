#!/usr/bin/env python3
"""
Database seed script for Aetherion Healthcare Platform
Creates sample data for development and testing
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import async_session_factory, init_db
from app.core.security import security_manager
from app.models.user import User, UserRole, AccountStatus, Gender, BloodGroup
from app.models.doctor import DoctorProfile, DoctorSchedule
from app.models.patient import PatientProfile
from app.models.hospital import HospitalProfile, HospitalDepartment
from app.models.pharmacy import PharmacyProfile, Medicine, PharmacyInventory
from app.models.blood_donor import BloodDonorProfile
from datetime import date, time, datetime, timedelta
import uuid

async def seed_users():
    """Seed users with different roles"""
    users = [
        {
            "email": "admin@aetherion.com",
            "password": "Admin@123456",
            "first_name": "Super",
            "last_name": "Admin",
            "gender": Gender.MALE,
            "roles": [UserRole.ADMIN, UserRole.SUPER_ADMIN],
            "city": "New York",
            "country": "USA"
        },
        {
            "email": "doctor.john@aetherion.com",
            "password": "Doctor@123",
            "first_name": "John",
            "last_name": "Smith",
            "gender": Gender.MALE,
            "blood_group": BloodGroup.A_POSITIVE,
            "roles": [UserRole.DOCTOR],
            "city": "New York",
            "country": "USA"
        },
        {
            "email": "doctor.sarah@aetherion.com",
            "password": "Doctor@123",
            "first_name": "Sarah",
            "last_name": "Johnson",
            "gender": Gender.FEMALE,
            "blood_group": BloodGroup.B_POSITIVE,
            "roles": [UserRole.DOCTOR],
            "city": "New York",
            "country": "USA"
        },
        {
            "email": "patient.jane@aetherion.com",
            "password": "Patient@123",
            "first_name": "Jane",
            "last_name": "Doe",
            "gender": Gender.FEMALE,
            "blood_group": BloodGroup.O_POSITIVE,
            "roles": [UserRole.PATIENT],
            "date_of_birth": date(1990, 5, 15),
            "city": "New York",
            "country": "USA"
        },
        {
            "email": "donor.bob@aetherion.com",
            "password": "Donor@123",
            "first_name": "Bob",
            "last_name": "Williams",
            "gender": Gender.MALE,
            "blood_group": BloodGroup.O_NEGATIVE,
            "roles": [UserRole.PATIENT, UserRole.BLOOD_DONOR],
            "date_of_birth": date(1985, 8, 20),
            "city": "New York",
            "country": "USA"
        },
        {
            "email": "hospital@aetherion.com",
            "password": "Hospital@123",
            "first_name": "Michael",
            "last_name": "Brown",
            "gender": Gender.MALE,
            "roles": [UserRole.HOSPITAL_ADMIN],
            "city": "New York",
            "country": "USA"
        },
        {
            "email": "pharmacy@aetherion.com",
            "password": "Pharmacy@123",
            "first_name": "Emily",
            "last_name": "Davis",
            "gender": Gender.FEMALE,
            "roles": [UserRole.PHARMACY_ADMIN],
            "city": "New York",
            "country": "USA"
        },
    ]
    
    created_users = []
    
    async with async_session_factory() as session:
        for user_data in users:
            # Check if exists
            result = await session.execute(
                select(User).where(User.email == user_data["email"])
            )
            if result.scalar_one_or_none():
                print(f"  User exists: {user_data['email']}")
                continue
            
            password = user_data.pop("password")
            user = User(
                id=uuid.uuid4(),
                **user_data,
                is_email_verified=True,
                account_status=AccountStatus.ACTIVE
            )
            user.set_password(password)
            session.add(user)
            created_users.append(user)
            print(f"  Created user: {user.email} ({user.full_name})")
        
        await session.commit()
    
    return created_users

async def seed_doctors(users):
    """Seed doctor profiles"""
    async with async_session_factory() as session:
        for user in users:
            if UserRole.DOCTOR not in user.roles:
                continue
            
            # Check existing
            result = await session.execute(
                select(DoctorProfile).where(DoctorProfile.user_id == user.id)
            )
            if result.scalar_one_or_none():
                continue
            
            doctor = DoctorProfile(
                id=uuid.uuid4(),
                user_id=user.id,
                license_number=f"MED{uuid.uuid4().hex[:8].upper()}",
                specialization="Cardiology" if "John" in user.first_name else "Neurology",
                sub_specializations=["Interventional Cardiology"] if "John" in user.first_name else ["Stroke Neurology"],
                qualifications=["MBBS", "MD"],
                experience_years=15 if "John" in user.first_name else 10,
                consultation_fee=500.0 if "John" in user.first_name else 450.0,
                video_consultation_fee=400.0,
                languages_spoken=["English", "Spanish"],
                is_verified=True,
                is_available=True,
                bio=f"Experienced {user.specialization if hasattr(user, 'specialization') else 'doctor'} with years of practice."
            )
            session.add(doctor)
            print(f"  Created doctor profile for {user.full_name}")
            
            # Add schedule
            for day in ["monday", "tuesday", "wednesday", "thursday", "friday"]:
                schedule = DoctorSchedule(
                    id=uuid.uuid4(),
                    doctor_id=doctor.id,
                    day_of_week=day,
                    start_time=time(9, 0),
                    end_time=time(17, 0),
                    slot_duration_minutes=30,
                    max_patients_per_slot=1,
                    is_available=True
                )
                session.add(schedule)
        
        await session.commit()

async def seed_hospitals(users):
    """Seed hospital profiles"""
    async with async_session_factory() as session:
        for user in users:
            if UserRole.HOSPITAL_ADMIN not in user.roles:
                continue
            
            result = await session.execute(
                select(HospitalProfile).where(HospitalProfile.admin_user_id == user.id)
            )
            if result.scalar_one_or_none():
                continue
            
            hospital = HospitalProfile(
                id=uuid.uuid4(),
                admin_user_id=user.id,
                name="Aetherion General Hospital",
                registration_number="HOSP001",
                type="private",
                category="multi-specialty",
                phone="+1-555-0100",
                email="info@aetherionhospital.com",
                website="https://aetherionhospital.com",
                emergency_phone="+1-555-0199",
                address="123 Healthcare Blvd",
                city="New York",
                state="NY",
                country="USA",
                postal_code="10001",
                latitude=40.7128,
                longitude=-74.0060,
                total_beds=300,
                available_beds=150,
                total_icu_beds=50,
                available_icu_beds=25,
                total_ventilators=30,
                available_ventilators=18,
                emergency_services_available=True,
                ambulance_count=5,
                available_ambulances=3,
                trauma_center=True,
                has_blood_bank=True,
                facilities=["Emergency", "ICU", "Surgery", "Radiology", "Pharmacy", "Laboratory"],
                specializations=["Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
                insurance_partners=["Blue Cross", "Aetna", "Cigna"],
                accepts_insurance=True,
                open_time=time(0, 0),
                close_time=time(23, 59),
                is_24x7=True,
                is_verified=True,
                is_operational=True,
                accreditations=["JCI", "ISO 9001"]
            )
            session.add(hospital)
            print(f"  Created hospital: {hospital.name}")
            
            # Add departments
            departments = [
                {"name": "Emergency", "total_beds": 50, "available_beds": 30},
                {"name": "Cardiology", "total_beds": 40, "available_beds": 20},
                {"name": "Neurology", "total_beds": 30, "available_beds": 15},
                {"name": "Orthopedics", "total_beds": 40, "available_beds": 25},
                {"name": "Pediatrics", "total_beds": 30, "available_beds": 20},
                {"name": "ICU", "total_beds": 50, "available_beds": 25},
                {"name": "Surgery", "total_beds": 60, "available_beds": 35},
            ]
            
            for dept in departments:
                department = HospitalDepartment(
                    id=uuid.uuid4(),
                    hospital_id=hospital.id,
                    name=dept["name"],
                    total_beds=dept["total_beds"],
                    available_beds=dept["available_beds"],
                    is_operational=True
                )
                session.add(department)
        
        await self.session.commit()

async def seed_medicines():
    """Seed medicine catalog"""
    medicines_data = [
        {"name": "Paracetamol", "generic_name": "Acetaminophen", "manufacturer": "GSK", "category": "Analgesic", "form": "tablet", "strength": "500mg", "requires_prescription": False},
        {"name": "Amoxicillin", "generic_name": "Amoxicillin", "manufacturer": "Pfizer", "category": "Antibiotic", "form": "capsule", "strength": "250mg", "requires_prescription": True},
        {"name": "Omeprazole", "generic_name": "Omeprazole", "manufacturer": "AstraZeneca", "category": "Antacid", "form": "capsule", "strength": "20mg", "requires_prescription": False},
        {"name": "Metformin", "generic_name": "Metformin HCl", "manufacturer": "Merck", "category": "Antidiabetic", "form": "tablet", "strength": "500mg", "requires_prescription": True},
        {"name": "Atorvastatin", "generic_name": "Atorvastatin", "manufacturer": "Pfizer", "category": "Statin", "form": "tablet", "strength": "10mg", "requires_prescription": True},
        {"name": "Ibuprofen", "generic_name": "Ibuprofen", "manufacturer": "Johnson & Johnson", "category": "NSAID", "form": "tablet", "strength": "400mg", "requires_prescription": False},
        {"name": "Cetirizine", "generic_name": "Cetirizine HCl", "manufacturer": "Bayer", "category": "Antihistamine", "form": "tablet", "strength": "10mg", "requires_prescription": False},
        {"name": "Azithromycin", "generic_name": "Azithromycin", "manufacturer": "Pfizer", "category": "Antibiotic", "form": "tablet", "strength": "500mg", "requires_prescription": True},
    ]
    
    async with async_session_factory() as session:
        for med_data in medicines_data:
            result = await session.execute(
                select(Medicine).where(
                    Medicine.name == med_data["name"],
                    Medicine.strength == med_data["strength"]
                )
            )
            if result.scalar_one_or_none():
                continue
            
            medicine = Medicine(id=uuid.uuid4(), **med_data)
            session.add(medicine)
            print(f"  Created medicine: {med_data['name']} {med_data['strength']}")
        
        await session.commit()

async def main():
    """Main seed function"""
    print("\n" + "=" * 60)
    print("Aetherion Healthcare Platform - Database Seeding")
    print("=" * 60 + "\n")
    
    print("Initializing database...")
    await init_db()
    print("Database ready.\n")
    
    print("Seeding users...")
    users = await seed_users()
    print(f"Created {len(users)} users.\n")
    
    print("Seeding doctor profiles...")
    await seed_doctors(users)
    print("Doctor profiles created.\n")
    
    print("Seeding hospitals...")
    await seed_hospitals(users)
    print("Hospitals created.\n")
    
    print("Seeding medicines...")
    await seed_medicines()
    print("Medicines created.\n")
    
    print("=" * 60)
    print("Database seeding completed successfully!")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())