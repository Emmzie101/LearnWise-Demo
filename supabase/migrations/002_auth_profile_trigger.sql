-- ============================================================================
-- LearnWise: Personalized Learning Operating System (PLSFR+)
-- Migration: 002_auth_profile_trigger.sql
-- Description: Creates a PostgreSQL function and trigger on auth.users to
--              automatically provision a matching public.profiles row upon
--              successful Supabase registration.
--
-- Security:
--   - Uses SECURITY DEFINER to bypass RLS during system-level profile creation.
--   - Sets explicit search_path = public, pg_temp to prevent search_path hijacking.
--   - Idempotent with ON CONFLICT (id) DO NOTHING to prevent duplicate errors.
--   - Does NOT expose or require service-role keys.
--   - Does NOT create demo records.
-- ============================================================================

-- Function to handle new user registration in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    education_level,
    institution,
    field_of_study,
    year_of_study,
    available_hours_per_week,
    learning_context,
    target_exam
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''), 'New Learner'),
    'University_Undergrad',
    '',
    '',
    '',
    6,
    '{}'::text[],
    NULL
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger executing handle_new_user() after a new auth.users row is inserted
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
