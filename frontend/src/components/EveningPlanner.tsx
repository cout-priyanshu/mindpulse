import React, { useState, useEffect } from 'react';
import { LighterEveningPlan, LighterEveningTask } from '../types';
import { api } from '../services/api';
import { ClockIcon, CheckCircleIcon, ArrowRightIcon, RefreshIcon } from './Icons';

export const EveningPlanner: React.FC = () => {
  const [plan, setPlan] = useState<LighterEveningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fetchPlan = async () => {
    try {
      const res = await api.getLighterEveningPlan();
      setPlan(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleDefer = async (taskId: string) => {
    setLoading(true);
    try {
      const updated = await api.deferTask(taskId, "Friday evening");
      setPlan(updated);
      setSuccessNotice("Task deferred. Tonight's workload adjusted to protect 45-60 mins of restorative rest.");
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await api.resetEveningPlan();
      setPlan(res);
      setSuccessNotice(null);
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return <div className="text-xs text-indigo-300">Loading planner...</div>;

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/30 backdrop-blur-md p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Student Control</span>
          <h3 className="text-lg font-bold text-white">Build a Lighter Evening</h3>
          <p className="text-xs text-indigo-300/70">
            Choose one non-urgent commitment to postpone. Protect 30-60 minutes for recovery.
          </p>
        </div>

        {/* Workload metric summary */}
        <div className="flex items-center gap-3 bg-indigo-900/40 border border-indigo-500/20 rounded-xl px-4 py-2">
          <div className="text-right">
            <span className="text-[10px] text-indigo-300 block">Tonight's Plan</span>
            <span className="text-base font-bold text-white font-mono">{plan.current_workload_hours}h</span>
          </div>
          {plan.relief_hours > 0 && (
            <div className="pl-3 border-l border-indigo-500/20 text-left">
              <span className="text-[10px] text-teal-300 block">Relief Protected</span>
              <span className="text-base font-bold text-teal-400 font-mono">+{plan.relief_hours}h</span>
            </div>
          )}
        </div>
      </div>

      {successNotice && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plan.tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border transition-all ${
              task.deferred
                ? 'bg-slate-900/40 border-indigo-500/10 opacity-60'
                : 'bg-indigo-950/60 border-indigo-500/20 hover:border-indigo-400/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-semibold text-indigo-400 block">{task.course}</span>
                <h4 className={`text-sm font-semibold ${task.deferred ? 'line-through text-indigo-300/60' : 'text-white'}`}>
                  {task.title}
                </h4>
              </div>
              <span className="text-xs font-mono text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded">
                {task.estimated_minutes}m
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-indigo-500/10 text-xs">
              <span className={`text-[11px] ${task.is_urgent ? 'text-amber-400 font-medium' : 'text-indigo-300/70'}`}>
                {task.is_urgent ? "Due tomorrow" : "Flexible deadline"}
              </span>

              {task.deferred ? (
                <span className="text-teal-400 text-xs font-medium">Deferred to later this week</span>
              ) : (
                !task.is_urgent && (
                  <button
                    disabled={loading}
                    onClick={() => handleDefer(task.id)}
                    className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-400/30 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Defer to later</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-indigo-500/10 text-xs text-indigo-300/70">
        <p>{plan.feedback_message}</p>
        {plan.relief_hours > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] text-indigo-400 hover:text-white flex items-center gap-1"
          >
            <RefreshIcon className="w-3 h-3" />
            <span>Reset plan</span>
          </button>
        )}
      </div>
    </div>
  );
};
