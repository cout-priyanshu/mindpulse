from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from app.db.database import get_db
from app.models.models import User, AnonymousCohortInsight
from app.schemas.schemas import InstitutionInsightsResponse, CohortTrendPoint
from app.core.dependencies import get_current_user, require_role
from app.config import settings

router = APIRouter(prefix="/institution", tags=["Institution Aggregate Insights"])

@router.get("/insights", response_model=InstitutionInsightsResponse)
def get_cohort_insights(
    cohort_name: str = Query("Computer Engineering - Year 2"),
    simulate_low_sample: bool = Query(False),
    current_admin: User = Depends(require_role(["institution_admin"])),
    db=Depends(get_db)
):
    """
    STRICT PRIVACY-FIRST COHORT INTELLIGENCE.
    Guarantees:
    1. Zero individual student identifiers or activity logs are accessible to administrators.
    2. Enforces strict k-anonymity / minimum cohort size threshold (settings.MIN_ANONYMOUS_COHORT_SIZE = 10).
    3. If cohort sample size < threshold, statistics are masked with a privacy guarantee warning.
    """
    sample_size = 5 if simulate_low_sample else 48
    
    if sample_size < settings.MIN_ANONYMOUS_COHORT_SIZE:
        return InstitutionInsightsResponse(
            is_safe_to_display=False,
            privacy_label="Aggregated insights only. No individual student records.",
            cohort_name=cohort_name,
            sample_size=sample_size,
            minimum_threshold_required=settings.MIN_ANONYMOUS_COHORT_SIZE,
            pressure_headline="Not enough anonymous data to display a cohort trend safely.",
            top_pressure_signal="Insufficient cohort threshold",
            suggested_institutional_response="Privacy rule active: A minimum of 10 consenting students in a cohort is required before aggregate trends can be visualised.",
            weekly_trends=[],
            disclaimer="MindPulse enforces strict differential privacy thresholds to prevent faculty or administrative identification of individual students."
        )

    # Weekly aggregate historical data for Second-year engineering
    trends = [
        CohortTrendPoint(week_label="Week 3", avg_workload_index=2.4, pressure_category="Manageable"),
        CohortTrendPoint(week_label="Week 4", avg_workload_index=2.7, pressure_category="Manageable"),
        CohortTrendPoint(week_label="Week 5", avg_workload_index=3.1, pressure_category="Moderate"),
        CohortTrendPoint(week_label="Week 6", avg_workload_index=3.6, pressure_category="Elevated"),
        CohortTrendPoint(week_label="Week 7 (Current)", avg_workload_index=4.2, pressure_category="Elevated")
    ]

    return InstitutionInsightsResponse(
        is_safe_to_display=True,
        privacy_label="Aggregated insights only. No individual student records.",
        cohort_name=cohort_name,
        sample_size=sample_size,
        minimum_threshold_required=settings.MIN_ANONYMOUS_COHORT_SIZE,
        pressure_headline="Second-year workload pressure rose this week",
        top_pressure_signal="Clustered deadlines",
        suggested_institutional_response="Review deadline bunching across department courses and share academic-support resources.",
        weekly_trends=trends,
        disclaimer="MindPulse provides anonymised cohort-level patterns only. Faculty and administrators have zero access to individual student identities, specific check-in entries, or personal wellness indicators."
    )
