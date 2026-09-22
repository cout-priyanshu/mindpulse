import os

class Settings:
    PROJECT_NAME: str = "MindPulse Wellbeing Intelligence"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mindpulse-production-super-secret-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database Configuration: Clean environment-based config, supports PostgreSQL in prod and SQLite locally
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/mindpulse.db")
    
    # Institution Privacy Threshold
    MIN_ANONYMOUS_COHORT_SIZE: int = 10
    
    # Demo credentials
    DEMO_STUDENT_EMAIL: str = "aarav@mindpulse.demo"
    DEMO_STUDENT_PASSWORD: str = "AaravPulse2026!"
    DEMO_ADMIN_EMAIL: str = "admin@mindpulse.demo"
    DEMO_ADMIN_PASSWORD: str = "PulseAdmin2026!"

settings = Settings()
