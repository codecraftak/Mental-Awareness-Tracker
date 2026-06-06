import React, { useState } from 'react';
import { JournalEntry, JournalAnalysis } from '../types';
import { analyzeJournalEntry } from '../utils/journalAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { BookOpen, HelpCircle, ArrowRight, BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JournalReflectionProps {
  onJournalSubmitted: (entry: Omit<JournalEntry, 'id'>) => void;
  lastJournalEntry?: JournalEntry;
}

export const JournalReflection = ({ onJournalSubmitted, lastJournalEntry }: JournalReflectionProps) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const prompts = [
    "How was your day?",
    "What challenged you today?",
    "What are you proud of today?"
  ];

  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [journalText, setJournalText] = useState<string>('');
  const [analysis, setAnalysis] = useState<JournalAnalysis | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handlePromptSwitch = () => {
    setPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJournalText(text);
    
    // Analyze locally in real-time as the student types (debounced or simple keypress)
    if (text.trim().length > 10) {
      const result = analyzeJournalEntry(text);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    const finalAnalysis = analyzeJournalEntry(journalText);
    
    onJournalSubmitted({
      date: todayStr,
      prompt: prompts[promptIndex],
      content: journalText,
      analysis: finalAnalysis,
    });

    setSuccess(true);
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#6366f1', '#4f46e5', '#a5b4fc']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#6366f1', '#4f46e5', '#a5b4fc']
    });

    setTimeout(() => {
      setSuccess(false);
      setJournalText('');
      setAnalysis(null);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
      
      {/* 1. JOURNAL INPUT */}
      <Card className="lg:col-span-3 shadow-md flex flex-col justify-between">
        <CardHeader className="text-left border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Self-Reflection Portal</span>
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Student Journal</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePromptSwitch}
              className="text-xs font-semibold"
              type="button"
              aria-label="Switch writing prompt"
            >
              <span>Switch Prompt</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardTitle>
          <div className="mt-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-3 rounded-lg flex items-start space-x-2.5">
            <HelpCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              "{prompts[promptIndex]}"
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-grow">
          {lastJournalEntry && (
            <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Previous Reflection ({lastJournalEntry.date})
                </span>
                <Badge
                  variant={
                    lastJournalEntry.analysis.sentiment === 'positive'
                      ? 'success'
                      : lastJournalEntry.analysis.sentiment === 'negative'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="text-[9px] uppercase font-bold px-1.5 py-0"
                >
                  {lastJournalEntry.analysis.sentiment}
                </Badge>
              </div>
              <p className="italic line-clamp-2 text-slate-700 dark:text-slate-300">"{lastJournalEntry.content}"</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 flex items-center space-x-3 text-sm animate-fade-in" role="alert">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold">Reflection saved!</span> Your entry has been analyzed and stored. Keep writing to build your wellness streak.
              </div>
            </div>
          )}

          <div className="space-y-2 text-left">
            <label htmlFor="journal-textarea" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Write your thoughts here (minimum 10 characters to analyze):
            </label>
            <textarea
              id="journal-textarea"
              rows={10}
              value={journalText}
              onChange={handleTextChange}
              placeholder="Start reflecting on your study hurdles, mock test results, goals, or doubts..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-100 resize-none placeholder-slate-400 focus:outline-none"
            />
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 p-6 flex justify-end border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={handleSubmit}
            disabled={!journalText.trim() || success}
            className="w-full sm:w-auto font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2"
          >
            <span>Save Reflection</span>
          </Button>
        </CardFooter>
      </Card>

      {/* 2. REAL-TIME AI VISUALIZER */}
      <Card className="lg:col-span-2 shadow-md flex flex-col">
        <CardHeader className="text-left border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 mb-1">
            <BrainCircuit className="h-5 w-5 animate-pulse-slow" />
            <span className="text-xs font-bold uppercase tracking-wider">Local NLP Analyzer</span>
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Real-time Sentiment & Mindset
          </CardTitle>
          <CardDescription>
            MindShield processes text indicators client-side to verify mindset constructs.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 flex-grow space-y-6 text-left">
          {analysis ? (
            <div className="space-y-5 animate-fade-in">
              {/* Sentiment */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Dominant Sentiment</span>
                <Badge
                  variant={
                    analysis.sentiment === 'positive'
                      ? 'success'
                      : analysis.sentiment === 'negative'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="px-3 py-1 font-bold text-sm uppercase"
                >
                  {analysis.sentiment}
                </Badge>
              </div>

              {/* Growth Mindset Indicators */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1.5">Growth Mindset Markers</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.growthMindsetIndicators.length > 0 ? (
                    analysis.growthMindsetIndicators.map((tag) => (
                      <Badge key={tag} variant="success" className="text-[10px] font-semibold">
                        🌱 {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">None detected yet. Highlight improvements, effort, or lessons.</span>
                  )}
                </div>
              </div>

              {/* Self-Doubt / Impostor Syndrome */}
              {analysis.selfDoubtIndicators.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">Self-Doubt Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.selfDoubtIndicators.map((tag) => (
                      <Badge key={tag} variant="warning" className="text-[10px] font-semibold">
                        ❓ {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stress Indicators */}
              {analysis.stressIndicators.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">Stress Triggers Identified</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.stressIndicators.map((tag) => (
                      <Badge key={tag} variant="destructive" className="text-[10px] font-semibold">
                        ⚠️ {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Positive/Negative Emotions */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Positive Emotions</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {analysis.positiveEmotions.join(', ') || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Negative Emotions</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {analysis.negativeEmotions.join(', ') || '-'}
                  </p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Reflection Insight</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {analysis.summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-semibold">No active analysis</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Write at least 10 characters in the journal panel to trigger local NLP extraction models.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
