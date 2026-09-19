import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  Layers,
  Save,
  ArrowRight
} from 'lucide-react';

interface ProcessConceptViewProps {
  conceptId: string;
  onNavigate: (route: string) => void;
}

export const ProcessConceptView: React.FC<ProcessConceptViewProps> = ({ conceptId, onNavigate }) => {
  const { concepts, updateConceptState, profile } = useLearner();
  const concept = concepts.find(c => c.id === conceptId) || concepts[0];

  const [ownWords, setOwnWords] = useState(concept?.notes || '');
  const [invariants, setInvariants] = useState('');
  const [analogy, setAnalogy] = useState(
    concept?.title?.includes('Binary Search')
      ? 'Like looking up a student name in a sorted departmental register by opening right in the middle, rather than flipping every single page from page 1.'
      : ''
  );
  const [prerequisites, setPrerequisites] = useState(concept?.prerequisites?.join(', ') || '');
  const [, setTestQuestion] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!concept) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-[#10233F]">Concept not found</h2>
        <button 
          onClick={() => onNavigate('/app/today')} 
          className="btn-primary-glow px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Today's Queue
        </button>
      </div>
    );
  }

  // AI Scaffold: Calls /api/ai/concept-process
  const handleAIBreakdown = async () => {
    setIsProcessingAI(true);
    try {
      const res = await fetch('/api/ai/concept-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptTitle: concept.title,
          definition: concept.definition,
          notes: concept.notes,
          learnerContext: `${profile.institution} ${profile.fieldOfStudy}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const breakdown = data.breakdown || data;
        if (breakdown.coreIdea || breakdown.plainEnglish) setOwnWords(breakdown.coreIdea || breakdown.plainEnglish);
        if (breakdown.prerequisites && Array.isArray(breakdown.prerequisites)) {
          setInvariants(breakdown.prerequisites.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n'));
        } else if (breakdown.invariantRules) {
          setInvariants(breakdown.invariantRules);
        }
        if (breakdown.everydayAnalogy || breakdown.groundedAnalogy) setAnalogy(breakdown.everydayAnalogy || breakdown.groundedAnalogy);
        if (breakdown.keyQuestionForSelfTest || breakdown.diagnosticQuestion) setTestQuestion(breakdown.keyQuestionForSelfTest || breakdown.diagnosticQuestion);
      }
    } catch (err) {
      console.warn('Using local conceptual breakdown scaffold:', err);
      setOwnWords(`The fundamental idea of ${concept.title} is to eliminate redundant work by breaking problem instances down into verifiable invariants.`);
      setAnalogy(`Imagine allocating fuel to campus power generators: you prioritize high-draw labs during peak hours and throttle idle circuits.`);
      setInvariants(`1. Preconditions must be strictly validated. 2. Operational state must remain deterministic.`);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSaveProcessing = (e: React.FormEvent) => {
    e.preventDefault();
    updateConceptState(concept.id, 'Processed');
    setSavedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(24,60,110,0.06)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5FF] text-[#176FF5] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Step 2: Concept Schema Studio</span>
            </div>
            <VisualCueTooltip
              badgeText="Why process schemas?"
              title="Schema Theory Encoding"
              description="The brain cannot retain isolated facts without an anchoring mental schema. Articulating core invariants and analogies creates cognitive pegs for long-term memory retrieval."
              ruleOfThumb="If you cannot explain the mechanism in 2 plain sentences, you are merely memorizing words."
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F] tracking-tight">
            Mental Model Breakdown: {concept.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#607089] mt-0.5">
            Transform passive lecture notes into deep relational schemas before closed-book recall.
          </p>
        </div>

        <button
          onClick={handleAIBreakdown}
          disabled={isProcessingAI}
          className="btn-primary-glow flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isProcessingAI ? 'Analyzing Concept...' : 'Scaffold with AI Architect'}</span>
        </button>
      </div>

      {/* Target Concept Details */}
      <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_8px_30px_rgba(30,70,120,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#176FF5]">{concept.domain}</span>
          <ConceptStateBadge state={concept.state} showProgressChain />
        </div>
        <div>
          <h3 className="text-lg font-bold font-heading text-[#10233F]">{concept.title}</h3>
          <p className="text-xs text-[#607089] mt-2 italic bg-[#F8FAFD] p-3 rounded-2xl border border-[rgba(24,60,110,0.06)] leading-relaxed">
            <strong className="text-[#10233F] not-italic">Standard Academic Definition:</strong> {concept.definition}
          </p>
        </div>
      </div>

      {/* Processing Form */}
      <form onSubmit={handleSaveProcessing} className="space-y-6">
        {/* 1. Plain English / Own Words */}
        <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#10233F] uppercase tracking-wide">
              1. Explain in Plain Words (The "Feynman" Articulation)
            </label>
            <span className="text-[11px] text-[#8A96A8]">Explain as if teaching a younger peer</span>
          </div>
          <textarea
            rows={3}
            value={ownWords}
            onChange={(e) => setOwnWords(e.target.value)}
            placeholder="Strip all academic jargon. What is the fundamental mechanism happening here?"
            className="w-full p-3.5 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] placeholder-[#8A96A8] focus:ring-2 focus:ring-[#176FF5] focus:outline-hidden"
          />
        </div>

        {/* 2. Grounded Real-World Analogy */}
        <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#10233F] uppercase tracking-wide flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>2. Grounded Real-World Analogy</span>
            </label>
            <span className="text-[11px] text-[#8A96A8]">Anchors abstract ideas to physical systems</span>
          </div>
          <textarea
            rows={3}
            value={analogy}
            onChange={(e) => setAnalogy(e.target.value)}
            placeholder="e.g. A busy conductor calculating change; a gravity feed water tank with a float valve..."
            className="w-full p-3.5 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] placeholder-[#8A96A8] focus:ring-2 focus:ring-[#176FF5] focus:outline-hidden"
          />
        </div>

        {/* 3. Non-Negotiable Invariants */}
        <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#10233F] uppercase tracking-wide">
              3. Non-Negotiable Invariants & Boundary Rules
            </label>
            <span className="text-[11px] text-[#8A96A8]">What conditions must strictly hold true?</span>
          </div>
          <textarea
            rows={3}
            value={invariants}
            onChange={(e) => setInvariants(e.target.value)}
            placeholder="e.g. In Binary Search, the elements MUST already be ordered. If unordered, O(log N) is completely invalidated."
            className="w-full p-3.5 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] placeholder-[#8A96A8] focus:ring-2 focus:ring-[#176FF5] focus:outline-hidden"
          />
        </div>

        {/* 4. Prerequisite Dependencies */}
        <div className="p-6 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-xs space-y-2.5">
          <label className="block text-xs font-bold text-[#10233F] uppercase tracking-wide">
            4. Prerequisite Concepts (Comma-separated)
          </label>
          <input
            type="text"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            placeholder="e.g. Indexed Arrays, Logarithmic scaling, Monotonic invariants"
            className="w-full p-3.5 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] placeholder-[#8A96A8] focus:ring-2 focus:ring-[#176FF5] focus:outline-hidden"
          />
        </div>

        {/* Save & Transition */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(24,60,110,0.06)]">
          {savedSuccess && (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Concept processed! Moved to 'Processed' state in your learning queue.</span>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="submit"
              className="btn-primary-glow flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Schema & Update State</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(`/app/retrieve/${concept.id}`)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#EDF5FF] hover:bg-[#DCEBFF] text-[#176FF5] text-xs sm:text-sm font-bold border border-[#176FF5]/20 cursor-pointer transition-colors"
            >
              <span>Test Recall Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
