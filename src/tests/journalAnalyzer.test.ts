import { describe, it, expect } from 'vitest';
import { analyzeJournalEntry } from '../utils/journalAnalyzer';

describe('journalAnalyzer - Local Keyword NLP', () => {
  it('should return neutral summary for empty journal inputs', () => {
    const analysis = analyzeJournalEntry('');
    expect(analysis.sentiment).toBe('neutral');
    expect(analysis.positiveEmotions).toHaveLength(0);
    expect(analysis.growthMindsetIndicators).toHaveLength(0);
  });

  it('should detect positive sentiment and growth mindset indicators', () => {
    const entry = "I feel very proud of my practice today. I made some mistakes but I will learn from them and improve.";
    const analysis = analyzeJournalEntry(entry);

    expect(analysis.sentiment).toBe('positive');
    expect(analysis.positiveEmotions).toContain('proud');
    expect(analysis.growthMindsetIndicators).toContain('learn');
    expect(analysis.growthMindsetIndicators).toContain('improve');
    expect(analysis.growthMindsetIndicators).toContain('practice');
    expect(analysis.selfDoubtIndicators).toHaveLength(0);
  });

  it('should detect negative sentiment, self-doubt, and exam stress triggers', () => {
    const entry = "The mock test scores were terrible. I feel useless and doubt myself. The exam pressure is overwhelming.";
    const analysis = analyzeJournalEntry(entry);

    expect(analysis.sentiment).toBe('negative');
    expect(analysis.negativeEmotions).toContain('pressure');
    expect(analysis.selfDoubtIndicators).toContain('useless');
    expect(analysis.selfDoubtIndicators).toContain('doubt myself');
    expect(analysis.stressIndicators).toContain('mock test');
    expect(analysis.stressIndicators).toContain('exam pressure');
  });

  it('should capture custom compound growth mindset phrases', () => {
    const entry = "I didn't give up even when chemical bonding was confusing. I am focusing on my learning path.";
    const analysis = analyzeJournalEntry(entry);
    
    expect(analysis.growthMindsetIndicators.some(x => x.includes("didn't give up"))).toBe(true);
    expect(analysis.growthMindsetIndicators.some(x => x.includes("learning"))).toBe(true);
  });
});
