"""
Aetherion Healthcare - Alembic Environment Configuration

This module configures Alembic to:
1. Use the SQLAlchemy models from app.models for autogeneration
2. Read DB credentials from app.core.config.Settings
3. Support both online and offline migrations
"""

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Add project root to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Alembic Config object — provides access to values in alembic.ini
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ============================================
# OVERRIDE sqlalchemy.url FROM APP SETTINGS
# ============================================
from app.core.config import get_settings

settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# ============================================
# IMPORT ALL MODELS FOR AUTOGENERATION
# ============================================
from app.models import *  # noqa: F401,F403 — ensures all models register with Base.metadata
from app.core.database import Base

# This is the MetaData object for autogenerate support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    Configures the context with just a URL and not an Engine.
    Calls to context.execute() emit the given string to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,  # Required for SQLite compatibility in testing
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    Creates an Engine and associates a connection with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,
            compare_type=True,  # Detect column type changes
            compare_server_default=True,  # Detect default value changes
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
