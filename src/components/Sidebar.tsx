import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
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
  const { user } = useAuth();

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[rgba(24,60,110,0.07)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div className="h-15 px-5 flex items-center justify-between border-b border-[rgba(24,60,110,0.06)] shrink-0">
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="Go to Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[#10233F] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-4 h-4 text-[#176FF5]" />
            </div>
            <div>
              <div className="font-extrabold text-sm font-heading text-[#10233F] tracking-tight flex items-center gap-1.5">
                LearnWise
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#EDF5FF] text-[#176FF5]">
                  Student
                </span>
              </div>
              <p className="text-[10px] text-[#8A96A8] font-medium">Smarter Learning Guide</p>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 text-[#8A96A8] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 text-xs select-none">
          {/* Quick Primary Action: Add what you're learning */}
          <button
            onClick={() => handleLinkClick('/app/capture/new')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold bg-[#176FF5] text-white shadow-[0_4px_16px_rgba(23,111,245,0.25)] hover:bg-[#1258CC] active:scale-[0.98] transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Add what you're learning</span>
          </button>

          {/* Main Top Navigation Items */}
          <div className="space-y-1">
            <button
              onClick={() => handleLinkClick('/app/today')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                currentRoute === '/app/today'
                  ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                  : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Today's Plan</span>
            </button>

            {onStartWalkthrough && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onStartWalkthrough();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[#176FF5] hover:bg-[#EDF5FF] transition-all cursor-pointer group"
              >
                <Compass className="w-4 h-4 shrink-0 text-[#176FF5]" />
                <div className="flex-1 flex items-center justify-between">
                  <span>How it works</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#EDF5FF] text-[#176FF5]">
                    Quick Tour
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* SECTION 1: LEARN */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('learn')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8A96A8] hover:text-[#10233F] cursor-pointer"
            >
              <span>Learn</span>
              {openSections.learn ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.learn && (
              <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/goals')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/goals'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-[#176FF5] shrink-0" />
                  <div className="text-left flex-1 flex items-center justify-between">
                    <div>
                      <span className="block text-xs leading-none font-semibold">My Goals</span>
                      <span className="text-[10px] text-[#8A96A8] font-normal">What you want to master</span>
                    </div>
                    {selectedGoal && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-[#607089] truncate max-w-[65px]">
                        {selectedGoal.domain}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/capture/new')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/capture')
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <FolderPlus className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Add something</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Save notes or ideas</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/process/c_hash_collision')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/process')
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Understand it</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Explain in your own words</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/retrieve')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/retrieve'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Remember</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Practise recall without notes</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/apply')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute.startsWith('/app/apply')
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Use what you learned</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Try realistic scenarios</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/reinforce')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/reinforce'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Review schedule</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Spaced reviews</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/reflect')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/reflect'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Quick check-in</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">How did studying go?</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: PROGRESS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('progress')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8A96A8] hover:text-[#10233F] cursor-pointer"
            >
              <span>Progress</span>
              {openSections.progress ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.progress && (
              <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/dashboard'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#176FF5] shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Your Progress</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">How much you remember</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/interventions')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/interventions'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Your Learning Plan</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">What to improve</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/diagnostic/results')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/diagnostic/results'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Your Learning Report</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">How you learn best</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/diagnostic')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/diagnostic'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#176FF5] shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Learning Check</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Diagnostic assessment</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: AI COACH */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('ai')}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8A96A8] hover:text-[#10233F] cursor-pointer"
            >
              <span>AI Coach</span>
              {openSections.ai ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.ai && (
              <div className="space-y-0.5 pl-2 border-l border-gray-100 ml-3">
                <button
                  onClick={() => handleLinkClick('/app/ai-coach')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/ai-coach' || currentRoute === '/app/ai-architect' || currentRoute === '/app/ai-analyst'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">AI Coach</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Guides your thinking</span>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('/app/prompt-library')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                    currentRoute === '/app/prompt-library'
                      ? 'bg-[#EDF5FF] text-[#176FF5] font-bold'
                      : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#176FF5] shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs leading-none font-semibold">Helpful Prompts</span>
                    <span className="text-[10px] text-[#8A96A8] font-normal">Ready-to-use study prompts</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Small Secondary Section: My Profile & Settings */}
        <div className="p-3 border-t border-[rgba(24,60,110,0.06)] bg-[#FAFBFD] space-y-1.5 shrink-0">
          <button
            onClick={() => handleLinkClick('/app/profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              currentRoute === '/app/profile'
                ? 'bg-[#176FF5] text-white shadow-xs'
                : 'text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F]'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">My Profile</span>
            <span className="text-[10px] opacity-70 truncate max-w-[70px]">
              {user?.user_metadata?.name ? (user.user_metadata.name as string).split(' ')[0] : profile?.name ? profile.name.split(' ')[0] : 'Learner'}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#607089] hover:bg-[#F8FAFD] hover:text-[#10233F] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 shrink-0 text-[#8A96A8]" />
            <span className="flex-1 text-left">Settings & Demo</span>
            {user ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EDF5FF] text-[#176FF5]">
                Live
              </span>
            ) : isDemoAccount ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EDF5FF] text-[#176FF5]">
                Ada
              </span>
            ) : null}
          </button>

          <button
            onClick={() => handleLinkClick('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#176FF5] hover:bg-[#EDF5FF] transition-colors cursor-pointer"
            title="Return to the public landing page"
          >
            <Globe className="w-4 h-4 shrink-0 text-[#176FF5]" />
            <span className="flex-1 text-left">View Landing Page</span>
          </button>
        </div>
      </aside>
    </>
  );
};
