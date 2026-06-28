import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  updateDoc, 
  addDoc,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppUser, Complaint, Department, Reward, AppNotification, Comment, UserReward, UserRole, IssueStatus, IssuePriority, IssueSeverity, TimelineEvent } from '../types';
import { SAMPLE_COMPLAINTS, SAMPLE_DEPARTMENTS, SAMPLE_REWARDS, seedDatabaseIfNeeded } from '../lib/sampleData';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export type Language = 'en' | 'hi';

const TRANSLATIONS = {
  en: {
    app_name: "CivicPulse AI",
    tagline: "AI Agents Building Smarter Communities",
    hero_title: "One Platform. Smarter Communities.",
    hero_subtitle: "Report. Verify. Prioritize. Resolve. Powered by AI.",
    citizen_title: "Citizen Hub",
    citizen_desc: "I want to report and track community issues, earn civic rewards, and collaborate with neighbors.",
    officer_title: "Municipal Desk",
    officer_desc: "I want to manage city operations, prioritize work orders using AI triage, and track resolution metrics.",
    select_role_prompt: "Welcome to CivicPulse! Please select your role to continue.",
    email: "Email Address",
    password: "Password",
    name: "Full Name",
    city: "Select City",
    signin: "Sign In",
    signup: "Sign Up",
    sign_out: "Sign Out",
    reporting_issue: "Report a Civic Issue",
    my_dashboard: "My Dashboard",
    my_reports: "My Reports",
    points_badge: "Civic Points",
    leaderboard: "Leaderboard",
    back_to_landing: "Back to Home",
    status_submitted: "Submitted",
    status_verified: "Verified",
    status_assigned: "Assigned",
    status_in_progress: "In Progress",
    status_resolved: "Resolved",
    status_rejected: "Rejected",
    priority_low: "Low Priority",
    priority_medium: "Medium Priority",
    priority_high: "High Priority",
    priority_critical: "Critical Priority",
    department: "Department",
    location: "Location",
    description: "Description",
    images: "Photos/Media",
    submit_report: "Submit Report",
    chat_assistant: "CivicAI Assistant",
    chat_welcome: "Hello! I am CivicPulse AI. How can I help you improve your neighborhood today?",
    redeem_rewards: "Redeem Rewards",
    profile_settings: "Profile & Settings",
    all_issues: "All Issues Map & List",
    language_switch: "Hindi / हिन्दी",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    active_complaints: "Active Complaints",
    resolved_complaints: "Resolved Complaints",
    pending_ai_triage: "Pending AI Triage",
    city_analytics: "City Analytics",
    departments: "Municipal Departments",
    ai_dispatchers: "AI Agent Dispatchers",
    ai_ops_center: "AI Operations Center",
    settings: "Settings",
    notifications: "Notifications",
  },
  hi: {
    app_name: "सिविकपल्स एआई",
    tagline: "एआई एजेंटों से बनाएं बेहतर समाज",
    hero_title: "एक मंच। स्मार्टर समुदाय।",
    hero_subtitle: "रिपोर्ट। जांचें। प्राथमिकता दें। समाधान करें। एआई द्वारा संचालित।",
    citizen_title: "नागरिक हब",
    citizen_desc: "मैं सामुदायिक समस्याओं की रिपोर्ट और ट्रैकिंग करना चाहता हूं, नागरिक पुरस्कार अर्जित करना चाहता हूं, और पड़ोसियों के साथ सहयोग करना चाहता हूं।",
    officer_title: "नगर निगम डेस्क",
    officer_desc: "मैं शहर के कार्यों का प्रबंधन करना चाहता हूं, एआई ट्राइएज का उपयोग करके कार्य आदेशों को प्राथमिकता देना चाहता हूं, और समाधान मेट्रिक्स को ट्रैक करना चाहता हूं।",
    select_role_prompt: "सिविकपल्स में आपका स्वागत है! जारी रखने के लिए कृपया अपनी भूमिका का चयन करें।",
    email: "ईमेल पता",
    password: "पासवर्ड",
    name: "पूरा नाम",
    city: "शहर चुनें",
    signin: "साइन इन करें",
    signup: "साइन अप करें",
    sign_out: "साइन आउट",
    reporting_issue: "नागरिक समस्या की रिपोर्ट करें",
    my_dashboard: "मेरा डैशबोर्ड",
    my_reports: "मेरी रिपोर्ट",
    points_badge: "नागरिक अंक",
    leaderboard: "लीडरबोर्ड",
    back_to_landing: "मुख्य पृष्ठ पर वापस जाएं",
    status_submitted: "प्रस्तुत किया",
    status_verified: "सत्यापित",
    status_assigned: "सौंपा गया",
    status_in_progress: "प्रगति पर",
    status_resolved: "हल किया गया",
    status_rejected: "अस्वीकृत",
    priority_low: "कम प्राथमिकता",
    priority_medium: "मध्यम प्राथमिकता",
    priority_high: "उच्च प्राथमिकता",
    priority_critical: "गंभीर प्राथमिकता",
    department: "विभाग",
    location: "स्थान",
    description: "विवरण",
    images: "तस्वीरें / मीडिया",
    submit_report: "रिपोर्ट सबमिट करें",
    chat_assistant: "सिविकएआई सहायक",
    chat_welcome: "नमस्ते! मैं सिविकपल्स एआई हूं। आज आपके पड़ोस को बेहतर बनाने में मैं आपकी क्या मदद कर सकता हूं?",
    redeem_rewards: "पुरस्कार रिडीम करें",
    profile_settings: "प्रोफ़ाइल और सेटिंग्स",
    all_issues: "सभी समस्याएं मानचित्र और सूची",
    language_switch: "English / अंग्रेजी",
    dark_mode: "डार्क मोड",
    light_mode: "लाइट मोड",
    active_complaints: "सक्रिय शिकायतें",
    resolved_complaints: "समाधानित शिकायतें",
    pending_ai_triage: "लंबित एआई वर्गीकरण",
    city_analytics: "शहर विश्लेषण",
    departments: "नगर निगम विभाग",
    ai_dispatchers: "एआई एजेंट प्रेषक",
    ai_ops_center: "एआई ऑपरेशंस सेंटर",
    settings: "समायोजन",
    notifications: "सूचनाएं",
  }
};

