import React from 'react';
import { PlsfrDimension } from '../types';

interface DimensionScoreBarProps {
  dimension: PlsfrDimension;
  compact?: boolean;
}

export const DimensionScoreBar: React.FC<DimensionScoreBarProps> = ({ dimension, compact = false }) => {
  // Qualitative strength color and border
  const getBadgeStyle = (level: PlsfrDimension['strengthLevel']) => {
    switch (level) {
      case 'Highly Developed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Strong':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Functional':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Emerging':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Developing':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-[#1769FF]';
    if (score >= 70) return 'bg-[#124BCE]';
    if (score >= 55) return 'bg-[#1769FF]/80';
    if (score >= 40) return 'bg-[#F4C542]';
    return 'bg-rose-500';
  };

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#071A3A] truncate max-w-[180px]">{dimension.name}</span>
          <span className="font-semibold text-[#124BCE]">{dimension.score}</span>
        </div>
        <div className="h-1.5 w-full bg-[#EAF2FF] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(dimension.score)}`}
            style={{ width: `${Math.max(5, Math.min(100, dimension.score))}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white border border-[#1769FF]/15 shadow-sm space-y-3 hover:border-[#1769FF]/35 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-[#071A3A] text-sm md:text-base">{dimension.name}</h4>
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{dimension.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-bold font-heading text-[#124BCE]">{dimension.score}<span className="text-xs font-normal text-gray-400">/100</span></div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border mt-1 ${getBadgeStyle(dimension.strengthLevel)}`}>
            {dimension.strengthLevel}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-2 w-full bg-[#EAF2FF] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(dimension.score)}`}
            style={{ width: `${Math.max(4, Math.min(100, dimension.score))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
          <span>Evidence points: {dimension.evidenceCount}</span>
          <span>Risk signal: <strong className={dimension.riskLevel === 'Elevated' ? 'text-rose-600' : 'text-gray-700'}>{dimension.riskLevel}</strong></span>
        </div>
      </div>
    </div>
  );
};
