import React from 'react';
import { Recommendation } from '../types';
import { ArrowRight, Compass, Sparkles, AlertCircle } from 'lucide-react';

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
      <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#EDF5FF] text-[#176FF5] shadow-2xs">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#10233F]">Your learning system is synchronized</h4>
            <p className="text-xs text-[#607089]">All due retrievals and reinforcements are up to date.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/app/capture/new')}
          className="btn-primary-glow px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
        return 'bg-[#EDF5FF] text-[#176FF5] border-[#176FF5]/20';
    }
  };

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl bg-white text-[#10233F] border border-[rgba(24,60,110,0.08)] shadow-[0_10px_35px_rgba(30,70,120,0.06)]">
      {/* Subtle background atmospheric glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#176FF5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#EDF5FF] text-[#176FF5]">
              <Compass className="w-3 h-3" />
              Next Best Action
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getPriorityBadge(action.priority)}`}>
              {action.priority} Priority
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold font-heading text-[#10233F]">{action.title}</h3>
          
          <p className="text-xs md:text-sm text-[#607089] leading-relaxed">
            {action.reason}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-amber-800 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span><strong>Evidence Signal:</strong> {action.sourceSignal}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(action.id)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#8A96A8] hover:text-[#10233F] hover:bg-[#F8FAFD] transition-colors cursor-pointer"
            >
              Postpone
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate(action.actionRoute)}
            className="btn-primary-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all hover:translate-x-0.5 active:scale-95 cursor-pointer"
          >
            <span>{action.actionPrompt || 'Execute Intervention'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
