import React from 'react';
import { ConceptState } from '../types';

interface ConceptStateBadgeProps {
  state: ConceptState;
  showProgressChain?: boolean;
}

export const ConceptStateBadge: React.FC<ConceptStateBadgeProps> = ({ state, showProgressChain = false }) => {
  const stateConfig: Record<ConceptState, { label: string; color: string; step: number }> = {
    New: { label: 'New', color: 'bg-gray-100 text-gray-700 border-gray-300', step: 1 },
    Introduced: { label: 'Introduced', color: 'bg-blue-50 text-blue-700 border-blue-200', step: 2 },
    Processed: { label: 'Processed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', step: 3 },
    Retrieved: { label: 'Retrieved', color: 'bg-purple-50 text-purple-700 border-purple-200', step: 4 },
    Applied: { label: 'Applied', color: 'bg-amber-50 text-amber-800 border-amber-300', step: 5 },
    Reinforced: { label: 'Reinforced', color: 'bg-teal-50 text-teal-700 border-teal-200', step: 6 },
    Stable: { label: 'Stable Mastery', color: 'bg-emerald-50 text-emerald-700 border-emerald-300', step: 7 },
  };

  const current = stateConfig[state] || stateConfig.New;

  if (showProgressChain) {
    const chain: ConceptState[] = ['Introduced', 'Processed', 'Retrieved', 'Applied', 'Reinforced', 'Stable'];
    return (
      <div className="flex items-center gap-1 text-[10px] overflow-x-auto py-1">
        {chain.map((st, i) => {
          const isPassed = stateConfig[st].step <= current.step;
          const isCurrent = st === state;
          return (
            <React.Fragment key={st}>
              <span
                className={`px-1.5 py-0.5 rounded font-medium border transition-colors ${
                  isCurrent
                    ? 'bg-[#124BCE] text-white border-[#124BCE] font-semibold'
                    : isPassed
                    ? 'bg-[#EAF2FF] text-[#124BCE] border-[#1769FF]/20'
                    : 'bg-gray-50 text-gray-400 border-gray-200'
                }`}
              >
                {st}
              </span>
              {i < chain.length - 1 && (
                <span className={`text-[10px] ${isPassed ? 'text-[#124BCE]' : 'text-gray-300'}`}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${current.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {current.label}
    </span>
  );
};
