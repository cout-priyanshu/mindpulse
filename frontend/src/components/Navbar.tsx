import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PulseIcon, ShieldIcon, LogOutIcon, UserIcon } from './Icons';

export const Navbar: React.FC = () => {
  const { user, role, activeScenario, toggleScenario, currentPage, setCurrentPage, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setCurrentPage(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-400 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-teal-400 group-hover:text-white transition-colors">
              <PulseIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">MindPulse</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">v1.0</span>
            </div>
            <span className="text-[10px] text-indigo-300/70 hidden sm:block">
              Understand your rhythm. Protect your balance.
            </span>
          </div>
        </div>

        {/* Demo Mode Scenario Switcher */}
        {user && role === 'student' && (
          <div className="flex items-center bg-indigo-950/80 border border-indigo-500/30 rounded-full p-1 text-xs shadow-inner">
            <span className="px-2 text-[11px] font-semibold text-indigo-300 hidden md:inline">Demo Mode:</span>
            <button
              onClick={() => toggleScenario('balanced')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeScenario === 'balanced'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              Balanced Week
            </button>
            <button
              onClick={() => toggleScenario('demanding')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeScenario === 'demanding'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-indigo-300 hover:text-white'
              }`}
            >
              Demanding Week (Aarav)
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              {role === 'student' ? (
                <>
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'dashboard' ? 'text-white bg-indigo-900/60' : 'text-indigo-300 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('checkin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'checkin' ? 'text-white bg-indigo-900/60' : 'text-indigo-300 hover:text-white'
                    }`}
                  >
                    Check-in
                  </button>
                  <button
                    onClick={() => setCurrentPage('support')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'support' ? 'text-white bg-indigo-900/60' : 'text-indigo-300 hover:text-white'
                    }`}
                  >
                    Support Plan
                  </button>
                  <button
                    onClick={() => setCurrentPage('privacy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'privacy' ? 'text-white bg-indigo-900/60' : 'text-indigo-300 hover:text-white'
                    }`}
                  >
                    Privacy Center
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentPage('institution')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'institution' ? 'text-white bg-indigo-900/60' : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  Cohort Insights
                </button>
              )}

              {/* User badge and logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-indigo-500/20">
                <span className="text-xs text-indigo-200 font-medium hidden lg:inline">
                  {user.full_name}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-indigo-900/40 transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-4 py-1.5 rounded-xl text-xs font-medium text-indigo-200 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('onboarding')}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all"
              >
                Start Private Check-in
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
