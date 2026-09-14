import React, { useState } from 'react';
import { HelpCircle, X, ExternalLink } from 'lucide-react';

interface VisualCueTooltipProps {
  cueId?: string;
  badgeText?: string;
  title: string;
  description: string;
  ruleOfThumb?: string;
  onExploreWalkthrough?: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const VisualCueTooltip: React.FC<VisualCueTooltipProps> = ({
  badgeText = 'Why this step matters',
  title,
  description,
  ruleOfThumb,
  onExploreWalkthrough,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
        title="View explanation of this cognitive step"
      >
        <HelpCircle className="w-3 h-3" />
        <span>{badgeText}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 sm:left-0 top-full mt-1.5 z-40 w-72 sm:w-80 p-4 rounded-2xl bg-[#071A3A] text-white shadow-xl border border-white/15 text-left text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4C542]">
                Learning Mechanics
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-bold text-sm text-white">{title}</h4>
            <p className="text-white/80 leading-relaxed text-[11px]">{description}</p>

            {ruleOfThumb && (
              <div className="p-2 rounded-xl bg-white/10 text-[10px] text-amber-200 border border-white/10 font-medium leading-normal">
                💡 {ruleOfThumb}
              </div>
            )}

            {onExploreWalkthrough && (
              <div className="pt-1 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onExploreWalkthrough();
                  }}
                  className="text-[11px] font-bold text-[#F4C542] hover:text-white underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Open Full Walkthrough</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
