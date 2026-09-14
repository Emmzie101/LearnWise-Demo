import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import {
  Home,
  Target,
  BookOpen,
  Repeat,
  Compass,
  Layers,
  BarChart3,
  Bot,
  Sparkles,
  User,
  Settings,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  ShieldCheck,
  RefreshCw,
  LogOut,
  X,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  Globe
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  onStartWalkthrough?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  onOpenSettings,
  onStartWalkthrough,
}) => {
  const { profile, isDemoAccount, goals, selectedGoalId, metrics, logout } = useLearner();

  // Collapsible nested state
  const isLearnActive = ['/app/capture', '/app/capture/new', '/app/process', '/app/reflect'].some(r => currentRoute.startsWith(r));
  const isPracticeActive = ['/app/retrieve', '/app/apply', '/app/reinforce'].some(r => currentRoute.startsWith(r));
  const isProgressActive = ['/app/dashboard', '/app/interventions', '/app/diagnostic'].some(r => currentRoute.startsWith(r));
  const isAIActive = ['/app/ai-coach', '/app/ai-architect', '/app/ai-analyst', '/app/prompt-library'].some(r => currentRoute.startsWith(r));

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    learn: true,
    practice: true,
    progress: false,
    ai: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    onCloseMobile();
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#071A3A]/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#1769FF]/15 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 shrink-0">
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="Go to Landing Page"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#071A3A] to-[#124BCE] flex items-center justify-center text-white shadow-md shadow-[#124BCE]/25 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 text-[#F4C542]" />
            </div>
            <div>
              <div className="font-extrabold text-base font-heading text-[#071A3A] tracking-tight flex items-center gap-1.5">
                LearnWise
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[#EAF2FF] text-[#124BCE] border border-[#1769FF]/20">
                  PLSFR+
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Smart Learning System</p>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 text-xs select-none">
          {/* Main Top Navigation Items */}
          <div className="space-y-1">
            <button
              onClick={() => handleLinkClick('/app/today')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                currentRoute === '/app/today'
                  ? 'bg-[#124BCE] text-white shadow-sm shadow-[#124BCE]/25'
                  : 'text-gray-700 hover:bg-[#F0F5FF] hover:text-[#124BCE]'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home & Today</span>
            </button>

            {onStartWalkthrough && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onStartWalkthrough();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[#124BCE] bg-[#EAF2FF] hover:bg-[#124BCE] hover:text-white transition-all cursor-pointer group"
              >
                <Compass className="w-4 h-4 shrink-0 text-[#124BCE] group-hover:text-white" />
                <div className="flex-1 flex items-center justify-between">
                  <span>Guided Tour</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white text-[#124BCE] group-hover:bg-white/20 group-hover:text-white">
                    5 Steps
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={() => handleLinkClick('/app/goals')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                currentRoute === '/app/goals'
                  ? 'bg-[#124BCE] text-white shadow-sm shadow-[#124BCE]/25'
                  : 'text-gray-700 hover:bg-[#F0F5FF] hover:text-[#124BCE]'
              }`}
            >
              <Target className="w-4 h-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>My Goals & Path</span>
                {selectedGoal && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium truncate max-w-[80px] ${
                    currentRoute === '/app/goals' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedGoal.domain}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* SECTION 1: LEARN (The Closed-Loop Steps) */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('learn')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-[#071A3A] cursor-pointer"
            >
              <span>Learn</span>
              {openSections.learn ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.learn && (
              <div className="space-y-0.5 pl-2 border-l-2 border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/capture/new')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/capture')
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <FolderPlus className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Capture</span>
                    <span className="text-[10px] text-gray-600 font-normal">Add notes or syllabus</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/process/c_hash_collision')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/process')
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Process</span>
                    <span className="text-[10px] text-gray-600 font-normal">Understand ideas in depth</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/retrieve')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/retrieve'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5 text-[#124BCE] shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Retrieve</span>
                    <span className="text-[10px] text-gray-600 font-normal">Remember without notes</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/apply')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/apply')
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Apply</span>
                    <span className="text-[10px] text-gray-600 font-normal">Solve real problems</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/reinforce')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/reinforce'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Reinforce</span>
                    <span className="text-[10px] text-gray-600 font-normal">Review before you forget</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/reflect')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/reflect'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Reflect</span>
                    <span className="text-[10px] text-gray-600 font-normal">Quick study check-in</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: PRACTICE */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('practice')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-[#071A3A] cursor-pointer"
            >
              <span>Practice</span>
              {openSections.practice ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.practice && (
              <div className="space-y-0.5 pl-2 border-l-2 border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/retrieve')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/retrieve'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5 text-[#124BCE] shrink-0" />
                  <span>Retrieval Practice</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/apply')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/apply')
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Application Practice</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/reinforce')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/reinforce'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Spaced Review</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: PROGRESS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('progress')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-[#071A3A] cursor-pointer"
            >
              <span>Progress</span>
              {openSections.progress ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.progress && (
              <div className="space-y-0.5 pl-2 border-l-2 border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/dashboard'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#124BCE] shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Assimilation</span>
                    <span className="text-[10px] text-gray-600 font-normal">How well you retain</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/interventions')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/interventions'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Bottlenecks & Fixes</span>
                    <span className="text-[10px] text-gray-600 font-normal">What's slowing you down</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/diagnostic/results')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/diagnostic/results'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">PLSFR+ Profile</span>
                    <span className="text-[10px] text-gray-600 font-normal">Your 7 learning dimensions</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/diagnostic')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/diagnostic'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Retake Diagnostic</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 4: AI HELP */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('ai')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-[#071A3A] cursor-pointer"
            >
              <span>AI Help</span>
              {openSections.ai ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.ai && (
              <div className="space-y-0.5 pl-2 border-l-2 border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/ai-coach')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/ai-coach'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Learning Coach</span>
                    <span className="text-[10px] text-gray-600 font-normal">Guides without giving answers</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/ai-architect')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/ai-architect'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C542] shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Learning Architect</span>
                    <span className="text-[10px] text-gray-600 font-normal">Builds study plan</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/ai-analyst')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/ai-analyst'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Learning Analyst</span>
                    <span className="text-[10px] text-gray-600 font-normal">Diagnoses bottlenecks</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/prompt-library')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/prompt-library'
                      ? 'bg-[#EAF2FF] text-[#124BCE] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#071A3A]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none">Prompt Library</span>
                    <span className="text-[10px] text-gray-600 font-normal">High-yield AI prompts</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Small Secondary Section: My Profile & Settings */}
        <div className="p-3 border-t border-gray-100 bg-[#FBFDFF] space-y-1.5 shrink-0">
          <button
            onClick={() => handleLinkClick('/app/profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              currentRoute === '/app/profile'
                ? 'bg-[#124BCE] text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">My Profile</span>
            <span className="text-[10px] opacity-70 truncate max-w-[70px]">{profile?.name ? profile.name.split(' ')[0] : 'Learner'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 shrink-0 text-gray-500" />
            <span className="flex-1 text-left">Settings & Demo</span>
            {isDemoAccount && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F4C542]/20 text-[#071A3A]">
                Ada
              </span>
            )}
          </button>

          <button
            onClick={() => handleLinkClick('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#124BCE] hover:bg-[#EAF2FF] transition-colors cursor-pointer"
            title="Return to the public landing page"
          >
            <Globe className="w-4 h-4 shrink-0 text-[#124BCE]" />
            <span className="flex-1 text-left">View Landing Page</span>
          </button>
        </div>
      </aside>
    </>
  );
};
