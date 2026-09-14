import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

const STORAGE_KEY = 'learnwise_state_v1';

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
  metrics: AssimilationMetrics;
  nextBestAction: Recommendation | null;

  // Actions
  login: (email: string, name: string) => void;
  logout: () => void;
  loadDemoAccount: () => void;
  resetToFreshAccount: () => void;
  setSelectedGoalId: (id: string) => void;
  updateProfile: (updates: Partial<LearnerProfile>) => void;
  submitDiagnosticResponse: (response: DiagnosticResponse) => void;
  completeDiagnostic: () => void;
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
  // Initialize state from localStorage or demo defaults
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auth`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isDemoAccount, setIsDemoAccount] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_is_demo`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [profile, setProfile] = useState<LearnerProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : DEMO_LEARNER_PROFILE;
  });

  const [dimensions, setDimensions] = useState<PlsfrDimension[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dimensions`);
    return saved ? JSON.parse(saved) : INITIAL_PLSFR_DIMENSIONS;
  });

  const [goals, setGoals] = useState<LearningGoal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : DEMO_LEARNING_GOALS;
  });

  const [selectedGoalId, setSelectedGoalId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selected_goal`);
    return saved ? JSON.parse(saved) : 'goal_dsa_01';
  });

  const [concepts, setConcepts] = useState<Concept[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_concepts`);
    return saved ? JSON.parse(saved) : DEMO_CONCEPTS;
  });

  const [retrievalAttempts, setRetrievalAttempts] = useState<RetrievalAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_retrievals`);
    return saved ? JSON.parse(saved) : DEMO_RETRIEVAL_ATTEMPTS;
  });

  const [applicationAttempts, setApplicationAttempts] = useState<ApplicationAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_applications`);
    return saved ? JSON.parse(saved) : DEMO_APPLICATION_ATTEMPTS;
  });

  const [interventions, setInterventions] = useState<Intervention[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_interventions`);
    return saved ? JSON.parse(saved) : DEMO_INTERVENTIONS;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_recommendations`);
    return saved ? JSON.parse(saved) : DEMO_RECOMMENDATIONS;
  });

  const [reflections, setReflections] = useState<LearningReflection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reflections`);
    return saved ? JSON.parse(saved) : DEMO_REFLECTIONS;
  });

  const [risks, setRisks] = useState<LearningRiskSignal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_risks`);
    return saved ? JSON.parse(saved) : DEMO_LEARNING_RISKS;
  });

  const [strategyPlan, setStrategyPlanState] = useState<LearningStrategyPlan | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_strategy`);
    return saved ? JSON.parse(saved) : DEMO_STRATEGY_PLAN;
  });

  const [diagnosticResponses, setDiagnosticResponses] = useState<DiagnosticResponse[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_diagnostic_res`);
    return saved ? JSON.parse(saved) : [];
  });

  const [diagnosticCompleted, setDiagnosticCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_diagnostic_done`);
    return saved ? JSON.parse(saved) : true;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auth`, JSON.stringify(isAuthenticated));
    localStorage.setItem(`${STORAGE_KEY}_is_demo`, JSON.stringify(isDemoAccount));
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    localStorage.setItem(`${STORAGE_KEY}_dimensions`, JSON.stringify(dimensions));
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
    localStorage.setItem(`${STORAGE_KEY}_selected_goal`, JSON.stringify(selectedGoalId));
    localStorage.setItem(`${STORAGE_KEY}_concepts`, JSON.stringify(concepts));
    localStorage.setItem(`${STORAGE_KEY}_retrievals`, JSON.stringify(retrievalAttempts));
    localStorage.setItem(`${STORAGE_KEY}_applications`, JSON.stringify(applicationAttempts));
    localStorage.setItem(`${STORAGE_KEY}_interventions`, JSON.stringify(interventions));
    localStorage.setItem(`${STORAGE_KEY}_recommendations`, JSON.stringify(recommendations));
    localStorage.setItem(`${STORAGE_KEY}_reflections`, JSON.stringify(reflections));
    localStorage.setItem(`${STORAGE_KEY}_risks`, JSON.stringify(risks));
    localStorage.setItem(`${STORAGE_KEY}_strategy`, JSON.stringify(strategyPlan));
    localStorage.setItem(`${STORAGE_KEY}_diagnostic_res`, JSON.stringify(diagnosticResponses));
    localStorage.setItem(`${STORAGE_KEY}_diagnostic_done`, JSON.stringify(diagnosticCompleted));
  }, [
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

  // Auth & Account handlers
  const login = (email: string, name: string) => {
    setIsAuthenticated(true);
    setIsDemoAccount(false);
    setProfile(prev => ({ ...prev, email, name }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const loadDemoAccount = () => {
    setIsAuthenticated(true);
    setIsDemoAccount(true);
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
    setDiagnosticCompleted(true);
  };

  const resetToFreshAccount = () => {
    setIsAuthenticated(true);
    setIsDemoAccount(false);
    setProfile({
      id: 'learner_fresh_' + Date.now(),
      name: 'New Learner',
      email: 'student@learnwise.ng',
      educationLevel: 'University_Undergrad',
      institution: 'University / Secondary School',
      fieldOfStudy: 'General Studies',
      yearOfStudy: 'Year 1',
      availableHoursPerWeek: 6,
      learningContext: ['Mobile-first', 'Hostel study'],
    });
    setDimensions(INITIAL_PLSFR_DIMENSIONS.map(d => ({ ...d, score: 50, strengthLevel: 'Emerging', evidenceCount: 0 })));
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
    setDiagnosticCompleted(false);
  };

  const updateProfile = (updates: Partial<LearnerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const submitDiagnosticResponse = (response: DiagnosticResponse) => {
    setDiagnosticResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== response.questionId);
      return [...filtered, response];
    });
  };

  const completeDiagnostic = () => {
    // Score all 7 dimensions dynamically based on answered options
    const dimensionScoreTotals: Record<PlsfrDimensionKey, { total: number; count: number }> = {
      cognitive_processing: { total: 0, count: 0 },
      knowledge_acquisition: { total: 0, count: 0 },
      knowledge_organization: { total: 0, count: 0 },
      self_regulation: { total: 0, count: 0 },
      motivation_emotion_identity: { total: 0, count: 0 },
      environment_behavior: { total: 0, count: 0 },
      performance_optimization: { total: 0, count: 0 },
    };

    diagnosticResponses.forEach(resp => {
      const question = DIAGNOSTIC_QUESTIONS.find(q => q.id === resp.questionId);
      if (!question) return;
      const option = question.options.find(o => o.id === resp.selectedOptionId);
      if (!option) return;

      Object.entries(option.scoreImpact).forEach(([key, val]) => {
        const dimKey = key as PlsfrDimensionKey;
        if (dimensionScoreTotals[dimKey]) {
          dimensionScoreTotals[dimKey].total += val;
          dimensionScoreTotals[dimKey].count += 1;
        }
      });
    });

    const updatedDims: PlsfrDimension[] = dimensions.map(d => {
      const recorded = dimensionScoreTotals[d.key];
      let newScore = d.score;
      if (recorded && recorded.count > 0) {
        newScore = Math.round(recorded.total / recorded.count);
      }
      let strength: PlsfrDimension['strengthLevel'] = 'Emerging';
      if (newScore < 40) strength = 'Developing';
      else if (newScore < 60) strength = 'Emerging';
      else if (newScore < 75) strength = 'Functional';
      else if (newScore < 90) strength = 'Strong';
      else strength = 'Highly Developed';

      let risk: PlsfrDimension['riskLevel'] = 'Low';
      if (newScore < 45) risk = 'Elevated';
      else if (newScore < 60) risk = 'Moderate';

      return {
        ...d,
        score: newScore,
        evidenceCount: d.evidenceCount + (recorded?.count || 1),
        strengthLevel: strength,
        riskLevel: risk,
      };
    });

    setDimensions(updatedDims);
    setDiagnosticCompleted(true);

    // Generate initial interventions based on lowest scoring dimensions
    const lowestDims = [...updatedDims].sort((a, b) => a.score - b.score).slice(0, 2);
    const newInterventions: Intervention[] = lowestDims.map((dim, idx) => ({
      id: `int_diag_${Date.now()}_${idx}`,
      title: `${dim.name} Scaffolding Protocol`,
      targetDimension: dim.key,
      problem: `Diagnostic identified ${dim.name} as an active learning system friction point (${dim.score}/100).`,
      reason: `Targeted intervention on this sub-dimension provides the highest systemic leverage for capability growth.`,
      action: dim.key === 'knowledge_acquisition' 
        ? 'Begin every study session with 5-10 minutes of closed-book retrieval before consulting notes.'
        : dim.key === 'self_regulation'
        ? 'Rate your confidence before checking answers and classify error root causes.'
        : 'Formulate every core idea into a personal plain-language analogy.',
      frequency: 'Every study session',
      expectedOutcome: `Improve ${dim.name} score to functional level within 3 weeks.`,
      priority: 'High',
      status: 'Active',
      evidenceOrigin: `PLSFR+ Diagnostic Assessment Result (${dim.score}/100)`,
    }));

    setInterventions(newInterventions);
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
        metrics,
        nextBestAction,
        login,
        logout,
        loadDemoAccount,
        resetToFreshAccount,
        setSelectedGoalId,
        updateProfile,
        submitDiagnosticResponse,
        completeDiagnostic,
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
