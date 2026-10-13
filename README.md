# MindPulse

<p align="center">
  <strong>“Understand your rhythm. Protect your balance.”</strong><br>
  <em>A privacy-first, non-diagnostic wellbeing intelligence platform for engineering students.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-0.92+-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Privacy-Differential_k≥10-indigo?style=flat-square" alt="Privacy" />
  <img src="https://img.shields.io/badge/Tests-9%2F9_Passing-brightgreen?style=flat-square" alt="Tests" />
</p>

---

## 1. Ethical & Clinical Safety Mandate

MindPulse is **strictly non-diagnostic**. It does not diagnose clinical conditions (such as depression, anxiety, or burnout) and is engineered to eliminate academic surveillance, fear, and stigma.

| Principle | Implementation |
|---|---|
| **Respectful Terminology** | Replaces clinical risk labels with actionable, neutral phrases: *“wellbeing trend”*, *“support signal”*, *“routine change”*, and *“you may benefit from a small reset”*. |
| **Zero Faculty Surveillance** | Raw personal wellbeing metrics, check-in reflections, and timestamps remain encrypted in the student's vault and are **never exposed to faculty or administrators**. |
| **Explainable Logic** | Replaces opaque numerical risk scores with transparent, observable indicators via an expandable *“Why am I seeing this?”* interface. |
| **Student Agency** | All supportive actions (task deferral, breathing exercises, peer mentorship) are strictly optional and require explicit student intent. |

---

## 2. Core Features

- **Dynamic Rhythm Visualisation**: 7-day multi-signal trajectory mapping daily energy, study consistency, and post-midnight activity.
- **Explainable Wellbeing Engine**: Rule-based detection evaluating clustered course deadlines, late-night baseline drift, and sustained energy dips.
- **Interactive Support & Workload Deferral**: *“Build a Lighter Evening”* planner allows students to defer non-critical tasks, immediately recalculating evening load to protect rest.
- **Guided 2-Minute Breathing Reset**: Built-in visual box-breathing timer (4s cycle) to downshift cognitive tension.
- **Privacy Center & Data Sovereignty**: Granular permission toggles, full JSON data export, and single-click permanent data erasure.
- **Institutional Cohort Analytics**: Provides academic deans with aggregate, anonymized cohort patterns ($k \ge 10$ threshold) to address systemic deadline clustering without compromising student identity.

---

## 3. Project Architecture

```text
mindpulse/
├── backend_app/               # FastAPI Backend
│   ├── app/
│   │   ├── core/              # JWT authentication, PBKDF2 hashing, RBAC guards
│   │   ├── db/                # Database engine, session provider, schema models
│   │   ├── models/            # SQLAlchemy/SQLite data models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Explainable rule-based wellbeing engine
│   │   ├── routers/           # API endpoints (/auth, /wellbeing, /support, etc.)
│   │   ├── config.py          # App settings and privacy thresholds
│   │   ├── main.py            # Application entry point, CORS, static mount
│   │   └── seed.py            # Seed data for demo accounts and scenarios
│   └── tests/
│       └── test_api.py        # Automated test suite (9 test cases)
├── frontend/                  # React + TypeScript Source
│   ├── src/
│   │   ├── components/        # Reusable UI (Waveform, TrendChart, EveningPlanner, etc.)
│   │   ├── context/           # Authentication and demo scenario state
│   │   ├── pages/             # Dashboard, Check-in, Support, Privacy, Institution views
│   │   ├── services/          # Typed API client
│   │   └── types/             # TypeScript data contracts
│   ├── package.json
│   └── tsconfig.json
├── static/                    # Self-contained production build (served via FastAPI)
│   └── index.html
├── run_backend.sh             # Linux/macOS backend launcher
├── run_tests.sh               # Test suite runner
└── README.md
