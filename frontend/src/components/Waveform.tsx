import React from 'react';

export const Waveform: React.FC<{ className?: string }> = ({ className = "w-full h-16" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 800 100" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M0,50 L200,50 L230,50 L245,20 L260,80 L275,35 L290,65 L305,50 L500,50 L520,30 L540,70 L560,50 L800,50"
          stroke="url(#waveGrad)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};
