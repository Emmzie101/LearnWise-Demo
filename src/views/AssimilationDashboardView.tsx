import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { DimensionScoreBar } from '../components/DimensionScoreBar';
import { NextBestActionBanner } from '../components/NextBestActionBanner';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  BrainCircuit,
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
    nextBestAction, 
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(24,60,110,0.06)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F] tracking-tight">
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
          <p className="text-xs sm:text-sm text-[#607089] mt-0.5">
            Objective performance metrics across memory consolidation, scenario transfer, and confidence calibration.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('/app/diagnostic/results')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFD] text-[#10233F] text-xs font-semibold border border-[rgba(24,60,110,0.1)] shadow-xs transition-colors cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#176FF5]" />
            <span>Cognitive Profile</span>
          </button>
          <button
            onClick={() => onNavigate('/app/interventions')}
            className="btn-primary-glow flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Interventions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 1: RECOMMENDED ACTION */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8A96A8]">
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
        <div className="text-xs font-bold uppercase tracking-wider text-[#8A96A8]">
          Capability Telemetry
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-[#8A96A8] uppercase tracking-wide">Capability Index</span>
            <div className="text-3xl font-extrabold font-heading text-[#176FF5]">
              {metrics.capabilityGrowthScore}<span className="text-sm font-normal text-[#8A96A8]">/100</span>
            </div>
            <span className="text-[11px] text-[#8A96A8] block pt-0.5">Overall growth</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Recall Accuracy</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-600">
              {metrics.retrievalAccuracy}%
            </div>
            <span className="text-[11px] text-emerald-700/80 block pt-0.5">Closed-book recall</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Transfer Rate</span>
            <div className="text-3xl font-extrabold font-heading text-amber-600">
              {metrics.applicationTransferRate}%
            </div>
            <span className="text-[11px] text-amber-700/80 block pt-0.5">Novel scenario pass</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-[#176FF5] uppercase tracking-wide">Calibration</span>
            <div className="text-3xl font-extrabold font-heading text-[#176FF5]">
              {metrics.confidenceCalibrationRate}%
            </div>
            <span className="text-[11px] text-[#176FF5]/80 block pt-0.5">Metacognitive alignment</span>
          </div>
        </div>

        {/* Concept Mastery Pipeline Visualizer */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-[#10233F] uppercase tracking-wide">Mastery Pipeline</h3>
            <span className="text-xs font-bold text-[#176FF5]">{concepts.length} concepts tracked</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-center">
            {Object.entries(stateCounts).map(([stateName, count]) => (
              <div key={stateName} className="p-3 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)]">
                <div className="text-lg sm:text-xl font-bold font-heading text-[#10233F]">{count}</div>
                <div className="text-[11px] font-medium text-[#607089] mt-0.5">{stateName}</div>
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
          <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-[0_8px_25px_rgba(220,38,38,0.03)] space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#10233F]">
                Transfer Disparity ({metrics.retrievalAccuracy}% vs {metrics.applicationTransferRate}%)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                Active Gap
              </span>
            </div>

            <p className="text-xs text-[#607089] leading-relaxed">
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
          <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-[0_8px_25px_rgba(217,119,6,0.03)] space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#10233F]">
                Fluency Illusion ({metrics.overconfidenceIncidents} Incidents)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                Drift Detected
              </span>
            </div>

            <p className="text-xs text-[#607089] leading-relaxed">
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
        <div className="text-xs font-bold uppercase tracking-wider text-[#8A96A8]">
          Targeted Adjustments
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_10px_35px_rgba(30,70,120,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#176FF5]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm font-heading text-[#10233F]">Recommended Protocol Adjustments</h3>
            </div>
            <button
              onClick={() => onNavigate('/app/interventions')}
              className="text-xs font-semibold text-[#176FF5] hover:underline cursor-pointer"
            >
              View Full Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-1">
              <h4 className="font-bold text-xs text-[#10233F]">Closed-Book First</h4>
              <p className="text-[11px] text-[#607089] leading-relaxed">
                Attempt 2 recall questions before reviewing reference notes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-1">
              <h4 className="font-bold text-xs text-[#10233F]">Dual Scenario Test</h4>
              <p className="text-[11px] text-[#607089] leading-relaxed">
                Validate comprehension on 2 novel problems before advancing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-1">
              <h4 className="font-bold text-xs text-[#10233F]">72-Hour Spacing</h4>
              <p className="text-[11px] text-[#607089] leading-relaxed">
                Second retrieval scheduled at 3 days to consolidate memory traces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Dimensions Matrix */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8A96A8]">
          7-Dimension Cognitive Breakdown
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
