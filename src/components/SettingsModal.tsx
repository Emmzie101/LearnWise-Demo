import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { 
  X, 
  RefreshCw, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Database,
  CheckCircle2,
  HelpCircle,
  Globe
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { isDemoAccount, loadDemoAccount, resetToFreshAccount } = useLearner();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A3A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl border border-[#1769FF]/20 shadow-2xl p-6 sm:p-8 space-y-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-[#071A3A]">LearnWise Settings</h2>
            <p className="text-xs text-gray-500">Switch accounts, test diagnostics, or reset data.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Account Switcher Card */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Choose Your Experience
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Option 1: Ada Demo Account */}
            <div
              onClick={() => {
                loadDemoAccount();
                onClose();
                onNavigate('/app/today');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isDemoAccount
                  ? 'bg-[#EAF2FF]/60 border-[#124BCE] ring-2 ring-[#1769FF]/20'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#071A3A] text-[#F4C542] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#071A3A] flex items-center gap-2">
                      Ada's Demo Account
                      {isDemoAccount && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      UNILAG Computer Science student with historical test data, bottlenecks, and study queue.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Fresh Learner Account */}
            <div
              onClick={() => {
                resetToFreshAccount();
                onClose();
                onNavigate('/app/diagnostic');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                !isDemoAccount
                  ? 'bg-[#EAF2FF]/60 border-[#124BCE] ring-2 ring-[#1769FF]/20'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#124BCE] flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#071A3A] flex items-center gap-2">
                      Start as a Fresh Learner
                      {!isDemoAccount && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Clean slate. Start the diagnostic to understand your own learning system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offline & Data Privacy Note */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2 font-semibold text-[#071A3A]">
            <Database className="w-4 h-4 text-[#124BCE]" />
            <span>How your data is saved</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Your notes, goals, and learning progress are stored privately on your device. You can practice closed-book recall even with slow or unstable internet.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigate('/');
            }}
            className="px-4 py-2.5 rounded-xl border border-[#1769FF]/25 hover:bg-[#F0F5FF] text-[#124BCE] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#124BCE]" />
            <span>Go to Landing Page</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
