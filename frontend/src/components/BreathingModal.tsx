import React, { useState, useEffect } from 'react';
import { WindIcon } from './Icons';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0=Inhale (4s), 1=Hold (4s), 2=Exhale (4s), 3=Hold (4s)
  const [phaseTimer, setPhaseTimer] = useState(4);
  const [isActive, setIsActive] = useState(false);

  const phases = [
    { label: "Breathe in gently...", color: "from-teal-400 to-indigo-400", scale: "scale-125" },
    { label: "Hold softly...", color: "from-indigo-400 to-purple-400", scale: "scale-125" },
    { label: "Release slowly...", color: "from-purple-400 to-amber-400", scale: "scale-90" },
    { label: "Rest in the pause...", color: "from-indigo-500 to-teal-500", scale: "scale-90" }
  ];

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setSecondsLeft(120);
      setPhaseIndex(0);
      setPhaseTimer(4);
      return;
    }
    setIsActive(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });

      setPhaseTimer((prev) => {
        if (prev <= 1) {
          setPhaseIndex((p) => (p + 1) % 4);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsLeft, onComplete]);

  if (!isOpen) return null;

  const currentPhase = phases[phaseIndex];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-indigo-300 hover:text-white text-lg p-2"
        >
          ✕
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs mb-4">
          <WindIcon className="w-3.5 h-3.5 text-teal-400" />
          <span>2-Minute Box Breathing Reset</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">Rhythm Reset</h3>
        <p className="text-xs text-indigo-300/70 mb-6">
          Slow box breathing settles autonomic strain and creates mental spaciousness.
        </p>

        {/* Breathing Animation Circle */}
        <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-tr ${currentPhase.color} opacity-20 filter blur-xl transition-all duration-1000 ease-in-out ${currentPhase.scale}`}
          />
          <div
            className={`absolute w-32 h-32 rounded-full border-2 border-indigo-400/40 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${currentPhase.scale}`}
          >
            <span className="text-3xl font-light text-white font-mono">{phaseTimer}s</span>
            <span className="text-[11px] text-indigo-200 mt-1 uppercase tracking-wider font-semibold">
              {currentPhase.label}
            </span>
          </div>
        </div>

        <div className="text-sm font-mono text-indigo-400 mb-6">
          Session remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-5 py-2 rounded-xl text-xs font-medium border border-indigo-500/30 text-indigo-200 hover:bg-indigo-900/40 transition-colors"
          >
            {isActive ? "Pause" : "Resume"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity"
          >
            Complete & Return
          </button>
        </div>
      </div>
    </div>
  );
};
