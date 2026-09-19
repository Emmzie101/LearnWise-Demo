/**
 * LearnWise Stage 5: Deterministic Personalised Bottleneck Engine
 * 
 * Evidence-First Architecture:
 * The deterministic engine is the authoritative source for:
 * - Bottleneck classification and prioritization
 * - Targeted intervention selection with measurable criteria
 * - Actionable next steps and adaptation rules
 * - Learning strategy plan synthesis
 * 
 * Gemini AI provides enrichment / Socratic framing, NOT core decision logic.
 * Never manufactures evidence or false bottlenecks.
 */

import { 
  PlsfrDimension, 
  PlsfrDimensionKey, 
  DiagnosticReport, 
  LearningGoal, 
  RetrievalAttempt, 
  ApplicationAttempt,
  EvidenceStatus,
  LearningStrategyPlan,
  LearningPathPhase
} from '../types';

export type BottleneckCategory = 
  | 'retrieval' 
  | 'application' 
  | 'self_regulation' 
  | 'knowledge' 
  | 'motivation' 
  | 'environment' 
  | 'performance';

export interface BottleneckItem {
  dimensionKey: PlsfrDimensionKey;
  title: string;
  score: number;
  priority: number; // 1 = highest
  category: BottleneckCategory;
  rationale: string;
  evidence: string[];
}

export interface BottleneckEvidenceSummary {
  overallStatus: EvidenceStatus;
  diagnosticStatus: EvidenceStatus;
  retrievalStatus: EvidenceStatus;
  applicationStatus: EvidenceStatus;
  calibrationStatus: EvidenceStatus;
  retrievalCount: number;
  applicationCount: number;
  confidenceRatedCount: number;
  details: string[];
}

export interface LeverageableStrengthItem {
  dimensionKey: PlsfrDimensionKey;
  title: string;
  score: number;
  rationale: string;
  isEstablished: boolean; // true if score >= 70 && evidenceCount >= 3
}

export interface RecommendedInterventionDetail {
  type: string;
  title: string;
  targetBottleneck?: string;
  category?: BottleneckCategory;
  evidenceOrigin?: string;
  description: string;
  action: string;
  rationale: string;
  frequency: string;
  duration: string;
  expectedOutcome: string;
  successMetric: string;
  evaluationWindow: string;
  baselineMetric?: string;
  targetMetric?: string;
}

export interface AdaptationRuleDetail {
  ifImproved: string;
  ifStillWeak: string;
  ifCalibrationRemainsPoor?: string;
}

export interface PersonalisedBottleneckRecommendation {
  evidenceStatus: EvidenceStatus;
  evidenceSummary: BottleneckEvidenceSummary;
  primaryBottleneck: BottleneckItem | null;
  secondaryBottleneck?: BottleneckItem | null;
  leverageableStrength?: LeverageableStrengthItem | null;
  relativeStrength?: LeverageableStrengthItem | null;
  goalConnection: string;
  recommendedIntervention: RecommendedInterventionDetail;
  adaptationRule: AdaptationRuleDetail;
  nextAction: {
    title: string;
    description: string;
    route: string;
  };
  explainabilityWhy: string[];
}

/**
 * Defensive helper to reliably sort items descending by timestamp and take the top N
 */
export function getRecentAttempts<T extends { timestamp?: string }>(items: T[], count: number): T[] {
  return [...items].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  }).slice(0, count);
}

/**
 * Classifies dimension into standard bottleneck category
 */
export function classifyBottleneckCategory(key: PlsfrDimensionKey): BottleneckCategory {
  switch (key) {
    case 'knowledge_acquisition':
      return 'retrieval';
    case 'performance_optimization':
      return 'application';
    case 'self_regulation':
      return 'self_regulation';
    case 'cognitive_processing':
    case 'knowledge_organization':
      return 'knowledge';
    case 'motivation_emotion_identity':
      return 'motivation';
    case 'environment_behavior':
      return 'environment';
    default:
      return 'retrieval';
  }
}

/**
 * Deterministically computes evidence status across all observation sources
 */
export function computeEvidenceStatus(params: {
  dimensions: PlsfrDimension[];
  diagnosticReport?: DiagnosticReport | null;
  retrievalAttempts?: RetrievalAttempt[];
  applicationAttempts?: ApplicationAttempt[];
}): BottleneckEvidenceSummary {
  const { 
    dimensions, 
    diagnosticReport, 
    retrievalAttempts = [], 
    applicationAttempts = [] 
  } = params;

  // 1. Diagnostic Evidence Status
  let diagnosticStatus: EvidenceStatus = 'insufficient';
  const hasDimensions = dimensions && dimensions.length > 0;
  const totalEvidenceCount = hasDimensions ? dimensions.reduce((acc, d) => acc + (d.evidenceCount || 0), 0) : 0;

  if (diagnosticReport?.assessmentId || totalEvidenceCount >= 14) {
    diagnosticStatus = 'sufficient';
  } else if (totalEvidenceCount >= 3) {
    diagnosticStatus = 'emerging';
  } else {
    diagnosticStatus = 'insufficient';
  }

  // 2. Retrieval Practice Status
  const retrievalCount = retrievalAttempts.length;
  let retrievalStatus: EvidenceStatus = 'insufficient';
  if (retrievalCount >= 6) {
    retrievalStatus = 'sufficient';
  } else if (retrievalCount >= 3) {
    retrievalStatus = 'emerging';
  } else {
    retrievalStatus = 'insufficient';
  }

  // 3. Application Practice Status
  const applicationCount = applicationAttempts.length;
  let applicationStatus: EvidenceStatus = 'insufficient';
  if (applicationCount >= 4) {
    applicationStatus = 'sufficient';
  } else if (applicationCount >= 2) {
    applicationStatus = 'emerging';
  } else {
    applicationStatus = 'insufficient';
  }

  // 4. Calibration Status (confidence-rated retrievals)
  const confidenceRatedCount = retrievalAttempts.filter(r => r.confidenceRating !== undefined && r.confidenceRating !== null).length;
  let calibrationStatus: EvidenceStatus = 'insufficient';
  if (confidenceRatedCount >= 6) {
    calibrationStatus = 'sufficient';
  } else if (confidenceRatedCount >= 3) {
    calibrationStatus = 'emerging';
  } else {
    calibrationStatus = 'insufficient';
  }

  // 5. Overall Evidence Status
  let overallStatus: EvidenceStatus = 'insufficient';
  if (diagnosticStatus === 'sufficient' || (retrievalStatus === 'sufficient' && applicationStatus === 'sufficient')) {
    overallStatus = 'sufficient';
  } else if (diagnosticStatus === 'emerging' || retrievalStatus === 'emerging' || applicationStatus === 'emerging') {
    overallStatus = 'emerging';
  } else {
    overallStatus = 'insufficient';
  }

  const details: string[] = [];
  if (diagnosticStatus === 'insufficient') {
    details.push('Diagnostic baseline unestablished (requires completed PLSFR+ diagnostic).');
  } else if (diagnosticStatus === 'emerging') {
    details.push('Partial diagnostic evidence observed.');
  } else {
    details.push('Validated PLSFR+ diagnostic baseline established.');
  }

  details.push(`Retrieval attempts: ${retrievalCount} (${retrievalStatus}).`);
  details.push(`Application attempts: ${applicationCount} (${applicationStatus}).`);
  details.push(`Confidence ratings: ${confidenceRatedCount} (${calibrationStatus}).`);

  return {
    overallStatus,
    diagnosticStatus,
    retrievalStatus,
    applicationStatus,
    calibrationStatus,
    retrievalCount,
    applicationCount,
    confidenceRatedCount,
    details,
  };
}

