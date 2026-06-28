import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, Cpu, Zap, Activity, ToggleLeft, ToggleRight, Sparkles, 
  CheckCircle, Shield, FileText, TrendingUp, Users, Calendar, 
  AlertTriangle, Hammer, ArrowRight, Download, BarChart3, LineChart as LineIcon,
  Check, RefreshCw, Send, HelpCircle, ShieldAlert, Minimize2
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar 
} from 'recharts';

export const AdminAgents: React.FC = () => {
  const { user, complaints, departments, showToast } = useApp();
  const [activeAgentId, setActiveAgentId] = useState<'planner' | 'allocator' | 'executive' | 'trend' | 'decision'>('planner');
  
  // States for Agent 1 (Resolution Planner)
  const [selectedComplaintId, setSelectedComplaintId] = useState(complaints[0]?.id || 'complaint_delhi_1');
  const [planningOutput, setPlanningOutput] = useState<any | null>(null);
  const [planningLoading, setPlanningLoading] = useState(false);

  // States for Agent 2 (Resource Allocator)
  const [allocatorBacklogs, setAllocatorBacklogs] = useState([
    { ward: 'Karol Bagh', roadsCrew: 2, sanitationCrew: 4, roadsLoad: 88, sanitationLoad: 54 },
    { ward: 'Connaught Place', roadsCrew: 4, sanitationCrew: 3, roadsLoad: 32, sanitationLoad: 78 },
    { ward: 'Saket District', roadsCrew: 3, sanitationCrew: 3, roadsLoad: 41, sanitationLoad: 45 },
    { ward: 'Chandni Chowk', roadsCrew: 1, sanitationCrew: 2, roadsLoad: 94, sanitationLoad: 92 },
    { ward: 'Dwarka Sector 6', roadsCrew: 3, sanitationCrew: 2, roadsLoad: 60, sanitationLoad: 52 }
  ]);
  const [allocationRecommendation, setAllocationRecommendation] = useState<any | null>(null);
  const [allocatorRunning, setAllocatorRunning] = useState(false);

  // States for Agent 3 (Executive Summarizer)
  const [summaryReport, setSummaryReport] = useState<string | null>(null);
  const [summarizerLoading, setSummarizerLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // States for Agent 4 (Trend Intelligence)
  const [trendForecastRun, setTrendForecastRun] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);

  // States for Agent 5 (Decision Support)
  const [decisionOutput, setDecisionOutput] = useState<any | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  // Delhi complaints
  const delhiIssues = complaints.filter(c => c.city.toLowerCase() === (user?.city || 'Delhi').toLowerCase());

  // Trigger: Agent 1 - Resolution Planner
  const generateResolutionPlan = () => {
    setPlanningLoading(true);
    showToast('🧠 Resolution Planning Agent generating repair logistics...', 'info');

    setTimeout(() => {
      const match = complaints.find(c => c.id === selectedComplaintId) || complaints[0];
      const isRoad = match?.department.toLowerCase().includes('road') || false;
      const isWater = match?.department.toLowerCase().includes('water') || match?.department.toLowerCase().includes('sewage') || false;
      
      setPlanningOutput({
        title: match?.title || 'Civic Fix',
        manpower: isRoad ? '4 Asphalt Engineers, 2 Heavy Vehicle Crew, 1 Safety Overseer' : isWater ? '2 Pipe Mechanics, 2 Plumbing Techs, 1 Drainage Inspector' : '3 Sanitation Workers, 1 Dumper Driver',
        materials: isRoad ? '3 Tons Grade-A cold bituminous asphalt mix, Tack coat spray, Road sealer' : isWater ? '2 Heavy duty pipe couplers (6-inch), Teflon pressure tape, Leak compound' : '15 Bags of Calcium Hypochlorite disinfectant, 5 Heavy duty waste sacks',
        equipment: isRoad ? 'Vibratory plate compactor, Asphalt thermal heater cutter, Hydraulic lift' : isWater ? 'Sump suction diesel pump, High-pressure hydraulic jetting truck, Trench jack' : 'Skip loader truck, Mechanical debris grabber, Disinfectant sprinkler',
        cost: isRoad ? '₹24,800 INR' : isWater ? '₹11,500 INR' : '₹4,200 INR',
        duration: isRoad ? '5 Hours work duration' : isWater ? '3 Hours work duration' : '2 Hours work duration',
        milestones: [
          'Coordinate barricading and traffic re-routing alerts.',
          'De-watering coordinates and removing unstable subsurface gravel/debris.',
          'Physical placement of replacement materials & compaction verification.',
          'SLA visual upload and neighborhood notification clearance.'
        ],
        safetyProtocol: 'Standard protective equipment, reflective vest, trench safety shielding and gas sensors for sewer entry.'
      });
      setPlanningLoading(false);
      showToast('✨ Specialized action blueprint compiled!', 'success');
    }, 1200);
  };

  // Trigger: Agent 2 - Resource Allocator Simulation
  const runResourceBalancer = () => {
    setAllocatorRunning(true);
    showToast('⚖️ Resource Allocation Agent running load balancing simulation...', 'info');

    setTimeout(() => {
      // Simulate optimized crew transfers
      setAllocationRecommendation({
        transfers: [
          { from: 'Connaught Place', to: 'Karol Bagh', crewType: 'Roads & Asphalt Crew', quantity: '1 Crew', reason: 'Connaught Place roads load is low (32%) while Karol Bagh is severely overloaded (88%).' },
          { from: 'Saket District', to: 'Chandni Chowk', crewType: 'Sanitation Crew', quantity: '1 Crew', reason: 'Chandni Chowk sanitation load is critical (92%) due to high density lane obstructions.' }
        ],
        impactForecast: 'SLA resolution times across Karol Bagh and Chandni Chowk are estimated to drop by 22% within 48 hours post-dispatch.'
      });
      
      // Update backlogs state to show balanced scores
      setAllocatorBacklogs([
        { ward: 'Karol Bagh', roadsCrew: 3, sanitationCrew: 4, roadsLoad: 62, sanitationLoad: 54 },
        { ward: 'Connaught Place', roadsCrew: 3, sanitationCrew: 3, roadsLoad: 32, sanitationLoad: 78 },
        { ward: 'Saket District', roadsCrew: 3, sanitationCrew: 2, roadsLoad: 41, sanitationLoad: 45 },
        { ward: 'Chandni Chowk', roadsCrew: 1, sanitationCrew: 3, roadsLoad: 94, sanitationLoad: 68 },
        { ward: 'Dwarka Sector 6', roadsCrew: 3, sanitationCrew: 2, roadsLoad: 60, sanitationLoad: 52 }
      ]);

      setAllocatorRunning(false);
      showToast('⚖️ Balancing recommendation dispatched successfully!', 'success');
    }, 1500);
  };

  // Trigger: Agent 3 - Executive Summarizer Report
  const compileExecutiveReport = () => {
    setSummarizerLoading(true);
    showToast('📝 Executive Summarizer compiling municipal brief...', 'info');

    setTimeout(() => {
      const activeCount = delhiIssues.filter(c => c.status !== 'RESOLVED' && c.status !== 'REJECTED').length;
      const resolvedCount = delhiIssues.filter(c => c.status === 'RESOLVED').length;
      const criticalCount = delhiIssues.filter(c => c.priority === 'CRITICAL').length;

      setSummaryReport(`## MUNICIPAL EXECUTIVE OPERATIONS BRIEF
**Prepared for:** Ward Commissioner, Delhi Corporative Circle
**Scope Period:** ${reportPeriod.toUpperCase()} SUMMARY
**Telemetry Engine Status:** ACTIVE • AI Triage Online

---

### I. CORE PERFORMANCE METRICS
*   **Total Ledger Cases in Sector:** ${delhiIssues.length} active entries
*   **Resolved & Completed Closures:** ${resolvedCount} cases verified
*   **Active Dispatched Queue:** ${activeCount} cases in progress
*   **Critical Backlogs Awaiting SLA:** ${criticalCount} cases flagged

### II. SECTOR RISK TEMPERATURE INDEX
*   **Connaught Place (Ward 4):** Tier 1 (Good) • Health Score: 84% • Low Sewer Risk
*   **Chandni Chowk (Ward 1):** Tier 4 (Critical) • Health Score: 48% • High Grid Overload
*   **Karol Bagh (Ward 8):** Tier 3 (Stable) • Health Score: 68% • Roads backlog delay

### III. ACTIONABLE RECOMMENDATIONS
1.  **Monsoon Sewer Mitigation:** Accelerate preventive desilting works in Connaught Place Block E.
2.  **Special Utility deployment:** Dispatch narrow-lane micro loaders to Chandni Chowk to resolve pending sanitation backlogs.
3.  **Resource Allocation:** Transfer 1 roads crew from Connaught Place to Karol Bagh flyover lanes to resolve critical pothole complaints.

---
*Report generated and digitally verified by CivicPulse AI Executive Agent.*`);
      setSummarizerLoading(false);
      showToast('✨ Municipal Brief completed. Print-ready formatting active.', 'success');
    }, 1500);
  };

  // Trigger: Agent 4 - Trend Intelligence Forecast
  const runTrendForecaster = () => {
    setForecastLoading(true);
    showToast('🔮 Trend Intelligence Agent crunching seasonal forecast...', 'info');

    setTimeout(() => {
      setTrendForecastRun(true);
      setForecastLoading(false);
      showToast('🔮 Seasonal predictions computed.', 'success');
    }, 1200);
  };

  // Trigger: Agent 5 - Decision Support Explanation
  const evaluateDecisionSupport = () => {
    setDecisionLoading(true);
    showToast('⚖️ Decision Support Agent analyzing SLA metrics...', 'info');

    setTimeout(() => {
      const match = complaints.find(c => c.id === selectedComplaintId) || complaints[0];
      const weight = match?.priority === 'CRITICAL' ? 'High Impact' : match?.priority === 'HIGH' ? 'Moderate Impact' : 'Low Impact';
      
      setDecisionOutput({
        reasoning: `This issue "${match?.title}" has been assigned ${match?.priority} priority based on geographic location risk factors and neighbor endorsement triggers.`,
        endorsementFactor: `With ${match?.verificationCount} citizen endorsements, this issue exceeds the neighborhood SLA priority threshold by ${Math.max(0, match?.verificationCount - 5)} validations.`,
        delayRisk: match?.status === 'IN_PROGRESS' ? 'Low Risk: Supervisor on site; resolution expected before SLA expiration.' : 'Medium Risk: Awaiting crew assignment. Re-routing highly recommended.',
        citizenImpact: `Approximately ${match?.priority === 'CRITICAL' ? '250+' : '50+'} localized residents are directly impacted by this municipal asset failure daily.`,
        recommendation: match?.priority === 'CRITICAL' ? '⚠️ IMMEDIATE ESCALATION: Auto-approve emergency crew budget up to ₹15,000 INR.' : 'Standard routing is sufficient. Deploy standard dispatch within next 12 hours.'
      });
      setDecisionLoading(false);
      showToast('✨ Decision intelligence compiled.', 'success');
    }, 1300);
  };

  // Agent Forecast Mock Data
  const forecastData = [
    { week: 'Wk 1', sewageCount: 8, roadCount: 14, electricCount: 5 },
    { week: 'Wk 2', sewageCount: 12, roadCount: 19, electricCount: 9 },
    { week: 'Wk 3', sewageCount: 18, roadCount: 11, electricCount: 12 },
    { week: 'Wk 4', sewageCount: 24, roadCount: 8, electricCount: 6 }, // Predicted spike in sewage
    { week: 'Wk 5 (Forecast)', sewageCount: 30, roadCount: 15, electricCount: 14 },
    { week: 'Wk 6 (Forecast)', sewageCount: 35, roadCount: 18, electricCount: 16 }
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border p-6 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-500" />
            <span>AI Command Center</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Deploy 5 specialized municipal AI agents to automate logistics, forecast failures, balance crews, and draft executive reports.</p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-purple-950/20 border border-indigo-100 dark:border-purple-900 px-4 py-2 rounded-xl shrink-0">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-[10px] font-black text-slate-600 dark:text-purple-300">Decentralized Agent Fleet Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 5 AI Agents Selector list (4 span) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Agent Rosters</h3>
          
          <div className="space-y-2.5">
            {/* Agent 1 Button */}
            <button
              id="btn-agent-planner"
              onClick={() => setActiveAgentId('planner')}
              className={`w-full p-4 rounded-2xl border text-left flex gap-3.5 transition-all ${
                activeAgentId === 'planner'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-100 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-850'
              }`}
            >
              <Hammer className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold tracking-wider block uppercase opacity-75">AI Agent 1</span>
                <span className="text-xs font-black block">Resolution Planner</span>
                <p className="text-[10px] opacity-80 line-clamp-1 leading-normal font-semibold">Step-by-step repair logistics blueprints</p>
              </div>
            </button>

            {/* Agent 2 Button */}
            <button
              id="btn-agent-allocator"
              onClick={() => setActiveAgentId('allocator')}
              className={`w-full p-4 rounded-2xl border text-left flex gap-3.5 transition-all ${
                activeAgentId === 'allocator'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-100 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-850'
              }`}
            >
              <Users className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold tracking-wider block uppercase opacity-75">AI Agent 2</span>
                <span className="text-xs font-black block">Resource Allocator</span>
                <p className="text-[10px] opacity-80 line-clamp-1 leading-normal font-semibold">Load balancing across wards & departments</p>
              </div>
            </button>

            {/* Agent 3 Button */}
            <button
              id="btn-agent-executive"
              onClick={() => setActiveAgentId('executive')}
              className={`w-full p-4 rounded-2xl border text-left flex gap-3.5 transition-all ${
                activeAgentId === 'executive'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-100 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-850'
              }`}
            >
              <FileText className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold tracking-wider block uppercase opacity-75">AI Agent 3</span>
                <span className="text-xs font-black block">Executive Summarizer</span>
                <p className="text-[10px] opacity-80 line-clamp-1 leading-normal font-semibold">1-click print briefing compiler</p>
              </div>
            </button>

            {/* Agent 4 Button */}
            <button
              id="btn-agent-trend"
              onClick={() => setActiveAgentId('trend')}
              className={`w-full p-4 rounded-2xl border text-left flex gap-3.5 transition-all ${
                activeAgentId === 'trend'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-100 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-850'
              }`}
            >
              <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold tracking-wider block uppercase opacity-75">AI Agent 4</span>
                <span className="text-xs font-black block">Trend Intelligence</span>
                <p className="text-[10px] opacity-80 line-clamp-1 leading-normal font-semibold">Failure forecasting & seasonal predictions</p>
              </div>
            </button>

            {/* Agent 5 Button */}
            <button
              id="btn-agent-decision"
              onClick={() => setActiveAgentId('decision')}
              className={`w-full p-4 rounded-2xl border text-left flex gap-3.5 transition-all ${
                activeAgentId === 'decision'
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-100 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-850'
              }`}
            >
              <Shield className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold tracking-wider block uppercase opacity-75">AI Agent 5</span>
                <span className="text-xs font-black block">Decision Support</span>
                <p className="text-[10px] opacity-80 line-clamp-1 leading-normal font-semibold">Priority justification & risk auditing</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Active Agent Workspace Panel (8 span) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-6 md:p-8 rounded-3xl shadow-xs min-h-[460px] text-left">
          
          {/* 1. PLANNER agent workspace */}
          {activeAgentId === 'planner' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-800 pb-4">
                <h4 className="text-md font-black text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <Hammer className="w-5 h-5 text-indigo-500" />
                  <span>Agent 1: Resolution Planning Agent</span>
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">Formulates complete step-by-step dispatch blueprints specifying required mechanics, equipment, budget, and milestone sequence.</p>
              </div>

              {/* Input: Select complaint */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Active Incident to Plan</label>
                <div className="flex gap-3">
                  <select
                    id="planner-incident-select"
                    value={selectedComplaintId}
                    onChange={(e) => {
                      setSelectedComplaintId(e.target.value);
                      setPlanningOutput(null);
                    }}
                    className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none"
                  >
                    {delhiIssues.map(c => (
                      <option key={c.id} value={c.id}>[{c.department.split(' ')[0]}] {c.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={generateResolutionPlan}
                    disabled={planningLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${planningLoading ? 'animate-spin' : ''}`} />
                    <span>{planningLoading ? 'Compiling...' : 'Synthesize Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Output Blueprint */}
              {planningOutput ? (
                <div className="p-5 bg-slate-50 dark:bg-zinc-950 border rounded-2xl space-y-4 text-xs animate-fadeIn text-left">
                  <div className="flex justify-between items-center border-b dark:border-zinc-850 pb-2 flex-wrap gap-2">
                    <span className="font-extrabold text-slate-700 dark:text-zinc-200">LOGISTICAL SPECIFICATION PLAN: {planningOutput.title}</span>
                    <span className="text-[9.5px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-mono font-black px-2 py-0.5 rounded-md">{planningOutput.cost} Budget</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Manpower Requirements</span>
                      <p className="font-extrabold text-slate-700 dark:text-zinc-300">{planningOutput.manpower}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Consumable Materials</span>
                      <p className="font-extrabold text-slate-700 dark:text-zinc-300">{planningOutput.materials}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Mechanical Assets</span>
                      <p className="font-extrabold text-slate-700 dark:text-zinc-300">{planningOutput.equipment}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Work Duration</span>
                      <p className="font-extrabold text-slate-700 dark:text-zinc-300">{planningOutput.duration}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950 rounded-xl">
                    <span className="text-[8px] font-black text-rose-700 uppercase tracking-widest block">Environmental Safety Guidelines</span>
                    <span className="text-[10.5px] text-slate-600 dark:text-zinc-300 font-semibold">{planningOutput.safetyProtocol}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Recommended Dispatch Sequence</span>
                    <div className="space-y-1.5 font-bold">
                      {planningOutput.milestones.map((mil: string, idx: number) => (
                        <div key={idx} className="flex gap-2 text-slate-600 dark:text-zinc-300 items-start">
                          <span className="w-4 h-4 rounded bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                          <span>{mil}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-44 border border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs bg-slate-50/40 dark:bg-zinc-950/20 gap-1.5">
                  <Hammer className="w-6 h-6 text-slate-300" />
                  <p className="font-bold">Awaiting incident selection. Click "Synthesize Plan" to run.</p>
                </div>
              )}
            </div>
          )}

          {/* 2. ALLOCATOR agent workspace */}
          {activeAgentId === 'allocator' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-800 pb-4">
                <h4 className="text-md font-black text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span>Agent 2: Resource Allocation balancer</span>
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">Monitors active crew loads across Delhi Wards. Recommends instant redepolyments to balance backlogs and prevent SLA violations.</p>
              </div>

              {/* Ward Telemetry Board */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 pl-1">
                  <span>Ward District</span>
                  <div className="flex gap-16">
                    <span>Roads Crew Load</span>
                    <span>Sanitation Crew Load</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {allocatorBacklogs.map((rec) => (
                    <div key={rec.ward} className="p-3 bg-slate-50 dark:bg-zinc-950 border rounded-xl flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-700 dark:text-zinc-200">{rec.ward}</span>
                      <div className="flex items-center gap-8">
                        {/* Roads crew load */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">{rec.roadsCrew} crews</span>
                          <div className="w-16 h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${rec.roadsLoad}%` }} />
                          </div>
                          <span className={`font-mono font-black w-8 text-right ${rec.roadsLoad > 80 ? 'text-rose-500' : 'text-slate-500'}`}>{rec.roadsLoad}%</span>
                        </div>

                        {/* Sanitation crew load */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">{rec.sanitationCrew} crews</span>
                          <div className="w-16 h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${rec.sanitationLoad}%` }} />
                          </div>
                          <span className={`font-mono font-black w-8 text-right ${rec.sanitationLoad > 80 ? 'text-rose-500' : 'text-slate-500'}`}>{rec.sanitationLoad}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Run */}
              {!allocationRecommendation && (
                <button
                  onClick={runResourceBalancer}
                  disabled={allocatorRunning}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${allocatorRunning ? 'animate-spin' : ''}`} />
                  <span>{allocatorRunning ? 'Simulating Optimizations...' : 'Trigger AI Load Balancing'}</span>
                </button>
              )}

              {/* recommendation Output */}
              {allocationRecommendation && (
                <div className="p-5 bg-purple-50/30 dark:bg-purple-950/5 border border-purple-100 dark:border-zinc-850 rounded-2xl space-y-4 text-xs animate-fadeIn">
                  <span className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider block">AI Load Balancing Prescriptions</span>
                  
                  <div className="space-y-3">
                    {allocationRecommendation.transfers.map((tran: any, index: number) => (
                      <div key={index} className="p-3 bg-white dark:bg-zinc-950/60 border rounded-xl flex gap-3 text-left">
                        <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-800 dark:text-zinc-200">
                            Transfer <span className="text-indigo-600 dark:text-indigo-400">{tran.quantity} ({tran.crewType})</span> from <span className="font-bold">{tran.from}</span> to <span className="font-bold">{tran.to}</span>
                          </p>
                          <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">{tran.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-300 font-extrabold bg-purple-100/40 dark:bg-purple-950/30 p-3 rounded-xl border border-purple-100/50">
                    📈 Forecasted Impact: {allocationRecommendation.impactForecast}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 3. EXECUTIVE agent workspace */}
          {activeAgentId === 'executive' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-800 pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="text-md font-black text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <span>Agent 3: Executive Summary Agent</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Drafts comprehensive, print-ready summaries of active workloads, risk, and achievements.</p>
                </div>
                
                {/* Period toggle */}
                <div className="flex bg-slate-50 dark:bg-zinc-950 p-1 rounded-lg border text-[10px] font-black">
                  {['daily', 'weekly', 'monthly'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setReportPeriod(p as any);
                        setSummaryReport(null);
                      }}
                      className={`px-2.5 py-1 rounded-md transition-colors uppercase ${reportPeriod === p ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action trigger */}
              {!summaryReport && (
                <div className="py-12 border border-dashed rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/20 text-slate-400 text-xs gap-3">
                  <FileText className="w-8 h-8 text-slate-300" />
                  <div className="text-center space-y-1">
                    <p className="font-bold">Compile {reportPeriod} summary brief of active Delhi municipal sector</p>
                    <p className="text-[10px] text-slate-400">Aggregates real-time active, pending, and critical case statistics.</p>
                  </div>
                  <button
                    onClick={compileExecutiveReport}
                    disabled={summarizerLoading}
                    className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md"
                  >
                    {summarizerLoading ? 'Assembling Report...' : 'Synthesize Executive Summary'}
                  </button>
                </div>
              )}

              {/* Compiled Report Output */}
              {summaryReport && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-6 bg-zinc-950 text-slate-200 border border-zinc-800 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto text-left shadow-inner">
                    {summaryReport}
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => setSummaryReport(null)}
                      className="px-4 py-2 border dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
                    >
                      Clear Briefing
                    </button>
                    <button
                      onClick={() => {
                        window.print();
                        showToast('Triggering browser print protocol...', 'success');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Print Briefing</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. TREND agent workspace */}
          {activeAgentId === 'trend' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-800 pb-4">
                <h4 className="text-md font-black text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  <span>Agent 4: Trend Intelligence Forecaster</span>
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">Identifies fast-growing issue clusters and predicts next week's anticipated failure counts based on weather forecasts & historic seasonality.</p>
              </div>

              {!trendForecastRun ? (
                <div className="py-12 border border-dashed rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/20 text-slate-400 text-xs gap-3">
                  <LineIcon className="w-8 h-8 text-slate-300" />
                  <div className="text-center space-y-1">
                    <p className="font-bold">Run AI Seasonal Predictive Forecasting Model</p>
                    <p className="text-[10px] text-slate-400">Generates 2-week forward projections for Sewage, Roads, and lighting grids.</p>
                  </div>
                  <button
                    onClick={runTrendForecaster}
                    disabled={forecastLoading}
                    className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md"
                  >
                    {forecastLoading ? 'Evaluating seasonality...' : 'Generate 2-Week Forecast'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn text-xs">
                  {/* Forecast chart */}
                  <div className="p-4 bg-slate-50 dark:bg-zinc-950 border rounded-2xl text-left space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">AI Seasonality Forecast Index</span>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                          <XAxis dataKey="week" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                          <YAxis tick={{ fontSize: 9, fontWeight: 'bold' }} />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 10 }} />
                          <Legend wrapperStyle={{ fontSize: 9, fontWeight: 'bold' }} />
                          <Line type="monotone" dataKey="sewageCount" stroke="#6366f1" strokeWidth={3} name="Water/Sewer Failures" />
                          <Line type="monotone" dataKey="roadCount" stroke="#10b981" strokeWidth={3} name="Pothole/Road damage" />
                          <Line type="monotone" dataKey="electricCount" stroke="#f59e0b" strokeWidth={3} name="Lighting Faults" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Forecast insights */}
                  <div className="p-4 bg-purple-50/40 dark:bg-zinc-950/20 border rounded-xl text-left space-y-2">
                    <span className="text-[9.5px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest block">Core Prediction Insights</span>
                    <ul className="space-y-2 leading-relaxed">
                      <li className="flex gap-2 items-start font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>⚠️ Water Sewage failures are predicted to peak at **35 active complaints** in Week 6 due to 84% probability of pre-monsoon precipitation. Urgent desilting is advised.</span>
                      </li>
                      <li className="flex gap-2 items-start font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Road repairs are projected to stabilize as dry weather binder sets in, reducing backlog load across Karol Bagh.</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setTrendForecastRun(false)}
                    className="px-4 py-2 border dark:border-zinc-800 rounded-xl font-bold hover:bg-slate-50"
                  >
                    Reset Models
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. DECISION agent workspace */}
          {activeAgentId === 'decision' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-800 pb-4">
                <h4 className="text-md font-black text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <span>Agent 5: Decision Support & Risk Auditor</span>
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">Provides explanations for AI-assigned priorities, auditing delay risks, and citizens density metrics before committing funds.</p>
              </div>

              {/* Input: Select complaint */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Active Incident to Audit</label>
                <div className="flex gap-3">
                  <select
                    id="decision-incident-select"
                    value={selectedComplaintId}
                    onChange={(e) => {
                      setSelectedComplaintId(e.target.value);
                      setDecisionOutput(null);
                    }}
                    className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none"
                  >
                    {delhiIssues.map(c => (
                      <option key={c.id} value={c.id}>[{c.priority}] {c.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={evaluateDecisionSupport}
                    disabled={decisionLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${decisionLoading ? 'animate-spin' : ''}`} />
                    <span>{decisionLoading ? 'Auditing...' : 'Audit Incident'}</span>
                  </button>
                </div>
              </div>

              {/* Decision support output */}
              {decisionOutput ? (
                <div className="p-5 bg-slate-50 dark:bg-zinc-950 border rounded-2xl space-y-4 text-xs animate-fadeIn text-left leading-relaxed">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">AI Priority Justification</span>
                    <p className="font-extrabold text-slate-700 dark:text-zinc-300">{decisionOutput.reasoning}</p>
                  </div>

                  <div className="space-y-1 border-t dark:border-zinc-850 pt-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Citizen Endorsement Tally</span>
                    <p className="font-extrabold text-slate-700 dark:text-zinc-300">{decisionOutput.endorsementFactor}</p>
                  </div>

                  <div className="space-y-1 border-t dark:border-zinc-850 pt-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">SLA Delay Risk Level</span>
                    <p className="font-extrabold text-slate-700 dark:text-zinc-300">{decisionOutput.delayRisk}</p>
                  </div>

                  <div className="space-y-1 border-t dark:border-zinc-850 pt-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Estimated Citizen Disruption Density</span>
                    <p className="font-extrabold text-slate-700 dark:text-zinc-300">{decisionOutput.citizenImpact}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/50 dark:bg-purple-950/20 border border-indigo-100 dark:border-purple-900 rounded-xl">
                    <span className="text-[8.5px] font-black text-indigo-700 dark:text-purple-400 uppercase tracking-widest block">Decision Support Recommendation</span>
                    <span className="text-[10.5px] text-slate-700 dark:text-zinc-200 font-extrabold">{decisionOutput.recommendation}</span>
                  </div>
                </div>
              ) : (
                <div className="h-44 border border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs bg-slate-50/40 dark:bg-zinc-950/20 gap-1.5">
                  <ShieldAlert className="w-6 h-6 text-slate-300" />
                  <p className="font-bold">Awaiting incident audit selection. Click "Audit Incident" to run.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
