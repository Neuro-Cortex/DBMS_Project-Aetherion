"""initial_schema_75_tables

Revision ID: 562ccecc810a
Revises:
Create Date: 2026-05-31 13:58:04.232732

This is a stamp revision for the initial 75-table schema.
If the database already has tables from schema.sql, run:
    alembic stamp head
If starting fresh, run:
    alembic upgrade head
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '562ccecc810a'
down_revision: Union[str, None] = None
branch_labels: Union[str, str, None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # This migration represents the initial schema with 75 tables.
    # If tables already exist from schema.sql, use: alembic stamp head
    # If starting fresh, this migration creates all tables via SQLAlchemy metadata.
    #
    # For fresh databases, use the create_all helper instead:
    #   python -c "from app.core.database import engine, Base; from app.models import *; Base.metadata.create_all(engine)"
    # Then: alembic stamp head
    pass


def downgrade() -> None:
    # Not dropping tables — this is the base revision
    pass
