import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreathingLoop } from '../hooks/useBreathingLoop';
import { useWellnessState } from '../hooks/useWellnessState';

describe('Custom Hooks tests', () => {

  describe('useBreathingLoop', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should initialize with inhale and 4 seconds when inactive', () => {
      const { result } = renderHook(() => useBreathingLoop(false));
      expect(result.current.breathingStep).toBe('inhale');
      expect(result.current.timer).toBe(4);
    });

    it('should decrement timer and progress step when active', () => {
      const { result } = renderHook(() => useBreathingLoop(true));
      
      expect(result.current.breathingStep).toBe('inhale');
      expect(result.current.timer).toBe(4);

      // Advance 1s
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.timer).toBe(3);

      // Advance 3s more (total 4s) to trigger step change
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(result.current.breathingStep).toBe('hold');
      expect(result.current.timer).toBe(4);

      // Advance 4s more to trigger exhale
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(result.current.breathingStep).toBe('exhale');
      expect(result.current.timer).toBe(4);
    });

    it('should reset breathing timer and step on request', () => {
      const { result } = renderHook(() => useBreathingLoop(true));

      // Advance time to change step
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(result.current.breathingStep).toBe('hold');

      // Reset
      act(() => {
        result.current.resetBreathing();
      });
      expect(result.current.breathingStep).toBe('inhale');
      expect(result.current.timer).toBe(4);
    });
  });

  describe('useWellnessState', () => {
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

    it('should initialize checkins and journals from storage', () => {
      const { result } = renderHook(() => useWellnessState());
      expect(result.current.checkIns.length).toBeGreaterThan(0);
      expect(result.current.journals.length).toBeGreaterThan(0);
      expect(result.current.activeTab).toBe('dashboard');
    });

    it('should log a new check-in and update streaks', () => {
      // Seed storage with data up to yesterday (no check-in today yet)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const prevCheckIns = [
        {
          id: 'prev-1',
          date: yesterdayStr,
          mood: 'good' as const,
          stressLevel: 3,
          energyLevel: 7,
          confidenceLevel: 7,
          sleepHours: 7.5,
          studySatisfaction: 7,
          triggers: []
        }
      ];
      localStorage.setItem('mindshield_checkins', JSON.stringify(prevCheckIns));
      localStorage.setItem('mindshield_journals', JSON.stringify([]));

      const { result } = renderHook(() => useWellnessState());
      const initialCount = result.current.checkIns.length; // should be 1

      act(() => {
        result.current.handleCheckInSubmitted({
          date: new Date().toISOString().split('T')[0],
          mood: 'great',
          stressLevel: 2,
          energyLevel: 8,
          confidenceLevel: 9,
          sleepHours: 8,
          studySatisfaction: 9,
          triggers: []
        });
      });

      expect(result.current.checkIns.length).toBe(initialCount + 1);
      expect(result.current.streakInfo.checkInStreak).toBe(2);
    });

    it('should change tabs correctly', () => {
      const { result } = renderHook(() => useWellnessState());
      expect(result.current.activeTab).toBe('dashboard');

      act(() => {
        result.current.setActiveTab('journal');
      });
      expect(result.current.activeTab).toBe('journal');
    });
  });
});
