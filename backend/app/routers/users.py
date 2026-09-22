from fastapi import APIRouter, Depends, HTTPException, status
from app.db.database import get_db
from app.models.models import User, DailyCheckIn, AcademicEvent, ConsentPreference, SupportAction
from app.schemas.schemas import UserResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.delete("/me/data")
def delete_user_data(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    """
    Privacy-first: Purges all personal check-ins, academic events, and support logs.
    Preserves user account record with reset consent.
    """
    checkins = db.query(DailyCheckIn).filter_by(user_id=current_user.id).all()
    for c in checkins:
        db.delete(c)
    
    events = db.query(AcademicEvent).filter_by(user_id=current_user.id).all()
    for e in events:
        db.delete(e)
        
    actions = db.query(SupportAction).filter_by(user_id=current_user.id).all()
    for a in actions:
        db.delete(a)
        
    db.commit()
    return {
        "status": "success",
        "message": "All personal wellbeing check-ins, academic markers, and support interactions have been permanently deleted from MindPulse servers."
    }

@router.get("/me/export")
def export_user_data(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    """
    Allows the student to download a complete, transparent JSON export of their own wellbeing record.
    """
    consent = db.query(ConsentPreference).filter_by(user_id=current_user.id).first()
    checkins = db.query(DailyCheckIn).filter_by(user_id=current_user.id).all()
    events = db.query(AcademicEvent).filter_by(user_id=current_user.id).all()
    actions = db.query(SupportAction).filter_by(user_id=current_user.id).all()

    return {
        "export_metadata": {
            "application": "MindPulse Wellbeing Intelligence",
            "version": "1.0.0",
            "privacy_notice": "Confidential Student Wellbeing Record. Belongs solely to the student.",
            "student_name": current_user.full_name,
            "student_email": current_user.email,
            "cohort": current_user.cohort
        },
        "consent_settings": consent.to_dict() if consent else {},
        "checkins_history": [c.to_dict() for c in checkins],
        "academic_events": [e.to_dict() for e in events],
        "support_actions_logged": [a.to_dict() for a in actions]
    }
