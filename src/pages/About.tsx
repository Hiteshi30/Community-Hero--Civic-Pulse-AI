import React from 'react';
import { Bot, Shield, Cpu, Zap, Target, Sparkles, HelpCircle, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  const stack = [
    { name: 'Vite & React 19', desc: 'Fast, modern client environment with optimized component rendering.' },
    { name: 'Tailwind CSS v4', desc: 'Custom dark display utility classes for responsive mobile-first UI.' },
    { name: 'Google Gemini API', desc: 'Multi-modal processing for image diagnostic pipelines & natural language agents.' },
    { name: 'Firebase Firestore', desc: 'Real-time database synchronization for persistent citizen journals and dispatch.' },
    { name: 'Motion', desc: 'Fluid state transitions, staggered entrance guides, and responsive gestures.' }
  ];

  const agentIdentities = [
    { id: 1, title: 'Vision Intelligence', desc: 'Interprets citizen media to classify category, size, and secondary environmental hazards.' },
    { id: 2, title: 'Duplicate Intelligence', desc: 'Employs GPS bounds and visual pixel comparison to auto-group redundant logs.' },
    { id: 3, title: 'Priority Intelligence', desc: 'Processes traffic, weather, and proximity to schools/hospitals into a clear priority score.' },
    { id: 4, title: 'Resolution Planner', desc: 'Synthesizes step-by-step repair workflow instructions and prints local work orders.' },
    { id: 5, title: 'Resource Optimizer', desc: 'Ensures municipal repair crews, heavy machinery, and budgets are dynamically allocated.' },
    { id: 6, title: 'City Prediction Agent', desc: 'Tracks historical weather trends to map potential flash floods or congestion hotspots.' },
    { id: 7, title: 'Community Sentiment', desc: 'Runs natural language analysis on forum posts to measure community mood shifts.' },
    { id: 8, title: 'Executive Reporter', desc: 'Assembles high-density municipal briefing packets and compiles downloadable PDF logs.' },
    { id: 9, title: 'Emergency Response', desc: 'Continuous monitor triggers instant flashing sirens on critical hazard reports.' },
    { id: 10, title: 'City Health Agent', desc: 'Coordinates Ward-by-Ward performance indices on full GIS mapping layouts.' }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto text-left pb-16">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-zinc-950 border border-slate-800 dark:border-zinc-800 p-8 md:p-12 text-center space-y-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 mb-2">
          <Bot className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-zinc-500 bg-clip-text text-transparent">
          About CivicPulse AI
        </h1>
        <p className="text-sm md:text-base text-zinc-300 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The world's first decentralized multi-agent community operations platform. Empowering citizens through direct, AI-validated reporting and enabling municipal departments to optimize resources autonomously.
        </p>
      </div>

      {/* Grid: Mission, Problem, Solution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900/40 rounded-2xl border border-slate-200 dark:border-zinc-800/80 space-y-3 shadow-sm dark:shadow-none">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            To make civic infrastructure management transparent, responsive, and fully collaborative. We connect public service departments with the collective intelligence of the neighborhood to solve critical issues faster.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900/40 rounded-2xl border border-slate-200 dark:border-zinc-800/80 space-y-3 shadow-sm dark:shadow-none">
          <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl w-fit">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">The Problem</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Traditional grievance systems suffer from structural opacity, prolonged triage delays, duplicate submissions, and lack of accountability, leaving communities frustrated and resources underutilized.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900/40 rounded-2xl border border-slate-200 dark:border-zinc-800/80 space-y-3 shadow-sm dark:shadow-none">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">The Solution</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            CivicPulse deploys 10 specialized AI Agents. Photos are automatically cross-checked for duplicates and prioritised dynamically using proximity metrics, while citizens earn rewards for collaborative verification.
          </p>
        </div>
      </div>

      {/* Meet the AI Agents Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-zinc-800/80 pb-3">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Decentralized AI Swarm
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-500 font-semibold mt-1">
            Ten autonomous nodes collaborate concurrently across our operational registry to direct city maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {agentIdentities.map(agent => (
            <div key={agent.id} className="p-4 bg-white dark:bg-zinc-900/60 rounded-xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between h-44 hover:border-indigo-500 dark:hover:border-indigo-500/40 transition-all shadow-sm dark:shadow-none">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">NODE #{agent.id.toString().padStart(2, '0')}</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2 leading-tight">{agent.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Enterprise Technology Stack
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
            CivicPulse is engineered for low-latency scalability, modern micro-interactions, and visual feedback that demonstrates real intelligence within seconds.
          </p>
          <div className="space-y-3">
            {stack.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-white dark:bg-zinc-900/20 rounded-xl border border-slate-200 dark:border-zinc-800/60 items-start shadow-sm dark:shadow-none">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-md">0{idx+1}</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Vision Section */}
        <div className="p-6 bg-white dark:bg-zinc-900/40 rounded-2xl border border-slate-200 dark:border-zinc-800/80 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Future Vision
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              We look forward to integrating with IoT drainage sensor networks, hyper-localized satellite thermal cameras to capture structural heat loss, and connected drone delivery networks for immediate emergency assistance.
            </p>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              By placing communities at the center of municipal resource coordination, CivicPulse aims to establish a truly democratic, high-efficiency blueprint for modern smart-city ecosystems globally.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Version 3.4 Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
