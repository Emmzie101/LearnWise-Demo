import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { 
  BrainCircuit, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Info,
  BookOpen,
  FlaskConical,
  HelpCircle
} from 'lucide-react';

interface DiagnosticViewProps {
  onComplete: () => void;
}

const DIMENSION_EXPLANATIONS: Record<string, { title: string; simple: string }> = {
  cognitive_processing: {
    title: 'Understanding Multi-Step Ideas',
    simple: 'How your working memory breaks down complex proofs, code, or scientific processes without crashing.',
  },
  knowledge_acquisition: {
    title: 'Memory Durability & Retrieval',
    simple: 'Active retrieval practice vs. passive re-reading so knowledge stays locked in your long-term memory.',
  },
  knowledge_organization: {
    title: 'Mental Models & Concept Maps',
    simple: 'Connecting topics into a structured web of knowledge instead of memorizing isolated definitions.',
  },
  self_regulation: {
    title: 'Honest Metacognitive Checking',
    simple: 'Accurately knowing what you actually understand vs. the false feeling of familiarity (the Fluency Illusion).',
  },
  motivation_emotion_identity: {
    title: 'Productive Struggle & Resilience',
    simple: 'Viewing difficulty as productive brain growth rather than a lack of "natural talent".',
  },
  environment_behavior: {
    title: 'Study Habits & Distraction Shields',
    simple: 'Setting up low-friction physical spaces, offline notes, and habits that don\'t depend on willpower.',
  },
  performance_optimization: {
    title: 'Transfer to Unfamiliar Exam Problems',
    simple: 'Applying principles to brand-new, disguised questions in WAEC, JAMB, or university semester finals.',
  },
};

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({ onComplete }) => {
  const { 
    diagnosticResponses, 
    submitDiagnosticResponse, 
    completeDiagnostic 
  } = useLearner();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedConfidence, setSelectedConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const existingResponse = diagnosticResponses.find(r => r.questionId === currentQuestion.id);
  const selectedOptionId = existingResponse?.selectedOptionId || '';

  const handleSelectOption = (optionId: string) => {
    submitDiagnosticResponse({
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      confidenceRating: selectedConfidence,
      evidenceType: currentQuestion.isMiniPerformance ? 'performance' : currentQuestion.questionType === 'scenario' ? 'observed' : 'declared',
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      completeDiagnostic();
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const dimInfo = DIMENSION_EXPLANATIONS[currentQuestion.dimension] || {
    title: currentQuestion.dimension.replace('_', ' '),
    simple: currentQuestion.subDimension,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Progress */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#124BCE] flex items-center justify-center font-bold shadow-2xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#071A3A] font-heading">
                PLSFR+ Diagnostic Assessment
              </h1>
              <span className="text-xs text-gray-500">
                Question {currentIndex + 1} of {totalQuestions} • Triangulating habits, scenarios & active recall
              </span>
            </div>
          </div>

          <div className="text-right self-start sm:self-auto flex items-center gap-2">
            <span className="text-xs font-bold text-[#124BCE]">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#124BCE] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Diagnostic Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1769FF]/15 shadow-sm space-y-6">
        {/* Pillar Header with Simple Explanation + Evidence Tier */}
        <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#124BCE] text-white">
                {dimInfo.title}
              </span>
              <span className="text-xs font-semibold text-gray-800">
                {currentQuestion.subDimension}
              </span>
            </div>

            {currentQuestion.isMiniPerformance && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" /> Live Recall Check
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-snug">
            {dimInfo.simple}
          </p>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2.5">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-[#071A3A] leading-snug">
            {currentQuestion.prompt}
          </h2>
          {currentQuestion.scenarioContext && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
              <strong>Context:</strong> {currentQuestion.scenarioContext}
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Select the option that most accurately describes your behavior:
          </div>

          {currentQuestion.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF2FF]/70 border-[#124BCE] ring-2 ring-[#1769FF]/20 shadow-2xs'
                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-[#1769FF]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-[#124BCE] border-[#124BCE] text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isSelected ? 'font-semibold text-[#071A3A]' : 'text-gray-700'
                    }`}>
                      {option.text}
                    </p>

                    {isSelected && option.diagnosticInsight && (
                      <div className="text-[11px] text-[#124BCE] font-medium pt-1 flex items-start gap-1.5 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#124BCE]" />
                        <span><strong>Cognitive insight:</strong> {option.diagnosticInsight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence check for metacognitive calibration */}
        {selectedOptionId && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">How certain are you in this answer / habit?</span>
              <span className="text-[11px] text-gray-500">Calibrates your self-regulation index</span>
            </div>
            <ConfidenceMeter
              value={selectedConfidence}
              onChange={setSelectedConfidence}
            />
          </div>
        )}

        {/* Scientific Grounding Citation */}
        {currentQuestion.citation && (
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-gray-400" />
              <span>Grounded in: <em>{currentQuestion.citation}</em></span>
            </span>
            {currentQuestion.evidenceTier && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[10px] text-slate-600 border border-slate-200">
                {currentQuestion.evidenceTier} Evidence
              </span>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
              currentIndex === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOptionId}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !selectedOptionId
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#124BCE] hover:bg-[#1769FF] text-white shadow-sm shadow-[#124BCE]/20 cursor-pointer'
            }`}
          >
            <span>{currentIndex === totalQuestions - 1 ? 'Generate My Diagnostic Report' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
