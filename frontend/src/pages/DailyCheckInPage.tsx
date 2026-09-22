import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowRightIcon, CheckCircleIcon, WindIcon } from '../components/Icons';

export const DailyCheckInPage: React.FC = () => {
  const { setCurrentPage } = useAuth();
  const [energy, setEnergy] = useState<number>(3);
  const [workload, setWorkload] = useState<number>(3);
  const [support, setSupport] = useState<string>("no");
  const [reflection, setReflection] = useState<string>("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.submitCheckIn({
        energy_level: energy,
        workload_score: workload,
        support_helpful: support,
        reflection_note: reflection
      });
      setSubmittedMessage(res.micro_message || "Thank you for checking in. A lighter plan today could make tomorrow feel easier.");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">15-Second Daily Check-in</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How is your day unfolding?</h2>
        <p className="text-xs text-indigo-300/70">
          Private to your account. No grades, no judgment, and no faculty notifications.
        </p>
      </div>

      {submittedMessage ? (
        <div className="p-8 rounded-2xl bg-indigo-950/60 border border-teal-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto">
            <CheckCircleIcon className="w-6 h-6 text-teal-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Check-in Saved</h3>
            <p className="text-sm text-indigo-200 max-w-md mx-auto leading-relaxed">
              “{submittedMessage}”
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-xs hover:opacity-90 transition-opacity"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('support')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-900/40 text-indigo-200 border border-indigo-500/20 text-xs font-medium hover:bg-indigo-900/70 transition-colors"
            >
              View Support Options
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
          {/* Question 1: Energy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">How is your energy today?</label>
              <span className="text-[11px] text-indigo-400 font-mono">1 to 5</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { val: 1, label: "Depleted" },
                { val: 2, label: "Low" },
                { val: 3, label: "Steady" },
                { val: 4, label: "Good" },
                { val: 5, label: "Replenished" }
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setEnergy(item.val)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    energy === item.val
                      ? 'bg-teal-500/20 border-teal-400 text-white shadow-md'
                      : 'bg-indigo-900/20 border-indigo-500/20 text-indigo-300 hover:border-indigo-400/40'
                  }`}
                >
                  <span className="text-base font-bold block mb-1">{item.val}</span>
                  <span className="text-[10px] block text-indigo-300/80">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Workload */}
          <div className="space-y-3 pt-4 border-t border-indigo-500/10">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">How manageable does your workload feel?</label>
              <span className="text-[11px] text-indigo-400 font-mono">Scale</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { val: 1, label: "Light" },
                { val: 2, label: "Comfortable" },
                { val: 3, label: "Manageable" },
                { val: 4, label: "Elevated" },
                { val: 5, label: "Heavy" }
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setWorkload(item.val)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    workload === item.val
                      ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                      : 'bg-indigo-900/20 border-indigo-500/20 text-indigo-300 hover:border-indigo-400/40'
                  }`}
                >
                  <span className="text-base font-bold block mb-1">{item.val}</span>
                  <span className="text-[10px] block text-indigo-300/80">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Would support feel useful? */}
          <div className="space-y-3 pt-4 border-t border-indigo-500/10">
            <label className="text-sm font-semibold text-white block">Would support feel useful today?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "no", label: "I'm good for now" },
                { key: "maybe", label: "Maybe later" },
                { key: "yes", label: "A reset would help" }
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setSupport(item.key)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    support === item.key
                      ? 'bg-indigo-600/30 border-indigo-400 text-white'
                      : 'bg-indigo-900/20 border-indigo-500/20 text-indigo-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Reflection Note */}
          <div className="space-y-2 pt-4 border-t border-indigo-500/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-indigo-200">Optional Private Note</label>
              <span className="text-[10px] text-indigo-400">Encrypted in your account</span>
            </div>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g., Two labs due Thursday; staying up past 2 AM to catch up..."
              rows={2}
              className="w-full rounded-xl bg-slate-950/60 border border-indigo-500/30 p-3 text-xs text-white placeholder-indigo-400/40 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className="text-xs text-indigo-400 hover:text-white"
            >
              Skip for today
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>{loading ? "Recording..." : "Save check-in"}</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
