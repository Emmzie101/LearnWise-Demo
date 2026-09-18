-- ============================================================================
-- LearnWise: Personalized Learning Operating System (PLSFR+)
-- Migration: 001_initial_schema.sql
-- Description: Complete 14-table relational schema with Row Level Security (RLS),
--              cross-row ownership validation, and append-only historical audit.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. PROFILES
-- Linked 1:1 with Supabase Auth (auth.users).
-- auth.users is the authoritative source for authentication and email.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  education_level TEXT NOT NULL DEFAULT 'University_Undergrad'
    CHECK (education_level IN (
      'SS1', 'SS2', 'SS3',
      'University_Undergrad', 'University_Postgrad',
      'Vocational', 'Independent_Professional'
    )),
  institution TEXT NOT NULL DEFAULT '',
  field_of_study TEXT NOT NULL DEFAULT '',
  year_of_study TEXT NOT NULL DEFAULT '',
  available_hours_per_week INTEGER NOT NULL DEFAULT 6
    CHECK (available_hours_per_week >= 1),
  learning_context TEXT[] NOT NULL DEFAULT '{}',
  target_exam TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. PLSFR+ COGNITIVE DIMENSIONS
-- Stores the current, dynamic 7-pillar model for each learner.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plsfr_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dimension_key TEXT NOT NULL CHECK (
    dimension_key IN (
      'cognitive_processing',
      'knowledge_acquisition',
      'knowledge_organization',
      'self_regulation',
      'motivation_emotion_identity',
      'environment_behavior',
      'performance_optimization'
    )
  ),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 50 CHECK (score BETWEEN 0 AND 100),
  confidence INTEGER NOT NULL DEFAULT 70 CHECK (confidence BETWEEN 0 AND 100),
  confidence_band TEXT NOT NULL DEFAULT 'Moderate'
    CHECK (confidence_band IN ('Low', 'Moderate', 'High')),
  evidence_count INTEGER NOT NULL DEFAULT 0 CHECK (evidence_count >= 0),
  strength_level TEXT NOT NULL DEFAULT 'Emerging'
    CHECK (strength_level IN ('Developing', 'Emerging', 'Functional', 'Strong', 'Highly Developed')),
  risk_level TEXT NOT NULL DEFAULT 'Low'
    CHECK (risk_level IN ('Low', 'Moderate', 'Elevated', 'Critical')),
  evidence_breakdown JSONB NOT NULL DEFAULT '{"selfReportCount":0,"scenarioCount":0,"performanceCount":0,"contradictions":[]}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_plsfr_user_dimension UNIQUE (user_id, dimension_key)
);

-- ----------------------------------------------------------------------------
-- 5. DIAGNOSTIC ASSESSMENTS
-- Tracks distinct assessment administrations across longitudinal cycles.
-- (Cycle 1: Baseline, Cycle 2: 18-day Reassessment, Cycle 3+: Future).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnostic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL DEFAULT 1 CHECK (cycle_number >= 1),
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL
);

