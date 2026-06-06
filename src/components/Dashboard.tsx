import { CheckIn, Insight } from '../types';
import { calculateBurnoutReport, analyzeTriggers } from '../utils/wellnessEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Brain,
  Moon,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Award,
  Sparkles,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';

interface DashboardProps {
  checkIns: CheckIn[];
  insights: Insight[];
}

export const Dashboard = ({ checkIns, insights }: DashboardProps) => {
  // 1. Calculate burnout report
  const burnoutReport = calculateBurnoutReport(checkIns);

  // 2. Analyze stress triggers
  const { frequencies, mostCommon, triggerCount } = analyzeTriggers(checkIns);
  const activeTriggersData = frequencies.filter(f => f.count > 0).slice(0, 5); // top 5 active

  // Map mood strings to a numerical score for charting:
  // great = 5, good = 4, neutral = 3, anxious = 2, sad = 1
  const moodScoreMap: Record<string, number> = {
    great: 5,
    good: 4,
    neutral: 3,
    anxious: 2,
    sad: 1,
  };

  const chartData = checkIns.map(c => {
    const dateObj = new Date(c.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return {
      date: formattedDate,
      rawDate: c.date,
      mood: moodScoreMap[c.mood] || 3,
      stress: c.stressLevel,
      energy: c.energyLevel,
      confidence: c.confidenceLevel,
      sleep: c.sleepHours,
      studySatisfy: c.studySatisfaction,
    };
  });

  // Color helper for risk level
  const getRiskColor = (risk: string) => {
    if (risk === 'High') return 'destructive';
    if (risk === 'Moderate') return 'warning';
    return 'success';
  };

  // Icon mapping for insights
  const getInsightIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon':
        return <Moon className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'TrendingDown':
        return <TrendingDown className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'Award':
        return <Award className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />;
      default:
        return <HelpCircle className="h-5 w-5 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* ROW 1: BURNOUT RISK CARD & TRIGGER HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Burnout Meter */}
        <Card className="md:col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Burnout Risk Assessment</CardTitle>
              <CardDescription>Logical engine index based on 5-day weighted health trend</CardDescription>
            </div>
            <Badge variant={getRiskColor(burnoutReport.riskLevel)} className="font-extrabold px-3 py-0.5">
              {burnoutReport.riskLevel} Risk
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress gauge */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Burnout Threshold Index</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{burnoutReport.score} / 100</span>
              </div>
              <Progress
                value={burnoutReport.score}
                indicatorClassName={
                  burnoutReport.riskLevel === 'High'
                    ? 'bg-rose-500'
                    : burnoutReport.riskLevel === 'Moderate'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }
              />
            </div>

            {/* Explanation & Intervention */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider block">Diagnostics</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {burnoutReport.explanation}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/10 border border-teal-100/40 dark:border-teal-900/30 space-y-1">
                <span className="font-extrabold text-teal-800 dark:text-teal-400 uppercase tracking-wider block">Coaching Actions</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {burnoutReport.intervention}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trigger Summaries */}
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">Stress Sources</CardTitle>
            <CardDescription>Primary triggers recorded over check-ins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
            
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Top Stress Source</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200 max-w-[220px] mx-auto truncate">
                {mostCommon}
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Triggers Logged</span>
                <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400">{triggerCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Logged Days</span>
                <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400">{checkIns.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 2: DETAILED ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Mood & Stress Levels Correlation */}
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center space-x-1.5">
              <Brain className="h-4.5 w-4.5 text-teal-600" />
              <span>Mood vs. Stress Over Time</span>
            </CardTitle>
            <CardDescription>Mood Index (1-5) and Stress Index (1-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    name="Stress Level"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#stressGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    name="Mood (Score 1-5)"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Sleep vs Study Satisfaction */}
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center space-x-1.5">
              <Moon className="h-4.5 w-4.5 text-indigo-500" />
              <span>Sleep Hours & Study Satisfaction</span>
            </CardTitle>
            <CardDescription>Correlating restorative hours with daytime productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="sleep" name="Sleep (Hours)" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.sleep < 6 ? '#fbbf24' : '#6366f1'} />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="studySatisfy"
                    name="Study Satisfaction"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Energy vs. Confidence Trends */}
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center space-x-1.5">
              <Clock className="h-4.5 w-4.5 text-teal-600" />
              <span>Energy & Confidence Trends</span>
            </CardTitle>
            <CardDescription>Monitoring self-efficacy fluctuations (1-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    name="Energy Level"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    name="Confidence Level"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Trigger Frequency Distribution */}
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center space-x-1.5">
              <Compass className="h-4.5 w-4.5 text-amber-500" />
              <span>Active Stress Triggers</span>
            </CardTitle>
            <CardDescription>Distribution of self-reported stress variables</CardDescription>
          </CardHeader>
          <CardContent>
            {activeTriggersData.length > 0 ? (
              <div className="h-[260px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeTriggersData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: -5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis
                      dataKey="trigger"
                      type="category"
                      tick={{ fontSize: 10 }}
                      stroke="#94a3b8"
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="count" name="Frequency" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={15}>
                      {activeTriggersData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#e11d48' : '#fb7185'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm italic">
                No active stress triggers logged in recent check-ins.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: INTELLIGENT WEEKLY INSIGHTS */}
      <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 mb-0.5">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">MindShield Insight Engine</span>
          </div>
          <CardTitle className="text-lg font-bold">Wellness Insights & Trends</CardTitle>
          <CardDescription>Mathematical correlations calculated client-side to target study efficiency</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start space-x-3.5 p-4.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
              >
                <div className="mt-0.5 p-1 rounded bg-slate-100/60 dark:bg-slate-800 shrink-0">
                  {getInsightIcon(insight.icon)}
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {insight.message}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
