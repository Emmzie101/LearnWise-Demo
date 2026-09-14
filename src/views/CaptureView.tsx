import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { TaskType, DomainType } from '../types';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  FolderPlus, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Target, 
  CheckCircle2,
  HelpCircle,
  Tag,
  Compass
} from 'lucide-react';

interface CaptureViewProps {
  onNavigate: (route: string) => void;
  onStartWalkthrough?: () => void;
}

export const CaptureView: React.FC<CaptureViewProps> = ({ onNavigate, onStartWalkthrough }) => {
  const { addConcept, goals, selectedGoalId } = useLearner();

  const [title, setTitle] = useState('');
  const [definition, setDefinition] = useState('');
  const [notes, setNotes] = useState('');
  const [goalId, setGoalId] = useState(selectedGoalId || (goals[0]?.id ?? ''));
  const [taskType, setTaskType] = useState<TaskType>('Conceptual');
  const [domain, setDomain] = useState<DomainType>('Computer Science');
  const [source, setSource] = useState('Lecture / Textbook');
  const [tagsInput, setTagsInput] = useState('');
  const [savedConceptId, setSavedConceptId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !definition.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const newId = addConcept({
      goalId,
      title: title.trim(),
      definition: definition.trim(),
      notes: notes.trim(),
      taskType,
      domain,
      source: source.trim(),
      tags,
    });

    setSavedConceptId(newId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Step 2: Schema Ingestion</span>
          </div>
          <VisualCueTooltip
            badgeText="Step 2: How to Structure"
            title="Mental Schema Formation"
            description="Do not copy paste large paragraphs. Extract only the invariant principle: What does it do? When does it fail? What makes it different from similar ideas?"
            ruleOfThumb="If a definition has more than 3 clauses, it will overload your working memory. Simplify before storing."
            onExploreWalkthrough={onStartWalkthrough}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold font-heading text-[#071A3A]">
              Capture New Learning Material
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Ingest raw concepts from lectures, textbooks, YouTube, or past questions, then process them into structured schemas.
            </p>
          </div>
          {onStartWalkthrough && (
            <button
              onClick={onStartWalkthrough}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-[#124BCE] border border-gray-200 text-xs font-semibold self-start sm:self-auto cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Full Walkthrough</span>
            </button>
          )}
        </div>
      </div>

      {!savedConceptId ? (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1769FF]/15 shadow-xs space-y-6">
          {/* Concept Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              Concept or Principle Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dynamic Programming (Memoization), Amortized Complexity, Hooke's Law"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          {/* Goal & Domain Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Associated Learning Goal
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
              >
                {goals.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Cognitive Task Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskType)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
              >
                <option value="Conceptual">Conceptual Understanding</option>
                <option value="Procedural">Procedural / Algorithm</option>
                <option value="Problem-solving">Problem Solving</option>
                <option value="Memorization">Factual / Formula Recall</option>
                <option value="Synthesis">Cross-domain Synthesis</option>
                <option value="Evaluative">Evaluative / Critique</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Academic Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as DomainType)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071A3A] focus:ring-2 focus:ring-[#124BCE]"
              >
                <option value="Computer Science">Computer Science / IT</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Engineering">Engineering</option>
                <option value="Natural Sciences">Physics / Chemistry / Biology</option>
                <option value="Medical Sciences">Medicine / Pharmacy</option>
                <option value="Social Sciences">Economics / Finance</option>
                <option value="General">Other / Humanities</option>
              </select>
            </div>
          </div>

          {/* Core Definition / Reference Standard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Core Definition or Invariant Standard *
              </label>
              <span className="text-[11px] text-gray-400">The authoritative reference truth</span>
            </div>
            <textarea
              required
              rows={3}
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Provide the standard definition or rule from the course slides/textbook..."
              className="w-full p-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          {/* Rough Notes / Context */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#071A3A]">
              Lecture Notes or Raw Thoughts (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste relevant excerpts, lecturer warnings, edge cases mentioned in class..."
              className="w-full p-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
            />
          </div>

          {/* Tags & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Source / Reference
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. UNILAG CSC301 Week 4, CLRS Chapter 15"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-[#071A3A]">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. algorithms, midterm, core"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Save Concept & Begin Processing
            </button>
          </div>
        </form>
      ) : (
        /* Saved Success Card & Post-Capture Action Menu */
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1769FF]/20 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-bold text-lg text-[#071A3A]">Concept Captured Successfully!</h3>
              <p className="text-xs text-gray-500">
                <strong>{title}</strong> is now registered in your learning system in <strong>Introduced</strong> state.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#124BCE]">
              Recommended Next Action:
            </span>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Don't leave material passive in your notes. Use the <strong>Active Concept Processing Studio</strong> to explain it in your own words, generate grounded Nigerian analogies, identify prerequisite dependencies, and formulate retrieval questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => onNavigate(`/app/process/${savedConceptId}`)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F4C542]" />
              <span>Process Concept (Mental Models & Analogies)</span>
            </button>

            <button
              onClick={() => onNavigate(`/app/retrieve/${savedConceptId}`)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white text-xs sm:text-sm font-bold border border-[#1769FF]/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Test Initial Retrieval Now</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setSavedConceptId(null);
                setTitle('');
                setDefinition('');
                setNotes('');
              }}
              className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
            >
              Capture another concept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
