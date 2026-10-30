import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, Mail, ArrowRight, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { data } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login({ email: email.trim(), password });
    setIsLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickLogin = async (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
    setIsLoading(true);
    const res = await login({ email: userEmail, password: userPass });
    setIsLoading(false);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Quick login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#103F3C] flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background glow and decorative elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ff9021]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#426B68]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-[#184845]">
        
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#ff9021] text-[#103F3C] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M12 2L4 7v2h16V7L12 2zm0 3.2L15.6 7H8.4L12 5.2zM4 11v9h3v-6h10v6h3v-9H4zm5 9v-4h6v4H9z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103F3C] font-['Poppins',sans-serif] tracking-tight">
            {data.branding.siteName} CMS
          </h1>
          <p className="text-xs text-[#426B68] font-semibold mt-1">
            Role-Based Access Management &amp; Admin Console
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
              Email Address (Staff Login)
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@wildventure.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAFAFA] pl-10 pr-4 py-3 rounded-xl border border-neutral-300 text-sm font-medium text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Leave blank to use master admin key directly
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#103F3C] uppercase tracking-wider mb-1.5">
              Account Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAFAFA] pl-10 pr-10 py-3 rounded-xl border border-neutral-300 text-sm font-medium text-[#103F3C] focus:ring-2 focus:ring-[#ff9021] focus:outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#ff9021] hover:bg-[#EFA812] text-[#103F3C] font-extrabold text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 font-['Poppins',sans-serif] disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Account...' : 'Sign In To Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Staff Logins */}
        <div className="mt-6 pt-5 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff9021]" />
              <span>Instant Test Logins:</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">Click to test role permissions</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@wildventure.com', 'admin123')}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Superadmin</span>
                <span className="text-[10px] bg-emerald-200/80 px-1 rounded font-mono">All Pages</span>
              </div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5 truncate">Arthur Pendelton</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('marcus@wildventure.com', 'editor123')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Content Lead</span>
                <span className="text-[10px] bg-blue-200/80 px-1 rounded font-mono">11 Pages</span>
              </div>
              <div className="text-[10px] text-blue-700/80 mt-0.5 truncate">Marcus Vance</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('elena@wildventure.com', 'rides123')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Park Ops</span>
                <span className="text-[10px] bg-amber-200/80 px-1 rounded font-mono">6 Pages</span>
              </div>
              <div className="text-[10px] text-amber-700/80 mt-0.5 truncate">Elena Rostova</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('david@wildventure.com', 'guest123')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold flex items-center justify-between">
                <span>Ticketing</span>
                <span className="text-[10px] bg-purple-200/80 px-1 rounded font-mono">6 Pages</span>
              </div>
              <div className="text-[10px] text-purple-700/80 mt-0.5 truncate">David Chen</div>
            </button>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-[#426B68] hover:text-[#103F3C] transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>

      </div>
    </div>
  );
};
