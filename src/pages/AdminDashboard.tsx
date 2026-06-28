import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, Cpu, TrendingUp, 
  ArrowRight, Landmark, Zap, Droplet, Trash2, Construction, 
  Users, Clock, Smile, Sparkles, AlertCircle, RefreshCw, MapPin, Map,
  Building2, MessageSquare, Plus, Activity, Download, X
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

interface LocalityHealth {
  id: string;
  name: string;
  score: number;
  trend: 'upward' | 'stable' | 'downward';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mostCommonIssue: string;
  resolutionSpeed: string;
  participation: number; // %
  description: string;
  coordinates: string;
  colorClass: string;
  fillColor: string;
  strokeColor: string;
  aiInsights: string[];
}

export const AdminDashboard: React.FC = () => {
  const { user, complaints, departments, t, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'gis'>('overview');
  const [selectedLocality, setSelectedLocality] = useState<LocalityHealth | null>(null);
  const [alerts, setAlerts] = useState([
    { id: '1', type: 'critical', text: 'Critical Sewage Overflow in Connaught Place (E-Block)', time: 'Just now', complaintId: 'complaint_delhi_1' },
    { id: '2', type: 'repeated', text: '3rd Water Supply Leak complaint reported in Karol Bagh sector 2 within 48h', time: '10 mins ago' },
    { id: '3', type: 'overload', text: 'Sanitation & Waste Department backlog exceeds 25 active tasks', time: '45 mins ago' },
    { id: '4', type: 'delay', text: 'Pothole complaint in Saket is close to exceeding SLA resolution time (24h left)', time: '2 hrs ago' },
    { id: '5', type: 'verification', text: 'Citizen verification received: 15 neighbors verified Karol Bagh lighting issue', time: '4 hrs ago' }
  ]);

  const [activities, setActivities] = useState([
    { id: '1', officer: 'Officer Amit Patel', action: 'assigned crew to', target: 'WEH Pothole Repairs', time: '5 mins ago' },
    { id: '2', officer: 'Smt. Priya Srinivasan', action: 'updated status of', target: 'CP Sewage overflow', time: '1 hr ago' },
    { id: '3', officer: 'Dr. Suresh Mishra, IAS', action: 'marked as RESOLVED', target: 'Indiranagar Garbage Clearing', time: '2 hrs ago' },
    { id: '4', officer: 'Shri Ramesh Kumar', action: 'initiated work order for', target: '3rd Avenue Streetlights', time: '3 hrs ago' }
  ]);

  // Delhi localities sample health score
  const localities: LocalityHealth[] = [
    {
      id: 'cp',
      name: 'Connaught Place',
      score: 84,
      trend: 'upward',
      riskLevel: 'LOW',
      mostCommonIssue: 'Sewage Water Overflow',
      resolutionSpeed: '12.4 hrs',
      participation: 92,
      coordinates: '28.6304, 77.2177',
      colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
      fillColor: 'rgba(16, 185, 129, 0.2)',
      strokeColor: '#10b981',
      description: 'Connaught Place (Ward 4) demonstrates high resolution velocity. Citizen reporting is high with excellent coordinate precision.',
      aiInsights: [
        'Preventative sewer desilting recommended before monsoon season.',
        'High compliance rate (94%) on waste management commercial guidelines.',
        'SLA execution rating: Tier 1 (Excellent).'
      ]
    },
    {
      id: 'kb',
      name: 'Karol Bagh',
      score: 68,
      trend: 'stable',
      riskLevel: 'MEDIUM',
      mostCommonIssue: 'Road Potholes & Cracks',
      resolutionSpeed: '18.9 hrs',
      participation: 74,
      coordinates: '28.6444, 77.1900',
      colorClass: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
      fillColor: 'rgba(245, 158, 11, 0.2)',
      strokeColor: '#f59e0b',
      description: 'Karol Bagh (Ward 8) exhibits moderate backlog delays. Main constraints relate to crew dispatch times for heavy asphalt laying.',
      aiInsights: [
        'Asphalt repair backlog of 4 cases is causing localized traffic bottlenecks.',
        'Citizen feedback suggests high density of commercial loading vehicles damaging roads.',
        'Recommendation: Reroute 1 crew from Ward 3 (low load) to Karol Bagh.'
      ]
    },
    {
      id: 'saket',
      name: 'Saket District',
      score: 89,
      trend: 'upward',
      riskLevel: 'LOW',
      mostCommonIssue: 'Garbage Dump Overflow',
      resolutionSpeed: '9.2 hrs',
      participation: 88,
      coordinates: '28.5222, 77.2159',
      colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
      fillColor: 'rgba(16, 185, 129, 0.15)',
      strokeColor: '#10b981',
      description: 'Saket area shows stellar public participation and very low active sewer backlog. High volunteer auditing.',
      aiInsights: [
        '95% of reported cases resolved within standard 24h SLA.',
        'Smart bins telemetry reports 100% operational sensor uptime.',
        'Excellent neighborhood park grading.'
      ]
    },
    {
      id: 'cc',
      name: 'Chandni Chowk',
      score: 48,
      trend: 'downward',
      riskLevel: 'CRITICAL',
      mostCommonIssue: 'Streetlight Cable Faults',
      resolutionSpeed: '29.6 hrs',
      participation: 61,
      coordinates: '28.6560, 77.2300',
      colorClass: 'text-red-500 bg-red-50 dark:bg-red-950/20',
      fillColor: 'rgba(239, 68, 68, 0.25)',
      strokeColor: '#ef4444',
      description: 'Old Delhi / Chandni Chowk (Ward 1) has severe grid overload. Loose wiring, low light levels, and old pipe ruptures cause critical delays.',
      aiInsights: [
        'Electrical infrastructure overload requires substation power balancing.',
        'High narrow-lane density blocks standard garbage collection dumper trucks.',
        'Emergency Action Required: Deploy specialized micro-utility loaders for sanitation.'
      ]
    },
    {
      id: 'dw',
      name: 'Dwarka Sector 6',
      score: 77,
      trend: 'stable',
      riskLevel: 'MEDIUM',
      mostCommonIssue: 'Water Quality Concerns',
      resolutionSpeed: '16.1 hrs',
      participation: 82,
      coordinates: '28.5888, 77.0600',
      colorClass: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20',
      fillColor: 'rgba(249, 115, 22, 0.2)',
      strokeColor: '#f97316',
      description: 'Dwarka Sector 6 displays moderate urban metrics. Frequent water pressure drops require valve tuning.',
      aiInsights: [
        'Water purification telemetry flags elevated dissolved solids in Substation D4.',
        'Active citizen forum participation helps verify repairs rapidly.',
        'SLA compliance: 82% resolution velocity.'
      ]
    }
  ];

  // Set default locality on load
  useEffect(() => {
    setSelectedLocality(localities[0]);
  }, []);

  // Filter complaints based on officer's city
  const cityComplaints = complaints.filter(
    c => c.city.toLowerCase() === (user?.city || 'Delhi').toLowerCase()
  );

  const activeIssues = cityComplaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'REJECTED');
  const resolvedIssues = cityComplaints.filter(c => c.status === 'RESOLVED');
  const criticalIssues = cityComplaints.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH');
  
  const resolutionPercentage = cityComplaints.length > 0 
    ? Math.round((resolvedIssues.length / cityComplaints.length) * 100) 
    : 0;

  // Chart Data
  const weeklyTrends = [
    { day: 'Mon', reported: 12, resolved: 8, backlog: 14 },
    { day: 'Tue', reported: 19, resolved: 14, backlog: 19 },
    { day: 'Wed', reported: 15, resolved: 18, backlog: 16 },
    { day: 'Thu', reported: 24, resolved: 15, backlog: 25 },
    { day: 'Fri', reported: 18, resolved: 21, backlog: 22 },
    { day: 'Sat', reported: 10, resolved: 12, backlog: 20 },
    { day: 'Sun', reported: 8, resolved: 11, backlog: 17 }
  ];

  const departmentComparison = departments.map(d => ({
    name: d.name.split(' ')[0],
    pending: d.activeCount,
    completed: d.resolvedCount,
    efficiency: d.resolvedCount > 0 ? Math.round((d.resolvedCount / (d.resolvedCount + d.activeCount)) * 100) : 85
  }));

  const wardPerformance = localities.map(l => ({
    name: l.name,
    score: l.score,
    participation: l.participation
  }));

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alert cleared.', 'success');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'repeated': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'overload': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'delay': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <AlertCircle className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 p-6 rounded-3xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-zinc-100">Municipal Command Center</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">
            Operational Zone: <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">{user?.city || 'Delhi'} METRO REGION</span> • Signed in as Officer <span className="font-bold">{user?.name || 'Administrator'}</span>
          </p>
        </div>

        {/* Live System Status */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 px-4 py-2.5 rounded-2xl shrink-0">
          <Cpu className="w-5 h-5 text-purple-500 animate-spin [animation-duration:3s]" />
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Core Telemetry Engine</span>
            <span className="text-[11px] font-extrabold text-emerald-500">Active • AI Triage Online</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB SELECTOR */}
      <div className="flex bg-white dark:bg-zinc-900/60 p-1.5 rounded-2xl border border-slate-100 dark:border-zinc-850 max-w-sm">
        <button
          id="tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Operations Room</span>
        </button>
        <button
          id="tab-gis"
          onClick={() => setActiveTab('gis')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gis'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>AI City Health GIS</span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* ELEGANT KPI BENTO GRID - 10 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. Total Complaints */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-indigo-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Total Ledger Cases</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">{cityComplaints.length}</span>
                <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-zinc-950 px-2 py-0.5 rounded-md">Live Sync</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Accumulated city registry</p>
            </div>

            {/* 2. Critical Complaints */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-red-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider block">Critical Backlog</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-red-600 dark:text-red-400">{criticalIssues.length}</span>
                <span className="text-[9px] text-red-600 font-extrabold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-md animate-pulse">SLA Priority</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Lethal/high risk failures</p>
            </div>

            {/* 3. Pending Issues */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-amber-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Active Queue</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">{activeIssues.length}</span>
                <span className="text-[9px] text-amber-600 font-extrabold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md">In Dispatch</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Awaiting final clearance</p>
            </div>

            {/* 4. Resolved Issues */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-emerald-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider block">Resolved Cases</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedIssues.length}</span>
                <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">{resolutionPercentage}%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Successfully closed works</p>
            </div>

            {/* 5. Average Resolution Time */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-indigo-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Avg Resolve Time</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">14.8h</span>
                <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">▼ 18.2%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Standard SLA threshold: 24h</p>
            </div>

            {/* 6. Department Efficiency */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-purple-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Dept Efficiency</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">92.4%</span>
                <span className="text-[9px] text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/20 px-1.5 py-0.5 rounded">Top SLA</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Weighted dispatcher scores</p>
            </div>

            {/* 7. Officer Workload */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-indigo-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Officer Workload</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">2.8 cases</span>
                <span className="text-[9px] text-slate-400 font-bold bg-slate-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded">Optimal</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Assigned issues per supervisor</p>
            </div>

            {/* 8. Citizen Satisfaction */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-emerald-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Citizen Audit Rate</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">4.7/5.0</span>
                <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">★ Highly Rated</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Post-resolution public audit</p>
            </div>

            {/* 9. Weekly Performance */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 flex flex-col justify-between shadow-xs hover:border-indigo-100 dark:hover:border-zinc-800 transition-all">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Weekly Velocity</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100">+18.4%</span>
                <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded">Accelerating</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Resolution rate improvement</p>
            </div>

            {/* 10. AI City Health Score */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-zinc-900 dark:to-zinc-950 border border-purple-100 dark:border-zinc-800 flex flex-col justify-between shadow-md shadow-indigo-50/20 dark:shadow-none hover:border-purple-300 transition-all">
              <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">AI City Health Score</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">84<span className="text-xs text-slate-400 font-medium">/100</span></span>
                <span className="text-[9px] text-purple-700 dark:text-purple-300 font-extrabold bg-purple-100 dark:bg-purple-950/40 px-2 py-0.5 rounded-md animate-pulse">Good Zone</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-medium">Ward aggregated telemetry AI index</p>
            </div>
          </div>

          {/* ANIMATED CHARTS PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Complaint Trends & Resolution Velocity (Line & Area) */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs text-left space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">Weekly Incident Streams</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reported vs resolved cases in active sector</p>
                </div>
                <button className="p-2 border dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-850" title="Export Chart Data">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="reported" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReported)" name="Reported Incidents" />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" name="Resolved Issues" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Department Backlog & Efficiency (Stacked Bar) */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs text-left space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">Department Comparative Backlogs</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Staff performance vs total reported pipeline load</p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-zinc-950 px-2.5 py-1 rounded-xl">
                  <span>Average Score: 88%</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentComparison} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved Tasks" stackId="a" />
                    <Bar dataKey="pending" fill="#818cf8" radius={[4, 4, 0, 0]} name="Active Backlog" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DUAL COLUMN: LIVE ALERTS AND OFFICER ACTIVITIES */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Live Alerts - Notification Center (3 columns) */}
            <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-6 rounded-2xl shadow-xs text-left space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
                  <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">Live Alerts Command Feed</h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 font-black bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900 rounded-full animate-bounce">
                  {alerts.length} Warnings Active
                </span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 dark:bg-zinc-950 rounded-2xl border-2 border-dashed border-slate-200">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold">Operations secure. All critical triggers acknowledged.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-950/40 hover:bg-slate-50 dark:hover:bg-zinc-850 flex items-start justify-between gap-3 transition-colors"
                    >
                      <div className="flex gap-3 text-xs leading-relaxed min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="text-left">
                          <p className="font-extrabold text-slate-700 dark:text-zinc-200">{alert.text}</p>
                          <span className="text-[9px] text-slate-400 mt-1 font-bold block">{alert.time}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {alert.complaintId && (
                          <button
                            onClick={() => navigate(`/admin/issues?id=${alert.complaintId}`)}
                            className="px-2.5 py-1 bg-indigo-600 text-white font-extrabold rounded-lg text-[10px] hover:bg-indigo-700 transition-colors"
                          >
                            Dispatch
                          </button>
                        )}
                        <button 
                          onClick={() => deleteAlert(alert.id)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg text-slate-400"
                          title="Acknowledge & Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Officer Activity Stream (2 columns) */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-6 rounded-2xl shadow-xs text-left space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">Recent Officer Activity</h4>
                </div>
                <button 
                  onClick={() => {
                    setActivities(prev => [
                      { id: `act_${Date.now()}`, officer: `Officer ${user?.name || 'Priya'}`, action: 'verified coordinates of', target: 'Saket Sewage line', time: 'Just now' },
                      ...prev
                    ]);
                    showToast('Activity stream updated.', 'success');
                  }}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 border rounded-xl"
                  title="Force telemetry refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 text-xs max-h-[350px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs leading-normal text-left items-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-500 dark:text-zinc-300">
                        <span className="font-extrabold text-slate-800 dark:text-zinc-100">{act.officer}</span>{' '}
                        {act.action}{' '}
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{act.target}</span>
                      </p>
                      <span className="text-[9px] text-slate-400 font-bold mt-0.5 block">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      ) : (
        /* GIS MAP & LOCALITY HEALTH DETAIL PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* SVG Map (3 columns) */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-6 rounded-3xl shadow-xs text-left space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>Delhi Ward Division GIS Control Map</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any locality region below to inspect real-time AI safety grading and indices.</p>
            </div>

            {/* Highly Interactive visual SVG Map */}
            <div className="relative py-8 flex items-center justify-center bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-900 min-h-[380px]">
              <svg className="w-full max-w-md h-[340px]" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                <g strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                  {/* cc: Chandni Chowk - Red */}
                  <path 
                    id="map-cc"
                    d="M 180,110 L 290,100 L 320,160 L 210,170 Z" 
                    fill={selectedLocality?.id === 'cc' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.15)'}
                    stroke="#ef4444"
                    onClick={() => setSelectedLocality(localities.find(l => l.id === 'cc') || null)}
                    className="transition-all hover:fill-red-500/30"
                  />
                  <text x="240" y="135" className="text-[10px] font-black fill-red-600 pointer-events-none">Chandni Chowk</text>

                  {/* kb: Karol Bagh - Orange */}
                  <path 
                    id="map-kb"
                    d="M 100,160 L 195,160 L 220,250 L 110,240 Z" 
                    fill={selectedLocality?.id === 'kb' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.15)'}
                    stroke="#f59e0b"
                    onClick={() => setSelectedLocality(localities.find(l => l.id === 'kb') || null)}
                    className="transition-all hover:fill-amber-500/30"
                  />
                  <text x="145" y="200" className="text-[10px] font-black fill-amber-600 pointer-events-none">Karol Bagh</text>

                  {/* cp: Connaught Place - Green */}
                  <path 
                    id="map-cp"
                    d="M 210,170 L 320,160 L 350,260 L 220,250 Z" 
                    fill={selectedLocality?.id === 'cp' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.15)'}
                    stroke="#10b981"
                    onClick={() => setSelectedLocality(localities.find(l => l.id === 'cp') || null)}
                    className="transition-all hover:fill-emerald-500/30"
                  />
                  <text x="250" y="215" className="text-[10px] font-black fill-emerald-600 pointer-events-none">Connaught Place</text>

                  {/* saket: Saket - Emerald */}
                  <path 
                    id="map-saket"
                    d="M 220,250 L 350,260 L 380,360 L 250,350 Z" 
                    fill={selectedLocality?.id === 'saket' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.12)'}
                    stroke="#10b981"
                    onClick={() => setSelectedLocality(localities.find(l => l.id === 'saket') || null)}
                    className="transition-all hover:fill-emerald-400/30"
                  />
                  <text x="290" y="310" className="text-[10px] font-black fill-emerald-600 pointer-events-none">Saket District</text>

                  {/* dw: Dwarka Sector 6 - Yellow */}
                  <path 
                    id="map-dw"
                    d="M 50,210 L 110,210 L 125,320 L 40,310 Z" 
                    fill={selectedLocality?.id === 'dw' ? 'rgba(249, 115, 22, 0.5)' : 'rgba(249, 115, 22, 0.15)'}
                    stroke="#f97316"
                    onClick={() => setSelectedLocality(localities.find(l => l.id === 'dw') || null)}
                    className="transition-all hover:fill-orange-500/30"
                  />
                  <text x="65" y="265" className="text-[10px] font-black fill-orange-600 pointer-events-none">Dwarka Sec-6</text>
                </g>
              </svg>

              {/* Float map legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-3.5 border rounded-2xl flex flex-col gap-2 shadow-md">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-1">AI Safety Legend</span>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-zinc-300">Green: Score &gt; 80 (Good)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-zinc-300">Yellow: 70-80 (Stable)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-slate-600 dark:text-zinc-300">Orange: 60-70 (Risk Alert)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-slate-600 dark:text-zinc-300">Red: &lt; 60 (Critical Block)</span>
                </div>
              </div>
            </div>
          </div>

          {/* GIS Details Panel (2 columns) */}
          <div className="lg:col-span-2">
            {selectedLocality ? (
              <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-3xl shadow-xs space-y-6 text-left h-full flex flex-col justify-between">
                <div>
                  {/* Locality Header */}
                  <div className="flex justify-between items-start border-b border-slate-50 dark:border-zinc-800 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ward District Details</span>
                      <h4 className="text-md font-black text-slate-800 dark:text-zinc-100">{selectedLocality.name}</h4>
                    </div>
                    <span className={`text-[10px] px-3 py-1 font-black rounded-xl border ${
                      selectedLocality.riskLevel === 'LOW' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      selectedLocality.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                    }`}>
                      {selectedLocality.riskLevel} RISK
                    </span>
                  </div>

                  {/* Locality Quick Metrics */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Health Score</span>
                      <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block mt-1">{selectedLocality.score}%</span>
                      <span className="text-[9px] text-emerald-500 font-bold block mt-1 capitalize">Trend: {selectedLocality.trend}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Citizen Engagement</span>
                      <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block mt-1">{selectedLocality.participation}%</span>
                      <span className="text-[9px] text-slate-400 font-medium block mt-1">Verified community votes</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Most Common Issue</span>
                      <span className="text-[11px] font-black text-slate-700 dark:text-zinc-200 block mt-1.5 truncate">{selectedLocality.mostCommonIssue}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Avg Resolution speed</span>
                      <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block mt-1">{selectedLocality.resolutionSpeed}</span>
                    </div>
                  </div>

                  {/* Narrative report */}
                  <div className="mt-6 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SLA Performance Report</span>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50/50 dark:bg-zinc-950/20 p-4 border rounded-2xl">
                      {selectedLocality.description}
                    </p>
                  </div>

                  {/* AI Generated Insights list */}
                  <div className="mt-6 space-y-3">
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 animate-spin [animation-duration:5s]" />
                      <span>Gemini City Health Prescriptions</span>
                    </span>
                    <ul className="space-y-2 text-xs">
                      {selectedLocality.aiInsights.map((insight, idx) => (
                        <li key={idx} className="flex gap-2.5 text-slate-600 dark:text-zinc-300 items-start">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                          <span className="font-medium text-left leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('/admin/issues');
                    showToast(`Filtering issues queue for ${selectedLocality.name}...`, 'info');
                  }}
                  className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Filter Active Ward Incidents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center p-6 border-2 border-dashed rounded-3xl bg-slate-50 text-slate-400 text-xs flex-col gap-2">
                <MapPin className="w-8 h-8 text-slate-300 animate-bounce" />
                <p className="font-bold">Select a Locality from Map to inspect metrics.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
