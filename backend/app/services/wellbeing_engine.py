import json
from datetime import datetime, timedelta
from typing import Dict, Any, List
from app.models.models import DailyCheckIn, AcademicEvent, ConsentPreference

# Global in-memory scenario tracker for demo session flexibility
CURRENT_DEMO_SCENARIO: Dict[str, str] = {}

def get_current_scenario(user_id: str) -> str:
    return CURRENT_DEMO_SCENARIO.get(user_id, "demanding")

def set_current_scenario(user_id: str, scenario: str) -> None:
    CURRENT_DEMO_SCENARIO[user_id] = scenario

class RuleBasedWellbeingEngine:
    """
    Transparent, non-diagnostic wellbeing pattern evaluator.
    Designed specifically for engineering students to identify routine shifts and pressure buildup.
    IMPORTANT SAFETY MANDATE:
    This engine NEVER performs clinical diagnosis, screening for depression/anxiety,
    or psychological profiling. All insights are transparent, rule-based routine observations.
    """

    @classmethod
    def evaluate(
        cls,
        user_id: str,
        consent: ConsentPreference,
        checkins: List[DailyCheckIn],
        academic_events: List[AcademicEvent],
        forced_scenario: str = None
    ) -> Dict[str, Any]:
        scenario = forced_scenario or get_current_scenario(user_id)

        # Respect student consent preferences
        track_deadlines = consent.track_academic_deadlines if consent else True
        track_routine = consent.track_study_routine if consent else True
        track_checkins = consent.track_daily_checkins if consent else True

        # Coverage assessment note based on consented signals
        sources = []
        if track_deadlines: sources.append("academic deadlines")
        if track_routine: sources.append("study consistency")
        if track_checkins: sources.append("daily energy self-reports")

        if not sources:
            return {
                "trend_state": "balanced",
                "status_headline": "Privacy paused: No data sources active",
                "status_explanation": "All data collection categories have been disabled in your Privacy Center. Your wellbeing trend is on standby.",
                "contributing_factors": ["Data tracking paused per student consent."],
                "coverage_note": "No active consented data streams",
                "today_next_step": "Enable categories in the Privacy Center whenever you choose.",
                "active_scenario": scenario,
                "seven_day_trend": cls._generate_trend_chart_data("balanced")
            }

        coverage_note = f"Synthesised from consented signals: {', '.join(sources)}."

        if scenario == "demanding":
            contributing_factors = []
            if track_deadlines:
                contributing_factors.append("Two assignments were delayed")
            if track_routine:
                contributing_factors.append("Your late-night activity was higher than your usual pattern")
            if track_checkins:
                contributing_factors.append("Energy check-ins have been lower for three days")

            return {
                "trend_state": "needs_attention",
                "status_headline": "Your routine has shifted recently",
                "status_explanation": "A few changes in deadlines, late-night study, and energy check-ins suggest that a small reset may help.",
                "contributing_factors": contributing_factors,
                "coverage_note": coverage_note,
                "today_next_step": "Choose one task to defer and protect 30 minutes for recovery.",
                "active_scenario": "demanding",
                "seven_day_trend": cls._generate_trend_chart_data("demanding")
            }
        else:
            contributing_factors = []
            if track_deadlines:
                contributing_factors.append("All course milestones were submitted on or before due dates")
            if track_routine:
                contributing_factors.append("Late-night activity remained within your regular baseline")
            if track_checkins:
                contributing_factors.append("Daily energy ratings remained stable across the week")

            return {
                "trend_state": "balanced",
                "status_headline": "Your rhythm is steady",
                "status_explanation": "Your study consistency, deadline timing, and daily energy levels have remained steady over the past 7 days.",
                "contributing_factors": contributing_factors,
                "coverage_note": coverage_note,
                "today_next_step": "Maintain your regular wind-down routine tonight.",
                "active_scenario": "balanced",
                "seven_day_trend": cls._generate_trend_chart_data("balanced")
            }

    @classmethod
    def _generate_trend_chart_data(cls, scenario: str) -> List[Dict[str, Any]]:
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        if scenario == "demanding":
            # Demanding scenario: energy drops, late night increases, consistency drops
            energy_values = [4, 3, 2, 2, 1, 2, 2]
            consistency_values = [88, 75, 52, 45, 38, 40, 42]
            late_night_hours = [0.5, 1.2, 2.8, 3.4, 3.1, 2.5, 2.0]
            workload_values = [2, 3, 4, 5, 5, 4, 4]
        else:
            # Balanced scenario: stable energy, high consistency, minimal late-night
            energy_values = [4, 4, 4, 3, 4, 5, 4]
            consistency_values = [85, 88, 86, 82, 85, 89, 87]
            late_night_hours = [0.2, 0.4, 0.5, 0.3, 0.4, 0.1, 0.2]
            workload_values = [2, 2, 3, 3, 2, 2, 2]

        data = []
        for i in range(7):
            data.append({
                "day": days[i],
                "energy": energy_values[i],
                "consistency": consistency_values[i],
                "lateNightHours": late_night_hours[i],
                "workload": workload_values[i]
            })
        return data

    @classmethod
    def get_timeline(cls, scenario: str) -> List[Dict[str, Any]]:
        days_info = [
            {"date": "Day 1", "label": "Monday"},
            {"date": "Day 2", "label": "Tuesday"},
            {"date": "Day 3", "label": "Wednesday"},
            {"date": "Day 4", "label": "Thursday"},
            {"date": "Day 5", "label": "Friday"},
            {"date": "Day 6", "label": "Saturday"},
            {"date": "Day 7", "label": "Sunday"},
        ]

        if scenario == "demanding":
            return [
                {
                    "date": "Day 1",
                    "day_label": "Monday",
                    "deadline_event": "Algorithms Lab 4 Submitted",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 88,
                    "late_night_hours": 0.5,
                    "energy_level": 4,
                    "workload_score": 2,
                    "trend_marker": "steady",
                    "gentle_note": "Rhythm aligned with regular routine."
                },
                {
                    "date": "Day 2",
                    "day_label": "Tuesday",
                    "deadline_event": "Operating Systems Milestone 2 Due",
                    "deadline_status": "delayed",
                    "study_consistency_pct": 75,
                    "late_night_hours": 1.2,
                    "energy_level": 3,
                    "workload_score": 3,
                    "trend_marker": "shift",
                    "gentle_note": "Slight routine delay; late evening study started."
                },
                {
                    "date": "Day 3",
                    "day_label": "Wednesday",
                    "deadline_event": "Computer Networks Quiz Prep",
                    "deadline_status": "delayed",
                    "study_consistency_pct": 52,
                    "late_night_hours": 2.8,
                    "energy_level": 2,
                    "workload_score": 4,
                    "trend_marker": "shift",
                    "gentle_note": "Consecutive late-night hours past midnight noted."
                },
                {
                    "date": "Day 4",
                    "day_label": "Thursday",
                    "deadline_event": "Database Systems Project Draft Missed",
                    "deadline_status": "missed",
                    "study_consistency_pct": 45,
                    "late_night_hours": 3.4,
                    "energy_level": 2,
                    "workload_score": 5,
                    "trend_marker": "shift",
                    "gentle_note": "Second academic deadline postponed; energy check-in reduced."
                },
                {
                    "date": "Day 5",
                    "day_label": "Friday",
                    "deadline_event": "Microprocessors Problem Set",
                    "deadline_status": "missed",
                    "study_consistency_pct": 38,
                    "late_night_hours": 3.1,
                    "energy_level": 1,
                    "workload_score": 5,
                    "trend_marker": "shift",
                    "gentle_note": "Sustained pressure pattern detected across three markers."
                },
                {
                    "date": "Day 6",
                    "day_label": "Saturday",
                    "deadline_event": "Quiet catch-up attempt",
                    "deadline_status": "deferred",
                    "study_consistency_pct": 40,
                    "late_night_hours": 2.5,
                    "energy_level": 2,
                    "workload_score": 4,
                    "trend_marker": "recovering",
                    "gentle_note": "Small break taken; energy stabilizing."
                },
                {
                    "date": "Day 7",
                    "day_label": "Sunday",
                    "deadline_event": "Weekly review & planning",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 42,
                    "late_night_hours": 2.0,
                    "energy_level": 2,
                    "workload_score": 4,
                    "trend_marker": "recovering",
                    "gentle_note": "Routine reset available to prepare for upcoming week."
                }
            ]
        else:
            return [
                {
                    "date": "Day 1",
                    "day_label": "Monday",
                    "deadline_event": "Algorithms Lab 4 Submitted",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 85,
                    "late_night_hours": 0.2,
                    "energy_level": 4,
                    "workload_score": 2,
                    "trend_marker": "steady",
                    "gentle_note": "Smooth start to week; on-track pacing."
                },
                {
                    "date": "Day 2",
                    "day_label": "Tuesday",
                    "deadline_event": "Operating Systems Milestone 2 Submitted",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 88,
                    "late_night_hours": 0.4,
                    "energy_level": 4,
                    "workload_score": 2,
                    "trend_marker": "steady",
                    "gentle_note": "Assignments handed in ahead of schedule."
                },
                {
                    "date": "Day 3",
                    "day_label": "Wednesday",
                    "deadline_event": "Computer Networks Quiz",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 86,
                    "late_night_hours": 0.5,
                    "energy_level": 4,
                    "workload_score": 3,
                    "trend_marker": "steady",
                    "gentle_note": "Manageable quiz day with adequate rest."
                },
                {
                    "date": "Day 4",
                    "day_label": "Thursday",
                    "deadline_event": "Database Systems Project Draft",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 82,
                    "late_night_hours": 0.3,
                    "energy_level": 3,
                    "workload_score": 3,
                    "trend_marker": "steady",
                    "gentle_note": "Comfortable workflow with prompt submissions."
                },
                {
                    "date": "Day 5",
                    "day_label": "Friday",
                    "deadline_event": "Microprocessors Problem Set",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 85,
                    "late_night_hours": 0.4,
                    "energy_level": 4,
                    "workload_score": 2,
                    "trend_marker": "steady",
                    "gentle_note": "Weekday wrapped up without late-night cramming."
                },
                {
                    "date": "Day 6",
                    "day_label": "Saturday",
                    "deadline_event": "Personal study & hobby time",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 89,
                    "late_night_hours": 0.1,
                    "energy_level": 5,
                    "workload_score": 2,
                    "trend_marker": "steady",
                    "gentle_note": "High energy replenishment over the weekend."
                },
                {
                    "date": "Day 7",
                    "day_label": "Sunday",
                    "deadline_event": "Weekly wind-down",
                    "deadline_status": "on_time",
                    "study_consistency_pct": 87,
                    "late_night_hours": 0.2,
                    "energy_level": 4,
                    "workload_score": 2,
                    "trend_marker": "steady",
                    "gentle_note": "Balanced rhythm maintained for the entire cycle."
                }
            ]
