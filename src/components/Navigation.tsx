import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { 
  LayoutDashboard, 
  Target, 
  BrainCircuit, 
  FolderPlus, 
  Repeat, 
  Compass, 
  BookOpen, 
  Bot, 
  Sparkles, 
  Menu, 
  X, 
  RefreshCw, 
  User, 
  GraduationCap, 
  LogOut,
  ChevronDown,
  Layers,
  Activity,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentRoute, onNavigate }) => {
  const { 
    profile, 
    isDemoAccount, 
    goals, 
    selectedGoalId, 
    setSelectedGoalId, 
    loadDemoAccount, 
    resetToFreshAccount, 
    logout,
    metrics
  } = useLearner();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { label: "Today's Queue", route: '/app/today', icon: Activity },
    { label: 'Assimilation Dashboard', route: '/app/dashboard', icon: LayoutDashboard },
    { label: 'PLSFR+ Diagnostic', route: '/app/diagnostic', icon: BrainCircuit },
    { label: 'Goals & Path', route: '/app/goals', icon: Target },
    { label: 'Capture', route: '/app/capture', icon: FolderPlus },
    { label: 'Active Retrieval', route: '/app/retrieve', icon: Repeat },
    { label: 'Application', route: '/app/apply', icon: Compass },
    { label: 'Reinforce', route: '/app/reinforce', icon: Layers },
    { label: 'Reflect', route: '/app/reflect', icon: BookOpen },
    { label: 'AI Suite', route: '/app/ai-architect', icon: Bot },
    { label: 'Prompt Library', route: '/app/prompt-library', icon: Sparkles },
    { label: 'Interventions', route: '/app/interventions', icon: ShieldCheck },
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#1769FF]/15 shadow-xs">
      {/* Top Banner for Demo State & Quick Switch */}
      <div className="bg-[#071A3A] text-white text-[11px] px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">
            {isDemoAccount ? (
              <>Demo Mode Active: <strong className="text-[#F4C542]">Ada (UNILAG Computer Science)</strong></>
            ) : (
              <>Learner Active: <strong className="text-white">{profile.name}</strong></>
            )}
          </span>
          <span className="hidden md:inline text-white/50">|</span>
          <span className="hidden md:inline text-white/80">PLSFR+ Closed-Loop Personalized Learning System</span>
        </div>

        <div className="flex items-center gap-3">
          {isDemoAccount ? (
            <button
              onClick={resetToFreshAccount}
              className="text-white/70 hover:text-white underline text-[11px] cursor-pointer"
              title="Start a blank slate learner to test fresh onboarding and diagnostic"
            >
              Switch to Fresh Account
            </button>
          ) : (
            <button
              onClick={loadDemoAccount}
              className="text-[#F4C542] hover:underline font-semibold text-[11px] cursor-pointer"
              title="Load Ada's full historical dataset"
            >
              Load Ada's Demo Data
            </button>
          )}

          <button
            onClick={loadDemoAccount}
            className="flex items-center gap-1 text-white/80 hover:text-white text-[11px] cursor-pointer"
            title="Reset dataset back to default demo state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('/app/today')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#071A3A] to-[#124BCE] flex items-center justify-center text-white shadow-md shadow-[#124BCE]/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 text-[#F4C542]" />
            </div>
            <div>
              <span className="font-bold text-lg font-heading text-[#071A3A] tracking-tight flex items-center gap-1">
                LearnWise
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#EAF2FF] text-[#124BCE] border border-[#1769FF]/20">
                  PLSFR+
                </span>
              </span>
              <span className="hidden sm:block text-[10px] text-gray-500 font-sans -mt-1">
                Personalized Learning OS
              </span>
            </div>
          </button>
        </div>

        {/* Quick Goal & Mastery Telemetry Display (Desktop) */}
        {selectedGoal && (
          <div className="hidden lg:flex items-center gap-4 bg-[#F7FAFF] px-3.5 py-1.5 rounded-xl border border-[#1769FF]/15">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#124BCE]" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-gray-400">Current Focus</div>
                <div className="text-xs font-semibold text-[#071A3A] truncate max-w-[200px]">
                  {selectedGoal.title}
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block">Capability</span>
                <span className="font-bold text-[#124BCE] font-heading">
                  {metrics.capabilityGrowthScore !== null ? `${metrics.capabilityGrowthScore}%` : '--'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Retrieval</span>
                <span className="font-bold text-emerald-600 font-heading">
                  {metrics.retrievalAccuracy !== null ? `${metrics.retrievalAccuracy}%` : '--'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Transfer</span>
                <span className="font-bold text-amber-600 font-heading">
                  {metrics.applicationTransferRate !== null ? `${metrics.applicationTransferRate}%` : '--'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Capture Button */}
          <button
            onClick={() => handleNav('/app/capture/new')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2FF] hover:bg-[#124BCE] text-[#124BCE] hover:text-white text-xs font-semibold border border-[#1769FF]/20 transition-all cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Capture Material</span>
          </button>

          {/* User Profile Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#124BCE]/10 text-[#124BCE] font-bold text-xs flex items-center justify-center border border-[#124BCE]/20">
                {profile.name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
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
                    onClick={() => handleNav('/app/profile')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#124BCE]" />
                    <span>Learner Context & Settings</span>
                  </button>
                  <button
                    onClick={() => handleNav('/app/diagnostic/results')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#124BCE]" />
                    <span>Personal Cognitive Profile (PLS-CP)</span>
                  </button>
                  <button
                    onClick={() => handleNav('/app/interventions')}
                    className="w-full text-left px-4 py-2 hover:bg-[#EAF2FF] text-[#071A3A] flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#124BCE]" />
                    <span>Intervention Plan (PLS-IP)</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      handleNav('/');
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

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Secondary Desktop Horizontal Nav Strip for Core Workflow */}
      <div className="hidden md:block bg-[#F7FAFF] border-t border-[#1769FF]/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || currentRoute.startsWith(`${item.route}/`);
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#124BCE] text-white shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#071A3A] hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-6 space-y-1 max-h-[85vh] overflow-y-auto">
          <div className="p-3 mb-2 rounded-xl bg-[#EAF2FF]/60 border border-[#1769FF]/15">
            <div className="text-xs font-semibold text-[#071A3A]">{profile.name}</div>
            <div className="text-[11px] text-gray-500">{profile.institution} — {profile.fieldOfStudy}</div>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className="text-[#124BCE] font-bold">
                Growth: {metrics.capabilityGrowthScore !== null ? `${metrics.capabilityGrowthScore}%` : '--'}
              </span>
              <span className="text-emerald-700 font-bold">
                Retrieval: {metrics.retrievalAccuracy !== null ? `${metrics.retrievalAccuracy}%` : '--'}
              </span>
              <span className="text-amber-700 font-bold">
                Transfer: {metrics.applicationTransferRate !== null ? `${metrics.applicationTransferRate}%` : '--'}
              </span>
            </div>
          </div>

          <div className="text-[10px] uppercase font-bold text-gray-400 px-2 pt-2">Learning System</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#124BCE] text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Quick-Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNav('/app/today')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentRoute === '/app/today' ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Today</span>
        </button>
        <button
          onClick={() => handleNav('/app/retrieve')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentRoute.startsWith('/app/retrieve') ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Retrieve</span>
        </button>
        <button
          onClick={() => handleNav('/app/apply')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentRoute.startsWith('/app/apply') ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Apply</span>
        </button>
        <button
          onClick={() => handleNav('/app/dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentRoute === '/app/dashboard' ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => handleNav('/app/ai-coach')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentRoute === '/app/ai-coach' ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Coach</span>
        </button>
      </div>
    </header>
  );
};
