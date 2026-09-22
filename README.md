# MindPulse

> **“Understand your rhythm. Protect your balance.”**  
> *A privacy-first wellbeing intelligence platform for engineering students.*

---

## 1. Ethical & Safety Mandate (Non-Diagnostic)

MindPulse is **strictly not a medical diagnosis product**. It never diagnoses depression, anxiety, burnout, or any clinical psychiatric condition.

- **Respectful, Non-Judgmental Language**: Replaces clinical risk labels with respectful, routine-centered terminology such as *“wellbeing trend”*, *“support signal”*, *“routine change”*, and *“you may benefit from a small reset”*.
- **No Fear, Shame, or Faculty Surveillance**: The platform is student-controlled. Raw personal wellbeing records, individual timestamps, check-in reflections, and personal trend status are **never visible to faculty, peers, or administrators**.
- **Transparent Reasoning**: The student is never presented with opaque numerical “risk scores”; instead, an explainable *“Why am I seeing this?”* panel breaks down concrete contributing factors (e.g. deadline delays, late-night study shifts).

---

## 2. Project Architecture

```
mindpulse/
├── backend_app/               # FastAPI Python Backend
│   ├── app/
│   │   ├── core/              # JWT auth, PBKDF2 password hashing, RBAC dependencies
│   │   ├── db/                # SQLite/SQLAlchemy engine, sessionmaker, schema creation
│   │   ├── models/            # User, ConsentPreference, DailyCheckIn, AcademicEvent, etc.
│   │   ├── schemas/           # Pydantic request/response validation schemas
│   │   ├── services/          # Explainable rule-based wellbeing engine
│   │   ├── routers/           # /auth, /users, /consent, /checkins, /academic-events,
│   │   │                      # /wellbeing, /support, /institution, /demo
│   │   ├── config.py          # App settings, DB URL, privacy thresholds
│   │   ├── main.py            # FastAPI app initialization, CORS, static mount
│   │   └── seed.py            # Seed script with Aarav Sharma & Admin demo records
│   └── tests/
│       └── test_api.py        # Automated test suite (9 test cases, 100% passing)
├── frontend/                  # React with TypeScript Source Code
│   ├── src/
│   │   ├── components/        # Navbar, SafetyBanner, Waveform, StatusBadge, WhyCard,
│   │   │                      # RhythmTimeline, TrendChart, BreathingModal, EveningPlanner,
│   │   │                      # PrivacyFlowDiagram, Icons
│   │   ├── context/           # AuthContext (JWT, active scenario, page navigation)
│   │   ├── pages/             # Landing, Onboarding, Dashboard, CheckIn, Support, Privacy,
│   │   │                      # Institution, Login
│   │   ├── services/          # Typed API client wrapper
│   │   ├── types/             # TypeScript data contracts & interfaces
│   │   ├── App.tsx            # Root application layout & routing
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Midnight indigo styling & animations
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── static/                    # Compiled, self-contained frontend distribution
│   └── index.html             # Served directly at http://localhost:8000/
├── run_backend.sh             # Launch FastAPI backend with uvicorn
├── run_tests.sh               # Run automated backend test suite
└── README.md
```

---


## 3. Demo Accounts & Credentials

| Role | Name | Email | Password | Access Scope |
|---|---|---|---|---|
| **Student** | Aarav Sharma | `aarav@mindpulse.demo` | `AaravPulse2026!` | Private personal dashboard, daily check-in, lighter evening planner, breathing timer, privacy center. |
| **Institution Admin** | Dean Eleanor Vance | `admin@mindpulse.demo` | `PulseAdmin2026!` | Anonymized cohort-level trends (k ≥ 10 threshold). Zero individual student records. |

*Quick login buttons for both accounts are directly available on the Sign In page.*

---

## 4. Explainable Wellbeing Engine & Demo Scenarios

MindPulse includes an instantaneous **Demo Mode** switch in the top navigation bar:

