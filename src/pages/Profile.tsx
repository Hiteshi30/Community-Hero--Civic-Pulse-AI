import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, Mail, Compass, ShieldAlert, Award, Languages, Sun, Moon, Check, Landmark,
  Calendar, CheckCircle2, Trophy, Star, Sparkles, Flame, ShieldCheck, Heart,
  Camera, Phone, MapPin, BookOpen, Upload, Laptop, X
} from 'lucide-react';

// Unlocked Achievement Milestones for Rajesh
const ACHIEVEMENTS = [
  {
    id: 'ach_1',
    title: 'Ward Sentinel Level-Up',
    desc: 'Earned 300 points to cross Level 5 and double validation voting weight.',
    date: 'June 28, 2026',
    unlocked: true,
    icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />
  },
  {
    id: 'ach_2',
    title: 'First Verified Coordinate',
    desc: 'Validated the pothole leak on Inner Ring Circle to expedite dispatch SLA.',
    date: 'June 25, 2026',
    unlocked: true,
    icon: <Trophy className="w-5 h-5 text-amber-500" />
  },
  {
    id: 'ach_3',
    title: 'Civic Onboarding',
    desc: 'Completed profile registry and connected local Delhi municipal Ward GPS.',
    date: 'June 24, 2026',
    unlocked: true,
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  }
];

export interface CivicDayCell {
  id: number;
  date: string;
  density: number;
  activities: string[];
  pointsEarned: number;
}

