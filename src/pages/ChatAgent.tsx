import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, Send, User, Sparkles, Building, AlertTriangle, ArrowRight, 
  HelpCircle, Mic, MicOff, Languages, PhoneCall, FileText, CheckCircle2,
  Volume2, VolumeX, ShieldAlert, Sparkle
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestionIssues?: any[];
  language?: 'en' | 'hi';
}

const EMERGENCY_CONTACTS = [
  { name: 'Municipal Control Room (Delhi)', number: '1253', desc: 'Central emergency lines for localized flooding and drainage failures' },
  { name: 'Disaster Management Cell', number: '1077', desc: 'Emergency response coordination' },
  { name: 'Electricity Phase Breakdown (NDMC)', number: '19122', desc: 'Active line hazards and substation blackouts' },
  { name: 'Water Grid Emergency (Delhi Jal Board)', number: '1916', desc: 'Main water line bursts & extreme sewage overflow' }
];

const PROCEDURE_STEPS = [
  { title: '1. Auto-Triage Logging', desc: 'Pixel classifier scans your uploaded evidence, estimates cost factors, and queues department routing.' },
  { title: '2. Community Crowdsource Proof', desc: 'Nearby neighbors verify coordinates in their feed. 5 verified votes trigger priority SLA acceleration.' },
  { title: '3. Field Officer Dispatch', desc: 'Assigned supervisor receives work tickets directly on their console, maps optimal routes, and initiates repair.' },
  { title: '4. Resolution Audit', desc: 'Officer uploads post-resolution photo evidence. AI compares pre/post-repair to validate points.' }
];

