import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { 
  Bot, 
  Sparkles, 
  Send, 
  BrainCircuit, 
  Target, 
  BarChart3, 
  RefreshCw,
  User,
  ShieldCheck
} from 'lucide-react';

interface AISuiteViewProps {
  initialTab?: 'architect' | 'coach' | 'analyst';
  onNavigate: (route: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AISuiteView: React.FC<AISuiteViewProps> = ({ initialTab = 'coach', onNavigate }) => {
  const { profile, dimensions, metrics, concepts, goals, selectedGoalId } = useLearner();
  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  const [activeTab, setActiveTab] = useState<'architect' | 'coach' | 'analyst'>(initialTab);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Chat histories per tab
  const [coachMessages, setCoachMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello ${profile?.name ? profile.name.split(' ')[0] : 'Learner'}. I am your PLSFR+ Socratic Coach. I won't just hand you answers to memorize—my job is to help you debug your own cognitive models. What concept or problem are you wrestling with right now?`,
      timestamp: 'Just now',
    },
  ]);

  const [architectMessages, setArchitectMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Welcome to the Learning Architect studio. Give me any course syllabus, textbook chapter, or target exam topic, and I will structure it into an evidence-informed progression path based on prerequisite dependencies.`,
      timestamp: 'Just now',
    },
  ]);

  const [analystMessages, setAnalystMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `I have analyzed your live telemetry. Your current Capability Index is ${metrics.capabilityGrowthScore !== null ? `${metrics.capabilityGrowthScore}/100` : 'Pending'}. Your retrieval accuracy is ${metrics.retrievalAccuracy !== null ? `${metrics.retrievalAccuracy}%` : 'Pending'}, while your transfer application rate is ${metrics.applicationTransferRate !== null ? `${metrics.applicationTransferRate}%` : 'Pending'}. What performance bottleneck would you like to dissect?`,
      timestamp: 'Just now',
    },
  ]);

  const getCurrentMessages = () => {
    switch (activeTab) {
      case 'architect': return architectMessages;
      case 'analyst': return analystMessages;
      case 'coach':
      default: return coachMessages;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (activeTab === 'coach') setCoachMessages(prev => [...prev, userMsg]);
    else if (activeTab === 'architect') setArchitectMessages(prev => [...prev, userMsg]);
    else setAnalystMessages(prev => [...prev, userMsg]);

    const sentText = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      let endpoint = '/api/ai/coach';
      let payload: any = {
        message: sentText,
        learnerProfile: profile,
        currentGoal: selectedGoal?.title,
        dimensions,
      };

      if (activeTab === 'architect') {
        endpoint = '/api/ai/learning-path';
        payload = {
          goalTitle: sentText,
          targetDomain: selectedGoal?.domain || 'Computer Science',
          learnerProfile: profile,
          dimensions,
        };
      } else if (activeTab === 'analyst') {
        endpoint = '/api/ai/analyst';
        payload = {
          metrics,
          dimensions,
          recentConcepts: concepts.slice(0, 5),
          learnerProfile: profile,
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let replyText = '';
      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          replyText = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
        } else if (data.reply) {
          replyText = data.reply;
        } else if (data.analysis) {
          if (typeof data.analysis === 'string') {
            replyText = data.analysis;
          } else if (typeof data.analysis === 'object') {
            const headline = data.analysis.headline || 'Cognitive Telemetry Analysis';
            const findings = Array.isArray(data.analysis.findings) ? data.analysis.findings.map((f: string) => `• ${f}`).join('\n') : '';
            const rec = data.analysis.nextActionRecommendation ? `\n\nRecommended Focus:\n${data.analysis.nextActionRecommendation}` : '';
            replyText = `${headline}\n\n${findings}${rec}`;
          }
        } else if (data.strategy) {
          const title = data.strategy.title || 'Learning Strategy';
          const rationale = data.strategy.rationale || '';
          const phaseCount = data.strategy.phases?.length || 0;
          replyText = `**${title}**\n\n${rationale}\n\nArchitected ${phaseCount} learning phases. You can inspect the complete phase breakdown in your Goals & Paths view.`;
        } else if (data.summary) {
          replyText = data.summary;
        } else if (data.phases) {
          replyText = `I have architected a ${data.phases.length}-phase learning path for you! Check your Goals & Paths view.`;
        } else {
          replyText = 'Response processed successfully.';
        }
      } else {
        throw new Error('Server returned error status');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (activeTab === 'coach') setCoachMessages(prev => [...prev, botMsg]);
      else if (activeTab === 'architect') setArchitectMessages(prev => [...prev, botMsg]);
      else setAnalystMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Using intelligent local Socratic fallback:', err);
      let fallbackText = '';
      if (activeTab === 'coach') {
        fallbackText = `Before we look at the answer: what is the invariant rule or prerequisite condition that must hold true here? If you had to explain this mechanism to an SS1 student using a Lagos Danfo bus or battery inverter analogy, how would you begin?`;
      } else if (activeTab === 'architect') {
        fallbackText = `To master this, avoid jumping straight to problem sets. Phase 1: Define invariant vocabulary. Phase 2: Closed-book algorithmic trace. Phase 3: Unfamiliar real-world case study. Phase 4: 7-day spaced reinforcement.`;
      } else {
        const retStr = metrics.retrievalAccuracy !== null ? `${metrics.retrievalAccuracy}%` : 'Pending';
        const appStr = metrics.applicationTransferRate !== null ? `${metrics.applicationTransferRate}%` : 'Pending';
        fallbackText = `Diagnostic pattern detected: Your retrieval rate (${retStr}) vs application (${appStr}). This indicates telemetry is actively calibrating your operational transfer schemas. Complete focused practice sessions to build evidence.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (activeTab === 'coach') setCoachMessages(prev => [...prev, botMsg]);
      else if (activeTab === 'architect') setArchitectMessages(prev => [...prev, botMsg]);
      else setAnalystMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const starters = {
    coach: [
      "I understand the formula, but can't solve exam problems.",
      "Explain the difference between recognition and retrieval.",
      "How do I prevent overconfidence when reviewing notes?",
    ],
    architect: [
      "Break down Operating System Virtual Memory into 4 phases.",
      "Build a 3-week study path for JAMB Physics & Chemistry.",
      "Architect a prerequisite map for Graph Algorithms.",
    ],
    analyst: [
      "Why is my application transfer score lower than my retrieval score?",
      "Which learning dimension should I focus on this week?",
      "Analyze my calibration error patterns.",
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FF] text-[#124BCE] text-xs font-bold uppercase tracking-wider mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Learning Suite • Server-Side Gemini Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#071A3A]">
            Cognitive AI Learning Specialists
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Specialized assistants designed to build thinking independence, not cognitive reliance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-gray-100 border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('coach')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coach'
                ? 'bg-white text-[#124BCE] shadow-sm'
                : 'text-gray-600 hover:text-[#071A3A]'
            }`}
          >
            Socratic Coach
          </button>
          <button
            onClick={() => setActiveTab('architect')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'architect'
                ? 'bg-white text-[#124BCE] shadow-sm'
                : 'text-gray-600 hover:text-[#071A3A]'
            }`}
          >
            Learning Architect
          </button>
          <button
            onClick={() => setActiveTab('analyst')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analyst'
                ? 'bg-white text-[#124BCE] shadow-sm'
                : 'text-gray-600 hover:text-[#071A3A]'
            }`}
          >
            System Analyst
          </button>
        </div>
      </div>

      {/* Role Banner */}
      <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#1769FF]/15 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#124BCE]" />
          <span className="text-gray-700">
            {activeTab === 'coach' && 'Active Role: Anti-Dependency Socratic Coach. Scaffolds your reasoning through targeted prompts.'}
            {activeTab === 'architect' && 'Active Role: Learning Architect. Converts unstructured syllabi into prerequisite dependency paths.'}
            {activeTab === 'analyst' && 'Active Role: Learning System Analyst. Evaluates objective error telemetry and bottlenecks.'}
          </span>
        </div>
        <span className="font-semibold text-[#124BCE] hidden sm:inline">Grounding: PLSFR+</span>
      </div>

      {/* Chat Messages Container */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#1769FF]/20 shadow-sm min-h-[420px] max-h-[550px] flex flex-col justify-between space-y-4 overflow-hidden">
        <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {getCurrentMessages().map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#071A3A] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#F4C542]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-[#124BCE] text-white rounded-tr-xs'
                      : 'bg-gray-50 border border-gray-200 text-[#071A3A] rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1.5 ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#124BCE]/20 text-[#124BCE] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#071A3A] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#F4C542] animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500">
                Cognitive specialist is analyzing your query against PLSFR+ guidelines...
              </div>
            </div>
          )}
        </div>

        {/* Socratic Conversation Starters */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Quick Prompts:
          </div>
          <div className="flex flex-wrap gap-2">
            {starters[activeTab].map((starter, i) => (
              <button
                key={i}
                onClick={() => setInputText(starter)}
                className="px-3 py-1 rounded-xl bg-gray-50 hover:bg-[#EAF2FF] text-[11px] text-gray-600 hover:text-[#124BCE] border border-gray-200 transition-colors text-left cursor-pointer"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Text Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'coach'
                  ? "Describe what you're trying to understand or solve..."
                  : activeTab === 'architect'
                  ? "Provide a topic, syllabus module, or exam goal..."
                  : "Ask about your learning bottlenecks or error trends..."
              }
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-[#071A3A] focus:outline-none focus:ring-2 focus:ring-[#124BCE]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
