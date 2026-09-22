from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from .database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    issue_type = Column(String, index=True)
    description = Column(Text, nullable=True)
    location = Column(Geometry(geometry_type='POINT', srid=4326), index=True)
    is_spam = Column(Boolean, default=False)
    is_verified_outage = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())