import sys
import os

# Ensure backend and root paths are in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
root_dir = os.path.abspath(os.path.join(backend_dir, ".."))

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app.seed import seed_database
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.routers import auth, users, consent, checkins, academic_events, wellbeing, support, institution, demo

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Privacy-First Wellbeing Intelligence Platform for Engineering Students (Non-Diagnostic)",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
def startup_event():
    try:
        seed_database()
        print("Database initialized and seeded successfully.")
    except Exception as e:
        print("Database seeding error:", e)

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

static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "static"))
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "notice": "MindPulse is a non-diagnostic wellbeing platform."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "MindPulse API"}
