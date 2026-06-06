"""
Generate realistic seed data SQL for Aetherion Healthcare database.
Tables are inserted in topological order respecting foreign keys.
"""

import uuid
import hashlib
from datetime import date, datetime, timedelta

# Fixed UUIDs for deterministic seeding
def uuid_str(seed):
    """Generate deterministic UUID from seed string."""
    namespace = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
    return str(uuid.uuid5(namespace, seed))

def bcrypt_hash(password):
    """Simulate bcrypt hash format (not real bcrypt, but correct format for DB)."""
    return f"$2b$12${'a' * 22}{'b' * 31}"

# ============================================
# ROLE IDs (auto-increment)
# ============================================
ROLE_SUPER_ADMIN = 1
ROLE_ADMIN = 2
ROLE_MODERATOR = 3
ROLE_DOCTOR = 4
ROLE_HOSPITAL = 5
ROLE_HOSPITAL_ADMIN = 6
ROLE_PHARMACY = 7
ROLE_PHARMACY_ADMIN = 8
ROLE_PATIENT = 9
ROLE_CLIENT = 10
ROLE_BLOOD_DONOR = 11
ROLE_EMERGENCY_VOLUNTEER = 12
ROLE_NORMAL_USER = 13
ROLE_HOSPITAL_AUTHORITY = 14
ROLE_ADMIN_APPLICANT = 15

# ============================================
# USER UUIDs
# ============================================
USERS = {}
user_defs = [
    ("super_admin_1", "Rajesh Kumar", "rajesh.kumar@aetherion.health", "super-admin"),
    ("admin_1", "Priya Sharma", "priya.sharma@aetherion.health", "admin"),
    ("moderator_1", "Anil Verma", "anil.verma@aetherion.health", "moderator"),
    ("doctor_1", "Dr. Sarah Mitchell", "sarah.mitchell@aetherion.health", "doctor"),
    ("doctor_2", "Dr. James Wilson", "james.wilson@aetherion.health", "doctor"),
    ("doctor_3", "Dr. Anita Desai", "anita.desai@aetherion.health", "doctor"),
    ("doctor_4", "Dr. Robert Chen", "robert.chen@aetherion.health", "doctor"),
    ("doctor_5", "Dr. Meera Patel", "meera.patel@aetherion.health", "doctor"),
    ("doctor_6", "Dr. David Brown", "david.brown@aetherion.health", "doctor"),
    ("doctor_7", "Dr. Fatima Khan", "fatima.khan@aetherion.health", "doctor"),
    ("doctor_8", "Dr. Michael Lee", "michael.lee@aetherion.health", "doctor"),
    ("hospital_admin_1", "Vikram Singh", "vikram.singh@aetherion.health", "hospital-admin"),
    ("hospital_admin_2", "Diana Ross", "diana.ross@aetherion.health", "hospital-admin"),
    ("hospital_admin_3", "Arjun Mehta", "arjun.mehta@aetherion.health", "hospital-admin"),
    ("pharmacy_admin_1", "Rakesh Gupta", "rakesh.gupta@aetherion.health", "pharmacy-admin"),
    ("pharmacy_admin_2", "Linda Johnson", "linda.johnson@aetherion.health", "pharmacy-admin"),
    ("patient_1", "Aarav Sharma", "aarav.sharma@email.com", "patient"),
    ("patient_2", "Emily Davis", "emily.davis@email.com", "patient"),
    ("patient_3", "Rohan Patel", "rohan.patel@email.com", "patient"),
    ("patient_4", "Sophia Martinez", "sophia.martinez@email.com", "patient"),
    ("patient_5", "Amit Kumar", "amit.kumar@email.com", "patient"),
    ("patient_6", "Jessica Taylor", "jessica.taylor@email.com", "patient"),
    ("patient_7", "Neha Singh", "neha.singh@email.com", "patient"),
    ("patient_8", "Marcus Johnson", "marcus.johnson@email.com", "patient"),
    ("patient_9", "Kavita Reddy", "kavita.reddy@email.com", "patient"),
    ("patient_10", "Thomas Anderson", "thomas.anderson@email.com", "patient"),
    ("blood_donor_1", "Rahul Joshi", "rahul.joshi@email.com", "blood-donor"),
    ("blood_donor_2", "Maria Garcia", "maria.garcia@email.com", "blood-donor"),
    ("blood_donor_3", "Suresh Babu", "suresh.babu@email.com", "blood-donor"),
    ("blood_donor_4", "Angela White", "angela.white@email.com", "blood-donor"),
    ("blood_donor_5", "Pradeep Nair", "pradeep.nair@email.com", "blood-donor"),
    ("emergency_vol_1", "Captain Raj", "captain.raj@email.com", "emergency-volunteer"),
    ("client_1", "Sunil Verma", "sunil.verma@corporate.com", "client"),
    ("client_2", "Karen Mitchell", "karen.mitchell@corp.com", "client"),
]

