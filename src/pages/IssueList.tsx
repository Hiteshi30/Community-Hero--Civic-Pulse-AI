import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapComponent } from '../components/MapComponent';
import { 
  Search, ShieldAlert, ThumbsUp, MessageSquare, Clock, 
  MapPin, User, ChevronRight, CornerDownRight, Check, X,
  BrainCircuit, Sparkles, Send, Sparkle, FileText, Download, Share2, Edit2, Calendar
} from 'lucide-react';
import { Complaint, IssueStatus, Comment } from '../types';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { downloadComplaintReport } from '../lib/downloadHelper';

export const IssueList: React.FC = () => {
  const { user, complaints, upvoteComplaint, addComment, showToast, t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const focusId = searchParams.get('id');

  // Interactive filters
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  // Selected complaint for deep analytical review drawer
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>([]);

  // Editing mode states (for citizen edit prior to review)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Auto-focus selected complaint if URL contains focus ID
  useEffect(() => {
    if (focusId && complaints.length > 0) {
      const match = complaints.find(c => c.id === focusId);
      if (match) {
        setSelectedComplaint(match);
      }
    }
  }, [focusId, complaints]);

  // Sync comments for selected complaint
  useEffect(() => {
    if (!selectedComplaint?.id) {
      setCommentsList([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'comments'),
        where('complaintId', '==', selectedComplaint.id),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: Comment[] = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as Comment));
        setCommentsList(list);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Comments offline', e);
    }
  }, [selectedComplaint?.id]);

  // Reset edit state when selected complaint changes
  useEffect(() => {
    setIsEditing(false);
    if (selectedComplaint) {
      setEditTitle(selectedComplaint.title);
      setEditDesc(selectedComplaint.description);
    }
  }, [selectedComplaint?.id]);

  // Filtering calculations
  const filteredComplaints = complaints.filter((comp) => {
    const matchDept = selectedDept === 'All' || comp.department === selectedDept;
    const matchStatus = selectedStatus === 'All' || comp.status === selectedStatus;
    const matchSearch = searchQuery === '' || 
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Proximity/City context filter
    const matchCity = comp.city.toLowerCase() === (user?.city || 'Delhi').toLowerCase();
    
    // Submissions filter toggle
    const matchViewMode = viewMode === 'all' || comp.reporterId === user?.uid;

    return matchDept && matchStatus && matchSearch && matchCity && matchViewMode;
  });

  const handleUpvote = async (comp: Complaint) => {
    try {
      await upvoteComplaint(comp.id);
      setSelectedComplaint(prev => prev && prev.id === comp.id 
        ? { ...prev, upvoters: [...prev.upvoters, user?.uid || ''], verificationCount: prev.verificationCount + 1 }
        : prev
      );
      showToast('👍 Verification recorded successfully! +15 Civic points gained.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedComplaint) return;

    try {
      await addComment(selectedComplaint.id, commentInput);
      setCommentInput('');
      showToast('💬 Comment posted successfully to ward forum!', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  // Live edit of report title/description (before officer review)
  const handleSaveReportEdit = async () => {
    if (!selectedComplaint) return;
    if (!editTitle.trim() || !editDesc.trim()) {
      showToast('Fields cannot be left blank.', 'error');
      return;
    }

    setSavingEdit(true);
    try {
      const docRef = doc(db, 'complaints', selectedComplaint.id);
      await updateDoc(docRef, {
        title: editTitle,
        description: editDesc,
        updatedAt: new Date().toISOString()
      });

      setSelectedComplaint(prev => prev ? {
        ...prev,
        title: editTitle,
        description: editDesc,
        updatedAt: new Date().toISOString()
      } : null);

      setIsEditing(false);
      showToast('✨ Complaint updated successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error saving changes offline/online.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const statusColors = {
    SUBMITTED: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    VERIFIED: 'bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900',
    ASSIGNED: 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900',
    IN_PROGRESS: 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
    RESOLVED: 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900',
    REJECTED: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900',
  };

  return (
    <div className="space-y-6 relative h-full">
      
      {/* Filters & Header block */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border">
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl font-black tracking-tight">{t('all_issues')}</h2>
          <p className="text-[11px] text-slate-500 font-medium">Browse active issues, track dispatch progress, or inspect nearby hotspots.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode selection */}
          <div className="flex bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl">
            <button
              id="view-mode-all-btn"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Nearby Issues
            </button>
            <button
              id="view-mode-my-btn"
              onClick={() => setViewMode('my')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'my' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Reports
            </button>
          </div>

          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl w-60 shadow-inner">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              id="list-search-box"
              type="text"
              placeholder="Search address or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-zinc-200 w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories chips filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {['All', 'Sanitation & Waste Management', 'Water Supply & Sewage', 'Roads & Infrastructure', 'Electricity & Street Lighting', 'Public Health & Pollution Control', 'Public Safety & Civic Order'].map(dept => (
          <button
            id={`chip-filter-${dept.replace(/\s+/g, '-').toLowerCase()}`}
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedDept === dept
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:bg-slate-100'
            }`}
          >
            {dept === 'All' ? 'All Departments' : dept.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Double columns map list framework */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column (2 spans): Complaints Catalog */}
        <div className="lg:col-span-2 space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredComplaints.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-zinc-900 border rounded-2xl flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-slate-300" />
              <p className="font-semibold">No reported complaints match your filters.</p>
              <p className="text-[10px]">Be the first to file a verified issue in your ward sector!</p>
            </div>
          ) : (
            filteredComplaints.map((comp) => {
              const isSelected = selectedComplaint?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => {
                    setSelectedComplaint(comp);
                    setSearchParams({ id: comp.id });
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 shadow-sm'
                      : 'border-slate-100 bg-white dark:border-zinc-900 dark:bg-zinc-900/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <img src={comp.images[0]} alt={comp.title} className="w-16 h-16 rounded-xl object-cover bg-slate-200 shadow-xs shrink-0" />
                    <div className="space-y-1 overflow-hidden flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${statusColors[comp.status]}`}>
                          {comp.status}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">{new Date(comp.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 line-clamp-1">{comp.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{comp.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 border-t border-slate-100 dark:border-zinc-800/80 pt-2 text-[10px] text-slate-400 font-bold">
                    <span>{comp.department.split(' ')[0]}</span>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" /> {comp.verificationCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column (3 spans): High resolution map */}
        <div className="lg:col-span-3">
          <MapComponent
            complaints={filteredComplaints}
            selectedCity={user?.city || 'Delhi'}
            onSelectComplaint={(c) => {
              setSelectedComplaint(c);
              setSearchParams({ id: c.id });
            }}
            interactiveMode="view"
          />
        </div>
      </div>

      {/* ================= analytical DETAILS DRAWER OVERLAY ================= */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 h-full overflow-y-auto shadow-2xl p-6 md:p-8 flex flex-col justify-between text-left">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusColors[selectedComplaint.status]}`}>
                    {selectedComplaint.status}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900">
                    {selectedComplaint.priority} Priority
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Edit Button (Enabled only for reporter and if status is SUBMITTED) */}
                  {selectedComplaint.reporterId === user?.uid && selectedComplaint.status === 'SUBMITTED' && (
                    <button
                      id="drawer-edit-trigger"
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-1.5 rounded-lg border text-indigo-500 hover:bg-slate-50 transition-colors flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Cancel Edit' : 'Edit Report'}</span>
                    </button>
                  )}

                  <button 
                    id="close-drawer-btn"
                    onClick={() => {
                      setSelectedComplaint(null);
                      setSearchParams({});
                    }} 
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main content body */}
              <div className="space-y-5">
                
                {isEditing ? (
                  // Editing Sub-form
                  <div className="space-y-4 p-4 border-2 border-indigo-200 rounded-2xl bg-indigo-50/5 text-left">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">Modify submitted report</span>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold uppercase text-slate-400">Title</label>
                      <input
                        id="drawer-edit-title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border text-xs rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold uppercase text-slate-400">Description</label>
                      <textarea
                        id="drawer-edit-desc"
                        rows={4}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border text-xs rounded-xl outline-none resize-none"
                      />
                    </div>

                    <button
                      id="drawer-edit-save-btn"
                      onClick={handleSaveReportEdit}
                      disabled={savingEdit}
                      className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      {savingEdit ? 'Saving changes...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  // Normal detail view
                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">{selectedComplaint.title}</h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>{selectedComplaint.address}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>By: <span className="text-slate-700 dark:text-zinc-300 font-bold">{selectedComplaint.reporterName}</span></span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Evidence Image */}
                <div className="rounded-xl overflow-hidden aspect-video border bg-slate-100 dark:border-zinc-800 shadow-inner">
                  <img src={selectedComplaint.images[0]} alt="Complaint proof" className="w-full h-full object-cover" />
                </div>

                {/* Main description description body */}
                {!isEditing && (
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-900/40 p-4 rounded-xl border">
                    {selectedComplaint.description}
                  </p>
                )}
              </div>

              {/* Advanced AI intel report (if stored) */}
              {selectedComplaint.aiIntelReport && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-purple-50/10 to-white dark:from-zinc-900 dark:to-zinc-950 border border-indigo-100 dark:border-zinc-800 text-left space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1">
                      <BrainCircuit className="w-4 h-4 text-indigo-500" />
                      <span>AI Intel Classifier Report</span>
                    </span>
                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-medium">
                    {selectedComplaint.aiIntelReport.professionalDescription}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[10px] font-bold">
                    <div className="p-2 bg-white dark:bg-zinc-900 border rounded-lg">
                      <span className="text-slate-400 text-[8px] block uppercase">Est. Cost SLA</span>
                      <span className="text-slate-700 dark:text-zinc-200">{selectedComplaint.aiIntelReport.estimatedRepairCost}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-zinc-900 border rounded-lg">
                      <span className="text-slate-400 text-[8px] block uppercase">Est. Resolution</span>
                      <span className="text-slate-700 dark:text-zinc-200">{selectedComplaint.aiIntelReport.estimatedResolutionTime}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-zinc-900 border rounded-lg">
                      <span className="text-slate-400 text-[8px] block uppercase">Public Risk</span>
                      <span className="text-slate-700 dark:text-zinc-200 line-clamp-1">{selectedComplaint.aiIntelReport.publicRisk}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Resolution Timeline */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Progress Timeline</h4>
                <div className="relative border-l-2 border-indigo-500/20 ml-3 pl-5 space-y-4">
                  {selectedComplaint.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-8 top-0.5 w-5 h-5 rounded-full bg-indigo-100 border-4 border-indigo-500 text-indigo-500 dark:bg-zinc-900 dark:border-indigo-400 flex items-center justify-center" />
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-800 dark:text-zinc-200">{item.status}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-500 dark:text-zinc-400 leading-normal text-[11px]">{item.note}</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">By: {item.updatedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action utilities bar: Upvoting, PDF receipts downloading, and social sharing */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border flex flex-wrap items-center justify-between gap-4">
                
                {/* Crowdsourcing Verify button */}
                {user?.role === 'citizen' && (
                  <div className="flex-1 min-w-[200px]">
                    {selectedComplaint.upvoters.includes(user.uid) ? (
                      <span className="px-3.5 py-2.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>You validated this issue</span>
                      </span>
                    ) : (
                      <button
                        id="drawer-verify-btn"
                        onClick={() => handleUpvote(selectedComplaint)}
                        className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Verify Coordinates (+15 pts)</span>
                      </button>
                    )}
                  </div>
                )}

                {/* PDF & Share action triggers */}
                <div className="flex items-center gap-2.5">
                  <button
                    id="drawer-download-pdf-btn"
                    onClick={() => {
                      if (selectedComplaint) {
                        downloadComplaintReport(selectedComplaint);
                        showToast('📥 Official complaint statement downloaded!', 'success');
                      } else {
                        showToast('No complaint selected.', 'error');
                      }
                    }}
                    className="p-2.5 bg-white dark:bg-zinc-900 border rounded-xl text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-colors cursor-pointer"
                    title="Download Receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    id="drawer-share-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(`CivicPulse Ticket: ${window.location.origin}/issues?id=${selectedComplaint.id}`);
                      showToast('📋 Copied complaint link to clipboard!', 'success');
                    }}
                    className="p-2.5 bg-white dark:bg-zinc-900 border rounded-xl text-slate-500 hover:text-indigo-500 hover:border-indigo-500 transition-colors cursor-pointer"
                    title="Share Complaint Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comment Thread forum section */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Community Ward Comments ({commentsList.length})</span>
                </h4>

                {user && (
                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                      id="drawer-comment-input"
                      type="text"
                      placeholder="Comment on this ward issue..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border text-xs outline-none text-slate-800 dark:text-zinc-200 focus:border-indigo-500"
                      required
                    />
                    <button
                      id="drawer-post-comment-btn"
                      type="submit"
                      className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-xs shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <div className="space-y-3.5 max-h-48 overflow-y-auto">
                  {commentsList.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">No comments yet. Start the community conversation.</p>
                  ) : (
                    commentsList.map(comm => (
                      <div key={comm.id} className="flex gap-3 text-xs items-start p-2.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100/60 dark:border-zinc-900 text-left">
                        <img src={comm.userAvatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                        <div className="space-y-1 overflow-hidden flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-700 dark:text-zinc-200">{comm.userName}</span>
                            <span className="text-[9px] px-1.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 capitalize">{comm.userRole}</span>
                            <span className="text-[9px] text-slate-400">{new Date(comm.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 dark:text-zinc-300 leading-normal">{comm.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
