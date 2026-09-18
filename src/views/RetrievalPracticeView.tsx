import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { RetrievalErrorType, Concept } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface RetrievalPracticeViewProps {
  targetConceptId?: string;
  onNavigate: (route: string) => void;
  onStartWalkthrough?: () => void;
}

export const RetrievalPracticeView: React.FC<RetrievalPracticeViewProps> = ({ 
  targetConceptId, 
  onNavigate,
  onStartWalkthrough 
}) => {
  const { concepts, submitRetrievalAttempt } = useLearner();

  // Find targeted concept or fallback to first concept in queue
  const initialConcept = concepts.find(c => c.id === targetConceptId) || concepts[0];
  const [selectedConcept, setSelectedConcept] = useState<Concept>(initialConcept || concepts[0]);

  // Form states
  const [userResponse, setUserResponse] = useState('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [errorType, setErrorType] = useState<RetrievalErrorType>('none');
  const [reflectionNote, setReflectionNote] = useState('');

  if (!selectedConcept) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <h2 className="text-xl font-bold font-heading text-[#10233F]">No Concepts Available for Retrieval</h2>
        <p className="text-sm text-[#607089]">Capture a concept first to begin active recall practice.</p>
        <button
          onClick={() => onNavigate('/app/capture/new')}
          className="btn-primary-glow px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          Capture Concept
        </button>
      </div>
    );
  }

  // Pre-formulated retrieval prompt derived from the concept
  const retrievalPrompt = `Without opening your lecture slides or notes: In your own words, articulate the core mechanism and constraints of "${selectedConcept.title}". State how it operates and where it is most vulnerable to failure.`;

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;

    submitRetrievalAttempt({
      conceptId: selectedConcept.id,
      prompt: retrievalPrompt,
      userResponse,
      correctAnswer: selectedConcept.definition,
      isCorrect,
      confidenceRating: confidence,
      errorType,
      reflectionNote,
    });

    setIsSubmitted(true);
  };

  const handleNextConcept = () => {
    const next = concepts.find(c => c.id !== selectedConcept.id && c.state !== 'Stable');
    if (next) {
      setSelectedConcept(next);
      setUserResponse('');
      setConfidence(3);
      setIsSubmitted(false);
      setIsCorrect(true);
      setErrorType('none');
      setReflectionNote('');
    } else {
      onNavigate('/app/today');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(24,60,110,0.06)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-heading text-[#10233F] tracking-tight">
              Active Retrieval
            </h1>
            <VisualCueTooltip
              badgeText="Step 3: Why Closed-Book?"
              title="Memory Consolidation Through Struggle"
              description="Forcing your brain to pull a concept out from memory consolidates neural pathways 300% better than reading notes. It also exposes illusions of knowing where you think you know it because it looks familiar."
              ruleOfThumb="If it feels easy, you are not learning; retrieval must be a deliberate struggle."
              onExploreWalkthrough={onStartWalkthrough}
            />
          </div>
          <p className="text-xs sm:text-sm text-[#607089] mt-0.5">
            Test recall without notes to calibrate confidence and cement permanent memory.
          </p>
        </div>

        {/* Concept Switcher Dropdown & Walkthrough Link */}
        <div className="flex items-center gap-2">
          {onStartWalkthrough && (
            <button
              onClick={onStartWalkthrough}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EDF5FF] text-[#176FF5] hover:bg-[#DCEBFF] text-xs font-semibold transition-colors cursor-pointer border border-[#176FF5]/20"
              title="See how retrieval fits into the 5-step flow"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Stage Guide</span>
            </button>
          )}

          <span className="text-xs text-[#8A96A8]">Concept:</span>
          <select
            value={selectedConcept.id}
            onChange={(e) => {
              const found = concepts.find(c => c.id === e.target.value);
              if (found) {
                setSelectedConcept(found);
                setUserResponse('');
                setIsSubmitted(false);
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-[rgba(24,60,110,0.12)] text-xs font-semibold bg-white text-[#10233F] focus:ring-2 focus:ring-[#176FF5] shadow-2xs"
          >
            {concepts.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Concept Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_8px_30px_rgba(30,70,120,0.04)] space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#176FF5] uppercase tracking-wider">{selectedConcept.domain}</span>
            <h2 className="text-xl font-bold font-heading text-[#10233F] mt-0.5">
              {selectedConcept.title}
            </h2>
          </div>
          <ConceptStateBadge state={selectedConcept.state} />
        </div>

        {/* Retrieval Question Prompt */}
        <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)]">
          <span className="text-[11px] font-bold text-[#8A96A8] uppercase tracking-wider block mb-1">
            Closed-Book Prompt
          </span>
          <p className="text-sm font-semibold text-[#10233F] leading-relaxed">
            {retrievalPrompt}
          </p>
        </div>

        {/* Submission Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmitAttempt} className="space-y-5 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#10233F]">
                Your Reconstructed Response (from memory):
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Explain the concept in your own words without checking notes..."
                rows={4}
                required
                className="w-full p-4 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] focus:outline-hidden focus:ring-2 focus:ring-[#176FF5] focus:border-transparent placeholder:text-[#8A96A8] resize-y"
              />
            </div>

            {/* Metacognitive Confidence Rating */}
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-2">
              <ConfidenceMeter
                value={confidence}
                onChange={setConfidence}
              />
            </div>

            {/* Self-Check & Error Classification Checkboxes */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-[#607089]">Self-grading:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="correctness"
                    checked={isCorrect}
                    onChange={() => {
                      setIsCorrect(true);
                      setErrorType('none');
                    }}
                    className="text-[#176FF5]"
                  />
                  <span className="text-emerald-700">Substantially Correct</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="correctness"
                    checked={!isCorrect}
                    onChange={() => {
                      setIsCorrect(false);
                      if (errorType === 'none') setErrorType('conceptual_misunderstanding');
                    }}
                    className="text-rose-600"
                  />
                  <span className="text-rose-700">Gaps / Incorrect</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!userResponse.trim()}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  userResponse.trim()
                    ? 'btn-primary-glow'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit & Reveal Answer
              </button>
            </div>

            {!isCorrect && (
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <label className="block text-xs font-bold text-rose-900">
                  Classify the Error Type (Systematic Taxonomy):
                </label>
                <select
                  value={errorType}
                  onChange={(e) => setErrorType(e.target.value as RetrievalErrorType)}
                  className="w-full p-2.5 rounded-xl border border-rose-300 text-xs bg-white text-rose-950 font-medium focus:ring-2 focus:ring-rose-500"
                >
                  <option value="conceptual_misunderstanding">Conceptual Misunderstanding of Mechanism</option>
                  <option value="formula_recall_failure">Formula / Rule Recall Failure</option>
                  <option value="missing_prerequisite">Missing Prerequisite Dependency</option>
                  <option value="incomplete_response">Incomplete Response / Surface Familiarity Only</option>
                  <option value="careless_mistake">Careless Execution Mistake</option>
                </select>
              </div>
            )}
          </form>
        ) : (
          /* Post-Submission Feedback & Comparison View */
          <div className="space-y-6 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
            {/* Answer Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#8A96A8]">Your Reconstructed Answer</span>
                  {isCorrect ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Missed
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#10233F] leading-relaxed whitespace-pre-line">
                  {userResponse}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF5FF]/60 border border-[#176FF5]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#176FF5]">Official Reference Definition</span>
                  <span className="text-[11px] font-semibold text-[#8A96A8]">Source Standard</span>
                </div>
                <p className="text-xs text-[#10233F] leading-relaxed">
                  {selectedConcept.definition}
                </p>
              </div>
            </div>

            {/* Metacognitive Calibration Feedback */}
            <div className="p-4 rounded-2xl bg-white border border-[rgba(24,60,110,0.08)] space-y-2">
              <div className="text-xs font-bold text-[#10233F]">Metacognitive Calibration Analysis:</div>
              {isCorrect && confidence >= 4 && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                  <strong>Well Calibrated:</strong> You rated confidence at {confidence}/5 and successfully reconstructed the concept. Your schema is stable.
                </div>
              )}
              {!isCorrect && confidence >= 4 && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                  <strong>Overconfident (Illusion of Fluency):</strong> You rated confidence at {confidence}/5, but encountered gaps. This is normal when passive exposure tricks the brain into feeling familiar. Your adaptive engine will schedule a sooner closed-book drill.
                </div>
              )}
              {isCorrect && confidence <= 2 && (
                <div className="p-3 rounded-xl bg-[#EDF5FF] text-[#176FF5] text-xs border border-[#176FF5]/20">
                  <strong>Underconfident:</strong> You rated confidence at {confidence}/5, but actually got the mechanism right. Trust your foundation!
                </div>
              )}
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => onNavigate(`/app/apply/${selectedConcept.id}`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Proceed to Application Challenge for this Concept →
              </button>

              <button
                onClick={handleNextConcept}
                className="btn-primary-glow w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Next Queue Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
