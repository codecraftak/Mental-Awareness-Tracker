import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Button } from './ui/Button';
import { Calendar, Compass, ShieldAlert, Award, Volume2, Anchor, Play } from 'lucide-react';
import { Dialog } from './ui/Dialog';

export const SupportCenter = () => {
  const [activeVoiceModal, setActiveVoiceModal] = useState<string | null>(null);

  const copingData = {
    before: {
      title: 'Before the Exam: Peak Prep Phase',
      icon: Calendar,
      anxieties: 'High cortisol, memory doubts, insomnia, final revision overwhelm.',
      strategies: [
        'Maintain a strict 7+ hours sleep cycle; cognitive recall degrades by 30% with sleep deprivation.',
        'Avoid studying new topics in the final 24 hours. Focus solely on reviewing formula sheets and high-yield notes.',
        'Create a "Packing Checklist" (admit cards, pens, water bottle) the night before to eliminate morning panic loops.',
        'The 5-5-5 Rule: If you feel a panic wave, list 5 things you can see, 5 things you can hear, and 5 things you can physically touch.',
      ],
      microHabit: 'The Day-Before Lockdown: Close all mock-test papers by 6 PM the night before the exam. Relax with family or a walk.',
    },
    during: {
      title: 'During the Exam: The Exam Hall',
      icon: Compass,
      anxieties: 'Mind blanking, panic from tough early questions, time anxiety.',
      strategies: [
        'The 2-Minute Skip Rule: If a question takes more than 90 seconds without a clear path, flag it and skip immediately. Do not trigger ego-battling.',
        'Scribble-Pad Grounding: If mind goes blank, write down basic constants or formulas on the rough sheet. Physical movement restores retrieval pathways.',
        'Tactical Breath: Take 3 long, silent breaths before reading the question booklet. This reduces adrenaline surges.',
        'Tunnel Vision Protocol: Avoid looking at how fast other candidates are writing or turning pages. Their pace is irrelevant to your scoring accuracy.',
      ],
      microHabit: 'The Section Reset: Take a 5-second mental pause between switching sections (e.g. Physics to Chemistry) to clear cognitive load.',
    },
    after: {
      title: 'After the Exam: Post-Exam Decompression',
      icon: ShieldAlert,
      anxieties: 'Answer key obsession, peer comparisons, guilt over silly mistakes.',
      strategies: [
        'Establish an Answer-Key embargo for 24 hours. Comparing answers immediately after does not change the score, only increases anxiety.',
        'Recognize the "Hindsight Bias": Silliness of mistakes appears obvious *after* seeing the answer key, but was logical under hall pressure.',
        'Plan a small reward immediately after the paper (a meal, a movie, or meeting a friend) to signal to your brain that the ordeal is completed.',
        'Forgive silly errors. Out of 180 questions, 5-10 silly errors are statistically standard. Focus on the total aggregate potential.',
      ],
      microHabit: 'The Clean Desk: Pack away the notes of the completed exam. Put them out of sight to create a mental boundary before the next phase.',
    },
    results: {
      title: 'Result Day: Navigating Outcome Anxiety',
      icon: Award,
      anxieties: 'Fear of failure, familial shame, future path uncertainty.',
      strategies: [
        'Separate your Self-Worth from the Rank. You are a human being preparing for a career, not a single percentile number.',
        'Support network setup: Choose 1-2 trusted friends or family members to view the results with. Block WhatsApp groups temporarily.',
        'The Plan B Buffer: Write down three alternative educational paths or exam attempts before opening the result portal. This breaks the "dead-end" illusion.',
        'Remember that exam score is an indicator of test-taking performance on a specific Sunday, not an evaluation of your intelligence.',
      ],
      microHabit: 'The 10-Minute Quiet Buffer: Give yourself 10 minutes of complete silence after seeing the score to absorb it before making phone calls.',
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Introduction Banner */}
      <div className="p-6 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Anchor className="h-5 w-5 text-teal-400" />
            <span>Exam Season Support Center</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Syllabus pressure is real, but mental prep is 50% of success. Access research-backed cognitive reframing strategies for every phase of your examination cycle.
          </p>
        </div>
        <Button
          onClick={() => setActiveVoiceModal('grounding')}
          className="bg-teal-500 hover:bg-teal-600 text-white border-0 font-semibold text-xs shrink-0 flex items-center space-x-1.5"
        >
          <Volume2 className="h-4 w-4" />
          <span>Quick 2-Min Grounding Audio</span>
        </Button>
      </div>

      {/* Timeline Tabs */}
      <Tabs defaultValue="before" className="w-full text-left">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-900">
          <TabsTrigger value="before" className="text-xs font-semibold py-2">
            1. Before
          </TabsTrigger>
          <TabsTrigger value="during" className="text-xs font-semibold py-2">
            2. During
          </TabsTrigger>
          <TabsTrigger value="after" className="text-xs font-semibold py-2">
            3. After
          </TabsTrigger>
          <TabsTrigger value="results" className="text-xs font-semibold py-2">
            4. Result Day
          </TabsTrigger>
        </TabsList>

        {Object.entries(copingData).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <TabsContent key={key} value={key} className="focus:outline-none">
              <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center space-x-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{data.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-0.5">
                      <span className="font-semibold text-slate-400">Common symptoms:</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{data.anxieties}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Coping Tactics list */}
                  <div className="space-y-4">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      Coping Strategies
                    </span>
                    <ul className="space-y-3 pl-0">
                      {data.strategies.map((strat, i) => (
                        <li key={i} className="flex items-start space-x-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="h-5 w-5 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Micro-habit Box */}
                  <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/10 border border-teal-100/60 dark:border-teal-900/30 flex items-start space-x-3">
                    <span className="text-2xl" role="img" aria-label="lightbulb">💡</span>
                    <div>
                      <span className="text-xs font-extrabold text-teal-800 dark:text-teal-400 uppercase tracking-wider block mb-1">
                        High-Yield Wellness Habit
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal font-medium">
                        {data.microHabit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* GUIDANCE AUDIO MOCK MODAL */}
      <Dialog
        isOpen={activeVoiceModal === 'grounding'}
        onClose={() => setActiveVoiceModal(null)}
        title="2-Minute Grounding Audio Guide"
      >
        <div className="text-center py-6 space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center animate-pulse-slow">
              <Volume2 className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              Exam Hall Audio Guided Grounding
            </p>
            <p className="text-xs text-slate-500">
              Voice Guide: Calm, professional narrator using somatic resonance triggers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-left space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Narrator Script Snippet</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "Breathe in... feel the floor beneath your feet. The desk in front of you. This exam paper is just one puzzle. You are safe. Your intellect is ready..."
            </p>
          </div>

          <div className="flex justify-center space-x-2 pt-2">
            <Button
              onClick={() => {}}
              variant="default"
              size="sm"
              className="text-xs font-semibold flex items-center space-x-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Play Guide</span>
            </Button>
            <Button
              onClick={() => setActiveVoiceModal(null)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <span>Close</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
