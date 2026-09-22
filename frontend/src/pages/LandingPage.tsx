import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Waveform } from '../components/Waveform';
import { ShieldCheckIcon, ArrowRightIcon, PulseIcon, LockIcon, WindIcon } from '../components/Icons';
import { StatusBadge } from '../components/StatusBadge';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, login } = useAuth();

  const handleQuickDemo = async () => {
    await login('aarav@mindpulse.demo', 'AaravPulse2026!');
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-900/30 via-purple-900/20 to-teal-900/20 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs shadow-inner">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
          <span>Privacy-First Wellbeing Intelligence for Engineering Students</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Your wellbeing deserves attention <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-teal-300 bg-clip-text text-transparent">before it becomes overwhelming.</span>
        </h1>

        <p className="text-base sm:text-lg text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
          MindPulse helps students recognise routine changes, regain balance, and choose support on their own terms.
        </p>

        {/* Pulse waveform visual motif */}
        <div className="py-2">
          <Waveform className="w-full max-w-xl mx-auto h-16 opacity-80" />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentPage('onboarding')}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Start private check-in</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>

          <button
            onClick={handleQuickDemo}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-indigo-200 font-semibold text-sm hover:bg-indigo-900/40 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Aarav’s demo week</span>
          </button>

          <button
            onClick={() => setCurrentPage('privacy')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-indigo-300/80 hover:text-white text-sm font-medium transition-colors"
          >
            Explore how privacy works
          </button>
        </div>

        {/* Concise Trust Statement */}
        <div className="pt-6 border-t border-indigo-500/10 flex flex-wrap items-center justify-center gap-6 text-xs text-indigo-300/70">
          <div className="flex items-center gap-1.5">
            <LockIcon className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-medium">Private by default</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <PulseIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-white font-medium">Non-diagnostic</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white font-medium">Student controlled</span>
          </div>
        </div>
      </section>

      {/* Product Preview Card */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto pb-24">
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500/40" />
              <div className="w-3 h-3 rounded-full bg-purple-500/40" />
              <div className="w-3 h-3 rounded-full bg-teal-500/40" />
              <span className="text-xs font-mono text-indigo-300/60 ml-2">mindpulse.demo/preview</span>
            </div>
            <StatusBadge state="needs_attention" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Support Signal</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                “Your routine has shifted recently”
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                A few changes in deadlines, late-night study, and energy check-ins suggest that a small reset may help.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-indigo-300">
                <span className="px-2.5 py-1 rounded-md bg-indigo-950 border border-indigo-500/20">2 assignments delayed</span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-950 border border-indigo-500/20">Late-night study increased</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/20 space-y-3 text-left">
              <span className="text-[10px] font-bold text-teal-400 uppercase">Today's Next Small Step</span>
              <p className="text-xs text-white font-medium">
                Choose one task to defer and protect 30 minutes for recovery.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-indigo-500/10 text-[11px] text-indigo-300/70">
                <WindIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>2-min breathing reset available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
