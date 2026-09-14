import React from 'react';
import { CognitiveVisual } from '../components/CognitiveVisual';
import { useLearner } from '../context/LearnerContext';
import { 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Repeat, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Layers,
  GraduationCap,
  Activity,
  Globe2,
  BookOpen
} from 'lucide-react';

interface LandingViewProps {
  onStartDiagnostic: () => void;
  onExploreDemo: () => void;
  onGoToApp?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartDiagnostic, onExploreDemo, onGoToApp }) => {
  const { loadDemoAccount } = useLearner();

  const handleDemoClick = () => {
    loadDemoAccount();
    onExploreDemo();
  };

  const plsfrDimensions = [
    { 
      name: 'Understanding Ideas', 
      term: 'Cognitive Processing',
      desc: 'Deconstruct complex topics into clear schemas without cognitive overload.' 
    },
    { 
      name: 'Active Recall', 
      term: 'Knowledge Acquisition',
      desc: 'Retrieve principles from memory without notes to cement retention.' 
    },
    { 
      name: 'Knowledge Mapping', 
      term: 'Knowledge Organization',
      desc: 'Connect isolated topics into structured, navigable mental webs.' 
    },
    { 
      name: 'Honest Calibration', 
      term: 'Self-Regulation',
      desc: 'Align subjective confidence with objective recall accuracy.' 
    },
    { 
      name: 'Resilient Focus', 
      term: 'Motivation & Grit',
      desc: 'Maintain composure through productive struggle and tricky material.' 
    },
    { 
      name: 'Study Environment', 
      term: 'Behavioral Systems',
      desc: 'Consistent routines engineered for real study conditions.' 
    },
    { 
      name: 'Exam Transfer', 
      term: 'Performance Transfer',
      desc: 'Apply core concepts to novel, unfamiliar problem scenarios.' 
    },
  ];

  const workflowSteps = [
    { step: '01', title: 'Diagnose', desc: 'Identify cognitive habits and bottlenecks.' },
    { step: '02', title: 'Profile', desc: 'Reveal strengths and priority areas.' },
    { step: '03', title: 'Plan', desc: 'Structure syllabi into clear concept queues.' },
    { step: '04', title: 'Practice', desc: 'Closed-book recall and novel scenario transfer.' },
    { step: '05', title: 'Track', desc: 'Objective telemetry and spaced reviews.' },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#071A3A]">
      {/* Clean Top Navigation Bar */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#071A3A] text-white flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-5 h-5 text-[#F4C542]" />
            </div>
            <div>
              <span className="font-extrabold text-base font-heading text-[#071A3A] tracking-tight">LearnWise</span>
              <span className="text-[10px] text-[#124BCE] font-bold ml-1.5 px-1.5 py-0.5 rounded-full bg-[#EAF2FF]">PLSFR+</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onGoToApp && (
              <button
                onClick={onGoToApp}
                className="text-xs font-semibold text-[#124BCE] hover:bg-[#EAF2FF] px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Open Dashboard
              </button>
            )}
            <button
              onClick={handleDemoClick}
              className="text-xs font-semibold text-gray-700 hover:text-[#124BCE] px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Try Demo Account
            </button>
            <button
              onClick={onStartDiagnostic}
              className="text-xs font-bold text-white bg-[#124BCE] hover:bg-[#1769FF] px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Start Free Check
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-gray-100 bg-radial from-[#EAF2FF]/50 via-[#F7FAFF] to-[#F7FAFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#071A3A] tracking-tight leading-[1.12]">
                Learn how you learn.<br />
                <span className="text-[#124BCE]">
                  Remember for good.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Diagnose hidden study bottlenecks, practice closed-book recall, and solve real exam questions with lasting clarity.
              </p>

              {/* 3 Minimal Pillars */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-gray-600 pt-1">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200/70 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#124BCE]" />
                  Active Recall
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200/70 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#124BCE]" />
                  Exam Transfer
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200/70 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#124BCE]" />
                  Calibrated Confidence
                </span>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartDiagnostic}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#124BCE] hover:bg-[#1769FF] text-white font-bold text-sm shadow-md shadow-[#124BCE]/20 transition-all hover:translate-y-[-1px] cursor-pointer"
                >
                  <span>Start Free Diagnostic</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDemoClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-[#071A3A] font-semibold text-sm border border-gray-200 shadow-2xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#F4C542]" />
                  <span>Explore Demo (Ada)</span>
                </button>
              </div>

              <div className="text-xs text-gray-400">
                Free • Mobile-optimized • Designed for Nigerian students
              </div>
            </div>

            {/* Right Column: Interactive Cognitive Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <CognitiveVisual />
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Core Bottlenecks */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#124BCE]">Why Studying Breaks Down</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
              Moving from passive familiarity to durable mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#F7FAFF] border border-gray-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Passive Review</span>
              <h3 className="font-bold text-base text-[#071A3A]">The Re-Reading Illusion</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Highlighting notes creates a false sense of knowing. Without retrieving ideas from memory, retention fades quickly.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7FAFF] border border-gray-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Shallow Cramming</span>
              <h3 className="font-bold text-base text-[#071A3A]">Memorizing vs. Transfer</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Reciting definitions fails when exam questions disguise scenarios. Deep understanding requires testing novel cases.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7FAFF] border border-gray-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#124BCE]">AI Dependency</span>
              <h3 className="font-bold text-base text-[#071A3A]">Answer Generation vs. Learning</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Outsourcing answers to AI skips the cognitive struggle that builds long-term neural connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 Dimensions of Learning */}
      <section className="py-20 bg-[#F7FAFF] border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#124BCE]">Systemic Framework</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A] mt-1">
                The Seven Pillars of Learning (PLSFR+)
              </h2>
            </div>

            <button
              onClick={onStartDiagnostic}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Take Assessment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plsfrDimensions.map((dim, i) => (
              <div key={i} className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#124BCE] text-[11px] uppercase tracking-wide">Pillar 0{i + 1}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{dim.term}</span>
                </div>
                <h3 className="font-bold text-sm text-[#071A3A]">{dim.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{dim.desc}</p>
              </div>
            ))}

            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#071A3A] to-[#124BCE] text-white flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#F4C542] uppercase tracking-wider">
                  Adaptive Engine
                </span>
                <h3 className="font-bold text-sm text-white">Objective Telemetry</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Real-time spacing algorithms intercept forgetting curves based on your proven recall speed and accuracy.
                </p>
              </div>
              <div className="pt-3 flex items-center gap-1.5 text-xs text-[#F4C542] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Closed-loop memory verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Learning Loop */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-[#124BCE]">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
              Your Daily Learning Cycle
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {workflowSteps.map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#F7FAFF] border border-gray-100 space-y-1.5">
                <div className="text-xs font-bold text-[#124BCE]">{s.step}</div>
                <h3 className="font-bold text-xs sm:text-sm text-[#071A3A]">{s.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Nigerian Students CTA */}
      <section className="py-20 bg-[#F7FAFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#071A3A] via-[#0A2558] to-[#071A3A] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2.5 max-w-lg text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-[#F4C542]">
                <GraduationCap className="w-4 h-4" />
                <span>Nigerian Secondary & University Curriculum</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Start your personalized study profile
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Take the 7-minute assessment to identify your learning bottlenecks and begin targeted closed-book practice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={onStartDiagnostic}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#124BCE] hover:bg-[#1769FF] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Take Diagnostic Free
              </button>
              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
              >
                Explore Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
