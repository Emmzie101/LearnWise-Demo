import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { LearningGoal, LearningPathPhase } from '../types';
import { 
  Target, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Layers,
  ChevronRight,
  TrendingUp,
  Brain,
  AlertTriangle,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface GoalsAndPathsViewProps {
  onNavigate: (route: string) => void;
}

export const GoalsAndPathsView: React.FC<GoalsAndPathsViewProps> = ({ onNavigate }) => {
  const { 
    goals, 
    selectedGoalId, 
    setSelectedGoalId, 
    addGoal, 
    concepts, 
    profile, 
    dimensions,
    bottleneckRecommendation,
    strategyPlan
  } = useLearner();

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  // Modal / Form state for new goal
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState<'Computer Science' | 'Engineering' | 'Mathematics' | 'Natural Sciences' | 'Medical Sciences' | 'Social Sciences' | 'General'>('Computer Science');
  const [newTargetDate, setNewTargetDate] = useState('2026-11-30');
  const [isArchitecting, setIsArchitecting] = useState(false);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsArchitecting(true);
    let generatedPhases: LearningPathPhase[] = [];

    // Attempt AI Learning Architect generation via backend endpoint
    try {
      const res = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: newTitle,
          targetDomain: newDomain,
          learnerProfile: profile,
          dimensions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const phasesList = data.phases || data.strategy?.phases;
        if (phasesList && Array.isArray(phasesList)) {
          generatedPhases = phasesList;
        }
      }
    } catch (err) {
      console.warn('Using local fallback path architecture:', err);
    }

    if (generatedPhases.length === 0) {
      generatedPhases = [
        {
          id: 'p1',
          phase: 1,
          duration: '1-2 Weeks',
          focus: 'Mental model formation and core terminology',
          name: 'Phase 1: Foundational Vocabulary & Invariants',
          description: 'Establish clear mental models and define non-negotiable rules.',
          concepts: ['Invariant Rules', 'Core Terminology', 'Prerequisite Map'],
          activities: ['Closed-book retrieval', 'Self-explanation'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          duration: '1-2 Weeks',
          focus: 'Active reconstructive recall',
          name: 'Phase 2: Closed-Book Structural Reconstruction',
          description: 'Eliminate recognition illusion via active reconstructive recall.',
          concepts: ['Mechanics Walkthrough', 'Self-Explanation Tracing'],
          activities: ['Feynman technique explanation', 'Error deconstruction'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          duration: '2 Weeks',
          focus: 'Operational transfer in realistic scenarios',
          name: 'Phase 3: Operational Transfer in Realistic Scenarios',
          description: 'Deploy principles in unfamiliar problem cases.',
          concepts: ['Case Challenge 1', 'Case Challenge 2', 'Trade-off Analysis'],
          activities: ['Far-transfer problem solving', 'Edge-case boundary testing'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          duration: 'Ongoing',
          focus: 'Distributed spaced reinforcement',
          name: 'Phase 4: Spaced Consolidation & Stability',
          description: 'Multi-interval reinforcement along forgetting curves.',
          concepts: ['Timed Simulation', 'Final Synthesis'],
          activities: ['Distributed flash recall', 'Cumulative timed exam simulation'],
          completed: false,
        },
      ];
    }

    await addGoal({
      title: newTitle.trim(),
      description: newDesc.trim() || `Mastery path for ${newTitle.trim()}`,
      targetDate: newTargetDate,
      domain: newDomain,
      goalType: 'academic',
      priority: 'High',
      status: 'Active',
      phases: generatedPhases,
    });

    setIsArchitecting(false);
    setShowNewGoalModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Curriculum & Path Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
            Learning Goals & Progression Paths
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Structured by the AI Learning Architect according to prerequisite dependencies, not chronological chapters.
          </p>
        </div>

        <button
          onClick={() => setShowNewGoalModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Architect New Goal</span>
        </button>
      </div>

      {/* Goal Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {goals.map(g => {
          const isSelected = g.id === selectedGoal?.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGoalId(g.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#071A3A] text-white border-[#071A3A] shadow-md shadow-[#071A3A]/15'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{g.title}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  isSelected ? 'bg-white/20 text-[#F4C542]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {g.domain}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Goal Detail & Architecture Plan */}
      {selectedGoal && (
        <div className="space-y-6">
          {/* Goal Overview Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#1769FF]/20 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#124BCE] uppercase">{selectedGoal.domain}</span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#071A3A] mt-0.5">
                  {selectedGoal.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {selectedGoal.description}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-gray-400 block">Target Completion</span>
                <span className="text-xs font-semibold text-[#071A3A]">{selectedGoal.targetDate}</span>
              </div>
            </div>

            {/* Personalised Bottleneck & Strategy Synthesis */}
            {bottleneckRecommendation && (
              <div className="mt-4 pt-4 border-t border-gray-100 bg-[#F9FBFF] rounded-2xl p-4 border border-[#1769FF]/15">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {bottleneckRecommendation.primaryBottleneck ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          Primary Bottleneck: {bottleneckRecommendation.primaryBottleneck.title} ({bottleneckRecommendation.primaryBottleneck.score}/100)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          Awaiting Diagnostic Telemetry
                        </span>
                      )}

                      {bottleneckRecommendation.leverageableStrength ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          Leverageable Strength: {bottleneckRecommendation.leverageableStrength.title} ({bottleneckRecommendation.leverageableStrength.score}/100)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          Calibrating Cognitive Profile
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      <strong className="text-[#071A3A]">Why this limits {selectedGoal.title}:</strong> {bottleneckRecommendation.goalConnection}
                    </p>

                    <div className="text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200 space-y-1">
                      <div className="font-bold text-[#071A3A] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#124BCE]" />
                        <span>Prescribed Deliberate Practice Protocol</span>
                      </div>
                      <p className="text-[11px] text-gray-600">{bottleneckRecommendation.deliberatePracticeRoutine || bottleneckRecommendation.recommendedIntervention?.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-start md:items-end justify-center">
                    <button
                      onClick={() => onNavigate(bottleneckRecommendation.nextAction?.route || '/app/diagnostic')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <span>{bottleneckRecommendation.nextAction?.title || 'Take Diagnostic Assessment'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-gray-400 mt-1">Adaptive Next Best Action</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Phase Architecture Stepper */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg font-heading text-[#071A3A]">
                Evidence-Informed Path Architecture
              </h3>
              <span className="text-xs text-gray-500">
                {selectedGoal.phases?.length || 0} Progression Phases
              </span>
            </div>

            <div className="space-y-4">
              {selectedGoal.phases?.map((phase, idx) => (
                <div 
                  key={phase.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    phase.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : idx === 0 || selectedGoal.phases[idx - 1]?.completed
                      ? 'bg-white border-[#1769FF]/30 shadow-sm'
                      : 'bg-gray-50/70 border-gray-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        phase.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#EAF2FF] text-[#124BCE]'
                      }`}>
                        {phase.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#071A3A]">{phase.name}</h4>
                        <p className="text-xs text-gray-500">{phase.description}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      phase.completed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {phase.completed ? 'Mastered' : 'In Progress'}
                    </span>
                  </div>

                  {/* Concepts inside this phase */}
                  <div className="pt-4 space-y-2">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Target Schemas & Concepts:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.concepts.map((conceptName, cIdx) => (
                        <span 
                          key={cIdx}
                          className="px-3 py-1 rounded-xl bg-[#F7FAFF] border border-gray-200 text-xs font-semibold text-[#071A3A] flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#124BCE]" />
                          {conceptName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating / Architecting Goal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#124BCE]" />
                <h3 className="font-bold text-lg text-[#071A3A]">Architect New Learning Goal</h3>
              </div>
              <button 
                onClick={() => setShowNewGoalModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block font-bold text-[#071A3A]">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Linear Algebra for Machine Learning, Pass JAMB Physics with 85+"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#071A3A]">Academic Domain</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071A3A]"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Natural Sciences">Natural Sciences (Physics/Chem/Bio)</option>
                  <option value="Medical Sciences">Medical Sciences</option>
                  <option value="Social Sciences">Social Sciences (Econ/Finance)</option>
                  <option value="General">General Education</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#071A3A]">Description / Exam Syllabus Scope</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Paste topics or specific syllabus scope. The AI Learning Architect will decompose it into sequential phases..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs text-[#071A3A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#071A3A]">Target Exam / Target Date</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isArchitecting || !newTitle.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>{isArchitecting ? 'Architecting Path...' : 'Synthesize Path'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
