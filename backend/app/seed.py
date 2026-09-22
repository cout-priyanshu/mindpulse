import sys
import os
from datetime import datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.database import SessionLocal, Base, engine
from app.models.models import User, ConsentPreference, DailyCheckIn, AcademicEvent, AnonymousCohortInsight
from app.core.security import get_password_hash
from app.config import settings

def seed_database():
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # 1. Seed Student: Aarav Sharma
        aarav = db.query(User).filter_by(email=settings.DEMO_STUDENT_EMAIL).first()
        if not aarav:
            aarav = User(
                email=settings.DEMO_STUDENT_EMAIL,
                hashed_password=get_password_hash(settings.DEMO_STUDENT_PASSWORD),
                full_name="Aarav Sharma",
                role="student",
                cohort="Computer Engineering - Year 2",
                created_at=datetime.utcnow() - timedelta(days=60)
            )
            db.add(aarav)
            db.commit()
            print(f"Created student user: {aarav.email}")
        else:
            print(f"Student user {aarav.email} already exists.")

        # 2. Seed Admin: Dean Eleanor Vance
        admin = db.query(User).filter_by(email=settings.DEMO_ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.DEMO_ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.DEMO_ADMIN_PASSWORD),
                full_name="Dean Eleanor Vance",
                role="institution_admin",
                cohort="School of Engineering Administration",
                created_at=datetime.utcnow() - timedelta(days=90)
            )
            db.add(admin)
            db.commit()
            print(f"Created admin user: {admin.email}")
        else:
            print(f"Admin user {admin.email} already exists.")

        # 3. Seed Aarav's Consent Preferences
        consent = db.query(ConsentPreference).filter_by(user_id=aarav.id).first()
        if not consent:
            consent = ConsentPreference(
                user_id=aarav.id,
                track_academic_deadlines=True,
                track_study_routine=True,
                track_daily_checkins=True,
                allow_anonymous_cohort_aggregation=True,
                consent_granted_at=datetime.utcnow() - timedelta(days=30),
                last_updated_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(consent)
            db.commit()
            print("Created consent record for Aarav.")

        # 4. Seed Academic Events for Aarav
        existing_events = db.query(AcademicEvent).filter_by(user_id=aarav.id).count()
        if existing_events == 0:
            events_data = [
                {
                    "title": "Algorithms Lab 4: Dynamic Programming",
                    "course_code": "CS201",
                    "due_date": "2026-09-16T17:00:00Z",
                    "status": "on_time",
                    "late_night_activity_hours": 0.5,
                    "study_consistency_score": 0.88
                },
                {
                    "title": "Operating Systems Milestone 2: Page Replacement",
                    "course_code": "CS204",
                    "due_date": "2026-09-17T23:59:00Z",
                    "status": "delayed",
                    "late_night_activity_hours": 2.5,
                    "study_consistency_score": 0.65
                },
                {
                    "title": "Computer Networks Quiz: Transport Layer",
                    "course_code": "CS206",
                    "due_date": "2026-09-18T14:00:00Z",
                    "status": "delayed",
                    "late_night_activity_hours": 2.9,
                    "study_consistency_score": 0.50
                },
                {
                    "title": "Database Systems Project Draft: Normalization",
                    "course_code": "CS208",
                    "due_date": "2026-09-19T23:59:00Z",
                    "status": "missed",
                    "late_night_activity_hours": 3.4,
                    "study_consistency_score": 0.45
                },
                {
                    "title": "Microprocessors Problem Set: Interrupt Handling",
                    "course_code": "EE210",
                    "due_date": "2026-09-20T23:59:00Z",
                    "status": "missed",
                    "late_night_activity_hours": 3.1,
                    "study_consistency_score": 0.38
                }
            ]
            for ed in events_data:
                ev = AcademicEvent(
                    user_id=aarav.id,
                    title=ed["title"],
                    course_code=ed["course_code"],
                    due_date=ed["due_date"],
                    status=ed["status"],
                    late_night_activity_hours=ed["late_night_activity_hours"],
                    study_consistency_score=ed["study_consistency_score"]
                )
                db.add(ev)
            db.commit()
            print("Seeded academic events for Aarav.")

        # 5. Seed Check-ins for Aarav
        existing_checkins = db.query(DailyCheckIn).filter_by(user_id=aarav.id).count()
        if existing_checkins == 0:
            checkins_data = [
                {"date": "2026-09-16", "energy": 4, "workload": 2, "support": "no", "note": "Felt good after finishing algorithms lab."},
                {"date": "2026-09-17", "energy": 3, "workload": 3, "support": "no", "note": "OS assignment took longer than expected."},
                {"date": "2026-09-18", "energy": 2, "workload": 4, "support": "maybe", "note": "Slept poorly, studied till 2:30 AM."},
                {"date": "2026-09-19", "energy": 2, "workload": 5, "support": "maybe", "note": "Falling behind on both databases and OS."},
                {"date": "2026-09-20", "energy": 1, "workload": 5, "support": "yes", "note": "Exhausted. Deadlines clustering simultaneously."}
            ]
            for cd in checkins_data:
                chk = DailyCheckIn(
                    user_id=aarav.id,
                    date=cd["date"],
                    energy_level=cd["energy"],
                    workload_score=cd["workload"],
                    support_helpful=cd["support"],
                    reflection_note=cd["note"]
                )
                db.add(chk)
            db.commit()
            print("Seeded check-ins for Aarav.")

        # 6. Seed Cohort Insights
        existing_insights = db.query(AnonymousCohortInsight).count()
        if existing_insights == 0:
            insight = AnonymousCohortInsight(
                cohort_name="Computer Engineering - Year 2",
                week_label="Fall 2026 - Week 7",
                sample_size=48,
                pressure_level="Elevated",
                top_pressure_signal="Clustered deadlines",
                suggested_institutional_action="Review deadline bunching across department courses and share academic-support resources."
            )
            db.add(insight)
            db.commit()
            print("Seeded cohort insight.")

        print("Database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
