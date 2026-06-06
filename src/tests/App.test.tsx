import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock Recharts completely to avoid JSDOM layout and SVG structure problems
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    Cell: () => <div data-testid="cell" />,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    CartesianGrid: () => <div data-testid="grid" />,
  };
});

describe('MindShield AI App - Integration Tests', () => {
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

  it('renders navbar header brand and dashboard panels', () => {
    render(<App />);
    
    // MindShield description is in Navbar subtitle
    expect(screen.getByText(/Student Mental Wellness/i)).toBeDefined();
    
    // Check if dashboard panels are loaded
    expect(screen.getByText(/Burnout Risk Assessment/)).toBeDefined();
  });

  it('switches navigation tab views when clicking sidebar triggers', () => {
    render(<App />);
    
    // Click "AI Journal" tab button (select index 0 to target desktop sidebar menu)
    const journalTabButtons = screen.getAllByRole('button', { name: /AI Journal/i });
    fireEvent.click(journalTabButtons[0]);
    
    expect(screen.getByText('Self-Reflection Portal')).toBeDefined();
    expect(screen.getByText('Real-time Sentiment & Mindset')).toBeDefined();

    // Click "Exam Support" tab button
    const supportTabButtons = screen.getAllByRole('button', { name: /Exam Support/i });
    fireEvent.click(supportTabButtons[0]);
    
    expect(screen.getByText('Exam Season Support Center')).toBeDefined();
  });

  it('submits a new daily check-in and renders streak update indicators', () => {
    render(<App />);
    
    // Go to Check-in tab
    const checkInTabButtons = screen.getAllByRole('button', { name: /Check-in Flow/i });
    fireEvent.click(checkInTabButtons[0]);
    
    expect(screen.getByText('Daily Wellness Check-in')).toBeDefined();

    // Click check-in submission button
    const logButton = screen.getByRole('button', { name: /Log Wellness Metrics/ });
    fireEvent.click(logButton);

    // Verify success banner is displayed
    expect(screen.getByText(/Check-in logged!/)).toBeDefined();
  });
});
