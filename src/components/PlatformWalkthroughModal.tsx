import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Sparkles, 
  BookOpen, 
  Repeat, 
  Layers, 
  BarChart3, 
  Lightbulb, 
  ChevronRight,
  BrainCircuit,
  Eye,
  Target
} from 'lucide-react';

export interface WalkthroughStep {
  id: string;
  stepNumber: number;
  stageName: string;
  title: string;
  subtitle: string;
  explanation: string;
  keyRule: string;
  recommendedRoute: string;
  actionText: string;
  iconName: 'diagnose' | 'capture' | 'retrieve' | 'apply' | 'dashboard' | 'coach';
}

const STEPS: WalkthroughStep[] = [
  {
    id: 'diagnose',
    stepNumber: 1,
    stageName: 'Step 1: Cognitive Diagnosis',
    title: 'Discover How Your Brain Learns',
    subtitle: 'Identify hidden bottlenecks before cramming',
    explanation: 'Most students fail exams not because of low intelligence, but because of poor study mechanics like passive re-reading and illusions of competence. The diagnostic analyzes your habits across 7 science-backed cognitive dimensions (PLSFR+).',
    keyRule: 'Rule of Thumb: Never begin studying without knowing your active bottlenecks.',
    recommendedRoute: '/app/diagnostic',
    actionText: 'View Diagnostic',
    iconName: 'diagnose',
  },
  {
    id: 'goals-capture',
    stepNumber: 2,
    stageName: 'Step 2: Ingest & Schema Formation',
    title: 'Capture Raw Topics into Clear Schemas',
    subtitle: 'Convert lectures and textbooks into structured ideas',
    explanation: 'Rather than copying entire chapters, break concepts into their invariant rules, key mechanisms, and boundary conditions. This structures incoming information so it can attach to existing mental schemas.',
    keyRule: 'Rule of Thumb: If you cannot state the core mechanism in 2 sentences, it is not yet encoded.',
    recommendedRoute: '/app/capture/new',
    actionText: 'Go to Capture Material',
    iconName: 'capture',
  },
  {
    id: 'retrieval',
    stepNumber: 3,
    stageName: 'Step 3: Closed-Book Recall',
    title: 'Reconstruct Concepts from Memory',
    subtitle: 'Stop re-reading; force memory retrieval without notes',
    explanation: 'Close your book or hide your notes. Force your brain to pull the answer out. This productive struggle triggers synaptic consolidation and trains your confidence calibration so you know what you truly understand.',
    keyRule: 'Rule of Thumb: Re-reading creates false familiarity; retrieval creates permanent memory.',
    recommendedRoute: '/app/retrieve',
    actionText: 'Try Recall Practice',
    iconName: 'retrieve',
  },
  {
    id: 'apply',
    stepNumber: 4,
    stageName: 'Step 4: Scenario Application & Transfer',
    title: 'Solve Novel, Unfamiliar Problems',
    subtitle: 'Test your understanding on real exam-style cases',
    explanation: 'Exams never ask for verbatim textbook definitions. They disguise scenarios with unexpected variables. Application tasks present real case studies to prove you can apply the principle in new contexts.',
    keyRule: 'Rule of Thumb: True mastery is transferring concepts to problems you have never seen before.',
    recommendedRoute: '/app/apply',
    actionText: 'Try Application Task',
    iconName: 'apply',
  },
  {
    id: 'dashboard',
    stepNumber: 5,
    stageName: 'Step 5: Telemetry & Spaced Interventions',
    title: 'Track Objective Growth & Intercept Forgetting',
    subtitle: 'Evidence-based numbers instead of subjective feelings',
    explanation: 'Your dashboard displays verified recall accuracy, scenario transfer rate, and metacognitive calibration. The system automatically schedules spaced reviews at optimal intervals to stop the forgetting curve.',
    keyRule: 'Rule of Thumb: Rely on verified retrieval telemetry, not subjective feelings of knowing.',
    recommendedRoute: '/app/dashboard',
    actionText: 'Inspect Telemetry',
    iconName: 'dashboard',
  },
];

interface PlatformWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  initialStepIndex?: number;
}

export const PlatformWalkthroughModal: React.FC<PlatformWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialStepIndex = 0,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(initialStepIndex);
    }
  }, [isOpen, initialStepIndex]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleJumpToRoute = () => {
    onNavigate(currentStep.recommendedRoute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071A3A]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#071A3A] to-[#0A2558] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#124BCE] flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F4C542]">
                Platform Interactive Walkthrough
              </span>
              <h2 className="text-sm font-bold font-heading text-white">
                How LearnWise Works From Start to Finish
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-100 bg-[#F7FAFF]">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-full flex items-center">
                    <div 
                      className={`h-1.5 w-full rounded-full transition-all ${
                        isActive 
                          ? 'bg-[#124BCE]' 
                          : isPast 
                            ? 'bg-emerald-500' 
                            : 'bg-gray-200 group-hover:bg-gray-300'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight text-center hidden sm:block ${
                    isActive ? 'text-[#124BCE]' : isPast ? 'text-emerald-700' : 'text-gray-400'
                  }`}>
                    0{s.stepNumber} {s.id === 'diagnose' ? 'Diagnose' : s.id === 'goals-capture' ? 'Capture' : s.id === 'retrieval' ? 'Recall' : s.id === 'apply' ? 'Apply' : 'Track'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider">
              <span>{currentStep.stageName}</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#071A3A] tracking-tight">
              {currentStep.title}
            </h3>
            
            <p className="text-xs sm:text-sm font-medium text-gray-500">
              {currentStep.subtitle}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAFF] border border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed">
            {currentStep.explanation}
          </div>

          {/* Golden Rule Callout */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 font-medium leading-relaxed">
              {currentStep.keyRule}
            </div>
          </div>

          {/* Suggested Direct Route Shortcut */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F1F5FD] border border-[#1769FF]/15">
            <div className="text-xs text-gray-600">
              Ready to try this step in the app?
            </div>
            <button
              onClick={handleJumpToRoute}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#124BCE] hover:text-[#1769FF] underline cursor-pointer"
            >
              <span>{currentStep.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isFirst 
                ? 'opacity-30 cursor-not-allowed text-gray-400' 
                : 'text-gray-700 hover:bg-white hover:shadow-2xs cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-gray-400">
            {currentStepIndex + 1} of {STEPS.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>{isLast ? 'Complete Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
