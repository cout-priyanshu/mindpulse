import sys
import os
from contextlib import asynccontextmanager

# 1. Ensure backend and project root are strictly in sys.path
current_file_dir = os.path.dirname(os.path.abspath(__file__))  # .../backend/app
backend_dir = os.path.abspath(os.path.join(current_file_dir, ".."))  # .../backend
root_dir = os.path.abspath(os.path.join(backend_dir, ".."))          # .../

for path_entry in [backend_dir, root_dir, current_file_dir]:
    if path_entry not in sys.path:
        sys.path.insert(0, path_entry)

# 2. Imports with safety fallback
try:
    from app.seed import seed_database
    from app.config import settings
    from app.routers import auth, users, consent, checkins, academic_events, wellbeing, support, institution, demo
except ImportError:
    from seed import seed_database
    from config import settings
    from routers import auth, users, consent, checkins, academic_events, wellbeing, support, institution, demo

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse


# 3. Lifespan handler (Ensures database initializes on cold start)
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        seed_database()
        print("Database initialized and seeded successfully.")
    except Exception as e:
        print("Database seeding error:", e)
    yield


# 4. FastAPI Application Setup
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Privacy-First Wellbeing Intelligence Platform for Engineering Students (Non-Diagnostic)",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Startup event kept as backup for older FastAPI runtimes
@app.on_event("startup")
def startup_event():
    try:
        seed_database()
    except Exception as e:
        pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [
    auth.router,
    users.router,
    consent.router,
    checkins.router,
    academic_events.router,
    wellbeing.router,
    support.router,
    institution.router,
    demo.router
]

for r in routers:
    app.include_router(r)
    app.include_router(r, prefix="/api")

# Static files resolution (Checks both local and root deployments)
static_dir = os.path.abspath(os.path.join(root_dir, "static"))
if not os.path.exists(static_dir):
    static_dir = os.path.abspath(os.path.join(current_file_dir, "..", "..", "static"))

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def serve_index():
    index_path = os.path.join(static_dir, "index.html") if os.path.exists(static_dir) else None
    if index_path and os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse(
        content={
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "online",
            "documentation": "/docs",
            "notice": "MindPulse is a non-diagnostic wellbeing platform."
        }
    )


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "MindPulse API"}