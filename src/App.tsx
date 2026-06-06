import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DailyCheckIn } from './components/DailyCheckIn';
import { JournalReflection } from './components/JournalReflection';
import { CoachPanel } from './components/CoachPanel';
import { SupportCenter } from './components/SupportCenter';
import { BurnoutAlert } from './components/BurnoutAlert';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useWellnessState } from './hooks/useWellnessState';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Sparkles,
  Compass,
  HeartHandshake
} from 'lucide-react';

function App() {
  const {
    activeTab,
    setActiveTab,
    checkIns,
    darkMode,
    setDarkMode,
    streakInfo,
    burnoutReport,
    insights,
    latestCheckIn,
    latestJournal,
    handleCheckInSubmitted,
    handleJournalSubmitted,
  } = useWellnessState();

  // Sidebar Menu Config
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'checkin', label: 'Check-in Flow', icon: Calendar },
    { id: 'journal', label: 'AI Journal', icon: BookOpen },
    { id: 'coach', label: 'Wellness Coach', icon: Sparkles },
    { id: 'support', label: 'Exam Support', icon: Compass },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
        
        {/* Navbar Header */}
        <Navbar streakInfo={streakInfo} darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Workspace Body */}
        <div className="flex-grow max-w-7xl w-full mx-auto flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-6">
          
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0 text-left" aria-label="Main Navigation">
            <nav className="sticky top-22 space-y-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-3 mb-2.5">
                Mental Wellness Panel
              </span>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm scale-102'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="pt-8 block">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-xs text-slate-400 dark:text-slate-500 font-medium space-y-2">
                  <div className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400 font-bold">
                    <HeartHandshake className="h-4 w-4" />
                    <span>MindShield Safety</span>
                  </div>
                  <p className="leading-relaxed">
                    This platform operates entirely in-browser. All checks, scores, and journal evaluations are computed locally using client heuristics. Your data is private.
                  </p>
                  <p className="text-[9px] leading-relaxed italic border-t border-slate-100 dark:border-slate-800 pt-1.5">
                    MindShield is an early wellness monitor, not a replacement for clinical consultation.
                  </p>
                </div>
              </div>
            </nav>
          </aside>

          {/* MAIN WORKSPACE SCREEN */}
          <main className="flex-grow space-y-6 overflow-hidden">
            
            {/* High/Mod Burnout Indicator alert on top of main workspace */}
            {activeTab !== 'coach' && <BurnoutAlert report={burnoutReport} />}

            {/* Routed View */}
            <div className="focus-visible:outline-none">
              {activeTab === 'dashboard' && (
                <Dashboard checkIns={checkIns} insights={insights} />
              )}
              {activeTab === 'checkin' && (
                <DailyCheckIn onCheckInSubmitted={handleCheckInSubmitted} lastCheckIn={latestCheckIn} />
              )}
              {activeTab === 'journal' && (
                <JournalReflection onJournalSubmitted={handleJournalSubmitted} lastJournalEntry={latestJournal} />
              )}
              {activeTab === 'coach' && (
                <CoachPanel latestCheckIn={latestCheckIn} />
              )}
              {activeTab === 'support' && (
                <SupportCenter />
              )}
            </div>
          </main>
        </div>

        {/* BOTTOM NAV BAR (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex justify-around shadow-lg" aria-label="Mobile Bottom Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <footer className="w-full py-6 mt-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold space-y-1 md:pb-6 pb-20">
          <p>© {new Date().getFullYear()} MindShield AI. Developed for National Student Wellness hackathons.</p>
          <p>Privacy Shield Active. Computed entirely in client sandbox.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
