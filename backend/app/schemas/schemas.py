from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str
    email: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "student"
    cohort: Optional[str] = "Engineering - Year 2"

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    cohort: Optional[str]
    created_at: Optional[Any]

    class Config:
        orm_mode = True

# Consent Schemas
class ConsentPreferenceUpdate(BaseModel):
    track_academic_deadlines: Optional[bool] = None
    track_study_routine: Optional[bool] = None
    track_daily_checkins: Optional[bool] = None
    allow_anonymous_cohort_aggregation: Optional[bool] = None

class ConsentPreferenceResponse(BaseModel):
    id: str
    user_id: str
    track_academic_deadlines: bool
    track_study_routine: bool
    track_daily_checkins: bool
    allow_anonymous_cohort_aggregation: bool
    consent_granted_at: Optional[Any]
    last_updated_at: Optional[Any]

    class Config:
        orm_mode = True

# Daily Check-in Schemas
class DailyCheckInCreate(BaseModel):
    energy_level: int = Field(..., ge=1, le=5)  # 1 to 5
    workload_score: int = Field(..., ge=1, le=5)  # 1 (Comfortable) to 5 (Heavy)
    support_helpful: Optional[str] = "no"  # "yes", "maybe", "no"
    reflection_note: Optional[str] = None

class DailyCheckInResponse(BaseModel):
    id: str
    user_id: str
    date: str
    energy_level: int
    workload_score: int
    support_helpful: str
    reflection_note: Optional[str]
    micro_message: Optional[str]
    created_at: Optional[Any]

    class Config:
        orm_mode = True

# Academic Event Schemas
class AcademicEventCreate(BaseModel):
    title: str
    course_code: str
    due_date: str
    status: str = "on_time"
    late_night_activity_hours: float = 0.0
    study_consistency_score: float = 0.85

class AcademicEventResponse(BaseModel):
    id: str
    title: str
    course_code: str
    due_date: str
    status: str
    late_night_activity_hours: float
    study_consistency_score: float

    class Config:
        orm_mode = True

# Wellbeing Trend Schemas
class WellbeingSummaryResponse(BaseModel):
    trend_state: str  # "balanced", "watchful", "needs_attention"
    status_headline: str
    status_explanation: str
    contributing_factors: List[str]
    coverage_note: str
    today_next_step: str
    seven_day_trend: List[Dict[str, Any]]
    active_scenario: str  # "balanced" or "demanding"

class RhythmTimelineDay(BaseModel):
    date: str
    day_label: str
    deadline_event: Optional[str] = None
    deadline_status: Optional[str] = None  # "on_time", "delayed", "missed", "deferred"
    study_consistency_pct: int
    late_night_hours: float
    energy_level: Optional[int] = None
    workload_score: Optional[int] = None
    trend_marker: str  # "steady", "shift", "recovering"
    gentle_note: str

class RhythmTimelineResponse(BaseModel):
    days: List[RhythmTimelineDay]
    summary_insight: str

# Support Schemas
class SupportActionCreate(BaseModel):
    action_type: str  # "breathing_reset", "workload_deferral", "anonymous_peer_support", "confidential_counselling"
    details: Optional[Dict[str, Any]] = None

class SupportActionResponse(BaseModel):
    id: str
    action_type: str
    completed: bool
    confirmation_message: str

class SupportRecommendationItem(BaseModel):
    id: str
    title: str
    category: str
    estimated_time: str
    description: str
    student_control_note: str
    action_type: str

class SupportRecommendationsResponse(BaseModel):
    recommendations: List[SupportRecommendationItem]
    encouragement_note: str

class DeferTaskRequest(BaseModel):
    task_id: str
    new_target_day: str = "Later this week"

class LighterEveningTask(BaseModel):
    id: str
    title: str
    course: str
    estimated_minutes: int
    is_urgent: bool
    deferred: bool

class LighterEveningResponse(BaseModel):
    tasks: List[LighterEveningTask]
    initial_workload_hours: float
    current_workload_hours: float
    relief_hours: float
    feedback_message: str

# Institution Aggregate Insights Schemas
class CohortTrendPoint(BaseModel):
    week_label: str
    avg_workload_index: float  # e.g. 2.4 to 4.1
    pressure_category: str  # "Manageable", "Elevated"

class InstitutionInsightsResponse(BaseModel):
    is_safe_to_display: bool
    privacy_label: str
    cohort_name: str
    sample_size: int
    minimum_threshold_required: int
    pressure_headline: str
    top_pressure_signal: str
    suggested_institutional_response: str
    weekly_trends: List[CohortTrendPoint]
    disclaimer: str

# Demo Scenario Request
class DemoScenarioRequest(BaseModel):
    scenario: str  # "balanced" or "demanding"

class DemoScenarioResponse(BaseModel):
    success: bool
    active_scenario: str
    message: str
