import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Repeat,
  Target,
  BarChart3,
  Layers
} from 'lucide-react';

interface GuidedSystemTourBannerProps {
  onStartWalkthrough: (stepIndex?: number) => void;
  onNavigate: (route: string) => void;
}

export const GuidedSystemTourBanner: React.FC<GuidedSystemTourBannerProps> = ({
  onStartWalkthrough,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const quickSteps = [
    {
      num: '01',
      title: 'Diagnose Profile',
      tag: 'Find Bottlenecks',
      route: '/app/diagnostic',
      stepIdx: 0,
      desc: 'Discover hidden study leaks across 7 dimensions (PLSFR+).'
    },
    {
      num: '02',
      title: 'Structure Topics',
      tag: 'Ingest Schemas',
      route: '/app/capture/new',
      stepIdx: 1,
      desc: 'Ingest raw notes or syllabus into clear 2-sentence invariant rules.'
    },
    {
      num: '03',
      title: 'Closed-Book Recall',
      tag: 'Active Retrieval',
      route: '/app/retrieve',
      stepIdx: 2,
      desc: 'Retrieve principles from memory without notes to cement retention.'
    },
    {
      num: '04',
      title: 'Exam Transfer',
      tag: 'Application',
      route: '/app/apply',
      stepIdx: 3,
      desc: 'Solve unfamiliar, disguised Nigerian exam scenarios (WAEC / JAMB).'
    },
    {
      num: '05',
      title: 'Track Telemetry',
      tag: 'Spaced Interventions',
      route: '/app/dashboard',
      stepIdx: 4,
      desc: 'Inspect honest calibration telemetry and automated decay schedules.'
    }
  ];

  return (
    <div className="rounded-3xl bg-white text-[#10233F] p-5 sm:p-6 shadow-[0_10px_35px_rgba(30,70,120,0.05)] border border-[rgba(24,60,110,0.08)] relative overflow-hidden">
      {/* Background light atmospheric glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#176FF5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#EDF5FF] text-[#176FF5] text-[11px] font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Platform Walkthrough</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-[#10233F] tracking-tight">
            How LearnWise Works: The 5-Step Closed-Loop System
          </h2>
          <p className="text-xs text-[#607089] leading-relaxed">
            Move seamlessly from cognitive diagnostic evaluation to invariant schemas, closed-book recall, and unpredictable exam problem transfer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => onStartWalkthrough(0)}
            className="btn-primary-glow flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Start Interactive Tour</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EDF5FF] text-[#10233F] text-xs font-semibold border border-[rgba(24,60,110,0.08)] transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Map' : 'View Quick Map'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-[11px] text-[#8A96A8] hover:text-[#10233F] px-2 py-1 transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Expanded Step-by-Step Flow Matrix */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-[rgba(24,60,110,0.06)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
          {quickSteps.map((step) => (
            <div 
              key={step.num}
              className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] hover:border-[#176FF5]/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-[#176FF5]">{step.num}</span>
                  <span className="text-[10px] text-[#8A96A8] font-medium">{step.tag}</span>
                </div>
                <h3 className="font-bold text-xs text-[#10233F] group-hover:text-[#176FF5] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#607089] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gray-100/60 mt-2">
                <button
                  onClick={() => onStartWalkthrough(step.stepIdx)}
                  className="text-[10px] text-[#607089] hover:text-[#176FF5] underline cursor-pointer"
                >
                  Learn why
                </button>
                <button
                  onClick={() => onNavigate(step.route)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#176FF5] hover:text-[#135CD4] transition-colors cursor-pointer"
                >
                  <span>Go to view</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
