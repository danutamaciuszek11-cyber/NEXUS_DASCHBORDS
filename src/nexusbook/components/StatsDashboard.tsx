import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Globe, 
  FileText, 
  Users, 
  Layers, 
  ExternalLink, 
  Github, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  BarChart2,
  Clock,
  Flame,
  Calendar,
  Zap,
  Activity,
  Filter,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { SystemStats, Book, ChapterBookmark } from '../types';
import { soundFx } from '../utils/audioSystem';
import { get30DayReadingInsights, DailyReadingPoint } from '../utils/readingAnalytics';

interface StatsDashboardProps {
  stats: SystemStats;
  books?: Book[];
  bookmarks?: ChapterBookmark[];
}

type TabMode = 'INSIGHTS' | 'OVERVIEW';
type MetricView = 'PAGES' | 'MINUTES' | 'CHAPTERS' | 'CUMULATIVE';
type TimeRange = '7D' | '14D' | '30D';

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ 
  stats,
  books = [],
  bookmarks = []
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('INSIGHTS');
  const [metricView, setMetricView] = useState<MetricView>('PAGES');
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  // Compute 30-day analytics data
  const { timeline, summary } = useMemo(() => {
    return get30DayReadingInsights(books, bookmarks);
  }, [books, bookmarks]);

  // Filtered timeline data based on selected time range
  const filteredData = useMemo(() => {
    const daysCount = timeRange === '7D' ? 7 : timeRange === '14D' ? 14 : 30;
    return timeline.slice(-daysCount);
  }, [timeline, timeRange]);

  const platformLinks = [
    { label: 'Amazon', count: '8 Dzieł', icon: Globe, color: 'text-amber-400', url: 'https://amazon.com' },
    { label: 'Wattpad', count: '12 Dzieł', icon: ExternalLink, color: 'text-orange-400', url: 'https://wattpad.com' },
    { label: 'Pinterest', count: '45 Boardów', icon: Share2, color: 'text-rose-400', url: 'https://pinterest.com' },
    { label: 'Substack', count: '3.4k Subskrybentów', icon: FileText, color: 'text-purple-400', url: 'https://substack.com' },
    { label: 'GitHub', count: '18 Repozytoriów', icon: Github, color: 'text-cyan-400', url: 'https://github.com' },
    { label: 'ORCID', count: 'ID 0000-0002-984', icon: Sparkles, color: 'text-emerald-400', url: 'https://orcid.org' }
  ];

  // Custom Dark Glowing Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DailyReadingPoint = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className="p-3 bg-[#050914]/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-md font-mono text-xs space-y-1.5 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 font-bold text-white">
            <span className="text-cyan-300">{data.date}</span>
            <span className="text-[10px] text-stone-400">({data.dayOfWeek})</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Przeczytane strony:</span>
              <span className="text-cyan-400 font-bold">{data.pages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Słowa zrekonstruowane:</span>
              <span className="text-emerald-400 font-bold">{data.words.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Czas skupienia:</span>
              <span className="text-amber-400 font-bold">{data.minutes} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Ukończone rozdziały:</span>
              <span className="text-purple-400 font-bold">{data.chapters}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
              <span className="text-stone-500">Suma skumulowana:</span>
              <span className="text-white font-bold">{data.cumulativePages} str.</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl">
      
      {/* Top Navigation & Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                NEXUS TELEMETRY & DATA INSIGHTS
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                RECHARTS 60FPS
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Analiza 30-dniowych trendów czytelniczych, dynamiki przyswajania wiedzy i telemetrii systemu
            </p>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 text-xs">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('INSIGHTS');
            }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
              activeTab === 'INSIGHTS'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Nexus Data Insights</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('OVERVIEW');
            }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Metryki Systemu</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NEXUS DATA INSIGHTS (RECHARTS 30-DAY VISUALIZATION) */}
      {/* ========================================================================= */}
      {activeTab === 'INSIGHTS' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono">
            
            <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 flex flex-col justify-between space-y-2 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center justify-between text-[10px] uppercase text-stone-400 font-bold">
                <span>STRONY (30 DNI)</span>
                <BookOpen className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-cyan-300 tracking-tight">
                {summary.total30dPages.toLocaleString()}
              </p>
              <div className="text-[10px] text-stone-500">
                Średnia: <strong className="text-cyan-400">{summary.dailyAvgPages} str/dzień</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col justify-between space-y-2 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between text-[10px] uppercase text-stone-400 font-bold">
                <span>CZAS SKUPIENIA</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">
                {Math.round(summary.total30dMinutes / 60)}h {summary.total30dMinutes % 60}m
              </p>
              <div className="text-[10px] text-stone-500">
                Średnia: <strong className="text-emerald-400">{summary.dailyAvgMinutes} min/dzień</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 flex flex-col justify-between space-y-2 shadow-lg shadow-amber-950/20">
              <div className="flex items-center justify-between text-[10px] uppercase text-stone-400 font-bold">
                <span>AKTYWNY STREAK</span>
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                {summary.currentStreakDays} <span className="text-sm font-normal text-stone-400">dni</span>
              </p>
              <div className="text-[10px] text-stone-500">
                Rekord: <strong className="text-amber-400">{summary.longestStreakDays} dni z rzędu</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 flex flex-col justify-between space-y-2 shadow-lg shadow-purple-950/20">
              <div className="flex items-center justify-between text-[10px] uppercase text-stone-400 font-bold">
                <span>PRĘDKOŚĆ POSTĘPU</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
                {summary.completionVelocityPerWeek} <span className="text-sm font-normal text-stone-400">ch/tydz</span>
              </p>
              <div className="text-[10px] text-stone-500">
                Ukończono łącznie: <strong className="text-purple-400">{summary.total30dChapters} rozdz.</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-rose-500/30 flex flex-col justify-between space-y-2 col-span-2 sm:col-span-2 lg:col-span-1 shadow-lg shadow-rose-950/20">
              <div className="flex items-center justify-between text-[10px] uppercase text-stone-400 font-bold">
                <span>SZCZYTOWY DZIEŃ</span>
                <Calendar className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-rose-300 tracking-tight truncate">
                {summary.mostActiveDay.date}
              </p>
              <div className="text-[10px] text-stone-500">
                Wynik: <strong className="text-rose-400">{summary.mostActiveDay.pages} stron ({summary.mostActiveDay.minutes} min)</strong>
              </div>
            </div>

          </div>

          {/* Interactive Chart Container */}
          <div className="p-5 sm:p-6 rounded-3xl bg-black/60 border border-white/10 space-y-5 shadow-2xl">
            
            {/* Chart Toolbar: Metric & Time Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5 font-mono text-xs">
              
              {/* Metric Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase text-stone-500 font-bold mr-1">METRYKA:</span>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setMetricView('PAGES');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    metricView === 'PAGES'
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-cyan-300 hover:bg-white/10 border border-cyan-500/20'
                  }`}
                >
                  📖 Strony Dzienne
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setMetricView('MINUTES');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    metricView === 'MINUTES'
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-white/5 text-emerald-300 hover:bg-white/10 border border-emerald-500/20'
                  }`}
                >
                  ⏱️ Minuty Skupienia
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setMetricView('CHAPTERS');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    metricView === 'CHAPTERS'
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-purple-500/20'
                  }`}
                >
                  🧩 Rozdziały
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setMetricView('CUMULATIVE');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    metricView === 'CUMULATIVE'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-amber-300 hover:bg-white/10 border border-amber-500/20'
                  }`}
                >
                  📈 Postęp Skumulowany
                </button>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/80 border border-white/10 text-xs">
                {(['7D', '14D', '30D'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      soundFx.playClick();
                      setTimeRange(range);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      timeRange === range
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {range === '7D' ? '7 Dni' : range === '14D' ? '14 Dni' : 'Ostatnie 30 Dni'}
                  </button>
                ))}
              </div>

            </div>

            {/* Recharts Area / Bar Chart Visualizer */}
            <div className="w-full h-[320px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                {metricView === 'MINUTES' ? (
                  <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradientEmerald" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#064e3b" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.4)" 
                      fontSize={10} 
                      tickLine={false} 
                      fontFamily="monospace"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.4)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      fontFamily="monospace"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={summary.dailyAvgMinutes} stroke="#10b981" strokeDasharray="4 4" label={{ value: `Średnia: ${summary.dailyAvgMinutes}m`, fill: '#10b981', fontSize: 10, position: 'right' }} />
                    <Bar 
                      dataKey="minutes" 
                      fill="url(#barGradientEmerald)" 
                      radius={[6, 6, 0, 0]} 
                      animationDuration={800}
                    />
                  </BarChart>
                ) : metricView === 'CHAPTERS' ? (
                  <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradientPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.4)" 
                      fontSize={10} 
                      tickLine={false} 
                      fontFamily="monospace"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.4)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      fontFamily="monospace"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="chapters" 
                      fill="url(#barGradientPurple)" 
                      radius={[6, 6, 0, 0]} 
                      animationDuration={800}
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradientCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="areaGradientAmber" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.4)" 
                      fontSize={10} 
                      tickLine={false} 
                      fontFamily="monospace"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.4)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      fontFamily="monospace"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {metricView === 'PAGES' && (
                      <ReferenceLine y={summary.dailyAvgPages} stroke="#00f0ff" strokeDasharray="4 4" label={{ value: `Średnia: ${summary.dailyAvgPages} str`, fill: '#00f0ff', fontSize: 10, position: 'right' }} />
                    )}
                    <Area 
                      type="monotone" 
                      dataKey={metricView === 'CUMULATIVE' ? 'cumulativePages' : 'pages'} 
                      stroke={metricView === 'CUMULATIVE' ? '#f59e0b' : '#00f0ff'} 
                      strokeWidth={2.5}
                      fill={metricView === 'CUMULATIVE' ? 'url(#areaGradientAmber)' : 'url(#areaGradientCyan)'} 
                      activeDot={{ r: 6, fill: '#ffffff', stroke: metricView === 'CUMULATIVE' ? '#f59e0b' : '#00f0ff', strokeWidth: 2 }}
                      animationDuration={900}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Bottom Insight Footer Note */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Synchronizacja danych czytnika: <strong>Lokalna pamięć podręczna + Firestore Sync</strong></span>
              </div>
              <span className="text-cyan-400 font-bold">
                Łącznie słów w 30 dni: {summary.total30dWords.toLocaleString()}
              </span>
            </div>

          </div>

          {/* Category & Seeker Engagement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            
            {/* Category Engagement */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-stone-200 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-cyan-400" />
                  <span>Aktywność wg Kategorii Wiedzy</span>
                </span>
                <span className="text-[10px] text-stone-500">30 Dni</span>
              </div>

              <div className="space-y-2.5">
                {summary.categoryDistribution.map((cat) => {
                  const pct = Math.round((cat.count / (summary.total30dPages || 1)) * 100);
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-stone-300">{cat.name}</span>
                        <span className="font-bold" style={{ color: cat.color }}>{cat.count} str. ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700" 
                          style={{ width: `${pct}%`, backgroundColor: cat.color }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seeker Channel Engagement */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-stone-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Zaangażowanie w Kanały Seekers</span>
                </span>
                <span className="text-[10px] text-stone-500">30 Dni</span>
              </div>

              <div className="space-y-2.5">
                {summary.seekerDistribution.map((sk) => {
                  const pct = Math.round((sk.count / (summary.total30dPages || 1)) * 100);
                  return (
                    <div key={sk.name} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-stone-300">{sk.name}</span>
                        <span className="font-bold" style={{ color: sk.color }}>{sk.count} str. ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700" 
                          style={{ width: `${pct}%`, backgroundColor: sk.color }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SYSTEM OVERVIEW & PLATFORM METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main Core Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 font-mono">
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-white/40 text-[9px] uppercase tracking-wider">
                <span>BOOKS</span>
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white tracking-tighter">{stats.totalBooks}</p>
              <span className="text-[9px] text-white/30 uppercase">Vault Collection</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-emerald-400 text-[9px] uppercase tracking-wider">
                <span>PUBLISHED</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xl font-black text-emerald-400 tracking-tighter">{stats.publishedCount}</p>
              <span className="text-[9px] text-white/30 uppercase">Active Works</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-purple-400 text-[9px] uppercase tracking-wider">
                <span>DRAFTS</span>
                <Lock className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xl font-black text-purple-400 tracking-tighter">{stats.draftsCount}</p>
              <span className="text-[9px] text-white/30 uppercase">Prototypes</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-amber-400 text-[9px] uppercase tracking-wider">
                <span>LANGUAGES</span>
                <Globe className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xl font-black text-amber-400 tracking-tighter">{stats.languagesCount}</p>
              <span className="text-[9px] text-white/30 uppercase">PL / EN / DE / FR</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-blue-400 text-[9px] uppercase tracking-wider">
                <span>PAGES</span>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xl font-black text-blue-400 tracking-tighter">{stats.totalPages.toLocaleString()}</p>
              <span className="text-[9px] text-white/30 uppercase">Total Volume</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-cyan-400 text-[9px] uppercase tracking-wider">
                <span>WORDS</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xl font-black text-cyan-400 tracking-tighter">{stats.totalWords.toLocaleString()}</p>
              <span className="text-[9px] text-white/30 uppercase">Reconstruction</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2 col-span-2 sm:col-span-1 shadow-lg">
              <div className="flex items-center justify-between text-rose-400 text-[9px] uppercase tracking-wider">
                <span>READERS</span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xl font-black text-rose-400 tracking-tighter">{stats.totalReaders.toLocaleString()}</p>
              <span className="text-[9px] text-white/30 uppercase">Active Seekers</span>
            </div>

          </div>

          {/* External Platforms Metrics Grid */}
          <div className="pt-2">
            <div className="text-[10px] font-mono uppercase text-white/40 tracking-widest mb-3">
              ZEWNĘTRZNA INTEGRACJA EKOSYSTEMU
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
              {platformLinks.map((plat) => {
                const Icon = plat.icon;
                return (
                  <a 
                    key={plat.label}
                    href={plat.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/10 flex flex-col space-y-1.5 transition-all group shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs">{plat.label}</span>
                      <Icon className={`w-4 h-4 ${plat.color}`} />
                    </div>
                    <span className="text-[10px] text-white/40">{plat.count}</span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
