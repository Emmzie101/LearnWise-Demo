import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  LearnerProfile, 
  LearningGoal, 
  PlsfrDimension, 
  PlsfrDimensionKey, 
  Concept, 
  RetrievalAttempt, 
  ApplicationAttempt, 
  Intervention, 
  Recommendation,
  LearningReflection,
  LearningRiskSignal,
  LearningStrategyPlan,
  DiagnosticResponse,
  DiagnosticReport,
  ConceptState,
  RetrievalErrorType
} from '../types';
import { 
  DEMO_LEARNER_PROFILE, 
  INITIAL_PLSFR_DIMENSIONS, 
  DEMO_LEARNING_GOALS, 
  DEMO_CONCEPTS, 
  DEMO_RETRIEVAL_ATTEMPTS, 
  DEMO_APPLICATION_ATTEMPTS, 
  DEMO_INTERVENTIONS, 
  DEMO_RECOMMENDATIONS, 
  DEMO_REFLECTIONS, 
  DEMO_LEARNING_RISKS,
  DEMO_STRATEGY_PLAN
} from '../data/initialDemoData';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { generateDiagnosticReport, DEFAULT_DEMO_REPORT } from '../utils/diagnosticEngine';
import { useAuth } from './AuthContext';
import { 
  getLearnerProfile, 
  saveLearnerProfile, 
  getCurrentDimensions, 
  upsertDimensions, 
  getOrCreateActiveAssessment, 
  getLatestCompletedReport, 
  getAssessmentResponses, 
  saveDiagnosticResponse, 
  completeAssessment, 
  abandonActiveAssessment,
  saveDiagnosticReport
} from '../services/diagnosticService';

const DEMO_STORAGE_KEY = 'learnwise_demo_v1';

// Neutral, safe baselines for fresh authenticated learners (strictly avoids demo data leakage)
export const DEFAULT_AUTHENTICATED_PROFILE: LearnerProfile = {
  id: '',
  name: '',
  email: '',
  educationLevel: 'University_Undergrad',
  institution: '',
  fieldOfStudy: '',
  yearOfStudy: '',
  availableHoursPerWeek: 6,
  learningContext: [],
};

export const NEUTRAL_AUTHENTICATED_DIMENSIONS: PlsfrDimension[] = INITIAL_PLSFR_DIMENSIONS.map(d => ({
  ...d,
  score: 50,
  strengthLevel: 'Emerging',
  riskLevel: 'Moderate',
  confidence: 50,
  confidenceBand: 'Moderate',
  evidenceCount: 0,
  evidenceBreakdown: {
    selfReportCount: 0,
    scenarioCount: 0,
    performanceCount: 0,
    contradictions: [],
  },
}));

function hasStoredSupabaseSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed?.user || parsed?.access_token) return true;
        }
      }
    }
  } catch {
    // Ignore storage parsing issues
  }
  return false;
}

interface AssimilationMetrics {
  capabilityGrowthScore: number; // 0-100
  retrievalAccuracy: number; // 0-100
  applicationTransferRate: number; // 0-100
  confidenceCalibrationRate: number; // % well calibrated
  retentionDurability: number; // 0-100
  totalConcepts: number;
  masteredConcepts: number;
  strengths: string[];
  bottlenecks: string[];
}

interface LearnerContextType {
  isAuthenticated: boolean;
  isDemoAccount: boolean;
  profile: LearnerProfile;
  dimensions: PlsfrDimension[];
  goals: LearningGoal[];
  selectedGoalId: string;
  concepts: Concept[];
  retrievalAttempts: RetrievalAttempt[];
  applicationAttempts: ApplicationAttempt[];
  interventions: Intervention[];
  recommendations: Recommendation[];
  reflections: LearningReflection[];
  risks: LearningRiskSignal[];
  strategyPlan: LearningStrategyPlan | null;
  diagnosticResponses: DiagnosticResponse[];
  diagnosticCompleted: boolean;
  diagnosticReport: DiagnosticReport | null;
  metrics: AssimilationMetrics;
  nextBestAction: Recommendation | null;
  activeAssessmentId: string | null;

