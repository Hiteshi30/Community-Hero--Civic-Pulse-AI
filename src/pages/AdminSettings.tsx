import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Shield, Sliders, Volume2, Save, Check } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast } = useApp();
  
  // Settings controls states
  const [escalateCount, setEscalateCount] = useState(15);
  const [allowPublicVerify, setAllowPublicVerify] = useState(true);
  const [notifyHeads, setNotifyHeads] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings saved successfully!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Administrative Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Fine-tune AI dispatch triggers, crowdsourcing parameters, and auto-notification thresholds.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xs space-y-6">
        
        {/* Section 1: AI dispatch thresholds */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-zinc-850 pb-2.5">
            <Sliders className="w-4 h-4 text-purple-500" />
            <span>AI Auto-Escalation Triggers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Escalate slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Escalate complaint if upvoted by:</label>
              <div className="flex items-center gap-4">
                <input 
                  id="escalate-slider"
                  type="range" 
                  min="5" 
                  max="50" 
                  value={escalateCount} 
                  onChange={(e) => setEscalateCount(parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <span className="text-xs font-black bg-purple-50 dark:bg-purple-950/20 px-2.5 py-1 text-purple-600 border border-purple-100 dark:border-purple-900 rounded-lg shrink-0">{escalateCount} Citizens</span>
              </div>
            </div>

            {/* Public verification switch */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-850">
              <div className="text-left">
                <span className="text-xs font-black block">Enable Crowd Verification</span>
                <span className="text-[10px] text-slate-400 font-medium">Allow citizens to validate neighbor issues</span>
              </div>
              <input 
                id="crowd-verify-toggle"
                type="checkbox" 
                checked={allowPublicVerify}
                onChange={(e) => setAllowPublicVerify(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded-sm border-slate-300 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Municipal alert protocols */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-zinc-850 pb-2.5">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>Municipal Alert Protocols</span>
          </h3>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-850">
            <div className="text-left">
              <span className="text-xs font-black block">Auto-Notify Department Heads</span>
              <span className="text-[10px] text-slate-400 font-medium">Alert managers on critical or high urgency complaints</span>
            </div>
            <input 
              id="notify-heads-toggle"
              type="checkbox" 
              checked={notifyHeads}
              onChange={(e) => setNotifyHeads(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded-sm border-slate-300 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          id="save-settings-submit-btn"
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
        >
          {saving ? <Check className="w-4 h-4 animate-ping" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>

      </form>
    </div>
  );
};
