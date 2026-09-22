import uuid
from datetime import datetime

try:
    from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey
except ImportError:
    from app.db.orm import Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey

from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(64), default="student", nullable=False)  # "student" or "institution_admin"
    cohort = Column(String(128), default="Engineering - Year 2")
    created_at = Column(DateTime, default=datetime.utcnow)

class ConsentPreference(Base):
    __tablename__ = "consent_preferences"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), unique=True, nullable=False)
    track_academic_deadlines = Column(Boolean, default=True)
    track_study_routine = Column(Boolean, default=True)
    track_daily_checkins = Column(Boolean, default=True)
    allow_anonymous_cohort_aggregation = Column(Boolean, default=True)
    consent_granted_at = Column(DateTime, default=datetime.utcnow)
    last_updated_at = Column(DateTime, default=datetime.utcnow)

class DailyCheckIn(Base):
    __tablename__ = "daily_checkins"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    date = Column(String(16), nullable=False)  # YYYY-MM-DD
    energy_level = Column(Integer, nullable=False)  # 1 to 5
    workload_score = Column(Integer, nullable=False)  # 1 to 5 (1=Comfortable, 5=Heavy)
    support_helpful = Column(String(32), default="no")  # "yes", "maybe", "no"
    reflection_note = Column(Text, nullable=True)  # optional private notes
    created_at = Column(DateTime, default=datetime.utcnow)

class AcademicEvent(Base):
    __tablename__ = "academic_events"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    course_code = Column(String(64), nullable=False)
    due_date = Column(String(32), nullable=False)  # ISO string or date
    status = Column(String(32), default="on_time")  # "on_time", "delayed", "missed", "deferred", "completed"
    late_night_activity_hours = Column(Float, default=0.0)  # hours active past midnight
    study_consistency_score = Column(Float, default=0.85)  # 0.0 to 1.0
    created_at = Column(DateTime, default=datetime.utcnow)

class WellbeingTrend(Base):
    __tablename__ = "wellbeing_trends"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    period_start = Column(String(16), nullable=False)
    period_end = Column(String(16), nullable=False)
    trend_state = Column(String(32), default="balanced")  # "balanced", "watchful", "needs_attention"
    status_headline = Column(String(255), default="Your rhythm is steady")
    status_explanation = Column(Text, nullable=False)
    contributing_factors_json = Column(Text, default="[]")  # JSON string array
    coverage_note = Column(String(255), default="Based on verified course activity and consented check-ins")
    today_next_step = Column(String(255), default="Maintain your regular wind-down routine tonight.")
    computed_at = Column(DateTime, default=datetime.utcnow)

class SupportAction(Base):
    __tablename__ = "support_actions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    action_type = Column(String(64), nullable=False)  # "breathing_reset", "workload_deferral", "anonymous_peer_support", "confidential_counselling"
    details_json = Column(Text, default="{}")
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnonymousCohortInsight(Base):
    __tablename__ = "anonymous_cohort_insights"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    cohort_name = Column(String(128), nullable=False)
    week_label = Column(String(64), nullable=False)
    sample_size = Column(Integer, default=45)
    pressure_level = Column(String(32), default="Moderate")  # "Stable", "Moderate", "Elevated"
    top_pressure_signal = Column(String(128), default="Clustered deadlines")
    suggested_institutional_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# If our custom ORM is used, register models
if hasattr(Base, 'metadata') and hasattr(Base.metadata, 'register'):
    for model in [User, ConsentPreference, DailyCheckIn, AcademicEvent, WellbeingTrend, SupportAction, AnonymousCohortInsight]:
        Base.metadata.register(model)
