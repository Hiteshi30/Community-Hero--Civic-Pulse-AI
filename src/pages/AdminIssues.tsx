import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, ShieldAlert, Check, X, ArrowRight, CornerDownRight, 
  MapPin, Clock, User, BrainCircuit, Sparkles, Send, SlidersHorizontal,
  Grid, List, ArrowUpDown, ChevronRight, CheckCircle2, MessageSquare,
  AlertTriangle, Hammer, Shield, RefreshCw, FileText, UserCheck, 
  FolderSync, Image as ImageIcon, Volume2, Eye
} from 'lucide-react';
import { Complaint, IssueStatus, IssuePriority, IssueSeverity, TimelineEvent } from '../types';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Comment {
  id: string;
  userName: string;
  role: string;
  content: string;
  createdAt: string;
}

export const AdminIssues: React.FC = () => {
  const { user, complaints, updateComplaintStatus, showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const focusId = searchParams.get('id');

  // View mode & Filtering states
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | 'All'>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<IssueSeverity | 'All'>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All'); // All, Today, Last Week
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'priority-desc' | 'verifications-desc'>('date-desc');
  
  // Drawer / Side Panel Focus
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  
  // Interactive UI workflows inside Side Panel
  const [transitStatus, setTransitStatus] = useState<IssueStatus>('ASSIGNED');
  const [resolutionNote, setResolutionNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedDepartmentTransfer, setSelectedDepartmentTransfer] = useState('');
  const [simulatedResolutionImage, setSimulatedResolutionImage] = useState<string | null>(null);

  // Wards and Department options for filters
  const wards = ['Connaught Place', 'Karol Bagh', 'Saket District', 'Chandni Chowk', 'Dwarka Sector 6'];
  const departmentsList = [
    'Sanitation & Waste Management',
    'Water Supply & Sewage',
    'Roads & Infrastructure',
    'Electricity & Street Lighting',
    'Public Health & Pollution Control',
    'Public Safety & Civic Order'
  ];

  // Officers list for assignment
  const officers = [
    { name: 'Smt. Priya Srinivasan', role: 'Water Systems Inspector' },
    { name: 'Shri Amit Deshmukh', role: 'Infrastructure Supervisor' },
    { name: 'Dr. Suresh Mishra, IAS', role: 'Sanitation Commissioner' },
    { name: 'Shri Ramesh Kumar', role: 'Electricity Ward Officer' },
    { name: 'Dr. Anita Roy', role: 'Health & Pollution Lead' }
  ];

  // Auto-focus matching complaint if present in URL search param
  useEffect(() => {
    if (focusId && complaints.length > 0) {
      const match = complaints.find(c => c.id === focusId);
      if (match) {
        handleSelectComplaint(match);
      }
    }
  }, [focusId, complaints]);

  const handleSelectComplaint = (comp: Complaint) => {
    setActiveComplaint(comp);
    setTransitStatus(getNextSuggestedStatus(comp.status));
    setSelectedAssignee(comp.assignedOfficerName || '');
    setSelectedDepartmentTransfer(comp.department);
    setSimulatedResolutionImage(null);
    setActivePlan(null);

    // Populate mock comments specific to the issue
    setComments([
      {
        id: 'c1',
        userName: 'AI Dispatcher CivicPulse',
        role: 'AI System Audit',
        content: `Duplicate detection pass completed. Coordinates verified within 15 meters of existing assets. Assigned priority ${comp.priority}.`,
        createdAt: new Date(new Date(comp.createdAt).getTime() + 10 * 60 * 1000).toISOString()
      },
      ...(comp.status === 'RESOLVED' ? [
        {
          id: 'c2',
          userName: comp.assignedOfficerName || 'Field Supervisor',
          role: 'Officer',
          content: 'Work successfully completed on site. Post-resolution quality check verified and logged.',
          createdAt: comp.updatedAt
        }
      ] : [])
    ]);
  };

  const getNextSuggestedStatus = (curr: IssueStatus): IssueStatus => {
    if (curr === 'SUBMITTED') return 'ASSIGNED';
    if (curr === 'VERIFIED') return 'ASSIGNED';
    if (curr === 'ASSIGNED') return 'IN_PROGRESS';
    if (curr === 'IN_PROGRESS') return 'RESOLVED';
    return 'RESOLVED';
  };

  // Advanced Filtering logic
  const cityComplaints = complaints.filter(
    c => c.city.toLowerCase() === (user?.city || 'Delhi').toLowerCase()
  );

  const filteredComplaints = cityComplaints.filter(comp => {
    const matchStatus = selectedStatus === 'All' || comp.status === selectedStatus;
    const matchPriority = selectedPriority === 'All' || comp.priority === selectedPriority;
    const matchSeverity = selectedSeverity === 'All' || comp.severity === selectedSeverity;
    
    const matchWard = selectedWard === 'All' || comp.address.toLowerCase().includes(selectedWard.toLowerCase());
    const matchDept = selectedDept === 'All' || comp.department === selectedDept;

    let matchDate = true;
    if (selectedDate === 'Today') {
      const today = new Date().toDateString();
      matchDate = new Date(comp.createdAt).toDateString() === today;
    } else if (selectedDate === 'LastWeek') {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      matchDate = new Date(comp.createdAt).getTime() >= oneWeekAgo;
    }

    const matchSearch = searchQuery === '' || 
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchPriority && matchSeverity && matchWard && matchDept && matchDate && matchSearch;
  });

  // Sorting logic
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'priority-desc') {
      const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (weight[b.priority] || 0) - (weight[a.priority] || 0);
    }
    if (sortBy === 'verifications-desc') return b.verificationCount - a.verificationCount;
    return 0;
  });

  // Action: Add Comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const fresh: Comment = {
      id: `comm_${Date.now()}`,
      userName: user?.name || 'Officer',
      role: 'Officer',
      content: newComment,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, fresh]);
    setNewComment('');
    showToast('Internal note logged to case file.', 'success');
  };

  // Action: Submit Status Transition & Notes
  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !resolutionNote.trim()) {
      showToast('Please specify detailed field resolution notes.', 'error');
      return;
    }

    setUpdating(true);
    try {
      await updateComplaintStatus(activeComplaint.id, transitStatus, resolutionNote);
      
      // Update local state in view
      const updatedTimelineEvent: TimelineEvent = {
        status: transitStatus,
        timestamp: new Date().toISOString(),
        note: resolutionNote,
        updatedBy: user?.name || 'Officer'
      };

      const revised: Complaint = {
        ...activeComplaint,
        status: transitStatus,
        timeline: [...activeComplaint.timeline, updatedTimelineEvent],
        assignedOfficerId: user?.uid || 'officer_priya',
        assignedOfficerName: user?.name || 'Smt. Priya Srinivasan',
        updatedAt: new Date().toISOString()
      };

      if (simulatedResolutionImage) {
        revised.images = [simulatedResolutionImage, ...revised.images];
      }

      setActiveComplaint(revised);
      setResolutionNote('');
      showToast(`Status successfully updated to ${transitStatus}!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Error saving status updates.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Action: Self Assign / Reassign Officer
  const handleAssignOfficer = async (name: string) => {
    if (!activeComplaint) return;
    try {
      const docRef = doc(db, 'complaints', activeComplaint.id);
      await updateDoc(docRef, {
        assignedOfficerName: name,
        assignedOfficerId: 'officer_reassigned',
        updatedAt: new Date().toISOString()
      });

      setActiveComplaint(prev => prev ? {
        ...prev,
        assignedOfficerName: name,
        assignedOfficerId: 'officer_reassigned'
      } : null);

      showToast(`Assigned to ${name} successfully!`, 'success');
    } catch (error) {
      // Fallback
      setActiveComplaint(prev => prev ? {
        ...prev,
        assignedOfficerName: name,
        assignedOfficerId: 'officer_reassigned'
      } : null);
      showToast(`Assigned to ${name} (Local cached state)`, 'info');
    }
  };

  // Action: Transfer Department
  const handleTransferDepartment = async (dept: string) => {
    if (!activeComplaint) return;
    try {
      const docRef = doc(db, 'complaints', activeComplaint.id);
      await updateDoc(docRef, {
        department: dept,
        updatedAt: new Date().toISOString()
      });

      setActiveComplaint(prev => prev ? { ...prev, department: dept } : null);
      showToast(`Case re-routed to ${dept}!`, 'success');
    } catch (error) {
      setActiveComplaint(prev => prev ? { ...prev, department: dept } : null);
      showToast(`Re-routed to ${dept} (Local cached state)`, 'info');
    }
  };

  // Action: Escalate Immediately to CRITICAL
  const handleEscalateImmediate = async () => {
    if (!activeComplaint) return;
    try {
      const docRef = doc(db, 'complaints', activeComplaint.id);
      await updateDoc(docRef, {
        priority: 'CRITICAL',
        severity: 'CRITICAL',
        updatedAt: new Date().toISOString()
      });

      setActiveComplaint(prev => prev ? { ...prev, priority: 'CRITICAL', severity: 'CRITICAL' } : null);
      showToast('⚠️ Case escalated to CRITICAL priority!', 'success');
    } catch (error) {
      setActiveComplaint(prev => prev ? { ...prev, priority: 'CRITICAL', severity: 'CRITICAL' } : null);
      showToast('⚠️ Escalated (Local cached state)', 'info');
    }
  };

  // Action: Merge Duplicates Simulator
  const handleMergeDuplicates = () => {
    if (!activeComplaint) return;
    showToast('🔍 Scanning coordinates for overlapping reports...', 'info');
    setTimeout(() => {
      showToast('✨ Found 1 nearby redundant submission. Successfully merged and archived duplicate ledger entry.', 'success');
      
      const audit: Comment = {
        id: `audit_${Date.now()}`,
        userName: 'CivicPulse AI Audit',
        role: 'AI System Audit',
        content: 'Overlap detection matched 1 duplicate report within 25 meters. Entries consolidated under this primary case file.',
        createdAt: new Date().toISOString()
      };
      setComments(prev => [...prev, audit]);
    }, 1500);
  };

  // Action: Notify Citizen Simulator
  const handleNotifyCitizen = () => {
    if (!activeComplaint) return;
    showToast(`📱 SMS & WhatsApp alert dispatched to citizen ${activeComplaint.reporterName}!`, 'success');
  };

  // Action: Simulated Repair Photo Upload
  const handleSimulateRepairPhoto = () => {
    // Elegant urban repair mock image
    const repairImages = [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'
    ];
    const picked = repairImages[Math.floor(Math.random() * repairImages.length)];
    setSimulatedResolutionImage(picked);
    showToast('📸 Post-repair photographic proof attached successfully!', 'success');
  };

  // Action: Trigger AI Resolution Planner Agent
  const triggerAIResolutionPlanner = () => {
    if (!activeComplaint) return;
    setLoadingPlan(true);
    showToast('🧠 Resolution Planning Agent synthesizing logistics...', 'info');

    setTimeout(() => {
      // High-grade synthesized repair blueprint
      const isRoad = activeComplaint.department.includes('Roads');
      const isWater = activeComplaint.department.includes('Water') || activeComplaint.department.includes('Sewage');
      const isSWM = activeComplaint.department.includes('Sanitation');

      const generatedPlan = {
        title: 'AI Multi-Step Action Blueprint',
        manpower: isRoad ? '4 Asphalt Mechanics, 1 Safety Flagman' : isWater ? '2 Hydraulic Engineers, 2 Trench Diggers' : '3 Sanitation Crew Members',
        equipment: isRoad ? '1 Diesel Compactor, Cold-mix asphalt bags' : isWater ? 'High-pressure Jetting Pump, Pipe-wrapping sealers' : 'Dumper Loader truck, Disinfectant spray kit',
        budget: isRoad ? '₹14,500 INR' : isWater ? '₹8,200 INR' : '₹3,500 INR',
        timeline: isRoad ? '4 Hours from dispatch' : isWater ? '3 Hours from dispatch' : '1.5 Hours from dispatch',
        risks: isRoad ? 'Local traffic blocking; high heat reduces asphalt binding rate.' : isWater ? 'Localized flooding of electrical conduits nearby.' : 'Animal interference (street dogs dispersing raw litter heap).',
        steps: [
          'Erect high-visibility orange cones and barricade coordinates immediately.',
          'Clean out surface contaminants, stagnant mud, or loose gravel.',
          isRoad ? 'Pour high-viscosity binding primer then compact asphalt layers.' : isWater ? 'Siphon standing backwater, deploy hydraulic line block, and seal joints.' : 'Siphon raw heaps into loader bed and apply neutralizer chemicals.',
          'Upload visual proof coordinate confirmation to trigger automatic citizen completion alert.'
        ]
      };

      setActivePlan(generatedPlan);
      setLoadingPlan(false);
      showToast('✨ AI Repair Plan generated successfully!', 'success');
    }, 1800);
  };

  const statusColors = {
    SUBMITTED: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    VERIFIED: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900',
    ASSIGNED: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900',
    IN_PROGRESS: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
    RESOLVED: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900',
    REJECTED: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900',
  };

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border p-6 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-zinc-100">Smart City Work Orders</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Audit, assign, escalate, and update field resolutions with AI-assisted decision intelligence.</p>
        </div>

        {/* View Switcher and Count */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-zinc-900 border px-3 py-1.5 rounded-xl">
            {filteredComplaints.length} Records Loaded
          </span>

          <div className="flex bg-slate-50 dark:bg-zinc-900 p-1 rounded-xl border">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'card' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-zinc-300">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span>Advanced Diagnostic Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Status Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="All">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* 2. Priority Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="All">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* 3. Severity Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="All">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* 4. Ward Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Ward Locality</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="All">All Wards</option>
              {wards.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* 5. Department Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="All">All Departments</option>
              {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* 6. Date Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Timeline</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="All">All Time</option>
              <option value="Today">Reported Today</option>
              <option value="LastWeek">Reported This Week</option>
            </select>
          </div>

          {/* 7. Sort Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-zinc-300"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="priority-desc">Priority: High to Low</option>
              <option value="verifications-desc">Most Endorsements</option>
            </select>
          </div>
        </div>

        {/* Global Search box */}
        <div className="flex gap-2 items-center p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-xl max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            id="admin-issues-search-diagnostics"
            type="text"
            placeholder="Search by ID, title, street description or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-zinc-200 w-full"
          />
        </div>
      </div>

      {/* CORE VIEW LAYOUT (TABLE OR CARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main List Column */}
        <div className={`${activeComplaint ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {sortedComplaints.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-400 bg-white dark:bg-zinc-900 border border-dashed rounded-3xl">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-extrabold text-slate-500">No matching active cases found.</p>
              <p className="text-[10px] text-slate-400 mt-1">Adjust search parameters or status filters.</p>
            </div>
          ) : viewMode === 'table' ? (
            /* COMPACT TABLE VIEW */
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-850 text-[10px] uppercase font-black tracking-wider text-slate-400">
                      <th className="p-4">Case Details</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Ward Location</th>
                      <th className="p-4 text-center">Priority</th>
                      <th className="p-4 text-center">Severity</th>
                      <th className="p-4 text-center">Votes</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-850">
                    {sortedComplaints.map((comp) => {
                      const isSelected = activeComplaint?.id === comp.id;
                      return (
                        <tr
                          id={`tr-comp-${comp.id}`}
                          key={comp.id}
                          onClick={() => handleSelectComplaint(comp)}
                          className={`cursor-pointer transition-colors group ${
                            isSelected 
                              ? 'bg-indigo-50/25 dark:bg-indigo-950/10 border-l-4 border-l-indigo-600' 
                              : 'hover:bg-slate-50/60 dark:hover:bg-zinc-850/50'
                          }`}
                        >
                          {/* Case details info */}
                          <td className="p-4 max-w-[200px]">
                            <div className="flex gap-3">
                              <img src={comp.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 bg-slate-100" />
                              <div className="space-y-0.5 truncate">
                                <span className="font-mono text-[9px] text-slate-400 block font-bold group-hover:text-indigo-600">#{comp.id.slice(-6)}</span>
                                <span className="font-extrabold text-slate-800 dark:text-zinc-100 block truncate leading-tight">{comp.title}</span>
                              </div>
                            </div>
                          </td>

                          {/* Dept */}
                          <td className="p-4 text-slate-500 font-bold dark:text-zinc-400 text-[11px] truncate max-w-[140px]">
                            {comp.department}
                          </td>

                          {/* Ward */}
                          <td className="p-4 text-slate-400 font-bold text-[11px] truncate max-w-[140px]">
                            {comp.address.split(',')[0]}
                          </td>

                          {/* Priority badge */}
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide ${
                              comp.priority === 'CRITICAL' ? 'bg-red-50 text-red-600 dark:bg-red-950/30' :
                              comp.priority === 'HIGH' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20' :
                              comp.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-slate-50 text-slate-600'
                            }`}>
                              {comp.priority}
                            </span>
                          </td>

                          {/* Severity badge */}
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide ${
                              comp.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 dark:bg-red-950/30' :
                              comp.severity === 'HIGH' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20' :
                              comp.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-slate-50 text-slate-600'
                            }`}>
                              {comp.severity}
                            </span>
                          </td>

                          {/* Votes */}
                          <td className="p-4 text-center font-mono font-black text-slate-600 dark:text-zinc-300">
                            {comp.verificationCount}
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${statusColors[comp.status]}`}>
                              {comp.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* RICH VISUAL CARD GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedComplaints.map((comp) => {
                const isSelected = activeComplaint?.id === comp.id;
                return (
                  <div
                    id={`card-comp-${comp.id}`}
                    key={comp.id}
                    onClick={() => handleSelectComplaint(comp)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-4 text-left ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/5 shadow-md'
                        : 'border-slate-100 bg-white dark:border-zinc-850 dark:bg-zinc-900/80 hover:bg-slate-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img src={comp.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100 shadow-xs" />
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border uppercase ${statusColors[comp.status]}`}>
                            {comp.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{new Date(comp.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 line-clamp-1">{comp.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{comp.address.split(',')[0]}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-50 dark:border-zinc-850 pt-3 text-[10px] font-bold text-slate-400">
                      <span>{comp.department.split(' ')[0]}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${comp.priority === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} />
                        <span>{comp.priority} PRIORITY</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Slide Panel Column */}
        {activeComplaint && (
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 p-6 rounded-3xl shadow-lg space-y-6 max-h-[85vh] overflow-y-auto relative">
            
            {/* Close detail panel absolute button */}
            <button
              onClick={() => setActiveComplaint(null)}
              className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950 dark:hover:bg-zinc-850 rounded-full text-slate-400 border transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>

            {/* HEADER METADATA */}
            <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 pr-6">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[9px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-zinc-950 px-2 py-0.5 rounded-md">
                  CASE #{activeComplaint.id.slice(-8).toUpperCase()}
                </span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${statusColors[activeComplaint.status]}`}>
                  {activeComplaint.status}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-zinc-100 leading-tight">{activeComplaint.title}</h3>
              <p className="text-[10px] text-indigo-500 font-extrabold mt-1 uppercase">{activeComplaint.department}</p>
            </div>

            {/* VISUAL EVIDENCE MEDIA & GIS POSITION */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden aspect-video border bg-slate-50 relative group">
                <img src={simulatedResolutionImage || activeComplaint.images[0]} alt="Complaint Evidence" className="w-full h-full object-cover" />
                {simulatedResolutionImage && (
                  <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                    REPAIR ATTACHED
                  </span>
                )}
              </div>
              <div className="p-3.5 bg-slate-50/50 dark:bg-zinc-950/40 border rounded-xl text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">WGS84 GPS Position</span>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 line-clamp-2 leading-relaxed">{activeComplaint.address}</p>
                </div>
                <span className="text-[9px] text-slate-400 block font-mono">
                  {activeComplaint.latitude.toFixed(5)}° N, {activeComplaint.longitude.toFixed(5)}° E
                </span>
              </div>
            </div>

            {/* CITIZEN INFORMANT PANEL */}
            <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/40 border rounded-2xl text-left flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {activeComplaint.reporterName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase">Citizen Informant</span>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">{activeComplaint.reporterName}</p>
                </div>
              </div>
              <button
                onClick={handleNotifyCitizen}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-zinc-900 border text-[9px] font-black text-slate-600 dark:text-zinc-300 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Dispatch Alert</span>
              </button>
            </div>

            {/* CASE NARRATIVE */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Description Log</span>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-950/40 p-4 border rounded-2xl">
                {activeComplaint.description}
              </p>
            </div>

            {/* AI PRE-DISPATCH TRIAGE */}
            {activeComplaint.aiAnalysis && (
              <div className="p-4 rounded-2xl bg-purple-50/30 dark:bg-purple-950/5 border border-purple-100/60 dark:border-zinc-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-purple-700 dark:text-purple-400">
                    <BrainCircuit className="w-4 h-4" />
                    <span>AI Dispatch Diagnostics</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono font-black rounded">
                    {activeComplaint.aiAnalysis.confidenceScore}% Acc
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 leading-relaxed text-left">{activeComplaint.aiAnalysis.summary}</p>
                <div className="flex justify-between items-center text-[10px] font-bold border-t border-purple-100/50 dark:border-zinc-800 pt-2 text-slate-500">
                  <span>Sentiment: {activeComplaint.aiAnalysis.detectedSentiment}</span>
                  <span className="text-purple-600 dark:text-purple-400 uppercase">Suggested: {activeComplaint.aiAnalysis.recommendedDepartment.split(' ')[0]}</span>
                </div>
              </div>
            )}

            {/* AI RESOLUTION ACTION PLANNER (ON DEMAND AGENT) */}
            <div className="border border-purple-100/60 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-purple-50/20 dark:bg-zinc-950/60 flex justify-between items-center border-b dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-xs font-black text-slate-800 dark:text-zinc-100">AI Resolution Planning Agent</span>
                </div>
                {!activePlan && (
                  <button
                    onClick={triggerAIResolutionPlanner}
                    disabled={loadingPlan}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] rounded-lg shadow-xs"
                  >
                    {loadingPlan ? 'Synthesizing...' : 'Synthesize Blueprint'}
                  </button>
                )}
              </div>

              {activePlan && (
                <div className="p-4 bg-white dark:bg-zinc-900 text-xs space-y-3.5 text-left border-t">
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <span className="text-slate-400 font-bold block">RECOMMENDED CREW</span>
                      <span className="font-extrabold text-slate-700 dark:text-zinc-200">{activePlan.manpower}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">ESTIMATED COST</span>
                      <span className="font-extrabold text-slate-700 dark:text-zinc-200">{activePlan.budget}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">SPECIAL EQUIPMENT</span>
                      <span className="font-extrabold text-slate-700 dark:text-zinc-200">{activePlan.equipment}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">ESTIMATED WORK TIME</span>
                      <span className="font-extrabold text-slate-700 dark:text-zinc-200">{activePlan.timeline}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950 rounded-xl">
                    <span className="text-[8px] font-black text-rose-700 uppercase tracking-widest block">Mitigate Risk</span>
                    <span className="text-[10px] text-slate-600 dark:text-zinc-300 font-semibold">{activePlan.risks}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Sequence Instructions</span>
                    <ul className="space-y-1.5 text-[10px] font-bold">
                      {activePlan.steps.map((st: string, i: number) => (
                        <li key={i} className="flex gap-2 text-slate-600 dark:text-zinc-300">
                          <span className="w-4 h-4 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 flex items-center justify-center shrink-0">{i+1}</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ADMISTRATIVE QUICK OPERATION BOX */}
            <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/40 border rounded-2xl space-y-3.5 text-left">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Operational Action Controls</span>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-black">
                {/* 1. Self Assign / Dropdown */}
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[9px]">ASSIGN SUPERVISOR</span>
                  <select
                    value={selectedAssignee}
                    onChange={(e) => handleAssignOfficer(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border rounded-lg outline-none font-bold text-slate-700 dark:text-zinc-300 text-[10px]"
                  >
                    <option value="">Awaiting Assignee</option>
                    {officers.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                {/* 2. Route Department */}
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[9px]">TRANSFER ROUTING</span>
                  <select
                    value={selectedDepartmentTransfer}
                    onChange={(e) => handleTransferDepartment(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border rounded-lg outline-none font-bold text-slate-700 dark:text-zinc-300 text-[10px]"
                  >
                    {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Advanced Actions Row */}
              <div className="flex gap-2 flex-wrap text-[9px] font-black pt-2 border-t dark:border-zinc-850">
                <button
                  onClick={handleEscalateImmediate}
                  disabled={activeComplaint.priority === 'CRITICAL'}
                  className="px-2.5 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/10 dark:border-rose-900 rounded-lg hover:bg-rose-100 flex items-center gap-1 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Escalate SLA</span>
                </button>

                <button
                  onClick={handleMergeDuplicates}
                  className="px-2.5 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/10 dark:border-indigo-900 rounded-lg hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                >
                  <FolderSync className="w-3 h-3 shrink-0" />
                  <span>Merge Duplicates</span>
                </button>

                <button
                  onClick={handleSimulateRepairPhoto}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 border rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ImageIcon className="w-3 h-3 shrink-0 text-slate-500" />
                  <span>Attach Repair Proof</span>
                </button>
              </div>
            </div>

            {/* PROMOTE STATUS RESOLUTION STEP */}
            <form onSubmit={handleUpdateStatusSubmit} className="p-4 bg-slate-50 dark:bg-zinc-950 border rounded-2xl space-y-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Promote Resolution SLA</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Phase</label>
                  <select
                    value={transitStatus}
                    onChange={(e) => setTransitStatus(e.target.value as IssueStatus)}
                    className="w-full px-2.5 py-2 rounded-xl border bg-white dark:bg-zinc-900 text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none"
                  >
                    <option value="ASSIGNED">ASSIGNED (Work Order)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Crew Dispatch)</option>
                    <option value="RESOLVED">RESOLVED (Close Case)</option>
                    <option value="REJECTED">REJECTED (Invalid)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Notes & Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Cleared blocking backwater..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border bg-white dark:bg-zinc-900 text-xs text-slate-700 dark:text-zinc-300 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1 shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{updating ? 'Saving Work...' : 'Promote Status & Log Timeline'}</span>
              </button>
            </form>

            {/* AUDIT CASE TIMELINE LOGS */}
            <div className="space-y-3.5 text-left">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Work Audit Timeline</span>
              <div className="space-y-3 border-l-2 border-slate-100 dark:border-zinc-800 pl-4 text-xs">
                {activeComplaint.timeline.map((evt, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-zinc-900" />
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-700 dark:text-zinc-200 capitalize">{evt.status.toLowerCase().replace('_', ' ')}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{new Date(evt.timestamp).toLocaleDateString()} at {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-semibold">{evt.note}</p>
                    <span className="text-[9px] text-slate-400 font-extrabold block uppercase">By {evt.updatedBy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CASE INTERNAL COMMENTS NOTES FEED */}
            <div className="space-y-3 text-left pt-3 border-t dark:border-zinc-850">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Internal Case Discussion notes</span>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {comments.map((comm) => (
                  <div key={comm.id} className="p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 text-left space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-black text-slate-700 dark:text-zinc-300">{comm.userName}</span>
                      <span className="text-slate-400 font-mono text-[9px]">{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-wider block">{comm.role}</span>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal font-semibold">{comm.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type an internal note / supervisor instruction..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-xs outline-none text-slate-800 dark:text-zinc-200 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
