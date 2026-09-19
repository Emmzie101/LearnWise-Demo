/**
 * LearnWise Diagnostic & Learner Foundation Service
 * 
 * Manages Supabase persistence for:
 * - profiles
 * - plsfr_dimensions
 * - diagnostic_assessments
 * - diagnostic_responses (append-only ledger)
 * - diagnostic_reports (immutable snapshot)
 * 
 * Strict RLS compliance: All operations enforce auth.uid() scoping.
 * No service-role keys. Demo mode never invokes this service.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  LearnerProfile, 
  EducationLevel, 
  PlsfrDimension, 
  DiagnosticReport, 
  DiagnosticResponse,
  PlsfrDimensionKey,
  DiagnosticContradiction,
  TargetedInterventionItem
} from '../types';

// ============================================================================
// TYPE TRANSFORMERS & HELPERS
// ============================================================================

/**
 * Maps frontend EducationLevel to database CHECK constraint values.
 * DB allowed: 'SS1', 'SS2', 'SS3', 'University_Undergrad', 'University_Postgrad', 'Vocational', 'Independent_Professional'
 */
export function toDbEducationLevel(level: string): string {
  switch (level) {
    case 'Polytechnic_College':
    case 'Undergraduate (University/Polytechnic)':
      return 'Vocational';
    case 'Self_Directed':
    case 'Self-Directed / Professional':
      return 'Independent_Professional';
    case 'Senior Secondary (SS1-SS3)':
      return 'SS2';
    case "Postgraduate / Master's":
      return 'University_Postgrad';
    case 'SS1':
    case 'SS2':
    case 'SS3':
    case 'University_Undergrad':
    case 'University_Postgrad':
    case 'Vocational':
    case 'Independent_Professional':
      return level;
    default:
      return 'University_Undergrad';
  }
}

/**
 * Maps database education_level back to frontend EducationLevel.
 */
export function fromDbEducationLevel(dbLevel: string): EducationLevel {
  switch (dbLevel) {
    case 'Vocational':
      return 'Polytechnic_College';
    case 'Independent_Professional':
      return 'Self_Directed';
    case 'SS1':
    case 'SS2':
    case 'SS3':
    case 'University_Undergrad':
    case 'University_Postgrad':
      return dbLevel;
    default:
      return 'University_Undergrad';
  }
}

/**
 * Converts a human-readable or ISO date string to SQL DATE format (YYYY-MM-DD).
 */
export function toSqlDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {
    // Fallback to 18 days from now
  }
  const fallback = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
  return fallback.toISOString().split('T')[0];
}

/**
 * Formats a SQL DATE (YYYY-MM-DD) into a friendly display string (e.g. "October 6, 2026").
 */
export function toFriendlyDate(sqlDate: string): string {
  try {
    const parts = sqlDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }
  } catch {
    // Return original string if formatting fails
  }
  return sqlDate;
}

// ============================================================================
// PROFILE OPERATIONS (public.profiles)
// ============================================================================

/**
 * Loads the learner's profile row from public.profiles.
 */
export async function getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
  if (!isSupabaseConfigured() || !userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[diagnosticService] Failed to load profile:', error.message);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name || '',
    email: '', // Email is sourced from auth.users via AuthContext
    educationLevel: fromDbEducationLevel(data.education_level),
    institution: data.institution || '',
    fieldOfStudy: data.field_of_study || '',
    yearOfStudy: data.year_of_study || '',
    availableHoursPerWeek: data.available_hours_per_week || 6,
    learningContext: Array.isArray(data.learning_context) ? data.learning_context : [],
    targetExam: data.target_exam || undefined,
  };
}

/**
 * Saves/updates allowed profile fields in public.profiles.
 * Never modifies id or email (auth-managed).
 */
