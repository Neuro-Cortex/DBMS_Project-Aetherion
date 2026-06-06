"""
Database initialization utility for Aetherion Healthcare.

Usage:
    python init_db.py              # Create all tables (safe if they already exist)
    python init_db.py --seed       # Create tables + seed with initial data
    python init_db.py --drop       # Drop all tables (DESTRUCTIVE — use with caution)
    python init_db.py --stamp       # Stamp Alembic head (for existing DBs)
"""

import sys
import argparse


def create_tables():
    """Create all tables from SQLAlchemy models (safe if they already exist)."""
    from app.core.database import engine, Base
    from app.models import *  # noqa: F401,F403

    print(f"Creating {len(Base.metadata.tables)} tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully")


def drop_tables():
    """Drop all tables. DESTRUCTIVE."""
    from app.core.database import engine, Base
    from app.models import *  # noqa: F401,F403

    confirm = input("⚠️  This will DROP ALL TABLES. Type 'yes' to confirm: ")
    if confirm != "yes":
        print("Cancelled.")
        return

    Base.metadata.drop_all(bind=engine)
    print("✅ All tables dropped")


def seed_data():
    """Seed the database with initial roles and admin user."""
    from app.core.database import SessionLocal
    from app.core.security import hash_password
    from app.models.user import Role, User

    db = SessionLocal()
    try:
        # Seed roles
        roles_data = [
            ("super_admin", "Super Admin", "Full system access", 100),
            ("admin", "Administrator", "System administration", 90),
            ("moderator", "Moderator", "Content moderation", 70),
            ("doctor", "Doctor", "Medical professional", 50),
            ("hospital", "Hospital", "Hospital administrator", 50),
            ("hospital_admin", "Hospital Admin", "Hospital management", 55),
            ("pharmacy", "Pharmacy", "Pharmacy owner", 50),
            ("pharmacy_admin", "Pharmacy Admin", "Pharmacy management", 55),
            ("patient", "Patient", "Healthcare patient", 10),
            ("client", "Client", "General user", 5),
            ("blood_donor", "Blood Donor", "Blood donor", 15),
            ("emergency_volunteer", "Emergency Volunteer", "Emergency responder", 20),
            ("normal_user", "Normal User", "Basic user", 1),
        ]

        for name, display, desc, priority in roles_data:
            existing = db.query(Role).filter(Role.name == name).first()
            if not existing:
                role = Role(name=name, display_name=display, description=desc, priority=priority)
                db.add(role)
                print(f"  Created role: {name}")

        db.commit()

        # Seed super admin
        admin_role = db.query(Role).filter(Role.name == "super_admin").first()
        existing_admin = db.query(User).filter(User.email == "admin@aetherion.health").first()

        if not existing_admin and admin_role:
            admin = User(
                email="admin@aetherion.health",
                password_hash=hash_password("Admin@123456"),
                full_name="Aetherion Super Admin",
                primary_role_id=admin_role.id,
                is_verified=True,
                is_active=True,
                is_admin_approved=True,
            )
            db.add(admin)
            db.commit()
            print("  Created super admin: admin@aetherion.health / Admin@123456")

        print("✅ Database seeded successfully")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed error: {e}")
        raise
    finally:
        db.close()


def stamp_alembic():
    """Stamp Alembic to the latest revision (for databases that already have tables)."""
    from alembic.config import Config
    from alembic import command

    config = Config("alembic.ini")
    command.stamp(config, "head")
    print("✅ Alembic stamped to head")


def main():
    parser = argparse.ArgumentParser(description="Aetherion DB Initialization")
    parser.add_argument("--seed", action="store_true", help="Seed with initial data")
    parser.add_argument("--drop", action="store_true", help="Drop all tables (DESTRUCTIVE)")
    parser.add_argument("--stamp", action="store_true", help="Stamp Alembic head for existing DB")
    args = parser.parse_args()

    if args.drop:
        drop_tables()
        return

    create_tables()

    if args.seed:
        seed_data()

    if args.stamp:
        stamp_alembic()


if __name__ == "__main__":
    main()
