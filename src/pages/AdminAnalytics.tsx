import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, TrendingUp, Clock, Users, ArrowUpRight, Cpu, 
  Sparkles, FileText, Download, PieChart as PieIcon, Landmark,
  AlertTriangle, CheckCircle2, Shield, HelpCircle, Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line
} from 'recharts';

export const AdminAnalytics: React.FC = () => {
  const { complaints, showToast } = useApp();
  const [activeRange, setActiveRange] = useState<'30' | '60' | '90'>('30');

  // Chart Data 1: Monthly Reported vs Resolved ratios (Interactive Line + Area)
  const monthlyRatios = [
    { month: 'Jan', reported: 68, resolved: 52 },
    { month: 'Feb', reported: 84, resolved: 71 },
    { month: 'Mar', reported: 110, resolved: 98 },
    { month: 'Apr', reported: 142, resolved: 125 },
    { month: 'May', reported: 115, resolved: 108 },
    { month: 'Jun (Forecast)', reported: 155, resolved: 140 }
  ];

  // Chart Data 2: Backlogs per department (Interactive Bar Chart)
  const deptBacklogs = [
    { code: 'SWM', name: 'Sanitation', backlog: 14, completed: 384, color: '#10b981' },
    { code: 'WSS', name: 'Water Grid', backlog: 18, completed: 215, color: '#6366f1' },
    { code: 'RNI', name: 'Roads & Infra', backlog: 34, completed: 412, color: '#f59e0b' },
    { code: 'ESL', name: 'Streetlights', backlog: 12, completed: 189, color: '#eab308' },
    { code: 'PHC', name: 'Public Health', backlog: 8, completed: 143, color: '#ec4899' },
    { code: 'PSC', name: 'Public Safety', backlog: 5, completed: 97, color: '#8b5cf6' }
  ];

  // Chart Data 3: Issue category percentage split (Interactive Pie Chart)
  const categorySplit = [
    { name: 'Sewage Overflow', value: 34, color: '#6366f1' },
    { name: 'Road Potholes', value: 28, color: '#f59e0b' },
    { name: 'Garbage Dumping', value: 18, color: '#10b981' },
    { name: 'Streetlight Failure', value: 15, color: '#eab308' },
    { name: 'Other Assets', value: 5, color: '#64748b' }
  ];

  // Chart Data 4: Ward Safety Scores vs Public Engagement (Grouped Bar)
  const wardComparison = [
    { name: 'Connaught Place', safetyScore: 84, engagement: 92 },
    { name: 'Karol Bagh', safetyScore: 68, engagement: 74 },
    { name: 'Saket District', safetyScore: 89, engagement: 88 },
    { name: 'Chandni Chowk', safetyScore: 48, engagement: 61 },
    { name: 'Dwarka Sector 6', safetyScore: 77, engagement: 82 }
  ];

  const triggerExport = () => {
    window.print();
    showToast('📊 Compiling high-definition analytical print layout...', 'success');
  };

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border p-6 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <span>Operations Telemetry & GIS Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Audit predictive incident forecasting models, seasonal sewage spikes, and department load factors.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex bg-slate-50 dark:bg-zinc-900 p-1 rounded-xl border text-[10px] font-black">
            {['30', '60', '90'].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setActiveRange(range as any);
                  showToast(`Adjusting analytical window to past ${range} days...`, 'info');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeRange === range ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                {range} Days
              </button>
            ))}
          </div>

          <button
            onClick={triggerExport}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Avg Resolve Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 shadow-xs flex items-center justify-between">
          <div className="text-left space-y-1">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Average Resolve Time</span>
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">14.8 Hours</span>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> -4.2h from last week
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-zinc-950 dark:text-indigo-400 flex items-center justify-center border shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* 2. Active Backlog */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 shadow-xs flex items-center justify-between">
          <div className="text-left space-y-1">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Active Citizen Queue</span>
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">{complaints.length} cases</span>
            <span className="text-[9px] text-slate-400 font-medium block">100% geo-fenced coordinates</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-zinc-950 dark:text-purple-400 flex items-center justify-center border shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* 3. Volunteers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 shadow-xs flex items-center justify-between">
          <div className="text-left space-y-1">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Active Ward Volunteers</span>
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">1,820 Citizens</span>
            <span className="text-[9px] text-indigo-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% monthly signups
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-zinc-950 dark:text-emerald-400 flex items-center justify-center border shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* 4. AI Dispatch Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 shadow-xs flex items-center justify-between">
          <div className="text-left space-y-1">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">AI Dispatch accuracy</span>
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">95.4%</span>
            <span className="text-[9px] text-indigo-500 font-bold block">Trained on 10,000+ local pixels</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-zinc-950 dark:text-amber-400 flex items-center justify-center border shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE RECHARTS VISUALIZATION GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: Reported vs Resolved trends */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs text-left space-y-4">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Reported vs Resolved Issues</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Continuous tracking of incident volume against completion output.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRatios} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="reported" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReport)" name="Reported Incidents" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolve)" name="Completed Resolutions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Backlogs per department */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs text-left space-y-4">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Department backlogs vs completions</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Comparative diagnostic of department pipeline workload.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptBacklogs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                <XAxis dataKey="code" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed Work Orders" />
                <Bar dataKey="backlog" fill="#6366f1" radius={[4, 4, 0, 0]} name="Active Backlog" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Issue category percentage split */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs text-left space-y-4">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Asset Failure category split</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Classification index of active reported complaints.</p>
          </div>
          <div className="h-64 flex items-center justify-between">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Pie Legend */}
            <div className="w-1/2 space-y-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-300">
              {categorySplit.map((entry, idx) => (
                <div key={idx} className="flex justify-between items-center pr-2 border-b border-slate-50 dark:border-zinc-850 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="truncate max-w-[120px]">{entry.name}</span>
                  </div>
                  <span className="font-mono font-black">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 4: Ward Safety Scores vs Public Engagement */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs text-left space-y-4">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ward Safety score vs Citizen engagement</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Correlation index comparing ward health ratings with community participation.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardComparison} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="safetyScore" fill="#10b981" radius={[4, 4, 0, 0]} name="SLA Safety score (%)" />
                <Bar dataKey="engagement" fill="#818cf8" radius={[4, 4, 0, 0]} name="Citizen Endorsements (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CORE EXPLANATION INSIGHTS CARD */}
      <div className="p-6 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-3xl text-left space-y-4">
        <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-5 h-5 text-purple-500" />
          <span>Gemini Diagnostic Analytics Prescription</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="space-y-3">
            <p className="font-extrabold text-slate-700 dark:text-zinc-200">1. Spatial Backlog Clustering Alert</p>
            <p className="text-slate-500 dark:text-zinc-400 font-semibold">
              Road pothole repair backlogs are highly concentrated in Karol Bagh Ward 8. Thermal compaction units are operating at **88% capacity**. Immediate crew transfer from Connaught Place is recommended to balance work order cycles and lower standard resolution times before monsoon onset.
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-extrabold text-slate-700 dark:text-zinc-200">2. Citizen Engagement Correlation Index</p>
            <p className="text-slate-500 dark:text-zinc-400 font-semibold">
              A 1% increase in citizen endorsements translates directly to an average **12.4 minute reduction** in final case closure latency. This proves that neighborhood Crowdsourced Verifications successfully expedite dispatch routing priorities, enhancing overall municipal operations.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
