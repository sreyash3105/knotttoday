import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Heart,
  User,
  Calendar,
  MapPin,
  Sparkles,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { Modal } from '@/components/Modal';
import { ToastContainer } from '@/components/ToastContainer';
import { useAuth } from '@/context/AuthContext';
import { useServices } from '@/context/ServicesContext';
import { useToast } from '@/hooks/useToast';
import { db } from '@/db';

const REMEMBERED_EMAIL_KEY = 'wedding_remembered_email';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithCredentials, registerNewCouple, resetPassword, isLoggedIn, user } = useAuth();
  const { services } = useServices();
  const { showToast } = useToast();

  // Target path to redirect after client login
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  // Check if URL has ?portal=company or ?portal=client
  const queryParams = new URLSearchParams(location.search);
  const isCompanyQuery = queryParams.get('portal') === 'company' || queryParams.get('tab') === 'company';

  // Portal selection: 'client' | 'company'
  const [portalType, setPortalType] = useState<'client' | 'company'>(
    isCompanyQuery ? 'company' : 'client'
  );

  // Client sub-tab: 'signin' | 'register'
  const [clientSubTab, setClientSubTab] = useState<'signin' | 'register'>('signin');

  // Multi-step Registration for Couples: Step 1 (Credentials) -> Step 2 (Bride & Groom Details)
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State - Step 1
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Sign Up Form State - Step 2 (Couple Details)
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingCity, setWeddingCity] = useState('');

  // Company Staff Login Form State
  const [staffEmail, setStaffEmail] = useState('admin@knottoday.com');
  const [staffPassword, setStaffPassword] = useState('admin123');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setSignInEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Update portal if query string changes
  useEffect(() => {
    if (isCompanyQuery) {
      setPortalType('company');
    }
  }, [isCompanyQuery]);

  // ─── 1. SIGN IN (EXISTING CUSTOMERS) ───
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginWithCredentials(signInEmail, signInPassword);

      if (!res.success) {
        setErrorMessage(res.message || 'Invalid email or password. Please verify and try again.');
        setIsLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, signInEmail);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      showToast(`Welcome back, ${res.user?.brideName || 'Customer'}!`, 'success');
      // Client default destination is Client Dashboard (/)
      navigate(from || '/', { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. SIGN UP STEP 1 (CREATE ACCOUNT) ───
  const handleSignUpStep1 = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type carefully.');
      return;
    }

    // Check if email already registered
    const existing = db.findUserByEmail(signUpEmail);
    if (existing) {
      setErrorMessage('An account with this email address already exists. Please sign in instead.');
      return;
    }

    // Move to Step 2: Enter Bride & Groom celebration details
    setRegisterStep(2);
  };

  // ─── 3. SIGN UP STEP 2 (BRIDE & GROOM DETAILS) ───
  const handleSignUpStep2 = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!brideName.trim() || !groomName.trim()) {
      setErrorMessage('Please enter both the bride and groom names.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerNewCouple({
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        weddingDate: weddingDate.trim() || undefined,
        location: weddingCity.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Failed to create your account.');
        setIsLoading(false);
        return;
      }

      showToast(`Welcome to Knot Today, ${brideName} & ${groomName}!`, 'success');
      // Client default destination is Client Dashboard (/)
      navigate('/', { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 4. COMPANY STAFF SIGN IN (DEFAULTS TO /crm) ───
  const handleStaffSignIn = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast('Staff credentials authenticated. Entering Knot Today CRM...', 'success');
      // Company Staff default destination is Company CRM (/crm)
      navigate('/crm');
    }, 300);
  };

  // ─── 5. FORGOT PASSWORD ───
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    const res = await resetPassword(forgotEmail, newPassword);
    if (!res.success) {
      setForgotError(res.message || 'No account found with this email.');
      return;
    }

    showToast('Your password has been reset successfully! You can now sign in.', 'success');
    setIsForgotModalOpen(false);
    setSignInEmail(forgotEmail);
    setSignInPassword(newPassword);
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-champagne-300 selection:text-burgundy-950 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      <ToastContainer />

      {/* Top Header */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-burgundy-100 bg-white px-4 py-2 text-xs font-semibold text-burgundy-950 shadow-sm transition-all hover:bg-stone-50"
        >
          <ArrowLeft className="h-4 w-4 text-burgundy-700" />
          <span>Back to Main Page</span>
        </Link>
      </div>

      {/* ─── Main Auth Card ─── */}
      <div className="mx-auto my-auto w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-burgundy-100/80 bg-white p-7 md:p-9 shadow-xl ring-1 ring-burgundy-950/5">
          {/* Logo & Heading */}
          <div className="mb-6 flex flex-col items-center text-center">
            <Link to="/" className="mb-4 inline-block transition-transform hover:scale-105">
              <BrandLogo size="lg" />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-burgundy-950">
              {portalType === 'client'
                ? clientSubTab === 'signin'
                  ? 'Couple Sign In'
                  : registerStep === 1
                  ? 'Create Your Account'
                  : 'Tell Us About Your Wedding'
                : 'Company CRM Access'}
            </h1>
            <p className="mt-1.5 text-xs text-charcoal/65 max-w-xs">
              {portalType === 'client'
                ? clientSubTab === 'signin'
                  ? 'Sign in to access your wedding planning dashboard, bills, and bookings'
                  : registerStep === 1
                  ? 'Step 1 of 2: Set up your account credentials'
                  : 'Step 2 of 2: Enter Bride & Groom celebration details'
                : 'Staff administrative login to manage services, inquiries, and customer orders'}
            </p>
          </div>

          {/* ─── PRIMARY PORTAL SELECTOR: CLIENT VS COMPANY CRM ─── */}
          <div className="mb-6 flex rounded-2xl border border-stone-200 bg-stone-100/80 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setPortalType('client');
                setErrorMessage('');
              }}
              className={`flex-1 rounded-xl py-2.5 transition-all flex items-center justify-center gap-1.5 ${
                portalType === 'client'
                  ? 'bg-white text-burgundy-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>Couple Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPortalType('company');
                setErrorMessage('');
              }}
              className={`flex-1 rounded-xl py-2.5 transition-all flex items-center justify-center gap-1.5 ${
                portalType === 'company'
                  ? 'bg-burgundy-950 text-champagne-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-champagne-400" />
              <span>Company CRM</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              PORTAL A: CLIENT / COUPLE PORTAL (DEFAULTS TO /)
          ═══════════════════════════════════════════════════════════ */}
          {portalType === 'client' && (
            <div>
              {/* Sub-tab: Sign In vs New Account */}
              <div className="mb-5 flex rounded-xl border border-burgundy-100 bg-burgundy-50/50 p-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setClientSubTab('signin');
                    setErrorMessage('');
                  }}
                  className={`flex-1 rounded-lg py-1.5 transition-all ${
                    clientSubTab === 'signin'
                      ? 'bg-white text-burgundy-950 shadow-2xs'
                      : 'text-charcoal/60 hover:text-burgundy-900'
                  }`}
                >
                  Existing Couple (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientSubTab('register');
                    setRegisterStep(1);
                    setErrorMessage('');
                  }}
                  className={`flex-1 rounded-lg py-1.5 transition-all ${
                    clientSubTab === 'register'
                      ? 'bg-white text-burgundy-950 shadow-2xs'
                      : 'text-charcoal/60 hover:text-burgundy-900'
                  }`}
                >
                  New Couple (Sign Up)
                </button>
              </div>

              {/* ─── 1. SIGN IN (EXISTING COUPLES) ─── */}
              {clientSubTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@wedding.com"
                        className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-semibold text-charcoal/80">Password *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(signInEmail);
                          setForgotError('');
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-burgundy-700 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-10 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                      >
                        {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-charcoal/70">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-burgundy-200 text-burgundy-700 focus:ring-burgundy-400"
                      />
                      <span>Remember my email</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isLoading ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ─── 2. SIGN UP STEP 1 (CREDENTIALS) ─── */}
              {clientSubTab === 'register' && registerStep === 1 && (
                <form onSubmit={handleSignUpStep1} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="couple@wedding.com"
                        className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">
                      Choose Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-10 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                      >
                        {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Wedding Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* ─── 3. SIGN UP STEP 2 (BRIDE & GROOM DETAILS) ─── */}
              {clientSubTab === 'register' && registerStep === 2 && (
                <form onSubmit={handleSignUpStep2} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                        Bride's Name *
                      </label>
                      <div className="relative">
                        <Heart className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-500" />
                        <input
                          type="text"
                          required
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          placeholder="e.g. Priya"
                          className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                        Groom's Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-champagne-700" />
                        <input
                          type="text"
                          required
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          placeholder="e.g. Vikram"
                          className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                        Wedding Date (Optional)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                        <input
                          type="date"
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-charcoal/80">
                        City / Venue (Optional)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/40" />
                        <input
                          type="text"
                          value={weddingCity}
                          onChange={(e) => setWeddingCity(e.target.value)}
                          placeholder="e.g. Udaipur, Jaipur"
                          className="w-full rounded-xl border border-burgundy-100 bg-white py-2.5 pl-8 pr-3 text-xs text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="rounded-xl border border-burgundy-200 px-4 py-3 text-xs font-semibold text-charcoal hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex-1 py-3 text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {isLoading ? (
                        <span>Completing Setup...</span>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Complete &amp; Enter Dashboard</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Prompt to register for new couples */}
              {clientSubTab === 'signin' && (
                <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-center">
                  <p className="text-xs text-stone-600">
                    Are you planning a new wedding celebration?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setClientSubTab('register');
                      setRegisterStep(1);
                      setErrorMessage('');
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-900 hover:text-burgundy-700 hover:underline"
                  >
                    <span>Create Your Couple Account (Start Fresh)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              PORTAL B: COMPANY CRM STAFF ACCESS (DEFAULTS TO /crm)
          ═══════════════════════════════════════════════════════════ */}
          {portalType === 'company' && (
            <form onSubmit={handleStaffSignIn} className="space-y-4">
              <div className="rounded-xl bg-slate-900 p-3.5 text-xs text-slate-300 border border-slate-800">
                <span className="font-bold text-champagne-300 block mb-0.5">Company Administration</span>
                Review and accept/reject service bookings, edit live catalog offerings, and manage client files.
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">
                  Staff Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="admin@knottoday.com"
                    className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-4 text-sm text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-charcoal/80">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-burgundy-100 bg-white py-3 pl-10 pr-10 text-sm text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                  >
                    {showStaffPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-burgundy-950 py-3.5 text-sm font-bold uppercase tracking-wider text-champagne-300 shadow-md hover:bg-burgundy-900 transition-all flex items-center justify-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                <span>Enter Company CRM Portal</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-stone-500">
                  Pre-filled with Knot Today admin credentials for instant access.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto pt-6 text-center text-xs text-charcoal/40">
        &copy; {new Date().getFullYear()} Knot Today Wedding Event Management.
      </div>

      {/* ─── Forgot Password Modal ─── */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-xs text-charcoal/70">
            Enter your registered wedding email and choose a new password.
          </p>

          {forgotError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {forgotError}
            </div>
          )}

          <div>
            <label className="label-field">Registered Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@wedding.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label-field">New Password *</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Reset Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
