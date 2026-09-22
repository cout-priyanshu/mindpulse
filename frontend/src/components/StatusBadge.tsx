import React from 'react';
import { WellbeingState } from '../types';

export const StatusBadge: React.FC<{ state: WellbeingState }> = ({ state }) => {
  if (state === 'needs_attention') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        Needs attention
      </span>
    );
  } else if (state === 'watchful') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
        Watchful
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/15 text-teal-300 border border-teal-500/30">
        <span className="w-2 h-2 rounded-full bg-teal-400"></span>
        Balanced
      </span>
    );
  }
};
