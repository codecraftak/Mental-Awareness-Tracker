import { CheckIn, CoachRecommendation } from '../types';

export const generateCoachRecommendations = (checkIn: CheckIn | undefined): CoachRecommendation[] => {
  const recommendations: CoachRecommendation[] = [];

  if (!checkIn) {
    // Default recommendations for exam preparation wellness
    return [
      {
        id: 'rec-def-1',
        title: 'Pomodoro Focus Intervals',
        description: 'Study for 25 minutes, then take a 5-minute break. This prevents mental fatigue and preserves focus.',
        type: 'academic',
        actionLabel: 'Start Timer',
        duration: '30 mins'
      },
      {
        id: 'rec-def-2',
        title: 'Cognitive Reset Walk',
        description: 'A brief 10-minute walk outside without screens reduces stress hormones and increases focus.',
        type: 'break',
        actionLabel: 'Take Break',
        duration: '10 mins'
      },
      {
        id: 'rec-def-3',
        title: 'Mindful Breathing',
        description: 'Focus on your breathing for 3 minutes to slow your heart rate and center your focus.',
        type: 'breathing',
        actionLabel: 'Breathe Now',
        duration: '3 mins'
      }
    ];
  }

  // 1. High Stress Recommendations
  if (checkIn.stressLevel >= 7) {
    recommendations.push({
      id: 'rec-stress-1',
      title: 'Box Breathing Technique',
      description: 'Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 5 times to down-regulate exam anxiety.',
      type: 'breathing',
      actionLabel: 'Start Guide',
      duration: '4 mins'
    });
    recommendations.push({
      id: 'rec-stress-2',
      title: 'Immediate Study De-escalation',
      description: 'Your stress is elevated. Reduce your planned study blocks today by 2 hours. Shift from mock tests to lighter review.',
      type: 'academic',
      actionLabel: 'Adjust Study Plan'
    });
    recommendations.push({
      id: 'rec-stress-3',
      title: 'Active Restoration Break',
      description: 'Step completely away from your study desk. Listen to soothing music or take a 10-minute walk without thinking about the syllabus.',
      type: 'break',
      actionLabel: 'Take Break',
      duration: '10 mins'
    });
  }

  // 2. Poor Sleep Recommendations
  if (checkIn.sleepHours <= 6) {
    recommendations.push({
      id: 'rec-sleep-1',
      title: 'Digital Curfew Protocol',
      description: 'Turn off all screens (phone, laptop, tablet) 45 minutes before sleep. Read a physical textbook or do light stretching instead.',
      type: 'sleep',
      actionLabel: 'Set Reminder'
    });
    recommendations.push({
      id: 'rec-sleep-2',
      title: 'Restorative Power Nap',
      description: 'Take a 20-minute power nap before 3 PM. Avoid longer naps, as they can interfere with night-time sleep.',
      type: 'sleep',
      actionLabel: 'Start Alarm',
      duration: '20 mins'
    });
  }

  // 3. Low Confidence Recommendations
  if (checkIn.confidenceLevel <= 4) {
    recommendations.push({
      id: 'rec-conf-1',
      title: 'Personal Progress Audit',
      description: 'Write down three complex topics you struggled with last month but understand better now. Highlight your capability.',
      type: 'confidence',
      actionLabel: 'Audit Progress',
      duration: '10 mins'
    });
    recommendations.push({
      id: 'rec-conf-2',
      title: 'Micro-Target Setup',
      description: 'Set 3 extremely small study goals (e.g. solve just 5 questions). Complete them to build immediate confidence momentum.',
      type: 'confidence',
      actionLabel: 'List Micro-Goals',
      duration: '5 mins'
    });
  }

  // 4. Low Study Satisfaction Recommendations
  if (checkIn.studySatisfaction <= 4 && checkIn.stressLevel < 7) {
    recommendations.push({
      id: 'rec-satisfy-1',
      title: 'Active Recall Study Habit',
      description: 'Rather than passive rereading, quiz yourself or explain a topic out loud to a virtual peer to boost understanding and satisfaction.',
      type: 'academic',
      actionLabel: 'Try Active Recall'
    });
    recommendations.push({
      id: 'rec-satisfy-2',
      title: 'Subject De-cluttering',
      description: 'Avoid multitasking. Dedicate the next study block to ONE narrow topic to prevent context switching frustration.',
      type: 'academic',
      actionLabel: 'De-clutter Tasks'
    });
  }

  // 5. Trigger-Specific recommendations
  if (checkIn.triggers.includes('Mock test scores') || checkIn.triggers.includes('Comparison with peers')) {
    recommendations.push({
      id: 'rec-trigger-mock',
      title: 'Mock Test Error Isolation',
      description: 'View mock scores as data diagnostics rather than personal capability scores. Isolate mistakes objectively without judging your worth.',
      type: 'confidence',
      actionLabel: 'Refining Errors'
    });
  }

  // 6. Ideal Prep State Optimization (High Confidence, low stress)
  if (checkIn.stressLevel <= 4 && checkIn.confidenceLevel >= 7 && checkIn.energyLevel >= 7) {
    recommendations.push({
      id: 'rec-opt-1',
      title: 'Deep Work Flow Session',
      description: 'You are in an optimal mental state. Tackle your most difficult revision chapter or test paper right now.',
      type: 'academic',
      actionLabel: 'Start Flow Block',
      duration: '90 mins'
    });
  }

  // Ensure we always have at least 3 helpful tips
  if (recommendations.length < 3) {
    const defaultTips = [
      {
        id: 'rec-def-1',
        title: 'Pomodoro Focus Intervals',
        description: 'Study for 25 minutes, then take a 5-minute break. This prevents mental fatigue and preserves focus.',
        type: 'academic' as const,
        actionLabel: 'Start Timer',
        duration: '30 mins'
      },
      {
        id: 'rec-def-2',
        title: 'Cognitive Reset Walk',
        description: 'A brief 10-minute walk outside without screens reduces stress hormones and increases focus.',
        type: 'break' as const,
        actionLabel: 'Take Break',
        duration: '10 mins'
      }
    ];
    defaultTips.forEach(tip => {
      if (!recommendations.some(r => r.type === tip.type)) {
        recommendations.push(tip);
      }
    });
  }

  return recommendations;
};
