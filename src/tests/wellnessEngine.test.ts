import { describe, it, expect } from 'vitest';
import { calculateBurnoutReport, analyzeTriggers, generateWeeklyInsights } from '../utils/wellnessEngine';
import { CheckIn } from '../types';

describe('wellnessEngine - Burnout Scoring Algorithm', () => {
  it('should return Low Risk for a healthy check-in profile', () => {
    const checkIns: CheckIn[] = [
      {
        id: '1',
        date: '2026-06-01',
        mood: 'great',
        stressLevel: 2,
        energyLevel: 8,
        confidenceLevel: 8,
        sleepHours: 8,
        studySatisfaction: 8,
        triggers: []
      }
    ];

    const report = calculateBurnoutReport(checkIns);
    expect(report.riskLevel).toBe('Low');
    expect(report.score).toBeLessThan(40);
  });

  it('should return High Risk for high stress, low sleep, and low energy check-ins', () => {
    const checkIns: CheckIn[] = [
      {
        id: '1',
        date: '2026-06-01',
        mood: 'sad',
        stressLevel: 9,
        energyLevel: 2,
        confidenceLevel: 2,
        sleepHours: 4,
        studySatisfaction: 2,
        triggers: ['Exam pressure', 'Sleep issues']
      },
      {
        id: '2',
        date: '2026-06-02',
        mood: 'anxious',
        stressLevel: 9,
        energyLevel: 2,
        confidenceLevel: 3,
        sleepHours: 4.5,
        studySatisfaction: 1,
        triggers: ['Mock test scores']
      }
    ];

    const report = calculateBurnoutReport(checkIns);
    expect(report.riskLevel).toBe('High');
    expect(report.score).toBeGreaterThanOrEqual(70);
  });

  it('should adjust scores based on increasing stress trends', () => {
    const flatTrend: CheckIn[] = [
      { id: '1', date: '2026-06-01', mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] },
      { id: '2', date: '2026-06-02', mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] },
      { id: '3', date: '2026-06-03', mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] }
    ];

    const risingTrend: CheckIn[] = [
      { id: '1', date: '2026-06-01', mood: 'neutral', stressLevel: 3, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] },
      { id: '2', date: '2026-06-02', mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] },
      { id: '3', date: '2026-06-03', mood: 'neutral', stressLevel: 7, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: [] }
    ];

    const reportFlat = calculateBurnoutReport(flatTrend);
    const reportRising = calculateBurnoutReport(risingTrend);

    // Both averages of stress are 5, but risingTrend should have a trend penalty added
    expect(reportRising.score).toBeGreaterThan(reportFlat.score);
  });
});

describe('wellnessEngine - Trigger Analysis', () => {
  it('should correctly calculate trigger frequencies and top sources', () => {
    const checkIns: CheckIn[] = [
      { id: '1', date: '2026-06-01', mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: ['Exam pressure', 'Time management'] },
      { id: '2', date: '2026-06-02', mood: 'neutral', stressLevel: 5, energyLevel: 6, confidenceLevel: 6, sleepHours: 7, studySatisfaction: 6, triggers: ['Exam pressure'] }
    ];

    const { frequencies, mostCommon, triggerCount } = analyzeTriggers(checkIns);

    expect(triggerCount).toBe(3);
    expect(mostCommon).toBe('Exam pressure');
    const examPressureFreq = frequencies.find(f => f.trigger === 'Exam pressure');
    expect(examPressureFreq?.count).toBe(2);
    expect(examPressureFreq?.percentage).toBe(67);
  });
});

describe('wellnessEngine - Weekly Insights Generator', () => {
  it('should yield correlations between high sleep and positive moods', () => {
    const checkIns: CheckIn[] = [
      { id: '1', date: '2026-06-01', mood: 'great', stressLevel: 2, energyLevel: 8, confidenceLevel: 8, sleepHours: 8.5, studySatisfaction: 8, triggers: [] },
      { id: '2', date: '2026-06-02', mood: 'good', stressLevel: 3, energyLevel: 7, confidenceLevel: 7, sleepHours: 8.0, studySatisfaction: 8, triggers: [] },
      { id: '3', date: '2026-06-03', mood: 'great', stressLevel: 2, energyLevel: 9, confidenceLevel: 9, sleepHours: 7.5, studySatisfaction: 9, triggers: [] }
    ];

    const insights = generateWeeklyInsights(checkIns);
    const sleepMoodInsight = insights.find(i => i.id === 'ins-sleep-mood');
    expect(sleepMoodInsight).toBeDefined();
    expect(sleepMoodInsight?.message).toContain('sleep exceeds 7 hours');
  });

  it('should handle less than 3 check-ins with an informational message', () => {
    const insights = generateWeeklyInsights([]);
    expect(insights.length).toBe(1);
    expect(insights[0].id).toBe('ins-default');
    expect(insights[0].message).toContain('More wellness data is needed');
  });
});

describe('wellnessEngine - Boundary Cases & Extreme Inputs', () => {
  it('should return score 0 for empty check-ins array', () => {
    const report = calculateBurnoutReport([]);
    expect(report.score).toBe(0);
    expect(report.riskLevel).toBe('Low');
    expect(report.explanation).toContain('No check-in history available');
  });

  it('should cap burnout score at 100 for maximum stress, low sleep, and low satisfaction', () => {
    const maxStrainCheckIns: CheckIn[] = [
      { id: '1', date: '2026-06-01', mood: 'sad', stressLevel: 10, energyLevel: 1, confidenceLevel: 1, sleepHours: 0, studySatisfaction: 1, triggers: [] },
      { id: '2', date: '2026-06-02', mood: 'sad', stressLevel: 10, energyLevel: 1, confidenceLevel: 1, sleepHours: 0, studySatisfaction: 1, triggers: [] },
      { id: '3', date: '2026-06-03', mood: 'sad', stressLevel: 10, energyLevel: 1, confidenceLevel: 1, sleepHours: 0, studySatisfaction: 1, triggers: [] }
    ];
    const report = calculateBurnoutReport(maxStrainCheckIns);
    expect(report.score).toBe(100);
    expect(report.riskLevel).toBe('High');
  });

  it('should calculate triggers cleanly even when no triggers are checked', () => {
    const emptyTriggersCheckIns: CheckIn[] = [
      { id: '1', date: '2026-06-01', mood: 'neutral', stressLevel: 5, energyLevel: 5, confidenceLevel: 5, sleepHours: 7, studySatisfaction: 5, triggers: [] }
    ];
    const { frequencies, mostCommon, triggerCount } = analyzeTriggers(emptyTriggersCheckIns);
    expect(triggerCount).toBe(0);
    expect(mostCommon).toBe('None');
    expect(frequencies.every(f => f.count === 0 && f.percentage === 0)).toBe(true);
  });
});
