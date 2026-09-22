#!/bin/bash
export PYTHONPATH=backend_app
export DATABASE_URL=${DATABASE_URL:-"sqlite:////tmp/mindpulse.db"}
echo "Executing MindPulse automated test suite..."
python3 backend_app/tests/test_api.py
