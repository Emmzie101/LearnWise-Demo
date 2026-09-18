import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { InterventionPlanItem } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface InterventionsViewProps {
  onNavigate: (route: string) => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({ onNavigate }) => {
  const { interventions, updateInterventionStatus } = useLearner();

  const getPriorityStyle = (p: InterventionPlanItem['priority']) => {
    switch (p) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
      default:
        return 'bg-[#EDF5FF] text-[#176FF5] border-[#176FF5]/20';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(24,60,110,0.06)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5FF] text-[#176FF5] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Targeted Improvement Protocols (PLS-IP)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F] tracking-tight">
            Active Study Action Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#607089] mt-0.5">
            Step-by-step evidence-based protocols targeted directly at your detected learning bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/app/ai-coach')}
            className="btn-primary-glow flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Consult AI Coach</span>
          </button>
        </div>
      </div>

      {/* Plan Grid */}
      <div className="space-y-4">
        {interventions.map(plan => (
          <div 
            key={plan.id}
            className={`p-6 sm:p-7 rounded-3xl bg-white border transition-all ${
              plan.status === 'Completed' 
                ? 'border-[rgba(24,60,110,0.06)] opacity-75' 
                : 'border-[rgba(24,60,110,0.08)] hover:border-[#176FF5]/30 shadow-[0_8px_30px_rgba(30,70,120,0.04)]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityStyle(plan.priority)}`}>
                    {plan.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-[#8A96A8]">
                    Remediates: {plan.targetBottleneck}
                  </span>
                  {plan.status === 'Completed' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold font-heading text-[#10233F]">
                  {plan.interventionName}
                </h3>

                <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
                  {plan.description}
                </p>

                {/* Plain-language explanation */}
                <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-1">
                  <div className="text-[11px] font-bold text-[#176FF5] uppercase tracking-wider">Cognitive Science Rationale:</div>
                  <p className="text-xs text-[#607089] leading-relaxed">{plan.rationale}</p>
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
                      className="px-4 py-2 rounded-xl bg-[#EDF5FF] hover:bg-[#DCEBFF] text-[#176FF5] text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer border border-[#176FF5]/20"
                    >
                      <span>Practice in Today</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => updateInterventionStatus(plan.id, 'Active')}
                    className="px-4 py-2 rounded-xl bg-[#F8FAFD] hover:bg-gray-100 text-[#607089] text-xs font-semibold cursor-pointer border border-[rgba(24,60,110,0.08)]"
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
