import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { InstitutionInsights } from '../types';
import { ShieldCheckIcon, AlertCircleIcon, UsersIcon, LockIcon } from '../components/Icons';

export const InstitutionInsightsPage: React.FC = () => {
  const { user, role, login } = useAuth();
  const [insights, setInsights] = useState<InstitutionInsights | null>(null);
  const [simulateLowSample, setSimulateLowSample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getInstitutionInsights(simulateLowSample);
      setInsights(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Access restricted');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [simulateLowSample, role]);

  const handleAdminQuickLogin = async () => {
    await login('admin@mindpulse.demo', 'PulseAdmin2026!');
  };

  if (role !== 'institution_admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto">
          <LockIcon className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Administrator Access Required</h3>
        <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed max-w-md mx-auto">
          This portal provides aggregated, anonymised cohort-level patterns for curriculum planners and academic deans. Individual student accounts cannot access institutional aggregates.
        </p>
        <button
          onClick={handleAdminQuickLogin}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-lg shadow-purple-600/30"
        >
          Switch to Institution Admin (Dean Eleanor Vance)
        </button>
      </div>
    );
  }

  if (loading || !insights) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-indigo-300">Loading anonymised cohort intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-500/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs">
            <UsersIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Faculty & Academic Leadership Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cohort Wellbeing & Workload Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80">
            Responsible institutional analytics designed for structural course pacing—not student surveillance.
          </p>
        </div>

        {/* Privacy threshold testing toggle */}
        <div className="flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/20 px-3 py-2 rounded-xl text-xs">
          <span className="text-[11px] text-indigo-300">Simulate small cohort (&lt;10):</span>
          <button
            onClick={() => setSimulateLowSample(!simulateLowSample)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              simulateLowSample ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-indigo-300'
            }`}
          >
            {simulateLowSample ? "Active (Sample: 5)" : "Normal (Sample: 48)"}
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Badge */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 text-xs text-purple-200">
          <ShieldCheckIcon className="w-5 h-5 text-purple-400 shrink-0" />
          <span>
            <strong className="text-white">{insights.privacy_label}</strong> Minimum cohort threshold: {insights.minimum_threshold_required} students.
          </span>
        </div>
        <span className="text-[11px] text-purple-300/70 font-mono">
          Current Cohort Sample: {insights.sample_size} students
        </span>
      </div>

      {!insights.is_safe_to_display ? (
        /* Low Sample Size Safe Fallback */
        <div className="p-10 rounded-2xl bg-slate-900 border border-amber-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircleIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">{insights.pressure_headline}</h3>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-lg mx-auto leading-relaxed">
            {insights.suggested_institutional_response}
          </p>
          <div className="pt-2 text-[11px] text-indigo-400/80">
            Privacy rule enforcement protects student anonymity in smaller departments and discussion sections.
          </div>
        </div>
      ) : (
        /* Full Cohort Insights Display */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pressure Headline Card */}
            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Cohort Pattern</span>
              <h4 className="text-base font-bold text-white">{insights.pressure_headline}</h4>
              <p className="text-xs text-indigo-300/70">
                Department of Computer Engineering • Second-Year Engineering Core
              </p>
            </div>

            {/* Pressure Signal */}
            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Top Structural Pressure Signal</span>
              <h4 className="text-base font-bold text-teal-300">{insights.top_pressure_signal}</h4>
              <p className="text-xs text-indigo-300/70">
                Multiple major midterms and lab deliverables coincided within a 48-hour window.
              </p>
            </div>

            {/* Institutional Recommendation */}
            <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Suggested Faculty Response</span>
              <p className="text-xs text-white font-medium leading-relaxed">
                {insights.suggested_institutional_response}
              </p>
            </div>
          </div>

          {/* Weekly Aggregate Workload Trend Chart */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Aggregated Workload Index by Week</h4>
                <p className="text-xs text-indigo-300/70">Anonymous average reported pace (1=Light to 5=Heavy)</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">Semester Trend</span>
            </div>

            {/* Visual Bar chart for cohorts */}
            <div className="grid grid-cols-5 gap-4 pt-6 items-end h-48 border-b border-indigo-500/20 pb-4">
              {insights.weekly_trends.map((item, idx) => {
                const heightPct = Math.round((item.avg_workload_index / 5.0) * 100);
                const isCurrent = idx === insights.weekly_trends.length - 1;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-mono font-bold text-white">
                      {item.avg_workload_index.toFixed(1)}
                    </span>
                    <div className="w-full max-w-[50px] bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-32">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-700 ${
                          isCurrent
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                            : 'bg-gradient-to-t from-indigo-600 to-purple-500'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] text-center ${isCurrent ? 'font-bold text-amber-300' : 'text-indigo-300/70'}`}>
                      {item.week_label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer footer */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/10 text-center">
            <p className="text-[11px] text-indigo-300/70 italic">
              {insights.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
