import { JournalAnalysis } from '../types';

// Keyword mappings for rule-based client-side text parsing
const KEYWORDS = {
  positiveEmotions: [
    /\b(proud|happy|good|excited|calm|relaxed|accomplish(ed|es)?|solve(d|s)?|underst(ood|and)?|achieve(d|s)?|satisf(ied|action)?|peace|confident|progress|great|smooth|awesome)\b/gi,
  ],
  negativeEmotions: [
    /\b(tired|exhaust(ed|ion)?|anxi(ous|ety)?|stress(ed|ful)?|worr(ied|y)?|sad(ness)?|depress(ed|ion)?|breakdown(s)?|fail(ed|ing|ure)?|hope(less)?|fear(s|ful)?|cry(ing)?|pressure|angry|slow|fatigue|poorly)\b/gi,
  ],
  growthMindset: [
    /\b(learn(ing|s)?|improve(s|d|ment)?|try(ing)? again|practice(s|d)?|mistake(s)?|challenge(s|d)?|growth|process|habit(s)?|step by step|progress|feedback|persist(ent|ence)?|effort(s)?|strateg(y|ies)?|push(ing|ed)?|try(ing)?|focus(ed|ing|es)?|revision(s)?)\b/gi,
    /didn't give up/gi,
    /focus.*on.*learning/gi,
    /learning from.*mistakes/gi
  ],
  stress: [
    /\b(overwhelmed|exam pressure|pressure|mock test(s)?|exam(s)?|syllabus|time management|family expectations|sleep|comparison(s)?|peer(s)?|results|scores|anxiety)\b/gi,
  ],
  selfDoubt: [
    /\b(useless|not good enough|doubt myself|stupid|fail(ed|ing|s)?|hopeless|comparison(s)?|far behind|lose|give up|failing|impossible|can't do it)\b/gi,
  ],
};

export const analyzeJournalEntry = (content: string): JournalAnalysis => {
  const cleanContent = content.trim();

  if (!cleanContent) {
    return {
      sentiment: 'neutral',
      positiveEmotions: [],
      negativeEmotions: [],
      growthMindsetIndicators: [],
      stressIndicators: [],
      selfDoubtIndicators: [],
      summary: 'Write a reflection above to analyze your emotions and mindset indicators.'
    };
  }

  // Extract unique matches for each category
  const extractMatches = (patterns: RegExp[]): string[] => {
    const matchesSet = new Set<string>();
    patterns.forEach(pattern => {
      // Reset regex index for safety
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(cleanContent)) !== null) {
        matchesSet.add(match[0].toLowerCase());
      }
    });
    return Array.from(matchesSet);
  };

  const positiveEmotions = extractMatches(KEYWORDS.positiveEmotions);
  const negativeEmotions = extractMatches(KEYWORDS.negativeEmotions);
  const growthMindsetIndicators = extractMatches(KEYWORDS.growthMindset);
  const stressIndicators = extractMatches(KEYWORDS.stress);
  const selfDoubtIndicators = extractMatches(KEYWORDS.selfDoubt);

  // Sentiment scoring: Positive matches - Negative matches
  const sentimentScore = positiveEmotions.length - negativeEmotions.length;
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  
  if (sentimentScore > 0) {
    sentiment = 'positive';
  } else if (sentimentScore < 0) {
    sentiment = 'negative';
  }

  // Generate dynamic, supportive rules-based summary
  let summary = '';
  if (sentiment === 'positive') {
    summary = "Your entry shows a positive outlook. You're feeling focused or satisfied with your study progression.";
    if (growthMindsetIndicators.length > 0) {
      summary += " It is wonderful to see you framing challenges with a growth mindset. Keep learning from this process.";
    }
  } else if (sentiment === 'negative') {
    summary = "You're experiencing some emotional weight, tiredness, or anxiety today.";
    if (selfDoubtIndicators.length > 0) {
      summary += " Remember that mock scores and preparation struggles do not define your worth. Self-doubt is normal, but take it step by step.";
    }
    if (stressIndicators.length > 0) {
      summary += " Active stress triggers like exams or preparation density are present. Protect your relaxation windows.";
    }
  } else {
    summary = "Your emotional state appears balanced or reflective. You are documenting your routine in a steady way.";
    if (growthMindsetIndicators.length > 0) {
      summary += " Active resilience patterns are visible as you navigate study routines.";
    }
  }

  return {
    sentiment,
    positiveEmotions,
    negativeEmotions,
    growthMindsetIndicators,
    stressIndicators,
    selfDoubtIndicators,
    summary,
  };
};
