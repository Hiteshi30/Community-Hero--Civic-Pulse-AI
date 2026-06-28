import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowUpRight, ArrowDownRight, TrendingUp, Bot, 
  MapPin, HelpCircle, Activity, Sparkles, Building, Landmark, CheckCircle2 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

interface WardDetail {
  name: string;
  health: number;
  trend: 'up' | 'down' | 'stable';
  infra: number;
  engagement: number;
  risk: number;
  recommendation: string;
}

const WARD_POOL: WardDetail[] = [
  { name: 'Connaught Place', health: 89, trend: 'up', infra: 92, engagement: 85, risk: 12, recommendation: 'Deploy preventive gully sewer traps near Radial Road intersections before monsoon peaks.' },
  { name: 'Karol Bagh', health: 74, trend: 'stable', infra: 78, engagement: 70, risk: 34, recommendation: 'Accelerate pending streetlighting line repair works to resolve dark corridor hotspots.' },
  { name: 'Chandni Chowk', health: 58, trend: 'down', infra: 62, engagement: 55, risk: 65, recommendation: 'Deploy emergency commercial garbage clearing crews to prevent drainage blockages.' },
  { name: 'Saket', health: 81, trend: 'up', infra: 84, engagement: 88, risk: 18, recommendation: 'Expand smart waste bins pilot project to capitalize on high resident involvement.' },
  { name: 'Vasant Kunj', health: 83, trend: 'up', infra: 86, engagement: 82, risk: 15, recommendation: 'Integrate active traffic pattern sensors to auto-route potholes repair crews.' }
];

const HISTORICAL_DATA = [
  { month: 'Jan', health: 78, infra: 80, citizens: 72 },
  { month: 'Feb', health: 80, infra: 82, citizens: 75 },
  { month: 'Mar', health: 79, infra: 81, citizens: 76 },
  { month: 'Apr', health: 82, infra: 84, citizens: 80 },
  { month: 'May', health: 83, infra: 85, citizens: 83 },
  { month: 'Jun', health: 84, infra: 86, citizens: 85 }
];

export const CityHealthDashboard: React.FC = () => {
  const [selectedWard, setSelectedWard] = useState<WardDetail>(WARD_POOL[0]);

  // Calculate city averages
  const avgCityHealth = Math.round(WARD_POOL.reduce((acc, curr) => acc + curr.health, 0) / WARD_POOL.length);
  const avgCityInfra = Math.round(WARD_POOL.reduce((acc, curr) => acc + curr.infra, 0) / WARD_POOL.length);
  const avgCityEngagement = Math.round(WARD_POOL.reduce((acc, curr) => acc + curr.engagement, 0) / WARD_POOL.length);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-6 space-y-6 text-left shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
            <span>AI City Health Score Dashboard</span>
          </span>
          <h3 className="text-sm font-black text-slate-800 dark:text-white mt-1">Autonomous Urban Integrity Index</h3>
        </div>
        
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-full text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Good Health Tier</span>
          </span>
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Stable Index</span>
          </span>
        </div>
      </div>

      {/* Main Grid: circular gauge + scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Futuristic Gauge */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Overall Delhi Index</span>
          
          {/* Circular Gauge */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Arc Background */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-slate-200 dark:stroke-zinc-800 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-indigo-600 dark:stroke-indigo-400 fill-none transition-all duration-1000"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - avgCityHealth / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Inner text */}
            <div className="space-y-0.5 z-10">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{avgCityHealth}</span>
              <span className="text-xs text-slate-400 font-bold block">/ 100</span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider block bg-emerald-500/10 px-1.5 py-0.2 rounded-full mt-1">Excellent</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-center text-xs pt-2 border-t border-slate-200/50 dark:border-zinc-800/50">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Infrastructure Score</span>
              <span className="text-sm font-black text-slate-700 dark:text-zinc-200">{avgCityInfra}%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Citizen Engagement</span>
              <span className="text-sm font-black text-slate-700 dark:text-zinc-200">{avgCityEngagement}%</span>
            </div>
          </div>
        </div>

        {/* Middle Col: Ward Comparison Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ward comparison telemetry</span>
            <span className="text-[9px] text-indigo-500 font-extrabold">Click any ward to inspect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {WARD_POOL.map((ward) => {
              const isSelected = selectedWard.name === ward.name;
              return (
                <button
                  key={ward.name}
                  onClick={() => setSelectedWard(ward)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/25 dark:bg-indigo-950/15 ring-2 ring-indigo-500/10 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-extrabold text-slate-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {ward.name}
                    </span>
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-black ${
                      ward.trend === 'up' ? 'text-emerald-500' : ward.trend === 'down' ? 'text-rose-500' : 'text-slate-400'
                    }`}>
                      {ward.health}%
                      {ward.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : ward.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <span className="text-xs font-black">─</span>}
                    </span>
                  </div>

                  <div className="mt-3.5 w-full space-y-2">
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>Infra: {ward.infra}%</span>
                      <span>Engagement: {ward.engagement}%</span>
                    </div>
                    {/* Micro gauge */}
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${ward.health}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Ward Details Panel & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
        
        {/* Recharts Area Historical Performance */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Historical Health Trend (6 Months)</span>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12 }} />
                <Area type="monotone" dataKey="health" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorHealth)" name="City Health Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Ward Autonomous AI Risk Predictions */}
        <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-zinc-950 border border-indigo-100/30 dark:border-zinc-850 flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start border-b border-indigo-100/20 dark:border-zinc-800 pb-2">
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-500 block tracking-widest">Active Inspection Target</span>
              <span className="text-xs font-black text-slate-800 dark:text-zinc-200">{selectedWard.name} Status</span>
            </div>
            
            <div className="text-right">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Failure Risk</span>
              <span className="text-xs font-black text-rose-500 font-mono">{selectedWard.risk}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
            {selectedWard.recommendation}
          </p>

          <div className="flex gap-2.5 text-[9px] font-black bg-white dark:bg-zinc-900/80 p-2 rounded-xl border">
            <Bot className="w-4 h-4 text-indigo-500 animate-bounce shrink-0" />
            <span className="text-slate-400">AI Recommendation: Infrastructure score is <span className="text-emerald-500">{selectedWard.infra}%</span>. Predictive risk matches normal baseline thresholds.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
