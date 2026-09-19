import React, { useState, useEffect } from 'react';
import { LearnerProvider, useLearner } from './context/LearnerContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SettingsModal } from './components/SettingsModal';
import { PlatformWalkthroughModal } from './components/PlatformWalkthroughModal';
import { LandingView } from './views/LandingView';
import { TodayQueueView } from './views/TodayQueueView';
import { AssimilationDashboardView } from './views/AssimilationDashboardView';
import { DiagnosticView } from './views/DiagnosticView';
import { DiagnosticResultsView } from './views/DiagnosticResultsView';
import { GoalsAndPathsView } from './views/GoalsAndPathsView';
import { CaptureView } from './views/CaptureView';
import { ProcessConceptView } from './views/ProcessConceptView';
import { RetrievalPracticeView } from './views/RetrievalPracticeView';
import { ApplicationPracticeView } from './views/ApplicationPracticeView';
import { ReinforcementScheduleView } from './views/ReinforcementScheduleView';
import { ReflectionView } from './views/ReflectionView';
import { AISuiteView } from './views/AISuiteView';
import { PromptLibraryView } from './views/PromptLibraryView';
import { InterventionsView } from './views/InterventionsView';
import { ProfileView } from './views/ProfileView';
import { Home, Target, Repeat, Menu, Compass, BrainCircuit } from 'lucide-react';

