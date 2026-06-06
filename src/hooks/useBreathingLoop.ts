import { useState, useEffect } from 'react';

export type BreathingStep = 'inhale' | 'hold' | 'exhale' | 'hold2';

export interface UseBreathingLoopResult {
  breathingStep: BreathingStep;
  timer: number;
  resetBreathing: () => void;
}

export const useBreathingLoop = (isActive: boolean): UseBreathingLoopResult => {
  const [breathingStep, setBreathingStep] = useState<BreathingStep>('inhale');
  const [timer, setTimer] = useState<number>(4);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setBreathingStep((step) => {
              if (step === 'inhale') return 'hold';
              if (step === 'hold') return 'exhale';
              if (step === 'exhale') return 'hold2';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      const handle = setTimeout(() => {
        setBreathingStep('inhale');
        setTimer(4);
      }, 0);
      return () => clearTimeout(handle);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const resetBreathing = () => {
    setBreathingStep('inhale');
    setTimer(4);
  };

  return { breathingStep, timer, resetBreathing };
};
