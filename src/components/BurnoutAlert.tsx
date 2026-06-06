import { useState } from 'react';
import { BurnoutReport } from '../types';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Dialog } from './ui/Dialog';
import { AlertOctagon, Heart, RefreshCw, X, UserCheck, FlameKindling } from 'lucide-react';
import { useBreathingLoop } from '../hooks/useBreathingLoop';

interface BurnoutAlertProps {
  report: BurnoutReport;
}

export const BurnoutAlert = ({ report }: BurnoutAlertProps) => {
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const { breathingStep, timer, resetBreathing } = useBreathingLoop(showBreathingModal);

  if (report.riskLevel === 'Low' || isDismissed) return null;

  const getRiskColors = () => {
    if (report.riskLevel === 'High') {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40',
        text: 'text-rose-800 dark:text-rose-300',
        accentText: 'text-rose-600 dark:text-rose-400',
        badge: 'destructive' as const,
      };
    }
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40',
      text: 'text-amber-800 dark:text-amber-300',
      accentText: 'text-amber-600 dark:text-amber-400',
      badge: 'warning' as const,
    };
  };

  const colors = getRiskColors();

  return (
    <>
      <Card className={`border shadow-sm animate-pulse-slow ${colors.bg}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-sm shrink-0">
                <AlertOctagon className={`h-6 w-6 ${colors.accentText}`} />
              </div>
              <div className="space-y-1.5 text-left">
                <div className="flex items-center space-x-2.5">
                  <span className={`text-base font-bold ${colors.text}`}>
                    Early Burnout Warning
                  </span>
                  <Badge variant={colors.badge} className="font-extrabold px-2.5 py-0.5">
                    {report.riskLevel} Risk ({report.score}/100)
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {report.explanation}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <Button
                    onClick={() => setShowBreathingModal(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold hover:bg-white dark:hover:bg-slate-900 flex items-center space-x-1.5"
                  >
                    <FlameKindling className="h-3.5 w-3.5" />
                    <span>Start 4-7-8 Breathing Guide</span>
                  </Button>
                  
                  <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 pl-1">
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                    <span>Focus on restoration today</span>
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
              aria-label="Dismiss warning alert"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* BREATHING GUIDANCE DIALOG */}
      <Dialog
        isOpen={showBreathingModal}
        onClose={() => setShowBreathingModal(false)}
        title="4-7-8 Calming Breathing Guide"
      >
        <div className="text-center py-8 space-y-6">
          {/* Animated pulsing circle */}
          <div className="flex items-center justify-center">
            <div
              className={`h-40 w-40 rounded-full flex flex-col items-center justify-center border-4 border-teal-500/20 bg-teal-500/10 transition-all duration-1000 ${
                breathingStep === 'inhale' ? 'scale-115' : breathingStep === 'exhale' ? 'scale-90' : 'scale-100'
              }`}
            >
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400 capitalize">
                {breathingStep === 'hold2' ? 'Hold' : breathingStep}
              </span>
              <span className="text-3xl font-extrabold text-teal-800 dark:text-teal-200 mt-1">
                {timer}s
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {breathingStep === 'inhale' && 'Inhale deeply through your nose.'}
              {breathingStep === 'hold' && 'Hold your breath.'}
              {breathingStep === 'exhale' && 'Exhale slowly through your mouth.'}
              {breathingStep === 'hold2' && 'Hold before inhaling again.'}
            </p>
            <p className="text-xs text-slate-400 leading-normal">
              This breathing exercise helps reduce autonomic nervous system arousal, slowing down exam-related racing thoughts.
            </p>
          </div>

          <div className="flex justify-center space-x-2 pt-2">
            <Button
              onClick={resetBreathing}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              <span>Reset Timer</span>
            </Button>
            <Button
              onClick={() => setShowBreathingModal(false)}
              variant="default"
              size="sm"
              className="text-xs font-semibold"
            >
              <UserCheck className="h-3 w-3 mr-1" />
              <span>Done</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
