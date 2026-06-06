import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCheckIns,
  saveCheckIn,
  calculateStreaks
} from '../services/storageService';
import { CheckIn, JournalEntry } from '../types';

describe('storageService - local storage management', () => {
  beforeEach(() => {
    const mockStore: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem(key: string) { return mockStore[key] || null; },
      setItem(key: string, value: string) { mockStore[key] = value.toString(); },
      clear() {
        Object.keys(mockStore).forEach(key => delete mockStore[key]);
      }
    });
  });

  it('should seed mock history if empty when calling getCheckIns', () => {
    const list = getCheckIns();
    expect(list.length).toBeGreaterThan(0); // auto-seeded 14 items
    expect(list[0]).toHaveProperty('stressLevel');
  });

  it('should save check-ins correctly and sort them by date ascending', () => {
    const freshCheckIn: Omit<CheckIn, 'id'> = {
      date: '2026-06-05',
      mood: 'good',
      stressLevel: 4,
      energyLevel: 7,
      confidenceLevel: 7,
      sleepHours: 7.5,
      studySatisfaction: 8,
      triggers: []
    };

    const saved = saveCheckIn(freshCheckIn);
    expect(saved.id).toBeDefined();

    const list = getCheckIns();
    const matches = list.filter(c => c.date === '2026-06-05');
    expect(matches.length).toBe(1);
    expect(matches[0].stressLevel).toBe(4);
  });

  it('should calculate active streaks correctly', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const mockCheckIns: CheckIn[] = [
      { id: '1', date: yesterdayStr, mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] },
      { id: '2', date: todayStr, mood: 'good', stressLevel: 3, energyLevel: 8, confidenceLevel: 8, sleepHours: 8, studySatisfaction: 8, triggers: [] }
    ];

    const mockJournals: JournalEntry[] = [
      { id: 'j1', date: todayStr, prompt: 'Prompt', content: 'Reflection', analysis: { sentiment: 'neutral', positiveEmotions: [], negativeEmotions: [], growthMindsetIndicators: [], stressIndicators: [], selfDoubtIndicators: [], summary: '' } }
    ];

    const streaks = calculateStreaks(mockCheckIns, mockJournals);
    expect(streaks.checkInStreak).toBe(2);
    expect(streaks.journalStreak).toBe(1);
  });
});
