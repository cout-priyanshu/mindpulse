import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PrivacyFlowDiagram } from '../components/PrivacyFlowDiagram';
import { ShieldCheckIcon, LockIcon, ArrowRightIcon } from '../components/Icons';

export const OnboardingConsentPage: React.FC = () => {
  const { setCurrentPage, login } = useAuth();
  const [deadlines, setDeadlines] = useState(true);
  const [routine, setRoutine] = useState(true);
  const [checkins, setCheckins] = useState(true);

  const handleContinue = async () => {
    // Authenticate Aarav or advance to student home
    await login('aarav@mindpulse.demo', 'AaravPulse2026!');
    setCurrentPage('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs">
          <ShieldCheckIcon className="w-4 h-4 text-teal-400" />
          <span>Consent-First Experience</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          You decide what MindPulse observes
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl mx-auto leading-relaxed">
          Before collecting or showing any personal pattern, configure your permissions below. You can change or revoke consent at any time.
        </p>
      </div>

      {/* Required Privacy Mandate Callout */}
      <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-400/30 text-center">
        <p className="text-xs sm:text-sm font-medium text-indigo-200">
          <strong className="text-white">“Your detailed wellbeing data belongs to you. It is never visible to faculty, peers, or administrators.”</strong>
        </p>
      </div>

      {/* Granular Permission Toggles */}
      <div className="grid grid-cols-1 gap-4">
        {/* Permission 1: Deadlines */}
        <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Assignment and Deadline Patterns</h4>
            <p className="text-xs text-indigo-200/80">
              <strong className="text-indigo-100">What is observed:</strong> Due dates and submission timestamps from your courses.
            </p>
            <p className="text-xs text-indigo-300/70">
              <strong className="text-indigo-200">Why it helps:</strong> Detects clustered deadlines before submission strain compounds.
            </p>
          </div>
          <button
            onClick={() => setDeadlines(!deadlines)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              deadlines ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
          </button>
        </div>

        {/* Permission 2: Routine */}
        <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Study-Routine Consistency</h4>
            <p className="text-xs text-indigo-200/80">
              <strong className="text-indigo-100">What is observed:</strong> Late-night activity past midnight compared against your typical rhythm.
            </p>
            <p className="text-xs text-indigo-300/70">
              <strong className="text-indigo-200">Why it helps:</strong> Surfaces irregular sleep-study cycles so you can choose when to rest.
            </p>
          </div>
          <button
            onClick={() => setRoutine(!routine)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              routine ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
          </button>
        </div>

        {/* Permission 3: Daily Check-in */}
        <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Optional Daily Mood and Energy Check-ins</h4>
            <p className="text-xs text-indigo-200/80">
              <strong className="text-indigo-100">What is observed:</strong> 15-second self-reported energy ratings and workload feelings.
            </p>
            <p className="text-xs text-indigo-300/70">
              <strong className="text-indigo-200">Why it helps:</strong> Gives you an objective picture of your energy reserves across the semester.
            </p>
          </div>
          <button
            onClick={() => setCheckins(!checkins)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              checkins ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
          </button>
        </div>
      </div>

      {/* Visual Privacy Flow Diagram */}
      <PrivacyFlowDiagram />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-indigo-500/10">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="text-xs text-indigo-300 hover:text-white transition-colors"
        >
          Skip for now
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleContinue}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>Continue with selected permissions</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-indigo-300/60">
        You can manage or revoke consent anytime inside your Privacy Center.
      </p>
    </div>
  );
};
