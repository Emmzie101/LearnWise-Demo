import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { DimensionScoreBar } from '../components/DimensionScoreBar';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { NextBestActionBanner } from '../components/NextBestActionBanner';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Repeat, 
  Compass, 
  ShieldAlert,
  BrainCircuit,
  BarChart3
} from 'lucide-react';

interface AssimilationDashboardViewProps {
  onNavigate: (route: string) => void;
  onStartWalkthrough?: () => void;
}

export const AssimilationDashboardView: React.FC<AssimilationDashboardViewProps> = ({ 
  onNavigate,
  onStartWalkthrough 
}) => {
  const { 
    metrics, 
    dimensions, 
    concepts, 
    recommendations, 
    nextBestAction, 
    profile, 
    goals,
    dismissRecommendation 
  } = useLearner();

  // Concept state counts
  const stateCounts = {
    Introduced: concepts.filter(c => c.state === 'Introduced').length,
    Processed: concepts.filter(c => c.state === 'Processed').length,
    Retrieved: concepts.filter(c => c.state === 'Retrieved').length,
    Applied: concepts.filter(c => c.state === 'Applied').length,
    Reinforced: concepts.filter(c => c.state === 'Reinforced').length,
    Stable: concepts.filter(c => c.state === 'Stable').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A] tracking-tight">
              Telemetry Dashboard
            </h1>
            <VisualCueTooltip
              badgeText="Step 5: Telemetry"
              title="Continuous Calibration Feedback"
              description="LearnWise tracks actual retrieval accuracy versus subjective confidence. If you think you got it right but failed, your calibration penalty rises. When calibration hits 85%+, you are truly ready for exam conditions."
              ruleOfThumb="Confidence without calibration is the definition of exam surprise."
              onExploreWalkthrough={onStartWalkthrough}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Objective performance metrics across memory, transfer, and calibration.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('/app/diagnostic/results')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#071A3A] text-xs font-semibold border border-gray-200 shadow-2xs transition-colors cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#124BCE]" />
            <span>Cognitive Profile</span>
          </button>
          <button
            onClick={() => onNavigate('/app/interventions')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Interventions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 1: RECOMMENDED ACTION */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Recommended Focus
        </div>

        <NextBestActionBanner
          action={nextBestAction}
          onNavigate={onNavigate}
          onDismiss={dismissRecommendation}
        />
      </section>

      {/* SECTION 2: CORE QUANTITATIVE METRICS */}
      <section className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Capability Telemetry
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Capability Index</span>
            <div className="text-3xl font-extrabold font-heading text-[#124BCE]">
              {metrics.capabilityGrowthScore}<span className="text-sm font-normal text-gray-400">/100</span>
            </div>
            <span className="text-[11px] text-gray-400 block pt-0.5">Overall growth</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Recall Accuracy</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-600">
              {metrics.retrievalAccuracy}%
            </div>
            <span className="text-[11px] text-emerald-700/80 block pt-0.5">Closed-book recall</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Transfer Rate</span>
            <div className="text-3xl font-extrabold font-heading text-amber-600">
              {metrics.applicationTransferRate}%
            </div>
            <span className="text-[11px] text-amber-700/80 block pt-0.5">Novel scenario pass</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">Calibration</span>
            <div className="text-3xl font-extrabold font-heading text-indigo-600">
              {metrics.confidenceCalibrationRate}%
            </div>
            <span className="text-[11px] text-indigo-700/80 block pt-0.5">Metacognitive alignment</span>
          </div>
        </div>

        {/* Concept Mastery Pipeline Visualizer */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-[#071A3A] uppercase tracking-wide">Mastery Pipeline</h3>
            <span className="text-xs font-bold text-[#124BCE]">{concepts.length} concepts tracked</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            {Object.entries(stateCounts).map(([stateName, count]) => (
              <div key={stateName} className="p-3 rounded-2xl bg-[#F7FAFF] border border-gray-100">
                <div className="text-lg sm:text-xl font-bold font-heading text-[#071A3A]">{count}</div>
                <div className="text-[11px] font-medium text-gray-500 mt-0.5">{stateName}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ACTIVE BOTTLENECKS */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Active Bottlenecks
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Signal 1: The Retrieval vs Application Gap */}
          <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#071A3A]">
                Transfer Disparity ({metrics.retrievalAccuracy}% vs {metrics.applicationTransferRate}%)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                Active Gap
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Recall is strong on standard definitions, but drops when questions alter wording or context.
            </p>

            <button
              onClick={() => onNavigate('/app/apply')}
              className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Practice Application Scenarios</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Signal 2: Overconfidence / Calibration Drift */}
          <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#071A3A]">
                Fluency Illusion ({metrics.overconfidenceIncidents} Incidents)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                Drift Detected
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              High confidence ratings preceded recall gaps. Re-reading created a sensation of familiarity rather than genuine encoding.
            </p>

            <button
              onClick={() => onNavigate('/app/retrieve')}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Calibrate with Closed-Book Recall</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERVENTIONS */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Targeted Adjustments
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#071A3A] to-[#124BCE] text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#F4C542]">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-sm font-heading">Recommended Adjustments</h3>
            </div>
            <button
              onClick={() => onNavigate('/app/interventions')}
              className="text-xs font-semibold text-white hover:text-[#F4C542] underline cursor-pointer"
            >
              View Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <h4 className="font-bold text-xs text-white">Closed-Book First</h4>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Attempt 2 recall questions before reviewing reference notes.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <h4 className="font-bold text-xs text-white">Dual Scenario Test</h4>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Validate comprehension on 2 novel problems before advancing.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <h4 className="font-bold text-xs text-white">72-Hour Spacing</h4>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Second retrieval scheduled at 3 days to consolidate memory traces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Dimensions Matrix */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          7-Dimension Breakdown
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {dimensions.map(dim => (
            <DimensionScoreBar key={dim.key} dimension={dim} />
          ))}
        </div>
      </section>
    </div>
  );
};
