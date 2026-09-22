import React from 'react';
import { AlertCircleIcon } from './Icons';

export const SafetyBanner: React.FC = () => {
  return (
    <aside aria-label="Crisis support notice" className="w-full bg-indigo-950/60 border-b border-indigo-500/20 backdrop-blur-md px-4 py-2.5 text-xs text-indigo-200/90 flex items-center justify-between z-40">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white font-medium">Safe support:</strong> If you feel unsafe or need immediate help, contact local emergency services or a trusted person now.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-indigo-300/70 text-[11px]">
          <span>Non-diagnostic</span>
          <span>•</span>
          <span>Zero faculty surveillance</span>
          <span>•</span>
          <span>Student-controlled</span>
        </div>
      </div>
    </aside>
  );
};
