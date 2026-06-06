export type MoodType = 'great' | 'good' | 'neutral' | 'anxious' | 'sad';

export type TriggerSource =
  | 'Exam pressure'
  | 'Mock test scores'
  | 'Family expectations'
  | 'Competition'
  | 'Comparison with peers'
  | 'Lack of preparation'
  | 'Results anxiety'
  | 'Time management'
  | 'Sleep issues'
  | 'Financial concerns'
  | 'Future uncertainty';

export interface CheckIn {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  mood: MoodType;
  stressLevel: number; // 1 to 10
  energyLevel: number; // 1 to 10
  confidenceLevel: number; // 1 to 10
  sleepHours: number; // hours
  studySatisfaction: number; // 1 to 10
  triggers: TriggerSource[];
}

export interface JournalAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  positiveEmotions: string[];
  negativeEmotions: string[];
  growthMindsetIndicators: string[];
  stressIndicators: string[];
  selfDoubtIndicators: string[];
  summary: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  prompt: string;
  content: string;
  analysis: JournalAnalysis;
}

export type BurnoutRiskLevel = 'Low' | 'Moderate' | 'High';

export interface BurnoutReport {
  score: number; // 0 to 100
  riskLevel: BurnoutRiskLevel;
  explanation: string;
  intervention: string;
}

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  icon: string;
}

export interface StreakInfo {
  checkInStreak: number;
  journalStreak: number;
  wellnessScore: number; // 0-100 aggregated wellness indicator
}

export interface CoachRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'break' | 'confidence' | 'sleep' | 'academic';
  actionLabel: string;
  duration?: string; // e.g. "5 mins"
}
