import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { SafetyBanner } from './components/SafetyBanner';
import { LandingPage } from './pages/LandingPage';
import { OnboardingConsentPage } from './pages/OnboardingConsentPage';
import { DashboardPage } from './pages/DashboardPage';
import { DailyCheckInPage } from './pages/DailyCheckInPage';
import { SupportPlanPage } from './pages/SupportPlanPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { InstitutionInsightsPage } from './pages/InstitutionInsightsPage';
import { LoginPage } from './pages/LoginPage';

export const AppContent: React.FC = () => {
  const { currentPage, toastMessage } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Universal Safety and Crisis Banner */}
      <SafetyBanner />

      {/* Primary Navigation Bar */}
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs text-white shadow-2xl animate-fade-in flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Routing */}
      <main className="flex-1">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'onboarding' && <OnboardingConsentPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'checkin' && <DailyCheckInPage />}
        {currentPage === 'support' && <SupportPlanPage />}
        {currentPage === 'privacy' && <PrivacyCenterPage />}
        {currentPage === 'institution' && <InstitutionInsightsPage />}
        {currentPage === 'login' && <LoginPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 py-8 px-4 text-center text-xs text-indigo-300/60 space-y-2">
        <p>MindPulse is a non-diagnostic wellbeing intelligence tool for engineering students.</p>
        <p className="text-[11px] text-indigo-400/50">
          Private by default • Non-diagnostic • Student controlled • Never shared with faculty
        </p>
      </footer>
    </div>
  );
};
