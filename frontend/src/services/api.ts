import {
  AuthResponse,
  ConsentPreferences,
  DailyCheckInPayload,
  DailyCheckInResponse,
  InstitutionInsights,
  LighterEveningPlan,
  RhythmTimeline,
  SupportRecommendation,
  User,
  WellbeingSummary
} from '../types';

const API_BASE = (typeof window !== 'undefined' && window.location.origin)
  ? window.location.origin
  : 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mindpulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Authentication failed');
    }
    const data: AuthResponse = await res.json();
    localStorage.setItem('mindpulse_token', data.access_token);
    localStorage.setItem('mindpulse_user', JSON.stringify(data));
    return data;
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to retrieve user profile');
    return res.json();
  },

  logout() {
    localStorage.removeItem('mindpulse_token');
    localStorage.removeItem('mindpulse_user');
  },

  // Consent
  async getConsent(): Promise<ConsentPreferences> {
    const res = await fetch(`${API_BASE}/api/consent`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load consent preferences');
    return res.json();
  },

  async updateConsent(updates: Partial<ConsentPreferences>): Promise<ConsentPreferences> {
    const res = await fetch(`${API_BASE}/api/consent`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update consent preferences');
    return res.json();
  },

  // Wellbeing
  async getWellbeingSummary(): Promise<WellbeingSummary> {
    const res = await fetch(`${API_BASE}/api/wellbeing/summary`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load wellbeing summary');
    return res.json();
  },

  async getRhythmTimeline(): Promise<RhythmTimeline> {
    const res = await fetch(`${API_BASE}/api/wellbeing/timeline`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load rhythm timeline');
    return res.json();
  },

  // Daily Check-in
  async submitCheckIn(payload: DailyCheckInPayload): Promise<DailyCheckInResponse> {
    const res = await fetch(`${API_BASE}/api/checkins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Check-in submission failed' }));
      throw new Error(err.detail || 'Failed to submit check-in');
    }
    return res.json();
  },

  async getCheckInHistory(): Promise<DailyCheckInResponse[]> {
    const res = await fetch(`${API_BASE}/api/checkins/history`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load check-in history');
    return res.json();
  },

  // Support
  async getSupportRecommendations(): Promise<{ recommendations: SupportRecommendation[]; encouragement_note: string }> {
    const res = await fetch(`${API_BASE}/api/support/recommendations`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load support recommendations');
    return res.json();
  },

  async logSupportAction(action_type: string, details: Record<string, any> = {}): Promise<any> {
    const res = await fetch(`${API_BASE}/api/support/actions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action_type, details })
    });
    if (!res.ok) throw new Error('Failed to record support action');
    return res.json();
  },

  async getLighterEveningPlan(): Promise<LighterEveningPlan> {
    const res = await fetch(`${API_BASE}/api/support/lighter-evening`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load lighter evening plan');
    return res.json();
  },

  async deferTask(task_id: string, new_target_day = 'Later this week'): Promise<LighterEveningPlan> {
    const res = await fetch(`${API_BASE}/api/support/lighter-evening/defer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ task_id, new_target_day })
    });
    if (!res.ok) throw new Error('Failed to defer task');
    return res.json();
  },

  async resetEveningPlan(): Promise<LighterEveningPlan> {
    const res = await fetch(`${API_BASE}/api/support/lighter-evening/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset evening plan');
    return res.json();
  },

  // Privacy Center
  async deleteUserData(): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/api/users/me/data`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete personal data');
    return res.json();
  },

  async exportUserData(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/users/me/export`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to export personal data');
    return res.json();
  },

  // Institution Admin Insights
  async getInstitutionInsights(simulateLowSample = false): Promise<InstitutionInsights> {
    const res = await fetch(`${API_BASE}/api/institution/insights?simulate_low_sample=${simulateLowSample}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Access restricted: Institution administrator privileges required.');
      }
      throw new Error('Failed to load institution insights');
    }
    return res.json();
  },

  // Demo Switcher
  async switchScenario(scenario: 'balanced' | 'demanding'): Promise<any> {
    const res = await fetch(`${API_BASE}/api/demo/scenario`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ scenario })
    });
    if (!res.ok) throw new Error('Failed to switch demo scenario');
    return res.json();
  }
};
