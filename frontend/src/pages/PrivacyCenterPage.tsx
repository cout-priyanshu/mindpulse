import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ConsentPreferences } from '../types';
import { ShieldCheckIcon, LockIcon, TrashIcon, DownloadIcon, CheckCircleIcon } from '../components/Icons';
import { PrivacyFlowDiagram } from '../components/PrivacyFlowDiagram';

export const PrivacyCenterPage: React.FC = () => {
  const { showToast, logout } = useAuth();
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchConsent = async () => {
    try {
      const res = await api.getConsent();
      setConsent(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConsent();
  }, []);

  const handleToggle = async (key: keyof ConsentPreferences) => {
    if (!consent) return;
    const newVal = !consent[key];
    try {
      const updated = await api.updateConsent({ [key]: newVal });
      setConsent(updated);
      showToast(`Privacy preference updated: ${key} is now ${newVal ? 'Active' : 'Disabled'}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteData = async () => {
    setLoading(true);
    try {
      await api.deleteUserData();
      setIsDeleteModalOpen(false);
      showToast("All personal wellbeing check-ins, routine markers, and actions permanently purged.");
      logout();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await api.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindpulse-wellbeing-summary-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Wellbeing summary JSON downloaded successfully");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-indigo-500/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-teal-400" />
          <span>Radical Privacy Sovereignty</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Your Data, Your Control
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl leading-relaxed">
          MindPulse is engineered from the ground up as a private sanctuary. You maintain complete ownership of every marker collected.
        </p>
      </div>

      {/* Mandatory Privacy Policy Assertion */}
      <div className="p-4 rounded-xl bg-indigo-950/70 border border-teal-500/30 flex items-start gap-3">
        <LockIcon className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Non-Negotiable Guarantee</h4>
          <p className="text-xs sm:text-sm font-semibold text-teal-200">
            “MindPulse does not provide individual wellbeing data to your institution.”
          </p>
          <p className="text-[11px] text-indigo-300/70">
            Faculty, academic committees, and campus administrators only receive anonymised, cohort-level aggregates when at least 10 consenting students exist.
          </p>
        </div>
      </div>

      {/* Active Data Categories */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Active Observation Categories</h3>

        <div className="space-y-3">
          {/* Category 1 */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">Assignment & Deadline Patterns</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300">Course APIs</span>
              </div>
              <p className="text-xs text-indigo-300/70">
                Observes upcoming submission deadlines to detect workload clusters before deadlines pass.
              </p>
              <span className="text-[10px] text-indigo-400/60 block">Consent active since August 2026</span>
            </div>
            <button
              onClick={() => handleToggle('track_academic_deadlines')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                consent?.track_academic_deadlines ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>

          {/* Category 2 */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">Study-Routine Consistency</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300">Activity Timestamps</span>
              </div>
              <p className="text-xs text-indigo-300/70">
                Observes late-night study activity past midnight compared against your typical baseline.
              </p>
              <span className="text-[10px] text-indigo-400/60 block">Consent active since August 2026</span>
            </div>
            <button
              onClick={() => handleToggle('track_study_routine')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                consent?.track_study_routine ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>

          {/* Category 3 */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">Daily Energy & Workload Check-ins</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300">Self-Reported</span>
              </div>
              <p className="text-xs text-indigo-300/70">
                Captures daily 1-5 energy levels and workload perceptions to calibrate personal trend baselines.
              </p>
              <span className="text-[10px] text-indigo-400/60 block">Consent active since August 2026</span>
            </div>
            <button
              onClick={() => handleToggle('track_daily_checkins')}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                consent?.track_daily_checkins ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Architecture Flow */}
      <PrivacyFlowDiagram />

      {/* Data Export & Deletion Sovereignty */}
      <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/30 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Data Sovereignty Actions</h4>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-500/30 text-indigo-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-4 h-4 text-indigo-300" />
            <span>Download personal wellbeing summary (JSON)</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <TrashIcon className="w-4 h-4 text-rose-400" />
            <span>Delete personal data</span>
          </button>
        </div>
        <p className="text-[11px] text-indigo-300/60">
          Data retention: Personal check-ins and routine markers are stored for 90 days then automatically purged.
        </p>
      </div>

      {/* Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Permanently Delete Personal Data?</h3>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              This will irreversibly purge all personal check-in logs, timeline markers, and support interactions from MindPulse servers.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-indigo-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
              >
                {loading ? "Deleting..." : "Yes, Purge My Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