-- ----------------------------------------------------------------------------
-- 6. DIAGNOSTIC RESPONSES
-- Append-only response ledger tied to an assessment administration.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnostic_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.diagnostic_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  selected_option_id TEXT NOT NULL,
  confidence_rating SMALLINT NULL CHECK (confidence_rating BETWEEN 1 AND 5),
  response_time_seconds INTEGER NULL CHECK (response_time_seconds >= 0),
  evidence_type TEXT NOT NULL DEFAULT 'declared'
    CHECK (evidence_type IN ('declared', 'observed', 'performance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_diagnostic_response_item UNIQUE (assessment_id, question_id)
);

-- ----------------------------------------------------------------------------
-- 7. DIAGNOSTIC REPORTS
-- Immutable evaluation snapshot generated upon completing an assessment.
-- Exactly 1 report per assessment administration (assessment_id UNIQUE).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnostic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL UNIQUE REFERENCES public.diagnostic_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reassessment_date DATE NOT NULL,
  overall_confidence TEXT NOT NULL CHECK (overall_confidence IN ('Low', 'Moderate', 'High')),
  executive_summary TEXT NOT NULL,
  primary_bottleneck JSONB NOT NULL,
  secondary_bottleneck JSONB NULL,
  leverageable_strength JSONB NOT NULL,
  contradictions_detected JSONB NOT NULL DEFAULT '[]'::jsonb,
  hidden_cross_pillar_patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_style_debunk JSONB NOT NULL,
  priority_interventions JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_ai_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
  dimension_scores_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. LEARNING GOALS
-- High-level curriculum and mastery goals.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  goal_type TEXT NOT NULL DEFAULT 'academic',
  description TEXT NOT NULL DEFAULT '',
  target_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Medium'
    CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  status TEXT NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Completed', 'Paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. STRATEGY PLANS
-- Customized multi-phase learning execution roadmaps tied 1:1 to goals.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strategy_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL UNIQUE REFERENCES public.learning_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  phases JSONB NOT NULL DEFAULT '[]'::jsonb,
  weekly_hours_breakdown TEXT NOT NULL DEFAULT '',
  success_indicator TEXT NOT NULL DEFAULT '',
  stuck_action TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. CONCEPTS
-- Atomic units of knowledge tracked through progression and spaced retrieval.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.learning_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'Conceptual'
    CHECK (task_type IN ('Conceptual', 'Procedural', 'Factual', 'Meta')),
  state TEXT NOT NULL DEFAULT 'Introduced'
    CHECK (state IN ('New', 'Introduced', 'Processed', 'Retrieved', 'Applied', 'Reinforced', 'Stable')),
  definition TEXT NOT NULL,
  notes TEXT NULL,
  source TEXT NULL,
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  reinforcement_interval_days INTEGER NOT NULL DEFAULT 1 CHECK (reinforcement_interval_days >= 1),
  recall_success_count INTEGER NOT NULL DEFAULT 0 CHECK (recall_success_count >= 0),
  recall_failure_count INTEGER NOT NULL DEFAULT 0 CHECK (recall_failure_count >= 0),
  application_success_count INTEGER NOT NULL DEFAULT 0 CHECK (application_success_count >= 0),
  application_failure_count INTEGER NOT NULL DEFAULT 0 CHECK (application_failure_count >= 0),
  last_confidence_rating SMALLINT NULL CHECK (last_confidence_rating BETWEEN 1 AND 5),
  active_bottleneck TEXT NULL,
  last_reviewed_at TIMESTAMPTZ NULL,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. RETRIEVAL ATTEMPTS
-- Append-only historical telemetry for closed-book recall events.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.retrieval_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  user_response TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  confidence_rating SMALLINT NOT NULL CHECK (confidence_rating BETWEEN 1 AND 5),
  calibration_status TEXT NOT NULL
    CHECK (calibration_status IN ('well_calibrated', 'overconfident', 'underconfident')),
  error_type TEXT NOT NULL DEFAULT 'none',
  reflection_note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. APPLICATION ATTEMPTS
-- Append-only historical telemetry for scenario problem-solving challenges.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  scenario TEXT NOT NULL,
  task_prompt TEXT NOT NULL,
  user_solution TEXT NOT NULL,
  is_proficient BOOLEAN NOT NULL,
  score_percentage INTEGER NOT NULL CHECK (score_percentage BETWEEN 0 AND 100),
  feedback_notes TEXT NOT NULL DEFAULT '',
  confidence_rating SMALLINT NOT NULL CHECK (confidence_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. INTERVENTIONS
-- Prescribed cognitive behavioral protocols targeting friction points.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_dimension TEXT NOT NULL CHECK (
    target_dimension IN (
      'cognitive_processing',
      'knowledge_acquisition',
      'knowledge_organization',
      'self_regulation',
      'motivation_emotion_identity',
      'environment_behavior',
      'performance_optimization'
    )
  ),
  problem TEXT NOT NULL,
  reason TEXT NOT NULL,
  action TEXT NOT NULL,
  frequency TEXT NOT NULL,
  expected_outcome TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'High'
    CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Completed', 'Dismissed')),
  evidence_origin TEXT NOT NULL DEFAULT '',
  metric_before TEXT NULL,
  metric_after TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 14. RECOMMENDATIONS
-- Prescriptive actions generated by the deterministic adaptive rule engine.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  concept_id UUID NULL REFERENCES public.concepts(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('retrieval', 'application', 'prerequisite', 'reflection', 'workload_reduction')),
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  source_signal TEXT NOT NULL,
  action_prompt TEXT NOT NULL,
  action_route TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'High'
    CHECK (priority IN ('Critical', 'High', 'Medium')),
  is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 15. LEARNING REFLECTIONS
-- Metacognitive post-session logs and cognitive energy ratings.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('retrieval', 'application', 'processing', 'daily_synthesis')),
  what_felt_easy TEXT NOT NULL DEFAULT '',
  what_felt_unclear TEXT NOT NULL DEFAULT '',
  mistake_identified TEXT NOT NULL DEFAULT '',
  strategy_that_helped TEXT NOT NULL DEFAULT '',
  adjustment_for_next_time TEXT NOT NULL DEFAULT '',
  cognitive_energy SMALLINT NOT NULL CHECK (cognitive_energy BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 16. LEARNING EVENTS (TELEMETRY & PILOT ANALYTICS)
-- Append-only event stream tracking high-level student interactions.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_type TEXT NULL,
  entity_id TEXT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 17. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------
-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_created ON public.profiles(created_at);

-- plsfr_dimensions
CREATE INDEX IF NOT EXISTS idx_plsfr_user ON public.plsfr_dimensions(user_id);

-- diagnostic_assessments
CREATE INDEX IF NOT EXISTS idx_assessments_user_cycle ON public.diagnostic_assessments(user_id, cycle_number DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_user_status ON public.diagnostic_assessments(user_id, status);

-- diagnostic_responses
CREATE INDEX IF NOT EXISTS idx_diag_resp_assessment ON public.diagnostic_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_diag_resp_user ON public.diagnostic_responses(user_id);

-- diagnostic_reports
CREATE INDEX IF NOT EXISTS idx_diag_reports_user_time ON public.diagnostic_reports(user_id, created_at DESC);

-- learning_goals
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.learning_goals(user_id, status);

-- strategy_plans
CREATE INDEX IF NOT EXISTS idx_strategy_goal ON public.strategy_plans(goal_id);
CREATE INDEX IF NOT EXISTS idx_strategy_user ON public.strategy_plans(user_id);

-- concepts
CREATE INDEX IF NOT EXISTS idx_concepts_user_goal ON public.concepts(user_id, goal_id);
CREATE INDEX IF NOT EXISTS idx_concepts_next_review ON public.concepts(user_id, next_review_at) WHERE state != 'Stable';
CREATE INDEX IF NOT EXISTS idx_concepts_state ON public.concepts(user_id, state);

-- retrieval_attempts
CREATE INDEX IF NOT EXISTS idx_retrievals_concept_time ON public.retrieval_attempts(concept_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_retrievals_user_time ON public.retrieval_attempts(user_id, created_at DESC);

-- application_attempts
CREATE INDEX IF NOT EXISTS idx_apps_concept_time ON public.application_attempts(concept_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apps_user_time ON public.application_attempts(user_id, created_at DESC);

-- interventions
CREATE INDEX IF NOT EXISTS idx_interventions_user_status ON public.interventions(user_id, status);

-- recommendations
CREATE INDEX IF NOT EXISTS idx_recs_user_active ON public.recommendations(user_id, is_dismissed, created_at DESC);

-- learning_reflections
CREATE INDEX IF NOT EXISTS idx_reflections_user_time ON public.learning_reflections(user_id, created_at DESC);

-- learning_events
CREATE INDEX IF NOT EXISTS idx_events_user_time ON public.learning_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type_time ON public.learning_events(event_type, created_at DESC);

-- ----------------------------------------------------------------------------
-- 18. UPDATED_AT TRIGGERS
-- ----------------------------------------------------------------------------
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_plsfr_dimensions_updated_at
  BEFORE UPDATE ON public.plsfr_dimensions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_learning_goals_updated_at
  BEFORE UPDATE ON public.learning_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_strategy_plans_updated_at
  BEFORE UPDATE ON public.strategy_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_concepts_updated_at
  BEFORE UPDATE ON public.concepts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_interventions_updated_at
  BEFORE UPDATE ON public.interventions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 19. ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plsfr_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retrieval_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_events ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: Authenticated learners only access their own records.
-- Relational child tables enforce cross-row ownership (parent record MUST
-- also belong to the authenticated user).
-- Append-only tables allow SELECT and INSERT only.
-- ----------------------------------------------------------------------------

-- 20.1 profiles (Self-management)
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 20.2 plsfr_dimensions (Learner-owned cognitive model)
CREATE POLICY "plsfr_select_own"
  ON public.plsfr_dimensions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "plsfr_insert_own"
  ON public.plsfr_dimensions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plsfr_update_own"
  ON public.plsfr_dimensions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plsfr_delete_own"
  ON public.plsfr_dimensions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 20.3 diagnostic_assessments (Direct ownership)
CREATE POLICY "assessments_select_own"
  ON public.diagnostic_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "assessments_insert_own"
  ON public.diagnostic_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessments_update_own"
  ON public.diagnostic_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessments_delete_own"
  ON public.diagnostic_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 20.4 diagnostic_responses (Append-only; cross-row assessment ownership required)
CREATE POLICY "responses_select_own"
  ON public.diagnostic_responses FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.diagnostic_assessments a
      WHERE a.id = diagnostic_responses.assessment_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "responses_insert_own"
  ON public.diagnostic_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.diagnostic_assessments a
      WHERE a.id = diagnostic_responses.assessment_id
        AND a.user_id = auth.uid()
    )
  );

-- 20.5 diagnostic_reports (Append-only snapshot; cross-row assessment ownership required)
CREATE POLICY "reports_select_own"
  ON public.diagnostic_reports FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.diagnostic_assessments a
      WHERE a.id = diagnostic_reports.assessment_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "reports_insert_own"
  ON public.diagnostic_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.diagnostic_assessments a
      WHERE a.id = diagnostic_reports.assessment_id
        AND a.user_id = auth.uid()
    )
  );

-- 20.6 learning_goals (Direct ownership)
CREATE POLICY "goals_select_own"
  ON public.learning_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "goals_insert_own"
  ON public.learning_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update_own"
  ON public.learning_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_delete_own"
  ON public.learning_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 20.7 strategy_plans (Cross-row goal ownership required)
CREATE POLICY "strategy_select_own"
  ON public.strategy_plans FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = strategy_plans.goal_id
        AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "strategy_insert_own"
  ON public.strategy_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = strategy_plans.goal_id
        AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "strategy_update_own"
  ON public.strategy_plans FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = strategy_plans.goal_id
        AND g.user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = strategy_plans.goal_id
        AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "strategy_delete_own"
  ON public.strategy_plans FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = strategy_plans.goal_id
        AND g.user_id = auth.uid()
    )
  );

