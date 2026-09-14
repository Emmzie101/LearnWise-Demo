import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  Layers, 
  Repeat, 
  BarChart3,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen
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
      desc: 'Discover your learning bottlenecks across 7 dimensions (PLSFR+).'
    },
    {
      num: '02',
      title: 'Structure Topics',
      tag: 'Ingest Schemas',
      route: '/app/capture/new',
      stepIdx: 1,
      desc: 'Ingest notes or syllabus concepts into clear invariant rules.'
    },
    {
      num: '03',
      title: 'Closed-Book Recall',
      tag: 'Active Retrieval',
      route: '/app/retrieve',
      stepIdx: 2,
      desc: 'Test memory without notes to cement long-term retention.'
    },
    {
      num: '04',
      title: 'Exam Transfer',
      tag: 'Application',
      route: '/app/apply',
      stepIdx: 3,
      desc: 'Solve unfamiliar, novel Nigerian exam problems and scenarios.'
    },
    {
      num: '05',
      title: 'Track Telemetry',
      tag: 'Spaced Interventions',
      route: '/app/dashboard',
      stepIdx: 4,
      desc: 'Inspect honest telemetry and automated spacing schedules.'
    }
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#071A3A] via-[#0A2558] to-[#071A3A] text-white p-5 sm:p-6 shadow-md border border-[#1769FF]/20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#124BCE]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#124BCE]/40 text-[#F4C542] text-[11px] font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>New Here? Platform Walkthrough</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight">
            How LearnWise Works: The 5-Step Closed-Loop System
          </h2>
          <p className="text-xs text-white/80 leading-relaxed">
            Unlike simple flashcard apps or passive AI chat, LearnWise takes you from cognitive diagnosis to permanent memory and exam transfer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => onStartWalkthrough(0)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
            <span>Start Interactive Tour</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Map' : 'View Quick Map'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-[11px] text-white/50 hover:text-white px-2 py-1 transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Expanded Step-by-Step Flow Matrix */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
          {quickSteps.map((step) => (
            <div 
              key={step.num}
              className="p-3.5 rounded-2xl bg-white/10 border border-white/10 hover:border-[#F4C542]/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-[#F4C542]">{step.num}</span>
                  <span className="text-[10px] text-white/60">{step.tag}</span>
                </div>
                <h3 className="font-bold text-xs text-white group-hover:text-[#F4C542] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[11px] text-white/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => onStartWalkthrough(step.stepIdx)}
                  className="text-[10px] text-white/70 hover:text-white underline cursor-pointer"
                >
                  Learn why
                </button>
                <button
                  onClick={() => onNavigate(step.route)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F4C542] hover:text-white transition-colors cursor-pointer"
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
