import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Battery, 
  ArrowRight, 
  Flame,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

interface ReflectionViewProps {
  onNavigate: (route: string) => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({ onNavigate }) => {
  const { addReflectionLog, profile, metrics } = useLearner();

  const [easyConcept, setEasyConcept] = useState('');
  const [unclearConcept, setUnclearConcept] = useState('');
  const [mistakeLearned, setMistakeLearned] = useState('');
  const [strategyUsed, setStrategyUsed] = useState('Closed-book retrieval before reading');
  const [nextSessionChange, setNextSessionChange] = useState('');
  const [energyRating, setEnergyRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!easyConcept.trim() || !unclearConcept.trim()) return;

    addReflectionLog({
      easyConcept: easyConcept.trim(),
      unclearConcept: unclearConcept.trim(),
      mistakeLearned: mistakeLearned.trim(),
      strategyUsed: strategyUsed.trim(),
      nextSessionChange: nextSessionChange.trim(),
      energyRating,
    });

    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Dimension 4: Self-Regulation & Metacognition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
          Metacognitive Study Reflection
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Take 3 minutes to evaluate your cognitive process. Reflection transforms raw study time into actionable self-calibration.
        </p>
      </div>

      {!isSaved ? (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1769FF]/15 shadow-xs space-y-6">
          {/* Energy & Attention Level */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Study Block Energy & Concentration Level (1-5)
              </label>
              <span className="text-xs font-bold text-[#124BCE]">{energyRating}/5</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => setEnergyRating(rating as 1 | 2 | 3 | 4 | 5)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    energyRating === rating
                      ? 'bg-[#124BCE] text-white shadow-md'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {rating} {rating === 5 ? '⚡ High' : rating === 1 ? '😴 Low' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Question 1: What felt easy? */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              1. What concept or problem felt clear and effortless today?
            </label>
            <textarea
              rows={2}
              required
              value={easyConcept}
              onChange={(e) => setEasyConcept(e.target.value)}
              placeholder="e.g. Binary Search invariant boundary pointers, Hooke's law proportionality..."
              className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          {/* Question 2: What was unclear? */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              2. Where did you encounter cognitive friction, hesitation, or confusion?
            </label>
            <textarea
              rows={2}
              required
              value={unclearConcept}
              onChange={(e) => setUnclearConcept(e.target.value)}
              placeholder="e.g. I struggled to formulate the DP recurrence relation for multidimensional states..."
              className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          {/* Question 3: Specific error learned */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              3. What specific mistake did you catch yourself making?
            </label>
            <textarea
              rows={2}
              value={mistakeLearned}
              onChange={(e) => setMistakeLearned(e.target.value)}
              placeholder="e.g. Assuming familiarity meant I could reconstruct the proof without checking edge cases..."
              className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          {/* Question 4: Strategy used */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              4. What learning strategy helped you make the most progress?
            </label>
            <select
              value={strategyUsed}
              onChange={(e) => setStrategyUsed(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071A3A]"
            >
              <option value="Closed-book retrieval before reading">Closed-book retrieval before reading notes</option>
              <option value="Formulating real-world Nigerian analogies">Formulating real-world Nigerian analogies</option>
              <option value="Tracing algorithms manually with pen and paper">Tracing algorithms manually with pen and paper</option>
              <option value="Explaining to a peer (Feynman technique)">Explaining to a peer (Feynman technique)</option>
              <option value="Timed exam condition simulation">Timed exam condition simulation</option>
            </select>
          </div>

          {/* Question 5: What to change next time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              5. What concrete adjustment will you make in your very next study block?
            </label>
            <input
              type="text"
              value={nextSessionChange}
              onChange={(e) => setNextSessionChange(e.target.value)}
              placeholder="e.g. Put smartphone in the other room, test recall after 10 minutes instead of re-reading..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Log Metacognitive Reflection
            </button>
          </div>
        </form>
      ) : (
        <div className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-sm text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold font-heading text-[#071A3A]">
            Reflection Recorded & Metacognition Updated!
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Your self-regulation dimension telemetry has been credited. Consistent metacognitive monitoring is proven to increase exam accuracy by over 20%.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate('/app/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#124BCE] text-white text-xs font-bold hover:bg-[#1769FF] cursor-pointer"
            >
              View Assimilation Dashboard
            </button>
            <button
              onClick={() => onNavigate('/app/today')}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 cursor-pointer"
            >
              Back to Today's Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