  // Actions
  login: (email: string, name: string) => void;
  logout: () => void;
  loadDemoAccount: () => void;
  resetToFreshAccount: () => void;
  setSelectedGoalId: (id: string) => void;
  updateProfile: (updates: Partial<LearnerProfile>) => void;
  submitDiagnosticResponse: (response: DiagnosticResponse) => void;
  commitQuestionResponse: (response: DiagnosticResponse, overrideAssessmentId?: string) => Promise<DiagnosticResponse[]>;
  completeDiagnostic: (explicitResponses?: DiagnosticResponse[]) => void;
  completeDiagnosticAsync: (explicitResponses?: DiagnosticResponse[], overrideAssessmentId?: string) => Promise<DiagnosticReport>;
  resetDiagnostic: () => void;
  retakeDiagnostic: () => Promise<void>;
  setActiveAssessmentId: (id: string | null) => void;
  refreshLearnerState: () => Promise<void>;
  createGoal: (goal: Omit<LearningGoal, 'id' | 'totalConceptsCount' | 'masteredConceptsCount'>) => void;
  captureConcept: (concept: Omit<Concept, 'id' | 'state' | 'recallSuccessCount' | 'recallFailureCount' | 'applicationSuccessCount' | 'applicationFailureCount' | 'reinforcementIntervalDays'>) => string;
  updateConceptState: (conceptId: string, newState: ConceptState) => void;
  submitRetrievalAttempt: (attempt: Omit<RetrievalAttempt, 'id' | 'timestamp' | 'calibrationStatus'>) => void;
  submitApplicationAttempt: (attempt: Omit<ApplicationAttempt, 'id' | 'timestamp'>) => void;
  submitReflection: (reflection: Omit<LearningReflection, 'id' | 'timestamp'>) => void;
  updateInterventionStatus: (id: string, status: 'Active' | 'Completed' | 'Dismissed') => void;
  dismissRecommendation: (id: string) => void;
  setStrategyPlan: (plan: LearningStrategyPlan) => void;
}

