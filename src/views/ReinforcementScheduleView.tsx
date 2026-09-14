import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { 
  Layers, 
  Clock, 
  Calendar, 
  Repeat, 
  ArrowRight, 
  Sparkles, 
  TrendingDown,
  ShieldCheck
} from 'lucide-react';

interface ReinforcementScheduleViewProps {
  onNavigate: (route: string) => void;
}

export const ReinforcementScheduleView: React.FC<ReinforcementScheduleViewProps> = ({ onNavigate }) => {
  const { concepts } = useLearner();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Distributed Spaced Reinforcement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
          Spaced Reinforcement Schedule
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Intercept the Ebbinghaus forgetting curve through strategically timed, expanding retrieval intervals.
        </p>
      </div>

      {/* Forgetting Curve Concept Explanation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#071A3A] to-[#124BCE] text-white space-y-4">
        <div className="flex items-center gap-2 text-[#F4C542]">
          <TrendingDown className="w-5 h-5" />
          <h3 className="font-bold text-base font-heading">The Science of Expanding Intervals</h3>
        </div>

        <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-3xl">
          Without active retrieval, human memory retention drops by over 60% within 48 hours. By prompting recall at Day 1, Day 3, Day 7, and Day 14, LearnWise flattens your memory decay curve until the concept reaches permanent long-term stability.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] uppercase text-[#F4C542] font-bold">1st Interval</span>
            <div className="text-xl font-bold font-heading">Day 1 (24h)</div>
            <p className="text-[10px] text-white/70">Reconstruct foundations</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] uppercase text-[#F4C542] font-bold">2nd Interval</span>
            <div className="text-xl font-bold font-heading">Day 3 (72h)</div>
            <p className="text-[10px] text-white/70">Deepen neural traces</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] uppercase text-[#F4C542] font-bold">3rd Interval</span>
            <div className="text-xl font-bold font-heading">Day 7 (1 Wk)</div>
            <p className="text-[10px] text-white/70">Transfer and edge cases</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] uppercase text-[#F4C542] font-bold">4th Interval</span>
            <div className="text-xl font-bold font-heading">Day 14+</div>
            <p className="text-[10px] text-white/70">Permanent schema consolidation</p>
          </div>
        </div>
      </div>

      {/* Concepts Spaced Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg font-heading text-[#071A3A]">
            Current Concept Reinforcement Cadence
          </h3>
          <span className="text-xs text-gray-500">{concepts.length} tracked items</span>
        </div>

        <div className="space-y-3">
          {concepts.map(concept => (
            <div 
              key={concept.id}
              className="p-5 rounded-3xl bg-white border border-[#1769FF]/15 shadow-xs hover:border-[#1769FF]/35 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#124BCE] uppercase">{concept.domain}</span>
                  <span className="text-gray-300">•</span>
                  <ConceptStateBadge state={concept.state} />
                </div>
                <h4 className="font-bold text-base text-[#071A3A]">{concept.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{concept.definition}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#071A3A]">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Interval: {concept.reinforcementIntervalDays} days</span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Recall: {concept.recallSuccessCount} success / {concept.recallFailureCount} miss
                  </span>
                </div>

                <button
                  onClick={() => onNavigate(`/app/retrieve/${concept.id}`)}
                  className="px-4 py-2 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Practice Retrieval</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
