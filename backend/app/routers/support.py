import json
from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.db.database import get_db
from app.models.models import User, SupportAction
from app.schemas.schemas import (
    SupportActionCreate, SupportActionResponse,
    SupportRecommendationsResponse, SupportRecommendationItem,
    DeferTaskRequest, LighterEveningResponse, LighterEveningTask
)
from app.services.wellbeing_engine import get_current_scenario
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/support", tags=["Support & Interventions"])

# In-memory session store for Aarav's evening tasks
EVENING_TASKS: Dict[str, List[Dict[str, Any]]] = {}

def get_default_tasks():
    return [
        {
            "id": "task-1",
            "title": "Algorithms Practice Problem Set 4",
            "course": "CS201 Data Structures & Algorithms",
            "estimated_minutes": 90,
            "is_urgent": True,
            "deferred": False
        },
        {
            "id": "task-2",
            "title": "Operating Systems Virtual Memory Reading",
            "course": "CS204 Operating Systems",
            "estimated_minutes": 60,
            "is_urgent": False,
            "deferred": False
        },
        {
            "id": "task-3",
            "title": "Computer Networks Quiz Review Notes",
            "course": "CS206 Computer Networks",
            "estimated_minutes": 45,
            "is_urgent": True,
            "deferred": False
        },
        {
            "id": "task-4",
            "title": "Elective Seminar Background Paper",
            "course": "HUM102 Tech Ethics",
            "estimated_minutes": 45,
            "is_urgent": False,
            "deferred": False
        }
    ]

@router.get("/recommendations", response_model=SupportRecommendationsResponse)
def get_recommendations(current_user: User = Depends(get_current_user)):
    scenario = get_current_scenario(current_user.id)
    
    if scenario == "demanding":
        items = [
            SupportRecommendationItem(
                id="rec-breathe",
                title="2-Minute Guided Breathing Reset",
                category="Rhythm Recovery",
                estimated_time="2 mins",
                description="A gentle box-breathing cycle designed to downshift nervous-system activation before studying or sleeping.",
                student_control_note="Optional • You choose what happens next • No action is shared without your consent",
                action_type="breathing_reset"
            ),
            SupportRecommendationItem(
                id="rec-workload",
                title="Workload Reset Planner (Lighter Evening)",
                category="Academic Pacing",
                estimated_time="3 mins",
                description="Review tonight's academic commitments and safely defer one non-critical item to free up 45-60 minutes.",
                student_control_note="Optional • You choose what happens next • No action is shared without your consent",
                action_type="workload_deferral"
            ),
            SupportRecommendationItem(
                id="rec-peer",
                title="Anonymous Peer Support Chat",
                category="Shared Experience",
                estimated_time="Flexible",
                description="Connect anonymously with a trained engineering peer mentor who understands mid-semester course loads.",
                student_control_note="Optional • You choose what happens next • No action is shared without your consent",
                action_type="anonymous_peer_support"
            ),
            SupportRecommendationItem(
                id="rec-counsel",
                title="Confidential Counselling Connection",
                category="Professional Resource",
                estimated_time="Flexible",
                description="Request a private, confidential consult with campus wellbeing services. No faculty notifications are ever sent.",
                student_control_note="Optional • You choose what happens next • No action is shared without your consent",
                action_type="confidential_counselling"
            )
        ]
        encouragement = "When demands cluster, small proactive pacing adjustments prevent fatigue from compounding."
    else:
        items = [
            SupportRecommendationItem(
                id="rec-breathe-light",
                title="Mindful Evening Wind-Down",
                category="Maintenance",
                estimated_time="2 mins",
                description="A brief relaxation transition to mark the boundary between academic work and personal rest.",
                student_control_note="Optional • You choose what happens next • No action is shared without your consent",
                action_type="breathing_reset"
            ),
            SupportRecommendationItem(
                id="rec-plan-ahead",
                title="Weekly Rhythm Preservation",
                category="Maintenance",
                estimated_time="5 mins",
                description="Reflect on what helped keep your study consistency high this week and carry it forward.",
                student_control_note="Optional • You choose what happens next • No action is shared without your consent",
                action_type="workload_deferral"
            )
        ]
        encouragement = "Your schedule has a healthy cadence. Protecting rest keeps this sustainable."

    return SupportRecommendationsResponse(
        recommendations=items,
        encouragement_note=encouragement
    )

