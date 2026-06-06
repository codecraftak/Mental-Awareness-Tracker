import { CheckIn, BurnoutReport, BurnoutRiskLevel, TriggerSource, Insight } from '../types';

export const calculateBurnoutReport = (checkIns: CheckIn[]): BurnoutReport => {
  if (checkIns.length === 0) {
    return {
      score: 0,
      riskLevel: 'Low',
      explanation: 'No check-in history available yet. Complete a check-in to analyze your burnout risk.',
      intervention: 'Complete your first wellness check-in to get started.'
    };
  }

  const recent = checkIns.slice(-5);
  const count = recent.length;

  let totalStress = 0;
  let totalSleep = 0;
  let totalEnergy = 0;
  let totalConfidence = 0;
  let totalStudySatisfy = 0;

  recent.forEach(c => {
    totalStress += c.stressLevel;
    totalSleep += c.sleepHours;
    totalEnergy += c.energyLevel;
    totalConfidence += c.confidenceLevel;
    totalStudySatisfy += c.studySatisfaction;
  });

  const avgStress = totalStress / count;
  const avgSleep = totalSleep / count;
  const avgEnergy = totalEnergy / count;
  const avgConfidence = totalConfidence / count;
  const avgStudySatisfy = totalStudySatisfy / count;

  // Weighted Burnout Score Algorithm
  // High Stress (+3.5 per unit), Low Sleep (+2.5 per hour below 8), Low Energy (+2.0 per unit below 10),
  // Low Confidence (+1.0 per unit below 10), Low Study Satisfaction (+1.0 per unit below 10)
  let baseScore = 0;
  baseScore += avgStress * 3.5; // max 35
  baseScore += Math.max(0, 8 - avgSleep) * 4.0; // max 32 (if sleep avg is 0, which is unlikely)
  baseScore += Math.max(0, 10 - avgEnergy) * 2.0; // max 20
  baseScore += Math.max(0, 10 - avgConfidence) * 1.5; // max 15
  baseScore += Math.max(0, 10 - avgStudySatisfy) * 1.0; // max 10

  // Slope / Trend adjustment
  // If stress is increasing over the last 3 check-ins, add +8 points. If decreasing, subtract -8.
  if (recent.length >= 3) {
    const last = recent[recent.length - 1].stressLevel;
    const prev = recent[recent.length - 2].stressLevel;
    const prevPrev = recent[recent.length - 3].stressLevel;
    if (last > prev && prev > prevPrev) {
      baseScore += 8;
    } else if (last < prev && prev < prevPrev) {
      baseScore -= 8;
    }
  }

  // Cap score between 0 and 100
  const score = Math.round(Math.min(100, Math.max(0, baseScore)));

  let riskLevel: BurnoutRiskLevel;
  let explanation: string;
  let intervention: string;

  if (score >= 70) {
    riskLevel = 'High';
    explanation = 'Your recent stress indicators, low sleep average, and declining energy suggest a high risk of preparation burnout. You are pushing beyond safe academic limits.';
    intervention = 'Take an immediate study break. Reduce mock-test intensity for 48 hours. Focus on sleep hygiene (7.5+ hours) and practice deep breathing for 10 minutes. If feeling severely overwhelmed, speak with a trusted mentor or family member.';
  } else if (score >= 40) {
    riskLevel = 'Moderate';
    explanation = 'You are experiencing moderate exam fatigue. Elevated stress levels and slight sleep deprivation are present, but your overall confidence levels remain stable.';
    intervention = 'Integrate active restoration breaks (5-10 mins walk every 2 hours of study). Set boundaries on comparison with peers. Protect your night-time sleep cycle.';
  } else {
    riskLevel = 'Low';
    explanation = 'Your academic stress and restoration balance is healthy. Your sleep, energy, and confidence are supportive of sustained competitive exam preparation.';
    intervention = 'Maintain your current routine. Continue setting small achievable targets and check in daily to monitor any changes.';
  }

  return { score, riskLevel, explanation, intervention };
};

export interface TriggerFrequency {
  trigger: TriggerSource;
  count: number;
  percentage: number;
}

export const analyzeTriggers = (checkIns: CheckIn[]): {
  frequencies: TriggerFrequency[];
  mostCommon: TriggerSource | 'None';
  triggerCount: number;
} => {
  const counts: Record<TriggerSource, number> = {
    'Exam pressure': 0,
    'Mock test scores': 0,
    'Family expectations': 0,
    'Competition': 0,
    'Comparison with peers': 0,
    'Lack of preparation': 0,
    'Results anxiety': 0,
    'Time management': 0,
    'Sleep issues': 0,
    'Financial concerns': 0,
    'Future uncertainty': 0,
  };

  let totalTriggers = 0;
  checkIns.forEach(c => {
    c.triggers.forEach(t => {
      if (t in counts) {
        counts[t]++;
        totalTriggers++;
      }
    });
  });

  const frequencies: TriggerFrequency[] = Object.entries(counts).map(([trigger, count]) => ({
    trigger: trigger as TriggerSource,
    count,
    percentage: totalTriggers > 0 ? Math.round((count / totalTriggers) * 100) : 0,
  })).sort((a, b) => b.count - a.count);

  const mostCommon = frequencies[0] && frequencies[0].count > 0 ? frequencies[0].trigger : 'None';

  return {
    frequencies,
    mostCommon,
    triggerCount: totalTriggers
  };
};