role_to_id = {
    "super-admin": ROLE_SUPER_ADMIN,
    "admin": ROLE_ADMIN,
    "moderator": ROLE_MODERATOR,
    "doctor": ROLE_DOCTOR,
    "hospital-admin": ROLE_HOSPITAL_ADMIN,
    "pharmacy-admin": ROLE_PHARMACY_ADMIN,
    "patient": ROLE_PATIENT,
    "blood-donor": ROLE_BLOOD_DONOR,
    "emergency-volunteer": ROLE_EMERGENCY_VOLUNTEER,
    "client": ROLE_CLIENT,
    "hospital": ROLE_HOSPITAL,
    "pharmacy": ROLE_PHARMACY,
}

for uid, name, email, role in user_defs:
    USERS[uid] = uuid_str(uid)

PASSWORD_HASH = "$2b$12$LJ3m4ys3Lg2RqwmYJLbKFeYJnGvN5xQ8mKrPqX9vDcWtA1bHfEoKi"

# Hospital UUIDs
HOSP_1 = uuid_str("hospital_city_general")
HOSP_2 = uuid_str("hospital_metro_medical")
HOSP_3 = uuid_str("hospital_sunrise_specialty")

# Pharmacy UUIDs
PHARM_1 = uuid_str("pharmacy_health_plus")
PHARM_2 = uuid_str("pharmacy_medicare_express")

lines = []
def L(s):
    lines.append(s)

def escape(s):
    return s.replace("'", "\\'")

L("-- ============================================")
L("-- AETHERION HEALTHCARE - Realistic Seed Data")
L("-- Generated: 2026-05-31")
L("-- Database: aethion_bd")
L("-- ============================================")
L("")
L("SET FOREIGN_KEY_CHECKS = 0;")
L("")

# ============================================
# 1. ROLES
# ============================================
L("-- ============================================")
L("-- 1. ROLES")
L("-- ============================================")
roles_data = [
    (ROLE_SUPER_ADMIN, "super_admin", "Super Admin", "Full system access with all privileges", 1, 100),
    (ROLE_ADMIN, "admin", "Administrator", "System administrator with most privileges", 1, 90),
    (ROLE_MODERATOR, "moderator", "Moderator", "Content and user moderation", 1, 70),
    (ROLE_DOCTOR, "doctor", "Doctor", "Medical professional with patient management", 1, 60),
    (ROLE_HOSPITAL, "hospital", "Hospital", "Hospital entity account", 1, 50),
    (ROLE_HOSPITAL_ADMIN, "hospital_admin", "Hospital Admin", "Hospital administrator", 1, 55),
    (ROLE_HOSPITAL_AUTHORITY, "hospital_authority", "Hospital Authority", "Hospital authority reviewer", 1, 58),
    (ROLE_PHARMACY, "pharmacy", "Pharmacy", "Pharmacy entity account", 1, 50),
    (ROLE_PHARMACY_ADMIN, "pharmacy_admin", "Pharmacy Admin", "Pharmacy administrator", 1, 55),
    (ROLE_PATIENT, "patient", "Patient", "Patient with health record access", 1, 20),
    (ROLE_CLIENT, "client", "Client", "Corporate/business client", 1, 25),
    (ROLE_BLOOD_DONOR, "blood_donor", "Blood Donor", "Registered blood donor", 1, 15),
    (ROLE_EMERGENCY_VOLUNTEER, "emergency_volunteer", "Emergency Volunteer", "Emergency response volunteer", 1, 30),
    (ROLE_ADMIN_APPLICANT, "admin_applicant", "Admin Applicant", "Pending admin application", 1, 10),
    (ROLE_NORMAL_USER, "normal_user", "Normal User", "Basic registered user", 1, 5),
]
L("INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `is_system_role`, `priority`) VALUES")
for i, (rid, name, dname, desc, is_sys, pri) in enumerate(roles_data):
    comma = "," if i < len(roles_data) - 1 else ";"
    L(f"  ({rid}, '{name}', '{dname}', '{desc}', {is_sys}, {pri}){comma}")