/**
 * Deterministically generates goal-specific connection rationale
 */
export function generateGoalSpecificConnection(
  goal: LearningGoal | null | undefined, 
  bottleneckTitle: string,
  category: BottleneckCategory
): string {
  if (!goal) {
    return `Resolving your bottleneck in ${bottleneckTitle} provides the highest multiplier across all your learning activities.`;
  }

  const goalType = goal.goalType || 'academic';

  switch (goalType) {
    case 'exam':
      if (category === 'retrieval') {
        return `Under timed exam conditions for "${goal.title}", weak retrieval causes the fluency illusion to collapse into formula lapses and memory blanks. Resolving ${bottleneckTitle} ensures fast, reliable recall of key definitions and theorems without reliance on open notes.`;
      }
      if (category === 'application') {
        return `For your exam goal "${goal.title}", past questions alter surface framing to test true understanding. Weak application means you can recall formulas but freeze when questions combine multi-step constraints or deviate from textbook phrasing.`;
      }
      if (category === 'self_regulation') {
        return `In high-stakes exams like "${goal.title}", miscalibrated confidence causes you to rush through flawed solutions believing they are correct, abandoning time that should be spent verifying edge cases.`;
      }
      return `For your exam goal "${goal.title}", resolving ${bottleneckTitle} directly prevents retrieval failures, formula lapses, and panic under strict examination time limits.`;

    case 'technical':
      if (category === 'application') {
        return `For technical mastery in "${goal.title}", memorizing definitions is insufficient; you must diagnose problem invariants, handle boundary conditions, and debug edge cases autonomously without copy-pasting tutorial solutions.`;
      }
      if (category === 'retrieval') {
        return `In technical programming and problem-solving for "${goal.title}", missing foundational recall forces constant syntax lookups, causing cognitive thrashing and breaking working-memory focus during algorithm implementation.`;
      }
      if (category === 'knowledge') {
        return `For your technical goal "${goal.title}", fragmented knowledge schemas prevent you from recognizing reusable architectural patterns, resulting in fragile and brittle implementations.`;
      }
      return `For your technical goal "${goal.title}", resolving ${bottleneckTitle} is critical for autonomous implementation, debugging, and transfer without falling back to tutorial-dependence.`;

    case 'academic':
    case 'university':
      if (category === 'knowledge') {
        return `In academic coursework for "${goal.title}", fragmented knowledge causes compounding gaps: subsequent advanced lectures assume integrated schemas, leading to cumulative confusion as the syllabus advances.`;
      }
      if (category === 'retrieval') {
        return `For your academic course goal "${goal.title}", resolving ${bottleneckTitle} ensures you build durable mental schemas that resist rapid forgetting between weekly lectures and midterm assessments.`;
      }
      return `For your university syllabus goal "${goal.title}", resolving ${bottleneckTitle} helps you manage high-volume lecture density and continuous assessments without relying on last-minute cramming.`;

    case 'professional':
      if (category === 'self_regulation') {
        return `For your professional goal "${goal.title}", without structured metacognitive calibration, superficial skimming and fluency illusions create unverified confidence that breaks down under real-world workplace demands.`;
      }
      return `For your professional goal "${goal.title}", resolving ${bottleneckTitle} enables rapid on-the-job decision-making and operational execution under real-world workplace constraints.`;

    case 'creative':
      return `For your creative goal "${goal.title}", resolving ${bottleneckTitle} supports deliberate iteration, generative experimentation, and structural translation of concepts into authentic output.`;

    case 'personal':
      return `For your personal goal "${goal.title}", resolving ${bottleneckTitle} establishes habit consistency, metacognitive self-regulation, and regular deliberate practice.`;

    default:
      return `For "${goal.title}" in ${goal.domain}, resolving ${bottleneckTitle} directly accelerates concept mastery and operational execution.`;
  }
}

/**
 * Deterministically evaluates the learner's personalized bottleneck
 * Does NOT manufacture fake dimensions or false certainty.
 */
