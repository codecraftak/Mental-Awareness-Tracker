import { CheckIn, JournalEntry, StreakInfo } from '../types';
import { generateMockHistory } from '../data/mockData';

const CHECK_INS_KEY = 'mindshield_checkins';
const JOURNAL_KEY = 'mindshield_journals';

// In-memory fallback if localStorage is unavailable
const memoryStorage: Record<string, string> = {};

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key) ?? memoryStorage[key] ?? null;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return memoryStorage[key] ?? null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
  memoryStorage[key] = value;
};

// Initialize with mock data if no storage exists
export const initializeStorage = (): void => {
  const existingCheckIns = safeGetItem(CHECK_INS_KEY);
  const existingJournals = safeGetItem(JOURNAL_KEY);

  if (!existingCheckIns || !existingJournals) {
    const { checkIns, journalEntries } = generateMockHistory();
    if (!existingCheckIns) {
      safeSetItem(CHECK_INS_KEY, JSON.stringify(checkIns));
    }
    if (!existingJournals) {
      safeSetItem(JOURNAL_KEY, JSON.stringify(journalEntries));
    }
  }
};

export const getCheckIns = (): CheckIn[] => {
  initializeStorage();
  const data = safeGetItem(CHECK_INS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as CheckIn[];
  } catch {
    return [];
  }
};

export const saveCheckIn = (checkIn: Omit<CheckIn, 'id'> & { id?: string }): CheckIn => {
  const checkIns = getCheckIns();
  const id = checkIn.id || `checkin-${Date.now()}`;
  const record: CheckIn = { ...checkIn, id };
  
  // Update or insert (matching by date or id)
  const index = checkIns.findIndex(c => c.id === id || c.date === checkIn.date);
  if (index >= 0) {
    checkIns[index] = record;
  } else {
    checkIns.push(record);
  }

  // Sort check-ins by date (ascending)
  checkIns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  safeSetItem(CHECK_INS_KEY, JSON.stringify(checkIns));
  return record;
};

export const getJournalEntries = (): JournalEntry[] => {
  initializeStorage();
  const data = safeGetItem(JOURNAL_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as JournalEntry[];
  } catch {
    return [];
  }
};

export const saveJournalEntry = (entry: Omit<JournalEntry, 'id'> & { id?: string }): JournalEntry => {
  const entries = getJournalEntries();
  const id = entry.id || `journal-${Date.now()}`;
  const record: JournalEntry = { ...entry, id };

  const index = entries.findIndex(e => e.id === id || e.date === entry.date);
  if (index >= 0) {
    entries[index] = record;
  } else {
    entries.push(record);
  }

  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  safeSetItem(JOURNAL_KEY, JSON.stringify(entries));
  return record;
};

export const calculateStreaks = (checkIns: CheckIn[], journals: JournalEntry[]): StreakInfo => {
  if (checkIns.length === 0) {
    return { checkInStreak: 0, journalStreak: 0, wellnessScore: 50 };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const getStreak = (dates: string[]): number => {
    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const first = uniqueDates[0];
    
    // Check if the streak is active (has entry today or yesterday)
    if (first !== todayStr && first !== yesterdayStr) {
      return 0;
    }

    let current = new Date(first);
    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      const diffTime = Math.abs(current.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        current = entryDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const checkInDates = checkIns.map(c => c.date);
  const journalDates = journals.map(j => j.date);

  const checkInStreak = getStreak(checkInDates);
  const journalStreak = getStreak(journalDates);

  // Wellness score calculation based on the latest 5 checkins (weighted)
  const recentCheckIns = checkIns.slice(-5);
  let wellnessScore = 60; // baseline

  if (recentCheckIns.length > 0) {
    let sum = 0;
    recentCheckIns.forEach(c => {
      // Mood mapping to numeric: great=100, good=80, neutral=60, anxious=40, sad=20
      let moodVal = 60;
      if (c.mood === 'great') moodVal = 100;
      else if (c.mood === 'good') moodVal = 80;
      else if (c.mood === 'anxious') moodVal = 40;
      else if (c.mood === 'sad') moodVal = 20;

      // Inverse stress: 10 stress = 0 points, 1 stress = 100 points
      const stressVal = (11 - c.stressLevel) * 10;
      
      // Energy: 10 energy = 100 points
      const energyVal = c.energyLevel * 10;

      // Confidence: 10 confidence = 100 points
      const confidenceVal = c.confidenceLevel * 10;

      // Sleep: 8+ hours = 100, 7 = 85, 6 = 70, 5 = 50, <5 = 30
      let sleepVal = 30;
      if (c.sleepHours >= 8) sleepVal = 100;
      else if (c.sleepHours >= 7) sleepVal = 85;
      else if (c.sleepHours >= 6) sleepVal = 70;
      else if (c.sleepHours >= 5) sleepVal = 50;

      // Study satisfaction: 10 = 100
      const studyVal = c.studySatisfaction * 10;

      sum += (moodVal * 0.25) + (stressVal * 0.25) + (energyVal * 0.15) + (confidenceVal * 0.15) + (sleepVal * 0.1) + (studyVal * 0.1);
    });
    wellnessScore = Math.round(sum / recentCheckIns.length);
  }

  return {
    checkInStreak,
    journalStreak,
    wellnessScore: Math.min(100, Math.max(0, wellnessScore)),
  };
};