export const ChatAgent: React.FC = () => {
  const { user, complaints, showToast, t } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatLang, setChatLang] = useState<'en' | 'hi'>('en');
  const [voiceMode, setVoiceMode] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome message based on language and user
  useEffect(() => {
    resetWelcome();
  }, [user, chatLang]);

  const resetWelcome = () => {
    const welcomeText = chatLang === 'en'
      ? `Namaste, ${user?.name || 'Citizen'}! I am CivicPulse AI, your smart municipal assistant. 
\nI can retrieve the status of your reported issues, explain point-redemption guidelines, list local Delhi emergency helplines, or explain government repair procedures.
\nTry asking: *"What is the status of my reports?"* or *"Emergency contacts in Delhi"*`
      : `नमस्ते, ${user?.name || 'नागरिक'}! मैं सिविकपल्स एआई (CivicPulse AI) हूं, आपका स्मार्ट नगर निगम सहायक।
\nमैं आपकी शिकायतों की लाइव स्थिति निकाल सकता हूं, इनाम पॉइंट रिडीम करने की प्रक्रिया समझा सकता हूँ, या आपातकालीन नंबरों की सूची दे सकता हूँ।
\nपूछें: *"मेरी शिकायतों की स्थिति क्या है?"* या *"आपातकालीन नंबर"*`;

    setMessages([
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: chatLang
      }
    ]);
  };

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: `u_${Math.random()}`,
      sender: 'user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: chatLang
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const queryText = inputVal.toLowerCase();
    setInputVal('');
    setTyping(true);

    // Prepare live municipal context for Gemini
    const userCity = user?.city || 'Delhi';
    const cityIssues = complaints.filter(c => c.city.toLowerCase() === userCity.toLowerCase());
    const citizenIssues = complaints.filter(c => c.reporterId === user?.uid);

    try {
      // 1. Attempt to call real server-side Gemini Chat proxy
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ sender: m.sender, text: m.text })),
          language: chatLang,
          userContext: {
            name: user?.name,
            city: userCity,
            points: user?.points,
            role: user?.role,
            complaintsContext: cityIssues.slice(0, 5).map(c => ({
              title: c.title,
              address: c.address,
              status: c.status,
              priority: c.priority,
              department: c.department
            }))
          }
        })
      });

      if (!response.ok) {
        throw new Error('Chat API returned non-ok status');
      }

      const data = await response.json();
      
      // Look up if we need to suggest matching cards in user interface
      let matches: any[] = [];
      if (queryText.includes('my report') || queryText.includes('my complaint') || queryText.includes('शिकायत') || queryText.includes('स्थिति')) {
        matches = citizenIssues.slice(0, 2);
      }

      setMessages(prev => [...prev, {
        id: `ai_${Math.random()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestionIssues: matches.length > 0 ? matches : undefined,
        language: chatLang
      }]);
    } catch (error) {
      console.warn('Real Gemini API unavailable or failed, utilizing advanced local rules:', error);
      
      // 2. Clear & resilient local rules-based fallback engine
      setTimeout(() => {
        let replyText = '';
        let matches: any[] = [];

        // Check citizen reports
        if (queryText.includes('my report') || queryText.includes('my complaint') || queryText.includes('शिकायत') || queryText.includes('स्थिति')) {
          if (citizenIssues.length > 0) {
            matches = citizenIssues.slice(0, 2);
            const first = matches[0];
            
            if (chatLang === 'en') {
              replyText = `Searching active municipal database... I found ${citizenIssues.length} reports filed under your citizen ID. 
\nYour most recent is **"${first.title}"** near **${first.address.split(',')[0]}**.
\n*   **Current Status:** ${first.status}
\n*   **Department:** ${first.department}
\n*   **Assigned Officer:** ${first.assignedOfficerName || 'Pending assigning SLA'}
\n*   **Priority Metric:** ${first.priority} Priority (${first.aiAnalysis?.urgencyScore || 65}/100 score).`;
            } else {
              replyText = `सक्रिय नगर निगम डेटाबेस की खोज की जा रही है... मुझे आपके नागरिक आईडी के तहत ${citizenIssues.length} शिकायतें मिली हैं।
\nआपकी सबसे ताज़ा शिकायत **"${first.title}"** है, जो **${first.address.split(',')[0]}** के पास है।
\n*   **वर्तमान स्थिति:** ${first.status}
\n*   **विभाग:** ${first.department}
\n*   **अधिकारी:** ${first.assignedOfficerName || 'अधिकारी नियुक्ति लंबित है'}`;
            }
          } else {
            const cityIssues = complaints.filter(c => c.city.toLowerCase() === userCity.toLowerCase());
            matches = cityIssues.slice(0, 1);
            
            if (chatLang === 'en') {
              replyText = `I checked the active ledger for your account but couldn't find personal submissions yet. However, there is 1 active neighborhood report nearby: **"${cityIssues[0]?.title || 'Pothole block'}"** which is currently **${cityIssues[0]?.status || 'SUBMITTED'}**. Would you like to file a new report?`;
            } else {
              replyText = `मुझे आपके खाते के तहत व्यक्तिगत शिकायतें नहीं मिलीं। हालाँकि, आपके क्षेत्र में 1 निकटतम सक्रिय शिकायत है: **"${cityIssues[0]?.title || 'सड़क समस्या'}"** जिसकी स्थिति **${cityIssues[0]?.status || 'दर्ज'}** है।`;
            }
          }
        } 
        // Procedures
        else if (queryText.includes('procedure') || queryText.includes('how it works') || queryText.includes('प्रक्रिया') || queryText.includes('काम')) {
          if (chatLang === 'en') {
            replyText = `Here is how our AI-Powered Municipal Resolution cycle operates:
\n1. **Auto-Triage:** AI scans media pixels, project costs, and routes to appropriate officers.
\n2. **Crowdsource Proof:** 5 upvotes from neighborhood citizens instantly accelerate ticket urgency.
\n3. **Resolution & Audit:** Once resolved, officers upload physical proofs which AI double-checks before closure.`;
          } else {
            replyText = `हमारा एआई-संचालित नगर निगम समाधान चक्र इस प्रकार काम करता है:
\n1. **ऑटो-वर्गीकरण:** एआई फोटो को स्कैन करता है, मरम्मत की लागत का अनुमान लगाता है और संबंधित विभाग को भेजता है।
\n2. **नागरिक सत्यापन:** पड़ोसियों से मिले 5 सत्यापित वोट शिकायत को उच्च प्राथमिकता में डाल देते हैं।
\n3. **अधिकारी समाधान:** अधिकारी काम पूरा होने का प्रमाण अपलोड करता है जिसे एआई जांचकर बंद करता है।`;
          }
        }
        // Emergency Contacts
        else if (queryText.includes('emergency') || queryText.includes('contact') || queryText.includes('number') || queryText.includes('आपातकालीन') || queryText.includes('नंबर')) {
          if (chatLang === 'en') {
            replyText = `Here are the active Emergency Helplines for Delhi Municipal Ward:
\n*   📞 **Municipal Control Room:** 1253 (Water logging, Tree fall)
\n*   📞 **NDMC Power Breakdown:** 19122 (Electricity wire sparking)
\n*   📞 **Delhi Jal Board:** 1916 (Sewer line rupture/leaks)`;
          } else {
            replyText = `आपातकालीन हेल्पलाइन नंबर:
\n*   📞 **नगर निगम नियंत्रण कक्ष:** 1253 (जलभराव, पेड़ गिरना)
\n*   📞 **पावर ब्रेकडाउन:** 19122 (बिजली के तार टूटना)
\n*   📞 **दिल्ली जल बोर्ड:** 1916 (सीवर लाइन फटना)`;
          }
        }
        // Rewards
        else if (queryText.includes('points') || queryText.includes('reward') || queryText.includes('इनाम') || queryText.includes('अंक')) {
          if (chatLang === 'en') {
            replyText = `You currently have **${user?.points || 350} Civic Points** and are ranked **#3** in your sector. 
\n*   **How to Earn:** Submit a verified complaint (+50 pts), verify other neighbor's reports (+15 pts), or mark issues as resolved with evidence (+50 pts).
\n*   **Redemption:** Redeem in the *Rewards* tab for metro passes, shopping coupon codes, and green transit kits!`;
          } else {
            replyText = `आपके पास वर्तमान में **${user?.points || 350} नागरिक अंक** हैं।
\n*   **अंक कैसे कमाएं:** सत्यापित शिकायत दर्ज करें (+50 अंक), पड़ोसियों की शिकायतें सत्यापित करें (+15 अंक)।
\n*   **उपहार:** इन्हें आप दिल्ली मेट्रो पास, कॉफी कूपन, या पर्यावरण किट के लिए रिडीम कर सकते हैं!`;
          }
        }
        // General fallback
        else {
          if (chatLang === 'en') {
            replyText = `I hear you! As your Civic Assistant, I can explain procedures, search active complaints, or check your points wallet. Please try asking:
\n*   *"Status of my reports"*
\n*   *"How does duplicate detection work?"*
\n*   *"Delhi emergency helpline numbers"*`;
          } else {
            replyText = `मैं समझ गया! आपके नागरिक सहायक के रूप में, मैं प्रक्रियाओं को समझा सकता हूँ, सक्रिय शिकायतों को खोज सकता हूँ। कृपया पूछें:
\n*   *"मेरी शिकायत की स्थिति बताएं"*
\n*   *"आपातकालीन हेल्पलाइन नंबर"*`;
          }
        }

        setMessages(prev => [...prev, {
          id: `ai_${Math.random()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestionIssues: matches.length > 0 ? matches : undefined,
          language: chatLang
        }]);
      }, 1200);
    } finally {
      setTyping(false);
    }
  };

  // Simulated Voice input click
  const handleToggleVoiceMode = () => {
    if (voiceMode) {
      setVoiceMode(false);
      setInputVal(chatLang === 'en' ? 'What is the status of my reports?' : 'मेरी शिकायतों की स्थिति क्या है?');
      showToast('🎙️ Voice dictation processed successfully!', 'success');
    } else {
      setVoiceMode(true);
      showToast('🎙️ Microphone active. Speak your municipal query...', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0 bg-white dark:bg-zinc-900 border p-4 rounded-2xl">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">AI Civic Assistant</h2>
            <p className="text-[10px] text-slate-500 font-bold">Conversational guide for ward procedures, emergencies, and tracking</p>
          </div>
        </div>

        {/* Interactive control settings */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="chat-lang-toggle"
            onClick={() => setChatLang(chatLang === 'en' ? 'hi' : 'en')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            <span>{chatLang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
          </button>

          <button
            id="chat-audio-feedback-toggle"
            onClick={() => setAudioFeedback(!audioFeedback)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 rounded-xl transition-colors text-slate-500"
            title="Toggle Audio Cues"
          >
            {audioFeedback ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Column (3 spans): Chat timeline thread */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-zinc-900/40 border rounded-2xl overflow-hidden p-4">
          
          {/* Conversation messages scroll body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end ml-auto flex-row-reverse' : 'self-start mr-auto'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs ${
                  msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1.5 text-left">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-zinc-800/80 border text-slate-800 dark:text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Context-bound complaint cards injected into assistant answer */}
                  {msg.suggestionIssues && msg.suggestionIssues.map(issue => (
                    <div key={issue.id} className="p-3 bg-indigo-50/50 dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-[10px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="truncate">
                          <span className="font-extrabold text-slate-700 dark:text-zinc-300 block truncate">{issue.title}</span>
                          <span className="text-slate-400 font-semibold">{issue.address.split(',')[0]}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold shrink-0">{issue.status}</span>
                    </div>
                  ))}

                  <span className="text-[9px] text-slate-400 font-bold block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3 self-start mr-auto">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 text-slate-500 text-xs flex gap-1.5 items-center rounded-tl-none font-bold border">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.3s]" />
                  <span>CivicPulse Model syncing ledger...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips suggested questions */}
          <div className="flex flex-wrap gap-2 mb-3 shrink-0">
            {[
              { label: chatLang === 'en' ? 'What is the status of my reports?' : 'मेरी शिकायतों की स्थिति क्या है?', icon: <Building className="w-3 h-3" /> },
              { label: chatLang === 'en' ? 'Show emergency helplines' : 'आपातकालीन हेल्पलाइन नंबर', icon: <PhoneCall className="w-3 h-3 text-rose-500" /> },
              { label: chatLang === 'en' ? 'How does duplicate detection work?' : 'डुप्लिकेट रिपोर्ट कैसे खोजी जाती है?', icon: <Sparkles className="w-3 h-3" /> }
            ].map((chip) => (
              <button
                id={`suggest-chip-${chip.label.replace(/\s+/g, '-').toLowerCase()}`}
                key={chip.label}
                onClick={() => setInputVal(chip.label)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-zinc-800 border rounded-lg text-[9px] font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 transition-colors"
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Input control message submission bar */}
          <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
            <button
              id="chat-mic-record-btn"
              type="button"
              onClick={handleToggleVoiceMode}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                voiceMode 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              id="assistant-query-input"
              type="text"
              placeholder={chatLang === 'en' ? "Ask about water logging, lighting, or rewards procedures..." : "शिकायत की स्थिति, बिजली समस्या या पुरस्कार के बारे में पूछें..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-zinc-950 border rounded-xl text-xs outline-none text-slate-800 dark:text-zinc-200 focus:border-indigo-500"
              required
            />
            <button
              id="assistant-send-query-btn"
              type="submit"
              className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column (1 span): Reference procedures and emergency helplines */}
        <div className="lg:col-span-1 space-y-5 text-left h-full overflow-y-auto pr-1">
          
          {/* Emergency contacts card */}
          <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Delhi Helpline Hub</span>
            </h4>
            <div className="space-y-2.5 text-[11px]">
              {EMERGENCY_CONTACTS.map((con, idx) => (
                <div key={idx} className="border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-700 dark:text-zinc-300 truncate pr-2">{con.name}</span>
                    <a href={`tel:${con.number}`} className="text-rose-600 font-mono hover:underline">{con.number}</a>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">{con.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Process lifecycle card */}
          <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black uppercase text-indigo-800 dark:text-indigo-400 tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>SLA Resolution cycle</span>
            </h4>
            <div className="space-y-3.5 text-[11px]">
              {PROCEDURE_STEPS.map((step, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="font-extrabold text-slate-700 dark:text-zinc-300">{step.title}</p>
                  <p className="text-[9px] text-slate-400 leading-normal">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
