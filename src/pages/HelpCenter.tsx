import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, BookOpen, ShieldAlert, Sparkles, Send, 
  ChevronDown, ChevronUp, Search, PhoneCall, Bot, CheckCircle 
} from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'faq' | 'citizen' | 'officer' | 'ai' | 'support'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');

  // Support form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Support ticket logged successfully! We will email you shortly.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  const faqs = [
    {
      q: "What is CivicPulse AI?",
      a: "CivicPulse AI is an advanced, multi-agent operations platform designed to bridge the gap between community members and municipal administrators. It uses autonomous AI Agents to catalog, deduplicate, prioritize, and dispatch infrastructure tickets seamlessly."
    },
    {
      q: "How does the citizen rewards point system work?",
      a: "Citizens earn 'Civic Points' by submitting valid infrastructure tickets, upvoting/verifying neighboring reports, and providing follow-ups. Points can be redeemed in the Rewards Hub for public transit passes, utility discounts, and municipal partner coupons."
    },
    {
      q: "What prevents citizens from submitting fake complaints?",
      a: "Our platform leverages high-trust multi-factor security: Computer Vision validates images, crowdsourced verification requires 5 neighbor upvotes to reach 'VERIFIED' status, and localized telemetry verifies GPS coordinates."
    },
    {
      q: "What is the City Health Index?",
      a: "The City Health Index is a live telemetry score calculated across all municipal wards. It analyzes resolution time SLAs, community sentiments, active emergency factors, and department backlogs to measure real-time municipal health."
    },
    {
      q: "How does the AI predict hotspots?",
      a: "The City Prediction Agent maps historical ticket frequencies against live meteorological feeds to warn departments about potential flash flood locations, sewer leak risk profiles, or streetlight blackouts before they escalate."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left pb-16">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-indigo-400" /> Help Center & Guides
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">
          Explore documentation, step-by-step roles, AI agent blueprints, or contact municipal administration support.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'faq' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </button>
        <button
          onClick={() => setActiveTab('citizen')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'citizen' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Citizen User Guide
        </button>
        <button
          onClick={() => setActiveTab('officer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'officer' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Officer Guide
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" /> AI Diagnostics Guide
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'support' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Contact Support
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 min-h-[350px]">
        
        {/* TAB 1: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-3.5">
              {filteredFaqs.length === 0 ? (
                <p className="text-zinc-500 text-xs py-8 text-center">No matching FAQs found.</p>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-zinc-850 bg-zinc-900/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center text-xs font-black text-white hover:bg-zinc-900/40 transition-all"
                    >
                      <span>{faq.q}</span>
                      {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-850/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CITIZEN GUIDE */}
        {activeTab === 'citizen' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-white border-b border-zinc-800 pb-2 uppercase tracking-wider">Citizen Operational Blueprint</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
                <span className="text-xs font-black text-indigo-400 font-mono">STEP 01</span>
                <h4 className="font-bold text-white">Report issues instantly</h4>
                <p className="text-zinc-400 leading-relaxed">
                  Navigate to "Report Issue". Upload an image of any localized structural or public safety issue. Our Vision Agent will auto-analyze the hazard and category.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
                <span className="text-xs font-black text-indigo-400 font-mono">STEP 02</span>
                <h4 className="font-bold text-white">Earn Rewards points</h4>
                <p className="text-zinc-400 leading-relaxed">
                  Earn points when you submit tickets, verify neighboring alerts, or provide feedback comments. Points can be exchanged in the Redeem panel.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
                <span className="text-xs font-black text-indigo-400 font-mono">STEP 03</span>
                <h4 className="font-bold text-white">Upvote Neighbors</h4>
                <p className="text-zinc-400 leading-relaxed">
                  Open the "Issues Map & List" to verify community reports. Crowd validation helps municipal departments schedule and dispatch crews faster.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFFICER GUIDE */}
        {activeTab === 'officer' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-white border-b border-zinc-800 pb-2 uppercase tracking-wider">Municipal Officer Guide</h2>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-zinc-900/20 border border-zinc-850 rounded-xl flex gap-4 items-start">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Leverage AI Triage Dispatch</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Review incoming tickets pre-sorted by the Priority Engine. Use the administrative settings slider to control upvote thresholds for automatically assigning priority weight criteria.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/20 border border-zinc-850 rounded-xl flex gap-4 items-start">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Verify Duplicate groupings</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Check the AI Operations Center tab regularly. Merge highly similar visual reports to prevent multiple repair vehicles from going to the exact same pothole.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/20 border border-zinc-850 rounded-xl flex gap-4 items-start">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Dispatch and Resolve SLAs</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Assign tickets to dedicated departments (Water, Roads, Sanitation, Lights), track repair status steps on the visual timeline, and close tickets with brief resolution descriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI GUIDE */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-white border-b border-zinc-800 pb-2 uppercase tracking-wider">AI Cognitive Agent Mechanics</h2>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our 10 Decentralized AI Agents run on lightweight edge loops. Image diagnostic pipelines analyze physical cracks, sewer pool contours, and rubbish piles. Natural Language processing scans community forums to measure community mood parameters in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                <h4 className="font-bold text-indigo-400 mb-1">Vision Diagnostic Parameters</h4>
                <p className="text-zinc-400 leading-relaxed">
                  Pixels are assessed using Convolutional filters. Edge classification categorizes asphalt damage, puddle sizing, and street lighting failures with over 94.2% accuracy.
                </p>
              </div>

              <div className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                <h4 className="font-bold text-indigo-400 mb-1">Dynamic Risk Scoring</h4>
                <p className="text-zinc-400 leading-relaxed">
                  The Priority Score represents a multi-factor risk assessment. It merges community density, traffic delays, hospital or school proximity, and storm telemetry.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT SUPPORT */}
        {activeTab === 'support' && (
          <form onSubmit={handleSupportSubmit} className="space-y-4 max-w-lg mx-auto text-xs">
            <h2 className="text-sm font-black text-white text-center mb-1">Submit Support Ticket</h2>
            <p className="text-zinc-500 text-center mb-4 font-medium">Have an issue or inquiry? Message our operations team directly.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-bold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-bold">Subject (Optional)</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Developer inquiry / System assistance"
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-bold">Describe Your Request *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What can we help you with today?"
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 transition-all text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              {submitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> <span>Send Support Message</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
