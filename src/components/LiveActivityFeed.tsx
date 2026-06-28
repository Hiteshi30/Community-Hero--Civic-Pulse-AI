import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Activity, ShieldCheck, Zap, TrendingUp, UserCheck, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: string;
  timestamp: string;
  agent: string;
  icon: React.ReactNode;
  message: string;
  badgeText: string;
  badgeColor: string;
}

const TEMPLATE_POOL = [
  {
    agent: 'Vision Agent',
    icon: <Bot className="w-3.5 h-3.5 text-indigo-400" />,
    message: 'Analyzed complaint #POT-904 (Asphalt fracture). Confidence score: 98.6%.',
    badgeText: 'Visual Triage',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  },
  {
    agent: 'Priority Agent',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
    message: 'Escalated sewage leak #WSS-310 to CRITICAL due to proximity of active hospital corridor.',
    badgeText: 'Priority Boost',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  },
  {
    agent: 'Duplicate Agent',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    message: 'Detected 92% visual/spatial match for garbage heap report #GAR-112. Merged with active ledger #GAR-084.',
    badgeText: 'Ledger Cleaned',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    agent: 'Prediction Agent',
    icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
    message: 'Identified 89% structural degradation hazard hotspot in Ward 8 near high traffic bypass.',
    badgeText: 'Risk Analysis',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    agent: 'Resource Planning',
    icon: <Zap className="w-3.5 h-3.5 text-purple-400" />,
    message: 'Optimized response SLA: Recommended shifting 2 vacuum trucks to Karol Bagh sector.',
    badgeText: 'SLA Optimised',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  {
    agent: 'System Engine',
    icon: <Activity className="w-3.5 h-3.5 text-slate-400" />,
    message: 'AI Executive Summary Report #EX-2026 drafted and synced to City Commissioner dashboard.',
    badgeText: 'Executive Synced',
    badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
  },
  {
    agent: 'Citizen Verification',
    icon: <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
    message: 'Citizen Rajesh Kumar verified streetlight restoration in Connaught Place sector.',
    badgeText: 'Public Verified',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  }
];

export const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Populate initial items
    const initial: ActivityItem[] = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const template = TEMPLATE_POOL[(i + 2) % TEMPLATE_POOL.length];
      const timeOffset = (i * 3) + 1;
      const d = new Date(now.getTime() - timeOffset * 60 * 1000);
      initial.push({
        id: `init_${i}`,
        timestamp: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...template
      });
    }
    setActivities(initial);

    // Dynamic stream ticker
    const interval = setInterval(() => {
      const nextTemplate = TEMPLATE_POOL[Math.floor(Math.random() * TEMPLATE_POOL.length)];
      const nextItem: ActivityItem = {
        id: `act_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...nextTemplate
      };
      setActivities(prev => [nextItem, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5 space-y-4 text-left relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
      
      <div className="flex justify-between items-center pl-1">
        <div className="space-y-0.5">
          <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest block">Operational Telemetry</span>
          <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200">Live AI Activity Feed</h4>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 animate-pulse border border-indigo-100/50 dark:border-indigo-950">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>Real-time Stream</span>
        </span>
      </div>

      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {activities.map((item) => (
          <div 
            key={item.id} 
            className="p-3 rounded-xl border border-slate-100 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-950/40 text-[11px] leading-relaxed transition-all duration-500 hover:border-indigo-500/20 hover:bg-slate-50 dark:hover:bg-zinc-950/80 animate-fade-in flex gap-3"
          >
            <div className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-xs">
              {item.icon}
            </div>
            
            <div className="space-y-1 grow">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-slate-700 dark:text-zinc-200">{item.agent}</span>
                <span className="text-[8px] text-slate-400 font-mono">{item.timestamp}</span>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">{item.message}</p>
              
              <div className="pt-0.5 flex">
                <span className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold border ${item.badgeColor}`}>
                  {item.badgeText}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
