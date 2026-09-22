from fastapi import APIRouter, Depends, HTTPException
from app.db.database import get_db
from app.models.models import User, ConsentPreference, DailyCheckIn, AcademicEvent
from app.schemas.schemas import WellbeingSummaryResponse, RhythmTimelineResponse, RhythmTimelineDay
from app.services.wellbeing_engine import RuleBasedWellbeingEngine, get_current_scenario
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/wellbeing", tags=["Wellbeing Intelligence"])

@router.get("/summary", response_model=WellbeingSummaryResponse)
def get_wellbeing_summary(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    consent = db.query(ConsentPreference).filter_by(user_id=current_user.id).first()
    checkins = db.query(DailyCheckIn).filter_by(user_id=current_user.id).all()
    events = db.query(AcademicEvent).filter_by(user_id=current_user.id).all()
    
    evaluation = RuleBasedWellbeingEngine.evaluate(
        user_id=current_user.id,
        consent=consent,
        checkins=checkins,
        academic_events=events
    )
    
    return WellbeingSummaryResponse(**evaluation)

@router.get("/timeline", response_model=RhythmTimelineResponse)
def get_rhythm_timeline(current_user: User = Depends(get_current_user)):
    scenario = get_current_scenario(current_user.id)
    timeline_days_raw = RuleBasedWellbeingEngine.get_timeline(scenario)
    
    days = [RhythmTimelineDay(**d) for d in timeline_days_raw]
    
    if scenario == "demanding":
        summary = "Two deadline delays coincided with increased late-night hours past midnight, leading to consecutive low energy reports by Friday."
    else:
        summary = "Consistent study hours and timely completions accompanied stable daily energy levels throughout the 7-day cycle."
        
    return RhythmTimelineResponse(
        days=days,
        summary_insight=summary
    )
