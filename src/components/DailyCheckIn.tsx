import React, { useState } from 'react';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import { CheckIn, MoodType, TriggerSource } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Smile, ShieldCheck, Moon, Sparkles, Brain } from 'lucide-react';

const checkInSchema = z.object({
  mood: z.enum(['great', 'good', 'neutral', 'anxious', 'sad']),
  stressLevel: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  confidenceLevel: z.number().min(1).max(10),
  sleepHours: z.number().min(0).max(24),
  studySatisfaction: z.number().min(1).max(10),
  triggers: z.array(
    z.enum([
      'Exam pressure',
      'Mock test scores',
      'Family expectations',
      'Competition',
      'Comparison with peers',
      'Lack of preparation',
      'Results anxiety',
      'Time management',
      'Sleep issues',
      'Financial concerns',
      'Future uncertainty',
    ])
  ),
});

interface DailyCheckInProps {
  onCheckInSubmitted: (checkIn: Omit<CheckIn, 'id'>) => void;
  lastCheckIn?: CheckIn;
}

export const DailyCheckIn = ({ onCheckInSubmitted, lastCheckIn }: DailyCheckInProps) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State initialized with either yesterday's data or standard positive default
  const [mood, setMood] = useState<MoodType>(lastCheckIn?.mood || 'good');
  const [stressLevel, setStressLevel] = useState<number>(lastCheckIn?.stressLevel || 3);
  const [energyLevel, setEnergyLevel] = useState<number>(lastCheckIn?.energyLevel || 7);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(lastCheckIn?.confidenceLevel || 7);
  const [sleepHours, setSleepHours] = useState<number>(lastCheckIn?.sleepHours || 7.5);
  const [studySatisfaction, setStudySatisfaction] = useState<number>(lastCheckIn?.studySatisfaction || 7);
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerSource[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  const moodEmojis: Record<MoodType, { emoji: string; label: string; color: string }> = {
    great: { emoji: '😁', label: 'Great', color: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-400' },
    good: { emoji: '🙂', label: 'Good', color: 'bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-950/20 dark:text-teal-400' },
    neutral: { emoji: '😐', label: 'Neutral', color: 'bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800/40 dark:text-slate-400' },
    anxious: { emoji: '😰', label: 'Anxious', color: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/20 dark:text-amber-400' },
    sad: { emoji: '😢', label: 'Sad', color: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/20 dark:text-rose-400' },
  };

  const triggerOptions: TriggerSource[] = [
    'Exam pressure',
    'Mock test scores',
    'Family expectations',
    'Competition',
    'Comparison with peers',
    'Lack of preparation',
    'Results anxiety',
    'Time management',
    'Sleep issues',
    'Financial concerns',
    'Future uncertainty',
  ];

  const handleTriggerToggle = (trigger: TriggerSource) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    const payload = {
      date: todayStr,
      mood,
      stressLevel,
      energyLevel,
      confidenceLevel,
      sleepHours,
      studySatisfaction,
      triggers: selectedTriggers,
    };

    const validationResult = checkInSchema.safeParse(payload);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
      setErrors(formattedErrors);
      return;
    }

    onCheckInSubmitted(payload);
    setSuccess(true);
    
    // Celebratory confetti animation
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0d9488', '#0f766e', '#14b8a6', '#f59e0b']
    });

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="text-left border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 mb-1">
          <Brain className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">MindShield Diagnostics</span>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Daily Wellness Check-in
        </CardTitle>
        <CardDescription>
          Record your emotional state and academic load. It takes less than 30 seconds and tracks burnout trends.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* Success / Error Alerts */}
          {success && (
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40 flex items-center space-x-3 text-sm animate-fade-in" role="alert">
              <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <span className="font-bold">Check-in logged!</span> Your data was added to the secure wellness tracker.
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40 text-sm" role="alert">
              <p className="font-bold mb-1">Validation Errors:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* 1. MOOD SELECTOR */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3" id="mood-label">
              1. How are you feeling overall? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-labelledby="mood-label">
              {Object.entries(moodEmojis).map(([type, details]) => {
                const isSelected = mood === type;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setMood(type as MoodType)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${details.color} border-2 ring-2 ring-teal-500/20 scale-105 shadow-sm`
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-3xl mb-1.5" role="img" aria-label={details.label}>
                      {details.emoji}
                    </span>
                    <span className="text-xs font-semibold">{details.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 2. STATS SLIDERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stress level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="stress-slider" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  2. Stress Level
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {stressLevel} / 10
                </span>
              </div>
              <input
                id="stress-slider"
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Calm / Relaxed</span>
                <span>Peak Pressure</span>
              </div>
            </div>

            {/* Energy level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="energy-slider" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  3. Energy Level
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {energyLevel} / 10
                </span>
              </div>
              <input
                id="energy-slider"
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Fatigued / Sleepy</span>
                <span>High Focus</span>
              </div>
            </div>

            {/* Confidence level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="confidence-slider" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  4. Confidence Level
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {confidenceLevel} / 10
                </span>
              </div>
              <input
                id="confidence-slider"
                type="range"
                min="1"
                max="10"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Self-Doubt</span>
                <span>Self-Efficacy</span>
              </div>
            </div>

            {/* Study Satisfaction */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="satisfaction-slider" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  5. Study Satisfaction
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {studySatisfaction} / 10
                </span>
              </div>
              <input
                id="satisfaction-slider"
                type="range"
                min="1"
                max="10"
                value={studySatisfaction}
                onChange={(e) => setStudySatisfaction(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Unproductive</span>
                <span>Highly Productive</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 3. SLEEP HOURS */}
          <div className="space-y-2 max-w-xs">
            <div className="flex justify-between items-center">
              <label htmlFor="sleep-slider" className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Moon className="h-4 w-4 text-slate-500" />
                <span>6. Sleep Hours</span>
              </label>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {sleepHours} hrs
              </span>
            </div>
            <input
              id="sleep-slider"
              type="range"
              min="0"
              max="16"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 4. STRESS TRIGGERS */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              7. Identify Stress Sources (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map((trigger) => {
                const isSelected = selectedTriggers.includes(trigger);
                return (
                  <button
                    key={trigger}
                    type="button"
                    onClick={() => handleTriggerToggle(trigger)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white shadow-sm scale-102'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {trigger}
                  </button>
                );
              })}
            </div>
          </div>

        </form>
      </CardContent>

      <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 p-6 flex justify-between border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-400 flex items-center space-x-1.5">
          <Smile className="h-4 w-4" />
          <span>Defaults pre-loaded for one-click log-in</span>
        </span>
        <Button onClick={handleSubmit} variant="default" className="w-full sm:w-auto font-bold flex items-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>Log Wellness Metrics</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
