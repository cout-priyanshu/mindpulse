export type UserRole = 'student' | 'institution_admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  cohort?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  user_id: string;
  full_name: string;
  email: string;
}

export interface ConsentPreferences {
  id: string;
  user_id: string;
  track_academic_deadlines: boolean;
  track_study_routine: boolean;
  track_daily_checkins: boolean;
  allow_anonymous_cohort_aggregation: boolean;
  consent_granted_at: string;
  last_updated_at: string;
}

export type WellbeingState = 'balanced' | 'watchful' | 'needs_attention';

export interface TrendChartPoint {
  day: string;
  energy: number;
  consistency: number;
  lateNightHours: number;
  workload: number;
}

export interface WellbeingSummary {
  trend_state: WellbeingState;
  status_headline: string;
  status_explanation: string;
  contributing_factors: string[];
  coverage_note: string;
  today_next_step: string;
  seven_day_trend: TrendChartPoint[];
  active_scenario: 'balanced' | 'demanding';
}

export interface RhythmTimelineDay {
  date: string;
  day_label: string;
  deadline_event?: string;
  deadline_status?: 'on_time' | 'delayed' | 'missed' | 'deferred';
  study_consistency_pct: number;
  late_night_hours: number;
  energy_level?: number;
  workload_score?: number;
  trend_marker: 'steady' | 'shift' | 'recovering';
  gentle_note: string;
}

export interface RhythmTimeline {
  days: RhythmTimelineDay[];
  summary_insight: string;
}

export interface DailyCheckInPayload {
  energy_level: number;
  workload_score: number;
  support_helpful?: string;
  reflection_note?: string;
}

export interface DailyCheckInResponse {
  id: string;
  user_id: string;
  date: string;
  energy_level: number;
  workload_score: number;
  support_helpful: string;
  reflection_note?: string;
  micro_message?: string;
  created_at: string;
}

export interface SupportRecommendation {
  id: string;
  title: string;
  category: string;
  estimated_time: string;
  description: string;
  student_control_note: string;
  action_type: string;
}

export interface LighterEveningTask {
  id: string;
  title: string;
  course: string;
  estimated_minutes: number;
  is_urgent: boolean;
  deferred: boolean;
}

export interface LighterEveningPlan {
  tasks: LighterEveningTask[];
  initial_workload_hours: number;
  current_workload_hours: number;
  relief_hours: number;
  feedback_message: string;
}

export interface CohortTrendPoint {
  week_label: string;
  avg_workload_index: number;
  pressure_category: string;
}

export interface InstitutionInsights {
  is_safe_to_display: boolean;
  privacy_label: string;
  cohort_name: string;
  sample_size: number;
  minimum_threshold_required: number;
  pressure_headline: string;
  top_pressure_signal: string;
  suggested_institutional_response: string;
  weekly_trends: CohortTrendPoint[];
  disclaimer: string;
}
