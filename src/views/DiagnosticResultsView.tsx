import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { DimensionScoreBar } from '../components/DimensionScoreBar';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  BrainCircuit, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Target,
  RefreshCw,
  Compass
} from 'lucide-react';

interface DiagnosticResultsViewProps {
  onNavigate: (route: string) => void;
  onRetake: () => void;
  onStartWalkthrough?: () => void;
}

export const DiagnosticResultsView: React.FC<DiagnosticResultsViewProps> = ({ 
  onNavigate, 
  onRetake,
  onStartWalkthrough 
}) => {
  const { dimensions, risks, metrics, profile } = useLearner();

  // Sort dimensions to find strengths vs bottlenecks
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const strongest = sorted.slice(0, 2);
  const bottlenecks = sorted.slice(-2);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Step 1: Cognitive Diagnosis</span>
            </div>
            <VisualCueTooltip
              badgeText="Step 1: Bottlenecks"
              title="Why Diagnosis Comes First"
              description="Studying without diagnosing your bottlenecks is like taking medicine before knowing your illness. This profile pinpoints which cognitive dimension causes you to leak marks."
              ruleOfThumb="Fixing your single lowest dimension gives a higher grade boost than 50 extra hours of reading."
              onExploreWalkthrough={onStartWalkthrough}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
            {profile.name}'s Learning System Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Based on your answers across the 7 core dimensions of how you study.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('/app/interventions')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>See What to Fix First</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-300 transition-colors cursor-pointer"
            title="Re-run the diagnostic assessment"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retake Check</span>
          </button>
        </div>
      </div>

      {/* Top 2 Strengths vs Top 2 Bottlenecks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base font-heading">Your Strongest Learning Areas</h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            These are your natural superpowers right now. They give you a strong foundation:
          </p>

          <div className="space-y-3">
            {strongest.map(s => (
              <div key={s.key} className="p-3.5 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between shadow-2xs">
                <div>
                  <h4 className="font-bold text-xs text-[#071A3A]">{s.name}</h4>
                  <span className="text-[11px] text-gray-500">{s.strengthLevel}</span>
                </div>
                <div className="text-lg font-bold font-heading text-emerald-600">{s.score}/100</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottlenecks */}
        <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base font-heading">Where You Get Stuck (Bottlenecks)</h3>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            These are the friction points slowing down your learning. Improving these gives you the fastest boost:
          </p>

          <div className="space-y-3">
            {bottlenecks.map(b => (
              <div key={b.key} className="p-3.5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between shadow-2xs">
                <div>
                  <h4 className="font-bold text-xs text-[#071A3A]">{b.name}</h4>
                  <span className="text-[11px] text-amber-700 font-semibold">{b.riskLevel} Priority</span>
                </div>
                <div className="text-lg font-bold font-heading text-amber-700">{b.score}/100</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Interaction Analysis */}
      <div className="p-6 rounded-3xl bg-white border border-[#1769FF]/15 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#124BCE]" />
          <h3 className="font-bold text-base font-heading text-[#071A3A]">How Your Study Habits Connect</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-3">
          <h4 className="text-xs font-bold text-[#124BCE] uppercase">What happens right now:</h4>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#071A3A]">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-2xs">Re-reading Notes</span>
            <span className="text-[#124BCE]">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">Weak Memory Pathways</span>
            <span className="text-[#124BCE]">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">False Feeling of Knowing</span>
            <span className="text-[#124BCE]">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">Struggling on Exam Day</span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed pt-1">
            <strong>In simple words:</strong> When you re-read notes, the words look familiar, so your brain tricks you into thinking you've mastered the topic. But because you didn't practice recalling without notes, the knowledge disappears when the exam paper is blank. LearnWise will train you to test yourself without notes so you remember under pressure.
          </p>
        </div>
      </div>

      {/* All 7 Dimensions Breakdown */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg font-heading text-[#071A3A]">Your 7 Learning Pillars</h3>
          <p className="text-xs text-gray-500">These scores update continuously as you practice and solve problems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map(dim => (
            <DimensionScoreBar key={dim.key} dimension={dim} />
          ))}
        </div>
      </div>

      {/* Learning Risks */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="font-bold text-lg font-heading text-[#071A3A]">Things to Watch Out For</h3>
            <p className="text-xs text-gray-500">Simple reminders of where bad study habits sneak in.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((risk, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-[#071A3A]">{risk.riskName}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  risk.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {risk.severity} Priority
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{risk.triggerPattern}</p>
              <div className="text-[11px] text-[#124BCE] font-medium pt-1">
                <strong>Recommended fix:</strong> {risk.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