-- 20.8 concepts (Cross-row goal ownership required)
CREATE POLICY "concepts_select_own"
  ON public.concepts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = concepts.goal_id
        AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "concepts_insert_own"
  ON public.concepts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = concepts.goal_id
        AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "concepts_update_own"
  ON public.concepts FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = concepts.goal_id
        AND g.user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = concepts.goal_id
        AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "concepts_delete_own"
  ON public.concepts FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.learning_goals g
      WHERE g.id = concepts.goal_id
        AND g.user_id = auth.uid()
    )
  );

-- 20.9 retrieval_attempts (Append-only; cross-row concept ownership required)
CREATE POLICY "retrievals_select_own"
  ON public.retrieval_attempts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.concepts c
      WHERE c.id = retrieval_attempts.concept_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "retrievals_insert_own"
  ON public.retrieval_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.concepts c
      WHERE c.id = retrieval_attempts.concept_id
        AND c.user_id = auth.uid()
    )
  );

-- 20.10 application_attempts (Append-only; cross-row concept ownership required)
CREATE POLICY "apps_select_own"
  ON public.application_attempts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.concepts c
      WHERE c.id = application_attempts.concept_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "apps_insert_own"
  ON public.application_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.concepts c
      WHERE c.id = application_attempts.concept_id
        AND c.user_id = auth.uid()
    )
  );

