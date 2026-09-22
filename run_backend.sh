#!/bin/bash
source venv/bin/activate
export PYTHONPATH=backend
uvicorn app.main:app --reload