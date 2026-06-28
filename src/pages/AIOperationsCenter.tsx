import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, Cpu, Zap, Activity, ShieldAlert, Sparkles, AlertTriangle, Hammer, 
  TrendingUp, MapPin, Users, FileText, CheckCircle2, Clock, Smile, 
  Trash2, Droplet, Construction, RefreshCw, Plus, Download, X, 
  HelpCircle, Eye, Map, Compass, BarChart3, ChevronRight, Search, 
  Printer, FileDown, Layers, Landmark, Info, AlertCircle, Play, Shield
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  WARDS_DATA, PREDICTIVE_RISKS, DUPLICATE_COMPLAINTS, 
  SAMPLE_EMERGENCIES, TIMELINE_TEMPLATES, WardHealth, PredictiveRisk, DuplicateGroup 
} from './aiOpsData';

export const AIOperationsCenter: React.FC = () => {
  const { user, complaints, showToast, updateComplaintStatus, t, judgeMode, judgeStep } = useApp();
  
  // Active Agent Tab: ranges from 1 to 10
  const [activeAgentId, setActiveAgentId] = useState<number>(1);

  // Automatically switch active agent based on Judge Walkthrough step
  useEffect(() => {
    if (judgeMode) {
      if (judgeStep === 1) {
        setActiveAgentId(1); // Vision Intelligence
      } else if (judgeStep === 2) {
        setActiveAgentId(3); // Priority scoring Engine
      } else if (judgeStep === 3) {
        setActiveAgentId(2); // Duplicate Intelligence
      } else if (judgeStep === 4) {
        setActiveAgentId(10); // Ward GIS Health Heatmap
      }
    }
  }, [judgeMode, judgeStep]);
  const [uptime, setUptime] = useState<number>(34298); // Systems uptime stopwatch
  const [timelineEvents, setTimelineEvents] = useState<string[]>([
    "Vision Agent analysed complaint #POT-102",
    "Priority Agent increased severity of #FLOOD-404 to CRITICAL",
    "Prediction Agent calculated 88% monsoon flooding risk in Karol Bagh",
    "Resource Optimizer suggested shifting 2 gully emptiers to Ward 4",
    "Community Sentiment Agent scanned citizen logs: +4.2% satisfaction gain"
  ]);
  
  // Smart Automation states
  const [autoEscalate, setAutoEscalate] = useState<boolean>(true);
  const [instantCrisisAlerts, setInstantCrisisAlerts] = useState<boolean>(true);
  const [autoMerge, setAutoMerge] = useState<boolean>(true);
  const [predictiveAllocation, setPredictiveAllocation] = useState<boolean>(false);
  const [automationLogs, setAutomationLogs] = useState<string[]>([
    "[10:24:01] AUTO_TRIAGE: Automatically routed sewer complaint #WSS-302 to Sanitation.",
    "[10:24:12] AUTO_ESCALATION: Delayed issue #RNI-119 near Fortis Hospital boosted to HIGH.",
    "[10:24:35] AUTO_MERGE: Identified visual duplicates for Bandra Flyover pothole. Merging complete."
  ]);

  // Agent 1: Vision Intelligence Agent states
  const [scannedComplaintId, setScannedComplaintId] = useState<string>(complaints[0]?.id || 'complaint_delhi_1');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [visionReport, setVisionReport] = useState<any>({
    category: 'Sewerage Blockage & Fluid Leakage',
    severity: 'HIGH',
    hazard: 'Bacterial Outbreak, Traffic Lane Hydroplaning, Pedestrian Slip Risk',
    affectedArea: '450 sq. meters radius',
    environmentalImpact: 'High potential for shallow water table contamination & stagnant mosquito vectors',
    publicSafetyRisk: 'Severe (Adjacent to local primary school & market sector)',
    complexity: 'High (Requires subterranean hydro-vacuum pump & pipeline replacement)',
    confidence: 96.8
  });

  // Agent 2: Duplicate Intelligence Agent states
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>(DUPLICATE_COMPLAINTS);
  
  // Agent 3: Priority Intelligence Agent states
  const [severityFactor, setSeverityFactor] = useState<string>('HIGH');
  const [populationFactor, setPopulationFactor] = useState<string>('HIGH');
  const [trafficFactor, setTrafficFactor] = useState<string>('HIGH');
  const [schoolProximity, setSchoolProximity] = useState<boolean>(true);
  const [hospitalProximity, setHospitalProximity] = useState<boolean>(false);
  const [weatherFactor, setWeatherFactor] = useState<boolean>(true);
  const [priorityScore, setPriorityScore] = useState<number>(84);

  // Agent 4: Resolution Planner states
  const [activePlanComplaintId, setActivePlanComplaintId] = useState<string>(complaints[0]?.id || 'complaint_delhi_1');
  const [showWorkOrder, setShowWorkOrder] = useState<boolean>(false);

  // Agent 5: Resource Optimizer states
  const [optimizedCrews, setOptimizedCrews] = useState<boolean>(false);

  // Agent 6: City Prediction Agent states
  const [predictionAlerts, setPredictionAlerts] = useState<PredictiveRisk[]>(PREDICTIVE_RISKS);
  const [selectedPredictionWard, setSelectedPredictionWard] = useState<string>('Karol Bagh');

  // Agent 7: Community Sentiment Agent states
  const [sentimentScore, setSentimentScore] = useState<number>(76.4);
  const [citizenLogs, setCitizenLogs] = useState<any[]>([
    { user: "Rajesh K.", comment: "Happy that sewage issue got resolved in 4 hours. Great response!", sentiment: "positive" },
    { user: "Pooja S.", comment: "Waterlogging near Ward 4 market is terrible, hope municipal workers clean it.", sentiment: "negative" },
    { user: "Anand M.", comment: "Pothole repair team was working late last night on highway.", sentiment: "positive" },
    { user: "Neha R.", comment: "Why are the streetlights in Connaught Place outer circle off today?", sentiment: "neutral" }
  ]);

  // Agent 8: Executive Report Agent states
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [reportProgress, setReportProgress] = useState<number>(0);
  const [executiveSummaryText, setExecutiveSummaryText] = useState<string>(
    "System Overview: High overall municipal response index (88.4%). Sewage clogging remains primary hazard across Wards 1 and 4, exacerbated by yellow monsoon forecasts. Overall budget utilization remains optimized at 74% with localized crew transfers balancing out backlog overheads."
  );

  // Agent 9: Emergency Response Agent states
  const [emergencies, setEmergencies] = useState<any[]>(SAMPLE_EMERGENCIES);
  const [activeEmergencyAlarm, setActiveEmergencyAlarm] = useState<boolean>(true);

  // Agent 10: City Health Agent states
  const [wardsList, setWardsList] = useState<WardHealth[]>(WARDS_DATA);
  const [selectedWardName, setSelectedWardName] = useState<string>('Karol Bagh (Ward 4)');

  // Auto-running simulation ticking stopwatch & live timeline streams
  useEffect(() => {
    const uptimeTimer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    const timelineTimer = setInterval(() => {
      // Append random mock timeline activities
      const randomTemplate = TIMELINE_TEMPLATES[Math.floor(Math.random() * TIMELINE_TEMPLATES.length)];
      const randomIdStr = `POT-${Math.floor(100 + Math.random() * 899)}`;
      const randomIdDupStr = `POT-${Math.floor(900 + Math.random() * 99)}`;
      const randomScore = Math.floor(65 + Math.random() * 30);
      
      const parsedTimelineMessage = randomTemplate
        .replace(/{ID}/g, randomIdStr)
        .replace(/{ID_DUP}/g, randomIdDupStr)
        .replace(/{SCORE}/g, randomScore.toString());

      setTimelineEvents(prev => [parsedTimelineMessage, ...prev.slice(0, 9)]);

      // Occasionally trigger background smart automation logs
      if (Math.random() > 0.5) {
        const timestamp = new Date().toLocaleTimeString();
        const autoLogTemplates = [
          `[${timestamp}] AUTO_ESCALATION: Priority boosted for pothole on Main Market Rd due to school proximity.`,
          `[${timestamp}] CITIZEN_NOTIFY: Auto-dispatched resolution update to 12 neighboring citizens.`,
          `[${timestamp}] DUP_DETECT: Scanned and linked 2 identical water stagnation complaints in Saket.`,
          `[${timestamp}] AUTO_ROUTE: Automated triage dispatch completed for streetlighting in Ward 8.`
        ];
        setAutomationLogs(prev => [autoLogTemplates[Math.floor(Math.random() * autoLogTemplates.length)], ...prev.slice(0, 7)]);
      }
    }, 4500);

    return () => {
      clearInterval(uptimeTimer);
      clearInterval(timelineTimer);
    };
  }, []);

  // Recalculating priority score when priority agent factors are toggled
  useEffect(() => {
    let score = 20;
    if (severityFactor === 'CRITICAL') score += 25;
    else if (severityFactor === 'HIGH') score += 18;
    else if (severityFactor === 'MEDIUM') score += 10;
    else score += 4;

    if (populationFactor === 'HIGH') score += 15;
    else if (populationFactor === 'MEDIUM') score += 9;
    else score += 4;

    if (trafficFactor === 'HIGH') score += 15;
    else if (trafficFactor === 'MEDIUM') score += 8;
    else score += 3;

    if (schoolProximity) score += 10;
    if (hospitalProximity) score += 15;
    if (weatherFactor) score += 10;

    setPriorityScore(Math.min(100, score));
  }, [severityFactor, populationFactor, trafficFactor, schoolProximity, hospitalProximity, weatherFactor]);

  // Handle Scan Simulation for Vision Agent
  const triggerImageScan = (id: string) => {
    setIsScanning(true);
    setScanProgress(0);
    const mockIssue = complaints.find(c => c.id === id);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        // Build customized analysis based on selected complaint
        const isRoad = mockIssue?.department.toLowerCase().includes('road') || false;
        const isWater = mockIssue?.department.toLowerCase().includes('water') || mockIssue?.department.toLowerCase().includes('sewage') || false;
        
        setVisionReport({
          category: isRoad ? 'Road Asphalt Surface Degradation' : isWater ? 'Major Aquifer/Sewer Contamination' : 'Solid Waste Agglomeration',
          severity: mockIssue?.severity || 'HIGH',
          hazard: isRoad ? 'Vehicular swerving collision, high-speed tire punctures, motorcyclist slide risk' : isWater ? 'Sewer toxic gas pockets, water supply cross-contamination, disease vectors' : 'Stray cattle hazard, blocked walking lane, heavy organic rot odor',
          affectedArea: isRoad ? '180 meters road corridor' : isWater ? '350 sq. meters localized runoff' : '120 sq. meters alley path',
          environmentalImpact: isRoad ? 'Micro-plastic runoffs into street drainage' : isWater ? 'High toxic runoff contaminating residential soils' : 'Leachate seepage into sidewalk base',
          publicSafetyRisk: mockIssue?.priority === 'CRITICAL' ? 'Severe (School zone Corridor with heavy traffic density)' : 'Moderate/High (Busy Commercial corridor)',
          complexity: isRoad ? 'Medium (Requires bituminous grader, thermal steam roller, and 4 crew members)' : isWater ? 'High (Requires gully vacuum engine, underground boring, pipe seal ring replacement)' : 'Standard (Waste skip truck loaders & hydraulic grabber)',
          confidence: (94 + Math.random() * 5).toFixed(1)
        });
        showToast('✨ Vision intelligence scan finalized!', 'success');
      }
    }, 300);
  };

  // Handle Merge Duplicates
  const handleMergeDuplicates = (groupId: string) => {
    setDuplicateGroups(prev => prev.filter(g => g.id !== groupId));
    const timestamp = new Date().toLocaleTimeString();
    setAutomationLogs(prev => [`[${timestamp}] MAN_MERGE: Manually authorized merge for group ${groupId}. Dual reports condensed into unified ticket.`, ...prev]);
    
    // Add timeline event
    setTimelineEvents(prev => [`Duplicate Intelligence Agent merged duplicate complaints for group ${groupId}`, ...prev]);
    showToast('🚀 Duplicate complaints merged successfully!', 'success');
  };

  // Handle Executive PDF compiling simulation
  const handleDownloadExecutiveReport = () => {
    setReportLoading(true);
    setReportProgress(0);
    showToast('📝 Compiling high-density PDF executive report...', 'info');

    const interval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setReportLoading(false);
            showToast('💾 Executive Report (CivicPulse_Report.pdf) generated and downloaded!', 'success');
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Convert uptime seconds into visual string
  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetching matching complaints for dropdown lists
  const selectedIssueData = complaints.find(c => c.id === scannedComplaintId) || complaints[0];
  const activePlanIssue = complaints.find(c => c.id === activePlanComplaintId) || complaints[0];

  // Map of 10 AI Agents
  const AGENTS_LIST = [
    { id: 1, name: "Vision Intelligence", purpose: "Automated photo analysis & diagnostic reports", icon: <Eye className="w-5 h-5 text-indigo-400" />, pulse: "pulse-blue", status: "Active" },
    { id: 2, name: "Duplicate Intelligence", purpose: "Cross-GPS visual matching & auto-merge", icon: <Layers className="w-5 h-5 text-emerald-400" />, pulse: "pulse-green", status: "Scanning" },
    { id: 3, name: "Priority Intelligence", purpose: "Explainable multi-factor severity scoring", icon: <TrendingUp className="w-5 h-5 text-purple-400" />, pulse: "pulse-purple", status: "Active" },
    { id: 4, name: "Resolution Planner", purpose: "Step-by-step repair log & print work orders", icon: <Hammer className="w-5 h-5 text-amber-400" />, pulse: "pulse-amber", status: "Idle" },
    { id: 5, name: "Resource Optimizer", purpose: "SLA-based crew, budget & vehicle balancing", icon: <BarChart3 className="w-5 h-5 text-sky-400" />, pulse: "pulse-sky", status: "Active" },
    { id: 6, name: "City Prediction Agent", purpose: "Predictive municipal risk grids & weather models", icon: <Compass className="w-5 h-5 text-pink-400" />, pulse: "pulse-pink", status: "Modeling" },
    { id: 7, name: "Community Sentiment", purpose: "Forum NLP satisfaction & trending logs", icon: <Smile className="w-5 h-5 text-orange-400" />, pulse: "pulse-orange", status: "Active" },
    { id: 8, name: "Executive Report Agent", purpose: "Automated executive briefings & mock downloads", icon: <FileText className="w-5 h-5 text-teal-400" />, pulse: "pulse-teal", status: "Ready" },
    { id: 9, name: "Emergency Response", purpose: "Flashing critical hazard alarms & rapid dispatch", icon: <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />, pulse: "pulse-rose", status: "Monitoring" },
    { id: 10, name: "City Health Agent", purpose: "Live ward-by-ward GIS health zoning maps", icon: <Map className="w-5 h-5 text-blue-400" />, pulse: "pulse-indigo", status: "Active" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 font-sans relative overflow-hidden p-1 md:p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background Particle Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] -top-40 -left-40 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -bottom-40 -right-40" />
      </div>

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 mb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="px-2.5 py-1 text-[10px] uppercase font-black tracking-widest bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md shadow-md animate-pulse">
              Autonomous Hub
            </span>
            <span className="text-xs font-mono text-zinc-500">Node: CP-AI-01</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-zinc-400 bg-clip-text text-transparent">
            AI Operations Center
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Real-time decentralized agent telemetry coordinates multi-agent triaging, municipal loads, predictive risk maps, and community satisfaction parameters.
          </p>
        </div>

        {/* Telemetry Stats Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className="text-[9px] uppercase font-semibold text-zinc-500">System State</p>
              <p className="text-xs font-mono font-bold text-emerald-400">10 AGENTS SECURE</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 flex items-center gap-3">
            <Clock className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[9px] uppercase font-semibold text-zinc-500">Continuous Uptime</p>
              <p className="text-xs font-mono font-bold text-zinc-200">{formatUptime(uptime)}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setUptime(34298);
              showToast("🔄 Telemetry matrix synchronized with cloud server.", "success");
            }}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 transition-all rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
            title="Force Synchronize"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </button>
        </div>
      </div>

      {/* MULTI-AGENT TOPOLOGY MAP GRID */}
      <div className="relative z-10 mb-8">
        <h2 className="text-xs uppercase font-extrabold text-zinc-400 tracking-widest mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" /> Connected Autonomous Agent Matrix
        </h2>
        
        {/* Responsive Grid representing the Node Topology */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {AGENTS_LIST.map((agent) => {
            const isActive = activeAgentId === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgentId(agent.id)}
                className={`text-left p-4 rounded-2xl transition-all duration-300 relative border overflow-hidden ${
                  isActive 
                    ? 'bg-zinc-900/90 border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.25)] scale-[1.02]' 
                    : 'bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700/80'
                }`}
              >
                {/* Agent Card Inner Glow if Active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                )}
                
                {/* Node Line Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-900 text-zinc-400'}`}>
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      agent.id === 9 && activeEmergencyAlarm ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                    }`} />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{agent.status}</span>
                  </div>
                </div>

                {/* Agent Typography info */}
                <div>
                  <p className="text-xs font-mono text-zinc-500 font-semibold mb-0.5">Agent {agent.id.toString().padStart(2, '0')}</p>
                  <p className="text-sm font-bold text-white tracking-tight mb-1 truncate">{agent.name}</p>
                  <p className="text-[11px] text-zinc-400 leading-tight line-clamp-2 h-8">{agent.purpose}</p>
                </div>

                {/* Animated Line Pointer at bottom */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* COGNITIVE FLOW CANVAS AND WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10 mb-8">
        
        {/* LEFT & CENTER PANEL: ACTIVE AGENT WORKSPACE PANEL (2 cols width) */}
        <div className="xl:col-span-2 bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-zinc-800/80 p-6 flex flex-col relative min-h-[550px]">
          
          {/* Header for selected Agent */}
          <div className="flex justify-between items-start border-b border-zinc-800/60 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                {AGENTS_LIST[activeAgentId - 1].icon}
              </div>
              <div>
                <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active Workspace Command</p>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Agent {activeAgentId}: {AGENTS_LIST[activeAgentId - 1].name}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono font-semibold">
                    v3.4.1-Stable
                  </span>
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-zinc-500">Confidence Metric</span>
              <p className="text-lg font-mono font-extrabold text-indigo-400">
                {activeAgentId === 1 ? "96.8%" : activeAgentId === 2 ? "94.2%" : activeAgentId === 3 ? `${priorityScore}%` : activeAgentId === 7 ? "89.4%" : "98.5%"}
              </p>
            </div>
          </div>

          {/* DYNAMIC CONTENT SWITCH BASED ON SELECTED AGENT */}
          <div className="flex-1">
            
            {/* AGENT 1: VISION INTELLIGENCE WORKSPACE */}
            {activeAgentId === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-2">Select Active Ledger Complaint Photo</label>
                    <select
                      value={scannedComplaintId}
                      onChange={(e) => {
                        setScannedComplaintId(e.target.value);
                        triggerImageScan(e.target.value);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      {complaints.map(c => (
                        <option key={c.id} value={c.id}>{c.title.substring(0, 42)}...</option>
                      ))}
                    </select>
                  </div>

                  {/* Complaint Media Container with Simulated Scanner */}
                  <div className="relative h-48 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center">
                    <img 
                      src={selectedIssueData?.images[0] || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80"}
                      alt="Scanned Municipal Issue"
                      className="w-full h-full object-cover opacity-75"
                    />
                    
                    {/* Scanner line overlay animation */}
                    {isScanning && (
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-scannerLine"
                        style={{ top: `${scanProgress}%` }}
                      />
                    )}
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-xs flex items-center justify-center">
                        <div className="text-center">
                          <Cpu className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
                          <p className="text-xs font-mono font-bold tracking-widest text-indigo-200">ANALYZING VISUAL STRUCTURAL PIXELS...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => triggerImageScan(scannedComplaintId)}
                    disabled={isScanning}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 transition-all text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <RefreshCw className="w-4 h-4" /> Trigger Vision Pipeline Scan
                  </button>
                </div>

                {/* Diagnostics Display */}
                <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-4 space-y-3.5 text-xs font-medium">
                  <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-1.5 text-indigo-400">
                    <Sparkles className="w-4 h-4" /> AI Vision Diagnostic Report
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Detected Category</p>
                      <p className="text-zinc-200 font-bold">{visionReport.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Detection Severity</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black inline-block mt-0.5 ${
                        visionReport.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {visionReport.severity}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Potential Hazard Flags</p>
                      <p className="text-zinc-300 font-semibold">{visionReport.hazard}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Estimated Affected Area</p>
                      <p className="text-zinc-300">{visionReport.affectedArea}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Confidence Score</p>
                      <p className="text-emerald-400 font-mono font-extrabold">{visionReport.confidence}% Match</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Environmental Impact Projection</p>
                      <p className="text-zinc-400 leading-normal">{visionReport.environmentalImpact}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">AI Cognitive Reasoning Pathway</p>
                      <p className="text-zinc-500 font-sans italic leading-relaxed">
                        "Edge-detection vectors mapped 14 high-contrast crack fissures. Pixel heat concentrations point to localized water runoff expansion. Recycled convolutional layers predict a {visionReport.confidence}% category accuracy routing to infrastructure."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AGENT 2: DUPLICATE INTELLIGENCE WORKSPACE */}
            {activeAgentId === 2 && (
              <div className="space-y-6 animate-fadeIn text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    The Duplicate Intelligence Agent automatically compares newly submitted complaints against active databases to flag redundant tickets based on image semantics, descriptions, and GPS thresholds.
                  </p>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-900">
                    ACTIVE SCANNERS: ONLINE
                  </span>
                </div>

                {duplicateGroups.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto" />
                    <p className="font-bold text-zinc-300">No Potential Duplicates Detected</p>
                    <p className="text-xs">Duplicate engine is continuous, currently 0 redundant groups pending.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {duplicateGroups.map((group) => (
                      <div key={group.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex-1 space-y-2.5">
                          {/* Similarity indicator badge */}
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[10px] font-black">
                              {group.similarity}% SIMILARITY MATCH
                            </span>
                            <span className="text-zinc-500 font-mono text-xs">• Category: {group.category}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Primary report item */}
                            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                              <p className="text-[10px] uppercase font-mono text-indigo-400 font-black mb-1">Original Active Ticket</p>
                              <p className="font-bold text-xs text-zinc-100">{group.primaryIssue.title}</p>
                              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{group.primaryIssue.description}</p>
                              <p className="text-[9px] font-mono text-zinc-500 mt-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-zinc-500" /> GPS: {group.primaryIssue.gps}
                              </p>
                            </div>

                            {/* Duplicate suspect item */}
                            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                              <p className="text-[10px] uppercase font-mono text-rose-400 font-black mb-1">Potential Redundant Ticket</p>
                              <p className="font-bold text-xs text-zinc-100">{group.duplicateIssue.title}</p>
                              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{group.duplicateIssue.description}</p>
                              <p className="text-[9px] font-mono text-zinc-500 mt-2 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-zinc-500" /> GPS: {group.duplicateIssue.gps}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action parameters */}
                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto self-stretch justify-center border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-4 min-w-[150px]">
                          <button
                            onClick={() => handleMergeDuplicates(group.id)}
                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 transition-all text-white rounded-lg text-xs font-bold"
                          >
                            Merge Complaint
                          </button>
                          <button
                            onClick={() => {
                              showToast('Linked as support case. Priority score increased by +15.', 'info');
                              setDuplicateGroups(prev => prev.filter(g => g.id !== group.id));
                            }}
                            className="flex-1 py-2 bg-zinc-905 hover:bg-zinc-800 transition-all text-zinc-300 border border-zinc-800 rounded-lg text-xs font-semibold"
                          >
                            Support Existing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AGENT 3: PRIORITY INTELLIGENCE WORKSPACE */}
            {activeAgentId === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-sm">
                
                {/* Explainable UI Slider Panel */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white mb-2">Priority Parameter Weight Simulator</h4>
                  
                  {/* Dropdowns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Issue Severity</label>
                      <select 
                        value={severityFactor}
                        onChange={(e) => setSeverityFactor(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Population Density</label>
                      <select 
                        value={populationFactor}
                        onChange={(e) => setPopulationFactor(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="HIGH">High (Commercial center)</option>
                        <option value="MEDIUM">Medium (Suburban block)</option>
                        <option value="LOW">Low (Peripheral ward)</option>
                      </select>
                    </div>
                  </div>

                  {/* Factor Toggles */}
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-3">
                    <p className="text-xs font-mono text-zinc-400 uppercase">Context Proximity Flags</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Primary/Secondary School Zone (within 100m)</span>
                      <input 
                        type="checkbox" 
                        checked={schoolProximity}
                        onChange={(e) => setSchoolProximity(e.target.checked)}
                        className="accent-indigo-500 h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Hospital/Emergency Ward Proximity (within 200m)</span>
                      <input 
                        type="checkbox" 
                        checked={hospitalProximity}
                        onChange={(e) => setHospitalProximity(e.target.checked)}
                        className="accent-indigo-500 h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Heavy Monsoon Storm Alert (Weather modifier)</span>
                      <input 
                        type="checkbox" 
                        checked={weatherFactor}
                        onChange={(e) => setWeatherFactor(e.target.checked)}
                        className="accent-indigo-500 h-4 w-4"
                      />
                    </div>
                  </div>
                </div>

                {/* Score output Dial Representation */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">Explainable Priority Engine</p>
                  
                  {/* Gauge representation */}
                  <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="#1f2937" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="60" 
                        stroke="url(#purpleGlow)" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray="376.8" 
                        strokeDashoffset={376.8 - (376.8 * priorityScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                      <defs>
                        <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-mono font-extrabold text-white">{priorityScore}</span>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">PRIORITY</p>
                    </div>
                  </div>

                  {/* Verbal reasoning summary */}
                  <div className="space-y-1 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                    <p className="text-xs font-bold text-purple-300">AI Logic Explanation Summary:</p>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      "Complaint prioritized to {priorityScore >= 80 ? 'CRITICAL' : priorityScore >= 50 ? 'HIGH' : 'STANDARD'} status because factors identify severe pedestrian exposure close to {schoolProximity ? 'educational corridors' : ''} {hospitalProximity ? 'and healthcare points' : ''} during {weatherFactor ? 'high storm moisture forecasts' : 'nominal dry hours'}. Recommended dispatch SLA: {priorityScore >= 80 ? '2 Hours' : '6 Hours'}."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AGENT 4: RESOLUTION PLANNER WORKSPACE */}
            {activeAgentId === 4 && (
              <div className="space-y-6 animate-fadeIn text-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Select Active Ledger Complaint</label>
                    <select
                      value={activePlanComplaintId}
                      onChange={(e) => setActivePlanComplaintId(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-medium w-full md:w-64"
                    >
                      {complaints.map(c => (
                        <option key={c.id} value={c.id}>{c.title.substring(0, 42)}...</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowWorkOrder(true)}
                    className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 transition-all text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-600/10"
                  >
                    <Printer className="w-4 h-4" /> Generate Printable Work Order
                  </button>
                </div>

                {/* Simulated step-by-step repair strategy logs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Repair strategy milestones */}
                  <div className="col-span-2 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-3">
                    <h4 className="font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-1.5 text-amber-400">
                      <Construction className="w-4 h-4" /> Step-by-Step AI Repair Strategy
                    </h4>
                    <div className="space-y-3 font-medium text-xs">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-center flex items-center justify-center shrink-0">1</span>
                        <div>
                          <p className="font-bold text-zinc-200">Phase 1: Mobilization & Site Isolation</p>
                          <p className="text-zinc-400 mt-0.5">Erect reflective signage, coordinate traffic detour warnings, run subsurface gas detection checks.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-center flex items-center justify-center shrink-0">2</span>
                        <div>
                          <p className="font-bold text-zinc-200">Phase 2: Subsurface Clearing & Extraction</p>
                          <p className="text-zinc-400 mt-0.5">Deploy high-volume drainage sucker truck to extract stagnant black runoff. Excavate asphalt base layers.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-center flex items-center justify-center shrink-0">3</span>
                        <div>
                          <p className="font-bold text-zinc-200">Phase 3: Material Laying & Compression</p>
                          <p className="text-zinc-400 mt-0.5">Laying structural grade-A hot asphalt bituminous compound, applying sub-base sealants, compactor vibration verification.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-center flex items-center justify-center shrink-0">4</span>
                        <div>
                          <p className="font-bold text-zinc-200">Phase 4: SLA Verification & Public Release</p>
                          <p className="text-zinc-400 mt-0.5">Post-repair photo upload, municipal supervisor sign-off, push notify localized citizens.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Estimates card */}
                  <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-3 text-xs font-medium">
                    <h4 className="font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-1.5 text-amber-400">
                      <Users className="w-4 h-4" /> Logistics Summary
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Required Manpower</p>
                        <p className="text-zinc-300 mt-0.5">1 Site Engineer, 2 Pipelayers, 2 Laborers, 1 Safety Overseer</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Specialized Equipment</p>
                        <p className="text-zinc-300 mt-0.5">Vacuum hydro pump, hydraulic compactor, thermal grading cutter</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Estimated Budget Cost</p>
                        <p className="text-emerald-400 font-bold font-mono text-sm">₹18,400 INR</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Completion Estimate</p>
                        <p className="text-amber-300 font-bold">4.5 Hours work duration</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Printable work order modal view overlay */}
                {showWorkOrder && (
                  <div className="fixed inset-0 bg-zinc-950/90 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
                    <div className="bg-zinc-900 border-2 border-zinc-800 max-w-xl w-full p-6 rounded-3xl relative shadow-2xl">
                      <button 
                        onClick={() => setShowWorkOrder(false)}
                        className="absolute top-4 right-4 p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Work order printing frame block */}
                      <div className="font-mono text-[11px] text-zinc-300 space-y-4 p-4 border border-zinc-800 bg-zinc-950 rounded-2xl">
                        <div className="text-center border-b border-dashed border-zinc-800 pb-4">
                          <p className="text-xs font-bold text-white uppercase tracking-widest">MUNICIPAL DESK OF DELHI</p>
                          <p className="text-[10px] text-zinc-500">Autonomous AI Triage Dispatch System</p>
                          <p className="text-[10px] text-zinc-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-1">
                          <p><span className="text-zinc-500">WORK ORDER ID:</span> WO-CP-AI-{Math.floor(1000 + Math.random() * 8999)}</p>
                          <p><span className="text-zinc-500">SUBJECT:</span> {activePlanIssue?.title || 'Civic Infrastructure Repair'}</p>
                          <p><span className="text-zinc-500">LOCATIONS:</span> {activePlanIssue?.address || 'Connaught Place Block E'}</p>
                          <p><span className="text-zinc-500">ASSIGNED DEPT:</span> {activePlanIssue?.department || 'Roads Department'}</p>
                          <p><span className="text-zinc-500">PRIORITY TARGET:</span> {activePlanIssue?.priority || 'HIGH'}</p>
                        </div>

                        <div className="border-t border-b border-dashed border-zinc-800 py-3 space-y-1">
                          <p className="font-bold text-zinc-100 uppercase">REPAIR LOGISTICS DIRECTIVE:</p>
                          <p>• PHASE 1: Isolate site within 100m. Establish barriers.</p>
                          <p>• PHASE 2: Flush stagnant sewer runoff water via hydro grab.</p>
                          <p>• PHASE 3: Lay Bituminous paving material mix & verify.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <p className="font-bold text-zinc-400">ESTIMATED BUDGET</p>
                            <p className="text-emerald-400 font-bold">₹18,400 INR</p>
                          </div>
                          <div>
                            <p className="font-bold text-zinc-400">DURATION EST</p>
                            <p className="text-amber-400 font-bold">4.5 Hours SLA</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-6 border-t border-dashed border-zinc-800">
                          <div>
                            <p className="text-[8px] text-zinc-600 font-black mb-1">MUNICIPAL SEAL AUTH</p>
                            <div className="w-20 h-8 border border-zinc-800 flex items-center justify-center text-zinc-600 text-[9px] font-black tracking-widest">
                              CP-AI
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] text-zinc-600 font-black mb-1">OFFICER SIGNATURE</p>
                            <div className="w-24 h-1 border-b border-zinc-700" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => {
                            window.print();
                          }}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition-all text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                        >
                          <Printer className="w-4 h-4" /> Trigger System Print
                        </button>
                        <button
                          onClick={() => {
                            showToast("💾 PDF Work Order saved offline.", "success");
                            setShowWorkOrder(false);
                          }}
                          className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-all text-zinc-300 font-bold rounded-xl text-xs"
                        >
                          Cancel / Save Document
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AGENT 5: RESOURCE OPTIMIZER WORKSPACE */}
            {activeAgentId === 5 && (
              <div className="space-y-6 animate-fadeIn text-xs font-medium">
                <div className="flex justify-between items-center bg-zinc-900/60 p-4 border border-zinc-800 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">Current Operations Resource Allocation Summary</h4>
                    <p className="text-zinc-400 text-xs">AI analyses citywide pending logs and recommends real-time transfer of heavy machinery and staffing to optimize municipal SLAs.</p>
                  </div>
                  <button
                    onClick={() => {
                      setOptimizedCrews(!optimizedCrews);
                      showToast(optimizedCrews ? 'Reset resources' : '✨ Re-assigned 3 municipal crews!', 'success');
                    }}
                    className={`py-2 px-3 transition-all font-bold rounded-xl text-xs shrink-0 ${
                      optimizedCrews ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    {optimizedCrews ? "Crews Balanced ✓" : "Apply AI Optimization"}
                  </button>
                </div>

                {/* Optimization Recharts Graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-60">
                  <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-4 flex flex-col">
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">Ward Maintenance Load vs Staff Allocation</p>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { ward: 'Karol Bagh', current: 4, recommended: optimizedCrews ? 6 : 4 },
                            { ward: 'Chandni Chk', current: 2, recommended: optimizedCrews ? 4 : 2 },
                            { ward: 'Saket Dist', current: 3, recommended: 3 },
                            { ward: 'Connaught Pl', current: 5, recommended: optimizedCrews ? 3 : 5 },
                            { ward: 'Dwarka Sec-6', current: 3, recommended: 3 }
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="ward" stroke="#71717a" tick={{ fontSize: 9 }} />
                          <YAxis stroke="#71717a" tick={{ fontSize: 9 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                          <Legend wrapperStyle={{ fontSize: 9 }} />
                          <Bar dataKey="current" fill="#3f3f46" name="Current Staff" />
                          <Bar dataKey="recommended" fill="#6366f1" name="AI Optimal Staff" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-4 flex flex-col">
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">Municipal Budget Distribution Matrix (₹ Lakhs)</p>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { name: 'SWM', budget: 45, usage: 38 },
                            { name: 'WSS', budget: 32, usage: 30 },
                            { name: 'RNI', budget: 58, usage: 52 },
                            { name: 'ESL', budget: 18, usage: 12 },
                            { name: 'PHC', budget: 25, usage: 16 }
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 9 }} />
                          <YAxis stroke="#71717a" tick={{ fontSize: 9 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                          <Legend wrapperStyle={{ fontSize: 9 }} />
                          <Area type="monotone" dataKey="budget" stroke="#a78bfa" fill="#c084fc" fillOpacity={0.1} name="Total Budget" />
                          <Area type="monotone" dataKey="usage" stroke="#818cf8" fill="#6366f1" fillOpacity={0.1} name="AI Target Usage" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Dispatch recommendations */}
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-1">
                  <p className="font-bold text-zinc-200">AI Optimization Allocator Logs:</p>
                  <p className="text-zinc-400 leading-normal">
                    {optimizedCrews 
                      ? "✓ Successfully re-allocated 1 Pothole repair crew from Connaught Place to Karol Bagh (reduced Karol Bagh load to 62%) and 1 Sanitation crew from Connaught Place to Chandni Chowk." 
                      : "• Recommend shifting 1 Roads/Pave crew from Connaught Place (load at 28%) to Karol Bagh (load at 88%) and 1 Sanitation loader from Saket to Chandni Chowk."}
                  </p>
                </div>
              </div>
            )}

            {/* AGENT 6: CITY PREDICTION AGENT WORKSPACE */}
            {activeAgentId === 6 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-xs font-medium">
                
                {/* Simulated Grid Matrix Heatmap */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Predictive Grid Zone Heatmap</p>
                    <span className="text-[10px] bg-pink-950/60 text-pink-400 px-2 py-0.5 rounded font-mono font-bold">MONSOON ACCURACY: 94.2%</span>
                  </div>

                  {/* 6x6 grid layout representing neighborhoods */}
                  <div className="grid grid-cols-5 gap-2.5 flex-1 items-stretch min-h-[220px]">
                    {['Karol Bagh', 'Chandni Chk', 'Connaught Pl', 'Saket Dist', 'Dwarka Sec-6', 'Rohini Sector', 'Lajpat Nagar', 'Janakpuri', 'Okhla Phase-2', 'Mayur Vihar'].map((ward, i) => {
                      const isHigh = i === 0 || i === 1 || i === 6;
                      const isMed = i === 3 || i === 7;
                      return (
                        <button
                          key={ward}
                          onClick={() => setSelectedPredictionWard(ward)}
                          className={`rounded-xl border flex flex-col justify-between p-2 text-left transition-all hover:scale-[1.03] ${
                            selectedPredictionWard === ward 
                              ? 'ring-2 ring-pink-500' 
                              : ''
                          } ${
                            isHigh 
                              ? 'bg-rose-950/20 border-rose-900/40 hover:bg-rose-900/30 text-rose-300' 
                              : isMed 
                                ? 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-900/30 text-amber-300' 
                                : 'bg-emerald-950/20 border-emerald-900/40 hover:bg-emerald-900/30 text-emerald-300'
                          }`}
                        >
                          <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Zone {i + 1}</span>
                          <span className="font-extrabold text-[10px] mt-1 tracking-tight leading-tight line-clamp-1">{ward}</span>
                          <span className="text-[10px] font-mono font-extrabold mt-1">
                            {isHigh ? "CRIT" : isMed ? "MED" : "STABLE"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Prediction Details for the selected Ward */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5 text-pink-400">
                      <TrendingUp className="w-4 h-4" /> Predictive Risk: {selectedPredictionWard}
                    </h4>
                    
                    {/* Hardcoded prediction matrix with dynamic lookup */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Target Forecast Risk</p>
                        <p className="text-zinc-200 font-bold text-sm">
                          {selectedPredictionWard.includes('Karol') ? 'Storm Drainage Pipeline Rupture' : selectedPredictionWard.includes('Chandni') ? 'Power Grid Line Wind Tripping' : 'Sidewalk Concrete Erosion'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Risk Probability</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-pink-500 h-full rounded-full" 
                              style={{ width: selectedPredictionWard.includes('Karol') ? '88%' : selectedPredictionWard.includes('Chandni') ? '78%' : '44%' }} 
                            />
                          </div>
                          <span className="font-mono text-pink-400 font-black">
                            {selectedPredictionWard.includes('Karol') ? '88%' : selectedPredictionWard.includes('Chandni') ? '78%' : '44%'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Environmental Trigger Matrix</p>
                        <p className="text-zinc-400 leading-normal">
                          {selectedPredictionWard.includes('Karol') 
                            ? "Silt density threshold currently at 64% with localized yellow thunderstorm monsoon rains (24mm/hr) predicted within 48h." 
                            : "Loose overhead street cables combined with projected gusting storm wind velocities exceeding 45km/h."}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Recommended Preventive Action</p>
                        <p className="text-emerald-400 font-semibold">
                          {selectedPredictionWard.includes('Karol') 
                            ? "Pre-emptively route 2 gully emptier vacuum trucks to desilt primary drainage pipes." 
                            : "Send 1 maintenance hoist crane team to secure overhead telecom junction cords."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 italic mt-3 border-t border-zinc-800 pt-2">
                    *Predictions computed continuously by City Prediction neural models based on historic ward log correlations.
                  </p>
                </div>
              </div>
            )}

            {/* AGENT 7: COMMUNITY SENTIMENT WORKSPACE */}
            {activeAgentId === 7 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-xs font-medium">
                
                {/* Sentiment Analytics dials */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Natural Language Satisfaction index</p>
                    <span className="text-emerald-400 font-mono font-extrabold text-sm">{sentimentScore}% Pos</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-2xl">
                      <p className="text-emerald-400 font-bold text-lg font-mono">64%</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Positive</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl">
                      <p className="text-zinc-300 font-bold text-lg font-mono">21%</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Neutral</p>
                    </div>
                    <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-2xl">
                      <p className="text-rose-400 font-bold text-lg font-mono">15%</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Negative</p>
                    </div>
                  </div>

                  {/* Word-Cloud simulation keywords list */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Most Discussed Topic Vectors</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-zinc-950 rounded-lg text-white border border-zinc-800 font-bold">potholes (high vol)</span>
                      <span className="px-2.5 py-1 bg-zinc-950 rounded-lg text-emerald-400 border border-zinc-800 font-bold">resolved (+12%)</span>
                      <span className="px-2.5 py-1 bg-zinc-950 rounded-lg text-indigo-400 border border-zinc-800">sewage leak</span>
                      <span className="px-2.5 py-1 bg-zinc-950 rounded-lg text-amber-400 border border-zinc-800">monsoon delay</span>
                      <span className="px-2.5 py-1 bg-zinc-950 rounded-lg text-zinc-400 border border-zinc-800">streetlights</span>
                    </div>
                  </div>
                </div>

                {/* Simulated active citizen forum comment stream */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 flex flex-col justify-between">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-3">Live Forum Sentiment Analysis</p>
                  
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[180px] pr-1">
                    {citizenLogs.map((log, index) => (
                      <div key={index} className="p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-850 flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-white text-[11px]">{log.user}</span>
                          <p className="text-zinc-400 mt-0.5 italic leading-snug">"{log.comment}"</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                          log.sentiment === 'positive' ? 'bg-emerald-950 text-emerald-400' : log.sentiment === 'negative' ? 'bg-rose-950 text-rose-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {log.sentiment}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-zinc-500 text-center mt-3 border-t border-zinc-850 pt-2">
                    *Analyzing citizen portal discussions automatically via natural language transformers.
                  </p>
                </div>
              </div>
            )}

            {/* AGENT 8: EXECUTIVE REPORT WORKSPACE */}
            {activeAgentId === 8 && (
              <div className="space-y-6 animate-fadeIn text-sm">
                
                {/* Interval and Actions Selector */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                    {['daily', 'weekly', 'monthly', 'quarterly'].map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setReportPeriod(period as any);
                          setExecutiveSummaryText(
                            period === 'daily' 
                              ? "Daily Brief: 4 open backlogs in Chandni Chowk Lane B. Sewer waterlogging in Connaught Place successfully cleared by optimal dispatch within 4 hours. No new emergency risk flags active."
                              : period === 'weekly'
                                ? "Weekly Summary: Total reported tickets resolved at 78.4%. Budget allocations fully verified across five active departments. Localized weather models alert roads crews for proactive grading."
                                : "Monthly Report: Municipal response SLA improved by +14.2% citywide. Citizen engagement indices show stable positive ratings. Structural drainage sewer repairs executed across Ward 4 corridor."
                          );
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                          reportPeriod === period ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleDownloadExecutiveReport}
                    disabled={reportLoading}
                    className="py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 transition-all text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
                  >
                    <FileDown className="w-4 h-4" /> Download Printable Executive Brief
                  </button>
                </div>

                {/* Progress bar loader for PDF */}
                {reportLoading && (
                  <div className="bg-zinc-900/80 p-4 border border-zinc-800 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-teal-400 animate-pulse">Compiling PDF documents, formatting analytics data charts...</span>
                      <span className="font-bold text-white">{reportProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${reportProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Structured text brief card */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <h4 className="font-bold text-white flex items-center gap-1.5 text-teal-400">
                      <FileText className="w-4 h-4" /> Municipal Operations Report summary
                    </h4>
                    <span className="text-xs font-mono text-zinc-500">PERIOD: {reportPeriod.toUpperCase()}</span>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed font-medium">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">I. EXECUTIVE COMPLIANCE OVERVIEW</p>
                      <p className="text-zinc-300 mt-1">{executiveSummaryText}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">II. DEPARTMENT COMPLIANCE RANKINGS</p>
                        <ul className="space-y-1.5 mt-1.5 text-zinc-400">
                          <li className="flex justify-between"><span className="text-zinc-200">1. Electricity & Streetlights</span> <span className="text-emerald-400 font-bold font-mono">94% SLA</span></li>
                          <li className="flex justify-between"><span className="text-zinc-200">2. Water Supply & Sewage</span> <span className="text-emerald-400 font-bold font-mono">88% SLA</span></li>
                          <li className="flex justify-between"><span className="text-zinc-200">3. Roads & Infrastructure</span> <span className="text-amber-400 font-bold font-mono">72% SLA</span></li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">III. TOP IDENTIFIED AI RISKS</p>
                        <ul className="space-y-1.5 mt-1.5 text-zinc-400">
                          <li className="flex items-center gap-1.5 text-rose-300"><AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Karol Bagh Block E flood susceptibility</li>
                          <li className="flex items-center gap-1.5 text-zinc-300"><Info className="w-3.5 h-3.5 text-zinc-400" /> Chandni Chowk Lane B waste bottleneck</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AGENT 9: EMERGENCY RESPONSE WORKSPACE */}
            {activeAgentId === 9 && (
              <div className="space-y-6 animate-fadeIn text-sm">
                
                {/* Flashing alert sirens */}
                <div className="flex justify-between items-center bg-rose-950/20 border border-rose-900/60 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full animate-pulse border border-rose-500/20">
                      <ShieldAlert className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-rose-300 uppercase tracking-widest flex items-center gap-2">
                        CRITICAL SAFETY ALARM STREAM ACTIVE
                      </h4>
                      <p className="text-rose-400 text-xs">Sensors detecting major infrastructure faults. Immediate dispatch required.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveEmergencyAlarm(!activeEmergencyAlarm);
                      showToast(activeEmergencyAlarm ? 'Siren muted' : 'Siren active', 'info');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all ${
                      activeEmergencyAlarm ? 'bg-rose-600 border-rose-500 text-white animate-pulse' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {activeEmergencyAlarm ? "Alarm Active" : "Alarm Silenced"}
                  </button>
                </div>

                {/* Emergency stream reports */}
                <div className="space-y-4">
                  {emergencies.map((emerg) => (
                    <div 
                      key={emerg.id} 
                      className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        activeEmergencyAlarm 
                          ? 'bg-rose-950/10 border-rose-900/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]' 
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {/* Flashing glow border for critical alert */}
                      {activeEmergencyAlarm && (
                        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-rose-500 to-pink-500 animate-pulse" />
                      )}

                      <div className="flex-1 space-y-1.5 pl-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-[10px] font-black uppercase">
                            {emerg.type}
                          </span>
                          <span className="text-zinc-400 text-xs">• Location: {emerg.location}</span>
                          <span className="text-zinc-500 font-mono text-[10px] font-bold ml-auto md:ml-0">{emerg.timestamp}</span>
                        </div>
                        <p className="text-zinc-100 font-bold font-sans text-sm">{emerg.description}</p>
                        <p className="text-zinc-400 text-xs leading-normal"><span className="text-rose-400 font-bold">Dispatch Advice:</span> {emerg.actionRecommended}</p>
                      </div>

                      {/* Dispatch operations */}
                      <div className="w-full md:w-auto self-stretch flex items-center md:border-l border-zinc-800 md:pl-4">
                        <button
                          onClick={() => {
                            showToast(`🚒 Dispatched Crisis Team to ${emerg.location}!`, 'success');
                            setEmergencies(prev => prev.filter(e => e.id !== emerg.id));
                            
                            // Log timeline event
                            setTimelineEvents(prev => [`Crisis responders dispatched to gas breach on ${emerg.location}`, ...prev]);
                          }}
                          className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-rose-600/15"
                        >
                          Dispatch Crisis Unit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AGENT 10: CITY HEALTH AGENT WORKSPACE */}
            {activeAgentId === 10 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-xs font-medium">
                
                {/* SVG simulated GIS Map */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Simulated GIS Ward Health Map</p>
                    <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">LIVE GIS ENGINE</span>
                  </div>

                  {/* Interactive Styled Shapes Map using polygons */}
                  <div className="relative flex-1 bg-zinc-950/80 rounded-2xl border border-zinc-800 overflow-hidden min-h-[220px]">
                    <svg className="w-full h-full" viewBox="0 0 400 240">
                      {/* Indiranagar Shape */}
                      <path 
                        d="M 20 20 L 140 10 L 160 120 L 30 110 Z" 
                        fill="#15803d" fillOpacity="0.15" stroke="#22c55e" strokeWidth="2" strokeDasharray="3 3"
                        className="cursor-pointer hover:fill-emerald-500/20 transition-all"
                        onClick={() => {
                          setSelectedWardName('Connaught Place (Ward 2)');
                        }}
                      />
                      <text x="60" y="70" fill="#22c55e" fontSize="10" fontWeight="bold">CP Ward 2</text>
                      
                      {/* Karol Bagh Shape */}
                      <path 
                        d="M 140 10 L 280 15 L 250 140 L 160 120 Z" 
                        fill="#b45309" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2"
                        className="cursor-pointer hover:fill-amber-500/20 transition-all"
                        onClick={() => {
                          setSelectedWardName('Karol Bagh (Ward 4)');
                        }}
                      />
                      <text x="180" y="70" fill="#f59e0b" fontSize="10" fontWeight="bold">Karol Bagh Ward 4</text>
                      
                      {/* Chandni Chowk Shape */}
                      <path 
                        d="M 280 15 L 380 40 L 350 160 L 250 140 Z" 
                        fill="#b91c1c" fillOpacity="0.15" stroke="#ef4444" strokeWidth="2"
                        className="cursor-pointer hover:fill-rose-500/20 transition-all"
                        onClick={() => {
                          setSelectedWardName('Chandni Chowk (Ward 1)');
                        }}
                      />
                      <text x="290" y="90" fill="#ef4444" fontSize="10" fontWeight="bold">Chandni Chowk</text>
                      
                      {/* Saket Shape */}
                      <path 
                        d="M 30 110 L 160 120 L 180 220 L 50 200 Z" 
                        fill="#b45309" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2"
                        className="cursor-pointer hover:fill-amber-500/20 transition-all"
                        onClick={() => {
                          setSelectedWardName('Saket District (Ward 8)');
                        }}
                      />
                      <text x="80" y="160" fill="#f59e0b" fontSize="10" fontWeight="bold">Saket Ward 8</text>
                    </svg>

                    {/* Color Index tags */}
                    <div className="absolute bottom-2 right-2 flex gap-2 p-1.5 bg-zinc-900/90 rounded border border-zinc-800 text-[8px] font-mono">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Green (Good)</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Yellow/Orange</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Red (Crit)</span>
                    </div>
                  </div>
                </div>

                {/* Selected Ward statistics table lookup */}
                <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-5 space-y-4 flex flex-col justify-between">
                  {(() => {
                    const activeWardObj = wardsList.find(w => w.name.includes(selectedWardName.split(' ')[0])) || wardsList[0];
                    return (
                      <>
                        <div className="space-y-3.5">
                          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <h4 className="font-bold text-sm text-white flex items-center gap-1 text-indigo-400">
                              <MapPin className="w-4 h-4" /> Locality: {activeWardObj.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              activeWardObj.zone === 'green' ? 'bg-emerald-950 text-emerald-400' : activeWardObj.zone === 'orange' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                            }`}>
                              Health Index: {activeWardObj.healthScore}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-mono text-[10px] text-zinc-400">
                            <p>Infrastructure: <span className="text-zinc-200 font-extrabold">{activeWardObj.infraScore}%</span></p>
                            <p>SLA Resolution: <span className="text-zinc-200 font-extrabold">{activeWardObj.resolutionScore}%</span></p>
                            <p>Citizen Engagement: <span className="text-zinc-200 font-extrabold">{activeWardObj.engagementScore}%</span></p>
                            <p>AI Predictive Risk: <span className="text-rose-400 font-extrabold">{activeWardObj.riskScore}%</span></p>
                          </div>

                          <div className="space-y-1 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                            <p className="font-bold text-zinc-300">Target AI Local Improvement Recommendations:</p>
                            <ul className="list-disc pl-4 space-y-1 mt-1 text-zinc-400 text-[11px] leading-relaxed">
                              {activeWardObj.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: AI ACTIVITY STREAM & SMART AUTOMATION LOGS (1 col width) */}
        <div className="space-y-6">
          
          {/* AI ACTIVITY TIMELINE BOARD */}
          <div className="bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-zinc-800/80 p-5 flex flex-col h-[320px]">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400 animate-pulse" /> Live Telemetry Feed
              </h3>
              <span className="text-[9px] font-mono bg-purple-950 text-purple-400 px-2 py-0.5 rounded font-black uppercase">
                Continuous Stream
              </span>
            </div>

            {/* Event rows wrapper with animation scroll */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px]">
              {timelineEvents.map((event, i) => (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all duration-300 ${
                    i === 0 
                      ? 'bg-indigo-950/15 border-indigo-500/30 text-indigo-200 animate-slideDown' 
                      : 'bg-zinc-900/30 border-zinc-900 text-zinc-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">{event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SMART AUTOMATION CONTROLS PANEL */}
          <div className="bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-zinc-800/80 p-5 flex flex-col">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
              <Zap className="w-4 h-4 text-amber-400" /> Smart Automation Rules
            </h3>

            {/* Automation toggles */}
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-zinc-200">Auto-Escalate Delayed Issues</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Boost priority after 24h delay near services</p>
                </div>
                <button
                  onClick={() => {
                    setAutoEscalate(!autoEscalate);
                    showToast(autoEscalate ? 'Auto-escalation disabled' : 'Auto-escalation active', 'info');
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all ${
                    autoEscalate ? 'bg-indigo-600 flex justify-end' : 'bg-zinc-800 flex justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-zinc-200">Instant Crisis Notification</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Notify responders immediately upon detection</p>
                </div>
                <button
                  onClick={() => {
                    setInstantCrisisAlerts(!instantCrisisAlerts);
                    showToast(instantCrisisAlerts ? 'Crisis alerts disabled' : 'Crisis alerts active', 'info');
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all ${
                    instantCrisisAlerts ? 'bg-indigo-600 flex justify-end' : 'bg-zinc-800 flex justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-zinc-200">Auto-Merge Duplicate Tickets</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Merge visual duplicates matching &gt;90%</p>
                </div>
                <button
                  onClick={() => {
                    setAutoMerge(!autoMerge);
                    showToast(autoMerge ? 'Auto-merge disabled' : 'Auto-merge active', 'info');
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all ${
                    autoMerge ? 'bg-indigo-600 flex justify-end' : 'bg-zinc-800 flex justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-zinc-200">Predictive Resource Allocation</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Pre-allocate heavy crews using weather grids</p>
                </div>
                <button
                  onClick={() => {
                    setPredictiveAllocation(!predictiveAllocation);
                    showToast(predictiveAllocation ? 'Predictive allocation disabled' : 'Predictive allocation active', 'info');
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all ${
                    predictiveAllocation ? 'bg-indigo-600 flex justify-end' : 'bg-zinc-800 flex justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>
            </div>

            {/* Micro execution logging ticker */}
            <div className="mt-4 pt-3 border-t border-zinc-850 font-mono text-[9px] text-zinc-500 space-y-1 h-16 overflow-y-auto">
              {automationLogs.map((log, i) => (
                <p key={i} className="truncate">{log}</p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* AI HIGH-LEVEL STATS & INSIGHTS DASHBOARD SECTION */}
      <div className="bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-zinc-800/80 p-6 relative z-10">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
          <Sparkles className="w-5 h-5 text-indigo-400" /> AI Insights Dashboard Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500">Processed Photo diagnostics</span>
            <p className="text-2xl font-mono font-black text-indigo-400">1,249 Photos</p>
            <p className="text-[9px] text-zinc-400">98.4% Average Category Confidence</p>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500">Predictive Modeling Accuracy</span>
            <p className="text-2xl font-mono font-black text-teal-400">94.2% Acc</p>
            <p className="text-[9px] text-zinc-400">Validated by historic Ward occurrences</p>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500">Total Hours Saved</span>
            <p className="text-2xl font-mono font-black text-emerald-400">340 Hours</p>
            <p className="text-[9px] text-zinc-400">Through optimal automatic routing</p>
          </div>
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500">Auto-Resolved Duplicates</span>
            <p className="text-2xl font-mono font-black text-amber-400">142 Merges</p>
            <p className="text-[9px] text-zinc-400">Mitigated dual-crew dispatch overheads</p>
          </div>
        </div>
      </div>
    </div>
  );
};