export async function saveLearnerProfile(
  userId: string, 
  updates: Partial<LearnerProfile>
): Promise<void> {
  if (!isSupabaseConfigured() || !userId) return;

  const payload: Record<string, any> = {};

  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.institution !== undefined) payload.institution = updates.institution.trim();
  if (updates.fieldOfStudy !== undefined) payload.field_of_study = updates.fieldOfStudy.trim();
  if (updates.yearOfStudy !== undefined) payload.year_of_study = updates.yearOfStudy.trim();
  if (updates.availableHoursPerWeek !== undefined) {
    payload.available_hours_per_week = Math.max(1, updates.availableHoursPerWeek);
  }
  if (updates.educationLevel !== undefined) {
    payload.education_level = toDbEducationLevel(updates.educationLevel);
  }
  if (updates.targetExam !== undefined) {
    payload.target_exam = updates.targetExam || null;
  }

  // Combine contextual study attributes if provided
  if (updates.learningContext !== undefined) {
    payload.learning_context = updates.learningContext;
  } else if (
    updates.studyContext || 
    updates.primaryDevice || 
    updates.internetReliability || 
    updates.electricityAccess
  ) {
    const contextItems = [
      updates.studyContext,
      updates.primaryDevice,
      updates.internetReliability,
      updates.electricityAccess
    ].filter(Boolean) as string[];
    payload.learning_context = contextItems;
  }

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId);

  if (error) {
    console.error('[diagnosticService] Failed to save profile:', error.message);
    throw error;
  }
}

// ============================================================================
// PLSFR DIMENSIONS (public.plsfr_dimensions)
// ============================================================================

/**
 * Loads current 7 cognitive dimensions from public.plsfr_dimensions.
 */
export async function getCurrentDimensions(userId: string): Promise<PlsfrDimension[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('plsfr_dimensions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('[diagnosticService] Failed to load dimensions:', error.message);
    throw error;
  }

  if (!data || data.length === 0) return [];

  return data.map(row => ({
    key: row.dimension_key as PlsfrDimensionKey,
    name: row.name,
    description: row.description,
    score: row.score,
    confidence: row.confidence,
    confidenceBand: row.confidence_band as 'Low' | 'Moderate' | 'High',
    evidenceCount: row.evidence_count,
    strengthLevel: row.strength_level as any,
    riskLevel: row.risk_level as any,
    evidenceBreakdown: row.evidence_breakdown,
  }));
}

/**
 * Upserts current 7 cognitive dimensions into public.plsfr_dimensions.
 * Unique constraint: (user_id, dimension_key).
 */
export async function upsertDimensions(
  userId: string, 
  dimensions: PlsfrDimension[]
): Promise<void> {
  if (!isSupabaseConfigured() || !userId || dimensions.length === 0) return;

  const rows = dimensions.map(d => ({
    user_id: userId,
    dimension_key: d.key,
    name: d.name,
    description: d.description,
    score: Math.min(100, Math.max(0, Math.round(d.score))),
    confidence: Math.min(100, Math.max(0, Math.round(d.confidence))),
    confidence_band: d.confidenceBand || 'Moderate',
    evidence_count: Math.max(0, d.evidenceCount || 0),
    strength_level: d.strengthLevel,
    risk_level: d.riskLevel,
    evidence_breakdown: d.evidenceBreakdown || {
      selfReportCount: 0,
      scenarioCount: 0,
      performanceCount: 0,
      contradictions: [],
    },
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('plsfr_dimensions')
    .upsert(rows, { onConflict: 'user_id,dimension_key' });

  if (error) {
    console.error('[diagnosticService] Failed to upsert dimensions:', error.message);
    throw error;
  }
}

// ============================================================================
// ASSESSMENT LIFECYCLE (public.diagnostic_assessments)
// ============================================================================

export interface DiagnosticAssessmentRow {
  id: string;
  user_id: string;
  cycle_number: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
}

/**
 * Gets or creates the current active ('in_progress') assessment for the user.
 * If none exists, computes the next cycle number and starts a new one.
 */
export async function getOrCreateActiveAssessment(
  userId: string
): Promise<DiagnosticAssessmentRow> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('Supabase is not configured or user is unauthenticated.');
  }

  // 1. Look for existing in_progress assessment
  const { data: active, error: activeError } = await supabase
    .from('diagnostic_assessments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeError) {
    console.error('[diagnosticService] Error checking active assessment:', activeError.message);
    throw activeError;
  }

  if (active) {
    return active as DiagnosticAssessmentRow;
  }

  // 2. Compute next cycle number (highest cycle_number + 1, or 1)
  const { data: highestCycle, error: cycleError } = await supabase
    .from('diagnostic_assessments')
    .select('cycle_number')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cycleError) {
    console.warn('[diagnosticService] Error reading highest cycle, defaulting to 1:', cycleError.message);
  }

  const nextCycle = highestCycle?.cycle_number ? highestCycle.cycle_number + 1 : 1;

  // 3. Create fresh assessment
  const { data: created, error: createError } = await supabase
    .from('diagnostic_assessments')
    .insert({
      user_id: userId,
      cycle_number: nextCycle,
      status: 'in_progress',
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError) {
    console.error('[diagnosticService] Error creating assessment:', createError.message);
    throw createError;
  }

  return created as DiagnosticAssessmentRow;
}

/**
 * Retrieves the latest completed assessment for a user.
 */
export async function getLatestCompletedAssessment(
  userId: string
): Promise<DiagnosticAssessmentRow | null> {
  if (!isSupabaseConfigured() || !userId) return null;

  const { data, error } = await supabase
    .from('diagnostic_assessments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[diagnosticService] Error checking completed assessment:', error.message);
    throw error;
  }

  return (data as DiagnosticAssessmentRow) || null;
}

