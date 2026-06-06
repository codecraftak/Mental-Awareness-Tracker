import { ShieldAlert, Flame, BookOpen, Sun, Moon, Award } from 'lucide-react';
import { StreakInfo } from '../types';

interface NavbarProps {
  streakInfo: StreakInfo;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const Navbar = ({ streakInfo, darkMode, setDarkMode }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-teal-500/10 p-2 rounded-lg text-teal-600 dark:text-teal-400">
            <ShieldAlert className="h-6 w-6 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 m-0 leading-none">
              MindShield <span className="text-teal-600 dark:text-teal-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium m-0 tracking-wider uppercase">
              Student Mental Wellness intelligence
            </p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          
          {/* Streak 1: Daily Check-Ins */}
          <div 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/40"
            title="Consecutive Daily Check-ins"
            aria-label={`Daily check-in streak: ${streakInfo.checkInStreak} days`}
          >
            <Flame className="h-4.5 w-4.5 fill-current" />
            <span className="text-sm font-bold">{streakInfo.checkInStreak}d Check-in</span>
          </div>

          {/* Streak 2: Journal Entries */}
          <div 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40"
            title="Consecutive Reflection Journal Days"
            aria-label={`Reflection streak: ${streakInfo.journalStreak} days`}
          >
            <BookOpen className="h-4.5 w-4.5" />
            <span className="text-sm font-bold">{streakInfo.journalStreak}d Journal</span>
          </div>

          {/* Wellness Score Badge */}
          <div 
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40"
            title="Wellness Score (based on recent check-ins)"
            aria-label={`Wellness score: ${streakInfo.wellnessScore} out of 100`}
          >
            <Award className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-semibold">Wellness Index:</span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{streakInfo.wellnessScore}%</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>
          
        </div>
      </div>
    </header>
  );
};
