import React, { useState } from 'react';
import { HelpCircle, X, ExternalLink, Lightbulb } from 'lucide-react';

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
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF5FF] hover:bg-[#176FF5] text-[#176FF5] hover:text-white text-[10px] font-bold transition-colors cursor-pointer border border-[#176FF5]/20"
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
          <div className="absolute right-0 sm:left-0 top-full mt-1.5 z-40 w-72 sm:w-80 p-4 rounded-2xl bg-white text-[#10233F] shadow-[0_15px_45px_rgba(30,70,120,0.12)] border border-[rgba(24,60,110,0.1)] text-left text-xs space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176FF5]">
                Learning Mechanics
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8A96A8] hover:text-[#10233F] p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-bold text-sm text-[#10233F]">{title}</h4>
            <p className="text-[#607089] leading-relaxed text-[11px]">{description}</p>

            {ruleOfThumb && (
              <div className="p-2.5 rounded-xl bg-amber-50/80 text-[11px] text-amber-950 border border-amber-200/60 font-medium leading-normal flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{ruleOfThumb}</span>
              </div>
            )}

            {onExploreWalkthrough && (
              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onExploreWalkthrough();
                  }}
                  className="text-[11px] font-bold text-[#176FF5] hover:text-[#135CD4] underline cursor-pointer inline-flex items-center gap-1"
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