const LearnerContext = createContext<LearnerContextType | null>(null);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut: authSignOut } = useAuth();

  // Differentiate demo mode vs authenticated mode strictly to prevent state leakage
  const isInitialAuth = !!user || hasStoredSupabaseSession();
  const isInitialDemo = !isInitialAuth && (typeof window !== 'undefined' && localStorage.getItem(`${DEMO_STORAGE_KEY}_is_demo`) === 'true');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (isInitialAuth) return true;
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_auth`);
      return saved !== null ? JSON.parse(saved) : true;
    }
    return false;
  });

  const [isDemoAccount, setIsDemoAccount] = useState<boolean>(() => {
    return isInitialDemo;
  });

  const [profile, setProfile] = useState<LearnerProfile>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : DEMO_LEARNER_PROFILE;
    }
    return {
      ...DEFAULT_AUTHENTICATED_PROFILE,
      id: user?.id || '',
      email: user?.email || '',
      name: (user?.user_metadata?.name as string) || (user?.user_metadata?.full_name as string) || '',
    };
  });

  const [dimensions, setDimensions] = useState<PlsfrDimension[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_dimensions`);
      return saved ? JSON.parse(saved) : INITIAL_PLSFR_DIMENSIONS;
    }
    return NEUTRAL_AUTHENTICATED_DIMENSIONS;
  });

  const [goals, setGoals] = useState<LearningGoal[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : DEMO_LEARNING_GOALS;
    }
    return [];
  });

  const [selectedGoalId, setSelectedGoalId] = useState<string>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_selected_goal`);
      return saved ? JSON.parse(saved) : 'goal_dsa_01';
    }
    return '';
  });

  const [concepts, setConcepts] = useState<Concept[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_concepts`);
      return saved ? JSON.parse(saved) : DEMO_CONCEPTS;
    }
    return [];
  });

  const [retrievalAttempts, setRetrievalAttempts] = useState<RetrievalAttempt[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_retrievals`);
      return saved ? JSON.parse(saved) : DEMO_RETRIEVAL_ATTEMPTS;
    }
    return [];
  });

  const [applicationAttempts, setApplicationAttempts] = useState<ApplicationAttempt[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_applications`);
      return saved ? JSON.parse(saved) : DEMO_APPLICATION_ATTEMPTS;
    }
    return [];
  });

  const [interventions, setInterventions] = useState<Intervention[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_interventions`);
      return saved ? JSON.parse(saved) : DEMO_INTERVENTIONS;
    }
    return [];
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_recommendations`);
      return saved ? JSON.parse(saved) : DEMO_RECOMMENDATIONS;
    }
    return [];
  });

  const [reflections, setReflections] = useState<LearningReflection[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_reflections`);
      return saved ? JSON.parse(saved) : DEMO_REFLECTIONS;
    }
    return [];
  });

  const [risks, setRisks] = useState<LearningRiskSignal[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_risks`);
      return saved ? JSON.parse(saved) : DEMO_LEARNING_RISKS;
    }
    return [];
  });

  const [strategyPlan, setStrategyPlanState] = useState<LearningStrategyPlan | null>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_strategy`);
      return saved ? JSON.parse(saved) : DEMO_STRATEGY_PLAN;
    }
    return null;
  });

  const [diagnosticResponses, setDiagnosticResponses] = useState<DiagnosticResponse[]>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_diagnostic_res`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [diagnosticCompleted, setDiagnosticCompleted] = useState<boolean>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_diagnostic_done`);
      return saved !== null ? JSON.parse(saved) : true;
    }
    return false; // Authenticated users strictly default to false until a persisted report is loaded
  });

  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(() => {
    if (isInitialDemo) {
      const saved = localStorage.getItem(`${DEMO_STORAGE_KEY}_diagnostic_report`);
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_REPORT;
    }
    return null; // Authenticated users strictly default to null until a persisted report is loaded
  });

  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);

  // Synchronous ref to prevent stale response race conditions during report generation
  const diagnosticResponsesRef = useRef<DiagnosticResponse[]>(diagnosticResponses);
  useEffect(() => {
    diagnosticResponsesRef.current = diagnosticResponses;
  }, [diagnosticResponses]);

  // Save changes ONLY if in demo mode (strict isolation)
  useEffect(() => {
    if (!isDemoAccount) return;

    localStorage.setItem(`${DEMO_STORAGE_KEY}_auth`, JSON.stringify(isAuthenticated));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_is_demo`, JSON.stringify(isDemoAccount));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_profile`, JSON.stringify(profile));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_dimensions`, JSON.stringify(dimensions));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_goals`, JSON.stringify(goals));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_selected_goal`, JSON.stringify(selectedGoalId));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_concepts`, JSON.stringify(concepts));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_retrievals`, JSON.stringify(retrievalAttempts));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_applications`, JSON.stringify(applicationAttempts));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_interventions`, JSON.stringify(interventions));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_recommendations`, JSON.stringify(recommendations));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_reflections`, JSON.stringify(reflections));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_risks`, JSON.stringify(risks));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_strategy`, JSON.stringify(strategyPlan));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_diagnostic_res`, JSON.stringify(diagnosticResponses));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_diagnostic_done`, JSON.stringify(diagnosticCompleted));
    localStorage.setItem(`${DEMO_STORAGE_KEY}_diagnostic_report`, JSON.stringify(diagnosticReport));
  }, [
    isDemoAccount,
    isAuthenticated,
    profile,
    dimensions,
    goals,
    selectedGoalId,
    concepts,
    retrievalAttempts,
    applicationAttempts,
    interventions,
    recommendations,
    reflections,
    risks,
    strategyPlan,
    diagnosticResponses,
    diagnosticCompleted,
    diagnosticReport,
  ]);

  // Compute real metrics derived dynamically from actual records
  const metrics = useMemo<AssimilationMetrics>(() => {
    // Retrieval accuracy
    const totalRetrievals = retrievalAttempts.length;
    const correctRetrievals = retrievalAttempts.filter(r => r.isCorrect).length;
    const retrievalAccuracy = totalRetrievals > 0 ? Math.round((correctRetrievals / totalRetrievals) * 100) : 60;

    // Application transfer rate
    const totalApplications = applicationAttempts.length;
    const proficientApplications = applicationAttempts.filter(a => a.isProficient).length;
    const applicationTransferRate = totalApplications > 0 ? Math.round((proficientApplications / totalApplications) * 100) : 45;

    // Confidence calibration
    const wellCalibratedCount = retrievalAttempts.filter(r => r.calibrationStatus === 'well_calibrated').length;
    const confidenceCalibrationRate = totalRetrievals > 0 ? Math.round((wellCalibratedCount / totalRetrievals) * 100) : 50;

    // Retention durability
    const stableConcepts = concepts.filter(c => c.state === 'Reinforced' || c.state === 'Stable').length;
    const totalConcepts = concepts.length;
    const retentionDurability = totalConcepts > 0 ? Math.round((stableConcepts / totalConcepts) * 100) : 40;

    // Overall Capability Growth: synthesis of PLSFR scores, retrieval, and application
    const avgDimScore = dimensions.reduce((acc, d) => acc + d.score, 0) / (dimensions.length || 1);
    const capabilityGrowthScore = Math.round(avgDimScore * 0.4 + retrievalAccuracy * 0.3 + applicationTransferRate * 0.3);

    // Strengths & Bottlenecks derived from dimensions
    const sortedDims = [...dimensions].sort((a, b) => b.score - a.score);
    const strengths = sortedDims.slice(0, 2).map(d => `${d.name} (${d.score}/100)`);
    const bottlenecks = sortedDims.slice(-2).map(d => `${d.name} (${d.score}/100)`);

    return {
      capabilityGrowthScore,
      retrievalAccuracy,
      applicationTransferRate,
      confidenceCalibrationRate,
      retentionDurability,
      totalConcepts,
      masteredConcepts: stableConcepts,
      strengths,
      bottlenecks,
    };
  }, [dimensions, retrievalAttempts, applicationAttempts, concepts]);

  // Next Best Action is the highest-priority active recommendation
  const nextBestAction = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return null;
    return recommendations[0];
  }, [recommendations]);

  // Adaptive Engine Rule Evaluator (Runs after user attempts or changes)
  const evaluateAdaptiveRules = useCallback((
    currentRetrievals: RetrievalAttempt[],
    currentApps: ApplicationAttempt[],
    currentConcepts: Concept[]
  ) => {
    const newRecommendations: Recommendation[] = [];
    const newInterventions: Intervention[] = [...interventions];

    // Rule 1: Weak Retrieval (<60%) or passive review
    const totalRet = currentRetrievals.length;
    const correctRet = currentRetrievals.filter(r => r.isCorrect).length;
    const retRate = totalRet > 0 ? (correctRet / totalRet) * 100 : 70;

    if (retRate < 60) {
      newRecommendations.push({
        id: `rec_adapt_ret_${Date.now()}`,
        type: 'retrieval',
        title: 'Active Retrieval Recovery Drill',
        reason: `Your retrieval accuracy is currently at ${Math.round(retRate)}%. Shift immediate study effort to closed-book recall drills.`,
        sourceSignal: `Adaptive Rule 1: Retrieval accuracy threshold breached (${Math.round(retRate)}% < 60%).`,
        actionPrompt: 'Practice closed-book retrieval for your most fragile concept.',
        actionRoute: '/app/retrieve',
        priority: 'Critical',
        createdAt: new Date().toISOString(),
      });
    }

    // Rule 2: High Recall (>70%) but Low Application (<55%) -> Contextual Transfer Gap!
    const totalApp = currentApps.length;
    const profApp = currentApps.filter(a => a.isProficient).length;
    const appRate = totalApp > 0 ? (profApp / totalApp) * 100 : 50;

    if (retRate >= 70 && appRate < 55) {
      newRecommendations.push({
        id: `rec_adapt_app_${Date.now()}`,
        type: 'application',
        title: 'Contextual Application Challenge Due',
        reason: 'Your definition recall is solid, but authentic application transfer is lagging. Practicing novel problems will prevent exam surprises.',
        sourceSignal: `Adaptive Rule 2: Recall (${Math.round(retRate)}%) exceeds Transfer (${Math.round(appRate)}%) by over 15%.`,
        actionPrompt: 'Attempt a scenario challenge in a new context today.',
        actionRoute: '/app/apply',
        priority: 'High',
        createdAt: new Date().toISOString(),
      });
    }

    // Rule 5: Overconfidence gap (confidence >= 4 and incorrect)
    const recentOverconfident = currentRetrievals.slice(-3).filter(r => r.calibrationStatus === 'overconfident');
    if (recentOverconfident.length >= 2) {
      newRecommendations.push({
        id: `rec_adapt_calib_${Date.now()}`,
        type: 'reflection',
        title: 'Confidence Calibration Checkpoint',
        reason: 'Overconfidence bias detected on recent practice questions. Passive fluency is masking procedural gaps.',
        sourceSignal: 'Adaptive Rule 5: 2 of your last 3 attempts showed high confidence despite incorrect recall.',
        actionPrompt: 'Review the Error Taxonomy prompt in the prompt library before your next session.',
        actionRoute: '/app/prompt-library',
        priority: 'High',
        createdAt: new Date().toISOString(),
      });
    }

    // Update recommendations, keeping existing ones that are still relevant
    if (newRecommendations.length > 0) {
      setRecommendations(prev => {
        const combined = [...newRecommendations, ...prev.filter(p => !newRecommendations.some(n => n.type === p.type))];
        return combined.slice(0, 5); // Keep top 5
      });
    }
  }, [interventions]);

  // Hydrate authenticated user state from Supabase
  const refreshLearnerState = useCallback(async () => {
    if (!user || isDemoAccount) return;
    try {
      // 1. Profile
      const dbProfile = await getLearnerProfile(user.id);
      if (dbProfile) {
        setProfile({
          ...dbProfile,
          email: user.email || '',
          name: dbProfile.name || (user.user_metadata?.name as string) || (user.user_metadata?.full_name as string) || 'New Learner',
        });
      }

      // 2. Dimensions
      const dbDimensions = await getCurrentDimensions(user.id);
      if (dbDimensions.length > 0) {
        setDimensions(dbDimensions);
      } else {
        setDimensions(NEUTRAL_AUTHENTICATED_DIMENSIONS);
      }

      // 3. Completed Diagnostic Report
      const latestReport = await getLatestCompletedReport(user.id);
      if (latestReport) {
        setDiagnosticReport(latestReport);
        setDiagnosticCompleted(true);
      } else {
        setDiagnosticReport(null);
        setDiagnosticCompleted(false);
      }

      // 4. Active Assessment & Responses
      const activeAssessment = await getOrCreateActiveAssessment(user.id);
      if (activeAssessment) {
        setActiveAssessmentId(activeAssessment.id);
        const savedResponses = await getAssessmentResponses(activeAssessment.id, user.id);
        setDiagnosticResponses(savedResponses);
        diagnosticResponsesRef.current = savedResponses;
      }
    } catch (err) {
      console.error('[LearnerContext] Error hydrating learner state:', err);
    }
  }, [user, isDemoAccount]);

  // Synchronize authenticated identity from Supabase Auth
  useEffect(() => {
    let isMounted = true;

    if (user) {
      setIsDemoAccount(false);
      setIsAuthenticated(true);
      // Immediately reset to clean non-demo authenticated baseline so no demo data (Ada, etc.) leaks
      setProfile({
        ...DEFAULT_AUTHENTICATED_PROFILE,
        id: user.id,
        email: user.email || '',
        name: (user.user_metadata?.name as string) || (user.user_metadata?.full_name as string) || '',
      });
      setDimensions(NEUTRAL_AUTHENTICATED_DIMENSIONS);
      setGoals([]);
      setSelectedGoalId('');
      setConcepts([]);
      setRetrievalAttempts([]);
      setApplicationAttempts([]);
      setInterventions([]);
      setRecommendations([]);
      setReflections([]);
      setRisks([]);
      setStrategyPlanState(null);
      setDiagnosticResponses([]);
      diagnosticResponsesRef.current = [];
      setDiagnosticReport(null);
      setDiagnosticCompleted(false);

      void refreshLearnerState();
    } else if (!isDemoAccount) {
      setIsAuthenticated(false);
      setActiveAssessmentId(null);
      setDiagnosticReport(null);
      setDiagnosticCompleted(false);
      setDiagnosticResponses([]);
      diagnosticResponsesRef.current = [];
    }

    return () => {
      isMounted = false;
    };
  }, [user, isDemoAccount, refreshLearnerState]);

  // Auth & Account handlers
  const login = (email: string, name: string) => {
    setIsAuthenticated(true);
    setIsDemoAccount(false);
    setProfile(prev => ({ ...prev, email, name }));
  };

  const logout = () => {
    if (user) {
      void authSignOut();
    }
    setIsAuthenticated(false);
    setIsDemoAccount(false);
    setActiveAssessmentId(null);
    setProfile(DEFAULT_AUTHENTICATED_PROFILE);
    setDimensions(NEUTRAL_AUTHENTICATED_DIMENSIONS);
    setGoals([]);
    setSelectedGoalId('');
    setConcepts([]);
    setRetrievalAttempts([]);
    setApplicationAttempts([]);
    setInterventions([]);
    setRecommendations([]);
    setReflections([]);
    setRisks([]);
    setStrategyPlanState(null);
    setDiagnosticReport(null);
    setDiagnosticCompleted(false);
    setDiagnosticResponses([]);
    diagnosticResponsesRef.current = [];
  };

  const loadDemoAccount = () => {
    if (user) {
      void authSignOut();
    }
    setIsAuthenticated(true);
    setIsDemoAccount(true);
    setActiveAssessmentId(null);
    setProfile(DEMO_LEARNER_PROFILE);
    setDimensions(INITIAL_PLSFR_DIMENSIONS);
    setGoals(DEMO_LEARNING_GOALS);
    setSelectedGoalId('goal_dsa_01');
    setConcepts(DEMO_CONCEPTS);
    setRetrievalAttempts(DEMO_RETRIEVAL_ATTEMPTS);
    setApplicationAttempts(DEMO_APPLICATION_ATTEMPTS);
    setInterventions(DEMO_INTERVENTIONS);
    setRecommendations(DEMO_RECOMMENDATIONS);
    setReflections(DEMO_REFLECTIONS);
    setRisks(DEMO_LEARNING_RISKS);
    setStrategyPlanState(DEMO_STRATEGY_PLAN);
    setDiagnosticResponses([]);
    diagnosticResponsesRef.current = [];
    setDiagnosticReport(DEFAULT_DEMO_REPORT);
    setDiagnosticCompleted(true);
  };

  const resetToFreshAccount = () => {
    setIsAuthenticated(user !== null);
    setIsDemoAccount(false);
    setActiveAssessmentId(null);
    setProfile({
      ...DEFAULT_AUTHENTICATED_PROFILE,
      id: user ? user.id : 'learner_fresh_' + Date.now(),
      name: (user?.user_metadata?.name as string) || (user?.user_metadata?.full_name as string) || 'New Learner',
      email: user?.email || '',
    });
    setDimensions(NEUTRAL_AUTHENTICATED_DIMENSIONS);
    setGoals([]);
    setSelectedGoalId('');
    setConcepts([]);
    setRetrievalAttempts([]);
    setApplicationAttempts([]);
    setInterventions([]);
    setRecommendations([]);
    setReflections([]);
    setRisks([]);
    setStrategyPlanState(null);
    setDiagnosticResponses([]);
    diagnosticResponsesRef.current = [];
    setDiagnosticReport(null);
    setDiagnosticCompleted(false);
  };

  const updateProfile = (updates: Partial<LearnerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    if (user && !isDemoAccount) {
      saveLearnerProfile(user.id, updates).catch(err => {
        console.error('[LearnerContext] Failed to persist profile updates:', err);
      });
    }
  };

  const submitDiagnosticResponse = (response: DiagnosticResponse) => {
    setDiagnosticResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== response.questionId);
      const updated = [...filtered, response];
      diagnosticResponsesRef.current = updated;
      return updated;
    });
  };

  const commitQuestionResponse = async (
    response: DiagnosticResponse, 
    overrideAssessmentId?: string
  ): Promise<DiagnosticResponse[]> => {
    // 1. If authenticated, persist to Supabase first; failures throw before updating committed ledger
    if (user && !isDemoAccount) {
      let targetAssessmentId = overrideAssessmentId || activeAssessmentId;
      if (!targetAssessmentId) {
        const assessment = await getOrCreateActiveAssessment(user.id);
        targetAssessmentId = assessment.id;
        setActiveAssessmentId(assessment.id);
      }
      await saveDiagnosticResponse({
        assessmentId: targetAssessmentId,
        userId: user.id,
        response,
      });
    }

    // 2. Only after successful persistence (or in local demo mode), commit to response ledger
    const currentList = diagnosticResponsesRef.current;
    const filtered = currentList.filter(r => r.questionId !== response.questionId);
    const updatedResponses = [...filtered, response];
    diagnosticResponsesRef.current = updatedResponses;
    setDiagnosticResponses(updatedResponses);

    return updatedResponses;
  };

  const completeDiagnostic = (explicitResponses?: DiagnosticResponse[]) => {
    // Generate triangulated PLSFR+ diagnostic report with auditable rules, confidence bands, & interventions
    const responsesToEvaluate = explicitResponses && explicitResponses.length > 0
      ? explicitResponses
      : diagnosticResponsesRef.current;
    const result = generateDiagnosticReport(responsesToEvaluate, dimensions, profile);
    setDimensions(result.updatedDimensions);
    setDiagnosticReport(result.report);
    setInterventions(result.initialInterventions);
    setDiagnosticCompleted(true);
  };

  const completeDiagnosticAsync = async (
    explicitResponses?: DiagnosticResponse[],
    overrideAssessmentId?: string
  ): Promise<DiagnosticReport> => {
    const targetAssessmentId = overrideAssessmentId || activeAssessmentId;
    const responsesToEvaluate = explicitResponses && explicitResponses.length > 0
      ? explicitResponses
      : diagnosticResponsesRef.current;

    // 1. Generate final report from COMPLETE response set
    const result = generateDiagnosticReport(responsesToEvaluate, dimensions, profile);

    if (user && !isDemoAccount) {
      let assessmentId = targetAssessmentId;
      if (!assessmentId) {
        const active = await getOrCreateActiveAssessment(user.id);
        assessmentId = active.id;
        setActiveAssessmentId(active.id);
      }

      // 2. Persist diagnostic_reports (idempotent: safe on retry)
      await saveDiagnosticReport({
        assessmentId,
        userId: user.id,
        report: result.report,
        dimensionsSnapshot: result.updatedDimensions,
      });

      // 3. Upsert seven plsfr_dimensions
      await upsertDimensions(user.id, result.updatedDimensions);

      // 4. Mark diagnostic_assessment completed
      await completeAssessment(assessmentId, user.id);
    }

    // 5. Update React state
    setDimensions(result.updatedDimensions);
    setDiagnosticReport(result.report);
    setInterventions(result.initialInterventions);
    setDiagnosticCompleted(true);

    return result.report;
  };

  const resetDiagnostic = () => {
    setDiagnosticResponses([]);
    diagnosticResponsesRef.current = [];
    setDiagnosticCompleted(false);
  };

  const retakeDiagnostic = async () => {
    if (user && !isDemoAccount) {
      await abandonActiveAssessment(user.id);
      const newAssessment = await getOrCreateActiveAssessment(user.id);
      setActiveAssessmentId(newAssessment.id);
    }
    setDiagnosticResponses([]);
    diagnosticResponsesRef.current = [];
    setDiagnosticCompleted(false);
  };

  const createGoal = (goalData: Omit<LearningGoal, 'id' | 'totalConceptsCount' | 'masteredConceptsCount'>) => {
    const newGoal: LearningGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      totalConceptsCount: 0,
      masteredConceptsCount: 0,
    };
    setGoals(prev => [newGoal, ...prev]);
    setSelectedGoalId(newGoal.id);
  };

  const captureConcept = (conceptData: Omit<Concept, 'id' | 'state' | 'recallSuccessCount' | 'recallFailureCount' | 'applicationSuccessCount' | 'applicationFailureCount' | 'reinforcementIntervalDays'>): string => {
    const newId = `c_${Date.now()}`;
    const newConcept: Concept = {
      ...conceptData,
      id: newId,
      state: 'Introduced',
      recallSuccessCount: 0,
      recallFailureCount: 0,
      applicationSuccessCount: 0,
      applicationFailureCount: 0,
      reinforcementIntervalDays: 1,
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
    };
    setConcepts(prev => [newConcept, ...prev]);

    // Update goal count
    setGoals(prev => prev.map(g => g.id === conceptData.goalId ? { ...g, totalConceptsCount: g.totalConceptsCount + 1 } : g));

    return newId;
  };

  const updateConceptState = (conceptId: string, newState: ConceptState) => {
    setConcepts(prev => prev.map(c => c.id === conceptId ? { ...c, state: newState } : c));
  };

  const submitRetrievalAttempt = (attemptData: Omit<RetrievalAttempt, 'id' | 'timestamp' | 'calibrationStatus'>) => {
    // Calibration calculation
    let calibrationStatus: 'well_calibrated' | 'overconfident' | 'underconfident' = 'well_calibrated';
    if (attemptData.isCorrect && attemptData.confidenceRating <= 2) {
      calibrationStatus = 'underconfident';
    } else if (!attemptData.isCorrect && attemptData.confidenceRating >= 4) {
      calibrationStatus = 'overconfident';
    }

    const newAttempt: RetrievalAttempt = {
      ...attemptData,
      id: `ret_${Date.now()}`,
      timestamp: new Date().toISOString(),
      calibrationStatus,
    };

    const updatedAttempts = [newAttempt, ...retrievalAttempts];
    setRetrievalAttempts(updatedAttempts);

    // Update concept statistics and progressive state
    const updatedConcepts = concepts.map(c => {
      if (c.id === attemptData.conceptId) {
        const newSuccess = attemptData.isCorrect ? c.recallSuccessCount + 1 : c.recallSuccessCount;
        const newFailure = !attemptData.isCorrect ? c.recallFailureCount + 1 : c.recallFailureCount;
        
        let newState = c.state;
        if (attemptData.isCorrect) {
          if (c.state === 'Introduced' || c.state === 'Processed') {
            newState = 'Retrieved';
          } else if (c.state === 'Retrieved' && c.applicationSuccessCount > 0) {
            newState = 'Reinforced';
          }
        }

        // Spaced interval update
        const newInterval = attemptData.isCorrect 
          ? Math.min(14, Math.round(c.reinforcementIntervalDays * 1.8) + 1)
          : Math.max(1, Math.floor(c.reinforcementIntervalDays * 0.5));

        return {
          ...c,
          state: newState,
          recallSuccessCount: newSuccess,
          recallFailureCount: newFailure,
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + newInterval * 86400000).toISOString(),
          reinforcementIntervalDays: newInterval,
          lastConfidenceRating: attemptData.confidenceRating,
        };
      }
      return c;
    });
    setConcepts(updatedConcepts);

    // Trigger Adaptive Engine
    evaluateAdaptiveRules(updatedAttempts, applicationAttempts, updatedConcepts);
  };

  const submitApplicationAttempt = (attemptData: Omit<ApplicationAttempt, 'id' | 'timestamp'>) => {
    const newAttempt: ApplicationAttempt = {
      ...attemptData,
      id: `app_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const updatedApps = [newAttempt, ...applicationAttempts];
    setApplicationAttempts(updatedApps);

    // Update concept state to 'Applied' or 'Stable' if both recall and application are proficient
    const updatedConcepts = concepts.map(c => {
      if (c.id === attemptData.conceptId) {
        const newSuccess = attemptData.isProficient ? c.applicationSuccessCount + 1 : c.applicationSuccessCount;
        const newFailure = !attemptData.isProficient ? c.applicationFailureCount + 1 : c.applicationFailureCount;
        
        let newState = c.state;
        if (attemptData.isProficient) {
          if (c.recallSuccessCount >= 2 && newSuccess >= 2) {
            newState = 'Stable';
          } else {
            newState = 'Applied';
          }
        }

        return {
          ...c,
          state: newState,
          applicationSuccessCount: newSuccess,
          applicationFailureCount: newFailure,
        };
      }
      return c;
    });
    setConcepts(updatedConcepts);

    // Update goal mastered count
    setGoals(prev => prev.map(g => {
      const mastered = updatedConcepts.filter(c => c.goalId === g.id && (c.state === 'Reinforced' || c.state === 'Stable')).length;
      return { ...g, masteredConceptsCount: mastered };
    }));

    // Trigger Adaptive Engine
    evaluateAdaptiveRules(retrievalAttempts, updatedApps, updatedConcepts);
  };

  const submitReflection = (reflectionData: Omit<LearningReflection, 'id' | 'timestamp'>) => {
    const newReflection: LearningReflection = {
      ...reflectionData,
      id: `ref_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setReflections(prev => [newReflection, ...prev]);

    // Boost self-regulation score slightly for consistent reflection
    setDimensions(prev => prev.map(d => {
      if (d.key === 'self_regulation') {
        const newScore = Math.min(100, d.score + 1);
        return { ...d, score: newScore, evidenceCount: d.evidenceCount + 1 };
      }
      return d;
    }));
  };

  const updateInterventionStatus = (id: string, status: 'Active' | 'Completed' | 'Dismissed') => {
    setInterventions(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  const setStrategyPlan = (plan: LearningStrategyPlan) => {
    setStrategyPlanState(plan);
  };

  return (
    <LearnerContext.Provider
      value={{
        isAuthenticated,
        isDemoAccount,
        profile,
        dimensions,
        goals,
        selectedGoalId,
        concepts,
        retrievalAttempts,
        applicationAttempts,
        interventions,
        recommendations,
        reflections,
        risks,
        strategyPlan,
        diagnosticResponses,
        diagnosticCompleted,
        diagnosticReport,
        metrics,
        nextBestAction,
        activeAssessmentId,
        login,
        logout,
        loadDemoAccount,
        resetToFreshAccount,
        setSelectedGoalId,
        updateProfile,
        submitDiagnosticResponse,
        commitQuestionResponse,
        completeDiagnostic,
        completeDiagnosticAsync,
        resetDiagnostic,
        retakeDiagnostic,
        setActiveAssessmentId,
        refreshLearnerState,
        createGoal,
        captureConcept,
        updateConceptState,
        submitRetrievalAttempt,
        submitApplicationAttempt,
        submitReflection,
        updateInterventionStatus,
        dismissRecommendation,
        setStrategyPlan,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
};

export const useLearner = () => {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
};
