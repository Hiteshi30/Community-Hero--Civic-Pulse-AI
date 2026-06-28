import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, PlusCircle, Map, Users, Bot, Gift, User, 
  BarChart3, Building2, Settings, FileSpreadsheet, LogOut, 
  Menu, X, Bell, Sun, Moon, Languages, ShieldAlert, Activity,
  Search, Sparkles, Maximize2, Minimize2, Info, HelpCircle,
  Award, Play, CheckCircle, WifiOff, Laptop, HelpCircle as HelpIcon, Check,
  AlertTriangle, Clock, MapPin, Layers
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    user, 
    signOutUser, 
    theme, 
    setTheme,
    toggleTheme, 
    language, 
    setLanguage, 
    notifications, 
    complaints,
    departments,
    t,
    showToast,
    // Simulation and Presentation properties
    demoMode,
    setDemoMode,
    globalActivity,
    addGlobalActivity,
    searchQuery,
    setSearchQuery,
    searchActive,
    setSearchActive,
    judgeMode,
    setJudgeMode,
    judgeStep,
    setJudgeStep,
    presentationMode,
    setPresentationMode,
    accessibilityConfig,
    setAccessibilityConfig
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  
  // Layout and Drawer States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'status' | 'ai' | 'emergency'>('all');



  const isCitizen = user?.role === 'citizen' && !location.pathname.startsWith('/admin');
  const unreadNotifications = notifications.filter(n => !n.read);

  // Dynamic Navigation Items
  const citizenNavItems = [
    { label: t('my_dashboard'), path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: t('reporting_issue'), path: '/report', icon: <PlusCircle className="w-5 h-5" /> },
    { label: t('all_issues'), path: '/issues', icon: <Map className="w-5 h-5" /> },
    { label: t('community'), path: '/forum', icon: <Users className="w-5 h-5" /> },
    { label: t('chat_assistant'), path: '/chat', icon: <Bot className="w-5 h-5" /> },
    { label: t('redeem_rewards'), path: '/rewards', icon: <Gift className="w-5 h-5" /> },
    { label: t('profile_settings'), path: '/profile', icon: <User className="w-5 h-5" /> },
    { label: "About Platform", path: '/about', icon: <Info className="w-5 h-5 text-indigo-400" /> },
    { label: "Help & FAQ", path: '/help', icon: <HelpIcon className="w-5 h-5 text-indigo-400" /> },
  ];

  const officerNavItems = [
    { label: t('admin_dashboard'), path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: t('active_complaints'), path: '/admin/issues', icon: <ShieldAlert className="w-5 h-5" /> },
    { label: t('city_analytics'), path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: t('departments'), path: '/admin/departments', icon: <Building2 className="w-5 h-5" /> },
    { label: t('ai_dispatchers'), path: '/admin/agents', icon: <Bot className="w-5 h-5" /> },
    { label: t('ai_ops_center'), path: '/admin/ai-ops', icon: <Activity className="w-5 h-5 text-purple-500 animate-pulse" /> },
    { label: t('pending_ai_triage'), path: '/admin/reports', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { label: t('settings'), path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    { label: "About Platform", path: '/about', icon: <Info className="w-5 h-5 text-indigo-400" /> },
    { label: "Help & FAQ", path: '/help', icon: <HelpIcon className="w-5 h-5 text-indigo-400" /> },
  ];

  const currentNavItems = isCitizen ? citizenNavItems : officerNavItems;

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/');
  };

  // Notification categorization logic
  const getCategorizedNotifications = () => {
    if (notificationFilter === 'all') return notifications;
    if (notificationFilter === 'status') return notifications.filter(n => n.type === 'status_update' || n.type === 'assignment');
    if (notificationFilter === 'ai') return notifications.filter(n => n.title.toLowerCase().includes('ai') || n.title.toLowerCase().includes('vision') || n.title.toLowerCase().includes('predictive'));
    if (notificationFilter === 'emergency') return notifications.filter(n => n.title.toLowerCase().includes('emergency') || n.title.toLowerCase().includes('critical') || n.description.toLowerCase().includes('critical'));
    return notifications;
  };

  const filteredNotifs = getCategorizedNotifications();

  // Search Results evaluation logic
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { complaints: [], departments: [], agents: [] };
    
    const query = searchQuery.toLowerCase();
    
    const matchedComplaints = complaints.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.description.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query) ||
      c.department.toLowerCase().includes(query)
    );

    const matchedDepts = departments.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.headName.toLowerCase().includes(query) ||
      d.code.toLowerCase().includes(query)
    );

    const agentsList = [
      { id: 1, name: "Vision Intelligence", purpose: "Automated photo analysis" },
      { id: 2, name: "Duplicate Intelligence", purpose: "Cross-GPS visual matching" },
      { id: 3, name: "Priority Intelligence", purpose: "Explainable severity scoring" },
      { id: 4, name: "Resolution Planner", purpose: "Step-by-step repair logs" },
      { id: 5, name: "Resource Optimizer", purpose: "Crew & budget balancing" },
      { id: 6, name: "City Prediction Agent", purpose: "Predictive municipal risk grids" },
      { id: 7, name: "Community Sentiment", purpose: "Forum NLP satisfaction logs" },
      { id: 8, name: "Executive Report Agent", purpose: "Automated executive briefings" },
      { id: 9, name: "Emergency Response", purpose: "Critical hazard sirens & rapid dispatch" },
      { id: 10, name: "City Health Agent", purpose: "Live ward GIS health zoning" }
    ];

    const matchedAgents = agentsList.filter(a => 
      a.name.toLowerCase().includes(query) || 
      a.purpose.toLowerCase().includes(query)
    );

    return { complaints: matchedComplaints.slice(0, 5), departments: matchedDepts.slice(0, 3), agents: matchedAgents.slice(0, 3) };
  };

  const searchResults = getSearchResults();

  // Handle Judge Mode step progression
  const judgeWalkthroughSteps = [
    {
      title: "Welcome to CivicPulse Judge Mode",
      desc: "This guided walkthrough highlights the absolute strongest features of our decentralized AI community operations framework. We solve real-world community issues with 10 concurrent agents.",
      actionText: "Next: Analyze Vision Agent",
      onAction: () => {
        navigate('/admin/ai-ops');
        addGlobalActivity("Judge Mode Walkthrough: Navigated to Operations Center Node 1", "ai");
      }
    },
    {
      title: "01. AI Vision Intelligence Node",
      desc: "Our Computer Vision Agent scans citizen photo uploads to classify damages, estimate surface area coordinates, and automatically flags health and physical safety hazards near educational nodes.",
      actionText: "Next: Test Priority Triage",
      onAction: () => {
        navigate('/admin/ai-ops');
        addGlobalActivity("Judge Mode Walkthrough: Focused Priority scoring parameters", "ai");
      }
    },
    {
      title: "02. Priority scoring Engine",
      desc: "Instead of standard sorting, we deploy explainable risk weight metrics merging school proximities, traffic densities, hospitals, weather warnings, and citizen verify thresholds.",
      actionText: "Next: View Duplicate groupings",
      onAction: () => {
        navigate('/admin/ai-ops');
      }
    },
    {
      title: "03. Duplicate Intelligence matching",
      desc: "To save fleets from overlapping runs, we cross-analyze photo telemetry and visual hashes. Duplicate reports are automatically flagged for consolidated resolution schedules.",
      actionText: "Next: Explore City GIS Health",
      onAction: () => {
        navigate('/admin/ai-ops');
      }
    },
    {
      title: "04. Ward GIS Health Heatmap",
      desc: "A localized GIS scoreboard measuring municipal response SLAs, active emergency alerts, and NLP community sentiment feeds to represent live neighborhood wellness.",
      actionText: "Next: Check Recharts Analytics",
      onAction: () => {
        navigate('/admin/analytics');
      }
    },
    {
      title: "05. Multi-trend Recharts charts",
      desc: "Deep visual metrics mapping daily department outputs, resolved SLA margins, and city performance records. This concludes our walkthrough!",
      actionText: "Finish Walkthrough",
      onAction: () => {
        setJudgeMode(false);
        setJudgeStep(0);
        addGlobalActivity("Judge Walkthrough successfully finalized.", "success");
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-zinc-100 font-sans relative">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      {!presentationMode && (
        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 dark:border-zinc-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 dark:shadow-none glow-primary">
              C
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('app_name')}
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('tagline')}</p>
            </div>
          </div>

          {/* User Summary Card inside Sidebar */}
          {user && (
            <div className="m-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 flex items-center gap-3">
              <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                className="w-11 h-11 rounded-full border-2 border-indigo-500/30 object-cover bg-slate-200" 
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                {isCitizen ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold whitespace-nowrap">
                      {user.points || 0} pts
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium truncate">{user.badge}</span>
                  </div>
                ) : (
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.department?.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{user.officerId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {currentNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm shadow-indigo-100/50 dark:shadow-none' 
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>



          {/* Bottom Utility Items */}
          <div className="p-4 border-t border-slate-100 dark:border-zinc-900 space-y-4">
            {/* Quick Actions (Theme/Language) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-zinc-500">Theme</span>
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 capitalize">{theme}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200/50 dark:border-zinc-850">
                <button
                  type="button"
                  title="Light Theme"
                  onClick={() => {
                    setTheme('light');
                    showToast('Switched to Light theme', 'success');
                  }}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-xs border border-slate-200/30'
                      : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Dark Theme"
                  onClick={() => {
                    setTheme('dark');
                    showToast('Switched to Dark theme', 'success');
                  }}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-zinc-800 text-indigo-500 dark:text-indigo-400 shadow-xs border border-slate-200/30'
                      : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="System Theme"
                  onClick={() => {
                    setTheme('system');
                    showToast('Theme synced with your system preferences', 'success');
                  }}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    theme === 'system'
                      ? 'bg-white dark:bg-zinc-800 text-teal-500 shadow-xs border border-slate-200/30'
                      : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-zinc-500">Language</span>
              <button
                id="lang-switch-desktop"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all text-xs font-semibold text-slate-600 dark:text-zinc-300 cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-indigo-500" />
                <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
            </div>

            <button
              id="signout-desktop-btn"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('sign_out')}</span>
            </button>
          </div>
        </aside>
      )}

      {/* ================= MOBILE HEADER & DRAWER ================= */}
      {!presentationMode && (
        <header className="md:hidden glass-nav border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <button 
              id="mobile-drawer-toggle"
              onClick={() => setMobileMenuOpen(true)} 
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-100 dark:shadow-none">C</div>
              <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-zinc-100">{t('app_name')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSearchActive(true)}
              className="p-2 text-slate-500 hover:text-indigo-500"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              id="theme-toggle-mobile"
              onClick={toggleTheme} 
              className="p-2 text-slate-500 dark:text-zinc-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="relative">
              <button 
                id="notif-bell-mobile"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-500 dark:text-zinc-300 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Slide-out Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-80 bg-white dark:bg-zinc-950 p-5 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100 dark:shadow-none">C</div>
                <span className="font-black text-sm">{t('app_name')}</span>
              </div>
              <button 
                id="close-drawer-btn"
                onClick={() => setMobileMenuOpen(false)} 
                className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-900 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {user && (
              <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 flex items-center gap-2.5">
                <img src={user.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover bg-slate-200" />
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-bold truncate">{user.name}</p>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {isCitizen ? `${user.points || 0} pts` : `${user.department?.split(' ')[0]}`}
                  </span>
                </div>
              </div>
            )}

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {currentNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 space-y-4">
              {/* Mobile Drawer Theme Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-zinc-500">Theme</span>
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 capitalize">{theme}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200/50 dark:border-zinc-850">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      showToast('Switched to Light theme', 'success');
                    }}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                      theme === 'light'
                        ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-xs border border-slate-200/30'
                        : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold ml-1">Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      showToast('Switched to Dark theme', 'success');
                    }}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-zinc-800 text-indigo-500 dark:text-indigo-400 shadow-xs border border-slate-200/30'
                        : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold ml-1">Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('system');
                      showToast('Theme synced with your system preferences', 'success');
                    }}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                      theme === 'system'
                        ? 'bg-white dark:bg-zinc-800 text-teal-500 shadow-xs border border-slate-200/30'
                        : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold ml-1">Sys</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'hi' : 'en');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Languages className="w-4 h-4 text-indigo-500" />
                <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 bg-rose-50 dark:bg-rose-950/10 rounded-xl text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('sign_out')}</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ================= MAIN DISPLAY FRAME ================= */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* PRESENTATION HUD (If Presentation Mode is Active) */}
        {presentationMode ? (
          <div className="bg-gradient-to-r from-zinc-950 via-indigo-950 to-zinc-950 border-b border-indigo-500/30 px-6 py-3 flex justify-between items-center text-xs relative z-50">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-indigo-200 uppercase font-bold tracking-widest text-[11px] flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-indigo-400" /> PRESENTATION RUNTIME ACTIVATED • DEMO TELEMETRY LIVE
              </span>
            </div>
            <button
              onClick={() => {
                setPresentationMode(false);
                addGlobalActivity("Presentation mode exited.", "info");
              }}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-lg transition-all text-[11px]"
            >
              Exit Presentation Mode
            </button>
          </div>
        ) : (
          /* Regular Top Header for Desktop layout */
          <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-slate-200/60 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm sticky top-0 z-30">
            {/* Left Search Bar Trigger */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <button
                onClick={() => setSearchActive(true)}
                className="w-full flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-left text-xs text-slate-400 font-semibold hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Search complaints, departments, officers, locations...</span>
              </button>
            </div>

            {/* Quick action switches (Demo, Presentation, Judge) */}
            <div className="flex items-center gap-3">
              
              {/* DEMO MODE TICKER */}
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  demoMode 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-850'
                }`}
                title="Populate dynamic live city operations in background"
              >
                <Play className={`w-3.5 h-3.5 ${demoMode ? 'animate-spin-slow' : ''}`} />
                <span>{demoMode ? "DEMO: ON" : "DEMO MODE"}</span>
              </button>

              {/* PRESENTATION MODE TRIGGER */}
              <button
                onClick={() => {
                  setPresentationMode(true);
                  setDemoMode(true);
                  showToast("Presentation Mode Live: Menus compacted for focus.", "success");
                }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all"
                title="Hide layout panels for projection/dashboard mode"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>PRESENT</span>
              </button>

              {/* JUDGE WALKTHROUGH TRIGGER */}
              <button
                onClick={() => {
                  setJudgeMode(true);
                  setJudgeStep(0);
                  showToast("Judge Walkthrough Mode initialized!", "success");
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  judgeMode 
                    ? 'bg-purple-950 text-purple-400 border-purple-500/30 animate-pulse' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
                }`}
                title="Guided walkthrough of critical AI structures"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>JUDGE WALKTHROUGH</span>
              </button>

              <div className="w-px h-6 bg-slate-200 dark:bg-zinc-850 mx-1" />

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <button 
                  id="notif-bell-desktop"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-all relative border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-950" />
                  )}
                </button>

                {/* Categorized notifications dropdown */}
                {notifDropdownOpen && (
                  <div 
                    id="notifications-dropdown"
                    className="absolute right-0 mt-3 w-96 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-left"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-950">
                      <span className="font-extrabold text-xs text-slate-850 dark:text-zinc-100">OPERATIONAL FEEDBACK</span>
                      <button 
                        onClick={() => {
                          showToast('All notifications cleared.', 'success');
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase"
                      >
                        Mark All Read
                      </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="px-4 py-2 border-b border-zinc-850 flex gap-1.5 text-[10px] font-bold">
                      <button 
                        onClick={() => setNotificationFilter('all')}
                        className={`px-2.5 py-1 rounded-md ${notificationFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setNotificationFilter('status')}
                        className={`px-2.5 py-1 rounded-md ${notificationFilter === 'status' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
                      >
                        SLA Progress
                      </button>
                      <button 
                        onClick={() => setNotificationFilter('ai')}
                        className={`px-2.5 py-1 rounded-md ${notificationFilter === 'ai' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
                      >
                        AI Insights
                      </button>
                      <button 
                        onClick={() => setNotificationFilter('emergency')}
                        className={`px-2.5 py-1 rounded-md ${notificationFilter === 'emergency' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
                      >
                        Alerts
                      </button>
                    </div>

                    {/* Scrollable list */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-55 dark:divide-zinc-800/60">
                      {filteredNotifs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">
                          No notifications match this filter.
                        </div>
                      ) : (
                        filteredNotifs.map(notif => {
                          const isAI = notif.title.toLowerCase().includes('ai') || notif.title.toLowerCase().includes('vision');
                          const isEmergency = notif.title.toLowerCase().includes('alert') || notif.title.toLowerCase().includes('critical') || notif.type === 'assignment';
                          return (
                            <div 
                              key={notif.id} 
                              className={`p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-xs transition-all ${
                                !notif.read ? 'bg-indigo-50/20 dark:bg-indigo-950/5 border-l-2 border-indigo-500' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded mb-1 inline-block ${
                                  isEmergency ? 'bg-rose-950 text-rose-400' : isAI ? 'bg-purple-950 text-purple-400' : 'bg-zinc-900 text-zinc-400'
                                }`}>
                                  {isEmergency ? 'Siren Alert' : isAI ? 'AI Intel' : 'SLA Update'}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-mono">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="font-bold text-slate-800 dark:text-zinc-200">{notif.title}</p>
                              <p className="text-slate-500 dark:text-zinc-400 mt-1 leading-snug">{notif.description}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Profile Summary */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60">
                <span className="text-xs font-bold text-slate-750 dark:text-zinc-200">{user?.name}</span>
                <img src={user?.avatarUrl} className="w-6 h-6 rounded-full border border-indigo-500/30 object-cover bg-slate-200" alt="Avatar" />
              </div>

            </div>
          </header>
        )}

        {/* ================= SEARCH EVERYWHERE MODAL ================= */}
        {searchActive && (
          <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-left">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search complaints, departments, officers, locations, AI metrics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-sm text-slate-100 focus:outline-none placeholder-zinc-500"
                  />
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchActive(false);
                  }}
                  className="p-1.5 hover:bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search results view */}
              <div className="p-4 max-h-[450px] overflow-y-auto space-y-4">
                {!searchQuery.trim() ? (
                  <div className="py-12 text-center text-zinc-500 space-y-2">
                    <Search className="w-10 h-10 text-zinc-700 mx-auto" />
                    <p className="text-xs font-bold">Search Everywhere Core Router</p>
                    <p className="text-[11px] max-w-md mx-auto leading-relaxed">
                      Enter any keyword to run dynamic indexing against live complaints, registered departments, and connected AI diagnostic agent logs.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Complaints Results */}
                    {searchResults.complaints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> Complaints Match ({searchResults.complaints.length})
                        </h4>
                        <div className="space-y-1.5">
                          {searchResults.complaints.map(comp => (
                            <button
                              key={comp.id}
                              onClick={() => {
                                setSearchActive(false);
                                setSearchQuery('');
                                navigate(isCitizen ? '/issues' : '/admin/issues');
                              }}
                              className="w-full p-2.5 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 rounded-xl text-left text-xs transition-all flex justify-between items-center"
                            >
                              <div>
                                <p className="font-bold text-white">{comp.title}</p>
                                <p className="text-zinc-400 mt-0.5 truncate max-w-lg leading-snug">{comp.description}</p>
                                <p className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {comp.address}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black shrink-0 ${
                                comp.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                              }`}>
                                {comp.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Departments Results */}
                    {searchResults.departments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> Departments Match ({searchResults.departments.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.departments.map(dept => (
                            <button
                              key={dept.id}
                              onClick={() => {
                                setSearchActive(false);
                                setSearchQuery('');
                                navigate('/admin/departments');
                              }}
                              className="p-2.5 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-left text-xs transition-all flex items-start gap-2.5"
                            >
                              <div className="p-1.5 bg-zinc-900 text-indigo-400 rounded-lg">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-white leading-tight">{dept.name}</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">Head: {dept.headName}</p>
                                <p className="text-[9px] font-mono text-zinc-500 mt-1">Code: {dept.code}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Agents Results */}
                    {searchResults.agents.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" /> AI Operations Match ({searchResults.agents.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.agents.map(ag => (
                            <button
                              key={ag.id}
                              onClick={() => {
                                setSearchActive(false);
                                setSearchQuery('');
                                navigate('/admin/ai-ops');
                              }}
                              className="p-2.5 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-left text-xs transition-all flex items-start gap-2.5"
                            >
                              <div className="p-1.5 bg-zinc-900 text-purple-400 rounded-lg">
                                <Bot className="w-4 h-4 animate-pulse" />
                              </div>
                              <div>
                                <p className="font-bold text-white leading-tight">Agent: {ag.name}</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">{ag.purpose}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.complaints.length === 0 && searchResults.departments.length === 0 && searchResults.agents.length === 0 && (
                      <div className="py-12 text-center text-zinc-500 space-y-1.5">
                        <Search className="w-8 h-8 text-zinc-800 mx-auto" />
                        <p className="text-xs font-bold">No results found matching "{searchQuery}"</p>
                        <p className="text-[10px]">Try searching standard keywords like "water", "road", "pothole", "sewer", or departments like "Road".</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= DYNAMIC LIVE TIMELINE ACTIVITY FEED (If Demo Mode is ON) ================= */}
        {demoMode && (
          <div className="bg-emerald-950/10 border-b border-emerald-500/20 px-8 py-2.5 flex items-center gap-3 overflow-hidden select-none">
            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded-sm shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Real-time Feed
            </span>
            <div className="flex-1 overflow-hidden h-4 text-[11px] font-mono font-medium text-emerald-300">
              <div className="animate-marquee whitespace-nowrap flex gap-12">
                {globalActivity.map((act) => (
                  <span key={act.id} className="flex items-center gap-1">
                    <span className="text-[9px] text-zinc-500">[{new Date(act.timestamp).toLocaleTimeString()}]</span>
                    <span>{act.message}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Panel Frame */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>

        {/* ================= JUDGE MODE GUIDE ASSISTANT INTERACTIVE PANEL ================= */}
        {judgeMode && (
          <div className="fixed bottom-6 right-6 z-50 w-96 bg-zinc-950 border border-purple-500/40 rounded-3xl p-5 shadow-2xl text-left relative overflow-hidden animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-black tracking-widest text-white uppercase">JUDGE WALKTHROUGH ACTIVE</span>
              </div>
              <button
                onClick={() => {
                  setJudgeMode(false);
                  setJudgeStep(0);
                }}
                className="p-1 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step Contents */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono font-bold">
                <span>STAGE {judgeStep + 1} OF {judgeWalkthroughSteps.length}</span>
                <span>{Math.round(((judgeStep + 1) / judgeWalkthroughSteps.length) * 100)}% COMPLETE</span>
              </div>
              <h4 className="font-extrabold text-white text-sm">{judgeWalkthroughSteps[judgeStep].title}</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">{judgeWalkthroughSteps[judgeStep].desc}</p>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-850">
              <button
                disabled={judgeStep === 0}
                onClick={() => setJudgeStep(prev => prev - 1)}
                className="text-[10px] font-black uppercase text-zinc-500 hover:text-white disabled:opacity-30"
              >
                Back
              </button>
              
              <button
                onClick={() => {
                  // Execute associated redirection action
                  const stepObj = judgeWalkthroughSteps[judgeStep];
                  if (stepObj.onAction) stepObj.onAction();

                  // Progress
                  if (judgeStep < judgeWalkthroughSteps.length - 1) {
                    setJudgeStep(prev => prev + 1);
                  } else {
                    setJudgeMode(false);
                    setJudgeStep(0);
                    showToast("Walkthrough finished! Feel free to explore the platform.", "success");
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[10px] font-black rounded-lg transition-all shadow-md"
              >
                {judgeWalkthroughSteps[judgeStep].actionText}
              </button>
            </div>
          </div>
        )}



      </main>
    </div>
  );
};
