from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.db.database import get_db
from app.models.models import User, ConsentPreference
from app.schemas.schemas import ConsentPreferenceResponse, ConsentPreferenceUpdate
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/consent", tags=["Consent & Privacy"])

@router.get("", response_model=ConsentPreferenceResponse)
def get_user_consent(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    consent = db.query(ConsentPreference).filter_by(user_id=current_user.id).first()
    if not consent:
        consent = ConsentPreference(
            user_id=current_user.id,
            track_academic_deadlines=True,
            track_study_routine=True,
            track_daily_checkins=True,
            allow_anonymous_cohort_aggregation=True,
            consent_granted_at=datetime.utcnow(),
            last_updated_at=datetime.utcnow()
        )
        db.add(consent)
        db.commit()
    return consent

@router.put("", response_model=ConsentPreferenceResponse)
def update_user_consent(
    consent_in: ConsentPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    consent = db.query(ConsentPreference).filter_by(user_id=current_user.id).first()
    if not consent:
        consent = ConsentPreference(user_id=current_user.id)
        db.add(consent)
    
    if consent_in.track_academic_deadlines is not None:
        consent.track_academic_deadlines = consent_in.track_academic_deadlines
    if consent_in.track_study_routine is not None:
        consent.track_study_routine = consent_in.track_study_routine
    if consent_in.track_daily_checkins is not None:
        consent.track_daily_checkins = consent_in.track_daily_checkins
    if consent_in.allow_anonymous_cohort_aggregation is not None:
        consent.allow_anonymous_cohort_aggregation = consent_in.allow_anonymous_cohort_aggregation
    
    consent.last_updated_at = datetime.utcnow()
    db.commit()
    return consent
