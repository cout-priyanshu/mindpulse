import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from './Icons';

interface WhyCardProps {
  factors: string[];
  coverageNote: string;
}

export const WhyCard: React.FC<WhyCardProps> = ({ factors, coverageNote }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-indigo-900/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-300">
            <span className="text-xs font-bold">?</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white">Why am I seeing this?</h4>
            <p className="text-xs text-indigo-300/70">Transparent contributing factors behind your trend</p>
          </div>
        </div>
        <div className="text-indigo-400">
          {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 pt-1 border-t border-indigo-500/10">
          <div className="space-y-2 mt-2">
            {factors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-500/10 flex items-center justify-between text-[11px] text-indigo-300/60">
            <span>{coverageNote}</span>
            <span className="text-indigo-400 font-mono">100% Student-Private</span>
          </div>
        </div>
      )}
    </div>
  );
};