const generateInitialCells = (): CivicDayCell[] => {
  const cells: CivicDayCell[] = [];
  const today = new Date('2026-06-27T12:00:00');
  
  const presetTasks = [
    "Validated Karol Bagh pothole coordinates",
    "Completed Ward 102 sanitation survey",
    "Verified street garbage bin clearance",
    "Voted on water pipeline repair urgency",
    "Reported park bench maintenance issue",
    "Uploaded photo for streetlight blackout",
    "Confirmed municipal sewage clearance",
    "Joined Ward resident green panel",
    "Reviewed local air quality sensor status",
    "Submitted feedback on waste segregation"
  ];

  for (let i = 0; i < 60; i++) {
    const dayOffset = 59 - i; // i=0 is 59 days ago, i=59 is today
    const dateObj = new Date(today.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const seedDensities = [0, 0, 1, 0, 2, 0, 0, 3, 0, 1, 0, 2, 0, 0, 1, 0, 3, 0, 0, 0, 2, 1, 0, 0, 1, 2, 0, 1, 0, 3, 0, 0, 1, 0, 2, 0, 1, 3, 0, 0];
    const density = seedDensities[i % seedDensities.length];
    
    const activities: string[] = [];
    if (density > 0) {
      for (let j = 0; j < density; j++) {
        const taskIndex = (i + j * 3) % presetTasks.length;
        activities.push(presetTasks[taskIndex]);
      }
    }
    
    cells.push({
      id: i,
      date: dateString,
      density,
      activities,
      pointsEarned: density * 15
    });
  }
  return cells;
};

const AVATAR_PRESETS = [
  { name: 'Professional Male', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  { name: 'Professional Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { name: 'Active Citizen', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' },
  { name: 'Tech Specialist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Leader Female', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  { name: 'Guardian Male', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80' }
];

export const Profile: React.FC = () => {
  const { user, language, setLanguage, theme, setTheme, updateUserProfile, showToast, t } = useApp();
  
  // Editable states
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || 'Delhi');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState((user as any)?.bio || '');
  const [ward, setWard] = useState((user as any)?.ward || 'Ward 102 - Karol Bagh');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [officerId, setOfficerId] = useState(user?.officerId || '');
  
  const [saving, setSaving] = useState(false);
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);

  // Daily Civic Activity grid states
  const [cells, setCells] = useState<CivicDayCell[]>(() => generateInitialCells());
  const [selectedCellId, setSelectedCellId] = useState<number>(59);
  const [newActivityText, setNewActivityText] = useState('');
  const [activityCategory, setActivityCategory] = useState('Pothole Verification Survey');

  // Keep fields synced with loaded user from AppContext
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCity(user.city || 'Delhi');
      setPhoneNumber(user.phoneNumber || '');
      setBio((user as any).bio || '');
      setWard((user as any).ward || 'Ward 102 - Karol Bagh');
      setAvatarUrl(user.avatarUrl || '');
      setDepartment(user.department || '');
      setOfficerId(user.officerId || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setSaving(true);
    const updatedData: any = {
      name,
      city,
      phoneNumber,
      bio,
      ward,
      avatarUrl
    };

    if (user?.role === 'officer') {
      updatedData.department = department;
      updatedData.officerId = officerId;
    }

    try {
      await updateUserProfile(updatedData);
    } catch (err) {
      console.error(err);
      showToast('Error saving profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        showToast('New photo loaded! Click "Save Profile Changes" to apply.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const getDensityColor = (density: number) => {
    if (density === 1) return 'bg-indigo-200 dark:bg-indigo-950/40';
    if (density === 2) return 'bg-indigo-400 dark:bg-indigo-800/80';
    if (density === 3) return 'bg-indigo-600 dark:bg-indigo-50';
    return 'bg-slate-100 dark:bg-zinc-900';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left pb-12">
      <div>
        <h2 className="text-xl font-black tracking-tight">{t('profile_settings')}</h2>
        <p className="text-[11px] text-slate-500 font-semibold">Manage your citizen profile, tracking credentials, and interface options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Avatar & Contribution Matrix (5 spans) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Avatar Base details Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border text-center space-y-5 shadow-xs">
            <div className="relative inline-block">
              <img 
                src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-indigo-500/20 mx-auto object-cover bg-slate-200 dark:bg-zinc-800" 
              />
              <label 
                htmlFor="avatar-file-upload" 
                className="absolute bottom-1 right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-zinc-900 shadow-md cursor-pointer transition-all hover:scale-105"
                title="Upload Profile Photo"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input 
                id="avatar-file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {/* Avatar customization panel */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{showAvatarPresets ? "Hide Presets" : "Choose from Beautiful Presets"}</span>
              </button>

              {showAvatarPresets && (
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-850 space-y-3 animate-fadeIn">
                  <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider text-left">Select Preset Avatar</span>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(preset.url);
                          showToast(`Selected preset: ${preset.name}`, 'success');
                        }}
                        className={`p-1 rounded-xl border transition-all relative overflow-hidden ${
                          avatarUrl === preset.url 
                            ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20' 
                            : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-lg object-cover mx-auto" />
                        {avatarUrl === preset.url && (
                          <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                            <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900 rounded-full p-0.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Or Enter Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white dark:bg-zinc-900 rounded-lg border text-[10px] text-slate-800 dark:text-zinc-200 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="font-extrabold text-slate-800 dark:text-zinc-100">{name || 'Unnamed Citizen'}</h3>
              <div className="flex justify-center gap-2 items-center">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-zinc-800">
                  {user?.role === 'citizen' ? t('citizen') : 'Municipal Officer'}
                </span>
                {ward && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-850">
                    {ward.split(' - ')[1] || ward}
                  </span>
                )}
              </div>
              {bio && (
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic max-w-xs mx-auto px-2">
                  "{bio}"
                </p>
              )}
            </div>

            {user?.role === 'citizen' ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border space-y-2">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Unused Wallet Points</span>
                <div className="flex justify-center items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-xl font-black text-slate-800 dark:text-zinc-200">{user?.points || 350} XP</span>
                </div>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold">{user?.badge || 'Silver Sentinel (Level 5)'}</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border space-y-1.5">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Municipal Credentials</span>
                <div className="flex justify-center items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                  <Landmark className="w-4 h-4 text-purple-500" />
                  <span>{user?.officerId || 'OFFICER-7712'}</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{user?.department || 'Sanitation & Waste'}</p>
              </div>
            )}
          </div>

          {/* Interactive Activity Ledger Heatmap */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border text-left space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
            
            <div className="flex justify-between items-center pl-1">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Civic Duty Ledger</span>
                <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200">Daily Civic Activity Grid</h4>
              </div>
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900 px-2.5 py-1 rounded-full text-amber-700 dark:text-amber-400 font-black flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                <span>6 Day Active Streak</span>
              </span>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed px-1">
              Click any square to inspect activities registered on that specific day, or log a new action to build up your civic presence!
            </p>

            {/* Heatmap Grid Matrix */}
            <div className="grid grid-cols-10 gap-1.5 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-900 shadow-inner">
              {cells.map((cell) => {
                const isSelected = selectedCellId === cell.id;
                return (
                  <button 
                    key={cell.id} 
                    type="button"
                    onClick={() => setSelectedCellId(cell.id)}
                    className={`aspect-square rounded-md ${getDensityColor(cell.density)} transition-all relative group cursor-pointer ${
                      isSelected 
                        ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-zinc-900 scale-110 z-10 shadow-md' 
                        : 'hover:scale-105'
                    }`}
                    title={`${cell.date}: ${cell.activities.length} actions`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-950 text-white text-[9px] font-bold py-1 px-2 rounded-lg whitespace-nowrap shadow-xl z-20">
                      {cell.date} • {cell.activities.length} Actions
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend info */}
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-extrabold px-1 pb-1 border-b border-slate-100 dark:border-zinc-850">
              <span>Timeline: Past 60 Days Matrix</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <span className="w-2.5 h-2.5 bg-slate-100 dark:bg-zinc-900 rounded-xs border dark:border-zinc-800" />
                <span className="w-2.5 h-2.5 bg-indigo-200 dark:bg-indigo-950/40 rounded-xs" />
                <span className="w-2.5 h-2.5 bg-indigo-400 dark:bg-indigo-800/80 rounded-xs" />
                <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-50 rounded-xs" />
                <span>More</span>
              </div>
            </div>

            {/* Selected Day Details Panel */}
            {(() => {
              const selectedCell = cells.find(c => c.id === selectedCellId);
              if (!selectedCell) return null;
              
              const isToday = selectedCell.id === 59;
              
              const handleLogAction = async () => {
                let actionText = activityCategory;
                if (activityCategory === 'Custom Action Entry') {
                  if (!newActivityText.trim()) {
                    showToast('Please type a short description of your action', 'error');
                    return;
                  }
                  actionText = newActivityText.trim();
                }

                // Update state
                const updated = cells.map(c => {
                  if (c.id === selectedCellId) {
                    const nextActivities = [...c.activities, actionText];
                    return {
                      ...c,
                      density: Math.min(nextActivities.length, 3),
                      activities: nextActivities,
                      pointsEarned: c.pointsEarned + 15
                    };
                  }
                  return c;
                });
                
                setCells(updated);
                setNewActivityText('');
                
                if (user) {
                  await updateUserProfile({
                    points: (user.points || 0) + 15
                  });
                  showToast('Verification success! +15 XP added to account.', 'success');
                }
              };

              const handleRemove = (taskIdx: number) => {
                const updated = cells.map(c => {
                  if (c.id === selectedCellId) {
                    const nextActivities = c.activities.filter((_, idx) => idx !== taskIdx);
                    return {
                      ...c,
                      density: Math.min(nextActivities.length, 3),
                      activities: nextActivities,
                      pointsEarned: Math.max(0, c.pointsEarned - 15)
                    };
                  }
                  return c;
                });
                setCells(updated);
                showToast('Action deleted.', 'info');
              };

              return (
                <div className="space-y-3.5 bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-850">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                        Inspection Sheet
                      </span>
                      <h5 className="text-[11px] font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedCell.date}</span>
                        {isToday && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-black uppercase">Today</span>}
                      </h5>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-extrabold block">Points Awarded</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+{selectedCell.pointsEarned} XP</span>
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Completed Wards Actions ({selectedCell.activities.length})</span>
                    {selectedCell.activities.length === 0 ? (
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic py-2">
                        No civic action logs recorded for this calendar index. Log an inspection task below!
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {selectedCell.activities.map((act, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-[10px] font-bold"
                          >
                            <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{act}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleRemove(index)}
                              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1 rounded transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Duty Form */}
                  <div className="border-t border-slate-200/60 dark:border-zinc-850 pt-3 space-y-2.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">Log New Civic Duty Log</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={activityCategory}
                        onChange={(e) => setActivityCategory(e.target.value)}
                        className="px-2.5 py-1.5 bg-white dark:bg-zinc-900 border dark:border-zinc-805 rounded-lg text-[10px] font-bold text-slate-700 dark:text-zinc-300 outline-none focus:border-indigo-500"
                      >
                        <option value="Pothole Verification Survey">Road Audit (Pothole)</option>
                        <option value="Streetlight Outage Checklist">Light Outage Survey</option>
                        <option value="Sanitation / Trash Clearance Flag">Sanitation Clean Audit</option>
                        <option value="Sewer Line Leak Validation">Drainage & Sewer Check</option>
                        <option value="Ward Resident Council Vote Cast">Committee Voting</option>
                        <option value="Custom Action Entry">Custom Civic Log...</option>
                      </select>

                      {activityCategory === 'Custom Action Entry' ? (
                        <input
                          type="text"
                          placeholder="What did you inspect/resolve?"
                          value={newActivityText}
                          onChange={(e) => setNewActivityText(e.target.value)}
                          className="px-2.5 py-1.5 bg-white dark:bg-zinc-900 border dark:border-zinc-805 rounded-lg text-[10px] font-medium text-slate-800 dark:text-zinc-200 outline-none focus:border-indigo-500"
                        />
                      ) : (
                        <div className="px-2.5 py-1.5 bg-slate-100 dark:bg-zinc-900/50 rounded-lg text-[10px] font-bold text-slate-400 dark:text-zinc-500 text-left flex items-center">
                          Standard Ward protocol (+15 XP)
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleLogAction}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] rounded-lg tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Seal Civic Verification Task (+15 XP)</span>
                    </button>
                  </div>

                </div>
              );
            })()}

          </div>

        </div>

        {/* Right Side: Identity Form, Timeline & Parameters (7 spans) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Identity Update Form */}
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border space-y-4 text-left">
            <h4 className="text-xs font-black text-slate-700 dark:text-zinc-200 border-b pb-3 uppercase tracking-wider">
              Ward Identity Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email (Disabled) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">Registered Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-100/80 dark:bg-zinc-950 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-semibold">{user?.email || 'rajesh.kumar@gmail.com'}</span>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">{t('name')}</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-950">
                  <User className="w-4 h-4 text-slate-400" />
                  <input 
                    id="profile-name-edit"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-xs w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">Phone Number</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-950">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input 
                    id="profile-phone-edit"
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-transparent text-xs w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">{t('city')}</label>
                <select
                  id="profile-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-950 text-xs outline-none text-slate-800 dark:text-zinc-200"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Lucknow">Lucknow</option>
                </select>
              </div>

              {/* Ward / Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">Neighborhood Ward / Area</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-950">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <input 
                    id="profile-ward-edit"
                    type="text" 
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Ward 102 - Karol Bagh"
                    className="bg-transparent text-xs w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Biography / Intro */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">Civic Biography</label>
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-950">
                  <BookOpen className="w-4 h-4 text-slate-400 mt-1" />
                  <textarea 
                    id="profile-bio-edit"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your community goals or civic passions..."
                    className="bg-transparent text-xs w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200 resize-none"
                  />
                </div>
              </div>

              {/* Officer-Specific Custom Credentials */}
              {user?.role === 'officer' && (
                <div className="grid grid-cols-2 gap-4 sm:col-span-2 pt-2 border-t border-dashed border-slate-200 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-indigo-500 uppercase tracking-wider block">Assigned Department</label>
                    <input 
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-zinc-950 text-xs text-slate-800 dark:text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-indigo-500 uppercase tracking-wider block">Officer Badge ID</label>
                    <input 
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-zinc-950 text-xs text-slate-800 dark:text-zinc-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>

          {/* Achievement timeline milestones */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border text-left space-y-4">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Citizen accomplishments</span>
              <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>My Civic Achievements ({ACHIEVEMENTS.length})</span>
              </h4>
            </div>

            <div className="space-y-3.5 pl-2">
              {ACHIEVEMENTS.map((ach) => (
                <div key={ach.id} className="flex gap-3 text-xs text-left items-start border-b border-slate-100 dark:border-zinc-850 pb-3.5 last:border-0 last:pb-0">
                  <div className="p-2 bg-indigo-50/50 dark:bg-zinc-950 rounded-xl border border-indigo-100 dark:border-zinc-800 shrink-0 mt-0.5">
                    {ach.icon}
                  </div>
                  <div className="space-y-0.5 overflow-hidden flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-extrabold text-slate-800 dark:text-zinc-200">{ach.title}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{ach.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interface Parameter Toggle Toggles */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border text-left space-y-4">
            <h4 className="text-xs font-black text-slate-700 dark:text-zinc-200 border-b pb-3 uppercase tracking-wider">
              Application Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Language Card */}
              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-zinc-950/40 flex justify-between items-center gap-4 text-left">
                <div>
                  <span className="text-xs font-black block">Active Language</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-normal">Toggle vocabulary</span>
                </div>
                <button
                  id="profile-lang-btn"
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg border text-xs font-bold cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
                </button>
              </div>

              {/* Theme Card */}
              <div className="p-4 rounded-xl border bg-slate-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-left col-span-1 sm:col-span-2">
                <div>
                  <span className="text-xs font-black block">Application Theme Mode</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-normal">Choose Light, Dark, or System Sync</span>
                </div>
                <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/50 dark:border-zinc-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                      theme === 'light'
                        ? 'bg-white dark:bg-zinc-850 text-slate-800 dark:text-zinc-100 shadow-xs border border-slate-200/30 dark:border-zinc-700/50'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-zinc-850 text-slate-800 dark:text-zinc-100 shadow-xs border border-slate-200/30 dark:border-zinc-700/50'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                      theme === 'system'
                        ? 'bg-white dark:bg-zinc-850 text-slate-800 dark:text-zinc-100 shadow-xs border border-slate-200/30 dark:border-zinc-700/50'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-teal-500" />
                    <span>System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