1. **Balanced Week**:
   - Status: `Balanced` (Muted teal badge)
   - Headline: *“Your rhythm is steady”*
   - Signals: 0 missed deadlines, consistent sleep/study baseline (< 1 hr past midnight), stable energy ratings (3–5).
   - Small Step: *“Maintain your regular wind-down routine tonight.”*

2. **Demanding Week (Aarav Sharma's Scenario)**:
   - Status: `Needs attention` (Restrained warm amber badge, never alarming red)
   - Headline: *“Your routine has shifted recently”*
   - Signals: Two delayed academic assignments (OS Milestone 2 & Networks Quiz), sustained late-night study past midnight (averaging 2.8 hrs), and energy drop for 3 consecutive days.
   - Small Step: *“Choose one task to defer and protect 30 minutes for recovery.”*
   - Support Options: 2-minute box breathing reset, "Build a lighter evening" workload deferral planner, anonymous peer support, and confidential campus counselling.

---

## 5. Institution Insights & Privacy Thresholds

- **Role-Based Access Control**: Student accounts receive a `403 Forbidden` if attempting to query `/api/institution/*`.
- **k-Anonymity Threshold**: The institution dashboard enforces a minimum sample size (`MIN_ANONYMOUS_COHORT_SIZE = 10`).
- **Low Sample Fallback**: If sample size is under the threshold (testable via the *"Simulate low sample (&lt;10)"* toggle), the system safely suppresses all aggregate statistics and displays:  
  *“Not enough anonymous data to display a cohort trend safely.”*

---

## 6. 90-Second Hackathon Pitch Demo Script

**Target Time: 90 Seconds**  
**Presenter Flow:**

1. **Hook & Problem (0:00 – 0:15)**
   > *“Engineering school moves fast. Before students realize they’re overwhelmed, they’ve already missed deadlines and spent four nights working past 2 AM. Most tools either wait for a crisis or create invasive surveillance that students distrust. Meet MindPulse: a privacy-first wellbeing intelligence platform that helps students notice routine disruption early and take gentle, student-controlled action.”*

2. **The Cinematic Landing & Consent (0:15 – 0:30)**
   > *“Everything begins with consent. Notice our motto: ‘Understand your rhythm. Protect your balance.’ When Aarav signs up, he controls every signal—deadlines, study rhythm, and daily check-ins. Crucially, his personal data stays in his encrypted student vault. Faculty never see his individual records.”*

3. **Aarav's Demanding Week & Transparent Trend (0:30 – 0:50)**
   > *“Let’s look at Aarav’s dashboard during a demanding week. MindPulse does NOT give him a scary clinical diagnosis or a raw risk percentage. Instead, it displays a gentle, respectful status: ‘Your routine has shifted recently.’  
   When Aarav clicks ‘Why am I seeing this?’, the logic is completely transparent: two assignments were delayed, late-night hours spiked past midnight, and his self-reported energy dropped for three days. MindPulse suggests one small step: deferring one task to protect 30 minutes tonight.”*

4. **Interactive Support & Evening Planner (0:50 – 1:10)**
   > *“In Aarav’s Personal Support Plan, he has immediate, low-pressure tools. He can launch a 2-minute box breathing reset with our guided animated timer. Or he can use ‘Build a Lighter Evening’—watch as he defers one non-urgent reading assignment to Friday. His evening workload instantly drops from 4.0 hours to 3.0 hours, protecting an hour of restorative rest.”*

5. **Instant Demo Toggle & Institutional Privacy (1:10 – 1:30)**
   > *“Notice what happens when I switch to the ‘Balanced Week’ demo mode: the entire system updates instantly. The trend transitions to ‘Balanced: Your rhythm is steady’, reflecting normal energy and on-time milestones.  
   Finally, let’s switch to Dean Eleanor Vance’s view. The institution dashboard receives aggregated, anonymized cohort patterns only. If a cohort has fewer than 10 students, our privacy threshold suppresses the data entirely to protect student anonymity.  
   MindPulse turns academic pressure into actionable, student-led balance—without fear, shame, or surveillance. Thank you!”*