export function evaluatePersonalisedBottleneck(params: {
  dimensions: PlsfrDimension[];
  diagnosticReport?: DiagnosticReport | null;
  goal?: LearningGoal | null;
  retrievalAttempts?: RetrievalAttempt[];
  applicationAttempts?: ApplicationAttempt[];
}): PersonalisedBottleneckRecommendation {
  const { 
    dimensions = [], 
    diagnosticReport = null, 
    goal = null, 
    retrievalAttempts = [], 
    applicationAttempts = [] 
  } = params;

  // 1. Evaluate Evidence Status
  const evidenceSummary = computeEvidenceStatus({
    dimensions,
    diagnosticReport,
    retrievalAttempts,
    applicationAttempts,
  });

  // 2. If evidence is INSUFFICIENT, return explicit unestablished baseline result
  if (evidenceSummary.overallStatus === 'insufficient') {
    const goalConn = goal 
      ? `For your goal "${goal.title}", complete the diagnostic and enough practice attempts to establish a reliable learning pattern.`
      : 'Complete the diagnostic and enough practice attempts to establish a reliable learning pattern.';

    return {
      evidenceStatus: 'insufficient',
      evidenceSummary,
      primaryBottleneck: null,
      secondaryBottleneck: null,
      leverageableStrength: null,
      relativeStrength: null,
      goalConnection: goalConn,
      recommendedIntervention: {
        type: 'prerequisite',
        title: 'Establish Learning-System Baseline (PLS-IP 0)',
        description: 'Complete the evidence-based PLSFR+ diagnostic assessment to evaluate cognitive processing, retrieval stability, and self-regulation.',
        action: 'Take the 15-minute diagnostic assessment to establish your validated 7-dimension baseline profile.',
        rationale: 'Evidence-based adaptation requires baseline observation. Proceeding without baseline data creates speculative recommendations.',
        frequency: 'Once at the beginning of each learning cycle.',
        duration: '15 minutes',
        expectedOutcome: 'Calibrated baseline scores across 7 PLSFR+ learning dimensions.',
        successMetric: 'Complete diagnostic report generated with confidence band ratings.',
        evaluationWindow: 'Baseline diagnostic completion',
      },
      adaptationRule: {
        ifImproved: 'Once baseline is established, target the identified primary bottleneck with specific deliberate practice.',
        ifStillWeak: 'If the diagnostic cannot be completed immediately, log at least 3 retrieval drills to generate preliminary telemetry.',
        ifCalibrationRemainsPoor: 'Submit confidence ratings with every practice attempt to establish metacognitive calibration.',
      },
      nextAction: {
        title: 'Complete PLSFR+ Diagnostic',
        description: 'Take the evidence-based diagnostic to establish your learning baseline.',
        route: '/app/diagnostic',
      },
      explainabilityWhy: [
        'There is not yet enough learner evidence to identify a stable bottleneck.',
        ...evidenceSummary.details,
      ],
    };
  }

  // Filter dimensions that have real score records
  const validDims = dimensions.filter(d => d.score > 0);
  const dimsToEvaluate = validDims.length > 0 ? validDims : dimensions;

  // 3. Calculate observed telemetry signals (using recent window to prevent stale data bias)
  const recentRetrievalsForAccuracy = getRecentAttempts(retrievalAttempts, 10);
  const totalRetrievals = recentRetrievalsForAccuracy.length;
  const correctRetrievals = recentRetrievalsForAccuracy.filter(r => r.isCorrect).length;
  const retrievalAccuracy = totalRetrievals >= 3 ? (correctRetrievals / totalRetrievals) * 100 : null;

  const recentAppsForProficiency = getRecentAttempts(applicationAttempts, 10);
  const totalApps = recentAppsForProficiency.length;
  const proficientApps = recentAppsForProficiency.filter(a => a.isProficient).length;
  const applicationProficiency = totalApps >= 2 ? (proficientApps / totalApps) * 100 : null;

  // Recent overconfidence check using actual most recent attempts
  const recentRetrievals = getRecentAttempts(retrievalAttempts, 3);
  const recentConfidenceRated = recentRetrievals.filter(r => r.confidenceRating !== undefined && r.confidenceRating !== null);
  const recentOverconfidentCount = recentConfidenceRated.filter(r => r.calibrationStatus === 'overconfident').length;
  const hasOverconfidenceSignal = recentConfidenceRated.length === 3 && recentOverconfidentCount >= 2;

  // 4. Score each candidate dimension for bottleneck priority
  const scoredCandidates = dimsToEvaluate.map(d => {
    let priorityScore = (100 - d.score) * 1.0;
    const evidenceList: string[] = [];

    evidenceList.push(`Baseline PLSFR+ score: ${d.score}/100 (${d.strengthLevel || 'Emerging'}).`);

    if (d.confidenceBand === 'High') {
      priorityScore += 15;
      evidenceList.push('High triangulated diagnostic confidence.');
    } else if (d.confidenceBand === 'Moderate') {
      priorityScore += 8;
    }

    // Diagnostic report contradictions check
    if (diagnosticReport?.contradictionsDetected) {
      const hasContradiction = diagnosticReport.contradictionsDetected.some(c => {
        if (d.key === 'knowledge_acquisition' && c.title.toLowerCase().includes('recognition')) return true;
        if (d.key === 'self_regulation' && c.title.toLowerCase().includes('fluency')) return true;
        if (d.key === 'environment_behavior' && c.title.toLowerCase().includes('intention')) return true;
        return false;
      });

      if (hasContradiction) {
        priorityScore += 20;
        evidenceList.push('Diagnostic contradiction detected: passive recognition or intention-action friction.');
      }
    }

    // Telemetry adjustments with evidence thresholds
    if (d.key === 'knowledge_acquisition' && retrievalAccuracy !== null && retrievalAccuracy < 60) {
      priorityScore += 25;
      evidenceList.push(`Live retrieval telemetry shows ${Math.round(retrievalAccuracy)}% accuracy across ${totalRetrievals} attempts (below 60% threshold).`);
    }

    if (d.key === 'performance_optimization' && retrievalAccuracy !== null && applicationProficiency !== null) {
      if (retrievalAccuracy >= 70 && applicationProficiency < 55) {
        priorityScore += 30;
        evidenceList.push(`Transfer gap: strong recall (${Math.round(retrievalAccuracy)}%) but lagging novel application (${Math.round(applicationProficiency)}% across ${totalApps} challenges).`);
      }
    }

    if (d.key === 'self_regulation' && hasOverconfidenceSignal) {
      priorityScore += 20;
      evidenceList.push(`Metacognitive bias: ${recentOverconfidentCount} of the 3 most recent attempts showed high confidence despite incorrect recall.`);
    }

    // Goal relevance weighting
    if (goal) {
      const isExam = goal.goalType === 'exam' || /exam|jamb|waec|test|finals|certification/i.test(goal.title);
      const isTechnical = /code|programming|cs|math|algorithm|engineering/i.test(goal.title) || goal.domain === 'Computer Science' || goal.domain === 'Mathematics';
      
      if (isExam && (d.key === 'knowledge_acquisition' || d.key === 'performance_optimization')) {
        priorityScore += 15;
        evidenceList.push(`High leverage for exam goal "${goal.title}" requiring closed-book precision.`);
      }

      if (isTechnical && (d.key === 'cognitive_processing' || d.key === 'knowledge_organization')) {
        priorityScore += 15;
        evidenceList.push(`Prerequisite structure and chunking are critical for technical goal "${goal.title}".`);
      }
    }

    return {
      dimension: d,
      priorityScore,
      evidenceList,
    };
  });

  // Sort descending by priorityScore
  scoredCandidates.sort((a, b) => b.priorityScore - a.priorityScore);

  const primaryCandidate = scoredCandidates[0] || {
    dimension: dimsToEvaluate[0],
    priorityScore: 50,
    evidenceList: ['Preliminary evaluation.'],
  };

  const secondaryCandidate = scoredCandidates[1];

  // 5. Qualify Leverageable Strength (Part 5)
  // An established leverageable strength requires: score >= 70 AND evidenceCount >= 3 (or diagnosticReport present)
  const sortedByRawScore = [...dimsToEvaluate].sort((a, b) => b.score - a.score);
  const highestDim = sortedByRawScore[0];

  let leverageableStrength: LeverageableStrengthItem | null = null;
  let relativeStrength: LeverageableStrengthItem | null = null;

  if (highestDim) {
    const isEstablished = highestDim.score >= 70 && ((highestDim.evidenceCount || 0) >= 3 || diagnosticReport !== null);
    const strengthItem: LeverageableStrengthItem = {
      dimensionKey: highestDim.key,
      title: highestDim.name,
      score: highestDim.score,
      rationale: isEstablished
        ? `Your strong baseline in ${highestDim.name} (${highestDim.score}/100) provides the cognitive stability to anchor new deliberate practice protocols.`
        : `Highest observed relative score (${highestDim.score}/100 in ${highestDim.name}), but currently below the threshold (>= 70/100 with verified evidence) for an established strength.`,
      isEstablished,
    };

    if (isEstablished) {
      leverageableStrength = strengthItem;
    } else {
      relativeStrength = strengthItem;
    }
  }

  const primaryCategory = classifyBottleneckCategory(primaryCandidate.dimension.key);
  const secondaryCategory = secondaryCandidate ? classifyBottleneckCategory(secondaryCandidate.dimension.key) : undefined;

  // 6. Structured Interventions & Adaptation Rules (Part 7 & Part 8)
  let interventionDetail: RecommendedInterventionDetail;
  let adaptationRule: AdaptationRuleDetail;
  let nextAction = {
    title: 'Practice Active Retrieval Drill',
    description: 'Test your recall on key concept definitions without looking at notes.',
    route: '/app/retrieve',
  };

  switch (primaryCategory) {
    case 'application':
      interventionDetail = {
        type: 'application',
        title: 'Interleaved Scenario Application Challenge (PLS-IP 2)',
        targetBottleneck: primaryCandidate.dimension.name,
        category: primaryCategory,
        evidenceOrigin: primaryCandidate.evidenceList[0] || 'Application Telemetry Observation',
        description: 'Solve varied problem scenarios where the governing principle must be diagnosed rather than given in advance.',
        action: 'Attempt an authentic scenario challenge and articulate which concept invariant solves the constraint.',
        rationale: 'Interleaved transfer challenges train your brain to discriminate structural schemas in novel contexts (Rohrer & Taylor, 2007).',
        frequency: '2 to 3 novel scenario challenges per week.',
        duration: '20-25 minutes per challenge',
        expectedOutcome: 'Proficient solution of unfamiliar past exam and real-world questions without hints.',
        baselineMetric: applicationProficiency !== null ? `${Math.round(applicationProficiency)}% proficiency` : `${primaryCandidate.dimension.score}/100 baseline`,
        targetMetric: '>=70% proficiency across the evaluation window',
        successMetric: '>=70% proficiency across the evaluation window.',
        evaluationWindow: 'Next 4 application challenges',
      };
      adaptationRule = {
        ifImproved: 'If application proficiency reaches >=75% across 4 attempts, progress to cumulative timed simulations.',
        ifStillWeak: 'If proficiency remains <55%, step down transfer distance and practice near-transfer invariant pairs before far-transfer.',
        ifCalibrationRemainsPoor: 'Categorize errors into invariant misidentification vs arithmetic/syntax slips.',
      };
      nextAction = {
        title: 'Start Scenario Application Challenge',
        description: 'Apply concepts in realistic, constraint-driven practice scenarios.',
        route: '/app/apply',
      };
      break;

    case 'self_regulation':
      interventionDetail = {
        type: 'reflection',
        title: 'Confidence Pre-Rating & Error Taxonomy (PLS-IP 4)',
        targetBottleneck: primaryCandidate.dimension.name,
        category: primaryCategory,
        evidenceOrigin: primaryCandidate.evidenceList[0] || 'Metacognitive Calibration Analysis',
        description: 'Rate your 1-5 confidence before checking any answer. Categorize every mistake into Concept Gap, Misreading, or Slip.',
        action: 'Commit a confidence rating before viewing solutions; classify every error honestly.',
        rationale: 'Forcing confidence predictions recalibrates metacognitive accuracy and eliminates the fluency illusion (Bjork et al., 2013).',
        frequency: 'Before every practice quiz and problem set.',
        duration: '2-3 minutes per attempt',
        expectedOutcome: 'Alignment between predicted confidence and observed correctness; elimination of overconfidence bias.',
        baselineMetric: 'Overconfidence bias observed on recent attempts',
        targetMetric: 'Fewer than 1 overconfident error in the next 5 confidence-rated attempts',
        successMetric: 'Fewer than 1 overconfident error in the next 5 confidence-rated attempts.',
        evaluationWindow: 'Next 5 confidence-rated attempts',
      };
      adaptationRule = {
        ifImproved: 'If calibration error drops to 0 across 5 attempts, transition from metacognitive drills to accelerated retrieval.',
        ifStillWeak: 'If overconfidence persists, enforce mandatory closed-book self-explanation before any answer is confirmed.',
      };
      nextAction = {
        title: 'Calibrate Confidence in Retrieval',
        description: 'Submit a retrieval attempt and classify any mistakes honestly.',
        route: '/app/retrieve',
      };
      break;

    case 'knowledge':
      interventionDetail = {
        type: 'prerequisite',
        title: 'Prerequisite Decomposition & Concept Chunking (PLS-IP 3)',
        targetBottleneck: primaryCandidate.dimension.name,
        category: primaryCategory,
        evidenceOrigin: primaryCandidate.evidenceList[0] || 'Knowledge Organization Assessment',
        description: 'Deconstruct complex multi-step topics into invariant foundational rules before tackling compound problems.',
        action: 'Identify and verify all prerequisite schemas before tackling compound problem sets.',
        rationale: 'Reduces extraneous cognitive load and frees working memory bandwidth for higher-order reasoning (Sweller, 1988).',
        frequency: 'At the start of every new module or complex chapter.',
        duration: '20 minutes per module',
        expectedOutcome: 'Seamless transition from prerequisite understanding to multi-step problem solving.',
        baselineMetric: `${primaryCandidate.dimension.score}/100 schema organization score`,
        targetMetric: '100% prerequisite schema validation across next 3 modules',
        successMetric: 'Verification of all prerequisite invariants on first attempt without consulting external notes.',
        evaluationWindow: 'Next 3 concept ingests',
      };
      adaptationRule = {
        ifImproved: 'Once prerequisite schemas are verified, proceed immediately to interleaved application challenges.',
        ifStillWeak: 'If prerequisite gaps persist, break schemas down into single-clause boundary invariants.',
      };
      nextAction = {
        title: 'Map Prerequisite Concepts',
        description: 'Define foundational primitives in your Goals & Paths view.',
        route: '/app/goals',
      };
      break;

    case 'environment':
      interventionDetail = {
        type: 'workload_reduction',
        title: 'Distraction-Shielded Implementation Intentions (PLS-IP 6)',
        targetBottleneck: primaryCandidate.dimension.name,
        category: primaryCategory,
        evidenceOrigin: primaryCandidate.evidenceList[0] || 'Environment & Behavior Signal',
        description: 'Set explicit "When [Trigger], Then [Action]" routines. Pre-download materials and study offline.',
        action: 'Set specific environmental study cues and eliminate phone notifications during 50-minute study blocks.',
        rationale: 'Environmental constraints automate study triggers without depleting daily willpower reserves (Gollwitzer, 1999).',
        frequency: 'Daily at your designated study time.',
        duration: '5 minutes setup per block',
        expectedOutcome: '>=85% planned study session completion rate without distraction breaks.',
        baselineMetric: '<70% scheduled session completion',
        targetMetric: '>=85% planned study session completion rate across 14 consecutive days',
        successMetric: '>=85% planned study session completion rate across 14 consecutive days.',
        evaluationWindow: 'Next 7 calendar days',
      };
      adaptationRule = {
        ifImproved: 'If study consistency reaches >=85%, expand deliberate practice session length by 15 minutes.',
        ifStillWeak: 'If sessions are missed, shorten study blocks to 25 minutes and anchor them to an immovable daily routine.',
      };
      nextAction = {
        title: 'Review Intervention Protocols',
        description: 'Activate your environmental study trigger protocol in Interventions.',
        route: '/app/interventions',
      };
      break;

    case 'retrieval':
    default:
      interventionDetail = {
        type: 'retrieval',
        title: 'Closed-Book Free Recall Protocol (PLS-IP 1)',
        targetBottleneck: primaryCandidate.dimension.name,
        category: primaryCategory,
        evidenceOrigin: primaryCandidate.evidenceList[0] || 'Retrieval Practice Observation',
        description: 'Shift from passive highlighting and re-reading to immediate closed-book reconstructive recall.',
        action: 'Close notes immediately after reading a section; write out key mechanisms from memory before checking.',
        rationale: 'Active retrieval strengthens synaptic pathways and eliminates the recognition illusion (Roediger & Karpicke, 2006).',
        frequency: 'First 10 minutes of every study block before opening notes.',
        duration: '10-15 minutes per session',
        expectedOutcome: '>75% accuracy on delayed closed-book retention tests.',
        baselineMetric: retrievalAccuracy !== null ? `${Math.round(retrievalAccuracy)}% accuracy` : `${primaryCandidate.dimension.score}/100 baseline`,
        targetMetric: '>=70% accuracy on closed-book retrieval checks across 6 attempts',
        successMetric: '>=70% accuracy on closed-book retrieval checks across the evaluation window.',
        evaluationWindow: 'Next 6 retrieval attempts',
      };
      adaptationRule = {
        ifImproved: 'If retrieval accuracy reaches >=75% across 6 attempts, increase emphasis on interleaved contextual application.',
        ifStillWeak: 'If accuracy remains <60% after 6 attempts, decompose concepts into smaller prerequisite chunks.',
        ifCalibrationRemainsPoor: 'Enforce explicit confidence ratings before answer reveals to expose hidden fluency illusions.',
      };
      nextAction = {
        title: 'Practice Active Retrieval Drill',
        description: 'Test your recall on key concept definitions without looking at notes.',
        route: '/app/retrieve',
      };
      break;
  }

  // 7. Goal Connection (Part 6)
  const goalConnection = generateGoalSpecificConnection(goal, primaryCandidate.dimension.name, primaryCategory);

  // 8. Explainability Why
  const certaintyLabel = evidenceSummary.overallStatus === 'sufficient' ? 'Validated' : 'Emerging Signal';
  const explainabilityWhy = [
    `PLSFR+ Score: ${primaryCandidate.dimension.score}/100 in ${primaryCandidate.dimension.name} (${certaintyLabel}).`,
    ...primaryCandidate.evidenceList.slice(0, 3),
    goalConnection,
  ];

  return {
    evidenceStatus: evidenceSummary.overallStatus,
    evidenceSummary,
    primaryBottleneck: {
      dimensionKey: primaryCandidate.dimension.key,
      title: primaryCandidate.dimension.name,
      score: primaryCandidate.dimension.score,
      priority: 1,
      category: primaryCategory,
      rationale: `${certaintyLabel}: ${primaryCandidate.dimension.name} (${primaryCandidate.dimension.score}/100) represents the primary constraint on your learning efficiency. Addressing this yields the greatest retention gains.`,
      evidence: primaryCandidate.evidenceList,
    },
    secondaryBottleneck: secondaryCandidate ? {
      dimensionKey: secondaryCandidate.dimension.key,
      title: secondaryCandidate.dimension.name,
      score: secondaryCandidate.dimension.score,
      priority: 2,
      category: secondaryCategory || 'application',
      rationale: `Secondary constraint (${secondaryCandidate.dimension.score}/100) interacting directly with your primary bottleneck.`,
      evidence: secondaryCandidate.evidenceList,
    } : undefined,
    leverageableStrength,
    relativeStrength,
    goalConnection,
    recommendedIntervention: interventionDetail,
    adaptationRule,
    nextAction,
    explainabilityWhy,
  };
}

