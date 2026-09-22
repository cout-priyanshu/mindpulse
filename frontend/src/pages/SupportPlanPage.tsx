import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { EveningPlanner } from '../components/EveningPlanner';
import { BreathingModal } from '../components/BreathingModal';
import { WindIcon, UsersIcon, ShieldCheckIcon, CheckCircleIcon, ArrowRightIcon } from '../components/Icons';

export const SupportPlanPage: React.FC = () => {
  const { showToast } = useAuth();
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [peerStatus, setPeerStatus] = useState<string | null>(null);
  const [counselStatus, setCounselStatus] = useState<string | null>(null);

  const handlePeerRequest = async () => {
    try {
      await api.logSupportAction("anonymous_peer_support", { requested_topic: "Mid-semester deadline cluster" });
      setPeerStatus("Anonymous connection requested. A peer mentor will ping you in the private portal queue.");
      showToast("Anonymous peer support request submitted");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCounselRequest = async () => {
    try {
      await api.logSupportAction("confidential_counselling", { preference: "Asynchronous messaging" });
      setCounselStatus("Confidential consult registered. Student wellbeing advisor will follow up via encrypted message.");
      showToast("Confidential consult enquiry registered");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-indigo-500/10 pb-6 space-y-2">
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Adaptive & Gentle</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Personal Support Plan
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
          When routine demands cluster, small student-controlled steps protect your balance. Every tool below is completely optional.
        </p>
      </div>

      {/* Interactive Workload Reset Planner */}
      <EveningPlanner />

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 2-Minute Guided Breathing */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md p-6 flex flex-col justify-between space-y-4 hover:border-indigo-400/40 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <WindIcon className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">2 Minutes • Self-Paced</span>
              <h3 className="text-base font-bold text-white mt-1">Guided Breathing Reset</h3>
            </div>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Box breathing cycle (4s in, 4s hold, 4s out, 4s hold) to downshift autonomic tension before sleep or study.
            </p>
          </div>

          <div className="pt-4 border-t border-indigo-500/10 space-y-3">
            <p className="text-[10px] text-indigo-300/60 font-mono">
              Optional • You choose what happens next • No action is shared without your consent
            </p>
            <button
              onClick={() => setIsBreathingOpen(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-400/30 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              <span>Launch breathing reset</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Anonymous Peer Support */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md p-6 flex flex-col justify-between space-y-4 hover:border-indigo-400/40 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Shared Experience</span>
              <h3 className="text-base font-bold text-white mt-1">Anonymous Peer Support</h3>
            </div>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Connect with an upper-year engineering student mentor who navigated the exact same course crunch.
            </p>
          </div>

          <div className="pt-4 border-t border-indigo-500/10 space-y-3">
            <p className="text-[10px] text-indigo-300/60 font-mono">
              Optional • You choose what happens next • No action is shared without your consent
            </p>
            {peerStatus ? (
              <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px]">
                {peerStatus}
              </div>
            ) : (
              <button
                onClick={handlePeerRequest}
                className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-400/30 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>Request anonymous mentor</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Confidential Campus Counselling */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/40 backdrop-blur-md p-6 flex flex-col justify-between space-y-4 hover:border-indigo-400/40 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Professional Support</span>
              <h3 className="text-base font-bold text-white mt-1">Confidential Counselling</h3>
            </div>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Schedule a private consultation with campus student counselling. Zero reports or logs are shared with your department.
            </p>
          </div>

          <div className="pt-4 border-t border-indigo-500/10 space-y-3">
            <p className="text-[10px] text-indigo-300/60 font-mono">
              Optional • You choose what happens next • No action is shared without your consent
            </p>
            {counselStatus ? (
              <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px]">
                {counselStatus}
              </div>
            ) : (
              <button
                onClick={handleCounselRequest}
                className="w-full py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-400/30 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>Request confidential consult</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />
    </div>
  );
};
