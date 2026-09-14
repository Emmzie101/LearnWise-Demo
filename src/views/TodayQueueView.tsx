import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { GuidedSystemTourBanner } from '../components/GuidedSystemTourBanner';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  Repeat, 
  Compass, 
  Layers, 
  BookOpen, 
  FolderPlus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Target,
  BrainCircuit,
  Calendar,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface TodayQueueViewProps {
  onNavigate: (route: string) => void;
  onStartWalkthrough?: (stepIndex?: number) => void;
}

export const TodayQueueView: React.FC<TodayQueueViewProps> = ({ onNavigate, onStartWalkthrough }) => {
  const { 
    profile, 
    concepts, 
    nextBestAction, 
    dismissRecommendation, 
    metrics, 
    goals, 
    selectedGoalId 
  } = useLearner();

  const [activeWorkTab, setActiveWorkTab] = useState<'all' | 'retrieve' | 'apply' | 'reinforce'>('all');

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  // Concepts due for retrieval (state: Introduced or Processed, or recall failure)
  const retrievalQueue = concepts.filter(c => c.state === 'Introduced' || c.state === 'Processed' || c.recallFailureCount > 0);
  
  // Concepts due for application (state: Retrieved, needing transfer proof)
  const applicationQueue = concepts.filter(c => c.state === 'Retrieved');

  // Concepts due for spaced reinforcement (state: Applied or Reinforced)
  const reinforcementQueue = concepts.filter(c => c.state === 'Applied' || c.state === 'Reinforced');

  const totalTasksCount = retrievalQueue.length + applicationQueue.length + reinforcementQueue.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 0. Guided Walkthrough Banner for Onboarding */}
      <GuidedSystemTourBanner
        onStartWalkthrough={(stepIdx) => {
          if (onStartWalkthrough) onStartWalkthrough(stepIdx);
        }}
        onNavigate={onNavigate}
      />

      {/* 1. Header Greeting & Primary Action Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A] tracking-tight">
            Good day, {profile?.name ? profile.name.split(' ')[0] : 'Learner'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Focus: <strong className="text-[#071A3A]">{selectedGoal?.title || 'Academic Mastery'}</strong> ({selectedGoal?.domain || 'General'})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onStartWalkthrough && (
            <button
              onClick={() => onStartWalkthrough(0)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white text-xs font-bold transition-all cursor-pointer"
              title="Learn how LearnWise works from start to finish"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>How it works</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('/app/capture/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#071A3A] text-xs font-semibold border border-gray-200 shadow-2xs transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#124BCE]" />
            <span>Add Study Topic</span>
          </button>
          <button
            onClick={() => onNavigate('/app/ai-coach')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
            <span>Ask AI Coach</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Next Action */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#124BCE] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#124BCE] animate-pulse" />
              Priority Focus
            </div>
            <VisualCueTooltip
              badgeText="Why this task?"
              title="Automated Priority Algorithm"
              description="LearnWise prioritizes concepts where memory decay is imminent, or where you have an uncalibrated illusion of competence, to protect your score before exam day."
              ruleOfThumb="Doing the hardest retrieval practice first produces the strongest synaptic consolidation."
              onExploreWalkthrough={onStartWalkthrough ? () => onStartWalkthrough(2) : undefined}
            />
          </div>
          <span className="text-xs text-gray-400">5–8 min</span>
        </div>

        {nextBestAction ? (
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#071A3A] via-[#0A2558] to-[#071A3A] text-white border border-[#1769FF]/20 shadow-lg shadow-[#124BCE]/10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  {nextBestAction.title}
                </h2>

                <p className="text-sm text-white/80 leading-relaxed font-normal">
                  {nextBestAction.reason}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 shrink-0">
                <button
                  onClick={() => onNavigate(nextBestAction.actionRoute || '/app/retrieve')}
                  className="px-6 py-3 rounded-2xl bg-[#124BCE] hover:bg-[#1769FF] text-white font-bold text-sm shadow-md shadow-[#124BCE]/25 flex items-center justify-center gap-2 transition-all hover:translate-x-0.5 cursor-pointer"
                >
                  <span>{nextBestAction.actionPrompt || 'Start Practice'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => dismissRecommendation(nextBestAction.id)}
                  className="text-xs text-white/50 hover:text-white/80 py-1 px-2 cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-[#1769FF]/15 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#071A3A]">All caught up</h3>
                <p className="text-xs text-gray-500">All scheduled reviews are complete for today.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/app/capture/new')}
              className="px-4 py-2 rounded-xl bg-[#124BCE] text-white text-xs font-bold hover:bg-[#1769FF] transition-colors cursor-pointer"
            >
              Add Topic
            </button>
          </div>
        )}
      </section>

      {/* 3. Progress Overview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Progress Overview
            </div>
            <VisualCueTooltip
              badgeText="What are these?"
              title="Cognitive Telemetry"
              description="LearnWise replaces subjective 'hours spent reading' with true cognitive metrics: Recall Accuracy (closed-book memory strength), Application Transfer (unseen problem-solving), and Self-Calibration (whether you accurately know what you know)."
              ruleOfThumb="High hours with low calibration is the #1 cause of exam panic."
              onExploreWalkthrough={onStartWalkthrough ? () => onStartWalkthrough(4) : undefined}
            />
          </div>
          <button
            onClick={() => onNavigate('/app/dashboard')}
            className="text-xs font-semibold text-[#124BCE] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Memory Strength (Retrieval) */}
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Recall Accuracy</span>
              <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50">
                Closed-book
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-emerald-600">
                {metrics.retrievalAccuracy}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.retrievalAccuracy}%` }} 
              />
            </div>
          </div>

          {/* Card 2: Problem Solving (Application) */}
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Application Transfer</span>
              <span className="text-[10px] text-amber-800 font-bold px-2 py-0.5 rounded-full bg-amber-50">
                Exam scenarios
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-amber-600">
                {metrics.applicationTransferRate}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.applicationTransferRate}%` }} 
              />
            </div>
          </div>

          {/* Card 3: Calibration */}
          <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Self-Calibration</span>
              <span className="text-[10px] text-indigo-700 font-bold px-2 py-0.5 rounded-full bg-indigo-50">
                Metacognitive
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-[#124BCE]">
                {metrics.confidenceCalibrationRate}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#124BCE] rounded-full transition-all duration-500" 
                style={{ width: `${metrics.confidenceCalibrationRate}%` }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Study Queue */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Today's Practice Queue
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveWorkTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWorkTab === 'all' ? 'bg-[#124BCE] text-white font-bold' : 'text-gray-600 hover:text-[#071A3A]'
              }`}
            >
              All ({totalTasksCount})
            </button>
            <button
              onClick={() => setActiveWorkTab('retrieve')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWorkTab === 'retrieve' ? 'bg-[#124BCE] text-white font-bold' : 'text-gray-600 hover:text-[#071A3A]'
              }`}
            >
              Recall ({retrievalQueue.length})
            </button>
            <button
              onClick={() => setActiveWorkTab('apply')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWorkTab === 'apply' ? 'bg-[#124BCE] text-white font-bold' : 'text-gray-600 hover:text-[#071A3A]'
              }`}
            >
              Solve ({applicationQueue.length})
            </button>
            <button
              onClick={() => setActiveWorkTab('reinforce')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeWorkTab === 'reinforce' ? 'bg-[#124BCE] text-white font-bold' : 'text-gray-600 hover:text-[#071A3A]'
              }`}
            >
              Review ({reinforcementQueue.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Active Recall */}
          {(activeWorkTab === 'all' || activeWorkTab === 'retrieve') && (
            <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#124BCE]">
                  <Repeat className="w-4 h-4" />
                  <h3 className="font-bold text-sm text-[#071A3A]">Recall Practice</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EAF2FF] text-[#124BCE]">
                  {retrievalQueue.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {retrievalQueue.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-gray-50 text-center text-xs text-gray-400">
                    No recall items due.
                  </div>
                ) : (
                  retrievalQueue.map(concept => (
                    <div 
                      key={concept.id}
                      className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/10 hover:border-[#1769FF]/30 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs text-[#071A3A] leading-snug">{concept.title}</h4>
                        <ConceptStateBadge state={concept.state} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                        <span>{concept.recallSuccessCount} completed</span>
                        <button
                          onClick={() => onNavigate(`/app/retrieve/${concept.id}`)}
                          className="font-bold text-[#124BCE] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Practice</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Column 2: Application Practice */}
          {(activeWorkTab === 'all' || activeWorkTab === 'apply') && (
            <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-amber-700">
                  <Compass className="w-4 h-4" />
                  <h3 className="font-bold text-sm text-[#071A3A]">Application Tasks</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800">
                  {applicationQueue.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {applicationQueue.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-gray-50 text-center text-xs text-gray-400">
                    No application tasks pending.
                  </div>
                ) : (
                  applicationQueue.map(concept => (
                    <div 
                      key={concept.id}
                      className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-amber-200/40 hover:border-amber-400 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs text-[#071A3A] leading-snug">{concept.title}</h4>
                        <ConceptStateBadge state={concept.state} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                        <span>{concept.applicationSuccessCount} passed</span>
                        <button
                          onClick={() => onNavigate(`/app/apply/${concept.id}`)}
                          className="font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Column 3: Spaced Reinforcement */}
          {(activeWorkTab === 'all' || activeWorkTab === 'reinforce') && (
            <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-teal-700">
                  <Layers className="w-4 h-4" />
                  <h3 className="font-bold text-sm text-[#071A3A]">Spaced Review</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800">
                  {reinforcementQueue.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {reinforcementQueue.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-gray-50 text-center text-xs text-gray-400">
                    No reviews due today.
                  </div>
                ) : (
                  reinforcementQueue.map(concept => (
                    <div 
                      key={concept.id}
                      className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-teal-200/40 hover:border-teal-400 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs text-[#071A3A] leading-snug">{concept.title}</h4>
                        <ConceptStateBadge state={concept.state} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          Every {concept.reinforcementIntervalDays}d
                        </span>
                        <button
                          onClick={() => onNavigate(`/app/reinforce`)}
                          className="font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Daily Check-in & Activity */}
      <section className="p-6 rounded-3xl bg-white border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Recent Activity
          </div>

          <button
            onClick={() => onNavigate('/app/reflect')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EAF2FF] text-[#124BCE] hover:bg-[#124BCE] hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reflect</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#071A3A]">Hash Table Collisions</div>
              <div className="text-[11px] text-gray-400">Recalled without notes</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#071A3A]">Distributed Locking</div>
              <div className="text-[11px] text-gray-400">Solved scenario challenge</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
