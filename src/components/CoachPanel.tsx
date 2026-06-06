import React, { useState } from 'react';
import { CoachRecommendation, CheckIn } from '../types';
import { generateCoachRecommendations } from '../utils/coachEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Dialog } from './ui/Dialog';
import {
  Compass,
  Moon,
  Activity,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CoachPanelProps {
  latestCheckIn?: CheckIn;
}

export const CoachPanel = ({ latestCheckIn }: CoachPanelProps) => {
  const recommendations = generateCoachRecommendations(latestCheckIn);
  const [activeExercise, setActiveExercise] = useState<CoachRecommendation | null>(null);
  
  // Custom Breathing State inside the Coach Panel
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [timer, setTimer] = useState(4);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;
    if (activeExercise && activeExercise.type === 'breathing') {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setBreathingStep((step) => {
              if (step === 'inhale') { setTimer(4); return 'hold'; }
              if (step === 'hold') { setTimer(4); return 'exhale'; }
              if (step === 'exhale') { setTimer(4); return 'hold2'; }
              setTimer(4); return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExercise, breathingStep]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'breathing':
        return <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      case 'sleep':
        return <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case 'break':
        return <Compass className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'confidence':
        return <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case 'academic':
        return <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
    }
  };

  const handleActionClick = (rec: CoachRecommendation) => {
    setActiveExercise(rec);
    if (rec.type === 'breathing') {
      setBreathingStep('inhale');
      setTimer(4);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Dynamic Summary Card */}
      <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-500/5 to-indigo-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 mb-1">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">MindShield Coaching Portal</span>
          </div>
          <CardTitle className="text-xl font-bold">Your Personalized Support Plan</CardTitle>
          <CardDescription>
            {latestCheckIn
              ? `Generated based on your check-in from today (Stress: ${latestCheckIn.stressLevel}/10, Sleep: ${latestCheckIn.sleepHours} hrs).`
              : 'Log a daily check-in to get custom behavioral health suggestions. Showing baseline recommendations.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid of dynamic recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:scale-101 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-x-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0">
                {getIcon(rec.type)}
              </div>
              {rec.duration && (
                <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-500 dark:text-slate-400 flex items-center space-x-1 shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{rec.duration}</span>
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-grow text-left space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {rec.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {rec.description}
              </p>
            </CardContent>
            <CardFooter className="pt-2 border-t border-slate-50 dark:border-slate-900/60 mt-3 p-4 flex justify-end">
              <Button
                onClick={() => handleActionClick(rec)}
                variant="ghost"
                size="sm"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 px-2 flex items-center space-x-1"
              >
                <span>{rec.actionLabel}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* INTERACTIVE GUIDE DIALOG */}
      {activeExercise && (
        <Dialog
          isOpen={!!activeExercise}
          onClose={() => setActiveExercise(null)}
          title={activeExercise.title}
        >
          {activeExercise.type === 'breathing' ? (
            <div className="text-center py-6 space-y-6">
              {/* Pulsing breathing indicator */}
              <div className="flex items-center justify-center">
                <div
                  className={`h-36 w-36 rounded-full flex flex-col items-center justify-center border-4 border-teal-500/20 bg-teal-500/10 transition-all duration-1000 ${
                    breathingStep === 'inhale' ? 'scale-115' : breathingStep === 'exhale' ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <span className="text-xl font-black text-teal-600 dark:text-teal-400 capitalize">
                    {breathingStep === 'hold2' ? 'Hold' : breathingStep}
                  </span>
                  <span className="text-3xl font-extrabold text-teal-800 dark:text-teal-200 mt-1">
                    {timer}s
                  </span>
                </div>
              </div>
              <div className="space-y-1 max-w-xs mx-auto">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {breathingStep === 'inhale' && 'Breathe in slowly through your nose.'}
                  {breathingStep === 'hold' && 'Hold your breath comfortably.'}
                  {breathingStep === 'exhale' && 'Exhale slowly through your mouth.'}
                  {breathingStep === 'hold2' && 'Wait before taking another breath.'}
                </p>
                <p className="text-xs text-slate-400">
                  Box breathing balances the heart-rate-variability and calms competitive nerves.
                </p>
              </div>
              <Button onClick={() => setActiveExercise(null)} variant="default" size="sm" className="font-bold">
                Close Guide
              </Button>
            </div>
          ) : (
            <div className="py-4 space-y-4 text-left">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeExercise.description}
              </p>
              
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-2.5">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider block">Suggested Execution Steps</span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  {activeExercise.type === 'sleep' && (
                    <>
                      <li>Set an alarm on your phone for 45 minutes before your targeted sleep time.</li>
                      <li>When it rings, power off your computer, phone, and tablet screen completely.</li>
                      <li>Keep your study materials outside your sleeping zone to build a strong boundary.</li>
                    </>
                  )}
                  {activeExercise.type === 'break' && (
                    <>
                      <li>Put down all booklets. Set a timer for 10 minutes.</li>
                      <li>Walk in a safe, quiet outdoor path or hallway without using social media.</li>
                      <li>Focus on observing surrounding sights or sounds to ground your mind.</li>
                    </>
                  )}
                  {activeExercise.type === 'confidence' && (
                    <>
                      <li>Open a blank paper sheet. Write down your main preparation victories this month.</li>
                      <li>Outline exactly how much progress you have made from where you started.</li>
                      <li>Frame your current hurdles as target puzzles to work on step-by-step.</li>
                    </>
                  )}
                  {activeExercise.type === 'academic' && (
                    <>
                      <li>Set a standard Pomodoro timer for 25 minutes of zero-distraction revision.</li>
                      <li>Solve questions sequentially without looking up answers immediately.</li>
                      <li>Take a 5-minute breather before starting the next slot to prevent burnout.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setActiveExercise(null)} variant="default" size="sm" className="font-bold">
                  Got it, thanks
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      )}

    </div>
  );
};
