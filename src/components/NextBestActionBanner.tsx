import React from 'react';
import { Recommendation } from '../types';
import { ArrowRight, Compass, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface NextBestActionBannerProps {
  action: Recommendation | null;
  onNavigate: (route: string) => void;
  onDismiss?: (id: string) => void;
}

export const NextBestActionBanner: React.FC<NextBestActionBannerProps> = ({
  action,
  onNavigate,
  onDismiss,
}) => {
  if (!action) {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF2FF] to-[#F7FAFF] border border-[#1769FF]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white text-[#124BCE] shadow-sm">
            <Sparkles className="w-5 h-5 text-[#F4C542]" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#071A3A]">Your learning system is synchronized</h4>
            <p className="text-xs text-gray-500">All due retrievals and reinforcements are up to date.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/app/capture/new')}
          className="px-3.5 py-1.5 rounded-xl bg-[#124BCE] text-white text-xs font-medium hover:bg-[#1769FF] transition-colors"
        >
          Capture New Material
        </button>
      </div>
    );
  }

  const getPriorityBadge = (p: Recommendation['priority']) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Medium':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-[#071A3A] via-[#0A2558] to-[#071A3A] text-white border border-[#1769FF]/30 shadow-xl shadow-[#124BCE]/10">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1769FF]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#F4C542] text-[#071A3A]">
              <Compass className="w-3 h-3" />
              Next Best Action
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getPriorityBadge(action.priority)}`}>
              {action.priority} Priority
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold font-heading text-white">{action.title}</h3>
          
          <p className="text-xs md:text-sm text-[#EAF2FF]/85 leading-relaxed">
            {action.reason}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[#F4C542]/90 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span><strong>Evidence Signal:</strong> {action.sourceSignal}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(action.id)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#EAF2FF]/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              Postpone
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate(action.actionRoute)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C542] hover:bg-[#F4C542]/90 text-[#071A3A] text-xs md:text-sm font-bold shadow-lg shadow-[#F4C542]/25 transition-all hover:translate-x-0.5 active:scale-95"
          >
            <span>{action.actionPrompt || 'Execute Intervention'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
