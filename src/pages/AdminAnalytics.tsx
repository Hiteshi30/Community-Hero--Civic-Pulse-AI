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

  // Datasets based on the active range selector (30, 60, 90 days)
  const statsData = {
    '30': {
      avgResolveTime: '14.8 Hours',
      avgResolveTrend: '-4.2h from last week',
      activeQueue: complaints.length,
      volunteers: '1,820 Citizens',
      volunteersTrend: '+14.2% monthly signups',
      dispatchAccuracy: '95.4%',
      monthlyRatios: [
        { month: 'Jan', reported: 68, resolved: 52 },
        { month: 'Feb', reported: 84, resolved: 71 },
        { month: 'Mar', reported: 110, resolved: 98 },
        { month: 'Apr', reported: 142, resolved: 125 },
        { month: 'May', reported: 115, resolved: 108 },
        { month: 'Jun (Forecast)', reported: 155, resolved: 140 }
      ],
      deptBacklogs: [
        { code: 'SWM', name: 'Sanitation', backlog: 14, completed: 384, color: '#10b981' },
        { code: 'WSS', name: 'Water Grid', backlog: 18, completed: 215, color: '#6366f1' },
        { code: 'RNI', name: 'Roads & Infra', backlog: 34, completed: 412, color: '#f59e0b' },
        { code: 'ESL', name: 'Streetlights', backlog: 12, completed: 189, color: '#eab308' },
        { code: 'PHC', name: 'Public Health', backlog: 8, completed: 143, color: '#ec4899' },
        { code: 'PSC', name: 'Public Safety', backlog: 5, completed: 97, color: '#8b5cf6' }
      ],
      categorySplit: [
        { name: 'Sewage Overflow', value: 34, color: '#6366f1' },
        { name: 'Road Potholes', value: 28, color: '#f59e0b' },
        { name: 'Garbage Dumping', value: 18, color: '#10b981' },
        { name: 'Streetlight Failure', value: 15, color: '#eab308' },
        { name: 'Other Assets', value: 5, color: '#64748b' }
      ],
      wardComparison: [
        { name: 'Connaught Place', safetyScore: 84, engagement: 92 },
        { name: 'Karol Bagh', safetyScore: 68, engagement: 74 },
        { name: 'Saket District', safetyScore: 89, engagement: 88 },
        { name: 'Chandni Chowk', safetyScore: 48, engagement: 61 },
        { name: 'Dwarka Sector 6', safetyScore: 77, engagement: 82 }
      ],
      insights: [
        {
          title: '1. Spatial Backlog Clustering Alert',
          text: 'Road pothole repair backlogs are highly concentrated in Karol Bagh Ward 8. Thermal compaction units are operating at **88% capacity**. Immediate crew transfer from Connaught Place is recommended to balance work order cycles and lower standard resolution times.'
        },
        {
          title: '2. Citizen Engagement Correlation Index',
          text: 'A 1% increase in citizen endorsements translates directly to an average **12.4 minute reduction** in final case closure latency. This proves that neighborhood Crowdsourced Verifications successfully expedite dispatch routing priorities.'
        }
      ]
    },
    '60': {
      avgResolveTime: '18.2 Hours',
      avgResolveTrend: '-2.1h from past 30 days',
      activeQueue: Math.round(complaints.length * 1.8) || 257,
      volunteers: '2,450 Citizens',
      volunteersTrend: '+18.5% bi-monthly signups',
      dispatchAccuracy: '94.1%',
      monthlyRatios: [
        { month: 'March', reported: 90, resolved: 80 },
        { month: 'April', reported: 120, resolved: 105 },
        { month: 'May', reported: 130, resolved: 115 },
        { month: 'June', reported: 170, resolved: 145 }
      ],
      deptBacklogs: [
        { code: 'SWM', name: 'Sanitation', backlog: 25, completed: 620, color: '#10b981' },
        { code: 'WSS', name: 'Water Grid', backlog: 31, completed: 410, color: '#6366f1' },
        { code: 'RNI', name: 'Roads & Infra', backlog: 58, completed: 780, color: '#f59e0b' },
        { code: 'ESL', name: 'Streetlights', backlog: 22, completed: 340, color: '#eab308' },
        { code: 'PHC', name: 'Public Health', backlog: 15, completed: 250, color: '#ec4899' },
        { code: 'PSC', name: 'Public Safety', backlog: 9, completed: 180, color: '#8b5cf6' }
      ],
      categorySplit: [
        { name: 'Sewage Overflow', value: 31, color: '#6366f1' },
        { name: 'Road Potholes', value: 32, color: '#f59e0b' },
        { name: 'Garbage Dumping', value: 20, color: '#10b981' },
        { name: 'Streetlight Failure', value: 12, color: '#eab308' },
        { name: 'Other Assets', value: 5, color: '#64748b' }
      ],
      wardComparison: [
        { name: 'Connaught Place', safetyScore: 81, engagement: 89 },
        { name: 'Karol Bagh', safetyScore: 64, engagement: 71 },
        { name: 'Saket District', safetyScore: 86, engagement: 85 },
        { name: 'Chandni Chowk', safetyScore: 44, engagement: 58 },
        { name: 'Dwarka Sector 6', safetyScore: 74, engagement: 79 }
      ],
      insights: [
        {
          title: '1. Seasonal Drainage Bottlenecks Identified',
          text: 'Saket District shows a 45% spike in waterlogging reports during pre-monsoon precipitation events. Emergency drainage routing systems have been initialized in collaboration with the Water Grid division.'
        },
        {
          title: '2. Secondary Public Dispatch Triage Factor',
          text: 'AI dispatch model has stabilized routing weights for public safety lighting complaints, reducing nighttime dispatch response delay to under 35 minutes on major metropolitan arterials.'
        }
      ]
    },
    '90': {
      avgResolveTime: '21.5 Hours',
      avgResolveTrend: '-1.4h over multi-month cycle',
      activeQueue: Math.round(complaints.length * 2.6) || 389,
      volunteers: '3,110 Citizens',
      volunteersTrend: '+22.1% quarterly signups',
      dispatchAccuracy: '92.8%',
      monthlyRatios: [
        { month: 'Jan', reported: 68, resolved: 52 },
        { month: 'Feb', reported: 84, resolved: 71 },
        { month: 'Mar', reported: 110, resolved: 98 },
        { month: 'Apr', reported: 142, resolved: 125 },
        { month: 'May', reported: 115, resolved: 108 },
        { month: 'Jun', reported: 185, resolved: 160 }
      ],
      deptBacklogs: [
        { code: 'SWM', name: 'Sanitation', backlog: 41, completed: 980, color: '#10b981' },
        { code: 'WSS', name: 'Water Grid', backlog: 48, completed: 650, color: '#6366f1' },
        { code: 'RNI', name: 'Roads & Infra', backlog: 92, completed: 1250, color: '#f59e0b' },
        { code: 'ESL', name: 'Streetlights', backlog: 35, completed: 590, color: '#eab308' },
        { code: 'PHC', name: 'Public Health', backlog: 24, completed: 420, color: '#ec4899' },
        { code: 'PSC', name: 'Public Safety', backlog: 14, completed: 280, color: '#8b5cf6' }
      ],
      categorySplit: [
        { name: 'Sewage Overflow', value: 29, color: '#6366f1' },
        { name: 'Road Potholes', value: 35, color: '#f59e0b' },
        { name: 'Garbage Dumping', value: 16, color: '#10b981' },
        { name: 'Streetlight Failure', value: 14, color: '#eab308' },
        { name: 'Other Assets', value: 6, color: '#64748b' }
      ],
      wardComparison: [
        { name: 'Connaught Place', safetyScore: 78, engagement: 86 },
        { name: 'Karol Bagh', safetyScore: 60, engagement: 68 },
        { name: 'Saket District', safetyScore: 83, engagement: 82 },
        { name: 'Chandni Chowk', safetyScore: 40, engagement: 55 },
        { name: 'Dwarka Sector 6', safetyScore: 71, engagement: 76 }
      ],
      insights: [
        {
          title: '1. Road Infrastructure Long-Term Analysis',
          text: 'Pothole and physical road defects constitute 35% of all reported items over the 90-day window. Long-term asphalt durability studies recommend switching to polymer-modified bitumen on high-load roads.'
        },
        {
          title: '2. Quarterly Resource Deployment Diagnostic',
          text: 'Public health and sanitation response speeds improved by 14.8% following the implementation of our real-time smart notification routing to officers in the field.'
        }
      ]
    }
  };

  const activeStats = statsData[activeRange];
  const monthlyRatios = activeStats.monthlyRatios;
  const deptBacklogs = activeStats.deptBacklogs;
  const categorySplit = activeStats.categorySplit;
  const wardComparison = activeStats.wardComparison;

  const triggerExport = () => {
    // Generate certified analytical print HTML brief
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CivicPulse AI Analytics Report - ${activeRange} Days Snapshot</title>
  <style>
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 30px;
    }
    .container {
      max-width: 950px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .header {
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-area h1 {
      margin: 0;
      color: #4f46e5;
      font-size: 26px;
      font-weight: 800;
    }
    .logo-area p {
      margin: 4px 0 0;
      font-size: 11px;
      color: #64748b;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .report-meta {
      text-align: right;
    }
    .report-meta h2 {
      margin: 0;
      font-size: 18px;
      color: #0f172a;
      font-weight: 800;
    }
    .report-meta p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #64748b;
    }
    .grid-4 {
      display: grid;
      grid-template-cols: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .metric-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: bold;
    }
    .metric-val {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 6px 0;
    }
    .metric-trend {
      font-size: 10px;
      color: #10b981;
      font-weight: bold;
    }
    .grid-2 {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 25px;
      margin-bottom: 30px;
    }
    .table-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }
    .table-card h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 13px;
      color: #4f46e5;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      padding: 10px 8px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }
    th {
      color: #64748b;
      font-weight: bold;
      background: #f8fafc;
    }
    .diagnostic-box {
      border: 1px dashed #4f46e5;
      background: #e0e7ff33;
      padding: 20px;
      border-radius: 12px;
      margin-top: 25px;
    }
    .diagnostic-box h3 {
      margin-top: 0;
      color: #3730a3;
      font-size: 15px;
      margin-bottom: 15px;
      font-weight: 800;
    }
    .btn-print {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: #4f46e5;
      color: white;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
      margin-bottom: 20px;
    }
    .btn-print:hover {
      background-color: #4338ca;
    }
    .toolbar {
      text-align: center;
      position: sticky;
      top: 0;
      background: #1e1b4b;
      padding: 15px;
      margin: -30px -30px 30px -30px;
    }
    @media print {
      .toolbar { display: none !important; }
      body { padding: 0; background: white; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      Print Official PDF Report
    </button>
  </div>
  <div class="container">
    <div class="header">
      <div class="logo-area">
        <h1>CivicPulse AI</h1>
        <p>Telemetry Analytics & Strategic Operations</p>
      </div>
      <div class="report-meta">
        <h2>METRIC TELEMETRY AUDIT</h2>
        <p>Operational Window: Past ${activeRange} Days</p>
        <p>Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
    </div>

    <div class="grid-4">
      <div class="metric-card">
        <span class="metric-label">Avg Resolve Time</span>
        <div class="metric-val">${activeStats.avgResolveTime}</div>
        <div class="metric-trend">${activeStats.avgResolveTrend}</div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Active Citizen Queue</span>
        <div class="metric-val">${activeStats.activeQueue} Cases</div>
        <div class="metric-trend">100% geo-fenced</div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Active Volunteers</span>
        <div class="metric-val">${activeStats.volunteers}</div>
        <div class="metric-trend">${activeStats.volunteersTrend}</div>
      </div>
      <div class="metric-card">
        <span class="metric-label">AI Dispatch Accuracy</span>
        <div class="metric-val">${activeStats.dispatchAccuracy}</div>
        <div class="metric-trend">Trained on 10k+ local pixels</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="table-card">
        <h3>Department Load Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Dept Code</th>
              <th>Department Name</th>
              <th>Active Backlog</th>
              <th>Completed Orders</th>
            </tr>
          </thead>
          <tbody>
            ${deptBacklogs.map(dept => `
              <tr>
                <td><strong>${dept.code}</strong></td>
                <td>${dept.name}</td>
                <td><span style="color: #6366f1; font-weight: bold;">${dept.backlog}</span></td>
                <td><span style="color: #10b981; font-weight: bold;">${dept.completed}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>Asset Failure Category Split</h3>
        <table>
          <thead>
            <tr>
              <th>Failure Category</th>
              <th>Percentage Weight</th>
            </tr>
          </thead>
          <tbody>
            ${categorySplit.map(cat => `
              <tr>
                <td>${cat.name}</td>
                <td><strong>${cat.value}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="table-card" style="margin-bottom: 25px;">
      <h3>Ward Safety Scores vs Citizen Engagement</h3>
      <table>
        <thead>
          <tr>
            <th>Assigned Ward / Region</th>
            <th>SLA Safety Score (%)</th>
            <th>Citizen Endorsements (%)</th>
          </tr>
        </thead>
        <tbody>
          ${wardComparison.map(ward => `
            <tr>
              <td><strong>${ward.name}</strong></td>
              <td>${ward.safetyScore}%</td>
              <td>${ward.engagement}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="diagnostic-box">
      <h3>Gemini Diagnostic Analytics Prescription</h3>
      <div style="margin-bottom: 15px;">
        <strong style="color: #3730a3; display: block; margin-bottom: 4px; font-size: 13px;">${activeStats.insights[0].title}</strong>
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #475569;">${activeStats.insights[0].text}</p>
      </div>
      <div>
        <strong style="color: #3730a3; display: block; margin-bottom: 4px; font-size: 13px;">${activeStats.insights[1].title}</strong>
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #475569;">${activeStats.insights[1].text}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivicPulse_Analytics_Report_${activeRange}Days.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    try {
      window.print();
    } catch (e) {
      console.log('window.print print dialog blocked or unsupported', e);
    }
    showToast(`📊 Certified ${activeRange}-Day telemetry report generated and downloaded!`, 'success');
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
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">{activeStats.avgResolveTime}</span>
            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {activeStats.avgResolveTrend}
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
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">{activeStats.activeQueue} cases</span>
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
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">{activeStats.volunteers}</span>
            <span className="text-[9px] text-indigo-500 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {activeStats.volunteersTrend}
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
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 block">{activeStats.dispatchAccuracy}</span>
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
            <p className="font-extrabold text-slate-700 dark:text-zinc-200">{activeStats.insights[0].title}</p>
            <p className="text-slate-500 dark:text-zinc-400 font-semibold">
              {activeStats.insights[0].text}
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-extrabold text-slate-700 dark:text-zinc-200">{activeStats.insights[1].title}</p>
            <p className="text-slate-500 dark:text-zinc-400 font-semibold">
              {activeStats.insights[1].text}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
