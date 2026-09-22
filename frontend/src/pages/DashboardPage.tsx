import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { WellbeingSummary, RhythmTimeline as RhythmTimelineType } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { WhyCard } from '../components/WhyCard';
import { RhythmTimeline } from '../components/RhythmTimeline';
import { TrendChart } from '../components/TrendChart';
import { WindIcon, ArrowRightIcon, RefreshIcon, ShieldCheckIcon } from '../components/Icons';
import { BreathingModal } from '../components/BreathingModal';

export const DashboardPage: React.FC = () => {
  const { user, activeScenario, setCurrentPage } = useAuth();
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [timeline, setTimeline] = useState<RhythmTimelineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, timeRes] = await Promise.all([
        api.getWellbeingSummary(),
        api.getRhythmTimeline()
      ]);
      setSummary(sumRes);
      setTimeline(timeRes);
    } catch (e) {
      console.error("Error fetching dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeScenario]);

  if (loading || !summary || !timeline) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-indigo-300">Synchronising with your private wellbeing data...</p>
      </div>
    );
  }

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Aarav';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Friendly Greeting Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-500/10 pb-6">
        <div>
          <span className="text-xs font-medium text-teal-400 uppercase tracking-wider">Engineering Wellbeing Rhythm</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Good evening, {firstName}. Let’s check in with your week.
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
            A quiet space to understand your routine patterns and protect personal balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('checkin')}
            className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-400/30 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <span>Daily Check-in</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/20 text-xs font-semibold text-teal-300 transition-all flex items-center gap-1.5"
          >
            <WindIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>2-Min Reset</span>
          </button>
        </div>
      </div>

      {/* Main Hero Section: Wellbeing Trend & State */}
      <div className="rounded-2xl border border-indigo-500/25 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-indigo-500/15">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80">Support Signal</span>
              <StatusBadge state={summary.trend_state} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              “{summary.status_headline}”
            </h3>
            <p className="text-sm text-indigo-200/85 leading-relaxed">
              {summary.status_explanation}
            </p>
          </div>

          {/* Today's Next Small Step Card */}
          <div className="w-full lg:w-80 rounded-xl bg-indigo-950/70 border border-indigo-500/30 p-4 space-y-2.5 shrink-0 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Today's Next Small Step</span>
              <span className="text-[10px] text-indigo-400 font-mono">Student Choice</span>
            </div>
            <p className="text-xs text-white font-medium leading-relaxed">
              {summary.today_next_step}
            </p>
            <button
              onClick={() => setCurrentPage('support')}
              className="w-full mt-1 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-xs font-medium text-indigo-200 border border-indigo-400/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore support options</span>
              <ArrowRightIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 7-Day Trend Visualisation */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              7-Day Activity & Energy Trajectory
            </h4>
            <span className="text-[11px] text-indigo-400/70">Multi-factor rhythm view</span>
          </div>
          <TrendChart data={summary.seven_day_trend} />
        </div>
      </div>

      {/* Transparent Reasoning: Why Am I Seeing This? */}
      <WhyCard
        factors={summary.contributing_factors}
        coverageNote={summary.coverage_note}
      />

      {/* 7-Day Rhythm Timeline */}
      <RhythmTimeline days={timeline.days} />

      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        onComplete={() => fetchData()}
      />
    </div>
  );
};
