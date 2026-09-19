import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { TaskType, DomainType } from '../types';
import { VisualCueTooltip } from '../components/VisualCueTooltip';
import { 
  FolderPlus, 
  BookOpen, 
  Sparkles, 
  CheckCircle2,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !definition.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const newId = await addConcept({
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
      <div className="border-b border-[rgba(24,60,110,0.06)] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5FF] text-[#176FF5] text-xs font-bold uppercase tracking-wider">
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
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#10233F] tracking-tight">
              Capture New Learning Material
            </h1>
            <p className="text-xs sm:text-sm text-[#607089] mt-0.5">
              Ingest raw concepts from lectures, textbooks, YouTube, or past questions, then process them into structured schemas.
            </p>
          </div>
          {onStartWalkthrough && (
            <button
              onClick={onStartWalkthrough}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFD] text-[#176FF5] border border-[rgba(24,60,110,0.1)] text-xs font-semibold self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Full Walkthrough</span>
            </button>
          )}
        </div>
      </div>

      {!savedConceptId ? (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_8px_30px_rgba(30,70,120,0.04)] space-y-6">
          {/* Concept Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
              Concept or Principle Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dynamic Programming (Memoization), Amortized Complexity, Hooke's Law"
              className="w-full px-4 py-3 rounded-2xl border border-[rgba(24,60,110,0.12)] text-sm text-[#10233F] placeholder-[#8A96A8] focus:outline-hidden focus:ring-2 focus:ring-[#176FF5]"
            />
          </div>

          {/* Goal & Domain Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
                Associated Learning Goal
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(24,60,110,0.12)] text-xs font-semibold bg-white text-[#10233F] focus:ring-2 focus:ring-[#176FF5]"
              >
                {goals.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
                Cognitive Task Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskType)}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(24,60,110,0.12)] text-xs font-semibold bg-white text-[#10233F] focus:ring-2 focus:ring-[#176FF5]"
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
              <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
                Academic Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as DomainType)}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(24,60,110,0.12)] text-xs font-semibold bg-white text-[#10233F] focus:ring-2 focus:ring-[#176FF5]"
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
              <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
                Core Definition or Invariant Standard *
              </label>
              <span className="text-[11px] text-[#8A96A8]">The authoritative reference truth</span>
            </div>
            <textarea
              required
              rows={3}
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Provide the standard definition or rule from the course slides/textbook..."
              className="w-full p-3.5 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] placeholder-[#8A96A8] focus:outline-hidden focus:ring-2 focus:ring-[#176FF5]"
            />
          </div>

          {/* Rough Notes / Context */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
              Lecture Notes or Raw Thoughts (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste relevant excerpts, lecturer warnings, edge cases mentioned in class..."
              className="w-full p-3.5 rounded-2xl border border-[rgba(24,60,110,0.12)] text-xs sm:text-sm text-[#10233F] placeholder-[#8A96A8] focus:outline-hidden focus:ring-2 focus:ring-[#176FF5]"
            />
          </div>

          {/* Tags & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
                Source / Reference
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. CSC301 Week 4, CLRS Chapter 15"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(24,60,110,0.12)] text-xs text-[#10233F] placeholder-[#8A96A8] focus:outline-hidden focus:ring-2 focus:ring-[#176FF5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wide text-[#10233F]">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. algorithms, midterm, core"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(24,60,110,0.12)] text-xs text-[#10233F] placeholder-[#8A96A8] focus:outline-hidden focus:ring-2 focus:ring-[#176FF5]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary-glow px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              Save Concept & Begin Processing
            </button>
          </div>
        </form>
      ) : (
        /* Saved Success Card & Post-Capture Action Menu */
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_8px_30px_rgba(30,70,120,0.04)] space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-bold text-lg font-heading text-[#10233F]">Concept Captured Successfully!</h3>
              <p className="text-xs text-[#607089]">
                <strong>{title}</strong> is now registered in your learning system in <strong>Introduced</strong> state.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[rgba(24,60,110,0.06)] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176FF5]">
              Recommended Next Action:
            </span>
            <p className="text-xs sm:text-sm text-[#607089] leading-relaxed">
              Don't leave material passive in your notes. Use the <strong>Active Concept Processing Studio</strong> to explain it in your own words, generate grounded analogies, identify prerequisite dependencies, and formulate retrieval questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => onNavigate(`/app/process/${savedConceptId}`)}
              className="btn-primary-glow flex items-center justify-center gap-2 p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Process Concept (Mental Models & Analogies)</span>
            </button>

            <button
              onClick={() => onNavigate(`/app/retrieve/${savedConceptId}`)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#EDF5FF] hover:bg-[#DCEBFF] text-[#176FF5] text-xs sm:text-sm font-bold border border-[#176FF5]/20 transition-all cursor-pointer"
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
              className="text-xs text-[#607089] hover:text-[#10233F] underline cursor-pointer"
            >
              Capture another concept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
