import { useState } from 'react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    const res = await loginWithCredentials(email, password);
    if (!res.success) {
      setError(res.message || 'Authentication failed. Please check your credentials.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-burgundy-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-charcoal/40 hover:bg-burgundy-50 hover:text-charcoal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy-700 text-white shadow-md">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-burgundy-950">Couple Portal Sign In</h2>
          <p className="mt-1 text-xs text-charcoal/60">
            Sign in with your registered wedding account credentials
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-charcoal/70">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="couple@wedding.com"
                className="w-full rounded-xl border border-burgundy-100 py-2.5 pl-9 pr-3 text-sm focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-charcoal/70">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-burgundy-100 py-2.5 pl-9 pr-3 text-sm focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-burgundy-700 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-burgundy-800"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 border-t border-stone-100 pt-4 text-center">
          <Link
            to="/login"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-900 hover:underline"
          >
            <span>Don't have an account? Register as New Couple</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