@router.post("/actions", response_model=SupportActionResponse)
def log_support_action(
    action_in: SupportActionCreate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    action_obj = SupportAction(
        user_id=current_user.id,
        action_type=action_in.action_type,
        details_json=json.dumps(action_in.details or {}),
        completed=True,
        created_at=datetime.utcnow()
    )
    db.add(action_obj)
    db.commit()

    messages = {
        "breathing_reset": "Breathing reset completed. We hope this gentle pause created a little breathing room.",
        "workload_deferral": "Evening plan updated. Protecting your time tonight helps restore tomorrow's focus.",
        "anonymous_peer_support": "Anonymous connection request registered. A verified peer mentor will be available in the confidential queue.",
        "confidential_counselling": "Confidential enquiry created. Campus wellbeing advisors will reach out via your designated secure channel."
    }

    return SupportActionResponse(
        id=action_obj.id,
        action_type=action_obj.action_type,
        completed=True,
        confirmation_message=messages.get(action_obj.action_type, "Action recorded privately.")
    )

@router.get("/lighter-evening", response_model=LighterEveningResponse)
def get_lighter_evening_plan(current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    if user_id not in EVENING_TASKS:
        EVENING_TASKS[user_id] = get_default_tasks()
        
    tasks_raw = EVENING_TASKS[user_id]
    total_minutes = sum(t["estimated_minutes"] for t in tasks_raw)
    active_minutes = sum(t["estimated_minutes"] for t in tasks_raw if not t["deferred"])
    deferred_minutes = total_minutes - active_minutes

    tasks = [LighterEveningTask(**t) for t in tasks_raw]
    
    if deferred_minutes > 0:
        msg = f"You successfully deferred {deferred_minutes} minutes of non-urgent work. This leaves a focused {round(active_minutes/60, 1)} hrs tonight."
    else:
        msg = "You currently have 4 planned tasks totaling 4.0 hours tonight. Consider moving one non-urgent task to 'Later this week'."

    return LighterEveningResponse(
        tasks=tasks,
        initial_workload_hours=round(total_minutes / 60.0, 1),
        current_workload_hours=round(active_minutes / 60.0, 1),
        relief_hours=round(deferred_minutes / 60.0, 1),
        feedback_message=msg
    )

@router.post("/lighter-evening/defer", response_model=LighterEveningResponse)
def defer_task(
    defer_in: DeferTaskRequest,
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    if user_id not in EVENING_TASKS:
        EVENING_TASKS[user_id] = get_default_tasks()
        
    found = False
    for t in EVENING_TASKS[user_id]:
        if t["id"] == defer_in.task_id:
            t["deferred"] = True
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Task not found in evening plan")

    tasks_raw = EVENING_TASKS[user_id]
    total_minutes = sum(t["estimated_minutes"] for t in tasks_raw)
    active_minutes = sum(t["estimated_minutes"] for t in tasks_raw if not t["deferred"])
    deferred_minutes = total_minutes - active_minutes

    tasks = [LighterEveningTask(**t) for t in tasks_raw]
    return LighterEveningResponse(
        tasks=tasks,
        initial_workload_hours=round(total_minutes / 60.0, 1),
        current_workload_hours=round(active_minutes / 60.0, 1),
        relief_hours=round(deferred_minutes / 60.0, 1),
        feedback_message=f"Well done. By moving this item to {defer_in.new_target_day}, you protected {deferred_minutes} minutes for recovery tonight."
    )

@router.post("/lighter-evening/reset", response_model=LighterEveningResponse)
def reset_evening_plan(current_user: User = Depends(get_current_user)):
    EVENING_TASKS[current_user.id] = get_default_tasks()
    return get_lighter_evening_plan(current_user)