/**
 * Deterministically generates an Adaptive Strategy Plan for a Goal (Part 9)
 * Emphasis and phase allocation vary based on the primary bottleneck category.
 */
export function generateDeterministicStrategyPlan(params: {
  goal: LearningGoal;
  primaryBottleneck: BottleneckItem;
  secondaryBottleneck?: BottleneckItem;
  strength?: { dimensionKey: PlsfrDimensionKey; title: string; score: number };
}): LearningStrategyPlan {
  const { goal, primaryBottleneck, secondaryBottleneck, strength } = params;

  const category = primaryBottleneck.category;
  const strengthTitle = strength?.title || 'Cognitive Processing';
  const strengthScore = strength?.score || 70;

  // Title and Rationale
  const strategyTitle = `Adaptive Mastery Protocol for ${goal.title}`;
  const rationale = `Tailored for ${goal.domain} (${goal.goalType || 'academic'} track). Specifically targets primary bottleneck in ${primaryBottleneck.title} (${primaryBottleneck.score}/100) while anchoring to your strength in ${strengthTitle} (${strengthScore}/100). Focuses on evidence-based deliberate practice rather than passive re-reading.`;

  // Bottleneck-specific weekly hours breakdown and phased emphasis (Part 9 & 14)
  let weeklyHoursBreakdown = '';
  let whatToStop = '';
  let whatToPractise = '';
  let successIndicator = '';
  let stuckAction = '';
  let phases: LearningPathPhase[] = [];

  const isTechnical = goal.goalType === 'technical' || /code|programming|cs|software|algorithm/i.test(goal.title);
  const isProfessional = goal.goalType === 'professional';
  const isCreative = goal.goalType === 'creative';

  switch (category) {
    case 'retrieval':
      weeklyHoursBreakdown = '6 hours/week allocated: 45% Closed-Book Retrieval, 25% Contextual Application, 20% Prerequisite Encoding, 10% Metacognitive Reflection.';
      whatToStop = isTechnical
        ? 'Stop looking up syntax and code solutions before attempting to write algorithms from memory.'
        : isProfessional
        ? 'Stop skimming procedural reference manuals without active rehearsal of operational workflows.'
        : isCreative
        ? 'Stop passive reference collection without closed-book reconstruction of core structural motifs.'
        : 'Stop passive re-reading and linear textbook highlighting. Re-reading creates a fluency illusion that collapses under exam pressure.';
      whatToPractise = isTechnical
        ? 'Practise blank-editor algorithmic implementation of invariant primitives within 24 hours of exposure.'
        : 'Practise closed-book blank-page reconstruction within 24 hours of exposure, followed by spaced flash recall.';
      successIndicator = `Achieving >=75% closed-book recall on unprompted concept sprints across 3 consecutive sessions, eliminating recognition reliance for ${goal.title}.`;
      stuckAction = 'Trigger the Active Recall Recovery drill or use the Socratic Feynman prompt in the AI Suite to isolate the missing invariant before consulting notes.';
      phases = [
        {
          id: 'p1',
          phase: 1,
          name: 'Phase 1: Invariant Schemas & Boundary Rules',
          duration: 'Week 1-2',
          focus: `Prerequisite definition and boundary invariants for ${goal.title}`,
          description: `Define fundamental concepts in your own words. ${whatToStop}`,
          concepts: ['Foundational Definitions & Invariants', 'Prerequisite Map', 'Core Constraints'],
          activities: ['Own-words summarization', 'Prerequisite audit', 'Closed-book baseline check'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          name: 'Phase 2: High-Density Closed-Book Free Recall',
          duration: 'Week 3-4',
          focus: `Eliminate recognition illusions through active retrieval targeting ${primaryBottleneck.title}`,
          description: `${whatToPractise} Enforce 5-minute blank-page recall before consulting reference notes.`,
          concepts: ['Mechanics Walkthrough', 'Common Misconceptions', 'Self-Explanation Tracing'],
          activities: ['Spaced retrieval sprints', 'Error taxonomy classification', 'Confidence calibration'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          name: 'Phase 3: Contextual Application & Interleaved Practice',
          duration: 'Week 5-6',
          focus: 'Deploy retrieved schemas in unfamiliar scenarios and problem sets',
          description: 'Practice application challenges with varied constraints to prevent rigid memory.',
          concepts: ['Scenario Simulation 1', 'Scenario Simulation 2', 'Trade-off Analysis'],
          activities: ['Interleaved question sets', 'Far-transfer scenario challenge', 'Edge-case diagnosis'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          name: 'Phase 4: Spaced Consolidation & Retrieval Durability',
          duration: 'Ongoing',
          focus: 'Distributed multi-interval reinforcement along forgetting curves',
          description: 'Systematic review sprints to establish permanent long-term retention.',
          concepts: ['Timed Simulation', 'Cumulative Synthesis', 'System Audit'],
          activities: ['Mixed retrieval sprints', 'Cumulative past-paper test', 'Self-regulation review'],
          completed: false,
        },
      ];
      break;

    case 'application':
      weeklyHoursBreakdown = '6 hours/week allocated: 45% Interleaved Application Challenges, 25% Closed-Book Retrieval, 20% Prerequisite Encoding, 10% Metacognitive Reflection.';
      whatToStop = 'Stop solving 10 identical formula problems in a row. Blocked practice gives false confidence without teaching problem-type discrimination.';
      whatToPractise = 'Practise interleaved scenario challenges where different problem types are mixed together without advance formula labels.';
      successIndicator = `Achieving >=70% proficiency on novel scenario challenges for ${goal.title} without formula hints, with accurate constraint diagnosis on first attempt.`;
      stuckAction = 'Use the Counterexample / Constraint Variation prompt in the AI Suite to isolate why the invariant does not map to the scenario.';
      phases = [
        {
          id: 'p1',
          phase: 1,
          name: 'Phase 1: Invariant Identification & Discrimination',
          duration: 'Week 1-2',
          focus: `Concept invariant identification and problem feature recognition for ${goal.title}`,
          description: `Identify which mathematical or conceptual invariants govern each problem type. ${whatToStop}`,
          concepts: ['Invariant Rules', 'Feature Recognition Guide', 'Near-Miss Case Comparisons'],
          activities: ['Problem classification without solving', 'Invariant extraction', 'Surface vs deep structure analysis'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          name: 'Phase 2: Near-Transfer Scenarios & Guided Problem Solving',
          duration: 'Week 3-4',
          focus: 'Apply invariants to familiar scenarios with constraint variations',
          description: 'Solve near-transfer problem pairs with structured self-explanation prompts.',
          concepts: ['Near-Transfer Scenarios', 'Step-by-Step Constraint Diagnosis', 'Error Correction Protocols'],
          activities: ['Near-transfer problem solving', 'Feynman explanation of solution steps', 'Constraint audit'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          name: 'Phase 3: Interleaved Multi-Context Far-Transfer',
          duration: 'Week 5-6',
          focus: 'Deploy principles in novel, unfamiliar scenarios and authentic exam past-questions',
          description: `${whatToPractise} Enforce problem diagnosis before formula selection.`,
          concepts: ['Far-Transfer Scenario 1', 'Far-Transfer Scenario 2', 'Unseen Exam Case Challenges'],
          activities: ['Interleaved challenge sets', 'Edge-case boundary testing', 'Authentic exam simulation'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          name: 'Phase 4: Autonomous Transfer Stability & Simulation',
          duration: 'Ongoing',
          focus: 'Timed full-context simulation under examination constraints',
          description: 'Multi-topic timed challenges with zero scaffolding or hints.',
          concepts: ['Full Exam Simulation', 'Cumulative Interleaved Challenge', 'Transfer Review'],
          activities: ['Timed exam blocks', 'Post-test error taxonomy', 'Application maintenance sprints'],
          completed: false,
        },
      ];
      break;

    case 'self_regulation':
      weeklyHoursBreakdown = '6 hours/week allocated: 30% Closed-Book Retrieval, 25% Contextual Application, 25% Metacognitive Calibration & Reflection, 20% Prerequisite Planning.';
      whatToStop = 'Stop checking answers immediately without first predicting your confidence rating and committing to your written answer.';
      whatToPractise = 'Practise 1-5 confidence pre-ratings on every attempt and classify every error into Concept Gap, Misreading, or Slip.';
      successIndicator = `Zero overconfidence incidents across 5 consecutive practice sessions with >=80% metacognitive calibration alignment between predicted confidence and actual accuracy.`;
      stuckAction = 'Execute the Error Taxonomy rubric to classify the exact failure mode (Concept Gap, Misreading, or Slip) before re-attempting.';
      phases = [
        {
          id: 'p1',
          phase: 1,
          name: 'Phase 1: Planning, Scaffolding & Implementation Intentions',
          duration: 'Week 1-2',
          focus: `Establish explicit study routines and study intention triggers for ${goal.title}`,
          description: `Define explicit "When [Time/Trigger], Then [Action]" commitments. ${whatToStop}`,
          concepts: ['Implementation Intentions', 'Syllabus Milestone Map', 'Study Trigger Anchors'],
          activities: ['Weekly study schedule mapping', 'Goal decomposition', 'Metacognitive baseline reflection'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          name: 'Phase 2: Confidence-Calibrated Retrieval Practice',
          duration: 'Week 3-4',
          focus: 'Dismantle fluency illusions via forced confidence pre-commitments',
          description: `${whatToPractise} Track calibration accuracy on every answer reveal.`,
          concepts: ['Confidence Rating Protocol', 'Fluency Illusion Checks', 'Pre-Answer Predictions'],
          activities: ['Confidence-rated retrieval drills', 'Error taxonomy logging', 'Overconfidence audit'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          name: 'Phase 3: Monitored Problem Solving & Error Deconstruction',
          duration: 'Week 5-6',
          focus: 'Self-regulated problem solving with reflective pause points',
          description: 'Solve multi-step problems with structured error deconstruction at every stuck point.',
          concepts: ['Error Deconstruction Rubric', 'Problem-Solving Pause Points', 'Metacognitive Monitoring'],
          activities: ['Self-monitored challenge sets', 'Error journal analysis', 'Correction validation'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          name: 'Phase 4: Autonomous Metacognitive Regulation',
          duration: 'Ongoing',
          focus: 'Self-directed evaluation and autonomous adaptation',
          description: 'Maintain calibrated study monitoring without external prompts.',
          concepts: ['Autonomous Audit Sprints', 'Cumulative Readiness Review', 'Strategy Refinement'],
          activities: ['Weekly synthesis reflection', 'Calibration maintenance checks', 'Self-directed planning'],
          completed: false,
        },
      ];
      break;

    case 'knowledge':
      weeklyHoursBreakdown = '6 hours/week allocated: 40% Prerequisite Decomposition & Chunking, 30% Closed-Book Retrieval, 20% Application, 10% Reflection.';
      whatToStop = 'Stop diving into advanced multi-step problems when prerequisite formulas or terms are hazy.';
      whatToPractise = 'Practise prerequisite schema mapping and chunking complex theorems into 3 non-negotiable rules.';
      successIndicator = `Complete prerequisite schema reconstruction from memory with 100% boundary rule accuracy before advancing to composite problem sets for ${goal.title}.`;
      stuckAction = 'Deconstruct the concept into its two most primitive sub-components using the Concept Decomposition prompt in the AI Suite.';
      phases = [
        {
          id: 'p1',
          phase: 1,
          name: 'Phase 1: Prerequisite Decomposition & Invariant Extraction',
          duration: 'Week 1-2',
          focus: `Audit and isolate foundational prerequisite concepts for ${goal.title}`,
          description: `Deconstruct complex topics into single-concept primitives. ${whatToStop}`,
          concepts: ['Prerequisite Schema Tree', 'Core Invariant Rules', 'Terminology Precision'],
          activities: ['Prerequisite knowledge audit', 'Concept chunking worksheet', 'Primitive recall check'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          name: 'Phase 2: Structured Schema Organization & Concept Mapping',
          duration: 'Week 3-4',
          focus: 'Connect individual chunks into hierarchical concept maps',
          description: `${whatToPractise} Verify connections between dependent ideas.`,
          concepts: ['Hierarchical Schema Map', 'Concept Dependency Matrix', 'Relational Links'],
          activities: ['Concept mapping from memory', 'Dependency tracing', 'Closed-book schema reconstruction'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          name: 'Phase 3: Progressive Integration & Step-by-Step Application',
          duration: 'Week 5-6',
          focus: 'Reintegrate structured chunks to solve compound problems',
          description: 'Step-by-step composite problem solving leveraging organized schemas.',
          concepts: ['Composite Problem Set 1', 'Composite Problem Set 2', 'Integration Challenges'],
          activities: ['Composite problem decomposition', 'Multi-step guided solution', 'Near-transfer drills'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          name: 'Phase 4: Synthesis & Independent Execution',
          duration: 'Ongoing',
          focus: 'Autonomous problem solving with fluid concept retrieval',
          description: 'Synthesize across all modules to solve complex authentic challenges.',
          concepts: ['Cumulative Synthesis', 'Timed Schema Audit', 'Final Synthesis'],
          activities: ['Comprehensive problem sets', 'Spaced schema review', 'Cumulative synthesis exam'],
          completed: false,
        },
      ];
      break;

    case 'environment':
      weeklyHoursBreakdown = '6 hours/week allocated: 35% Environmentally-Shielded Study Blocks, 30% Retrieval, 25% Application, 10% Routine Audit.';
      whatToStop = 'Stop studying with active mobile notifications, social feeds open, or in noisy, unstructured locations.';
      whatToPractise = 'Practise 50-minute distraction-shielded focus blocks with all study materials pre-downloaded offline.';
      successIndicator = `Completing 5 scheduled 50-minute shielded deliberate practice blocks per week with zero recorded interruption events for ${goal.title}.`;
      stuckAction = 'Activate the Contingency Focus Checklist: switch device to airplane mode and proceed with offline retrieval flashcards.';
      phases = [
        {
          id: 'p1',
          phase: 1,
          name: 'Phase 1: Environmental Restructuring & Friction Removal',
          duration: 'Week 1-2',
          focus: `Eliminate study-space friction and install distraction shields for ${goal.title}`,
          description: `Pre-download all materials, configure offline study mode, and anchor to a specific daily cue. ${whatToStop}`,
          concepts: ['Environmental Triggers', 'Offline Study Toolkit', 'Focus Anchors'],
          activities: ['Study space audit', 'Offline material pre-download', 'Distraction barrier setup'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          name: 'Phase 2: Distraction-Shielded Habit Execution',
          duration: 'Week 3-4',
          focus: 'Execute daily 50-minute focused deliberate practice sprints',
          description: `${whatToPractise} Maintain a zero-interruption log for every session.`,
          concepts: ['50-Minute Sprint Protocol', 'Interruption Countermeasures', 'Deep Work Routines'],
          activities: ['Daily timed sprint execution', 'Session completion logging', 'Friction adjustment'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          name: 'Phase 3: High-Yield Practice in Shielded Environments',
          duration: 'Week 5-6',
          focus: 'Channel protected focus time into high-yield retrieval and application',
          description: 'Deploy shielded study blocks directly on difficult retrieval and application challenges.',
          concepts: ['Shielded Retrieval Sprint', 'Shielded Scenario Sprints', 'High-Friction Problem Set'],
          activities: ['High-yield practice blocks', 'Timed problem sets', 'Cognitive energy tracking'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          name: 'Phase 4: Resilient Habit Maintenance',
          duration: 'Ongoing',
          focus: 'Sustain study consistency under changing environmental conditions',
          description: 'Protect study habits during exam periods, power outages, and schedule changes.',
          concepts: ['Contingency Study Protocol', 'Low-Energy Minimum Viable Habit', 'Long-Term Rhythm'],
          activities: ['Contingency routine drill', 'Weekly habit audit', 'Autonomous deliberate practice'],
          completed: false,
        },
      ];
      break;

    default:
      weeklyHoursBreakdown = '6 hours/week allocated: 35% Closed-Book Retrieval, 35% Interleaved Application, 20% Prerequisite Encoding, 10% Metacognitive Reflection.';
      whatToStop = 'Stop passive re-reading and linear textbook highlighting.';
      whatToPractise = 'Practise closed-book retrieval within 24 hours of exposure, followed by 3 interleaved application problems.';
      successIndicator = `Achieving >=70% closed-book recall accuracy and >=70% proficiency on novel application challenges without consulting reference notes.`;
      stuckAction = 'Deploy the AI Learning Coach to receive progressive Socratic hints without spoonfeeding answers.';
      phases = [
        {
          id: 'p1',
          phase: 1,
          name: 'Phase 1: Foundational Vocabulary & Invariants',
          duration: 'Week 1-2',
          focus: `Core terminology and boundary invariants for ${goal.title}`,
          description: `Define fundamental concepts in own words. ${whatToStop}`,
          concepts: ['Foundational Definitions', 'Prerequisite Map', 'Core Constraints'],
          activities: ['Own-words summarization', 'Prerequisite audit', 'Closed-book baseline check'],
          completed: false,
        },
        {
          id: 'p2',
          phase: 2,
          name: 'Phase 2: Closed-Book Structural Reconstruction',
          duration: 'Week 3-4',
          focus: `Eliminate recognition reliance through active retrieval targeting ${primaryBottleneck.title}`,
          description: `${whatToPractise} Enforce 5-minute blank-page recall protocols.`,
          concepts: ['Mechanics Walkthrough', 'Common Misconceptions', 'Self-Explanation Tracing'],
          activities: ['Spaced retrieval practice', 'Error taxonomy classification', 'Confidence calibration'],
          completed: false,
        },
        {
          id: 'p3',
          phase: 3,
          name: 'Phase 3: Contextual Transfer & Interleaved Problem Solving',
          duration: 'Week 5-6',
          focus: 'Deploy learned invariants in unfamiliar exam and practical scenarios',
          description: 'Practice far-transfer application challenges with varied constraints.',
          concepts: ['Scenario Simulation 1', 'Scenario Simulation 2', 'Trade-off Analysis'],
          activities: ['Interleaved question sets', 'Far-transfer scenario challenge', 'Edge-case diagnosis'],
          completed: false,
        },
        {
          id: 'p4',
          phase: 4,
          name: 'Phase 4: Spaced Consolidation & Autonomous Stability',
          duration: 'Ongoing',
          focus: 'Distributed multi-interval reinforcement along forgetting curves',
          description: 'Systematic review sprints to establish durable long-term retention.',
          concepts: ['Timed Simulation', 'Cumulative Synthesis', 'System Audit'],
          activities: ['Mixed retrieval sprints', 'Cumulative past-paper test', 'Self-regulation review'],
          completed: false,
        },
      ];
      break;
  }

  return {
    goalId: goal.id,
    title: strategyTitle,
    rationale,
    phases,
    weeklyHoursBreakdown,
    successIndicator,
    stuckAction,
  };
}
