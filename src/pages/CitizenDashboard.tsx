import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapComponent } from '../components/MapComponent';
import { 
  PlusCircle, Bot, Map, Award, CheckCircle2, AlertTriangle, 
  Clock, ArrowRight, ShieldCheck, ThumbsUp, Sparkles, TrendingUp,
  Activity, Zap, Lightbulb, Users, BarChart3, MapPin, ChevronRight, MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { CityHealthDashboard } from '../components/CityHealthDashboard';
import { LiveActivityFeed } from '../components/LiveActivityFeed';


export const CitizenDashboard: React.FC = () => {
  const { user, complaints, notifications, t } = useApp();
  const navigate = useNavigate();
  const [activeChartTab, setActiveChartTab] = useState<'points' | 'status' | 'departments'>('points');
  const [selectedMyIssueId, setSelectedMyIssueId] = useState<string | null>(null);
  const [myIssuesFilter, setMyIssuesFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');
  const [userVotedFeedback, setUserVotedFeedback] = useState<Record<string, 'up' | 'down'>>({});

  // Animation states for counters
  const [impactScore, setImpactScore] = useState(0);
  const [reputationScore, setReputationScore] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);

  const citizenName = user?.name || 'Rajesh Kumar';
  const points = user?.points || 350;
  const badge = user?.badge || 'Silver Sentinel';
  
  // Calculate complaints count based on Firestore/mock data
  const myIssues = complaints.filter(c => c.reporterId === user?.uid);

  useEffect(() => {
    if (myIssues.length > 0 && !selectedMyIssueId) {
      setSelectedMyIssueId(myIssues[0].id);
    }
  }, [myIssues, selectedMyIssueId]);

  const submittedCount = myIssues.length;
  const resolvedCount = myIssues.filter(c => c.status === 'RESOLVED').length;
  const pendingCount = submittedCount - resolvedCount;

  // Animate the counters upon landing
  useEffect(() => {
    const targetImpact = Math.min(950, points * 2.4 + (resolvedCount * 120));
    const targetReputation = 98; // High reputation for verified submissions
    const targetWeekly = 150;

    let timer1 = setInterval(() => {
      setImpactScore(prev => {
        if (prev >= targetImpact) { clearInterval(timer1); return targetImpact; }
        return prev + Math.ceil(targetImpact / 30);
      });
    }, 25);

    let timer2 = setInterval(() => {
      setReputationScore(prev => {
        if (prev >= targetReputation) { clearInterval(timer2); return targetReputation; }
        return prev + 2;
      });
    }, 20);

    let timer3 = setInterval(() => {
      setWeeklyPoints(prev => {
        if (prev >= targetWeekly) { clearInterval(timer3); return targetWeekly; }
        return prev + 5;
      });
    }, 30);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, [points, resolvedCount]);

  // City-wide stats
  const cityComplaints = complaints.filter(
    c => c.city.toLowerCase() === (user?.city || 'Delhi').toLowerCase()
  );
  const activeInCity = cityComplaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'REJECTED').length || 12;

  // Nearby Critical Alerts (Indian city context)
  const CRITICAL_ALERTS = [
    {
      id: 'alert_1',
      title: 'Severe Water Logging at Ring Road bypass',
      desc: 'Active flooding reported near Connaught Underpass. Drainage pumps deployed.',
      priority: 'CRITICAL',
      time: '15 mins ago',
      dist: '0.8 km'
    },
    {
      id: 'alert_2',
      title: 'High Voltage Wire Sparking near Sector 4 Market',
      desc: 'Live cable hanging over pedestrian lane. Electricity department notified.',
      priority: 'HIGH',
      time: '1 hr ago',
      dist: '1.2 km'
    }
  ];

  // AI-Powered Recommendations
  const AI_RECOMMENDATIONS = [
    {
      id: 'rec_1',
      title: 'Monsoon Season Pre-triage Action',
      desc: 'Drain inlets tend to clog up in your ward. Report open catch basins to gain double points!',
      icon: <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
    },
    {
      id: 'rec_2',
      title: 'Verify local reports near you',
      desc: '3 water leakage issues were reported within 500m of your pinned address. Verify them to gain +15 points each.',
      icon: <Lightbulb className="w-4 h-4 text-indigo-400" />
    }
  ];

  // Recharts Mock data
  const pointsTrendData = [
    { name: 'Mon', points: 100, reports: 1 },
    { name: 'Tue', points: 150, reports: 1 },
    { name: 'Wed', points: 200, reports: 2 },
    { name: 'Thu', points: 250, reports: 2 },
    { name: 'Fri', points: 300, reports: 2 },
    { name: 'Sat', points: 350, reports: 3 },
    { name: 'Sun', points: points, reports: submittedCount }
  ];

  const statusResolutionData = [
    { name: 'Submitted', count: complaints.filter(c => c.status === 'SUBMITTED').length || 5, fill: '#6366f1' },
    { name: 'Verified', count: complaints.filter(c => c.status === 'VERIFIED').length || 8, fill: '#8b5cf6' },
    { name: 'In Progress', count: complaints.filter(c => c.status === 'IN_PROGRESS').length || 4, fill: '#f59e0b' },
    { name: 'Resolved', count: complaints.filter(c => c.status === 'RESOLVED').length || 15, fill: '#10b981' }
  ];

  const departmentPieData = [
    { name: 'Sanitation', value: 40, fill: '#ec4899' },
    { name: 'Water & Sewage', value: 25, fill: '#3b82f6' },
    { name: 'Roads/Infra', value: 20, fill: '#10b981' },
    { name: 'Electricity', value: 15, fill: '#f59e0b' }
  ];

  // Mock Neighborhood Activity Feed
  const RECENT_COMMUNITY_FEED = [
    {
      id: 'act_1',
      user: 'Ananya Sharma',
      action: 'verified pothole issue',
      location: 'Connaught Place',
      points: '+15 pts',
      time: '10m ago'
    },
    {
      id: 'act_2',
      user: 'Priya Srinivasan (Officer)',
      action: 'marked sanitation dump as RESOLVED',
      location: 'Karol Bagh Ward 4',
      points: 'AI Dispatched',
      time: '45m ago'
    },
    {
      id: 'act_3',
      user: 'Amit Patel',
      action: 'submitted a new Streetlight Dead report',
      location: 'Vasant Kunj',
      points: '+50 pts',
      time: '2 hrs ago'
    }
  ];

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Dynamic Header Banner with Glassmorphism overlay */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-[#121226] to-[#080811] text-white relative overflow-hidden border border-white/5 shadow-xl">
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl -mr-16 -mb-16 scale-125" />
        <div className="absolute left-1/4 top-0 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl -mt-16" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Civic Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Namaste, {citizenName}!
            </h2>
            <p className="text-xs text-indigo-200/80 max-w-xl font-medium leading-relaxed">
              Your active ward contributions have prevented localized bottlenecks in <span className="text-white font-black underline decoration-indigo-400">{user?.city || 'Delhi'}</span>. Review your AI-compiled reputation metrics below.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              id="report-floating-action-primary"
              onClick={() => navigate('/report')}
              className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
            <button
              id="goto-assistant-button"
              onClick={() => navigate('/chat')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-indigo-300 animate-bounce" />
              <span>Civic Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flagship Civic Scores - Glassmorphic Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Community Impact Score */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Community Impact Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">{impactScore}</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-3.5 bg-slate-50 dark:bg-zinc-950 p-2 rounded-xl text-[9px] text-slate-400">
            Based on your upvotes & resolved reports
          </div>
        </div>

        {/* AI Reputation Score */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-purple-500 dark:text-purple-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">AI Reputation Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">{reputationScore}%</h3>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold">Highly Trusted</span>
          </div>
          <div className="mt-3.5 bg-slate-50 dark:bg-zinc-950 p-2 rounded-xl text-[9px] text-slate-400">
            9/10 issues validated by city ward
          </div>
        </div>

        {/* Community Rank Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-amber-500 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
          </div>
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Community Ranking</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">#3</h3>
            <span className="text-[10px] text-slate-400 font-bold">out of 124 in Delhi</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" style={{ width: '85%' }} />
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">Top 5% Reward Bracket</span>
          </div>
        </div>

        {/* Weekly Contributions points */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-rose-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Contributions</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">+{weeklyPoints} pts</h3>
          </div>
          <div className="mt-3.5 bg-slate-50 dark:bg-zinc-950 p-2 rounded-xl text-[9px] text-slate-400">
            Next weekly batch resets in 2 days
          </div>
        </div>
      </div>

      {/* Complaints Submitted Overview Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Reports Filed By Me</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{submittedCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Resolved Issues</p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pending Inspections</p>
            <h4 className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Flagship Reported Issues & Resolution Status Triage Hub */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs text-left space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              <span>My Reported Issues & Resolution Reports</span>
            </h3>
            <p className="text-xs text-slate-400 font-bold">
              Monitor live status progression, timeline events, and official municipal closeout certifications.
            </p>
          </div>

          <div className="flex bg-slate-50 dark:bg-zinc-950 p-1 rounded-xl self-start md:self-auto border">
            {(['ALL', 'PENDING', 'RESOLVED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setMyIssuesFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                  myIssuesFilter === filter 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                {filter === 'ALL' ? 'All History' : filter === 'PENDING' ? 'Pending Repair' : 'Resolved Case'}
              </button>
            ))}
          </div>
        </div>

        {myIssues.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center border border-indigo-100/30">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-sm font-black text-slate-700 dark:text-zinc-200">No active complaints filed</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-bold">
                Your historical record is pristine. You can leverage our AI Vision model to diagnose and triage physical municipal hazards in your community instantly.
              </p>
            </div>
            <button
              onClick={() => navigate('/report')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Triage New Issue</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List Side */}
            <div className="lg:col-span-5 space-y-3 max-h-[480px] overflow-y-auto pr-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                Your Reports ({myIssues.filter(i => {
                  if (myIssuesFilter === 'PENDING') return i.status !== 'RESOLVED';
                  if (myIssuesFilter === 'RESOLVED') return i.status === 'RESOLVED';
                  return true;
                }).length})
              </p>
              {myIssues.filter(issue => {
                if (myIssuesFilter === 'PENDING') return issue.status !== 'RESOLVED';
                if (myIssuesFilter === 'RESOLVED') return issue.status === 'RESOLVED';
                return true;
              }).map((issue) => {
                const isActive = issue.id === selectedMyIssueId;
                const isResolved = issue.status === 'RESOLVED';
                
                return (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedMyIssueId(issue.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex gap-3 ${
                      isActive 
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/15 border-indigo-500 shadow-xs' 
                        : 'bg-white dark:bg-zinc-900/60 border-slate-100 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg bg-slate-50 dark:bg-zinc-950 overflow-hidden shrink-0 border relative">
                      <img 
                        src={issue.images?.[0] || 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=100&q=80'} 
                        alt="Evidence thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1 grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-black uppercase bg-slate-100 dark:bg-zinc-800/60 text-slate-500 px-1.5 py-0.5 rounded-md truncate">
                          {issue.department.split(' ')[0]}
                        </span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                          isResolved 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 truncate pr-2">
                        {issue.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{issue.address.split(',')[0]}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Tracking Panel */}
            <div className="lg:col-span-7 bg-slate-50/50 dark:bg-zinc-950/20 rounded-2xl border border-slate-100 dark:border-zinc-800 p-5 space-y-6">
              {(() => {
                const selectedIssue = myIssues.find(i => i.id === selectedMyIssueId);
                if (!selectedIssue) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400 space-y-2">
                      <Bot className="w-8 h-8 text-slate-300" />
                      <p className="text-xs font-bold">Select any report from history list to inspect live resolution details.</p>
                    </div>
                  );
                }

                const isResolved = selectedIssue.status === 'RESOLVED';
                const currentStatus = selectedIssue.status;
                const timeline = selectedIssue.timeline || [];

                // Standardized stages
                const stages: { key: IssueStatus; label: string; desc: string }[] = [
                  { key: 'SUBMITTED', label: '1. Logged', desc: 'Report submitted & point credentials allocated' },
                  { key: 'VERIFIED', label: '2. Audited', desc: 'AI Vision checked & localized on municipal grid' },
                  { key: 'ASSIGNED', label: '3. Dispatched', desc: 'Task assigned to specialized Ward Unit' },
                  { key: 'IN_PROGRESS', label: '4. Active Repair', desc: 'Civil engineering crew on location' },
                  { key: 'RESOLVED', label: '5. Resolved', desc: 'Closure statement issued by municipality' },
                ];

                const getStageIndex = (status: IssueStatus) => {
                  const idx = stages.findIndex(s => s.key === status);
                  return idx !== -1 ? idx : 0;
                };

                const currentStageIdx = getStageIndex(currentStatus);

                return (
                  <div className="space-y-5">
                    {/* Header Info */}
                    <div className="space-y-1.5 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white ${
                          selectedIssue.priority === 'CRITICAL' ? 'bg-rose-600' : selectedIssue.priority === 'HIGH' ? 'bg-amber-500' : 'bg-slate-500'
                        }`}>
                          {selectedIssue.priority} Severity
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Filed on {new Date(selectedIssue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">
                        {selectedIssue.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-300 leading-relaxed font-semibold">
                        {selectedIssue.description}
                      </p>
                    </div>

                    {/* Stepper Grid */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Live Status Stepper
                      </p>
                      <div className="grid grid-cols-5 gap-1.5 relative">
                        {stages.map((stage, idx) => {
                          const isCompleted = idx <= currentStageIdx;
                          const isActive = idx === currentStageIdx;
                          
                          return (
                            <div key={stage.key} className="flex flex-col items-center text-center space-y-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                isCompleted 
                                  ? 'bg-indigo-600 text-white shadow-xs' 
                                  : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-400'
                              } ${isActive ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}`}>
                                {isCompleted ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[9px] font-black tracking-tight ${
                                isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-700 dark:text-zinc-300' : 'text-slate-400'
                              }`}>
                                {stage.key.replace('_', ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Case Timeline logs */}
                    <div className="bg-white dark:bg-zinc-900 border rounded-xl p-3 text-xs space-y-2.5">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">
                        Official Timeline Logs
                      </span>
                      <div className="space-y-2">
                        {timeline.map((event, i) => (
                          <div key={i} className="flex gap-2 text-[10px] items-start border-l border-indigo-100 dark:border-zinc-800 pl-2.5 ml-1.5 relative">
                            <span className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500 -left-[4px] top-1" />
                            <div className="space-y-0.5 grow">
                              <div className="flex justify-between font-bold">
                                <span className="text-slate-700 dark:text-zinc-200 uppercase tracking-wide">
                                  {event.status}
                                </span>
                                <span className="text-slate-400 font-medium">
                                  {new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-500 dark:text-zinc-400">{event.note}</p>
                              <span className="text-[9px] text-indigo-400/80 font-bold">Updated by: {event.updatedBy || 'System'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official Resolution Certified Report (Shown if RESOLVED) */}
                    {isResolved && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-500/10 dark:from-emerald-950/20 dark:to-emerald-500/5 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-800/20 pb-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Official Resolution Certified Report</span>
                          </span>
                          <span className="text-[8px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black tracking-widest uppercase">
                            Case Closed
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500 dark:text-zinc-400 font-semibold">
                          <div>
                            <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">Certified Authority</span>
                            <span className="text-slate-800 dark:text-zinc-200 font-black">
                              {selectedIssue.assignedOfficerName || 'Senior Ward Inspector'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">Department In-Charge</span>
                            <span className="text-slate-800 dark:text-zinc-200 font-black">
                              {selectedIssue.department}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-emerald-100 dark:border-emerald-950 text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300">
                          <span className="text-slate-400 font-extrabold block text-[8px] uppercase tracking-wider mb-0.5">Resolution Summary Statement</span>
                          {timeline.find(t => t.status === 'RESOLVED')?.note || 
                            'The reported infrastructure hazard has been fully cleared, tested, and certified safe for general public traversal. Standard aggregate or component leveling applied successfully.'}
                        </div>

                        {/* Interactive Feedback Rating */}
                        <div className="flex items-center justify-between pt-1.5 gap-4">
                          <span className="text-[10px] font-extrabold text-slate-700 dark:text-zinc-300">Are you satisfied with the resolution?</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setUserVotedFeedback(prev => ({ ...prev, [selectedIssue.id]: 'up' }));
                                showToast('Thank you for verifying the municipal resolution!', 'success');
                              }}
                              className={`p-1.5 rounded-lg border transition-all flex items-center justify-center gap-1.5 text-[9px] font-black ${
                                userVotedFeedback[selectedIssue.id] === 'up'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white dark:bg-zinc-900 hover:bg-emerald-50 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => {
                                setUserVotedFeedback(prev => ({ ...prev, [selectedIssue.id]: 'down' }));
                                showToast('We have logged your dissatisfaction. Standard inspection flag raised.', 'info');
                              }}
                              className={`p-1.5 rounded-lg border transition-all flex items-center justify-center gap-1.5 text-[9px] font-black ${
                                userVotedFeedback[selectedIssue.id] === 'down'
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-white dark:bg-zinc-900 hover:bg-rose-50 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5 rotate-180" />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Flagship Upgraded City Health Dashboard */}
      <CityHealthDashboard />

      {/* Section with Interactive Charts & Alerts / Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Advanced Recharts Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Interactive Analytics Engine</h4>
              <p className="text-[10px] text-slate-400 font-bold">Monitor ward resolution performance indicators</p>
            </div>

            <div className="flex gap-1.5 bg-slate-50 dark:bg-zinc-950 p-1.5 rounded-xl self-start sm:self-auto">
              <button
                id="chart-tab-points"
                onClick={() => setActiveChartTab('points')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide transition-all ${
                  activeChartTab === 'points' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                My Trend
              </button>
              <button
                id="chart-tab-status"
                onClick={() => setActiveChartTab('status')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide transition-all ${
                  activeChartTab === 'status' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Ward Rates
              </button>
              <button
                id="chart-tab-departments"
                onClick={() => setActiveChartTab('departments')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide transition-all ${
                  activeChartTab === 'departments' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Categories
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'points' ? (
                <AreaChart data={pointsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Area type="monotone" dataKey="points" name="Civic Points" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
                </AreaChart>
              ) : activeChartTab === 'status' ? (
                <BarChart data={statusResolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Bar dataKey="count" name="Issues Count" radius={[6, 6, 0, 0]}>
                    {statusResolutionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={departmentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 dark:fill-white font-black text-xs">
                    Ward 104
                  </text>
                  <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 font-bold text-[9px]">
                    Delhi NCR
                  </text>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-400 flex-wrap pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Sanitation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Water & Sewage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Roads/Infra</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Electricity</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations & Nearby Critical Alerts */}
        <div className="space-y-5">
          {/* Nearby Critical Alerts (Indian city context) */}
          <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                <h4 className="text-xs font-black uppercase text-rose-800 dark:text-rose-400 tracking-wider">Nearby Critical Alerts</h4>
              </div>
              <span className="text-[9px] font-black bg-rose-200/50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3">
              {CRITICAL_ALERTS.map((alert) => (
                <div key={alert.id} className="p-3 bg-white dark:bg-zinc-900/80 rounded-xl border border-rose-100/30 dark:border-rose-950/50 text-left text-[11px] space-y-1 relative">
                  <span className="absolute top-3 right-3 text-[8px] font-bold text-slate-400">{alert.time}</span>
                  <p className="font-extrabold text-slate-800 dark:text-zinc-200 pr-12 line-clamp-1">{alert.title}</p>
                  <p className="text-slate-500 dark:text-zinc-400 leading-normal text-[10px] line-clamp-2">{alert.desc}</p>
                  <div className="flex items-center gap-2 pt-1 font-bold text-[9px] text-rose-500">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.dist} away</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisor Recommendations */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black uppercase text-indigo-800 dark:text-indigo-400 tracking-wider">AI Recommendations</h4>
            </div>

            <div className="space-y-3">
              {AI_RECOMMENDATIONS.map((rec) => (
                <div key={rec.id} className="flex gap-2.5 text-xs text-left">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    {rec.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-700 dark:text-zinc-200 text-[11px]">{rec.title}</p>
                    <p className="text-slate-500 dark:text-zinc-400 text-[10px] leading-relaxed">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Layout: Hotspots Map + Community Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Local Ward Map Hotspots */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Ward Hotspots</h4>
              <p className="text-[10px] text-slate-400 font-bold">Inspect localized report nodes on community grid</p>
            </div>
            <button 
              id="fullscreen-map-trigger"
              onClick={() => navigate('/issues')} 
              className="text-xs text-indigo-500 hover:underline font-extrabold flex items-center gap-1"
            >
              <span>Explore Ward Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MapComponent
            complaints={complaints}
            selectedCity={user?.city || 'Delhi'}
            onSelectComplaint={(c) => navigate(`/issues?id=${c.id}`)}
            interactiveMode="view"
          />
        </div>

        {/* Live Streaming AI Operations Activity Feed */}
        <div className="space-y-4">
          <LiveActivityFeed />
        </div>
      </div>

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 animate-bounce [animation-duration:3s]">
        <button
          id="quick-report-float"
          onClick={() => navigate('/report')}
          className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all cursor-pointer hover:scale-105 flex items-center justify-center border border-white/10"
          title="Instant Quick Report"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
