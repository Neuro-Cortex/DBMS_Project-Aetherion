from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.mysql import CHAR
import uuid
class BaseModel:
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
