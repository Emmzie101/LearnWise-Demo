import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Repeat, 
  TrendingUp, 
  Flame, 
  Target, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
  BookOpen
} from 'lucide-react';

export const HeroProductVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'schema' | 'telemetry'>('today');

  return (
    <div className="relative w-full max-w-4xl mx-auto pt-6 pb-4">
      {/* Soft atmospheric background halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-[#176FF5]/10 via-[#176FF5]/3 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Micro-UI Card 1: Top-Left (Comprehension Gain) */}
      <div className="hidden sm:flex absolute -top-2 -left-6 lg:-left-12 z-20 items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_12px_36px_rgba(30,70,120,0.08)]">
        <div className="w-8 h-8 rounded-xl bg-[#EDF5FF] text-[#176FF5] flex items-center justify-center font-bold text-xs">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-[#607089]">Comprehension</div>
          <div className="text-xs font-bold text-[#10233F] flex items-center gap-1">
            <span>+18% retention</span>
            <span className="text-[10px] text-[#20B26B] font-semibold">↑ this week</span>
          </div>
        </div>
      </div>

      {/* Floating Micro-UI Card 2: Top-Right (Study Streak) */}
      <div className="hidden sm:flex absolute -top-4 -right-4 lg:-right-10 z-20 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_12px_36px_rgba(30,70,120,0.08)]">
        <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A96A8]">Study Streak</div>
          <div className="text-xs font-bold text-[#10233F]">7 Days Active</div>
        </div>
      </div>

      {/* Floating Micro-UI Card 3: Bottom-Left (Ready to Review) */}
      <div className="hidden md:flex absolute -bottom-5 -left-4 lg:-left-10 z-20 items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_12px_36px_rgba(30,70,120,0.08)]">
        <div className="w-8 h-8 rounded-xl bg-[#EDF5FF] text-[#176FF5] flex items-center justify-center">
          <Repeat className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-semibold text-[#10233F]">Ready to Review</div>
          <div className="text-[10px] text-[#607089]">3 concepts due today</div>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#176FF5] animate-pulse" />
      </div>

      {/* Floating Micro-UI Card 4: Bottom-Right (Exam Transfer) */}
      <div className="hidden md:flex absolute -bottom-4 -right-4 lg:-right-8 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_12px_36px_rgba(30,70,120,0.08)]">
        <div className="w-8 h-8 rounded-xl bg-[#E8F8F0] text-[#20B26B] flex items-center justify-center">
          <Target className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-[#10233F]">Exam Transfer: 88%</div>
          <div className="text-[10px] text-[#607089]">14 novel past questions solved</div>
        </div>
      </div>

      {/* Main Central Product Surface */}
      <div className="rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_20px_60px_rgba(30,70,120,0.07)] overflow-hidden transition-all">
        
        {/* Subtle Product Window Header */}
        <div className="px-5 py-3.5 bg-[#FAFBFD] border-b border-[rgba(24,60,110,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9F0]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9F0]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9F0]" />
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#176FF5] text-white flex items-center justify-center text-[10px] font-bold">
                LW
              </span>
              <span className="text-xs font-semibold text-[#10233F]">LearnWise System</span>
              <span className="text-[10px] text-[#176FF5] font-semibold px-2 py-0.5 rounded-full bg-[#EDF5FF]">
                Target: WAEC & JAMB 2026
              </span>
            </div>
          </div>

          {/* Micro Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 text-xs">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-[#176FF5] text-white shadow-xs'
                  : 'text-[#607089] hover:text-[#10233F]'
              }`}
            >
              Today's Focus
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'schema'
                  ? 'bg-[#176FF5] text-white shadow-xs'
                  : 'text-[#607089] hover:text-[#10233F]'
              }`}
            >
              Mental Schema
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'telemetry'
                  ? 'bg-[#176FF5] text-white shadow-xs'
                  : 'text-[#607089] hover:text-[#10233F]'
              }`}
            >
              Telemetry
            </button>
          </div>
        </div>

        {/* Product Window Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Student Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#176FF5] to-[#3D86FF] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                AO
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#10233F]">Good morning, Adaeze 👋</h4>
                  <span className="text-[10px] text-[#20B26B] font-semibold flex items-center gap-1 bg-[#E8F8F0] px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20B26B]" />
                    Calibrated
                  </span>
                </div>
                <p className="text-xs text-[#607089]">3 of 4 planned retrieval sessions completed today</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="text-right">
                <div className="text-[10px] text-[#8A96A8] uppercase font-bold tracking-wider">Memory Strength</div>
                <div className="text-xs font-bold text-[#176FF5]">82% (Consolidating)</div>
              </div>
              <div className="w-12 h-2 rounded-full bg-[#EDF5FF] overflow-hidden">
                <div className="h-full bg-[#176FF5] rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>

          {/* Tab 1: Today's Primary Queue Item */}
          {activeTab === 'today' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#176FF5] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#176FF5] animate-pulse" />
                    Immediate Priority: Closed-Book Recall
                  </span>
                  <span className="text-[11px] text-[#8A96A8] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    4 min practice
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#10233F]">
                    Quadratic Equations & Discriminant Rules
                  </h3>
                  <p className="text-xs text-[#607089] mt-0.5">
                    Subject: Further Mathematics • Syllabus Code: MTH-204
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                    <div className="text-[10px] font-bold uppercase text-[#8A96A8]">Self-Assessed Confidence</div>
                    <div className="text-xs font-bold text-[#10233F] mt-0.5">85% (High)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                    <div className="text-[10px] font-bold uppercase text-[#8A96A8]">Past Objective Recall</div>
                    <div className="text-xs font-bold text-[#176FF5] mt-0.5">72% (Gap Detected: Illusion of knowing)</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#607089]">
                    <span className="font-semibold text-[#10233F]">Cognitive Goal:</span> Test retrieval without looking at formula sheet.
                  </div>
                  <button 
                    onClick={() => setActiveTab('schema')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#176FF5] hover:bg-[#135CD4] text-white text-xs font-bold shadow-[0_8px_20px_rgba(23,111,245,0.2)] transition-all cursor-pointer"
                  >
                    <span>Inspect Invariant Schema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subject mini progress row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <div className="text-[11px] font-semibold text-[#10233F]">Physics</div>
                  <div className="text-xs font-bold text-[#176FF5] mt-1">78% Mastered</div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#176FF5] rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <div className="text-[11px] font-semibold text-[#10233F]">Biology</div>
                  <div className="text-xs font-bold text-[#20B26B] mt-1">91% Mastered</div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#20B26B] rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <div className="text-[11px] font-semibold text-[#10233F]">Chemistry</div>
                  <div className="text-xs font-bold text-amber-600 mt-1">64% In Progress</div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Mental Schema View */}
          {activeTab === 'schema' && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#176FF5] uppercase tracking-wider">Concept Mental Schema</span>
                <span className="text-xs text-[#8A96A8]">Deconstructed without cognitive clutter</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-gray-100">
                  <div className="text-[10px] font-bold text-[#176FF5] uppercase tracking-wider">Invariant Principle</div>
                  <div className="text-xs font-semibold text-[#10233F] mt-0.5">
                    The discriminant Δ = b² - 4ac determines root nature: Δ &gt; 0 gives two real roots, Δ = 0 gives one repeated root, and Δ &lt; 0 gives complex conjugates.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-gray-100">
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Boundary Failure Condition</div>
                  <div className="text-xs font-semibold text-[#10233F] mt-0.5">
                    If coefficient a = 0, the equation reduces to a linear function bx + c = 0, and the discriminant rule is mathematically invalid.
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className="text-xs font-bold text-[#176FF5] hover:text-[#135CD4] flex items-center gap-1 cursor-pointer"
                >
                  <span>View Calibration Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Telemetry View */}
          {activeTab === 'telemetry' && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#176FF5] uppercase tracking-wider">Objective Cognitive Telemetry</span>
                <span className="text-xs text-[#20B26B] font-semibold">Zero Cramming Illusion</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-3 rounded-xl bg-white border border-gray-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#8A96A8]">Recall Accuracy</div>
                  <div className="text-lg font-bold text-[#10233F] mt-0.5">86%</div>
                  <div className="text-[10px] text-[#20B26B] font-semibold mt-0.5">Closed-book verified</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-gray-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#8A96A8]">Self-Calibration</div>
                  <div className="text-lg font-bold text-[#176FF5] mt-0.5">89%</div>
                  <div className="text-[10px] text-[#607089] font-medium mt-0.5">Accurate judgment</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-gray-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#8A96A8]">Far Transfer</div>
                  <div className="text-lg font-bold text-[#20B26B] mt-0.5">82%</div>
                  <div className="text-[10px] text-[#607089] font-medium mt-0.5">Unseen exam cases</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
