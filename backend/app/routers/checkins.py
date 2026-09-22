from datetime import datetime, date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.db.database import get_db
from app.models.models import User, DailyCheckIn, ConsentPreference
from app.schemas.schemas import DailyCheckInCreate, DailyCheckInResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/checkins", tags=["Daily Check-ins"])

def generate_micro_message(energy_level: int, workload_score: int, support_helpful: str) -> str:
    if energy_level <= 2 and workload_score >= 4:
        return "Thank you for checking in. A lighter plan today could make tomorrow feel easier."
    elif energy_level <= 2:
        return "Thank you for checking in. Rest is productive work—consider an early wind-down tonight."
    elif workload_score >= 4:
        return "Noted. Your workload feels heavy right now; pacing one priority at a time may help."
    elif energy_level >= 4 and workload_score <= 2:
        return "Great to hear your energy feels replenished and pace is comfortable today."
    else:
        return "Thank you for pausing to check in. Keeping in touch with your rhythm protects your balance."

@router.post("", response_model=DailyCheckInResponse)
def submit_checkin(
    checkin_in: DailyCheckInCreate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    consent = db.query(ConsentPreference).filter_by(user_id=current_user.id).first()
    if consent and not consent.track_daily_checkins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Daily check-in data collection is currently disabled in your Privacy Center."
        )

    today_str = date.today().isoformat()
    
    # Create or update today's checkin
    existing = db.query(DailyCheckIn).filter_by(user_id=current_user.id, date=today_str).first()
    if existing:
        existing.energy_level = checkin_in.energy_level
        existing.workload_score = checkin_in.workload_score
        existing.support_helpful = checkin_in.support_helpful or "no"
        existing.reflection_note = checkin_in.reflection_note
        db.commit()
        checkin_obj = existing
    else:
        checkin_obj = DailyCheckIn(
            user_id=current_user.id,
            date=today_str,
            energy_level=checkin_in.energy_level,
            workload_score=checkin_in.workload_score,
            support_helpful=checkin_in.support_helpful or "no",
            reflection_note=checkin_in.reflection_note,
            created_at=datetime.utcnow()
        )
        db.add(checkin_obj)
        db.commit()

    msg = generate_micro_message(checkin_in.energy_level, checkin_in.workload_score, checkin_in.support_helpful)
    
    return DailyCheckInResponse(
        id=checkin_obj.id,
        user_id=checkin_obj.user_id,
        date=checkin_obj.date,
        energy_level=checkin_obj.energy_level,
        workload_score=checkin_obj.workload_score,
        support_helpful=checkin_obj.support_helpful,
        reflection_note=checkin_obj.reflection_note,
        micro_message=msg,
        created_at=checkin_obj.created_at
    )

@router.get("/history", response_model=List[DailyCheckInResponse])
def get_checkin_history(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    checkins = db.query(DailyCheckIn).filter_by(user_id=current_user.id).all()
    results = []
    for c in checkins:
        results.append(DailyCheckInResponse(
            id=c.id,
            user_id=c.user_id,
            date=c.date,
            energy_level=c.energy_level,
            workload_score=c.workload_score,
            support_helpful=c.support_helpful,
            reflection_note=c.reflection_note,
            micro_message=generate_micro_message(c.energy_level, c.workload_score, c.support_helpful),
            created_at=c.created_at
        ))
    return results
