import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Key, Mail, User, Shield, Compass, Landmark, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, updateUserRoleAndCity, showToast, t, signInOffline } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Route URL parameter for predefined role preference
  const roleParam = searchParams.get('role') as 'citizen' | 'officer' | null;

  // View controllers: 'signin' | 'signup' | 'forgot' | 'onboarding'
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'onboarding'>('signin');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Onboarding states
  const [chosenRole, setChosenRole] = useState<'citizen' | 'officer'>('citizen');
  const [chosenCity, setChosenCity] = useState('Delhi');
  const [onboardName, setOnboardName] = useState('');

  // Auto-redirect if logged in and profile is complete
  useEffect(() => {
    if (user) {
      if (!user.city) {
        setOnboardName(user.name);
        setMode('onboarding');
      } else {
        // Direct to respective role dashboard
        navigate(user.role === 'citizen' ? '/dashboard' : '/admin');
      }
    }
  }, [user, navigate]);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Logged in successfully', 'success');
    } catch (err: any) {
      console.warn('Firebase sign-in error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        showToast('Email sign-in is pending activation. Logging in via Offline Mode...', 'info');
        signInOffline('citizen', 'Delhi', email.split('@')[0] || 'Citizen');
      } else {
        showToast(err.message || 'Failed to sign in', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Wait for auth listener to trigger onboarding state
      setMode('onboarding');
      setOnboardName(fullName);
      showToast('Account created! Let us configure your profile.', 'success');
    } catch (err: any) {
      console.warn('Firebase sign-up error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        showToast('Auth provider not yet activated. Activating Offline Mode onboarding...', 'info');
        signInOffline('citizen', 'Delhi', fullName);
      } else {
        showToast(err.message || 'Failed to register', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('Password reset link sent to your email!', 'success');
      setMode('signin');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Password reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Onboarding Completion
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName || !chosenCity) {
      showToast('Please enter your name and choose a city', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateUserRoleAndCity(chosenRole, chosenCity, onboardName);
      navigate(chosenRole === 'citizen' ? '/dashboard' : '/admin');
    } catch (err: any) {
      console.error(err);
      showToast('Error saving profile onboarding. Using defaults.', 'info');
      navigate(chosenRole === 'citizen' ? '/dashboard' : '/admin');
    } finally {
      setLoading(false);
    }
  };

  // Quick Developer Demo logins
  const loginAsDemoUser = async (role: 'citizen' | 'officer') => {
    setLoading(true);
    try {
      if (role === 'citizen') {
        // Demofying using an existing sandbox or simulation path
        // For testing we will sign in with simulated credentials or log in with demo account
        const demoEmail = 'citizen.rajesh@civicpulse.org';
        const demoPass = 'citizen123';
        
        try {
          await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        } catch (innerError: any) {
          if (innerError.code === 'auth/operation-not-allowed') {
            signInOffline('citizen', 'Delhi', 'Rajesh Kumar');
          } else {
            // If demo accounts don't exist yet, we create them instantly
            await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
            await updateUserRoleAndCity('citizen', 'Delhi', 'Rajesh Kumar');
          }
        }
      } else {
        const demoEmail = 'officer.priya@civicpulse.org';
        const demoPass = 'officer123';
        try {
          await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        } catch (innerError: any) {
          if (innerError.code === 'auth/operation-not-allowed') {
            signInOffline('officer', 'Mumbai', 'Priya Srinivasan');
          } else {
            await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
            await updateUserRoleAndCity('officer', 'Mumbai', 'Priya Srinivasan');
          }
        }
      }
      showToast('Demo Persona loaded successfully', 'success');
    } catch (e: any) {
      console.warn('Firebase Demo auth error (falling back to offline mode):', e);
      // Absolute fallback if everything in Auth throws
      signInOffline(role, role === 'citizen' ? 'Delhi' : 'Mumbai', role === 'citizen' ? 'Rajesh Kumar' : 'Priya Srinivasan');
    } finally {
      setLoading(false);
    }
  };

  // Setup default onboarding role preference based on landing page choice
  useEffect(() => {
    if (roleParam) {
      setChosenRole(roleParam);
      if (mode === 'signin') {
        setMode('signup');
      }
    }
  }, [roleParam]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#07070B] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-8 text-center space-y-6">
        
        {/* Brand header */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20 mb-2">
            C
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('app_name')}</h2>
          <p className="text-xs text-slate-400 font-medium">{t('tagline')}</p>
        </div>

        {/* ================= MODE: SIGN IN ================= */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            <h3 className="text-lg font-black text-center text-slate-800 dark:text-zinc-100">Sign Into CivicPulse</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('email')}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <Mail className="w-4 h-4 text-slate-400" />
                <input 
                  id="login-email"
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('password')}</label>
                <button 
                  id="forgot-password-toggle"
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-xs text-indigo-500 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <Key className="w-4 h-4 text-slate-400" />
                <input 
                  id="login-password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 shadow-indigo-100 dark:shadow-none flex justify-center items-center gap-2"
            >
              {loading ? 'Please wait...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-slate-500 mt-4">
              Don't have an account?{' '}
              <button 
                id="toggle-to-signup"
                type="button" 
                onClick={() => setMode('signup')}
                className="text-indigo-500 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          </form>
        )}

        {/* ================= MODE: SIGN UP ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4 text-left">
            <h3 className="text-lg font-black text-center text-slate-800 dark:text-zinc-100">Create New Account</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('name')}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <User className="w-4 h-4 text-slate-400" />
                <input 
                  id="signup-name"
                  type="text" 
                  placeholder="Rajesh Kumar" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('email')}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <Mail className="w-4 h-4 text-slate-400" />
                <input 
                  id="signup-email"
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('password')}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <Key className="w-4 h-4 text-slate-400" />
                <input 
                  id="signup-password"
                  type="password" 
                  placeholder="Create password (min 6 chars)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 flex justify-center items-center gap-2"
            >
              {loading ? 'Registering...' : 'Register'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-slate-500 mt-4">
              Already have an account?{' '}
              <button 
                id="toggle-to-signin"
                type="button" 
                onClick={() => setMode('signin')}
                className="text-indigo-500 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* ================= MODE: FORGOT PASSWORD ================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <h3 className="text-lg font-black text-center text-slate-800 dark:text-zinc-100">Reset Your Password</h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed">Enter your registered email and we'll send a password recovery link.</p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">Your Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <Mail className="w-4 h-4 text-slate-400" />
                <input 
                  id="reset-email"
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <button
              id="reset-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              {loading ? 'Sending link...' : 'Send Recovery Email'}
            </button>

            <button 
              id="toggle-back-to-signin"
              type="button" 
              onClick={() => setMode('signin')}
              className="w-full text-center text-xs text-indigo-500 font-bold hover:underline mt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* ================= MODE: ONBOARDING / ROLE & CITY SELECTION ================= */}
        {mode === 'onboarding' && (
          <form onSubmit={handleOnboardingSubmit} className="space-y-5 text-left">
            <h3 className="text-lg font-black text-center text-slate-800 dark:text-zinc-100">Welcome! Personalize Profile</h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed">Let's route you to the correct municipality dashboard.</p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('name')}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                <User className="w-4 h-4 text-slate-400" />
                <input 
                  id="onboarding-name"
                  type="text" 
                  placeholder="Full name" 
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none border-none focus:ring-0 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">Select Application Role</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  id="select-citizen-role"
                  onClick={() => setChosenRole('citizen')}
                  className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                    chosenRole === 'citizen'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-slate-200 hover:border-slate-300 dark:border-zinc-800'
                  }`}
                >
                  <Compass className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
                  <span className="text-xs font-bold block">{t('citizen')}</span>
                </div>

                <div 
                  id="select-officer-role"
                  onClick={() => setChosenRole('officer')}
                  className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                    chosenRole === 'officer'
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
                      : 'border-slate-200 hover:border-slate-300 dark:border-zinc-800'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-purple-500 mx-auto mb-1.5" />
                  <span className="text-xs font-bold block">Officer</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('city')}</label>
              <select
                id="onboarding-city"
                value={chosenCity}
                onChange={(e) => setChosenCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-sm outline-none text-slate-800 dark:text-zinc-200"
              >
                <option value="Delhi">Delhi / दिल्ली</option>
                <option value="Mumbai">Mumbai / मुंबई</option>
                <option value="Bengaluru">Bengaluru / बेंगलुरु</option>
                <option value="Chennai">Chennai / चेन्नई</option>
                <option value="Jaipur">Jaipur / जयपुर</option>
                <option value="Lucknow">Lucknow / लखनऊ</option>
              </select>
            </div>

            <button
              id="onboarding-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none flex justify-center items-center gap-2"
            >
              {loading ? 'Activating Profile...' : 'Complete Registration & Access'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Divider line */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
          <span className="absolute px-3 bg-white dark:bg-zinc-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">Developer Sandbox</span>
        </div>

        {/* Demo login shortcuts */}
        <div className="space-y-2.5">
          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Instantly check out either dashboard workspace with one-click:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="demo-citizen-btn"
              type="button"
              onClick={() => loginAsDemoUser('citizen')}
              className="flex flex-col items-center p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/10 hover:bg-indigo-100/40 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-zinc-300 transition-all text-left"
            >
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Citizen Hub</span>
              <span className="text-xs font-black mt-1">Rajesh Kumar</span>
              <span className="text-[9px] text-slate-400">Delhi (350 pts)</span>
            </button>

            <button
              id="demo-officer-btn"
              type="button"
              onClick={() => loginAsDemoUser('officer')}
              className="flex flex-col items-center p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-100/40 dark:hover:bg-purple-950/20 text-slate-700 dark:text-zinc-300 transition-all text-left"
            >
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Officer Desk</span>
              <span className="text-xs font-black mt-1">Priya Srinivasan</span>
              <span className="text-[9px] text-slate-400">Water & Sewage</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
