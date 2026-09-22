from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReportBase(BaseModel):
    issue_type: str = Field(..., description="Type of the issue being reported, e.g. no_hot_water.")
    description: Optional[str] = Field(None, max_length=500)
    latitude: float = Field(..., ge=-90, le=90, description="Valid GPS Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Valid GPS Longitude")

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    is_verified_outage: bool
    created_at: datetime

    class Config:
        orm_mode = True