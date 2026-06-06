import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BurnoutAlert } from '../components/BurnoutAlert';
import { CoachPanel } from '../components/CoachPanel';
import { SupportCenter } from '../components/SupportCenter';
import { BurnoutReport, CheckIn } from '../types';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock Recharts
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    Cell: () => <div data-testid="cell" />,
    LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    CartesianGrid: () => <div data-testid="grid" />,
  };
});

describe('UI Component Specific Tests', () => {
  
  describe('BurnoutAlert Component', () => {
    it('does not render warning details if risk level is Low', () => {
      const mockReport: BurnoutReport = {
        score: 25,
        riskLevel: 'Low',
        explanation: 'Low risk of burnout.',
        intervention: 'Keep maintaining your balance.'
      };
      
      render(<BurnoutAlert report={mockReport} />);
      expect(screen.queryByText(/Immediate Action Required/i)).toBeNull();
    });

    it('renders alert panel and triggers breathing guide modal when risk is High', () => {
      const mockReport: BurnoutReport = {
        score: 75,
        riskLevel: 'High',
        explanation: 'High stress level suggestions.',
        intervention: 'Take an immediate study break.'
      };
      
      render(<BurnoutAlert report={mockReport} />);
      
      // Should show warning badge and explanation
      expect(screen.getByText(/High Risk/i)).toBeDefined();
      expect(screen.getByText(/High stress level suggestions./i)).toBeDefined();
      
      // Click breathing guide trigger
      const breatheBtn = screen.getByRole('button', { name: /Start 4-7-8 Breathing Guide/i });
      expect(breatheBtn).toBeDefined();
      
      fireEvent.click(breatheBtn);
      
      // Should open breathing guide overlay dialog
      expect(screen.getByText(/4-7-8 Calming Breathing Guide/i)).toBeDefined();
      expect(screen.getByText(/Inhale deeply/i)).toBeDefined();
      
      // Close modal
      const closeBtn = screen.getByRole('button', { name: /Done/i });
      fireEvent.click(closeBtn);
      
      // Dialog should be gone
      expect(screen.queryByText(/De-escalate Exam Stress/i)).toBeNull();
    });
  });

  describe('CoachPanel Component', () => {
    it('renders default recommendations when check-in history is absent', () => {
      render(<CoachPanel latestCheckIn={undefined} />);
      expect(screen.getByText(/Pomodoro Focus Intervals/i)).toBeDefined();
      expect(screen.getByText(/Cognitive Reset Walk/i)).toBeDefined();
      expect(screen.getByText(/Mindful Breathing/i)).toBeDefined();
    });

    it('renders stress recommendations if latest check-in stress level is high', () => {
      const mockCheckIn: CheckIn = {
        id: '1',
        date: '2026-06-06',
        mood: 'anxious',
        stressLevel: 8,
        energyLevel: 4,
        confidenceLevel: 5,
        sleepHours: 7.5,
        studySatisfaction: 6,
        triggers: ['Exam pressure']
      };

      render(<CoachPanel latestCheckIn={mockCheckIn} />);
      expect(screen.getByText(/Box Breathing Technique/i)).toBeDefined();
      expect(screen.getByText(/Immediate Study De-escalation/i)).toBeDefined();
    });

    it('renders trigger-specific suggestions for Family Expectations and Time Management', () => {
      const mockCheckIn: CheckIn = {
        id: '2',
        date: '2026-06-06',
        mood: 'neutral',
        stressLevel: 5,
        energyLevel: 6,
        confidenceLevel: 6,
        sleepHours: 7.0,
        studySatisfaction: 7,
        triggers: ['Family expectations', 'Time management']
      };

      render(<CoachPanel latestCheckIn={mockCheckIn} />);
      
      // Verify our new recommendations are displayed
      expect(screen.getByText(/Expectation Separation Exercise/i)).toBeDefined();
      expect(screen.getByText(/Time Auditing & Blocking/i)).toBeDefined();
    });
  });

  describe('SupportCenter Component', () => {
    it('renders preparation timelines and switches active tabs correctly', () => {
      render(<SupportCenter />);
      
      // Assert the initial active tab content (Before Exam)
      expect(screen.getByText(/Coping Strategies/i)).toBeDefined();
      
      // Find another tab button (e.g., Result Day)
      const resultsTab = screen.getByRole('tab', { name: /Result Day/i });
      expect(resultsTab).toBeDefined();
      
      // Click Results Day tab
      fireEvent.click(resultsTab);
      
      // Should render results timeline content
      expect(screen.getByText(/Separate your Self-Worth from the Rank/i)).toBeDefined();
    });
  });
});
