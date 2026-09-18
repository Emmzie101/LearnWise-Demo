import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
  onExploreDemo?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
  onExploreDemo,
}) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  // Sync mode with initialMode when opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setEmailConfirmationSent(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMessage(null);
    setEmailConfirmationSent(false);
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setEmailConfirmationSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      const { data, error } = await signUp(email, password, name);
      setLoading(false);

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          setErrorMessage('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('weak') || error.message.includes('Password')) {
          setErrorMessage('Please use a stronger password (at least 6 characters).');
        } else {
          setErrorMessage(error.message || 'Failed to create your account. Please try again.');
        }
        return;
      }

      // Check if session was returned directly or if email confirmation is required
      if (data?.user && !data?.session) {
        setEmailConfirmationSent(true);
      } else {
        // Immediate session established (email confirmation disabled in Supabase)
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      }
    } else {
      // Sign in mode
      const { error } = await signIn(email, password);
      setLoading(false);

      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Your email address has not been confirmed yet. Please check your inbox for the verification link.');
        } else {
          setErrorMessage(error.message || 'Failed to sign in. Please verify your internet connection.');
        }
        return;
      }

      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A3A]/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-[rgba(24,60,110,0.12)] shadow-[0_25px_60px_rgba(7,26,58,0.2)] p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-[#071A3A] hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#10233F] text-white flex items-center justify-center shadow-xs">
            <BrainCircuit className="w-5 h-5 text-[#176FF5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base font-heading text-[#10233F]">LearnWise</span>
              <span className="text-[10px] text-[#176FF5] font-bold px-1.5 py-0.5 rounded-md bg-[#EDF5FF]">
                PLSFR+
              </span>
            </div>
            <p className="text-xs text-[#607089]">Personalized Learning Operating System</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F8FAFD] border border-gray-200/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#176FF5] shadow-xs'
                : 'text-[#607089] hover:text-[#10233F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#176FF5] shadow-xs'
                : 'text-[#607089] hover:text-[#10233F]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Email Confirmation Notice Screen */}
        {emailConfirmationSent ? (
          <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-[#10233F]">Verification Email Sent</h3>
              <p className="text-xs text-[#607089] max-w-xs mx-auto leading-relaxed">
                Your LearnWise account was created for <strong className="text-[#10233F]">{email}</strong>. Please check your inbox and click the confirmation link to activate your workspace.
              </p>
            </div>
            <button
              onClick={() => {
                switchMode('signin');
              }}
              className="w-full btn-primary-glow py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Name input (only for Sign Up) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#10233F]">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8A96A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adaobi Okafor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#10233F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#176FF5]/30 focus:border-[#176FF5]"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#10233F]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A96A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#10233F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#176FF5]/30 focus:border-[#176FF5]"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#10233F]">Password</label>
                {mode === 'signup' && (
                  <span className="text-[10px] text-[#8A96A8]">Min. 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A96A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#10233F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#176FF5]/30 focus:border-[#176FF5]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-glow py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Account Alternative Option */}
        {onExploreDemo && (
          <div className="pt-2 border-t border-gray-100 flex flex-col items-center gap-2">
            <span className="text-[11px] text-[#8A96A8]">Looking to test without an account?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreDemo();
              }}
              className="text-xs font-semibold text-[#176FF5] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore Demo Account (Adaeze, UNILAG)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
