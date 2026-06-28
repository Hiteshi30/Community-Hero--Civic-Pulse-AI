import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, Gift, Ticket, Copy, Check, Clock, Globe, Zap, Users, ShieldAlert,
  Flame, Sparkles, TrendingUp, ChevronRight, Bookmark, ShieldCheck, HeartHandshake
} from 'lucide-react';

// Preset local Indian Leaderboard contributors
const LEADERBOARD_USERS = [
  { rank: 1, name: 'Aarav Mehta', points: 940, badge: 'Civic Champion', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', level: 'Level 12' },
  { rank: 2, name: 'Rohan Sharma', points: 820, badge: 'Local Guardian', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', level: 'Level 10' },
  { rank: 3, name: 'Rajesh Kumar (You)', points: 350, badge: 'Silver Sentinel', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', level: 'Level 5' },
  { rank: 4, name: 'Kavita Iyer', points: 320, badge: 'Community Hero', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', level: 'Level 4' },
  { rank: 5, name: 'Siddharth Roy', points: 290, badge: 'Community Hero', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', level: 'Level 3' }
];

// Preset Weekly Active Challenges
const WEEKLY_CHALLENGES = [
  {
    id: 'ch_1',
    title: 'Monsoon Clean Drainage Guard',
    desc: 'Verify or report 2 drainage / sewage leakage outlets in your ward sector.',
    reward: '+100 XP & Bonus Coupon',
    progress: '1/2',
    pct: 50,
    active: true
  },
  {
    id: 'ch_2',
    title: 'Night Patrol Luminary',
    desc: 'Report 1 phase breakdown of residential streetlighting grid in Delhi NCR.',
    reward: '+75 XP & LED voucher',
    progress: '0/1',
    pct: 0,
    active: true
  }
];

// Citizen Badge Progression Timeline
const MILESTONE_TIMELINE = [
  { level: 'Level 1', name: 'Ward Novice', pts: '0 - 100', desc: 'Unlocked upon joining. Standard citizen reporting permissions.', date: 'Joined June 2026' },
  { level: 'Level 5', name: 'Silver Sentinel', pts: '300 - 500', desc: 'Accelerated duplicate validation capability. Vote weights doubled.', date: 'Unlocked Today' },
  { level: 'Level 8', name: 'Local Guardian', pts: '500 - 800', desc: 'Can verify officer repair resolutions. Access to custom rewards catalog.', date: 'Estimated: 2 weeks' },
  { level: 'Level 12', name: 'Civic Champion', pts: '800+', desc: 'Direct escalation privilege to District Municipal Head.', date: 'Estimated: 1 month' }
];

export const Rewards: React.FC = () => {
  const { user, rewards, userRewards, redeemPoints, showToast, t } = useApp();
  const [selectedReward, setSelectedReward] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const points = user?.points || 350;

  const handleRedeem = async (rewardId: string) => {
    try {
      await redeemPoints(rewardId);
      const rew = rewards.find(r => r.id === rewardId);
      if (rew && points >= rew.costPoints) {
        setSelectedReward(rew);
      }
    } catch (err: any) {
      showToast(err.message || 'Redemption failed', 'error');
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Coupon code copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categoryColors = {
    transit: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900',
    utility: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900',
    store: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
    community: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-[#121226] to-[#080811] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-500/10 -mr-16 -mt-16 scale-150 blur-3xl" />
        
        <div className="space-y-2 z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-300">
            <Gift className="w-3.5 h-3.5" />
            <span>Civic Rewards Club</span>
          </div>
          <h2 className="text-3xl font-black leading-tight">Your Civic Duty Earns Rewards!</h2>
          <p className="text-xs text-indigo-200/80 max-w-lg leading-relaxed">
            Redeem points earned by reporting issues, validating neighborhood complaints, and participating in weekly challenges.
          </p>
        </div>

        {/* Big Points Badge */}
        <div className="px-6 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center shrink-0 min-w-[150px] z-10">
          <Award className="w-8 h-8 text-yellow-300 animate-float" />
          <span className="text-2xl font-black mt-2 text-white">{points}</span>
          <span className="text-[10px] text-indigo-300 uppercase font-black tracking-widest">{t('points_badge')}</span>
        </div>
      </div>

      {/* Gamification Stats: Badges, Level Progress and Active Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Badge Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between text-left space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Citizen Standing</span>
              <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">Silver Sentinel Badge</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <span>Next Level: Local Guardian</span>
              <span>{points} / 500 XP</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full rounded-full" style={{ width: `${(points / 500) * 100}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 italic">Report 3 more drainage issues to ascend level!</p>
          </div>
        </div>

        {/* Weekly Active Challenges */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs text-left space-y-4 lg:col-span-2">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ward Challenges</span>
            <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100">Active Weekly Challenges</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKLY_CHALLENGES.map((ch) => (
              <div key={ch.id} className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800/80 text-xs space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 dark:text-zinc-200">{ch.title}</span>
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-1.5 py-0.5 rounded-md">
                      {ch.reward}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal line-clamp-2">{ch.desc}</p>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>Task Progress</span>
                    <span>{ch.progress} completed</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${ch.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Catalog & Monthly Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left side: Available Rewards Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-700 dark:text-zinc-200 text-left border-b pb-2">Catalog of Available Rewards</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rewards.map((rew) => {
              const canRedeem = points >= rew.costPoints;
              return (
                <div 
                  key={rew.id} 
                  className="flex flex-col bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all text-left"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img src={rew.imageUrl} alt={rew.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${categoryColors[rew.category]}`}>
                      {rew.category}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-xs text-xs font-black text-white">
                      {rew.costPoints} pts
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rew.partnerName}</span>
                      <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 line-clamp-1">{rew.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal line-clamp-2">{rew.description}</p>
                    </div>

                    <button
                      id={`redeem-btn-${rew.id}`}
                      onClick={() => handleRedeem(rew.id)}
                      disabled={!canRedeem}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        canRedeem
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400 border cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 dark:border-zinc-700'
                      }`}
                    >
                      {canRedeem ? 'Redeem Voucher' : 'Insufficient Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Monthly Leaderboard & Redeemed list */}
        <div className="space-y-6 text-left">
          
          {/* Monthly Leaderboard */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Delhi Sector 4 Ward</span>
              <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Monthly Leaderboard</span>
              </h4>
            </div>

            <div className="space-y-3">
              {LEADERBOARD_USERS.map((contributor) => {
                const isUser = contributor.points === points;
                return (
                  <div 
                    key={contributor.rank} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isUser 
                        ? 'border-indigo-500 bg-indigo-50/15 dark:bg-indigo-950/20' 
                        : 'border-slate-100/60 dark:border-zinc-850 bg-slate-50/40 dark:bg-zinc-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center font-black ${
                        contributor.rank === 1 ? 'text-amber-500' : contributor.rank === 2 ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        #{contributor.rank}
                      </span>
                      <img src={contributor.avatar} alt={contributor.name} className="w-8 h-8 rounded-full object-cover shrink-0 border" />
                      <div>
                        <p className={`line-clamp-1 truncate ${isUser ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : ''}`}>{contributor.name}</p>
                        <span className="text-[9px] text-slate-400 font-bold block">{contributor.level} • {contributor.badge}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-700 dark:text-zinc-300">{contributor.points} pts</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeemed coupons sidebar */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-700 dark:text-zinc-200">My Redeemed Coupons ({userRewards.length})</h3>
            
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 space-y-3.5 max-h-[300px] overflow-y-auto">
              {userRewards.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-1">
                  <Ticket className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold">No coupons redeemed yet.</p>
                  <p className="text-[10px] leading-relaxed">Earn points to unlock exciting partner deals!</p>
                </div>
              ) : (
                userRewards.map((ur) => (
                  <div 
                    key={ur.id} 
                    className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 flex items-center justify-between gap-3 shadow-inner"
                  >
                    <div className="space-y-1.5 min-w-0 text-left">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Voucher Code Receipt</span>
                      <h5 className="text-xs font-black truncate">{ur.title}</h5>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] text-slate-400">{new Date(ur.redeemedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      id={`copy-coupon-btn-${ur.id}`}
                      onClick={() => handleCopyCode(ur.couponCode, ur.id)}
                      className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 hover:border-indigo-500 rounded-lg text-slate-500 hover:text-indigo-500 transition-all shrink-0 relative cursor-pointer"
                      title="Copy Coupon Code"
                    >
                      {copiedId === ur.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Gamification Achievements Timeline Milestones */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-left space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ward Career Milestones</span>
          <h4 className="text-sm font-black text-slate-800 dark:text-zinc-200">Achievement Progression Timeline</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {MILESTONE_TIMELINE.map((mile, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-zinc-950 border rounded-xl relative overflow-hidden">
              <span className="absolute top-0 right-0 p-2 text-indigo-500/10 font-black text-3xl select-none">
                {idx + 1}
              </span>
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{mile.level}</span>
              <p className="font-extrabold text-xs text-slate-800 dark:text-zinc-200 mt-1">{mile.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold">{mile.pts} XP</p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal mt-2">{mile.desc}</p>
              <span className="text-[9px] font-bold text-indigo-500 mt-3 block">{mile.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= REDEMPTION SUCCESS MODAL ================= */}
      {selectedReward && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-float">
            
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">Redeemed Successfully!</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                You have successfully redeemed <strong>{selectedReward.costPoints} points</strong> for:
              </p>
              <p className="text-sm font-extrabold text-indigo-600">{selectedReward.title}</p>
            </div>

            {/* Displaying the code */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-zinc-950 border border-indigo-100 dark:border-zinc-800 flex justify-between items-center gap-3">
              <div className="text-left">
                <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest block">Partner Coupon Code</span>
                <span className="text-md font-mono font-black text-slate-800 dark:text-zinc-200 tracking-wider">{selectedReward.couponCode}</span>
              </div>
              <button
                id="modal-copy-code-btn"
                onClick={() => handleCopyCode(selectedReward.couponCode, 'modal')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <button
              id="close-success-modal"
              onClick={() => setSelectedReward(null)}
              className="w-full py-3 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
            >
              Back to Club
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
