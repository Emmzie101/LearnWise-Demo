import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { ConceptStateBadge } from '../components/ConceptStateBadge';
import { 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  Layers,
  Save
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
      ? 'Like looking up a student name in a sorted UNILAG departmental attendance register by opening right in the middle, rather than flipping every single page from page 1.'
      : ''
  );
  const [prerequisites, setPrerequisites] = useState(concept?.prerequisites?.join(', ') || '');
  const [testQuestion, setTestQuestion] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!concept) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-lg font-bold">Concept not found</h2>
        <button onClick={() => onNavigate('/app/today')} className="mt-2 text-xs font-bold text-[#124BCE]">
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
        if (data.plainEnglish) setOwnWords(data.plainEnglish);
        if (data.invariantRules) setInvariants(data.invariantRules);
        if (data.groundedAnalogy) setAnalogy(data.groundedAnalogy);
        if (data.diagnosticQuestion) setTestQuestion(data.diagnosticQuestion);
      }
    } catch (err) {
      console.warn('Using local conceptual breakdown scaffold:', err);
      setOwnWords(`The fundamental idea of ${concept.title} is to eliminate redundant work by breaking problem instances down into verifiable invariants.`);
      setAnalogy(`Imagine allocating diesel fuel to university hostel generators: you prioritize high-draw loads during study hours and throttle idle circuits.`);
      setInvariants(`1. Preconditions must be strictly validated. 2. Operational state must remain deterministic.`);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSaveProcessing = (e: React.FormEvent) => {
    e.preventDefault();
    // Update concept state to Processed
    updateConceptState(concept.id, 'Processed');
    setSavedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Active Concept Processing Studio</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-[#071A3A]">
            Mental Model Breakdown: {concept.title}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transform passive lecture notes into deep relational schemas before testing recall.
          </p>
        </div>

        <button
          onClick={handleAIBreakdown}
          disabled={isProcessingAI}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A3A] hover:bg-[#124BCE] text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#F4C542]" />
          <span>{isProcessingAI ? 'Analyzing Concept...' : 'Scaffold with AI Architect'}</span>
        </button>
      </div>

      {/* Target Concept Details */}
      <div className="p-5 rounded-2xl bg-white border border-[#1769FF]/15 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#124BCE]">{concept.domain}</span>
          <ConceptStateBadge state={concept.state} showProgressChain />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#071A3A]">{concept.title}</h3>
          <p className="text-xs text-gray-600 mt-1 italic bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <strong>Standard Definition:</strong> {concept.definition}
          </p>
        </div>
      </div>

      {/* Processing Form */}
      <form onSubmit={handleSaveProcessing} className="space-y-6">
        {/* 1. Plain English / Own Words */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#071A3A] uppercase tracking-wide">
              1. Explain in Plain Words (The "Feynman" Articulation)
            </label>
            <span className="text-[11px] text-gray-400">Explain as if teaching an SS1 student</span>
          </div>
          <textarea
            rows={3}
            value={ownWords}
            onChange={(e) => setOwnWords(e.target.value)}
            placeholder="Strip all academic jargon. What is the fundamental mechanism happening here?"
            className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
          />
        </div>

        {/* 2. Grounded Nigerian Real-World Analogy */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#071A3A] uppercase tracking-wide flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#F4C542]" />
              2. Grounded Real-World Analogy
            </label>
            <span className="text-[11px] text-gray-400">Anchors abstract concepts into physical models</span>
          </div>
          <textarea
            rows={3}
            value={analogy}
            onChange={(e) => setAnalogy(e.target.value)}
            placeholder="e.g. A Lagos Danfo conductor queuing change; a hostel water tank with a float valve; a bank queue during cash crunch..."
            className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
          />
        </div>

        {/* 3. Non-Negotiable Invariants */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#071A3A] uppercase tracking-wide">
              3. Non-Negotiable Invariants & Rules
            </label>
            <span className="text-[11px] text-gray-400">What conditions must strictly hold true?</span>
          </div>
          <textarea
            rows={3}
            value={invariants}
            onChange={(e) => setInvariants(e.target.value)}
            placeholder="e.g. In Binary Search, the collection MUST already be sorted. If unsorted, O(log N) claim is completely invalid."
            className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
          />
        </div>

        {/* 4. Prerequisite Dependencies */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
          <label className="block text-xs font-bold text-[#071A3A] uppercase tracking-wide">
            4. Prerequisite Concepts (Comma-separated)
          </label>
          <input
            type="text"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            placeholder="e.g. Arrays, Logarithms, Divide and Conquer, Monotonic functions"
            className="w-full p-3 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
          />
        </div>

        {/* Save & Transition */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          {savedSuccess && (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Concept processed! Moved to 'Processed' state in your learning queue.</span>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Schema & Update State</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(`/app/retrieve/${concept.id}`)}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 cursor-pointer"
            >
              <span>Test Recall Now →</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
