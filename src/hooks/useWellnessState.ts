import { useState, useEffect, useMemo, useCallback } from 'react';
import { CheckIn, JournalEntry, StreakInfo, BurnoutReport, Insight } from '../types';
import {
  getCheckIns,
  getJournalEntries,
  saveCheckIn,
  saveJournalEntry,
  calculateStreaks,
} from '../services/storageService';
import { calculateBurnoutReport, generateWeeklyInsights } from '../utils/wellnessEngine';

export interface UseWellnessStateResult {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checkIns: CheckIn[];
  journals: JournalEntry[];
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  streakInfo: StreakInfo;
  burnoutReport: BurnoutReport;
  insights: Insight[];
  latestCheckIn: CheckIn | undefined;
  latestJournal: JournalEntry | undefined;
  handleCheckInSubmitted: (newCheckIn: Omit<CheckIn, 'id'>) => void;
  handleJournalSubmitted: (newJournal: Omit<JournalEntry, 'id'>) => void;
}

export const useWellnessState = (): UseWellnessStateResult => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => getCheckIns());
  const [journals, setJournals] = useState<JournalEntry[]>(() => getJournalEntries());

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('mindshield_dark');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Update theme classes on change
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('mindshield_dark', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('mindshield_dark', 'false');
      }
    } catch (err) {
      console.error('Failed to set theme in localStorage:', err);
    }
  }, [darkMode]);

  // Handle new check-in submission
  const handleCheckInSubmitted = useCallback((newCheckIn: Omit<CheckIn, 'id'>) => {
    const saved = saveCheckIn(newCheckIn);
    setCheckIns(prev => {
      const idx = prev.findIndex(c => c.id === saved.id || c.date === saved.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }, []);

  // Handle new journal submission
  const handleJournalSubmitted = useCallback((newJournal: Omit<JournalEntry, 'id'>) => {
    const saved = saveJournalEntry(newJournal);
    setJournals(prev => {
      const idx = prev.findIndex(j => j.id === saved.id || j.date === saved.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }, []);

  // Computations
  const streakInfo = useMemo(() => {
    return calculateStreaks(checkIns, journals);
  }, [checkIns, journals]);

  const burnoutReport = useMemo(() => {
    return calculateBurnoutReport(checkIns);
  }, [checkIns]);

  const insights = useMemo(() => {
    return generateWeeklyInsights(checkIns);
  }, [checkIns]);

  const latestCheckIn = useMemo(() => {
    return checkIns[checkIns.length - 1];
  }, [checkIns]);

  const latestJournal = useMemo(() => {
    return journals[journals.length - 1];
  }, [journals]);

  return {
    activeTab,
    setActiveTab,
    checkIns,
    journals,
    darkMode,
    setDarkMode,
    streakInfo,
    burnoutReport,
    insights,
    latestCheckIn,
    latestJournal,
    handleCheckInSubmitted,
    handleJournalSubmitted,
  };
};