export const generateWeeklyInsights = (checkIns: CheckIn[]): Insight[] => {
  const insights: Insight[] = [];
  if (checkIns.length < 3) {
    insights.push({
      id: 'ins-default',
      type: 'info',
      message: 'More wellness data is needed to generate personalized wellness correlation insights. Check in for at least 3 days.',
      icon: 'HelpCircle'
    });
    return insights;
  }

  // Insight 1: Correlation between sleep and mood
  // Look at check-ins with sleepHours >= 7 and check if mood is 'great' or 'good'
  const highSleep = checkIns.filter(c => c.sleepHours >= 7);
  const highSleepGoodMood = highSleep.filter(c => c.mood === 'great' || c.mood === 'good');
  if (highSleep.length > 0 && (highSleepGoodMood.length / highSleep.length) >= 0.6) {
    const pct = Math.round((highSleepGoodMood.length / highSleep.length) * 100);
    insights.push({
      id: 'ins-sleep-mood',
      type: 'success',
      message: `Your mood is rated Good or Great on ${pct}% of days when sleep exceeds 7 hours. Rest is accelerating your mental clarity.`,
      icon: 'Moon'
    });
  }

  // Insight 2: Trigger Correlation with Stress Spikes
  // Look at days where stressLevel >= 7. What triggers were selected?
  const highStressDays = checkIns.filter(c => c.stressLevel >= 7);
  if (highStressDays.length > 0) {
    const triggerCounts: Record<string, number> = {};
    highStressDays.forEach(c => {
      c.triggers.forEach(t => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    });
    const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTrigger && topTrigger[1] > 0) {
      insights.push({
        id: 'ins-stress-trigger',
        type: 'warning',
        message: `"${topTrigger[0]}" is active during ${Math.round((topTrigger[1] / highStressDays.length) * 100)}% of your high-stress days. Try to focus on active coping protocols for this source.`,
        icon: 'AlertTriangle'
      });
    }
  }

  // Insight 3: Confidence Trend
  // Compare the average confidence level of the second half of check-ins vs the first half
  const half = Math.floor(checkIns.length / 2);
  const firstHalf = checkIns.slice(0, half);
  const secondHalf = checkIns.slice(half);
  if (firstHalf.length > 0 && secondHalf.length > 0) {
    const firstAvg = firstHalf.reduce((sum, c) => sum + c.confidenceLevel, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, c) => sum + c.confidenceLevel, 0) / secondHalf.length;
    const diff = secondAvg - firstAvg;
    const pctChange = Math.round((diff / (firstAvg || 1)) * 100);
    
    if (pctChange > 5) {
      insights.push({
        id: 'ins-confidence',
        type: 'success',
        message: `Your confidence has increased by ${pctChange}% this week. Keeping consistent study routines is boosting your self-efficacy.`,
        icon: 'TrendingUp'
      });
    } else if (pctChange < -5) {
      insights.push({
        id: 'ins-confidence-warn',
        type: 'warning',
        message: `Confidence is down by ${Math.abs(pctChange)}% compared to earlier this week. Set smaller, bite-sized revision targets to rebuild momentum.`,
        icon: 'TrendingDown'
      });
    }
  }

  // Insight 4: Study satisfaction correlation with sleep
  const avgSatisfactionHighSleep = highSleep.reduce((sum, c) => sum + c.studySatisfaction, 0) / (highSleep.length || 1);
  const lowSleep = checkIns.filter(c => c.sleepHours < 6.5);
  const avgSatisfactionLowSleep = lowSleep.reduce((sum, c) => sum + c.studySatisfaction, 0) / (lowSleep.length || 1);
  
  if (highSleep.length > 0 && lowSleep.length > 0 && (avgSatisfactionHighSleep - avgSatisfactionLowSleep) >= 1) {
    insights.push({
      id: 'ins-study-sleep',
      type: 'info',
      message: `Your study satisfaction increases by ${Math.round((avgSatisfactionHighSleep - avgSatisfactionLowSleep) * 10)}% when you sleep more. Sleeping less is decreasing your daytime study productivity.`,
      icon: 'Award'
    });
  }

  return insights;
};
