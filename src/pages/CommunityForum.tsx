import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Heart, MessageSquare, Megaphone, Send, MapPin, ShieldAlert,
  Flame, Award, CheckCircle2, TrendingUp, AlertCircle, BarChart3, Image
} from 'lucide-react';

interface BulletinPost {
  id: string;
  author: string;
  role: 'citizen' | 'officer';
  city: string;
  content: string;
  cheers: number;
  commentsCount: number;
  time: string;
  cheeredBy: string[];
}

// Simulated Crowdsourced Active Campaigns
const ACTIVE_CAMPAIGNS = [
  {
    id: 'camp_1',
    title: 'Block-D Park Lighting Drive',
    progress: '18 / 25 Verifications',
    pct: 72,
    goal: 'Accelerate Electricity Dept SLA priority',
    supporters: 18,
    supportedByMe: false
  },
  {
    id: 'camp_2',
    title: 'Connaught Place Segregation Drive',
    progress: '45 / 50 Pledges',
    pct: 90,
    goal: 'Unlock Sunday organic waste bags',
    supporters: 45,
    supportedByMe: true
  }
];

export const CommunityForum: React.FC = () => {
  const { user, showToast } = useApp();
  const [announcements, setAnnouncements] = useState<BulletinPost[]>([
    {
      id: 'post_1',
      author: 'Rajesh Kumar',
      role: 'citizen',
      city: 'Delhi',
      content: '🚨 Segregation drive starting this Sunday in E-block green park. BMC coordinators will distribute green and blue waste bins. Let’s make our Sector 4 park clean and beautiful! 🌿',
      cheers: 28,
      commentsCount: 12,
      time: '2 hours ago',
      cheeredBy: []
    },
    {
      id: 'post_2',
      author: 'Priya Srinivasan',
      role: 'officer',
      city: 'Delhi',
      content: '📢 Hydraulic pipe repair completed on Inner Ring Circle. Normal water delivery pressure will be restored in Ward E-Block within 2 hours. Thanks to all citizens who upvoted the alert!',
      cheers: 45,
      commentsCount: 6,
      time: '4 hours ago',
      cheeredBy: ['user_rajesh']
    },
    {
      id: 'post_3',
      author: 'Aarav Mehta',
      role: 'citizen',
      city: 'Delhi',
      content: 'We noticed the high-voltage electricity lines near CP playground are finally insulated after 4 reports. Great job by NDMC team for prompt response and closing the work ticket.',
      cheers: 19,
      commentsCount: 3,
      time: '1 day ago',
      cheeredBy: []
    }
  ]);

  const [newContent, setNewContent] = useState('');
  const [campaigns, setCampaigns] = useState(ACTIVE_CAMPAIGNS);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPost: BulletinPost = {
      id: `p_${Math.random()}`,
      author: user?.name || 'Citizen',
      role: (user?.role || 'citizen') as 'citizen' | 'officer',
      city: user?.city || 'Delhi',
      content: newContent,
      cheers: 1,
      commentsCount: 0,
      time: 'Just now',
      cheeredBy: [user?.uid || '']
    };

    setAnnouncements(prev => [newPost, ...prev]);
    setNewContent('');
    showToast('✨ Announcement broadcasted successfully to your neighborhood!', 'success');
  };

  const handleCheer = (postId: string) => {
    if (!user) return;
    setAnnouncements(prev => prev.map(p => {
      if (p.id === postId) {
        const alreadyCheered = p.cheeredBy.includes(user.uid);
        return {
          ...p,
          cheers: alreadyCheered ? p.cheers - 1 : p.cheers + 1,
          cheeredBy: alreadyCheered 
            ? p.cheeredBy.filter(id => id !== user.uid) 
            : [...p.cheeredBy, user.uid]
        };
      }
      return p;
    }));
  };

  const handleSupportCampaign = (campId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        const supported = !c.supportedByMe;
        const count = supported ? c.supporters + 1 : c.supporters - 1;
        // recalculating percentage
        const matches = count;
        const total = campId === 'camp_1' ? 25 : 50;
        return {
          ...c,
          supportedByMe: supported,
          supporters: count,
          progress: `${count} / ${total} ${campId === 'camp_1' ? 'Verifications' : 'Pledges'}`,
          pct: Math.round((count / total) * 100)
        };
      }
      return c;
    }));
    showToast('📢 Support registered! Added to ward escalation agenda.', 'success');
  };

  // Filter bulletin by user's city
  const filteredAnnouncements = announcements.filter(
    p => p.city.toLowerCase() === (user?.city || 'Delhi').toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Header Block */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border p-4 rounded-2xl">
        <div className="space-y-1 text-left">
          <h2 className="text-xl font-black tracking-tight">Ward Trust & Forum</h2>
          <p className="text-[11px] text-slate-500 font-semibold">
            Broadcasting community updates and co-escalating civic agendas in <span className="text-indigo-600 font-extrabold">{user?.city || 'Delhi'} Sector 4</span>
          </p>
        </div>

        {/* Dynamic Trust Score Badge */}
        <div className="flex items-center gap-3 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2 border border-indigo-100 dark:border-zinc-800 rounded-xl">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <div className="text-left leading-tight">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Ward Trust Score</span>
            <span className="text-sm font-black text-slate-800 dark:text-zinc-200">96.4% Cohesion</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 spans): Discussion Inputs and Campaigns */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Post broadcast form */}
          <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border text-left space-y-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-700 dark:text-zinc-200 flex items-center gap-1.5 border-b pb-3 uppercase tracking-wider">
              <Megaphone className="w-4 h-4 text-indigo-500" />
              <span>Broadcast Neighborhood Post</span>
            </h3>

            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-zinc-950/40 border rounded-xl text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-slate-500 font-bold">Scope: <span className="text-indigo-600 font-extrabold">{user?.city || 'Delhi'} Sector 4</span></span>
            </div>

            <textarea
              id="bulletin-content-input"
              rows={4}
              placeholder="Post a sanitation update, organize neighborhood cleaning, or thank your ward officer..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-xs outline-none text-slate-800 dark:text-zinc-200 resize-none focus:border-indigo-500"
              required
            />

            <button
              id="publish-bulletin-btn"
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs flex justify-center items-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Bulletin Post</span>
            </button>
          </form>

          {/* Ward Campaigns support drives */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border text-left space-y-4">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Ward Pledges</span>
              <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Co-Escalation Agendas</span>
              </h4>
            </div>

            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="space-y-2 p-3 bg-slate-50 dark:bg-zinc-950 border rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{camp.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{camp.goal}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>{camp.progress}</span>
                      <span>{camp.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${camp.pct}%` }} />
                    </div>
                  </div>

                  <button
                    id={`support-camp-btn-${camp.id}`}
                    onClick={() => handleSupportCampaign(camp.id)}
                    className={`w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors border cursor-pointer ${
                      camp.supportedByMe
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    {camp.supportedByMe ? '✓ Support Pledged' : 'Pledge Support'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (8 spans): Active timeline discussion thread feed */}
        <div className="lg:col-span-8 space-y-4 text-left">
          <h3 className="text-sm font-black text-slate-700 dark:text-zinc-200">Local Neighborhood Discussion Feed</h3>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {filteredAnnouncements.map((post) => {
              const isCheered = user && post.cheeredBy.includes(user.uid);
              return (
                <div 
                  key={post.id} 
                  className="p-5.5 bg-white dark:bg-zinc-900 border rounded-2xl space-y-3.5 shadow-xs"
                >
                  <div className="flex gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300 border text-xs">
                        {post.author[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-black">{post.author}</p>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                            post.role === 'officer' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400' 
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                          }`}>
                            {post.role}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{post.time} • {post.city} Sector 4</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex gap-4 items-center border-t border-slate-100 dark:border-zinc-800/80 pt-3 text-[10px] font-bold">
                    <button
                      id={`cheer-btn-${post.id}`}
                      onClick={() => handleCheer(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isCheered
                          ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/10 dark:border-rose-900'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isCheered ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>Cheer ({post.cheers})</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Remarks ({post.commentsCount})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
