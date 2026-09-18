import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  Target, 
  FolderPlus, 
  Sparkles, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
  Zap,
  Globe,
  Compass
} from 'lucide-react';

interface TopBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenSettings: () => void;
  onStartWalkthrough?: () => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  onNavigate,
  onOpenMobileSidebar,
  onOpenSettings,
  onStartWalkthrough,
  onOpenAuthModal,
}) => {
  const { profile, isDemoAccount, goals, selectedGoalId, metrics, logout } = useLearner();
  const { user } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  // Derive friendly page title
  const getPageTitle = (route: string) => {
    if (route === '/app/today') return 'Today’s Learning Queue';
    if (route === '/app/goals') return 'My Goals & Learning Path';
    if (route === '/app/dashboard') return 'Assimilation Dashboard';
    if (route === '/app/diagnostic') return 'Diagnostic Assessment';
    if (route === '/app/diagnostic/results') return 'Personal Cognitive Profile (PLS-CP)';
    if (route.startsWith('/app/capture')) return 'Capture Material';
    if (route.startsWith('/app/process')) return 'Process Concept Studio';
    if (route.startsWith('/app/retrieve')) return 'Retrieval Practice';
    if (route.startsWith('/app/apply')) return 'Application Practice';
    if (route === '/app/reinforce') return 'Spaced Reinforcement';
    if (route === '/app/reflect') return 'Daily Reflection';
    if (route === '/app/ai-coach') return 'Socratic Learning Coach';
    if (route === '/app/ai-architect') return 'AI Learning Architect';
    if (route === '/app/ai-analyst') return 'System Learning Analyst';
    if (route === '/app/prompt-library') return 'Prompt Library';
    if (route === '/app/interventions') return 'Intervention Plan (Bottlenecks)';
    if (route === '/app/profile') return 'My Profile & Context';
    return 'LearnWise';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-[rgba(24,60,110,0.07)]">
      {/* Top micro banner for demo or authenticated notice */}
      {user ? (
        <div className="bg-[#10233F] text-white text-[11px] px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#176FF5]" />
            <span>
              Authenticated Account: <strong className="text-white font-semibold">{user.email}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="text-gray-300 hover:text-white underline text-[11px] cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      ) : isDemoAccount ? (
        <div className="bg-[#10233F] text-white text-[11px] px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#20B26B] animate-pulse" />
            <span>
              Sample Learner: <strong className="text-white font-semibold">Adaeze (UNILAG Computer Science)</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="text-[#96C0FF] hover:text-white font-medium text-[11px] cursor-pointer"
              >
                Sign In
              </button>
            )}
            <button
              onClick={onOpenSettings}
              className="text-gray-300 hover:text-white underline text-[11px] cursor-pointer"
            >
              Change / Reset Demo
            </button>
          </div>
        </div>
      ) : null}

      <div className="px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#607089] hover:bg-[#F8FAFD] cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-bold text-sm sm:text-base font-heading text-[#10233F] truncate max-w-[200px] sm:max-w-md tracking-tight">
              {getPageTitle(currentRoute)}
            </h1>
          </div>
        </div>

        {/* Center/Right: Current Goal Badge & Action Pill */}
        <div className="flex items-center gap-2.5">
          {selectedGoal && (
            <button
              onClick={() => onNavigate('/app/goals')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EDF5FF] border border-[rgba(24,60,110,0.07)] text-left transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-[#176FF5]" />
              <div className="text-xs">
                <span className="text-[10px] text-[#8A96A8] block uppercase font-bold leading-none">Goal</span>
                <span className="font-semibold text-[#10233F] truncate max-w-[140px] block leading-tight">
                  {selectedGoal.title}
                </span>
              </div>
            </button>
          )}

          {/* Quick Capture Material */}
          <button
            onClick={() => onNavigate('/app/capture/new')}
            className="btn-primary-glow flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Material</span>
          </button>

          {/* Interactive Walkthrough / Tour Button */}
          {onStartWalkthrough && (
            <button
              onClick={onStartWalkthrough}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EDF5FF] hover:bg-[#176FF5] text-[#176FF5] hover:text-white border border-[#176FF5]/20 text-xs font-bold transition-all cursor-pointer"
              title="Open the step-by-step interactive system walkthrough"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Guided Tour</span>
            </button>
          )}

          {/* Landing Page Button */}
          <button
            onClick={() => onNavigate('/')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F8FAFD] text-[#607089] hover:text-[#10233F] border border-[rgba(24,60,110,0.1)] text-xs font-semibold transition-all cursor-pointer"
            title="Go to Landing Page"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F8FAFD] border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EDF5FF] text-[#176FF5] font-bold text-xs flex items-center justify-center border border-[#176FF5]/15">
                {profile.name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A96A8] hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[rgba(24,60,110,0.08)] shadow-[0_15px_45px_rgba(30,70,120,0.08)] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <div className="font-bold text-sm text-[#10233F]">
                    {user?.user_metadata?.name || profile.name}
                  </div>
                  <div className="text-xs text-[#607089] truncate">
                    {user?.email || profile.email}
                  </div>
                  <div className="text-[11px] text-[#176FF5] font-semibold mt-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{user ? 'Verified Learner Account' : profile.institution}</span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => onNavigate('/app/profile')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EDF5FF] text-[#10233F] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#176FF5]" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/app/diagnostic/results')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EDF5FF] text-[#10233F] flex items-center gap-2 cursor-pointer"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#176FF5]" />
                    <span>Cognitive Profile</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/app/interventions')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EDF5FF] text-[#10233F] flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Bottlenecks & Fixes</span>
                  </button>
                  <button
                    onClick={onOpenSettings}
                    className="w-full text-left px-4 py-2 hover:bg-[#EDF5FF] text-[#10233F] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#607089]" />
                    <span>Settings & Demo Switch</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EDF5FF] text-[#176FF5] font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-[#176FF5]" />
                    <span>View Landing Page</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('/');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
