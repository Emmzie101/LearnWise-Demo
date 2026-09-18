import React, { useState } from 'react';
import { HeroProductVisual } from '../components/HeroProductVisual';
import { useLearner } from '../context/LearnerContext';
import { 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Repeat, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  GraduationCap,
  Activity,
  Layers,
  ArrowUpRight,
  XCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface LandingViewProps {
  onStartDiagnostic: () => void;
  onExploreDemo: () => void;
  onGoToApp?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ 
  onStartDiagnostic, 
  onExploreDemo, 
  onGoToApp 
}) => {
  const { loadDemoAccount } = useLearner();
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const handleDemoClick = () => {
    loadDemoAccount();
    onExploreDemo();
  };

  const plsfrDimensions = [
    { 
      name: 'Schema Formation', 
      term: 'Cognitive Processing',
      desc: 'Deconstruct complex topics into clear invariant principles without cognitive overload.' 
    },
    { 
      name: 'Active Retrieval', 
      term: 'Knowledge Acquisition',
      desc: 'Retrieve principles from memory closed-book to consolidate permanent neural retention.' 
    },
    { 
      name: 'Knowledge Mapping', 
      term: 'Knowledge Organization',
      desc: 'Connect isolated concepts into structured, navigable mental schemas.' 
    },
    { 
      name: 'Honest Calibration', 
      term: 'Self-Regulation',
      desc: 'Align subjective confidence with objective recall accuracy to eliminate exam surprises.' 
    },
    { 
      name: 'Resilient Focus', 
      term: 'Motivation & Grit',
      desc: 'Maintain composure through productive cognitive struggle with tricky material.' 
    },
    { 
      name: 'Study Behavioral Habit', 
      term: 'Behavioral Systems',
      desc: 'Consistent daily routines engineered for real study conditions and busy schedules.' 
    },
    { 
      name: 'Operational Transfer', 
      term: 'Performance Transfer',
      desc: 'Apply invariant core principles to novel, disguised exam problem scenarios.' 
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Diagnose Your Bottlenecks',
      subtitle: 'Identify where you leak marks',
      desc: 'Take a 7-minute cognitive evaluation to uncover whether passive re-reading, uncalibrated confidence, or low transfer is holding you back.',
      metric: '7 Dimensions • Instant Profile'
    },
    {
      num: '02',
      title: 'Build Invariant Mental Schemas',
      subtitle: 'Stop memorizing endless text',
      desc: 'Ingest raw lectures, textbooks, or past questions and distill them into compact 2-sentence invariant rules that fit working memory.',
      metric: 'Zero Note Bloat • Pure Logic'
    },
    {
      num: '03',
      title: 'Learn, Practise & Transfer',
      subtitle: 'Permanent memory consolidation',
      desc: 'Test closed-book active recall against automated decay curves, then tackle novel disguised past questions to build true exam transfer.',
      metric: '300% Higher Retention'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#10233F] relative overflow-x-hidden selection:bg-[#176FF5]/15 selection:text-[#176FF5]">
      
      {/* Background Environmental Geometry (Translucent Rings & Atmosphere) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[850px] pointer-events-none -z-10 overflow-hidden">
        {/* Soft radial glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#176FF5]/12 via-[#176FF5]/3 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle geometric concentric arcs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-[#176FF5]/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1050px] h-[1050px] rounded-full border border-[#176FF5]/4" />
      </div>

      {/* 01. Floating Capsule Navigation */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <nav className="nav-floating-capsule rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10233F] text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-4 h-4 text-[#176FF5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base font-heading text-[#10233F] tracking-tight">
                LearnWise
              </span>
              <span className="text-[10px] text-[#176FF5] font-bold px-1.5 py-0.5 rounded-md bg-[#EDF5FF] hidden sm:inline-block">
                PLSFR+
              </span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#607089]">
            <a href="#how-it-works" className="hover:text-[#176FF5] transition-colors">How it works</a>
            <a href="#transformation" className="hover:text-[#176FF5] transition-colors">Transformation</a>
            <a href="#bottlenecks" className="hover:text-[#176FF5] transition-colors">Why study breaks</a>
            <a href="#methodology" className="hover:text-[#176FF5] transition-colors">7 Pillars</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {onGoToApp && (
              <button
                onClick={onGoToApp}
                className="text-xs font-semibold text-[#176FF5] hover:bg-[#EDF5FF] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={handleDemoClick}
              className="text-xs font-semibold text-[#607089] hover:text-[#10233F] px-3 py-1.5 rounded-xl transition-colors cursor-pointer hidden sm:block"
            >
              Demo
            </button>
            <button
              onClick={onStartDiagnostic}
              className="btn-primary-glow px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* 02. Hero Section */}
      <section className="pt-12 sm:pt-16 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_4px_15px_rgba(30,70,120,0.04)]">
          <span className="w-2 h-2 rounded-full bg-[#176FF5] animate-pulse" />
          <span className="text-[11px] font-bold text-[#10233F] uppercase tracking-wider">
            A Smarter Way to Learn
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-[11px] text-[#607089] font-medium">Built on Cognitive Science</span>
        </div>

        {/* Large Confident Tight Headline */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#10233F] tracking-tight leading-[1.04]">
            Learning should <br className="hidden sm:inline" />
            <span className="text-[#176FF5]">make sense to you.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#607089] max-w-xl mx-auto leading-relaxed font-normal">
            LearnWise diagnoses hidden study bottlenecks, distills complex syllabi into clear mental schemas, and uses closed-book recall so you never freeze on exam day.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onStartDiagnostic}
            className="w-full sm:w-auto btn-primary-glow px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Free Diagnostic (7 min)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDemoClick}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#10233F] font-semibold text-sm border border-[rgba(24,60,110,0.1)] shadow-[0_4px_20px_rgba(30,70,120,0.04)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Explore Demo Account</span>
          </button>
        </div>

        {/* Reassurance Subline */}
        <div className="text-xs text-[#8A96A8] pt-1">
          Free to use • No card required • Tailored for WAEC, JAMB, NECO & University syllabi
        </div>

        {/* 03. Centerpiece: Realistic Product Visual with Floating Micro-UI */}
        <div className="pt-6">
          <HeroProductVisual />
        </div>

      </section>

      {/* 04. Social Proof & Scientific Grounding */}
      <section className="py-12 border-y border-[rgba(24,60,110,0.06)] bg-[#FAFBFD]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-[11px] font-bold text-[#176FF5] uppercase tracking-wider">
                Evidence-Based Learning Architecture
              </span>
              <h3 className="text-sm font-semibold text-[#10233F] mt-0.5">
                Built on Sweller's Cognitive Load, Roediger's Retrieval Practice, & Ebbinghaus Spaced Intervals
              </h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#607089]">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200/80 shadow-2xs">WAEC & JAMB UTME</span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200/80 shadow-2xs">NECO SSCE</span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200/80 shadow-2xs">University 100/200L</span>
            </div>
          </div>
        </div>
      </section>

      {/* 05. The 3 Bottlenecks: Why Studying Breaks Down */}
      <section id="bottlenecks" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#176FF5]">
            Why Traditional Studying Breaks Down
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F]">
            Moving from passive familiarity to durable mastery
          </h2>
          <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
            Most students fail not from lack of effort, but from deceptive learning traps that feel productive while building zero long-term retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_12px_35px_rgba(30,70,120,0.03)] space-y-3 transition-all hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">The Re-Reading Illusion</span>
            <h3 className="font-bold text-base text-[#10233F]">Familiarity is not memory</h3>
            <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
              Highlighting paragraphs creates recognition, not retrieval. You recognize the page, but cannot produce the logic closed-book in an exam hall.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_12px_35px_rgba(30,70,120,0.03)] space-y-3 transition-all hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Shallow Memorization</span>
            <h3 className="font-bold text-base text-[#10233F]">Definitions collapse on transfer</h3>
            <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
              Reciting definitions word-for-word fails whenever examiners disguise the scenario. Without invariant principles, memory doesn't transfer.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.07)] shadow-[0_12px_35px_rgba(30,70,120,0.03)] space-y-3 transition-all hover:translate-y-[-2px]">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF5FF] text-[#176FF5] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176FF5] block">AI Dependency Trap</span>
            <h3 className="font-bold text-base text-[#10233F]">Answer generation skips learning</h3>
            <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
              Using AI to write answers shortcuts the productive cognitive struggle. Without struggle, your brain prunes the synapses overnight.
            </p>
          </div>
        </div>
      </section>

      {/* 06. How LearnWise Works: 3-Step Visual System */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[rgba(24,60,110,0.06)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#176FF5]">
              How LearnWise Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F]">
              A continuous, closed-loop mastery system
            </h2>
            <p className="text-xs sm:text-sm text-[#607089]">
              Three deliberate steps that eliminate cramming panic and build calm exam confidence.
            </p>
          </div>

          {/* 3 Step Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveStepTab(idx)}
                className={`p-6 rounded-3xl cursor-pointer transition-all border ${
                  activeStepTab === idx
                    ? 'bg-[#F8FAFD] border-[#176FF5] shadow-[0_8px_30px_rgba(23,111,245,0.08)]'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    activeStepTab === idx ? 'bg-[#176FF5] text-white' : 'bg-gray-100 text-[#607089]'
                  }`}>
                    {step.num}
                  </span>
                  <span className="text-[10px] text-[#8A96A8] font-semibold">{step.metric}</span>
                </div>
                <h3 className="font-bold text-base text-[#10233F]">{step.title}</h3>
                <p className="text-xs text-[#607089] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Feature Showcase Box for Selected Step */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.08)] shadow-[0_12px_40px_rgba(30,70,120,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176FF5]">
                Step {steps[activeStepTab].num} in action
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#10233F]">
                {steps[activeStepTab].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
                {steps[activeStepTab].desc}
              </p>
              <div className="pt-2">
                <button
                  onClick={onStartDiagnostic}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#176FF5] hover:text-[#135CD4] cursor-pointer"
                >
                  <span>Experience this in your free diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Mockup View of Current Step */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs space-y-3">
              {activeStepTab === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="font-bold text-[#10233F]">PLS-CP Diagnostic Profile Preview</span>
                    <span className="text-[#176FF5] font-semibold">Adaeze's Results</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#607089]">Active Recall Score</span>
                      <span className="font-bold text-[#10233F]">42% • Critical Bottleneck</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#607089]">Subjective Confidence</span>
                      <span className="font-bold text-amber-600">88% • Overconfidence Penalty</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#607089] italic pt-1">
                    Diagnostic verdict: High re-reading hours masking poor retrieval recall. LearnWise will prioritize closed-book tests.
                  </p>
                </div>
              )}

              {activeStepTab === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="font-bold text-[#10233F]">Mental Schema Ingestion</span>
                    <span className="text-[#20B26B] font-semibold">Clean Schema Output</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFD] border border-gray-100 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#176FF5]">Concept: Le Chatelier's Principle</div>
                    <div className="text-xs font-semibold text-[#10233F]">
                      "If a dynamic equilibrium is disturbed by changing conditions, the position of equilibrium shifts to counteract the change."
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium pt-1">
                      Boundary Rule: Catalysts increase reaction rate equally in both directions; they do NOT shift the equilibrium position.
                    </div>
                  </div>
                </div>
              )}

              {activeStepTab === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="font-bold text-[#10233F]">Far Scenario Transfer Challenge</span>
                    <span className="text-[#176FF5] font-semibold">JAMB Question 14</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFD] border border-gray-100">
                    <div className="text-xs text-[#10233F] font-semibold">
                      "An industrial fertilizer vat increases pressure 4-fold while temperature remains fixed. What happens to the yield of ammonia (N₂ + 3H₂ ⇌ 2NH₃)?"
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#20B26B] font-semibold">
                    <span>✓ Identified invariant: 4 moles of gas convert to 2 moles</span>
                    <span>Transfer Score: +15 pts</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 07. Visual Storytelling: Before vs. After Transformation */}
      <section id="transformation" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#176FF5]">
            Visual Transformation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F]">
            Before & After LearnWise
          </h2>
          <p className="text-xs sm:text-sm text-[#607089]">
            See the exact cognitive transformation that replaces cramming fatigue with calm exam mastery.
          </p>
        </div>

        {/* Side-by-Side Transformation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Before Column */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-red-100 shadow-[0_10px_35px_rgba(239,68,68,0.04)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                Before LearnWise
              </span>
              <span className="text-xs text-rose-500 font-semibold">-18% Exam Surprise</span>
            </div>

            <h3 className="text-lg font-bold text-[#10233F]">
              Studying without knowing what is actually working
            </h3>

            <ul className="space-y-3 text-xs text-[#607089]">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Endless re-reading notes and highlighting pages with diminishing retention.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>False sense of confidence from open-book recognition.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Freezing on disguised questions because formulas were memorized without invariant rules.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Exhausting 8-hour study sessions that produce exam anxiety.</span>
              </li>
            </ul>

            <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-rose-700">
              Typical outcome: High study hours with painful exam-day blanks.
            </div>
          </div>

          {/* After Column */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[rgba(23,111,245,0.2)] shadow-[0_15px_45px_rgba(23,111,245,0.08)] space-y-5 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176FF5] bg-[#EDF5FF] px-2.5 py-1 rounded-md">
                After LearnWise
              </span>
              <span className="text-xs text-[#20B26B] font-bold">+32% True Retention</span>
            </div>

            <h3 className="text-lg font-bold text-[#10233F]">
              Knowing what to learn, why you're learning it, and what to do next
            </h3>

            <ul className="space-y-3 text-xs text-[#607089]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B26B] shrink-0 mt-0.5" />
                <span>Targeted 30-minute daily retrieval queue calculated by memory decay intervals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B26B] shrink-0 mt-0.5" />
                <span>Honest calibration score that alerts you before you enter the exam hall.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B26B] shrink-0 mt-0.5" />
                <span>Novel scenario practice that guarantees far transfer to unpredictable exam questions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B26B] shrink-0 mt-0.5" />
                <span>Calm, objective telemetry tracking verified neural consolidation.</span>
              </li>
            </ul>

            <div className="p-3 rounded-2xl bg-[#E8F8F0] border border-[#20B26B]/20 text-xs text-[#20B26B] font-semibold">
              Typical outcome: Half the study time with calm, predictable top grades.
            </div>
          </div>

        </div>
      </section>

      {/* 08. The 7 Pillars of Learning (PLSFR+) */}
      <section id="methodology" className="py-20 bg-[#FAFBFD] border-t border-[rgba(24,60,110,0.06)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#176FF5]">
                Systemic Framework
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F] mt-1">
                The Seven Pillars of Learning (PLSFR+)
              </h2>
              <p className="text-xs sm:text-sm text-[#607089] mt-1 max-w-xl">
                A holistic diagnostic framework designed to detect study leaks across cognitive, metacognitive, and behavioral dimensions.
              </p>
            </div>

            <button
              onClick={onStartDiagnostic}
              className="btn-primary-glow px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer self-start md:self-auto flex items-center gap-1.5"
            >
              <span>Diagnose Your 7 Dimensions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plsfrDimensions.map((dim, i) => (
              <div key={i} className="p-5 rounded-3xl bg-white border border-[rgba(24,60,110,0.06)] shadow-[0_8px_30px_rgba(30,70,120,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#176FF5] text-[11px] uppercase tracking-wide">
                    Pillar 0{i + 1}
                  </span>
                  <span className="text-[10px] text-[#8A96A8] font-medium">{dim.term}</span>
                </div>
                <h3 className="font-bold text-sm text-[#10233F]">{dim.name}</h3>
                <p className="text-xs text-[#607089] leading-relaxed">{dim.desc}</p>
              </div>
            ))}

            <div className="p-5 rounded-3xl bg-[#10233F] text-white flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#176FF5] uppercase tracking-wider">
                  Adaptive Spaced Intervals
                </span>
                <h3 className="font-bold text-sm text-white">Objective Telemetry</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Real-time memory decay algorithms intercept the forgetting curve before recall slips away.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#20B26B] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Continuous Memory Verification</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 09. Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_20px_60px_rgba(30,70,120,0.06)] text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF5FF] text-[#176FF5] text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Ready for Exam Mastery</span>
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#10233F] tracking-tight">
              Start your personalized study profile today
            </h2>
            <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
              Take the free 7-minute diagnostic to identify your study bottlenecks and get your customized daily retrieval queue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartDiagnostic}
              className="w-full sm:w-auto btn-primary-glow px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Take Free Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#10233F] font-semibold text-sm border border-[rgba(24,60,110,0.1)] shadow-2xs transition-all cursor-pointer"
            >
              Explore Demo (Adaeze)
            </button>
          </div>
        </div>
      </section>

      {/* 10. Minimalist Clean Footer */}
      <footer className="py-10 border-t border-[rgba(24,60,110,0.06)] bg-[#FAFBFD] text-xs text-[#8A96A8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#10233F] text-white flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5 text-[#176FF5]" />
            </div>
            <span className="font-bold text-[#10233F]">LearnWise</span>
            <span>• Personalized Learning Operating System (PLSFR+)</span>
          </div>
          <div>
            Built with cognitive science for Nigerian and international learners.
          </div>
        </div>
      </footer>

    </div>
  );
};
