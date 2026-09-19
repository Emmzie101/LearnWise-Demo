/**
 * LearnWise Core Type Definitions (PLSFR+ Architecture)
 */

export type EducationLevel = 
  | 'SS1' 
  | 'SS2' 
  | 'SS3' 
  | 'University_Undergrad' 
  | 'University_Postgrad' 
  | 'Polytechnic_College' 
  | 'Self_Directed';

export type PlsfrDimensionKey = 
  | 'cognitive_processing'
  | 'knowledge_acquisition'
  | 'knowledge_organization'
  | 'self_regulation'
  | 'motivation_emotion_identity'
  | 'environment_behavior'
  | 'performance_optimization';

export interface PlsfrDimension {
  key: PlsfrDimensionKey;
  name: string;
  description: string;
  score: number; // 0-100
  confidence: number; // 0-100 numeric
  confidenceBand?: 'Low' | 'Moderate' | 'High'; // Section H confidence rating
  evidenceCount: number;
  strengthLevel: 'Developing' | 'Emerging' | 'Functional' | 'Strong' | 'Highly Developed';
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  evidenceBreakdown?: {
    selfReportCount: number;
    scenarioCount: number;
    performanceCount: number;
    contradictions: string[];
  };
}

export type EvidenceTier = 
  | 'Strong' 
  | 'Moderate' 
  | 'Emerging' 
  | 'Practitioner-derived' 
  | 'Contested';

export type QuestionType = 
  | 'self_report' 
  | 'scenario' 
  | 'recall' 
  | 'confidence' 
  | 'concept_relationship' 
  | 'application' 
  | 'error_diagnosis' 
  | 'metacognitive'
  | 'mini_performance'
  | 'preference_check';

export interface DiagnosticOption {
  id: string;
  text: string;
  scoreImpact: Record<PlsfrDimensionKey, number>; // Points added or weighted
  diagnosticInsight: string;
  behaviorType?: 'passive' | 'active_retrieval' | 'structured' | 'avoidant' | 'generative';
}

export interface DiagnosticQuestion {
  id: string;
  dimension: PlsfrDimensionKey;
  subDimension: string;
  questionType: QuestionType;
  prompt: string;
  scenarioContext?: string;
  options: DiagnosticOption[];
  correctOptionId?: string; // For performance/recall checks
  explanation: string;
  weight: number;
  evidenceTier?: EvidenceTier;
  citation?: string;
  isMiniPerformance?: boolean;
}

export interface DiagnosticResponse {
  questionId: string;
  selectedOptionId: string;
  confidenceRating?: 1 | 2 | 3 | 4 | 5; // 1: Very unsure, 5: Very confident
  responseTimeSeconds?: number;
  evidenceType: 'declared' | 'observed' | 'performance';
}

export interface DiagnosticContradiction {
  title: string;
  description: string;
  scientificInsight: string;
  citation: string;
}

export interface TargetedInterventionItem {
  rank: number;
  pattern: string;
  interventionName: string;
  targetPillar: PlsfrDimensionKey;
  why: string; // Scientific mechanism with citation
  forWhom: string;
  when: string;
  how: string;
  measure: string; // Concrete verifiable metric
}

export interface DiagnosticReport {
  generatedAt: string;
  reassessmentDate: string;
  overallConfidence: 'Low' | 'Moderate' | 'High';
  executiveSummary: string;
  primaryBottleneck: {
    key: PlsfrDimensionKey;
    name: string;
    score: number;
    confidenceBand: 'Low' | 'Moderate' | 'High';
    rationale: string;
  };
  secondaryBottleneck?: {
    key: PlsfrDimensionKey;
    name: string;
    score: number;
    confidenceBand: 'Low' | 'Moderate' | 'High';
    rationale: string;
  };
  leverageableStrength: {
    key: PlsfrDimensionKey;
    name: string;
    score: number;
    howToLeverage: string;
  };
  contradictionsDetected: DiagnosticContradiction[];
  hiddenCrossPillarPatterns: {
    name: string;
    pillarsInvolved: string[];
    description: string;
    fix: string;
  }[];
  learningStyleDebunkInsight: {
    statedPreference: string;
    evidenceBasedStrategy: string;
    pashlerScienceNote: string;
  };
  priorityInterventions: TargetedInterventionItem[];
  recommendedAIRoles: {
    roleName: string;
    tagline: string;
    whyThisRole: string;
  }[];
  id?: string;
  assessmentId?: string;
  dimensionScoresSnapshot?: PlsfrDimension[];
}

export interface LearnerProfile {
  id: string;
  name: string;
  email: string;
  educationLevel: EducationLevel;
  institution: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  availableHoursPerWeek: number;
  learningContext: string[]; // e.g., 'Hostel study', 'Inconsistent power', 'Mobile phone'
  targetExam?: string; // WAEC, JAMB, University Semesters
  studyContext?: string;
  primaryDevice?: string;
  internetReliability?: string;
  electricityAccess?: string;
}

export type GoalType = 
  | 'academic'
  | 'exam'
  | 'university'
  | 'professional'
  | 'technical'
  | 'creative'
  | 'personal';

export interface LearningGoal {
  id: string;
  title: string;
  domain: string;
  goalType: GoalType;
  description: string;
  targetDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Active' | 'Completed' | 'Paused';
  totalConceptsCount: number;
  masteredConceptsCount: number;
  phases?: LearningPathPhase[];
}

export type ConceptState = 
  | 'New'
  | 'Introduced'
  | 'Processed'
  | 'Retrieved'
  | 'Applied'
  | 'Reinforced'
  | 'Stable';

