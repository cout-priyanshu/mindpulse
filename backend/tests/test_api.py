import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.seed import seed_database

class MindPulseAPITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_database()
        cls.client = TestClient(app)

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_student_login(self):
        payload = {
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        }
        res = self.client.post("/auth/login", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["role"], "student")
        self.assertEqual(data["email"], settings.DEMO_STUDENT_EMAIL)

    def test_admin_login(self):
        payload = {
            "email": settings.DEMO_ADMIN_EMAIL,
            "password": settings.DEMO_ADMIN_PASSWORD
        }
        res = self.client.post("/auth/login", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["role"], "institution_admin")

    def test_consent_get_and_update(self):
        login_res = self.client.post("/auth/login", json={
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # GET consent
        res = self.client.get("/consent", headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["track_academic_deadlines"])

        # PUT consent update
        update_payload = {"track_academic_deadlines": False}
        res_update = self.client.put("/consent", json=update_payload, headers=headers)
        self.assertEqual(res_update.status_code, 200)
        self.assertFalse(res_update.json()["track_academic_deadlines"])

        # Re-enable
        self.client.put("/consent", json={"track_academic_deadlines": True}, headers=headers)

    def test_wellbeing_summary_and_scenario_switch(self):
        login_res = self.client.post("/auth/login", json={
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Switch to Demanding Week
        demo_res = self.client.post("/demo/scenario", json={"scenario": "demanding"}, headers=headers)
        self.assertEqual(demo_res.status_code, 200)
        self.assertEqual(demo_res.json()["active_scenario"], "demanding")

        # Check wellbeing summary
        wb_res = self.client.get("/wellbeing/summary", headers=headers)
        self.assertEqual(wb_res.status_code, 200)
        wb_data = wb_res.json()
        self.assertEqual(wb_data["trend_state"], "needs_attention")
        self.assertIn("routine has shifted", wb_data["status_headline"].lower())
        self.assertTrue(any("delayed" in factor.lower() for factor in wb_data["contributing_factors"]))

        # Check timeline
        tl_res = self.client.get("/wellbeing/timeline", headers=headers)
        self.assertEqual(tl_res.status_code, 200)
        tl_data = tl_res.json()
        self.assertEqual(len(tl_data["days"]), 7)

        # 2. Switch to Balanced Week
        demo_res2 = self.client.post("/demo/scenario", json={"scenario": "balanced"}, headers=headers)
        self.assertEqual(demo_res2.status_code, 200)
        self.assertEqual(demo_res2.json()["active_scenario"], "balanced")

        # Check updated wellbeing summary
        wb_res2 = self.client.get("/wellbeing/summary", headers=headers)
        self.assertEqual(wb_res2.status_code, 200)
        wb_data2 = wb_res2.json()
        self.assertEqual(wb_data2["trend_state"], "balanced")
        self.assertIn("rhythm is steady", wb_data2["status_headline"].lower())

    def test_daily_checkin(self):
        login_res = self.client.post("/auth/login", json={
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        payload = {
            "energy_level": 2,
            "workload_score": 4,
            "support_helpful": "yes",
            "reflection_note": "A lot of deadlines clustering this week."
        }
        res = self.client.post("/checkins", json=payload, headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["energy_level"], 2)
        self.assertIsNotNone(data["micro_message"])
        self.assertIn("lighter plan", data["micro_message"].lower())

    def test_lighter_evening_deferral(self):
        login_res = self.client.post("/auth/login", json={
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get initial plan
        res = self.client.get("/support/lighter-evening", headers=headers)
        self.assertEqual(res.status_code, 200)
        initial_tasks = res.json()["tasks"]
        self.assertTrue(len(initial_tasks) > 0)

        # Defer task-2 (Operating Systems Reading, non-urgent)
        defer_res = self.client.post("/support/lighter-evening/defer", json={"task_id": "task-2", "new_target_day": "Friday"}, headers=headers)
        self.assertEqual(defer_res.status_code, 200)
        defer_data = defer_res.json()
        self.assertGreater(defer_data["relief_hours"], 0)

    def test_institution_rbac_and_privacy_threshold(self):
        # 1. Student attempts to access institution endpoint -> must be 403 Forbidden
        student_login = self.client.post("/auth/login", json={
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        })
        student_token = student_login.json()["access_token"]
        res_forbidden = self.client.get("/institution/insights", headers={"Authorization": f"Bearer {student_token}"})
        self.assertEqual(res_forbidden.status_code, 403)

        # 2. Admin accesses institution endpoint -> Success with aggregate data
        admin_login = self.client.post("/auth/login", json={
            "email": settings.DEMO_ADMIN_EMAIL,
            "password": settings.DEMO_ADMIN_PASSWORD
        })
        admin_token = admin_login.json()["access_token"]
        res_admin = self.client.get("/institution/insights", headers={"Authorization": f"Bearer {admin_token}"})
        self.assertEqual(res_admin.status_code, 200)
        data = res_admin.json()
        self.assertTrue(data["is_safe_to_display"])
        self.assertIn("Clustered deadlines", data["top_pressure_signal"])
        self.assertEqual(data["sample_size"], 48)

        # 3. Privacy threshold test: low sample size simulation
        res_low_sample = self.client.get("/institution/insights?simulate_low_sample=true", headers={"Authorization": f"Bearer {admin_token}"})
        self.assertEqual(res_low_sample.status_code, 200)
        low_data = res_low_sample.json()
        self.assertFalse(low_data["is_safe_to_display"])
        self.assertIn("Not enough anonymous data", low_data["pressure_headline"])

    def test_data_export(self):
        login_res = self.client.post("/auth/login", json={
            "email": settings.DEMO_STUDENT_EMAIL,
            "password": settings.DEMO_STUDENT_PASSWORD
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        res = self.client.get("/users/me/export", headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("export_metadata", data)
        self.assertIn("checkins_history", data)
        self.assertEqual(data["export_metadata"]["student_name"], "Aarav Sharma")

if __name__ == "__main__":
    unittest.main()