interface AppContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  complaints: Complaint[];
  departments: Department[];
  rewards: Reward[];
  userRewards: UserReward[];
  notifications: AppNotification[];
  toast: Toast;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  updateUserRoleAndCity: (role: UserRole, city: string, name: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInOffline: (role: UserRole, city: string, name: string) => void;
  createComplaint: (title: string, description: string, city: string, address: string, latitude: number, longitude: number, department: string, priority: IssuePriority, images: string[], aiIntelReport?: any, priorityDetails?: any, videos?: string[]) => Promise<Complaint>;
  upvoteComplaint: (complaintId: string) => Promise<void>;
  addComment: (complaintId: string, content: string) => Promise<void>;
  updateComplaintStatus: (complaintId: string, status: IssueStatus, note: string) => Promise<void>;
  redeemPoints: (rewardId: string) => Promise<void>;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  // Dynamic Presentation and Simulation Controls
  demoMode: boolean;
  setDemoMode: (mode: boolean) => void;
  globalActivity: Array<{ id: string; message: string; timestamp: string; type: 'info' | 'ai' | 'warning' | 'success' }>;
  addGlobalActivity: (message: string, type?: 'info' | 'ai' | 'warning' | 'success') => void;
  clearGlobalActivity: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  judgeMode: boolean;
  setJudgeMode: (mode: boolean) => void;
  judgeStep: number;
  setJudgeStep: (step: number) => void;
  presentationMode: boolean;
  setPresentationMode: (mode: boolean) => void;
  accessibilityConfig: { textScale: 'normal' | 'large' | 'xlarge'; highContrast: boolean };
  setAccessibilityConfig: (config: { textScale: 'normal' | 'large' | 'xlarge'; highContrast: boolean }) => void;
  mapPreferences: { style: 'streets' | 'satellite' | 'dark'; showHotspots: boolean };
  setMapPreferences: (prefs: { style: 'streets' | 'satellite' | 'dark'; showHotspots: boolean }) => void;
  notificationPrefs: { email: boolean; push: boolean; sms: boolean; alerts: boolean };
  setNotificationPrefs: (prefs: { email: boolean; push: boolean; sms: boolean; alerts: boolean }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  
  // Real-time synced Firestore arrays with backup sample data triggers
  const [complaints, setComplaints] = useState<Complaint[]>(SAMPLE_COMPLAINTS);
  const [departments, setDepartments] = useState<Department[]>(SAMPLE_DEPARTMENTS);
  const [rewards, setRewards] = useState<Reward[]>(SAMPLE_REWARDS);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', visible: false });

  // Presentation, Simulation, and Preference States
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [globalActivity, setGlobalActivity] = useState<Array<{ id: string; message: string; timestamp: string; type: 'info' | 'ai' | 'warning' | 'success' }>>([
    { id: 'act_1', message: 'Vision Agent analyzed road surface crack #POT-102: verified', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), type: 'ai' },
    { id: 'act_2', message: 'Citizen reported sewer line blockage in Sector 11', timestamp: new Date(Date.now() - 60000 * 10).toISOString(), type: 'info' },
    { id: 'act_3', message: 'Officer authorized dispatch of suction team to Karol Bagh', timestamp: new Date(Date.now() - 60000 * 15).toISOString(), type: 'success' },
    { id: 'act_4', message: 'City Health Index adjusted to 88.4 based on resolution SLA gains', timestamp: new Date(Date.now() - 60000 * 20).toISOString(), type: 'ai' },
  ]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [judgeMode, setJudgeMode] = useState<boolean>(false);
  const [judgeStep, setJudgeStep] = useState<number>(0);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);

  const [accessibilityConfig, setAccessibilityConfig] = useState({ textScale: 'normal' as 'normal' | 'large' | 'xlarge', highContrast: false });
  const [mapPreferences, setMapPreferences] = useState({ style: 'dark' as 'streets' | 'satellite' | 'dark', showHotspots: true });
  const [notificationPrefs, setNotificationPrefs] = useState({ email: true, push: true, sms: false, alerts: true });

  const addGlobalActivity = (message: string, type: 'info' | 'ai' | 'warning' | 'success' = 'info') => {
    setGlobalActivity(prev => [
      { id: `act_${Math.random().toString(36).substring(2, 9)}`, message, timestamp: new Date().toISOString(), type },
      ...prev.slice(0, 49) // Keep last 50 events
    ]);
  };

  const clearGlobalActivity = () => {
    setGlobalActivity([]);
  };

  // Accessibility side-effects
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    if (accessibilityConfig.textScale === 'large') {
      htmlElement.classList.add('text-scale-large');
    } else if (accessibilityConfig.textScale === 'xlarge') {
      htmlElement.classList.add('text-scale-xlarge');
    } else {
      htmlElement.classList.add('text-scale-normal');
    }

    if (accessibilityConfig.highContrast) {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }
  }, [accessibilityConfig]);

  // Demo Mode simulation ticker
  useEffect(() => {
    if (!demoMode) return;

    showToast("Demo Mode Activated: Simulating live municipal activity!", "success");
    addGlobalActivity("Dynamic Demonstration Simulation Engine: Initialized", "ai");

    const timer = setInterval(() => {
      const roll = Math.random();
      
      if (roll < 0.25) {
        // Simulated new complaint
        const prefixes = ['POT', 'WTR', 'SAN', 'LGT', 'ENV', 'SAF'];
        const depts = ['Road Infrastructure', 'Water Supply & Sewerage', 'Sanitation & Waste Management', 'Street Lighting', 'Environmental Health', 'Public Safety & Security'];
        const randIndex = Math.floor(Math.random() * prefixes.length);
        const prefix = prefixes[randIndex];
        const dept = depts[randIndex];
        const ticketId = `#${prefix}-${Math.floor(100 + Math.random() * 900)}`;
        const titles = [
          "Severe surface pothole and water pooling",
          "Water supply pressure dropping with rust color",
          "Illegal dumping of construction materials in park",
          "Four consecutive lamp posts flickering since weekend",
          "Overflowing community dustbin near market area",
          "Damaged pedestrian guardrail posing safety risk"
        ];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        const newSimulated: Complaint = {
          id: `sim_${Date.now()}`,
          title: `[Demo] ${title}`,
          description: `Automatically generated demo simulation ticket. High citizen density nearby. Immediate remediation scheduled.`,
          city: user?.city || 'Delhi',
          address: `Sector ${Math.floor(1 + Math.random() * 15)}, Connaught Circle, New Delhi`,
          latitude: 28.6139 + (Math.random() - 0.5) * 0.05,
          longitude: 77.2090 + (Math.random() - 0.5) * 0.05,
          images: ["https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80"],
          videos: [],
          reporterId: 'simulated_citizen',
          reporterName: 'Civic Bot',
          department: dept,
          status: 'SUBMITTED',
          priority: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
          severity: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
          verificationCount: Math.floor(Math.random() * 4),
          upvoters: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiAnalysis: {
            category: dept,
            urgencyScore: Math.floor(65 + Math.random() * 30),
            summary: "AI Computer Vision detected high risk factors near commercial center.",
            detectedSentiment: "frustrated",
            recommendedDepartment: dept,
            recommendedAction: "Dispatch local emergency repair vehicle.",
            duplicateChecked: true,
            isDuplicate: false,
            confidenceScore: Math.floor(91 + Math.random() * 8)
          },
          timeline: [
            { status: 'SUBMITTED', timestamp: new Date().toISOString(), note: 'Submitted via citizen bot client', updatedBy: 'Civic Bot' }
          ]
        };

        setComplaints(prev => [newSimulated, ...prev]);
        addGlobalActivity(`New complaint received: ${ticketId} - "${title}"`, 'info');
        
        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            userId: user?.uid || 'all_officers',
            title: `New Ticket: ${ticketId}`,
            description: `Citizen reported "${title}" under ${dept}. Priority assigned: HIGH.`,
            type: 'status_update',
            referenceId: newSimulated.id,
            read: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
        
      } else if (roll < 0.50) {
        if (complaints.length > 0) {
          const randomComp = complaints[Math.floor(Math.random() * complaints.length)];
          addGlobalActivity(`Vision Intelligence Agent parsed complaint photo for #${randomComp.id.substring(0,6)}`, 'ai');
          
          setNotifications(prev => [
            {
              id: `notif_${Date.now()}`,
              userId: user?.uid || 'current_user',
              title: `AI Photo Diagnostics Completed`,
              description: `Autonomous vision diagnostics ran on #${randomComp.id.substring(0,6)}. Recommended department: ${randomComp.department}.`,
              type: 'comment',
              referenceId: randomComp.id,
              read: false,
              createdAt: new Date().toISOString()
            },
            ...prev
          ]);
        }
      } else if (roll < 0.75) {
        if (complaints.length > 0) {
          const openComplaints = complaints.filter(c => c.status !== 'RESOLVED');
          if (openComplaints.length > 0) {
            const randomComp = openComplaints[Math.floor(Math.random() * openComplaints.length)];
            const statusFlow: Record<IssueStatus, IssueStatus> = {
              'SUBMITTED': 'VERIFIED',
              'VERIFIED': 'ASSIGNED',
              'ASSIGNED': 'IN_PROGRESS',
              'IN_PROGRESS': 'RESOLVED',
              'RESOLVED': 'RESOLVED',
              'REJECTED': 'REJECTED'
            };
            const nextStatus = statusFlow[randomComp.status] || 'VERIFIED';
            
            setComplaints(prev => prev.map(c => {
              if (c.id === randomComp.id) {
                return {
                  ...c,
                  status: nextStatus,
                  timeline: [
                    ...c.timeline,
                    {
                      status: nextStatus,
                      timestamp: new Date().toISOString(),
                      note: `Simulated state progression under demo mode`,
                      updatedBy: 'Municipal Dispatch Engine'
                    }
                  ],
                  updatedAt: new Date().toISOString()
                };
              }
              return c;
            }));

            addGlobalActivity(`Ticket progression: #${randomComp.id.substring(0,6)} updated to "${nextStatus}"`, 'success');
            
            setNotifications(prev => [
              {
                id: `notif_${Date.now()}`,
                userId: user?.uid || 'current_user',
                title: `Ticket Status Update`,
                description: `Ticket #${randomComp.id.substring(0,6)} progressed to status ${nextStatus}.`,
                type: 'status_update',
                referenceId: randomComp.id,
                read: false,
                createdAt: new Date().toISOString()
              },
              ...prev
            ]);
          }
        }
      } else {
        const sectors = ['Karol Bagh', 'Saket', 'Bandra West', 'Connaught Place', 'Dwarka Sector 6'];
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const riskTypes = ['Water Logging', 'Refuse Stagnation', 'Streetlight Blackouts', 'Severe Asphalt Fissures'];
        const risk = riskTypes[Math.floor(Math.random() * riskTypes.length)];
        
        addGlobalActivity(`Prediction Agent: Elevated hotspot warning in ${sector} for "${risk}"`, 'warning');
        
        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            userId: user?.uid || 'current_user',
            title: `AI Predictive Risk Dispatch`,
            description: `Monsoon forecasts indicate elevated ${risk} risk in ${sector}. Secondary service vehicles alerted.`,
            type: 'assignment',
            read: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [demoMode, complaints.length]);

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || String(key);
  };

  // Toast utilities
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('civicpulse_theme', newTheme);
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('civicpulse_lang', lang);
  };

  // Sync theme class to document body
  useEffect(() => {
    const savedTheme = localStorage.getItem('civicpulse_theme') as 'light' | 'dark' | 'system';
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      setThemeState('system');
    }
    const savedLang = localStorage.getItem('civicpulse_lang') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applyTheme = (isDark: boolean) => {
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      };

      // Apply initially
      applyTheme(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Try auto-seeding sample database upon startup
  useEffect(() => {
    const triggerSeed = async () => {
      try {
        await seedDatabaseIfNeeded();
      } catch (err) {
        console.warn('Auto-seed check bypassed due to setup states: ', err);
      }
    };
    triggerSeed();
  }, []);

  // Sync complaints, departments, and rewards from Firestore
  useEffect(() => {
    let unsubscribeComplaints = () => {};
    let unsubscribeDepartments = () => {};
    let unsubscribeRewards = () => {};

    try {
      unsubscribeComplaints = onSnapshot(
        query(collection(db, 'complaints'), orderBy('createdAt', 'desc')),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Complaint[] = [];
            snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as Complaint));
            setComplaints(list);
          }
        },
        (error) => {
          console.warn('Firestore complaints live sync offline, using high-quality sample fallbacks', error);
        }
      );

      unsubscribeDepartments = onSnapshot(
        collection(db, 'departments'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Department[] = [];
            snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as Department));
            setDepartments(list);
          }
        },
        (error) => {
          console.warn('Firestore departments live sync offline, using fallbacks', error);
        }
      );

      unsubscribeRewards = onSnapshot(
        collection(db, 'rewards'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Reward[] = [];
            snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as Reward));
            setRewards(list);
          }
        },
        (error) => {
          console.warn('Firestore rewards live sync offline, using fallbacks', error);
        }
      );
    } catch (e) {
      console.warn('Firestore listeners bypassed', e);
    }

    return () => {
      unsubscribeComplaints();
      unsubscribeDepartments();
      unsubscribeRewards();
    };
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        // Fetch custom user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', fUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUser(userDocSnap.data() as AppUser);
          } else {
            // Profile exists in Auth but not in Firestore yet (e.g. freshly signed up or Google auth first-time)
            setUser({
              uid: fUser.uid,
              email: fUser.email || '',
              role: 'citizen', // Default role which can be configured inside first-time login wizard
              name: fUser.displayName || fUser.email?.split('@')[0] || 'User',
              avatarUrl: fUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fUser.uid}`,
              city: '',
              createdAt: new Date().toISOString(),
              points: 100, // Welcome points
              reportedCount: 0,
              badge: 'Bronze Citizen'
            });
          }
        } catch (error) {
          console.error('Error fetching user document from Firestore:', error);
          // Fallback profile representation for safety
          setUser({
            uid: fUser.uid,
            email: fUser.email || '',
            role: 'citizen',
            name: fUser.displayName || 'Offline User',
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${fUser.uid}`,
            city: 'Delhi',
            createdAt: new Date().toISOString(),
            points: 100
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to User Rewards & Notifications once user is authenticated
  useEffect(() => {
    if (!user?.uid) {
      setUserRewards([]);
      setNotifications([]);
      return;
    }

    let unsubscribeUserRewards = () => {};
    let unsubscribeNotifications = () => {};

    try {
      unsubscribeUserRewards = onSnapshot(
        query(collection(db, 'user_rewards'), where('userId', '==', user.uid)),
        (snapshot) => {
          const list: UserReward[] = [];
          snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as UserReward));
          setUserRewards(list);
        },
        (error) => console.warn('Firestore user rewards offline', error)
      );

      const targetUserIds = [user.uid];
      if (user.role === 'officer') {
        targetUserIds.push('officers');
      }

      unsubscribeNotifications = onSnapshot(
        query(collection(db, 'notifications'), where('userId', 'in', targetUserIds), orderBy('createdAt', 'desc')),
        (snapshot) => {
          const list: AppNotification[] = [];
          snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as AppNotification));
          setNotifications(list);
        },
        (error) => console.warn('Firestore notifications offline', error)
      );
    } catch (e) {
      console.warn('Real-time profile sub-lists offline', e);
    }

    return () => {
      unsubscribeUserRewards();
      unsubscribeNotifications();
    };
  }, [user?.uid]);

  // Update user profile (Role & City selection during first-time login)
  const updateUserRoleAndCity = async (role: UserRole, city: string, name: string) => {
    if (!firebaseUser) throw new Error('No authenticated user found');
    
    const updatedProfile: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      role,
      name,
      avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
      city,
      createdAt: new Date().toISOString(),
      ...(role === 'citizen' ? {
        points: 100, // Starter bonus points
        badge: 'Bronze Sentinel',
        reportedCount: 0
      } : {
        department: 'Sanitation & Waste Management', // Default for officers
        assignedIssuesCount: 0,
        officerId: `OFFICER-${Math.floor(1000 + Math.random() * 9000)}`
      })
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), updatedProfile);
      setUser(updatedProfile);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Firestore role-write error:', error);
      // Fallback local update
      setUser(updatedProfile);
      showToast('Local offline profile configured.', 'info');
    }
  };

  const updateUserProfile = async (updatedData: Partial<AppUser>) => {
    if (!user?.uid) return;
    
    const updatedProfile = { ...user, ...updatedData };
    setUser(updatedProfile);

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updatedData, { merge: true });
      showToast('Profile updated successfully!', 'success');
    } catch (e: any) {
      console.warn('Firestore profile update offline, updated locally:', e);
      showToast('Profile changes cached locally.', 'info');
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const signInOffline = (role: UserRole, city: string, name: string) => {
    const mockUid = role === 'citizen' ? 'mock-citizen-rajesh-uid' : 'mock-officer-priya-uid';
    const mockEmail = role === 'citizen' ? 'citizen.rajesh@civicpulse.org' : 'officer.priya@civicpulse.org';
    const updatedProfile: AppUser = {
      uid: mockUid,
      email: mockEmail,
      role,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${mockUid}`,
      city,
      createdAt: new Date().toISOString(),
      ...(role === 'citizen' ? {
        points: 350,
        badge: 'Silver Sentinel',
        reportedCount: 3
      } : {
        department: 'Sanitation & Waste Management',
        assignedIssuesCount: 4,
        officerId: `OFFICER-7712`
      })
    };
    setUser(updatedProfile);
    setFirebaseUser({
      uid: mockUid,
      email: mockEmail,
      displayName: name,
      photoURL: updatedProfile.avatarUrl,
      emailVerified: true,
    } as any);
    showToast('Offline Mode Activated', 'success');
  };

  // Citizens create complaint
  const createComplaint = async (
    title: string, 
    description: string, 
    city: string, 
    address: string, 
    latitude: number, 
    longitude: number, 
    department: string, 
    priority: IssuePriority,
    images: string[],
    aiIntelReport?: any,
    priorityDetails?: any,
    videos: string[] = []
  ): Promise<Complaint> => {
    if (!user) throw new Error('Must be logged in');

    // Formulate a robust AI Pre-analysis (Triage simulation block)
    const severityValues: IssueSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const calculatedSeverity = priority === 'CRITICAL' ? 'CRITICAL' : priority;
    
    const aiAnalysis: Complaint['aiAnalysis'] = {
      category: department.replace('&', 'and'),
      urgencyScore: priorityDetails?.score || (priority === 'CRITICAL' ? 95 : priority === 'HIGH' ? 80 : priority === 'MEDIUM' ? 50 : 25),
      summary: aiIntelReport?.professionalDescription || `AI Dispatcher pre-triage: ${title}. Category analyzed automatically. High confidence score.`,
      detectedSentiment: 'Informative / Actionable',
      recommendedDepartment: department,
      recommendedAction: aiIntelReport?.emergencyRecommendation || 'Dispatch standard crew to inspect coordinates.',
      duplicateChecked: true,
      isDuplicate: false,
      confidenceScore: aiIntelReport?.confidenceScore || 88,
    };

    const newComplaint: Omit<Complaint, 'id'> = {
      title,
      description,
      city,
      address,
      latitude,
      longitude,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=600&q=80'],
      videos,
      reporterId: user.uid,
      reporterName: user.name,
      department,
      status: 'SUBMITTED',
      priority,
      severity: calculatedSeverity,
      verificationCount: 1,
      upvoters: [user.uid],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiAnalysis,
      aiIntelReport,
      priorityDetails,
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          note: `Complaint generated by citizen ${user.name}.`,
          updatedBy: 'System',
        },
        {
          status: 'VERIFIED',
          timestamp: new Date().toISOString(),
          note: 'CivicPulse AI dispatcher verified coordinates and triaged department routing.',
          updatedBy: 'AI Agent CivicPulse',
        }
      ]
    };

    try {
      const docRef = await addDoc(collection(db, 'complaints'), newComplaint);
      const finalized: Complaint = { id: docRef.id, ...newComplaint };
      
      // Update reporter citizen point count
      if (user.role === 'citizen') {
        const currentPoints = user.points || 0;
        const currentReportedCount = user.reportedCount || 0;
        const updatedPoints = currentPoints + 50; // 50 points for filing verified report
        const updatedCount = currentReportedCount + 1;
        const updatedBadge = updatedPoints > 500 ? 'Platinum Guardian' : updatedPoints > 300 ? 'Gold Sentinel' : updatedPoints > 150 ? 'Silver Inspector' : 'Bronze Sentinel';
        
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          points: updatedPoints,
          reportedCount: updatedCount,
          badge: updatedBadge
        }, { merge: true });

        setUser(prev => prev ? { ...prev, points: updatedPoints, reportedCount: updatedCount, badge: updatedBadge } : null);
        
        // Push notification
        await addDoc(collection(db, 'notifications'), {
          userId: user.uid,
          title: 'Report Registered successfully +50 pts!',
          description: `Thank you for contributing to a cleaner ${city}! Your issue "${title}" was analyzed and routed to ${department}.`,
          type: 'reward',
          referenceId: docRef.id,
          read: false,
          createdAt: new Date().toISOString()
        });

        // Broadcast alert notification to municipal officers
        await addDoc(collection(db, 'notifications'), {
          userId: 'officers',
          title: `🚨 New Report: ${title}`,
          description: `A new ${priority} severity issue regarding "${title}" has been reported in ${city}, routed to ${department}.`,
          type: 'new_complaint',
          referenceId: docRef.id,
          read: false,
          createdAt: new Date().toISOString()
        });
      }

      showToast('Issue reported and triaged by AI successfully!', 'success');
      return finalized;
    } catch (e) {
      console.error('Firestore write error: ', e);
      // Local fallback representation
      const offlineId = `complaint_offline_${Math.floor(Math.random() * 100000)}`;
      const finalizedOffline: Complaint = { id: offlineId, ...newComplaint };
      setComplaints(prev => [finalizedOffline, ...prev]);
      showToast('Offline Mode: Issue saved in cache state.', 'info');
      return finalizedOffline;
    }
  };

  // Upvote / Verify Complaint
  const upvoteComplaint = async (complaintId: string) => {
    if (!user) throw new Error('Must be logged in');

    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;

    if (complaint.upvoters.includes(user.uid)) {
      showToast('You have already verified this complaint!', 'info');
      return;
    }

    const updatedUpvoters = [...complaint.upvoters, user.uid];
    const updatedCount = complaint.verificationCount + 1;
    let updatedStatus: IssueStatus = complaint.status;

    // Auto promote status if verification count hits threshold
    if (complaint.status === 'SUBMITTED' && updatedCount >= 5) {
      updatedStatus = 'VERIFIED';
    }

    const updatedTimeline = [...complaint.timeline];
    if (updatedStatus === 'VERIFIED' && complaint.status === 'SUBMITTED') {
      updatedTimeline.push({
        status: 'VERIFIED',
        timestamp: new Date().toISOString(),
        note: 'Promoted to Community Verified Status after reaching threshold of citizen confirmations.',
        updatedBy: 'AI Agent CivicPulse'
      });
    }

    try {
      const docRef = doc(db, 'complaints', complaintId);
      await updateDoc(docRef, {
        upvoters: updatedUpvoters,
        verificationCount: updatedCount,
        status: updatedStatus,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      });

      // Award citizen +10 points for verifying
      const currentPoints = user.points || 0;
      const updatedPoints = currentPoints + 15;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { points: updatedPoints }, { merge: true });
      setUser(prev => prev ? { ...prev, points: updatedPoints } : null);

      // Notify the original reporter
      await addDoc(collection(db, 'notifications'), {
        userId: complaint.reporterId,
        title: 'Neighborhood Validation!',
        description: `Your reported complaint "${complaint.title}" was verified by ${user.name}. Total verifications: ${updatedCount}.`,
        type: 'upvote',
        referenceId: complaintId,
        read: false,
        createdAt: new Date().toISOString()
      });

      showToast('Issue verified! Earned +15 Citizen Points.', 'success');
    } catch (e) {
      console.warn('Upvote error: ', e);
      // Fallback local update
      setComplaints(prev => prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            upvoters: updatedUpvoters,
            verificationCount: updatedCount,
            status: updatedStatus,
            timeline: updatedTimeline
          };
        }
        return c;
      }));
    }
  };

  // Add comments
  const addComment = async (complaintId: string, content: string) => {
    if (!user) throw new Error('Must be logged in');

    const commentData = {
      complaintId,
      userId: user.uid,
      userName: user.name,
      userAvatar: user.avatarUrl,
      userRole: user.role,
      content,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'comments'), commentData);
      showToast('Comment posted successfully', 'success');
    } catch (e) {
      console.error('Comment save error: ', e);
      showToast('Offline comment simulated.', 'info');
    }
  };

  // Municipality officers update complaint status
  const updateComplaintStatus = async (complaintId: string, status: IssueStatus, note: string) => {
    if (!user || user.role !== 'officer') throw new Error('Unauthorized');

    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;

    const newTimelineEvent: TimelineEvent = {
      status,
      timestamp: new Date().toISOString(),
      note,
      updatedBy: user.name,
    };

    const updatedTimeline = [...complaint.timeline, newTimelineEvent];

    try {
      const docRef = doc(db, 'complaints', complaintId);
      await updateDoc(docRef, {
        status,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString(),
        assignedOfficerId: user.uid,
        assignedOfficerName: user.name
      });

      // Notify reporter
      await addDoc(collection(db, 'notifications'), {
        userId: complaint.reporterId,
        title: `Status Update: ${status}`,
        description: `Your issue "${complaint.title}" has been updated to "${status}" by Officer ${user.name}: "${note}"`,
        type: 'status_update',
        referenceId: complaintId,
        read: false,
        createdAt: new Date().toISOString()
      });

      showToast(`Complaint updated to ${status} successfully`, 'success');
    } catch (e) {
      console.warn('Status update error: ', e);
      setComplaints(prev => prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            status,
            timeline: updatedTimeline,
            assignedOfficerId: user.uid,
            assignedOfficerName: user.name
          };
        }
        return c;
      }));
    }
  };

  // Redeem rewards
  const redeemPoints = async (rewardId: string) => {
    if (!user || user.role !== 'citizen') throw new Error('Unauthorized');

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const currentPoints = user.points || 0;
    if (currentPoints < reward.costPoints) {
      showToast('Insufficient points to redeem this reward!', 'error');
      return;
    }

    const updatedPoints = currentPoints - reward.costPoints;

    const newUserReward = {
      userId: user.uid,
      rewardId,
      title: reward.title,
      couponCode: reward.couponCode,
      redeemedAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'user_rewards'), newUserReward);
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { points: updatedPoints }, { merge: true });
      setUser(prev => prev ? { ...prev, points: updatedPoints } : null);

      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Reward Redeemed!',
        description: `Successfully redeemed "${reward.title}". Coupon code: ${reward.couponCode}.`,
        type: 'reward',
        referenceId: rewardId,
        read: false,
        createdAt: new Date().toISOString()
      });

      showToast(`Successfully redeemed! Use Coupon Code: ${reward.couponCode}`, 'success');
    } catch (e) {
      console.warn('Reward redeem error:', e);
      // Fallback simulation
      setUser(prev => prev ? { ...prev, points: updatedPoints } : null);
      setUserRewards(prev => [...prev, { id: `ur_${Math.random()}`, ...newUserReward }]);
      showToast('Simulation: Reward redeemed successfully!', 'success');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        updateUserProfile,
        complaints,
        departments,
        rewards,
        userRewards,
        notifications,
        toast,
        showToast,
        hideToast,
        updateUserRoleAndCity,
        signOutUser,
        signInOffline,
        createComplaint,
        upvoteComplaint,
        addComment,
        updateComplaintStatus,
        redeemPoints,
        t,
        // Expose new states
        demoMode,
        setDemoMode,
        globalActivity,
        addGlobalActivity,
        clearGlobalActivity,
        searchQuery,
        setSearchQuery,
        searchActive,
        setSearchActive,
        judgeMode,
        setJudgeMode,
        judgeStep,
        setJudgeStep,
        presentationMode,
        setPresentationMode,
        accessibilityConfig,
        setAccessibilityConfig,
        mapPreferences,
        setMapPreferences,
        notificationPrefs,
        setNotificationPrefs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
