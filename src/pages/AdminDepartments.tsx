import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, Trash2, Droplet, Construction, Zap, Users, AlertTriangle,
  Award, TrendingUp, Clock, Sparkles, Cpu, CheckCircle2, RefreshCw
} from 'lucide-react';

export const AdminDepartments: React.FC = () => {
  const { departments, complaints, showToast } = useApp();
  const [prescriptions, setPrescriptions] = useState<Record<string, string>>({});
  const [loadingPrescriptionId, setLoadingPrescriptionId] = useState<string | null>(null);

  const getIcon = (name: string) => {
    if (name.includes('Sanitation')) return <Trash2 className="w-5 h-5 text-emerald-500 animate-pulse" />;
    if (name.includes('Water') || name.includes('Sewage')) return <Droplet className="w-5 h-5 text-blue-500" />;
    if (name.includes('Roads') || name.includes('Infrastructure')) return <Construction className="w-5 h-5 text-orange-500" />;
    if (name.includes('Electricity')) return <Zap className="w-5 h-5 text-yellow-500" />;
    return <ShieldAlert className="w-5 h-5 text-indigo-500" />;
  };

  const getPerformanceScore = (code: string) => {
    switch (code) {
      case 'SWM': return { score: 94, grading: 'Tier 1 (Excellent)', speed: '11.8 Hrs' };
      case 'WSS': return { score: 81, grading: 'Tier 2 (Good)', speed: '14.5 Hrs' };
      case 'RNI': return { score: 72, grading: 'Tier 3 (Average)', speed: '21.2 Hrs' };
      case 'ESL': return { score: 88, grading: 'Tier 2 (Good)', speed: '13.1 Hrs' };
      case 'PHC': return { score: 95, grading: 'Tier 1 (Excellent)', speed: '9.2 Hrs' };
      default: return { score: 85, grading: 'Tier 2 (Good)', speed: '15.0 Hrs' };
    }
  };

  const generateAIPrescription = (deptId: string, deptName: string) => {
    setLoadingPrescriptionId(deptId);
    showToast(`🧠 AI Dispatcher generating optimization advice for ${deptName}...`, 'info');

    setTimeout(() => {
      let advice = '';
      if (deptName.includes('Sanitation')) {
        advice = 'Recommendation: Deploy 2 additional loaders to Chandni Chowk to resolve a 14% backlog spike caused by narrow commercial corridors.';
      } else if (deptName.includes('Water')) {
        advice = 'Recommendation: High suction diesel jetting pumps must be pre-positioned at Connaught Place Ward 4 flyovers before incoming rainfall.';
      } else if (deptName.includes('Roads')) {
        advice = 'Recommendation: Re-route 1 thermal asphalt crew from Saket (low backlog) to Karol Bagh flyover lane immediately to close 3 pending critical potholes.';
      } else {
        advice = 'Recommendation: Maintain active standby load. Lighting sensors telemetry indicates 100% LED bulb compliance across southern Delhi grid lines.';
      }

      setPrescriptions(prev => ({ ...prev, [deptId]: advice }));
      setLoadingPrescriptionId(null);
      showToast('✨ Specialized efficiency prescription compiled!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border p-6 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-zinc-100">Municipal Channels & Channels</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Review specialized department crew sizes, pending backlogs, resolution speeds, and managers.</p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-purple-950/20 border border-indigo-100 dark:border-purple-900 px-4 py-2 rounded-xl shrink-0">
          <Cpu className="w-4 h-4 text-purple-600 animate-spin [animation-duration:4s]" />
          <span className="text-[10px] font-black text-slate-600 dark:text-purple-300">Active Routing SLA: 24h Threshold</span>
        </div>
      </div>

      {/* CHANNELS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const stats = getPerformanceScore(dept.code);
          const prescription = prescriptions[dept.id];
          const isPrescriptionLoading = loadingPrescriptionId === dept.id;

          return (
            <div 
              key={dept.id} 
              className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850/80 rounded-2xl shadow-xs space-y-5 hover:border-indigo-100 dark:hover:border-zinc-850 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 dark:bg-zinc-950/60 border dark:border-zinc-850 rounded-xl shrink-0">
                      {getIcon(dept.name)}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 leading-snug">{dept.name}</h4>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mt-0.5">Division ID: {dept.code}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full border font-black shrink-0 uppercase ${
                    dept.activeCount > 20 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {dept.activeCount} Active
                  </span>
                </div>

                {/* Performance score meter */}
                <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/40 rounded-xl border text-xs space-y-2 text-left">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>Performance Rating</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{stats.score}% ({stats.grading})</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${stats.score}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Avg Resolve: {stats.speed}</span>
                    </span>
                    <span className="text-emerald-500">SLA: MET</span>
                  </div>
                </div>

                {/* Personnel Manager details */}
                <div className="py-3 border-t border-b border-slate-50 dark:border-zinc-850 text-xs text-left space-y-1">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Department Overseer</span>
                  <p className="font-extrabold text-slate-800 dark:text-zinc-200">{dept.headName || 'N/A'}</p>
                  <p className="text-[10px] text-slate-400 font-semibold leading-none">{(dept.headName || '').replace(/\s+/g, '').replace(/,/g, '').toLowerCase()}@municipal.gov.in</p>
                </div>

                {/* AI Prescription Section */}
                {prescription ? (
                  <div className="p-3.5 rounded-xl bg-purple-50/30 dark:bg-purple-950/10 border border-purple-100/50 dark:border-zinc-800 text-xs space-y-1.5 text-left animate-fadeIn">
                    <span className="text-[8.5px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Dispatch Prescription</span>
                    </span>
                    <p className="text-[10.5px] font-semibold text-slate-600 dark:text-zinc-300 leading-relaxed">{prescription}</p>
                  </div>
                ) : null}
              </div>

              {/* Action */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-t dark:border-zinc-850 pt-4 mt-2">
                <span className="flex items-center gap-1 text-[11px] font-black text-slate-600 dark:text-zinc-400">
                  <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{dept.officerCount} supervisors</span>
                </span>

                <button
                  onClick={() => generateAIPrescription(dept.id, dept.name)}
                  disabled={isPrescriptionLoading}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950 border text-[10px] font-black text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isPrescriptionLoading ? 'Analyzing...' : 'AI Prescription'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
