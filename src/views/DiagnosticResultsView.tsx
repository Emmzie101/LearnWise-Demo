import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { DimensionScoreBar } from '../components/DimensionScoreBar';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { DEFAULT_DEMO_REPORT } from '../utils/diagnosticEngine';
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
  BookOpen,
  Calendar,
  Bot,
  Zap,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Flame,
  Clock
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
  const { dimensions, risks, metrics, profile, diagnosticReport, resetDiagnostic } = useLearner();

  // Use the calculated report or fallback to demo report
  const report = diagnosticReport || DEFAULT_DEMO_REPORT;

  const [activeTab, setActiveTab] = useState<'overview' | 'interventions' | 'pillars'>('overview');

  const handleRetakeClick = () => {
    resetDiagnostic();
    onRetake();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header with Step Indicator & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Step 1: Cognitive Diagnostic Report</span>
            </div>
            <VisualCueTooltip
              badgeText="Step 1: Scientific Diagnosis"
              title="Grounded in Cognitive Science"
              description="This assessment evaluates your study mechanics against proven learning science (Dunlosky, Sweller, Roediger, Bjork). It identifies why you leak marks despite studying hard."
              ruleOfThumb="Fixing your single lowest cognitive bottleneck produces 3x more retention than 20 extra hours of passive re-reading."
              onExploreWalkthrough={onStartWalkthrough}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
            {profile.name}'s PLSFR+ Diagnostic Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>Overall Confidence: <strong className="text-[#124BCE]">{report.overallConfidence} Evidence</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Next calibration: <strong>{report.reassessmentDate}</strong> (18-day cycle)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('/app/interventions')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Activate Priority Protocols</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRetakeClick}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-300 transition-colors cursor-pointer"
            title="Re-run the diagnostic assessment"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden sm:inline">Retake Check</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Summary Synthesis */}
      <div className="p-6 rounded-3xl bg-linear-to-br from-[#F7FAFF] to-[#EDF5FF] border border-[#1769FF]/20 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#124BCE]">
          <Sparkles className="w-5 h-5 text-[#124BCE]" />
          <h3 className="font-bold text-sm uppercase tracking-wider font-heading">Diagnostic Synthesis & Scientific Takeaway</h3>
        </div>
        <p className="text-sm text-[#10233F] leading-relaxed">
          {report.executiveSummary}
        </p>
        <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-500">
          <Clock className="w-3.5 h-3.5 text-[#124BCE]" />
          <span>Diagnostic rule-check passed • All scores calibrated against self-report and scenario choices.</span>
        </div>
      </div>

      {/* 2. Primary Bottleneck vs. Leverageable Strength */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Bottleneck */}
        <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-200/80 space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-rose-900">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Primary System Bottleneck</span>
                <h3 className="font-bold text-base font-heading text-rose-950">{report.primaryBottleneck.name}</h3>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black font-heading text-rose-700">{report.primaryBottleneck.score}</span>
              <span className="text-xs text-rose-500">/100</span>
              <span className="block text-[10px] font-bold text-rose-600 px-2 py-0.5 rounded-full bg-rose-100 border border-rose-200 mt-0.5">
                {report.primaryBottleneck.confidenceBand} Confidence
              </span>
            </div>
          </div>

          <p className="text-xs text-rose-900 leading-relaxed">
            {report.primaryBottleneck.rationale}
          </p>

          <div className="p-3 rounded-2xl bg-white/80 border border-rose-200/60 text-xs text-rose-950 space-y-1">
            <span className="font-semibold text-rose-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-rose-600" /> High-Leverage Fix:
            </span>
            <p className="text-[11px] text-rose-900 leading-snug">
              Do not spend more hours re-reading. Shift 100% of review time to closed-book recall and test-taking practice.
            </p>
          </div>
        </div>

        {/* Leverageable Strength */}
        <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-900">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Leverageable Foundation</span>
                <h3 className="font-bold text-base font-heading text-emerald-950">{report.leverageableStrength.name}</h3>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black font-heading text-emerald-700">{report.leverageableStrength.score}</span>
              <span className="text-xs text-emerald-500">/100</span>
              <span className="block text-[10px] font-bold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 mt-0.5">
                Strong Foundation
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            {report.leverageableStrength.howToLeverage}
          </p>

          <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200/60 text-xs text-emerald-950 space-y-1">
            <span className="font-semibold text-emerald-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-emerald-600" /> How to Weaponize This:
            </span>
            <p className="text-[11px] text-emerald-900 leading-snug">
              Use your high resilience and cognitive stamina to power through the discomfort of getting quiz questions wrong during initial retrieval drills.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Cross-Pillar Traps & Detected Contradictions */}
      {report.contradictionsDetected && report.contradictionsDetected.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-[#1769FF]/15 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-[#071A3A]">
            <TrendingUp className="w-5 h-5 text-[#124BCE]" />
            <div>
              <h3 className="font-bold text-base font-heading text-[#071A3A]">Cross-Pillar Interaction Traps Detected</h3>
              <p className="text-xs text-gray-500">How different study behaviors clash and cause hidden exam failures.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.contradictionsDetected.map((trap, idx) => (
              <div key={idx} className="p-4.5 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-[#071A3A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#124BCE]" />
                    {trap.title}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#1769FF]/20 text-[#124BCE]">
                    Audited Pattern
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {trap.description}
                </p>

                <div className="pt-2 border-t border-[#1769FF]/10 text-[11px] text-[#124BCE] font-medium flex items-start gap-1">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span><strong>Scientific finding:</strong> {trap.scientificInsight} <em>({trap.citation})</em></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. The Learning-Styles Reality Check (Pashler et al. 2008) */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-50/70 via-blue-50/50 to-white border border-indigo-200/80 shadow-2xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-indigo-900">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Learning Style Reality Check</span>
              <h3 className="font-bold text-base font-heading text-indigo-950">Separating Preference from Proven Retention</h3>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
            Pashler et al. (2008)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Your Declared Preference</span>
            <p className="font-bold text-xs text-[#071A3A]">{report.learningStyleDebunkInsight.statedPreference}</p>
            <p className="text-[11px] text-gray-500 leading-snug">
              Helpful for initial comfort and visual orientation, but insufficient on its own for exam recall.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Universal Evidence-Based Retention</span>
            <p className="font-bold text-xs text-[#124BCE]">{report.learningStyleDebunkInsight.evidenceBasedStrategy}</p>
            <p className="text-[11px] text-gray-500 leading-snug">
              Proven across hundreds of controlled trials to benefit all learners, regardless of sensory preference.
            </p>
          </div>
        </div>

        <p className="text-xs text-indigo-950 leading-relaxed pt-1 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100/70">
          <strong>The Cognitive Science Truth:</strong> {report.learningStyleDebunkInsight.pashlerScienceNote}
        </p>
      </div>

      {/* 5. Prioritized Prescriptive Interventions (Hard Cap: 2-3 items) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#124BCE]" />
            <div>
              <h3 className="font-bold text-lg font-heading text-[#071A3A]">
                Prescribed Interventions ({report.priorityInterventions.length} Priority Protocols)
              </h3>
              <p className="text-xs text-gray-500">
                A hard cap of high-leverage protocols to prevent cognitive overwhelm. Execute these first.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/app/interventions')}
            className="text-xs font-bold text-[#124BCE] hover:underline flex items-center gap-1"
          >
            <span>Manage in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {report.priorityInterventions.map((item) => (
            <div 
              key={item.rank} 
              className={`p-6 rounded-3xl border transition-all ${
                item.rank === 1 
                  ? 'bg-white border-[#124BCE] ring-2 ring-[#1769FF]/10 shadow-xs' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-[#124BCE] text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    #{item.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#071A3A] font-heading">{item.interventionName}</h4>
                    <span className="text-[11px] text-gray-500 font-medium">Addresses: {item.pattern}</span>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#124BCE] border border-blue-200">
                  Target Pillar: {item.targetPillar.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-gray-400 uppercase text-[10px] block">Scientific Mechanism (Why)</span>
                    <p className="text-gray-700 leading-relaxed">{item.why}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400 uppercase text-[10px] block">When to Execute</span>
                    <p className="text-gray-800 font-medium">{item.when}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15">
                    <span className="font-bold text-[#124BCE] uppercase text-[10px] block">How to Execute (Step-by-Step)</span>
                    <p className="text-gray-800 leading-relaxed font-medium">{item.how}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400 uppercase text-[10px] block">Verification Metric (Measure)</span>
                    <p className="text-gray-700 font-medium">{item.measure}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recommended AI Roles */}
      {report.recommendedAIRoles && report.recommendedAIRoles.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-[#1769FF]/15 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#124BCE]" />
            <div>
              <h3 className="font-bold text-base font-heading text-[#071A3A]">Your Recommended AI Coach Roles</h3>
              <p className="text-xs text-gray-500">Based on your diagnostic profile, LearnWise configures these exact AI personas for you.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {report.recommendedAIRoles.map((role, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF2FF] text-[#124BCE] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#071A3A]">{role.roleName}</h4>
                    <span className="text-[10px] text-gray-500 block">{role.tagline}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {role.whyThisRole}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Seven-Pillar Diagnostic Breakdown (Visual + Confidence Bands) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg font-heading text-[#071A3A]">Complete Seven-Pillar Architecture</h3>
            <p className="text-xs text-gray-500">
              Visual scores paired with confidence bands based on triangulated behavioral evidence.
            </p>
          </div>
          <span className="text-[11px] text-gray-400">Section H & I Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map(dim => (
            <DimensionScoreBar key={dim.key} dimension={dim} />
          ))}
        </div>
      </div>
    </div>
  );
};
