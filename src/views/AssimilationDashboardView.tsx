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
    dismissRecommendation,
    bottleneckRecommendation,
    interventions,
  } = useLearner();

  // Active interventions for dynamic protocol adjustments
  const activeInterventions = interventions.filter(i => i.status === 'Active');

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
          Observed Telemetry Metrics
        </div>

        {/* 4 Quantitative Metric Cards - Truthful, verified measurements */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Recall Accuracy</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-600">
              {metrics.retrievalAccuracy !== null ? `${metrics.retrievalAccuracy}%` : 'Pending'}
            </div>
            <span className="text-[11px] text-emerald-700/80 block pt-0.5">Closed-book recall tests</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Transfer Rate</span>
            <div className="text-3xl font-extrabold font-heading text-amber-600">
              {metrics.applicationTransferRate !== null ? `${metrics.applicationTransferRate}%` : 'Pending'}
            </div>
            <span className="text-[11px] text-amber-700/80 block pt-0.5">Novel scenario pass rate</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-[#176FF5] uppercase tracking-wide">Calibration</span>
            <div className="text-3xl font-extrabold font-heading text-[#176FF5]">
              {metrics.confidenceCalibrationRate !== null ? `${metrics.confidenceCalibrationRate}%` : 'Pending'}
            </div>
            <span className="text-[11px] text-[#176FF5]/80 block pt-0.5">Metacognitive alignment</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_8px_25px_rgba(30,70,120,0.03)] space-y-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">Retention Durability</span>
            <div className="text-3xl font-extrabold font-heading text-indigo-600">
              {metrics.retentionDurability !== null ? `${metrics.retentionDurability}%` : 'Pending'}
            </div>
            <span className="text-[11px] text-indigo-700/80 block pt-0.5">Consolidated concepts ratio</span>
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

      {/* SECTION 3: ACTIVE BOTTLENECKS (Derived from Deterministic Engine) */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Active Bottlenecks & Cognitive Constraints
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bottleneckRecommendation?.evidenceStatus === 'insufficient' || !bottleneckRecommendation?.primaryBottleneck ? (
            <>
              {/* Card 1: Insufficient Evidence Baseline */}
              <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#10233F]">
                    Baseline Required: Insufficient Telemetry
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Awaiting Evidence
                  </span>
                </div>
                <p className="text-xs text-[#607089] leading-relaxed">
                  There is not yet enough practice evidence to identify a stable cognitive bottleneck. Complete the diagnostic and initial retrieval drills to establish a reliable baseline.
                </p>
                <button
                  onClick={() => onNavigate('/app/diagnostic')}
                  className="text-xs font-bold text-[#176FF5] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Take PLSFR+ Diagnostic</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2: Initial Observation Guidance */}
              <div className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#10233F]">
                    Telemetry Collection Protocol
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    Step 1 of 3
                  </span>
                </div>
                <p className="text-xs text-[#607089] leading-relaxed">
                  The deterministic engine requires at least 3 retrieval attempts and 2 application challenges before evaluating reliable learning constraints.
                </p>
                <button
                  onClick={() => onNavigate('/app/retrieve')}
                  className="text-xs font-bold text-[#176FF5] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Start First Retrieval Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Card 1: Primary Bottleneck */}
              <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-[0_8px_25px_rgba(220,38,38,0.03)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#10233F]">
                    {bottleneckRecommendation.primaryBottleneck.title} ({bottleneckRecommendation.primaryBottleneck.score}/100)
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    bottleneckRecommendation.evidenceStatus === 'sufficient'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {bottleneckRecommendation.evidenceStatus === 'sufficient' ? 'Validated Bottleneck' : 'Emerging Signal'}
                  </span>
                </div>

                <p className="text-xs text-[#607089] leading-relaxed">
                  {bottleneckRecommendation.primaryBottleneck.rationale}
                </p>

                {bottleneckRecommendation.primaryBottleneck.evidence.length > 0 && (
                  <div className="text-[11px] text-[#8A96A8] bg-[#F8FAFD] p-2 rounded-xl border border-[rgba(24,60,110,0.04)] space-y-1">
                    <span className="font-bold text-[#10233F] block">Observed Telemetry:</span>
                    {bottleneckRecommendation.primaryBottleneck.evidence.slice(0, 2).map((ev, idx) => (
                      <div key={idx} className="truncate">• {ev}</div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => onNavigate(bottleneckRecommendation.nextAction.route)}
                  className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>{bottleneckRecommendation.nextAction.title}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2: Secondary Bottleneck or Metacognitive Calibration */}
              {bottleneckRecommendation.secondaryBottleneck ? (
                <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-[0_8px_25px_rgba(217,119,6,0.03)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#10233F]">
                      Secondary: {bottleneckRecommendation.secondaryBottleneck.title} ({bottleneckRecommendation.secondaryBottleneck.score}/100)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                      Interacting Factor
                    </span>
                  </div>

                  <p className="text-xs text-[#607089] leading-relaxed">
                    {bottleneckRecommendation.secondaryBottleneck.rationale}
                  </p>

                  <button
                    onClick={() => onNavigate('/app/interventions')}
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>View Interventions</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : metrics.overconfidenceIncidents > 0 ? (
                <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-[0_8px_25px_rgba(217,119,6,0.03)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#10233F]">
                      Calibration Drift ({metrics.overconfidenceIncidents} Overconfidence Incidents)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                      Drift Detected
                    </span>
                  </div>

                  <p className="text-xs text-[#607089] leading-relaxed">
                    High subjective confidence preceded incorrect recall. Fluency illusions created familiarity without durable structural retrieval.
                  </p>

                  <button
                    onClick={() => onNavigate('/app/retrieve')}
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Calibrate with Closed-Book Recall</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : bottleneckRecommendation.leverageableStrength ? (
                <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-[0_8px_25px_rgba(16,185,129,0.03)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#10233F]">
                      Established Strength: {bottleneckRecommendation.leverageableStrength.title} ({bottleneckRecommendation.leverageableStrength.score}/100)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      Validated Asset
                    </span>
                  </div>

                  <p className="text-xs text-[#607089] leading-relaxed">
                    {bottleneckRecommendation.leverageableStrength.rationale}
                  </p>

                  <button
                    onClick={() => onNavigate('/app/goals')}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>View Goal Strategy Architecture</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#10233F]">
                      Secondary Telemetry Monitoring
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      Monitoring
                    </span>
                  </div>

                  <p className="text-xs text-[#607089] leading-relaxed">
                    No secondary cognitive bottleneck or calibration drift detected in recent sessions.
                  </p>

                  <button
                    onClick={() => onNavigate('/app/retrieve')}
                    className="text-xs font-bold text-[#176FF5] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Continue Retrieval Practice</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SECTION 4: INTERVENTIONS (Derived dynamically from active interventions) */}
      <section className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8A96A8]">
          Targeted Protocol Adjustments
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_10px_35px_rgba(30,70,120,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#176FF5]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm font-heading text-[#10233F]">Active Deliberate Practice Protocols</h3>
            </div>
            <button
              onClick={() => onNavigate('/app/interventions')}
              className="text-xs font-semibold text-[#176FF5] hover:underline cursor-pointer"
            >
              View All Interventions
            </button>
          </div>

          {activeInterventions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeInterventions.slice(0, 3).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs text-[#10233F] leading-snug">{item.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold shrink-0">
                      {item.frequency}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#607089] leading-relaxed line-clamp-2">
                    {item.reason || item.action}
                  </p>
                  <div className="text-[10px] text-emerald-800 bg-emerald-50/70 px-2 py-1 rounded-lg border border-emerald-100">
                    <span className="font-bold">Metric:</span> {item.successMetric || item.expectedOutcome}
                  </div>
                </div>
              ))}
            </div>
          ) : bottleneckRecommendation?.recommendedIntervention ? (
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs text-[#10233F]">
                  {bottleneckRecommendation.recommendedIntervention.title}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  {bottleneckRecommendation.recommendedIntervention.frequency}
                </span>
              </div>
              <p className="text-xs text-[#607089] leading-relaxed">
                {bottleneckRecommendation.recommendedIntervention.action}
              </p>
              <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="font-bold">Target Metric:</span> {bottleneckRecommendation.recommendedIntervention.successMetric || bottleneckRecommendation.recommendedIntervention.expectedOutcome}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8A96A8] text-center py-4">
              Complete your diagnostic assessment to generate targeted deliberate practice protocols.
            </p>
          )}
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
