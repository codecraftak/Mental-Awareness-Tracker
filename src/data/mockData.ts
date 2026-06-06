import { CheckIn, JournalEntry, MoodType, TriggerSource } from '../types';

export const generateMockHistory = (): { checkIns: CheckIn[]; journalEntries: JournalEntry[] } => {
  const checkIns: CheckIn[] = [];
  const journalEntries: JournalEntry[] = [];
  
  const today = new Date();
  
  // We'll generate data for the past 14 days
  const moods: MoodType[] = ['good', 'great', 'neutral', 'anxious', 'sad', 'neutral', 'good', 'anxious', 'sad', 'neutral', 'good', 'great', 'neutral', 'good'];
  const sleepHours = [7.5, 8.0, 6.2, 5.5, 5.0, 6.5, 7.2, 5.8, 4.8, 6.0, 7.0, 7.8, 6.8, 7.2];
  const stressLevels = [3, 2, 5, 7, 8, 6, 4, 7, 9, 6, 4, 3, 5, 4];
  const energyLevels = [8, 9, 6, 5, 4, 6, 7, 5, 3, 6, 7, 8, 6, 7];
  const confidenceLevels = [7, 8, 6, 4, 3, 5, 6, 4, 3, 5, 6, 7, 6, 7];
  const studySatisfactions = [8, 8, 7, 5, 4, 6, 7, 4, 3, 6, 7, 8, 6, 7];
  
  const triggerPool: TriggerSource[][] = [
    [],
    [],
    ['Mock test scores', 'Comparison with peers'],
    ['Exam pressure', 'Lack of preparation', 'Time management'],
    ['Exam pressure', 'Mock test scores', 'Family expectations', 'Future uncertainty'],
    ['Time management', 'Sleep issues'],
    ['Comparison with peers'],
    ['Mock test scores', 'Results anxiety'],
    ['Exam pressure', 'Mock test scores', 'Comparison with peers', 'Sleep issues', 'Future uncertainty'],
    ['Time management', 'Lack of preparation'],
    [],
    [],
    ['Time management'],
    ['Comparison with peers']
  ];

  const journalPrompts = [
    "What are you proud of today?",
    "How was your day?",
    "What challenged you today?",
    "How was your day?",
    "What challenged you today?",
    "What are you proud of today?",
    "How was your day?",
    "What challenged you today?",
    "What challenged you today?",
    "What are you proud of today?",
    "What are you proud of today?",
    "How was your day?",
    "What challenged you today?",
    "What are you proud of today?"
  ];

  const journalContents = [
    "Felt good about solving 40 complex physics numericals today. The formulas are starting to make sense. I'm proud that I didn't give up when I got stuck on the thermodynamics questions.",
    "A smooth day of self-study. Managed to complete the entire organic chemistry reaction mechanism chapter. Confidence is high.",
    "I took a mock test today and my score was disappointing. I spent hours analyzing my mistakes, but seeing my peers score much higher makes me doubt myself. Need to work on speed.",
    "The exam prep is getting intense. I didn't sleep well last night, worrying about time management. There is just too much syllabus left and not enough time. I feel a bit overwhelmed.",
    "My family called and asked about my mock scores. I know they mean well, but the pressure is heavy. I feel like I'm failing their expectations. I did poorly on the mock test again. I feel like I'm not good enough for JEE.",
    "Woke up late and tired. Sleep issues are affecting my concentration. However, I managed to study for 5 hours. I am trying to focus on my study plan and ignore the noise.",
    "Studied with a friend today. It's hard not to compare my progress with theirs. They seem so much faster. I am proud that I kept pushing anyway. I will focus on my own learning path.",
    "Felt very anxious about the upcoming weekly test. Wrote down a formula sheet which helped reduce some anxiety. I feel like the results anxiety is holding me back.",
    "Utterly exhausted. Got a very bad mock score and had a breakdown. I feel like all my preparation is useless and I will never clear the exam. I have a lot of self-doubt. My sleep was terrible.",
    "A bit of recovery. I took a short break in the morning. Decided to tackle small achievable math topics instead of mock tests. Feeling slightly more in control of my study goals.",
    "I am proud that I woke up early and followed a healthy study habit. I solved 50 chemistry questions. Doing this step by step. I can improve if I keep practicing.",
    "Had a great study session today. Solved previous year UPSC questions and got most of them right! Feeling proud of my growth. I will keep learning from my mistakes.",
    "A challenging day of revision. It was hard to stay focused because of future uncertainty. But I did some deep breathing and got back to work. Small progress is still progress.",
    "Completed my weekly syllabus targets. Wrote a reflection of what I did right. I am proud that I remained consistent even on hard days."
  ];

  const journalAnalyses = [
    {
      sentiment: 'positive' as const,
      positiveEmotions: ['good', 'proud', 'sense'],
      negativeEmotions: ['stuck'],
      growthMindsetIndicators: ['didn\'t give up', 'stuck', 'make sense'],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: "You displayed a positive outlook today, highlighting pride in solving tough physics numericals and exhibiting resilience when stuck."
    },
    {
      sentiment: 'positive' as const,
      positiveEmotions: ['smooth', 'complete', 'high'],
      negativeEmotions: [],
      growthMindsetIndicators: ['complete'],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: "High confidence and a smooth day completing organic chemistry study targets."
    },
    {
      sentiment: 'negative' as const,
      positiveEmotions: [],
      negativeEmotions: ['disappointing', 'doubt', 'mistakes'],
      growthMindsetIndicators: ['analyzing mistakes', 'work on speed'],
      stressIndicators: ['disappointing mock test', 'peer comparison'],
      selfDoubtIndicators: ['doubt myself'],
      summary: "Negative sentiment driven by disappointing mock test scores and peer comparisons. Good growth mindset indicator in analyzing errors."
    },
    {
      sentiment: 'negative' as const,
      positiveEmotions: [],
      negativeEmotions: ['intense', 'worrying', 'overwhelmed'],
      growthMindsetIndicators: [],
      stressIndicators: ['time management', 'incomplete syllabus', 'overwhelmed'],
      selfDoubtIndicators: [],
      summary: "High stress and anxiety about time management and syllabus completion, accompanied by sleep issues."
    },
    {
      sentiment: 'negative' as const,
      positiveEmotions: [],
      negativeEmotions: ['pressure', 'heavy', 'failing', 'poorly'],
      growthMindsetIndicators: [],
      stressIndicators: ['family expectations', 'poor mock scores'],
      selfDoubtIndicators: ['failing expectations', 'not good enough'],
      summary: "High self-doubt and pressure related to family expectations and mock exam performance. Recommended for burnout monitoring."
    },
    {
      sentiment: 'neutral' as const,
      positiveEmotions: ['trying', 'focus'],
      negativeEmotions: ['tired', 'sleep issues'],
      growthMindsetIndicators: ['trying to focus', 'study plan'],
      stressIndicators: ['sleep issues'],
      selfDoubtIndicators: [],
      summary: "Neutral tone. Fatigue and sleep issues present, but you are actively focusing on study habits and routine."
    },
    {
      sentiment: 'neutral' as const,
      positiveEmotions: ['proud', 'kept pushing'],
      negativeEmotions: ['hard', 'compare'],
      growthMindsetIndicators: ['learning path', 'kept pushing'],
      stressIndicators: ['peer comparison'],
      selfDoubtIndicators: [],
      summary: "Neutral to positive. Reflecting on comparison stress but showing great determination to follow your own learning path."
    },
    {
      sentiment: 'negative' as const,
      positiveEmotions: ['helped', 'reduce'],
      negativeEmotions: ['anxious', 'anxiety', 'holding back'],
      growthMindsetIndicators: ['formula sheet'],
      stressIndicators: ['weekly test', 'results anxiety'],
      selfDoubtIndicators: [],
      summary: "Anxiety is high due to weekly test prep, though creating a formula sheet shows positive active coping."
    },
    {
      sentiment: 'negative' as const,
      positiveEmotions: [],
      negativeEmotions: ['exhausted', 'bad mock score', 'breakdown', 'useless', 'never clear', 'self-doubt'],
      growthMindsetIndicators: [],
      stressIndicators: ['mock score breakdown', 'sleep issues'],
      selfDoubtIndicators: ['useless', 'never clear', 'self-doubt'],
      summary: "Critical stress levels. High self-doubt, feeling of futility, exhaustion, and bad mock scores are active burnout warning signs."
    },
    {
      sentiment: 'neutral' as const,
      positiveEmotions: ['recovery', 'control', 'goals'],
      negativeEmotions: ['slightly'],
      growthMindsetIndicators: ['achievable topics', 'short break', 'control'],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: "Actively recovering from stress by taking a break and shifting focus to small achievable math topics."
    },
    {
      sentiment: 'positive' as const,
      positiveEmotions: ['proud', 'healthy', 'improve'],
      negativeEmotions: [],
      growthMindsetIndicators: ['improve', 'step by step', 'keep practicing'],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: "Positive growth mindset. Emphasizing daily study habits, practice, and incremental improvements."
    },
    {
      sentiment: 'positive' as const,
      positiveEmotions: ['great', 'right', 'proud', 'growth'],
      negativeEmotions: [],
      growthMindsetIndicators: ['learning from my mistakes', 'growth'],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: "Excellent positive session. Demonstrating growth mindset by actively framing mistakes as learning opportunities."
    },
    {
      sentiment: 'neutral' as const,
      positiveEmotions: ['progress', 'consistent'],
      negativeEmotions: ['challenging', 'uncertainty'],
      growthMindsetIndicators: ['deep breathing', 'small progress', 'revision'],
      stressIndicators: ['future uncertainty'],
      selfDoubtIndicators: [],
      summary: "Neutral reflection. Coping with uncertainty via deep breathing and valuing incremental progress."
    },
    {
      sentiment: 'positive' as const,
      positiveEmotions: ['proud', 'consistent'],
      negativeEmotions: ['hard'],
      growthMindsetIndicators: ['consistent', 'weekly targets'],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: "Reflecting on a successful week with solid consistency and pride in hitting exam syllabus targets."
    }
  ];

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    checkIns.push({
      id: `checkin-${i}`,
      date: dateStr,
      mood: moods[13 - i],
      stressLevel: stressLevels[13 - i],
      energyLevel: energyLevels[13 - i],
      confidenceLevel: confidenceLevels[13 - i],
      sleepHours: sleepHours[13 - i],
      studySatisfaction: studySatisfactions[13 - i],
      triggers: triggerPool[13 - i],
    });

    journalEntries.push({
      id: `journal-${i}`,
      date: dateStr,
      prompt: journalPrompts[13 - i],
      content: journalContents[13 - i],
      analysis: journalAnalyses[13 - i]
    });
  }

  return { checkIns, journalEntries };
};