L("")

# ============================================
# 2. USERS
# ============================================
L("-- ============================================")
L("-- 2. USERS")
L("-- ============================================")
user_rows = []
for uid, name, email, role in user_defs:
    uuid_val = USERS[uid]
    parts = name.split(" ", 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""
    
    gender_map = {
        "Rajesh": "male", "Priya": "female", "Anil": "male", "Sarah": "female",
        "James": "male", "Anita": "female", "Robert": "male", "Meera": "female",
        "David": "male", "Fatima": "female", "Michael": "male",
        "Vikram": "male", "Diana": "female", "Arjun": "male",
        "Rakesh": "male", "Linda": "female",
        "Aarav": "male", "Emily": "female", "Rohan": "male", "Sophia": "female",
        "Amit": "male", "Jessica": "female", "Neha": "female", "Marcus": "male",
        "Kavita": "female", "Thomas": "male",
        "Rahul": "male", "Maria": "female", "Suresh": "male", "Angela": "female", "Pradeep": "male",
        "Captain": "male", "Sunil": "male", "Karen": "female",
    }
    gender = gender_map.get(first_name, "other")
    
    dob_map = {
        "Rajesh": "1975-03-15", "Priya": "1985-07-22", "Anil": "1990-11-08",
        "Sarah": "1982-04-18", "James": "1978-09-25", "Anita": "1986-01-12",
        "Robert": "1974-06-30", "Meera": "1988-12-05", "David": "1980-08-14",
        "Fatima": "1983-02-28", "Michael": "1976-10-20",
        "Vikram": "1972-05-10", "Diana": "1984-03-17", "Arjun": "1979-07-08",
        "Rakesh": "1977-11-22", "Linda": "1981-09-14",
        "Aarav": "1995-06-20", "Emily": "1992-03-15", "Rohan": "1998-08-12",
        "Sophia": "1990-11-05", "Amit": "1993-04-28", "Jessica": "1996-01-19",
        "Neha": "1994-07-30", "Marcus": "1989-12-11", "Kavita": "1997-05-22",
        "Thomas": "1991-09-03",
        "Rahul": "1993-02-14", "Maria": "1987-06-25", "Suresh": "1990-10-08",
        "Angela": "1985-04-19", "Pradeep": "1988-08-07",
        "Captain": "1980-03-22", "Sunil": "1975-12-01", "Karen": "1982-07-16",
    }
    dob = dob_map.get(first_name, "1990-01-01")
    
    bg_map = {
        "Rajesh": "O+", "Priya": "A+", "Anil": "B+",
        "Sarah": "O-", "James": "AB+", "Anita": "A-",
        "Robert": "B-", "Meera": "O+", "David": "A+",
        "Fatima": "B+", "Michael": "O-",
        "Vikram": "AB-", "Diana": "A+", "Arjun": "B+",
        "Rakesh": "O+", "Linda": "AB+",
        "Aarav": "B+", "Emily": "O-", "Rohan": "A+",
        "Sophia": "AB+", "Amit": "O+", "Jessica": "B-",
        "Neha": "A+", "Marcus": "O+", "Kavita": "B+",
        "Thomas": "A-",
        "Rahul": "O+", "Maria": "A-", "Suresh": "B+",
        "Angela": "AB-", "Pradeep": "O+",
        "Captain": "A+", "Sunil": "B+", "Karen": "O+",
    }
    blood_group = bg_map.get(first_name, "O+")
    
    phone_map = {
        "Rajesh": "+1-555-0101", "Priya": "+1-555-0102", "Anil": "+1-555-0103",
        "Sarah": "+1-555-0201", "James": "+1-555-0202", "Anita": "+1-555-0203",
        "Robert": "+1-555-0204", "Meera": "+1-555-0205", "David": "+1-555-0206",
        "Fatima": "+1-555-0207", "Michael": "+1-555-0208",
        "Vikram": "+1-555-0301", "Diana": "+1-555-0302", "Arjun": "+1-555-0303",
        "Rakesh": "+1-555-0401", "Linda": "+1-555-0402",
        "Aarav": "+1-555-0501", "Emily": "+1-555-0502", "Rohan": "+1-555-0503",
        "Sophia": "+1-555-0504", "Amit": "+1-555-0505", "Jessica": "+1-555-0506",
        "Neha": "+1-555-0507", "Marcus": "+1-555-0508", "Kavita": "+1-555-0509",
        "Thomas": "+1-555-0510",
        "Rahul": "+1-555-0601", "Maria": "+1-555-0602", "Suresh": "+1-555-0603",
        "Angela": "+1-555-0604", "Pradeep": "+1-555-0605",
        "Captain": "+1-555-0701", "Sunil": "+1-555-0801", "Karen": "+1-555-0802",
    }
    phone = phone_map.get(first_name, "+1-555-0000")
    
    is_verified = 1 if role in ["super-admin", "admin", "doctor", "hospital-admin", "pharmacy-admin"] else 1
    is_admin_approved = 1 if role in ["super-admin", "admin", "doctor", "hospital-admin", "pharmacy-admin"] else 0
    role_id = role_to_id[role]
    
    user_rows.append(f"  ('{uuid_val}', '{email}', '{phone}', '{PASSWORD_HASH}', '{escape(name)}', '{first_name}', '{last_name}', '{gender}', '{dob}', NULL, NULL, '{blood_group}', {role_id}, {is_verified}, 1, {is_admin_approved}, 1, '2026-01-15 10:00:00', NULL, '2026-05-28 09:30:00', '2026-01-01 00:00:00', '2026-05-28 09:30:00', NULL)")

L("INSERT INTO `users` (`id`, `email`, `phone`, `password_hash`, `full_name`, `first_name`, `last_name`, `gender`, `date_of_birth`, `profile_image`, `cover_image`, `blood_group`, `primary_role_id`, `is_verified`, `is_active`, `is_admin_approved`, `is_online`, `email_verified_at`, `phone_verified_at`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES")
for i, row in enumerate(user_rows):
    comma = "," if i < len(user_rows) - 1 else ";"
    L(f"{row}{comma}")
L("")

# ============================================
# 3. USER_ROLES
# ============================================
L("-- ============================================")
L("-- 3. USER_ROLES")
L("-- ============================================")
ur_rows = []
for uid, name, email, role in user_defs:
    role_id = role_to_id[role]
    ur_rows.append(f"  ('{USERS[uid]}', {role_id}, 1)")

L("INSERT INTO `user_roles` (`user_id`, `role_id`, `is_primary`) VALUES")
for i, row in enumerate(ur_rows):
    comma = "," if i < len(ur_rows) - 1 else ";"
    L(f"{row}{comma}")
L("")

# ============================================
# 4. ADMIN_USERS
# ============================================
L("-- ============================================")
L("-- 4. ADMIN_USERS")
L("-- ============================================")
admin_users = [
    ("super_admin_1", "rajesh.admin", "Rajesh Kumar", "super-admin", '[{"module":"all","actions":["create","read","update","delete","approve"]}]'),
    ("admin_1", "priya.admin", "Priya Sharma", "admin", '[{"module":"users","actions":["create","read","update","delete"]},{"module":"hospitals","actions":["read","update","approve"]}]'),
    ("moderator_1", "anil.mod", "Anil Verma", "moderator", '[{"module":"reviews","actions":["read","delete"]},{"module":"feedback","actions":["read","update"]}]'),
]
L("INSERT INTO `admin_users` (`user_id`, `username`, `full_name`, `role`, `permissions`, `is_active`, `is_two_factor_enabled`) VALUES")
for i, (uid, uname, fname, role, perms) in enumerate(admin_users):
    comma = "," if i < len(admin_users) - 1 else ";"
    L(f"  ('{USERS[uid]}', '{uname}', '{fname}', '{role}', '{perms}', 1, 0){comma}")
L("")

# ============================================
# 5. USER_PROFILES
# ============================================
L("-- ============================================")
L("-- 5. USER_PROFILES")
L("-- ============================================")
profile_data = [
    ("patient_1", "Software engineer with an active lifestyle", 175.0, 72.0, '["Penicillin"]', '[]', "BlueCross BlueShield", "BC-2024-78901", "Ravi Sharma", "+1-555-9901", "father"),
    ("patient_2", "Teacher and mother of two", 163.0, 58.0, '["Pollen","Latex"]', '["Mild Asthma"]', "Aetna", "AE-2024-45678", "Mark Davis", "+1-555-9902", "husband"),
    ("patient_3", "College student, fitness enthusiast", 178.0, 75.0, '[]', '[]', "UnitedHealth", "UH-2024-12345", "Sunita Patel", "+1-555-9903", "mother"),
    ("patient_4", "Marketing professional", 160.0, 55.0, '["Sulfa drugs"]', '["Migraine"]', "Cigna", "CG-2024-67890", "Carlos Martinez", "+1-555-9904", "father"),
    ("patient_5", "Retired bank manager, manages diabetes", 170.0, 80.0, '[]', '["Type 2 Diabetes","Hypertension"]', "Humana", "HM-2024-34567", "Sunita Kumar", "+1-555-9905", "wife"),
    ("patient_6", "Graphic designer and artist", 168.0, 62.0, '["Aspirin"]', '[]', "Kaiser", "KP-2024-23456", "Robert Taylor", "+1-555-9906", "father"),
    ("patient_7", "Nursing student, pregnant", 162.0, 60.0, '[]', '[]', "Anthem", "AN-2024-56789", "Raj Singh", "+1-555-9907", "husband"),
    ("patient_8", "Fitness trainer and nutritionist", 182.0, 85.0, '[]', '[]', "BlueCross BlueShield", "BC-2024-89012", "Patricia Johnson", "+1-555-9908", "mother"),
    ("patient_9", "Research scientist", 158.0, 52.0, '["Ibuprofen"]', '["Hypothyroidism"]', "Aetna", "AE-2024-90123", "Venkat Reddy", "+1-555-9909", "father"),
    ("patient_10", "Freelance writer", 174.0, 70.0, '[]', '["Anxiety"]', "UnitedHealth", "UH-2024-01234", "Linda Anderson", "+1-555-9910", "mother"),
]
L("INSERT INTO `user_profiles` (`user_id`, `bio`, `height_cm`, `weight_kg`, `allergies`, `chronic_conditions`, `insurance_provider`, `insurance_policy_number`, `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relation`) VALUES")
for i, (uid, bio, h, w, alg, chr, ins, pol, ecn, ecp, ecr) in enumerate(profile_data):
    comma = "," if i < len(profile_data) - 1 else ";"
    L(f"  ('{USERS[uid]}', '{bio}', {h}, {w}, '{alg}', '{chr}', '{ins}', '{pol}', '{ecn}', '{ecp}', '{eccr}')")
    # Fix: ecr variable name wrong
L("")

# Oops, let me fix this. I'll write it properly below.

# Actually, let me just write this entire file properly without mistakes.
# I'll start over with a cleaner approach.
