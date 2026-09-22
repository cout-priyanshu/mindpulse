import React from 'react';
import { LockIcon, ShieldCheckIcon, UsersIcon } from './Icons';

export const PrivacyFlowDiagram: React.FC = () => {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md p-6 space-y-4">
      <div className="text-center max-w-lg mx-auto mb-6">
        <h4 className="text-base font-bold text-white">How Your Privacy Architecture Works</h4>
        <p className="text-xs text-indigo-300/70 mt-1">
          Personal wellbeing markers never leave your private student vault.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Student Vault */}
        <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 relative">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
            <LockIcon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Private Student Vault</span>
          <h5 className="text-sm font-semibold text-white mt-1">Aarav's Account</h5>
          <ul className="mt-2 space-y-1 text-xs text-indigo-200">
            <li>• Daily energy ratings</li>
            <li>• Exact study timestamps</li>
            <li>• Specific assignment titles</li>
            <li>• Personal reflections</li>
          </ul>
          <span className="mt-3 block text-[10px] text-teal-300 font-medium">Accessible solely by student</span>
        </div>

        {/* Privacy Firewall & Anonymizer */}
        <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-900/20 text-center flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xs font-bold text-white">Differential Privacy Engine</span>
          <p className="text-[11px] text-indigo-300/80 leading-snug">
            Identifiers stripped. Noise added. K-Anonymity enforced (minimum 10 students).
          </p>
          <span className="text-[10px] text-indigo-400 font-mono">Zero raw records transferred</span>
        </div>

        {/* Institution View */}
        <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
            <UsersIcon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Cohort Insights</span>
          <h5 className="text-sm font-semibold text-white mt-1">Faculty & Dean Portal</h5>
          <ul className="mt-2 space-y-1 text-xs text-indigo-200">
            <li>• Aggregated workload pressure</li>
            <li>• Clustered exam schedules</li>
            <li>• No names or student IDs</li>
            <li>• No individual tracking</li>
          </ul>
          <span className="mt-3 block text-[10px] text-purple-300 font-medium">Curriculum policy action only</span>
        </div>
      </div>
    </div>
  );
};
