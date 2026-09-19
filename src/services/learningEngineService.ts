/**
 * LearnWise Stage 5: Personalised Adaptive Learning Engine Service
 * 
 * Manages Supabase persistence for:
 * - learning_goals
 * - strategy_plans
 * - concepts
 * - retrieval_attempts
 * - application_attempts
 * - interventions
 * - recommendations
 * - learning_reflections
 * - learning_events (telemetry)
 * 
 * Strict RLS compliance: All operations enforce auth.uid() scoping.
 * No service-role keys. Demo mode never invokes this service.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  LearningGoal, 
  LearningStrategyPlan, 
  Concept, 
  RetrievalAttempt, 
  ApplicationAttempt, 
  Intervention, 
  Recommendation, 
  LearningReflection,
  GoalType,
  ConceptState,
  TaskType,
  PlsfrDimensionKey
} from '../types';
import { toSqlDate } from './diagnosticService';

// ============================================================================
// 1. LEARNING GOALS (public.learning_goals)
// ============================================================================

export async function getLearningGoals(userId: string): Promise<LearningGoal[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('learning_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load learning goals:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    domain: row.domain,
    goalType: (row.goal_type as GoalType) || 'academic',
    description: row.description || '',
    targetDate: row.target_date,
    priority: (row.priority as 'Low' | 'Medium' | 'High' | 'Urgent') || 'Medium',
    status: (row.status as 'Active' | 'Completed' | 'Paused') || 'Active',
    totalConceptsCount: 0,
    masteredConceptsCount: 0,
  }));
}

export async function saveLearningGoal(
  userId: string,
  goal: Omit<LearningGoal, 'id' | 'totalConceptsCount' | 'masteredConceptsCount'> & { id?: string }
): Promise<LearningGoal> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload: any = {
    user_id: userId,
    title: goal.title.trim(),
    domain: goal.domain || 'General',
    goal_type: goal.goalType || 'academic',
    description: goal.description || '',
    target_date: toSqlDate(goal.targetDate),
    priority: goal.priority || 'Medium',
    status: goal.status || 'Active',
    updated_at: new Date().toISOString(),
  };

  if (goal.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goal.id)) {
    payload.id = goal.id;
  }

  const { data, error } = await supabase
    .from('learning_goals')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save learning goal:', error.message);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    domain: data.domain,
    goalType: (data.goal_type as GoalType) || 'academic',
    description: data.description || '',
    targetDate: data.target_date,
    priority: (data.priority as 'Low' | 'Medium' | 'High' | 'Urgent') || 'Medium',
    status: (data.status as 'Active' | 'Completed' | 'Paused') || 'Active',
    totalConceptsCount: 0,
    masteredConceptsCount: 0,
    phases: goal.phases,
  };
}

export async function updateLearningGoalStatus(
  userId: string,
  goalId: string,
  status: 'Active' | 'Completed' | 'Paused'
): Promise<void> {
  if (!isSupabaseConfigured() || !userId) return;

  const { error } = await supabase
    .from('learning_goals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) {
    console.error('[learningEngineService] Failed to update goal status:', error.message);
    throw error;
  }
}

// ============================================================================
// 2. STRATEGY PLANS (public.strategy_plans)
// ============================================================================

export async function getStrategyPlanByGoalId(
  userId: string,
  goalId: string
): Promise<LearningStrategyPlan | null> {
  if (!isSupabaseConfigured() || !userId || !goalId) return null;

  const { data, error } = await supabase
    .from('strategy_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .maybeSingle();

  if (error) {
    console.error('[learningEngineService] Failed to load strategy plan:', error.message);
    throw error;
  }

  if (!data) return null;

  return {
    goalId: data.goal_id,
    title: data.title,
    rationale: data.rationale,
    phases: data.phases || [],
    weeklyHoursBreakdown: data.weekly_hours_breakdown || '',
    successIndicator: data.success_indicator || '',
    stuckAction: data.stuck_action || '',
  };
}

export async function saveStrategyPlan(
  userId: string,
  plan: LearningStrategyPlan
): Promise<LearningStrategyPlan> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload = {
    user_id: userId,
    goal_id: plan.goalId,
    title: plan.title,
    rationale: plan.rationale,
    phases: plan.phases || [],
    weekly_hours_breakdown: plan.weeklyHoursBreakdown || '',
    success_indicator: plan.successIndicator || '',
    stuck_action: plan.stuckAction || '',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('strategy_plans')
    .upsert(payload, { onConflict: 'goal_id' })
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save strategy plan:', error.message);
    throw error;
  }

  return {
    goalId: data.goal_id,
    title: data.title,
    rationale: data.rationale,
    phases: data.phases || [],
    weeklyHoursBreakdown: data.weekly_hours_breakdown || '',
    successIndicator: data.success_indicator || '',
    stuckAction: data.stuck_action || '',
  };
}

// ============================================================================
// 3. CONCEPTS (public.concepts)
// ============================================================================

export async function getConceptsByUserId(userId: string): Promise<Concept[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('concepts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load concepts:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    goalId: row.goal_id,
    title: row.title,
    domain: row.domain,
    taskType: (row.task_type as TaskType) || 'Conceptual',
    state: (row.state as ConceptState) || 'Introduced',
    definition: row.definition,
    notes: row.notes || undefined,
    source: row.source || undefined,
    prerequisites: row.prerequisites || [],
    reinforcementIntervalDays: row.reinforcement_interval_days || 1,
    recallSuccessCount: row.recall_success_count || 0,
    recallFailureCount: row.recall_failure_count || 0,
    applicationSuccessCount: row.application_success_count || 0,
    applicationFailureCount: row.application_failure_count || 0,
    lastConfidenceRating: row.last_confidence_rating || undefined,
    activeBottleneck: row.active_bottleneck || undefined,
    lastReviewedAt: row.last_reviewed_at || undefined,
    nextReviewAt: row.next_review_at,
  }));
}

export async function saveConcept(
  userId: string,
  concept: Omit<Concept, 'id'> & { id?: string }
): Promise<Concept> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  // Validate task_type to match DB CHECK constraint ('Conceptual', 'Procedural', 'Factual', 'Meta')
  let safeTaskType: 'Conceptual' | 'Procedural' | 'Factual' | 'Meta' = 'Conceptual';
  const taskTypeStr = concept.taskType as string;
  if (taskTypeStr === 'Procedural' || taskTypeStr === 'Conceptual' || taskTypeStr === 'Factual' || taskTypeStr === 'Meta') {
    safeTaskType = taskTypeStr as any;
  } else if (taskTypeStr === 'Applied' || taskTypeStr === 'Quantitative') {
    safeTaskType = 'Procedural';
  } else {
    safeTaskType = 'Conceptual';
  }

  const payload: any = {
    user_id: userId,
    goal_id: concept.goalId,
    title: concept.title.trim(),
    domain: concept.domain || 'General',
    task_type: safeTaskType,
    state: concept.state || 'Introduced',
    definition: concept.definition,
    notes: concept.notes || null,
    source: concept.source || null,
    prerequisites: concept.prerequisites || [],
    reinforcement_interval_days: Math.max(1, concept.reinforcementIntervalDays || 1),
    recall_success_count: Math.max(0, concept.recallSuccessCount || 0),
    recall_failure_count: Math.max(0, concept.recallFailureCount || 0),
    application_success_count: Math.max(0, concept.applicationSuccessCount || 0),
    application_failure_count: Math.max(0, concept.applicationFailureCount || 0),
    last_confidence_rating: concept.lastConfidenceRating || null,
    active_bottleneck: concept.activeBottleneck || null,
    last_reviewed_at: concept.lastReviewedAt || null,
    next_review_at: concept.nextReviewAt || new Date(Date.now() + 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (concept.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(concept.id)) {
    payload.id = concept.id;
  }

  const { data, error } = await supabase
    .from('concepts')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save concept:', error.message);
    throw error;
  }

  return {
    id: data.id,
    goalId: data.goal_id,
    title: data.title,
    domain: data.domain,
    taskType: (data.task_type as TaskType) || 'Conceptual',
    state: (data.state as ConceptState) || 'Introduced',
    definition: data.definition,
    notes: data.notes || undefined,
    source: data.source || undefined,
    prerequisites: data.prerequisites || [],
    reinforcementIntervalDays: data.reinforcement_interval_days || 1,
    recallSuccessCount: data.recall_success_count || 0,
    recallFailureCount: data.recall_failure_count || 0,
    applicationSuccessCount: data.application_success_count || 0,
    applicationFailureCount: data.application_failure_count || 0,
    lastConfidenceRating: data.last_confidence_rating || undefined,
    activeBottleneck: data.active_bottleneck || undefined,
    lastReviewedAt: data.last_reviewed_at || undefined,
    nextReviewAt: data.next_review_at,
  };
}

export async function updateConceptProgress(
  userId: string,
  conceptId: string,
  updates: Partial<Concept>
): Promise<void> {
  if (!isSupabaseConfigured() || !userId || !conceptId) return;

  const payload: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.state) payload.state = updates.state;
  if (updates.recallSuccessCount !== undefined) payload.recall_success_count = updates.recallSuccessCount;
  if (updates.recallFailureCount !== undefined) payload.recall_failure_count = updates.recallFailureCount;
  if (updates.applicationSuccessCount !== undefined) payload.application_success_count = updates.applicationSuccessCount;
  if (updates.applicationFailureCount !== undefined) payload.application_failure_count = updates.applicationFailureCount;
  if (updates.reinforcementIntervalDays !== undefined) payload.reinforcement_interval_days = Math.max(1, updates.reinforcementIntervalDays);
  if (updates.lastReviewedAt) payload.last_reviewed_at = updates.lastReviewedAt;
  if (updates.nextReviewAt) payload.next_review_at = updates.nextReviewAt;
  if (updates.lastConfidenceRating) payload.last_confidence_rating = updates.lastConfidenceRating;
  if (updates.activeBottleneck !== undefined) payload.active_bottleneck = updates.activeBottleneck;

  const { error } = await supabase
    .from('concepts')
    .update(payload)
    .eq('id', conceptId)
    .eq('user_id', userId);

  if (error) {
    console.error('[learningEngineService] Failed to update concept progress:', error.message);
    throw error;
  }
}

// ============================================================================
// 4. RETRIEVAL ATTEMPTS (public.retrieval_attempts)
// ============================================================================

export async function getRetrievalAttempts(userId: string): Promise<RetrievalAttempt[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('retrieval_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load retrieval attempts:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    conceptId: row.concept_id,
    timestamp: row.created_at,
    prompt: row.prompt,
    userResponse: row.user_response,
    correctAnswer: row.correct_answer,
    isCorrect: row.is_correct,
    confidenceRating: row.confidence_rating as 1 | 2 | 3 | 4 | 5,
    calibrationStatus: row.calibration_status as 'well_calibrated' | 'overconfident' | 'underconfident',
    errorType: row.error_type || 'none',
    reflectionNote: row.reflection_note || undefined,
  }));
}

export async function saveRetrievalAttempt(
  userId: string,
  attempt: Omit<RetrievalAttempt, 'id' | 'timestamp'>
): Promise<RetrievalAttempt> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload = {
    user_id: userId,
    concept_id: attempt.conceptId,
    prompt: attempt.prompt,
    user_response: attempt.userResponse,
    correct_answer: attempt.correctAnswer,
    is_correct: attempt.isCorrect,
    confidence_rating: attempt.confidenceRating,
    calibration_status: attempt.calibrationStatus,
    error_type: attempt.errorType || 'none',
    reflection_note: attempt.reflectionNote || null,
  };

  const { data, error } = await supabase
    .from('retrieval_attempts')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save retrieval attempt:', error.message);
    throw error;
  }

  return {
    id: data.id,
    conceptId: data.concept_id,
    timestamp: data.created_at,
    prompt: data.prompt,
    userResponse: data.user_response,
    correctAnswer: data.correct_answer,
    isCorrect: data.is_correct,
    confidenceRating: data.confidence_rating as 1 | 2 | 3 | 4 | 5,
    calibrationStatus: data.calibration_status as 'well_calibrated' | 'overconfident' | 'underconfident',
    errorType: data.error_type,
    reflectionNote: data.reflection_note || undefined,
  };
}

// ============================================================================
// 5. APPLICATION ATTEMPTS (public.application_attempts)
// ============================================================================

export async function getApplicationAttempts(userId: string): Promise<ApplicationAttempt[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('application_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load application attempts:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    conceptId: row.concept_id,
    timestamp: row.created_at,
    scenario: row.scenario,
    taskPrompt: row.task_prompt,
    userSolution: row.user_solution,
    isProficient: row.is_proficient,
    scorePercentage: row.score_percentage,
    feedbackNotes: row.feedback_notes || '',
    confidenceRating: row.confidence_rating as 1 | 2 | 3 | 4 | 5,
  }));
}

export async function saveApplicationAttempt(
  userId: string,
  attempt: Omit<ApplicationAttempt, 'id' | 'timestamp'>
): Promise<ApplicationAttempt> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload = {
    user_id: userId,
    concept_id: attempt.conceptId,
    scenario: attempt.scenario,
    task_prompt: attempt.taskPrompt,
    user_solution: attempt.userSolution,
    is_proficient: attempt.isProficient,
    score_percentage: Math.min(100, Math.max(0, attempt.scorePercentage)),
    feedback_notes: attempt.feedbackNotes || '',
    confidence_rating: attempt.confidenceRating,
  };

  const { data, error } = await supabase
    .from('application_attempts')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save application attempt:', error.message);
    throw error;
  }

  return {
    id: data.id,
    conceptId: data.concept_id,
    timestamp: data.created_at,
    scenario: data.scenario,
    taskPrompt: data.task_prompt,
    userSolution: data.user_solution,
    isProficient: data.is_proficient,
    scorePercentage: data.score_percentage,
    feedbackNotes: data.feedback_notes || '',
    confidenceRating: data.confidence_rating as 1 | 2 | 3 | 4 | 5,
  };
}

// ============================================================================
// 6. INTERVENTIONS (public.interventions)
// ============================================================================

export async function getInterventions(userId: string): Promise<Intervention[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load interventions:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    targetDimension: row.target_dimension as PlsfrDimensionKey,
    problem: row.problem,
    reason: row.reason,
    action: row.action,
    frequency: row.frequency,
    expectedOutcome: row.expected_outcome,
    priority: (row.priority as 'High' | 'Medium' | 'Low') || 'High',
    status: (row.status as 'Active' | 'Completed' | 'Dismissed') || 'Active',
    evidenceOrigin: row.evidence_origin || '',
    metricBefore: row.metric_before || undefined,
    metricAfter: row.metric_after || undefined,
  }));
}

export async function saveIntervention(
  userId: string,
  intervention: Omit<Intervention, 'id'> & { id?: string }
): Promise<Intervention> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload: any = {
    user_id: userId,
    title: intervention.title,
    target_dimension: intervention.targetDimension,
    problem: intervention.problem,
    reason: intervention.reason,
    action: intervention.action,
    frequency: intervention.frequency,
    expected_outcome: intervention.expectedOutcome,
    priority: intervention.priority || 'High',
    status: intervention.status || 'Active',
    evidence_origin: intervention.evidenceOrigin || '',
    metric_before: intervention.metricBefore || null,
    metric_after: intervention.metricAfter || null,
    updated_at: new Date().toISOString(),
  };

  if (intervention.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(intervention.id)) {
    payload.id = intervention.id;
  }

  const { data, error } = await supabase
    .from('interventions')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save intervention:', error.message);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    targetDimension: data.target_dimension as PlsfrDimensionKey,
    problem: data.problem,
    reason: data.reason,
    action: data.action,
    frequency: data.frequency,
    expectedOutcome: data.expected_outcome,
    priority: data.priority as 'High' | 'Medium' | 'Low',
    status: data.status as 'Active' | 'Completed' | 'Dismissed',
    evidenceOrigin: data.evidence_origin || '',
    metricBefore: data.metric_before || undefined,
    metricAfter: data.metric_after || undefined,
  };
}

export async function updateInterventionStatus(
  userId: string,
  interventionId: string,
  status: 'Active' | 'Completed' | 'Dismissed'
): Promise<void> {
  if (!isSupabaseConfigured() || !userId || !interventionId) return;

  const { error } = await supabase
    .from('interventions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', interventionId)
    .eq('user_id', userId);

  if (error) {
    console.error('[learningEngineService] Failed to update intervention status:', error.message);
    throw error;
  }
}

// ============================================================================
// 7. RECOMMENDATIONS (public.recommendations)
// ============================================================================

export async function getRecommendations(userId: string): Promise<Recommendation[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_dismissed', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load recommendations:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    type: row.type as 'retrieval' | 'application' | 'prerequisite' | 'reflection' | 'workload_reduction',
    title: row.title,
    reason: row.reason,
    sourceSignal: row.source_signal,
    actionPrompt: row.action_prompt,
    actionRoute: row.action_route,
    priority: (row.priority as 'Critical' | 'High' | 'Medium') || 'High',
    createdAt: row.created_at,
    conceptId: row.concept_id || undefined,
  }));
}

export async function saveRecommendation(
  userId: string,
  rec: Omit<Recommendation, 'id' | 'createdAt'> & { id?: string }
): Promise<Recommendation> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload: any = {
    user_id: userId,
    concept_id: rec.conceptId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rec.conceptId) ? rec.conceptId : null,
    type: rec.type,
    title: rec.title,
    reason: rec.reason,
    source_signal: rec.sourceSignal,
    action_prompt: rec.actionPrompt,
    action_route: rec.actionRoute,
    priority: rec.priority || 'High',
    is_dismissed: false,
  };

  if (rec.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rec.id)) {
    payload.id = rec.id;
  }

  const { data, error } = await supabase
    .from('recommendations')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save recommendation:', error.message);
    throw error;
  }

  return {
    id: data.id,
    type: data.type as any,
    title: data.title,
    reason: data.reason,
    sourceSignal: data.source_signal,
    actionPrompt: data.action_prompt,
    actionRoute: data.action_route,
    priority: data.priority as any,
    createdAt: data.created_at,
    conceptId: data.concept_id || undefined,
  };
}

export async function dismissRecommendation(
  userId: string,
  recommendationId: string
): Promise<void> {
  if (!isSupabaseConfigured() || !userId || !recommendationId) return;

  const { error } = await supabase
    .from('recommendations')
    .update({ is_dismissed: true })
    .eq('id', recommendationId)
    .eq('user_id', userId);

  if (error) {
    console.error('[learningEngineService] Failed to dismiss recommendation:', error.message);
    throw error;
  }
}

// ============================================================================
// 8. LEARNING REFLECTIONS (public.learning_reflections)
// ============================================================================

export async function getLearningReflections(userId: string): Promise<LearningReflection[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('learning_reflections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[learningEngineService] Failed to load learning reflections:', error.message);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    timestamp: row.created_at,
    sessionType: row.session_type as 'retrieval' | 'application' | 'processing' | 'daily_synthesis',
    whatFeltEasy: row.what_felt_easy || '',
    whatFeltUnclear: row.what_felt_unclear || '',
    mistakeIdentified: row.mistake_identified || '',
    strategyThatHelped: row.strategy_that_helped || '',
    adjustmentForNextTime: row.adjustment_for_next_time || '',
    cognitiveEnergy: row.cognitive_energy as 1 | 2 | 3 | 4 | 5,
  }));
}

export async function saveLearningReflection(
  userId: string,
  reflection: Omit<LearningReflection, 'id' | 'timestamp'>
): Promise<LearningReflection> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('[learningEngineService] Supabase is not configured or user ID is missing.');
  }

  const payload = {
    user_id: userId,
    session_type: reflection.sessionType,
    what_felt_easy: reflection.whatFeltEasy || '',
    what_felt_unclear: reflection.whatFeltUnclear || '',
    mistake_identified: reflection.mistakeIdentified || '',
    strategy_that_helped: reflection.strategyThatHelped || '',
    adjustment_for_next_time: reflection.adjustmentForNextTime || '',
    cognitive_energy: reflection.cognitiveEnergy,
  };

  const { data, error } = await supabase
    .from('learning_reflections')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[learningEngineService] Failed to save learning reflection:', error.message);
    throw error;
  }

  return {
    id: data.id,
    timestamp: data.created_at,
    sessionType: data.session_type as any,
    whatFeltEasy: data.what_felt_easy,
    whatFeltUnclear: data.what_felt_unclear,
    mistakeIdentified: data.mistake_identified,
    strategyThatHelped: data.strategy_that_helped,
    adjustmentForNextTime: data.adjustment_for_next_time,
    cognitiveEnergy: data.cognitive_energy as any,
  };
}

// ============================================================================
// 9. LEARNING EVENTS (public.learning_events)
// ============================================================================

export async function logLearningEvent(
  userId: string,
  eventType: string,
  entityType?: string,
  entityId?: string,
  payload: Record<string, any> = {}
): Promise<void> {
  if (!isSupabaseConfigured() || !userId) return;

  try {
    const { error } = await supabase
      .from('learning_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        entity_type: entityType || null,
        entity_id: entityId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entityId) ? entityId : null,
        payload: payload || {},
      });

    if (error) {
      console.warn('[learningEngineService] Failed to log learning event:', error.message);
    }
  } catch (err) {
    console.warn('[learningEngineService] Exception logging learning event:', err);
  }
}