-- 20.11 interventions (Direct ownership)
CREATE POLICY "interventions_select_own"
  ON public.interventions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "interventions_insert_own"
  ON public.interventions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "interventions_update_own"
  ON public.interventions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "interventions_delete_own"
  ON public.interventions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 20.12 recommendations (Cross-row concept check if concept_id is present)
CREATE POLICY "recommendations_select_own"
  ON public.recommendations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (
      concept_id IS NULL OR
      EXISTS (
        SELECT 1 FROM public.concepts c
        WHERE c.id = recommendations.concept_id
          AND c.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "recommendations_insert_own"
  ON public.recommendations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (
      concept_id IS NULL OR
      EXISTS (
        SELECT 1 FROM public.concepts c
        WHERE c.id = recommendations.concept_id
          AND c.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "recommendations_update_own"
  ON public.recommendations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (
      concept_id IS NULL OR
      EXISTS (
        SELECT 1 FROM public.concepts c
        WHERE c.id = recommendations.concept_id
          AND c.user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    auth.uid() = user_id AND
    (
      concept_id IS NULL OR
      EXISTS (
        SELECT 1 FROM public.concepts c
        WHERE c.id = recommendations.concept_id
          AND c.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "recommendations_delete_own"
  ON public.recommendations FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    (
      concept_id IS NULL OR
      EXISTS (
        SELECT 1 FROM public.concepts c
        WHERE c.id = recommendations.concept_id
          AND c.user_id = auth.uid()
      )
    )
  );

-- 20.13 learning_reflections (Append-only; direct ownership)
CREATE POLICY "reflections_select_own"
  ON public.learning_reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "reflections_insert_own"
  ON public.learning_reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 20.14 learning_events (Append-only; direct ownership)
CREATE POLICY "events_select_own"
  ON public.learning_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "events_insert_own"
  ON public.learning_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
