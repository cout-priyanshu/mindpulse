import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PulseIcon, ArrowRightIcon } from '../components/Icons';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useAuth();
  const [email, setEmail] = useState('aarav@mindpulse.demo');
  const [password, setPassword] = useState('AaravPulse2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail, demoPass);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border border-indigo-500/25 bg-slate-900/90 backdrop-blur-xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-400 p-[1px] mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-teal-400">
              <PulseIcon className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Sign In to MindPulse</h2>
          <p className="text-xs text-indigo-300/70">
            Secure, end-to-end encrypted student wellbeing sanctuary.
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block text-center">
            Hackathon One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@mindpulse.demo', 'AaravPulse2026!')}
              className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/60 hover:bg-indigo-900/60 text-left transition-all group"
            >
              <span className="text-xs font-bold text-white block">Student Demo</span>
              <span className="text-[10px] text-teal-300 block">Aarav Sharma</span>
              <span className="text-[9px] text-indigo-400 block font-mono mt-0.5">aarav@mindpulse.demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@mindpulse.demo', 'PulseAdmin2026!')}
              className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/40 text-left transition-all group"
            >
              <span className="text-xs font-bold text-white block">Admin Demo</span>
              <span className="text-[10px] text-purple-300 block">Dean Eleanor Vance</span>
              <span className="text-[9px] text-indigo-400 block font-mono mt-0.5">admin@mindpulse.demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-indigo-200 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-indigo-200 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Your Rhythm"}</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentPage('landing')}
            className="text-xs text-indigo-400 hover:text-white"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
