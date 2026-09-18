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
        return 'bg-[#EDF5FF] text-[#176FF5] border-[#176FF5]/20';
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
    if (score >= 85) return 'bg-[#176FF5]';
    if (score >= 70) return 'bg-[#176FF5]/90';
    if (score >= 55) return 'bg-[#176FF5]/70';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getConfidenceBadge = (band?: 'Low' | 'Moderate' | 'High') => {
    switch (band) {
      case 'High':
        return { text: 'High Evidence', style: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'Moderate':
        return { text: 'Mod Evidence', style: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'Low':
      default:
        return { text: 'Initial Signal', style: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const confInfo = getConfidenceBadge(dimension.confidenceBand || (dimension.confidence >= 80 ? 'High' : dimension.confidence >= 60 ? 'Moderate' : 'Low'));

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#10233F] truncate max-w-[170px]">{dimension.name}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.2 rounded font-medium border bg-slate-50 text-slate-600 border-slate-200">
              {confInfo.text}
            </span>
            <span className="font-semibold text-[#176FF5]">{dimension.score}</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-[#EDF5FF] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(dimension.score)}`}
            style={{ width: `${Math.max(5, Math.min(100, dimension.score))}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4.5 rounded-2xl bg-white border border-[rgba(24,60,110,0.07)] shadow-xs space-y-3 hover:border-[#176FF5]/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-[#10233F] text-sm md:text-base">{dimension.name}</h4>
          <p className="text-xs text-[#607089] line-clamp-2 mt-0.5">{dimension.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="text-xl font-bold font-heading text-[#176FF5]">{dimension.score}<span className="text-xs font-normal text-[#8A96A8]">/100</span></span>
          </div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${confInfo.style}`}>
              {confInfo.text}
            </span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getBadgeStyle(dimension.strengthLevel)}`}>
              {dimension.strengthLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-2 w-full bg-[#EDF5FF] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(dimension.score)}`}
            style={{ width: `${Math.max(4, Math.min(100, dimension.score))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8A96A8] pt-0.5">
          <span>Triangulated evidence: <strong>{dimension.evidenceCount} indicators</strong></span>
          <span>Risk signal: <strong className={dimension.riskLevel === 'Elevated' ? 'text-rose-600' : 'text-[#607089]'}>{dimension.riskLevel}</strong></span>
        </div>
      </div>
    </div>
  );
};
