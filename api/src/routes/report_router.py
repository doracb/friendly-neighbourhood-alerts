from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from db.database import get_db
from db import models, schemas

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    point_wkt = f"POINT({report.longitude} {report.latitude})"
    
    db_report = models.Report(
        issue_type=report.issue_type,
        description=report.description,
        location=point_wkt
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    return {
        "id": db_report.id,
        "issue_type": db_report.issue_type,
        "description": db_report.description,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "is_verified_outage": db_report.is_verified_outage,
        "created_at": db_report.created_at
    }
    
@router.get("/", response_model=List[schemas.ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(
        models.Report.id,
        models.Report.issue_type,
        models.Report.description,
        models.Report.is_verified_outage,
        models.Report.created_at,
        func.ST_Y(models.Report.location).label("latitude"),
        func.ST_X(models.Report.location).label("longitude")
    ).all()
    
    return reports