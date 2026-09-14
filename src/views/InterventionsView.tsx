import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { InterventionPlanItem } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Flame, 
  Clock, 
  Layers, 
  Repeat
} from 'lucide-react';

interface InterventionsViewProps {
  onNavigate: (route: string) => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({ onNavigate }) => {
  const { interventions, updateInterventionStatus, profile } = useLearner();

  const getPriorityStyle = (p: InterventionPlanItem['priority']) => {
    switch (p) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Your Improvement Plan (PLS-IP)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
            Active Study Action Plan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Step-by-step habits targeted directly at your main learning bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/app/ai-coach')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A3A] hover:bg-[#124BCE] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
            <span>Discuss with AI Coach</span>
          </button>
        </div>
      </div>

      {/* Plan Grid */}
      <div className="space-y-4">
        {interventions.map(plan => (
          <div 
            key={plan.id}
            className={`p-6 rounded-3xl bg-white border transition-all shadow-2xs ${
              plan.status === 'Completed' 
                ? 'border-gray-200 opacity-75' 
                : 'border-[#1769FF]/20 hover:border-[#1769FF]/40'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityStyle(plan.priority)}`}>
                    {plan.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Fixes: {plan.targetBottleneck}
                  </span>
                  {plan.status === 'Completed' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold font-heading text-[#071A3A]">
                  {plan.interventionName}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {plan.description}
                </p>

                {/* Plain-language explanation */}
                <div className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-1">
                  <div className="text-[11px] font-bold text-[#124BCE] uppercase">Why this helps:</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{plan.rationale}</p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2 shrink-0 md:w-44">
                {plan.status !== 'Completed' ? (
                  <>
                    <button
                      onClick={() => updateInterventionStatus(plan.id, 'Completed')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </button>
                    <button
                      onClick={() => onNavigate('/app/today')}
                      className="px-4 py-2 rounded-xl bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Practice in Today</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => updateInterventionStatus(plan.id, 'Active')}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold cursor-pointer"
                  >
                    Mark as Active
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
