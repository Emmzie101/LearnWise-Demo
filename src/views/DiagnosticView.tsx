import React, { useState, useEffect, useRef } from 'react';
import { useLearner } from '../context/LearnerContext';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { getFriendlyDimension } from '../utils/learnerFriendly';
import { 
  BrainCircuit, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  BookOpen, 
  FlaskConical, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
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
    commitQuestionResponse,
    completeDiagnosticAsync,
  } = useLearner();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedConfidence, setSelectedConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState<boolean>(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const hasResumedRef = useRef<boolean>(false);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Directly derive committed state from committed diagnosticResponses ledger
  const existingResponse = diagnosticResponses.find(r => r.questionId === currentQuestion.id);
  const isCommitted = Boolean(existingResponse);

  // Resume at first unanswered question on initial mount
  useEffect(() => {
    if (!hasResumedRef.current && diagnosticResponses.length > 0) {
      const firstUnansweredIndex = DIAGNOSTIC_QUESTIONS.findIndex(
        q => !diagnosticResponses.some(r => r.questionId === q.id)
      );
      if (firstUnansweredIndex > 0) {
        setCurrentIndex(firstUnansweredIndex);
      }
      hasResumedRef.current = true;
    }
  }, [diagnosticResponses]);

  // Synchronize draft state and reset timer whenever current question changes
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setShowWhy(false);
    if (existingResponse) {
      setSelectedOptionId(existingResponse.selectedOptionId);
      setSelectedConfidence((existingResponse.confidenceRating as 1 | 2 | 3 | 4 | 5) ?? 3);
    } else {
      setSelectedOptionId('');
      setSelectedConfidence(3);
    }
  }, [currentIndex, existingResponse?.selectedOptionId, existingResponse?.confidenceRating]);

  const handleSelectOption = (optionId: string) => {
    if (isCommitted) return; // Previously committed responses are immutable
    setSelectedOptionId(optionId);
  };

  const handleNext = async () => {
    if (!selectedOptionId) return;

    setSubmitError(null);

    // If already committed to ledger and not final, simply advance without re-persisting
    if (isCommitted && currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    const responsePayload = {
      questionId: currentQuestion.id,
      selectedOptionId,
      confidenceRating: selectedConfidence,
      responseTimeSeconds: elapsedSeconds,
      evidenceType: (currentQuestion.isMiniPerformance 
        ? 'performance' 
        : currentQuestion.questionType === 'scenario' 
          ? 'observed' 
          : 'declared') as 'declared' | 'observed' | 'performance',
    };

    if (currentIndex < totalQuestions - 1) {
      // Intermediate Question: MUST await persistence before advancing
      setIsSubmitting(true);
      try {
        await commitQuestionResponse(responsePayload);
        setCurrentIndex(prev => prev + 1);
      } catch (err: any) {
        console.error('[DiagnosticView] Error committing response:', err);
        setSubmitError(err?.message || 'Failed to save question response. Please check your connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Final Question: Complete Assessment & Persist Report using COMPLETE response set
      setIsSubmitting(true);
      try {
        let updatedResponses: typeof diagnosticResponses | undefined;
        if (!isCommitted) {
          updatedResponses = await commitQuestionResponse(responsePayload);
        }
        await completeDiagnosticAsync(updatedResponses);
        onComplete();
      } catch (err: any) {
        console.error('[DiagnosticView] Error completing assessment:', err);
        setSubmitError(err?.message || 'Failed to finalize diagnostic assessment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const friendlyDim = getFriendlyDimension(currentQuestion.dimension);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg text-[#10233F] font-heading">
              Learning Check
            </h1>
            <p className="text-xs text-[#607089]">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>

          <span className="text-xs font-bold text-[#176FF5] bg-[#EDF5FF] px-2.5 py-1 rounded-full">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#176FF5] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Error alert if submission fails */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold">Error saving answer</p>
            <p>{submitError}</p>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-sm space-y-6">
        {/* Category Pill & Subtle Progressive Disclosure */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDF5FF] text-[#176FF5]">
              {friendlyDim.name}
            </span>
            {currentQuestion.isMiniPerformance && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" /> Quick check
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowWhy(!showWhy)}
            className="text-xs text-[#607089] hover:text-[#176FF5] flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why are we asking this?</span>
            {showWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Explanation (Progressive Disclosure) */}
        {showWhy && (
          <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.08)] text-xs text-[#607089] space-y-2 animate-in fade-in duration-150">
            <p className="leading-relaxed">
              <strong>{friendlyDim.name}:</strong> {friendlyDim.simpleDescription} {friendlyDim.whyItMatters}
            </p>
            {currentQuestion.citation && (
              <div className="pt-1.5 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] text-[#8A96A8]">
                <BookOpen className="w-3 h-3 text-[#8A96A8]" />
                <span>Research backing: <em>{currentQuestion.citation}</em></span>
              </div>
            )}
          </div>
        )}

        {/* Question Prompt */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold font-heading text-[#10233F] leading-snug">
            {currentQuestion.prompt}
          </h2>
          {currentQuestion.scenarioContext && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
              <strong>Situation:</strong> {currentQuestion.scenarioContext}
            </div>
          )}
        </div>

        {/* Immutable Saved Notice if already recorded */}
        {isCommitted && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Response recorded in your profile.</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-200/60 px-2 py-0.5 rounded-md">
              Saved
            </span>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-[#8A96A8]">
            {isCommitted ? 'Your selected answer:' : 'Choose the best match for you:'}
          </div>

          {currentQuestion.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => !isCommitted && handleSelectOption(option.id)}
                className={`p-4 rounded-2xl border transition-all ${
                  isCommitted ? (
                    isSelected 
                      ? 'bg-[#EDF5FF] border-[#176FF5] ring-2 ring-[#176FF5]/20 shadow-xs cursor-default'
                      : 'bg-gray-50/70 border-gray-200 opacity-50 cursor-not-allowed'
                  ) : (
                    isSelected
                      ? 'bg-[#EDF5FF] border-[#176FF5] ring-2 ring-[#176FF5]/20 shadow-xs cursor-pointer'
                      : 'bg-white hover:bg-[#F8FAFD] border-gray-200 hover:border-[#176FF5]/40 cursor-pointer'
                  )
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-[#176FF5] border-[#176FF5] text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isSelected ? 'font-semibold text-[#10233F]' : 'text-gray-700'
                    }`}>
                      {option.text}
                    </p>

                    {isSelected && option.diagnosticInsight && (
                      <div className="text-xs text-[#176FF5] font-medium pt-1 flex items-start gap-1.5 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#176FF5]" />
                        <span>{option.diagnosticInsight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence check */}
        {selectedOptionId && (
          <div className="pt-4 border-t border-gray-100">
            <ConfidenceMeter
              value={selectedConfidence}
              onChange={isCommitted ? undefined : setSelectedConfidence}
              readOnly={isCommitted}
            />
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0 || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
              currentIndex === 0 || isSubmitting
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-[#607089] hover:bg-[#F8FAFD] cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOptionId || isSubmitting}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !selectedOptionId || isSubmitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'btn-primary-glow cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{currentIndex === totalQuestions - 1 ? 'Saving Results...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <span>{currentIndex === totalQuestions - 1 ? 'See Your Results' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
