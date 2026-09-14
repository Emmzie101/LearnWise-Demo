import React, { useState } from 'react';
import { PLSFR_PROMPT_LIBRARY } from '../data/promptLibrary';
import { PromptItem } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  Bot, 
  ArrowRight,
  Bookmark,
  Layers
} from 'lucide-react';

interface PromptLibraryViewProps {
  onSelectPromptForAI: (promptText: string) => void;
  onNavigate: (route: string) => void;
}

export const PromptLibraryView: React.FC<PromptLibraryViewProps> = ({ onSelectPromptForAI, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Prompts' },
    { id: 'Cognitive Capacity', label: '1. Cognitive Capacity' },
    { id: 'Learning Mechanics', label: '2. Learning Mechanics' },
    { id: 'Domain Strategy', label: '3. Domain Strategy' },
    { id: 'Metacognition', label: '4. Metacognition' },
    { id: 'Affective & Identity', label: '5. Affective & Identity' },
    { id: 'Environmental Realities', label: '6. Environment & Habits' },
    { id: 'Synthesis & Transfer', label: '7. Synthesis & Transfer' },
  ];

  const filteredPrompts = PLSFR_PROMPT_LIBRARY.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecuteInCoach = (template: string) => {
    onSelectPromptForAI(template);
    onNavigate('/app/ai-coach');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
          <span>Curated Cognitive Scaffolds</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
          PLS-PL: Curated Prompt Library
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          High-leverage cognitive prompts across all 7 PLSFR+ dimensions. Use them in LearnWise or paste them into your favorite AI tool.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts by concept, task, or dimension..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#124BCE] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPrompts.map(prompt => (
          <div
            key={prompt.id}
            className="p-5 rounded-3xl bg-white border border-[#1769FF]/15 shadow-xs hover:border-[#1769FF]/35 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF2FF] text-[#124BCE]">
                  {prompt.category}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {prompt.plsfrDimension.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#071A3A]">{prompt.title}</h3>
              <p className="text-xs text-gray-500">{prompt.purpose}</p>

              <div className="p-3.5 rounded-2xl bg-[#F7FAFF] border border-gray-200 text-xs font-mono text-gray-800 leading-relaxed whitespace-pre-line">
                {prompt.prompt}
              </div>

              <div className="text-[11px] text-gray-400 italic">
                <strong>Recommended usage:</strong> {prompt.recommendedUse}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => handleCopy(prompt.id, prompt.prompt)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#071A3A] transition-colors cursor-pointer"
              >
                {copiedId === prompt.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleExecuteInCoach(prompt.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Run with AI Coach</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