export type TaskType = 
  | 'Conceptual' 
  | 'Procedural' 
  | 'Quantitative' 
  | 'Applied' 
  | 'Analytical' 
  | 'Creative';

export interface Concept {
  id: string;
  goalId: string;
  title: string;
  domain: string;
  taskType: TaskType;
  state: ConceptState;
  definition: string;
  notes?: string;
  source?: string;
  prerequisites: string[];
  lastReviewedAt?: string;
  nextReviewAt?: string;
  reinforcementIntervalDays: number;
  recallSuccessCount: number;
  recallFailureCount: number;
  applicationSuccessCount: number;
  applicationFailureCount: number;
  lastConfidenceRating?: 1 | 2 | 3 | 4 | 5;
  activeBottleneck?: string;
}

export type RetrievalErrorType = 
  | 'none'
  | 'conceptual_misunderstanding'
  | 'careless_mistake'
  | 'missing_prerequisite'
  | 'formula_recall_failure'
  | 'misreading'
  | 'weak_reasoning'
  | 'incomplete_response';

export interface RetrievalAttempt {
  id: string;
  conceptId: string;
  timestamp: string;
  prompt: string;
  userResponse: string;
  correctAnswer: string;
  isCorrect: boolean;
  confidenceRating: 1 | 2 | 3 | 4 | 5;
  calibrationStatus: 'well_calibrated' | 'overconfident' | 'underconfident';
  errorType: RetrievalErrorType;
  reflectionNote?: string;
}

export interface ApplicationAttempt {
  id: string;
  conceptId: string;
  timestamp: string;
  scenario: string;
  taskPrompt: string;
  userSolution: string;
  isProficient: boolean;
  scorePercentage: number;
  feedbackNotes: string;
  confidenceRating: 1 | 2 | 3 | 4 | 5;
}

export interface LearningReflection {
  id: string;
  timestamp: string;
  sessionType: 'retrieval' | 'application' | 'processing' | 'daily_synthesis';
  whatFeltEasy: string;
  whatFeltUnclear: string;
  mistakeIdentified: string;
  strategyThatHelped: string;
  adjustmentForNextTime: string;
  cognitiveEnergy: 1 | 2 | 3 | 4 | 5;
}

export type EvidenceStatus = 'insufficient' | 'emerging' | 'sufficient';

export type InterventionEvaluationStatus = 
  | 'recommended' 
  | 'active' 
  | 'evaluating' 
  | 'effective' 
  | 'ineffective' 
  | 'adapted' 
  | 'completed';

export interface InterventionSuccessMeasurement {
  baselineMetric: string;
  targetMetric: string;
  evaluationWindow: string; // e.g. "Next 6 retrieval attempts"
  successCondition: string; // e.g. "Achieving >= 70% accuracy across window"
}

export interface InterventionAdaptationRule {
  ifImproved: string;
  ifStillWeak: string;
  ifCalibrationRemainsPoor?: string;
}

export interface Intervention {
  id: string;
  title: string;
  targetDimension: PlsfrDimensionKey;
  targetBottleneck?: string;
  problem: string;
  reason: string;
  action: string;
  frequency: string;
  expectedOutcome: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Practiced' | 'Completed' | 'Dismissed';
  evidenceOrigin: string;
  metricBefore?: string;
  metricAfter?: string;
  successMetric?: string;
  evaluationWindow?: string;
  evaluationLifecycle?: InterventionEvaluationStatus;
  successMeasurement?: InterventionSuccessMeasurement;
  adaptationRule?: InterventionAdaptationRule;
}

export interface AssimilationMetrics {
  capabilityGrowthScore: number | null; // 0-100 operational index or null if no evidence
  retrievalAccuracy: number | null; // 0-100 or null if no attempts
  applicationTransferRate: number | null; // 0-100 or null if no attempts
  confidenceCalibrationRate: number | null; // % well-calibrated or null
  retentionDurability: number | null; // 0-100 or null if no concepts
  overconfidenceIncidents: number; // Count of observed overconfident attempts
  totalConcepts: number;
  masteredConcepts: number;
  strengths: string[];
  bottlenecks: string[];
}

export interface Recommendation {
  id: string;
  type: 'retrieval' | 'application' | 'prerequisite' | 'reflection' | 'workload_reduction';
  title: string;
  reason: string;
  sourceSignal: string;
  actionPrompt: string;
  actionRoute: string;
  priority: 'Critical' | 'High' | 'Medium';
  createdAt: string;
  conceptId?: string;
}

export interface LearningRiskSignal {
  category: 'Attention Stability' | 'Memory Retention' | 'Cognitive Overload' | 'Knowledge Fragmentation' | 'Confidence Calibration' | 'Exam Readiness';
  level: 'Low' | 'Moderate' | 'Elevated';
  summary: string;
  mitigation: string;
}

export type DomainType = 
  | 'Computer Science' 
  | 'Engineering' 
  | 'Mathematics' 
  | 'Natural Sciences' 
  | 'Medical Sciences' 
  | 'Social Sciences' 
  | 'General';

export type InterventionPlanItem = Intervention;

export interface LearningPathPhase {
  id?: string;
  phase: number;
  name: string;
  duration: string;
  focus: string;
  description?: string;
  concepts: string[];
  activities: string[];
  completed?: boolean;
}

export interface LearningStrategyPlan {
  goalId: string;
  title: string;
  rationale: string;
  phases: LearningPathPhase[];
  weeklyHoursBreakdown: string;
  successIndicator: string;
  stuckAction: string;
}

export interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  purpose: string;
  recommendedUse: string;
  plsfrDimension: PlsfrDimensionKey;
}
