from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from app.db.database import get_db
from app.models.models import User, AcademicEvent, ConsentPreference
from app.schemas.schemas import AcademicEventCreate, AcademicEventResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/academic-events", tags=["Academic Events & Routine"])

@router.get("", response_model=List[AcademicEventResponse])
def get_academic_events(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    consent = db.query(ConsentPreference).filter_by(user_id=current_user.id).first()
    if consent and not consent.track_academic_deadlines:
        return []
    
    events = db.query(AcademicEvent).filter_by(user_id=current_user.id).all()
    return events

@router.post("", response_model=AcademicEventResponse)
def create_academic_event(
    event_in: AcademicEventCreate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    event_obj = AcademicEvent(
        user_id=current_user.id,
        title=event_in.title,
        course_code=event_in.course_code,
        due_date=event_in.due_date,
        status=event_in.status,
        late_night_activity_hours=event_in.late_night_activity_hours,
        study_consistency_score=event_in.study_consistency_score,
        created_at=datetime.utcnow()
    )
    db.add(event_obj)
    db.commit()
    return event_obj