/**
 * Transitions an in_progress assessment to 'completed'.
 */
export async function completeAssessment(
  assessmentId: string, 
  userId: string
): Promise<void> {
  if (!isSupabaseConfigured() || !assessmentId || !userId) return;

  const { error } = await supabase
    .from('diagnostic_assessments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', assessmentId)
    .eq('user_id', userId);

  if (error) {
    console.error('[diagnosticService] Failed to complete assessment:', error.message);
    throw error;
  }
}

/**
 * Transitions any active in_progress assessment to 'abandoned' (for retakes).
 */
export async function abandonActiveAssessment(userId: string): Promise<void> {
  if (!isSupabaseConfigured() || !userId) return;

  const { error } = await supabase
    .from('diagnostic_assessments')
    .update({ status: 'abandoned' })
    .eq('user_id', userId)
    .eq('status', 'in_progress');

  if (error) {
    console.error('[diagnosticService] Error abandoning active assessment:', error.message);
    throw error;
  }
}

// ============================================================================
// DIAGNOSTIC RESPONSES (public.diagnostic_responses)
// APPEND-ONLY LEDGER
// ============================================================================

/**
 * Loads all committed responses for a given assessment administration.
 */
export async function getAssessmentResponses(
  assessmentId: string, 
  userId: string
): Promise<DiagnosticResponse[]> {
  if (!isSupabaseConfigured() || !assessmentId || !userId) return [];

  const { data, error } = await supabase
    .from('diagnostic_responses')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[diagnosticService] Failed to load responses:', error.message);
    throw error;
  }

  if (!data) return [];

  return data.map(row => ({
    questionId: row.question_id,
    selectedOptionId: row.selected_option_id,
    confidenceRating: row.confidence_rating as 1 | 2 | 3 | 4 | 5 | undefined,
    responseTimeSeconds: row.response_time_seconds ?? undefined,
    evidenceType: row.evidence_type as 'declared' | 'observed' | 'performance',
  }));
}

/**
 * Appends a single response to public.diagnostic_responses.
 * If already recorded for this assessment and question, skips insertion to respect
 * append-only immutability and the UNIQUE (assessment_id, question_id) constraint.
 */
export async function saveDiagnosticResponse(params: {
  assessmentId: string;
  userId: string;
  response: DiagnosticResponse;
}): Promise<void> {
  const { assessmentId, userId, response } = params;
  if (!isSupabaseConfigured() || !assessmentId || !userId) return;

  // Check if response already exists to avoid redundant inserts
  const { data: existing, error: checkError } = await supabase
    .from('diagnostic_responses')
    .select('id')
    .eq('assessment_id', assessmentId)
    .eq('question_id', response.questionId)
    .maybeSingle();

  if (checkError) {
    console.warn('[diagnosticService] Error checking existing response:', checkError.message);
  }

  if (existing) {
    // Immutable response already exists in DB
    return;
  }

  const { error: insertError } = await supabase
    .from('diagnostic_responses')
    .insert({
      assessment_id: assessmentId,
      user_id: userId,
      question_id: response.questionId,
      selected_option_id: response.selectedOptionId,
      confidence_rating: response.confidenceRating ?? 3,
      response_time_seconds: Math.max(0, response.responseTimeSeconds ?? 0),
      evidence_type: response.evidenceType || 'declared',
    });

  if (insertError) {
    // If concurrent insert occurred, ignore unique violation
    if (insertError.code !== '23505' && !insertError.message.includes('unique') && !insertError.message.includes('conflict')) {
      console.error('[diagnosticService] Failed to insert response:', insertError.message);
      throw insertError;
    }
  }
}

