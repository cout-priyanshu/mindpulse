from fastapi import APIRouter, Depends, HTTPException, status
from app.db.database import get_db
from app.models.models import User, ConsentPreference
from app.schemas.schemas import UserLogin, UserCreate, Token, UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db=Depends(get_db)):
    existing = db.query(User).filter_by(email=user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    new_user = User(
        email=user_in.email.lower().strip(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        cohort=user_in.cohort or "Engineering - Year 2"
    )
    db.add(new_user)
    db.commit()
    
    # Initialize default consent preferences for students
    consent = ConsentPreference(
        user_id=new_user.id,
        track_academic_deadlines=True,
        track_study_routine=True,
        track_daily_checkins=True,
        allow_anonymous_cohort_aggregation=True
    )
    db.add(consent)
    db.commit()
    
    access_token = create_access_token(data={"sub": new_user.id, "role": new_user.role})
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=new_user.role,
        user_id=new_user.id,
        full_name=new_user.full_name,
        email=new_user.email
    )

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db=Depends(get_db)):
    user = db.query(User).filter_by(email=user_in.email.lower().strip()).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
