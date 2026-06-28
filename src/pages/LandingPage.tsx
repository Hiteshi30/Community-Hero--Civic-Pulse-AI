import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldAlert, CheckCircle, Smartphone, Award, Globe2, Building2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, language, setLanguage, t } = useApp();

  const handleRoleSelect = (role: 'citizen' | 'officer') => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090B] text-slate-900 dark:text-zinc-100 flex flex-col overflow-x-hidden relative transition-colors duration-300">
      {/* Background Smart-City Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #6366F1 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
            C
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('app_name')}
            </span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t('tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="lang-switch-landing"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <button
            id="theme-toggle-landing"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 z-10">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Working for any city in India</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {t('hero_title')}
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0">
            {t('hero_subtitle')}
          </p>

          {/* Interactive Flow Diagram (Micro smart illustration) */}
          <div className="hidden md:flex justify-between items-center max-w-lg p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm mx-auto lg:mx-0">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">1</div>
              <span className="text-[10px] font-bold mt-1.5 text-slate-500">Report</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-[10px] font-bold mt-1.5 text-slate-500">Crowd-Verify</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-[10px] font-bold mt-1.5 text-slate-500">AI Dispatch</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-sm">4</div>
              <span className="text-[10px] font-bold mt-1.5 text-slate-500">Resolve</span>
            </div>
          </div>
        </div>

        {/* Portal Cards Selection */}
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-6">
          {/* Citizen Card */}
          <div 
            id="citizen-portal-card"
            onClick={() => handleRoleSelect('citizen')}
            className="flex-1 p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-slate-200 hover:border-indigo-500 dark:border-zinc-800 dark:hover:border-indigo-500 shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-300 group relative overflow-hidden text-left"
          >
            {/* Subtle floating circle accent */}
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-indigo-500/5 group-hover:scale-150 transition-all duration-500" />

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center shadow-inner mb-6">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {t('citizen_title')}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              {t('citizen_desc')}
            </p>

            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Access Citizen Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>

          {/* Officer Card */}
          <div 
            id="officer-portal-card"
            onClick={() => handleRoleSelect('officer')}
            className="flex-1 p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-slate-200 hover:border-purple-500 dark:border-zinc-800 dark:hover:border-purple-500 shadow-xl hover:shadow-purple-500/10 cursor-pointer transition-all duration-300 group relative overflow-hidden text-left"
          >
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-purple-500/5 group-hover:scale-150 transition-all duration-500" />

            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shadow-inner mb-6">
              <Building2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {t('officer_title')}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              {t('officer_desc')}
            </p>

            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Access Municipal Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </main>

      {/* Mini Feature highlights */}
      <footer className="bg-white/40 dark:bg-zinc-900/40 border-t border-slate-200 dark:border-zinc-800/80 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-800 dark:text-zinc-200">Decentralized City Operations</p>
              <p className="mt-0.5 text-slate-400">Works seamlessly across major Indian cities including Delhi, Mumbai, Bengaluru, Chennai.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-800 dark:text-zinc-200">Earn Eco & Civic Rewards</p>
              <p className="mt-0.5 text-slate-400">Gain rewards like free metro commuters card vouchers for reporting and verifying issues.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-800 dark:text-zinc-200">AI Dispatch Triage</p>
              <p className="mt-0.5 text-slate-400">Automatic priority, department, and severity calculation with duplicate complaint check.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