// ============================================================================
// DIAGNOSTIC REPORTS (public.diagnostic_reports)
// IMMUTABLE EVALUATION SNAPSHOT
// ============================================================================

/**
 * Loads the latest completed diagnostic report for a user from public.diagnostic_reports.
 */
export async function getLatestCompletedReport(userId: string): Promise<DiagnosticReport | null> {
  if (!isSupabaseConfigured() || !userId) return null;

  const { data, error } = await supabase
    .from('diagnostic_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[diagnosticService] Failed to load latest report:', error.message);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    assessmentId: data.assessment_id,
    generatedAt: data.created_at,
    reassessmentDate: toFriendlyDate(data.reassessment_date),
    overallConfidence: data.overall_confidence as 'Low' | 'Moderate' | 'High',
    executiveSummary: data.executive_summary,
    primaryBottleneck: data.primary_bottleneck,
    secondaryBottleneck: data.secondary_bottleneck || undefined,
    leverageableStrength: data.leverageable_strength,
    contradictionsDetected: (data.contradictions_detected as DiagnosticContradiction[]) || [],
    hiddenCrossPillarPatterns: data.hidden_cross_pillar_patterns || [],
    learningStyleDebunkInsight: data.learning_style_debunk,
    priorityInterventions: (data.priority_interventions as TargetedInterventionItem[]) || [],
    recommendedAIRoles: data.recommended_ai_roles || [],
    dimensionScoresSnapshot: data.dimension_scores_snapshot || undefined,
  };
}

/**
 * Saves a completed evaluation report to public.diagnostic_reports.
 * Exactly 1 report per assessment (assessment_id UNIQUE).
 * Idempotent: Skips if report already exists for this assessment.
 */
export async function saveDiagnosticReport(params: {
  assessmentId: string;
  userId: string;
  report: DiagnosticReport;
  dimensionsSnapshot: PlsfrDimension[];
}): Promise<void> {
  const { assessmentId, userId, report, dimensionsSnapshot } = params;
  if (!isSupabaseConfigured() || !assessmentId || !userId) {
    throw new Error('Supabase is not configured or parameters missing.');
  }

  // Idempotency check: verify if report already exists for this assessment
  const { data: existing } = await supabase
    .from('diagnostic_reports')
    .select('id')
    .eq('assessment_id', assessmentId)
    .maybeSingle();

  if (existing) {
    // Report already created for this assessment - skip insertion idempotently
    return;
  }

  const sqlDate = toSqlDate(report.reassessmentDate);

  const payload = {
    assessment_id: assessmentId,
    user_id: userId,
    reassessment_date: sqlDate,
    overall_confidence: report.overallConfidence,
    executive_summary: report.executiveSummary,
    primary_bottleneck: report.primaryBottleneck,
    secondary_bottleneck: report.secondaryBottleneck ?? null,
    leverageable_strength: report.leverageableStrength,
    contradictions_detected: report.contradictionsDetected || [],
    hidden_cross_pillar_patterns: report.hiddenCrossPillarPatterns || [],
    learning_style_debunk: report.learningStyleDebunkInsight,
    priority_interventions: report.priorityInterventions || [],
    recommended_ai_roles: report.recommendedAIRoles || [],
    dimension_scores_snapshot: dimensionsSnapshot,
  };

  const { error } = await supabase
    .from('diagnostic_reports')
    .insert(payload);

  if (error) {
    // If unique violation occurred (concurrent insert or retry), treat as idempotent success
    if (error.code === '23505' || error.message.includes('unique') || error.message.includes('conflict')) {
      console.warn('[diagnosticService] Report already exists for assessment, proceeding idempotently.');
      return;
    }
    console.error('[diagnosticService] Failed to insert diagnostic report:', error.message);
    throw error;
  }
}
