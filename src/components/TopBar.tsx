import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
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
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  onNavigate,
  onOpenMobileSidebar,
  onOpenSettings,
  onStartWalkthrough,
}) => {
  const { profile, isDemoAccount, goals, selectedGoalId, metrics, logout } = useLearner();
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
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#1769FF]/15">
      {/* Top micro banner for demo mode notice */}
      {isDemoAccount && (
        <div className="bg-[#071A3A] text-white text-[11px] px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Sample Learner: <strong className="text-[#F4C542]">Ada (UNILAG Computer Science)</strong>
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-white/80 hover:text-white underline text-[11px] cursor-pointer"
          >
            Change / Reset Demo
          </button>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-bold text-sm sm:text-base font-heading text-[#071A3A] truncate max-w-[200px] sm:max-w-md">
              {getPageTitle(currentRoute)}
            </h1>
          </div>
        </div>

        {/* Center/Right: Current Goal Badge & Action Pill */}
        <div className="flex items-center gap-3">
          {selectedGoal && (
            <button
              onClick={() => onNavigate('/app/goals')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7FAFF] hover:bg-[#EAF2FF] border border-[#1769FF]/15 text-left transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-[#124BCE]" />
              <div className="text-xs">
                <span className="text-[10px] text-gray-600 block uppercase font-semibold leading-none">Goal</span>
                <span className="font-semibold text-[#071A3A] truncate max-w-[140px] block leading-tight">
                  {selectedGoal.title}
                </span>
              </div>
            </button>
          )}

          {/* Quick Capture Material */}
          <button
            onClick={() => onNavigate('/app/capture/new')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#124BCE] hover:bg-[#1769FF] text-white text-xs font-bold shadow-sm shadow-[#124BCE]/20 transition-all cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Material</span>
          </button>

          {/* Interactive Walkthrough / Tour Button */}
          {onStartWalkthrough && (
            <button
              onClick={onStartWalkthrough}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white border border-[#1769FF]/20 text-xs font-bold transition-all cursor-pointer"
              title="Open the step-by-step interactive system walkthrough"
            >
              <Compass className="w-3.5 h-3.5 text-[#124BCE] group-hover:text-white" />
              <span className="hidden md:inline">Guided Tour</span>
            </button>
          )}

          {/* Landing Page Button */}
          <button
            onClick={() => onNavigate('/')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F0F5FF] text-[#124BCE] border border-[#1769FF]/20 text-xs font-semibold transition-all cursor-pointer"
            title="Go to Landing Page"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#124BCE]/10 text-[#124BCE] font-bold text-xs flex items-center justify-center border border-[#124BCE]/20">
                {profile.name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#1769FF]/20 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-bold text-sm text-[#071A3A]">{profile.name}</div>
                  <div className="text-xs text-gray-500 truncate">{profile.email}</div>
                  <div className="text-[11px] text-[#124BCE] font-medium mt-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{profile.institution}</span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => onNavigate('/app/profile')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#124BCE]" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/app/diagnostic/results')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#124BCE]" />
                    <span>Cognitive Profile</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/app/interventions')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Bottlenecks & Fixes</span>
                  </button>
                  <button
                    onClick={onOpenSettings}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span>Settings & Demo Switch</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#124BCE] font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-[#124BCE]" />
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
