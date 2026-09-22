from fastapi import APIRouter, Depends
from app.schemas.schemas import DemoScenarioRequest, DemoScenarioResponse
from app.services.wellbeing_engine import set_current_scenario, get_current_scenario
from app.models.models import User
from app.core.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/demo", tags=["Demo Mode Controller"])

@router.post("/scenario", response_model=DemoScenarioResponse)
def switch_demo_scenario(
    req: DemoScenarioRequest,
    current_user: User = Depends(get_current_user)
):
    valid = ["balanced", "demanding"]
    target = req.scenario.lower().strip()
    if target not in valid:
        target = "demanding"
        
    set_current_scenario(current_user.id, target)
    
    msg = (
        "Scenario updated to Balanced Week: stable routine, normal energy, manageable workload."
        if target == "balanced"
        else "Scenario updated to Demanding Week: Aarav's pressure pattern, late-night activity, missed deadlines, low energy."
    )
    return DemoScenarioResponse(
        success=True,
        active_scenario=target,
        message=msg
    )

@router.get("/status")
def get_demo_status(current_user: User = Depends(get_current_user)):
    scenario = get_current_scenario(current_user.id)
    return {
        "active_scenario": scenario,
        "student_demo_account": settings.DEMO_STUDENT_EMAIL,
        "admin_demo_account": settings.DEMO_ADMIN_EMAIL
    }