function AppContent() {
  const { isDemoAccount, loadDemoAccount } = useLearner();
  const { user, loading: authLoading } = useAuth();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };
  
  // Hash/state-based routing for robust container iframe compatibility
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (window.location.hash) {
      return window.location.hash.replace('#', '') || '/';
    }
    return '/';
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [walkthroughModalOpen, setWalkthroughModalOpen] = useState(false);
  const [walkthroughInitialStep, setWalkthroughInitialStep] = useState(0);
  const [preselectedPrompt, setPreselectedPrompt] = useState<string>('');

  const openWalkthrough = (stepIndex: number = 0) => {
    setWalkthroughInitialStep(stepIndex);
    setWalkthroughModalOpen(true);
  };

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hashRoute = window.location.hash.replace('#', '');
      if (hashRoute) {
        setCurrentRoute(hashRoute);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route guard: Protect /app/* routes unless authenticated or in demo mode
  // Note: /app/diagnostic and /app/diagnostic/results allow prospective learners to complete the free diagnostic
  const isPublicAppRoute = currentRoute === '/app/diagnostic' || currentRoute === '/app/diagnostic/results';
  const isAppRoute = currentRoute.startsWith('/app') && !isPublicAppRoute;
  const isAccessAllowed = user !== null || isDemoAccount;

  useEffect(() => {
    if (!authLoading && isAppRoute && !isAccessAllowed) {
      navigate('/');
    }
  }, [authLoading, isAppRoute, isAccessAllowed]);

  if (authLoading && isAppRoute && !isDemoAccount) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#10233F] text-white flex items-center justify-center shadow-md animate-pulse">
          <BrainCircuit className="w-6 h-6 text-[#176FF5]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-bold text-base text-[#10233F]">Loading LearnWise Workspace</h2>
          <p className="text-xs text-[#607089]">Verifying your active learner session...</p>
        </div>
      </div>
    );
  }

  // Determine subview rendering
  const renderView = () => {
    // Landing View
    if (currentRoute === '/') {
      return (
        <LandingView
          onStartDiagnostic={() => navigate('/app/diagnostic')}
          onExploreDemo={() => {
            loadDemoAccount();
            navigate('/app/today');
          }}
          onGoToApp={() => navigate('/app/today')}
          onSignIn={() => openAuthModal('signin')}
          onSignUp={() => openAuthModal('signup')}
          onStartWalkthrough={() => openWalkthrough(0)}
        />
      );
    }

    // Diagnostic Assessment View
    if (currentRoute === '/app/diagnostic') {
      return (
        <DiagnosticView 
          onComplete={() => navigate('/app/diagnostic/results')} 
          onStartWalkthrough={() => openWalkthrough(0)}
        />
      );
    }

    // Diagnostic Results View (PLS-CP)
    if (currentRoute === '/app/diagnostic/results') {
      return (
        <DiagnosticResultsView
          onNavigate={navigate}
          onRetake={() => navigate('/app/diagnostic')}
          onStartWalkthrough={() => openWalkthrough(0)}
        />
      );
    }

    // Today's Queue View
    if (currentRoute === '/app/today') {
      return (
        <TodayQueueView 
          onNavigate={navigate} 
          onStartWalkthrough={openWalkthrough}
        />
      );
    }

    // Assimilation Dashboard View
    if (currentRoute === '/app/dashboard') {
      return (
        <AssimilationDashboardView 
          onNavigate={navigate} 
          onStartWalkthrough={() => openWalkthrough(4)}
        />
      );
    }

    // Goals and Progression Paths View
    if (currentRoute === '/app/goals') {
      return <GoalsAndPathsView onNavigate={navigate} />;
    }

    // Knowledge Ingestion / Capture View
    if (currentRoute === '/app/capture' || currentRoute === '/app/capture/new') {
      return (
        <CaptureView 
          onNavigate={navigate} 
          onStartWalkthrough={() => openWalkthrough(1)}
        />
      );
    }

    // Process Concept Studio View
    if (currentRoute.startsWith('/app/process/')) {
      const conceptId = currentRoute.replace('/app/process/', '');
      return <ProcessConceptView conceptId={conceptId} onNavigate={navigate} />;
    }

    // Active Retrieval Practice View
    if (currentRoute.startsWith('/app/retrieve')) {
      const targetId = currentRoute.replace('/app/retrieve/', '').replace('/app/retrieve', '');
      return (
        <RetrievalPracticeView 
          targetConceptId={targetId || undefined} 
          onNavigate={navigate} 
          onStartWalkthrough={() => openWalkthrough(2)}
        />
      );
    }

    // Application Challenge Practice View
    if (currentRoute.startsWith('/app/apply')) {
      const targetId = currentRoute.replace('/app/apply/', '').replace('/app/apply', '');
      return (
        <ApplicationPracticeView 
          targetConceptId={targetId || undefined} 
          onNavigate={navigate} 
          onStartWalkthrough={() => openWalkthrough(3)}
        />
      );
    }

    // Spaced Reinforcement View
    if (currentRoute === '/app/reinforce') {
      return <ReinforcementScheduleView onNavigate={navigate} />;
    }

    // Metacognitive Reflection View
    if (currentRoute === '/app/reflect') {
      return <ReflectionView onNavigate={navigate} />;
    }

    // AI Learning Suite Views (Architect, Coach, Analyst)
    if (currentRoute === '/app/ai-coach') {
      return <AISuiteView initialTab="coach" onNavigate={navigate} />;
    }
    if (currentRoute === '/app/ai-architect') {
      return <AISuiteView initialTab="architect" onNavigate={navigate} />;
    }
    if (currentRoute === '/app/ai-analyst') {
      return <AISuiteView initialTab="analyst" onNavigate={navigate} />;
    }

    // Prompt Library View
    if (currentRoute === '/app/prompt-library') {
      return (
        <PromptLibraryView
          onSelectPromptForAI={(promptText) => {
            setPreselectedPrompt(promptText);
            navigate('/app/ai-coach');
          }}
          onNavigate={navigate}
        />
      );
    }

    // Intervention Plan View (PLS-IP)
    if (currentRoute === '/app/interventions') {
      return <InterventionsView onNavigate={navigate} />;
    }

    // Profile & Context Parameters View
    if (currentRoute === '/app/profile') {
      return <ProfileView onNavigate={navigate} />;
    }

    // Fallback default
    return <TodayQueueView onNavigate={navigate} />;
  };

  const isLandingPage = currentRoute === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#F7FAFF] text-[#071A3A] selection:bg-[#124BCE]/20 selection:text-[#071A3A]">
        {renderView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex text-[#071A3A] selection:bg-[#124BCE]/20 selection:text-[#071A3A]">
      {/* Clean Modern Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={navigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onStartWalkthrough={() => openWalkthrough(0)}
      />

      {/* Main Content Area with TopBar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <TopBar
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onStartWalkthrough={() => openWalkthrough(0)}
          onOpenAuthModal={openAuthModal}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-24 lg:pb-12">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Quick Access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2 flex items-center justify-around text-[10px]">
        <button
          onClick={() => navigate('/app/today')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            currentRoute === '/app/today' ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate('/app/goals')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            currentRoute === '/app/goals' ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>Goals</span>
        </button>

        <button
          onClick={() => navigate('/app/retrieve')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            currentRoute === '/app/retrieve' ? 'text-[#124BCE] font-bold' : 'text-gray-500'
          }`}
        >
          <Repeat className="w-5 h-5" />
          <span>Practice</span>
        </button>

        <button
          onClick={() => openWalkthrough(0)}
          className="flex flex-col items-center gap-1 p-1 text-gray-500 hover:text-[#124BCE] cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          <span>Tour</span>
        </button>

        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-gray-500 hover:text-[#124BCE] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </div>

      {/* Settings & Demo Account Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onNavigate={navigate}
        onOpenAuthModal={openAuthModal}
      />

      {/* Real Supabase Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => navigate('/app/today')}
        onExploreDemo={() => {
          loadDemoAccount();
          navigate('/app/today');
        }}
      />

      {/* Interactive Platform Walkthrough Modal */}
      <PlatformWalkthroughModal
        isOpen={walkthroughModalOpen}
        onClose={() => setWalkthroughModalOpen(false)}
        onNavigate={navigate}
        initialStepIndex={walkthroughInitialStep}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LearnerProvider>
        <AppContent />
      </LearnerProvider>
    </AuthProvider>
  );
}
