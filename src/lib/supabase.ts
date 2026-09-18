import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration & Initialization Layer
 *
 * Grounded in Vite + React client-side architecture.
 * Uses publishable anon key only (guarded by Supabase Row Level Security).
 * Service-role keys must NEVER be exposed to frontend code.
 */

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Fallback placeholder credentials to prevent module evaluation crashes
// when environment variables are not yet configured in local development or preview
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key';

/**
 * Checks whether valid, non-placeholder Supabase credentials have been provided.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!rawSupabaseUrl || !rawSupabaseAnonKey) return false;
  if (rawSupabaseUrl === PLACEHOLDER_URL || rawSupabaseAnonKey === PLACEHOLDER_KEY) return false;
  if (rawSupabaseUrl.includes('your-project.supabase.co') || rawSupabaseAnonKey.includes('your-anon-key')) return false;
  
  try {
    const parsed = new URL(rawSupabaseUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * Public configuration metadata (safe for client-side consumption)
 */
export const supabaseConfig = {
  url: isSupabaseConfigured() ? rawSupabaseUrl : '',
  hasAnonKey: isSupabaseConfigured() && Boolean(rawSupabaseAnonKey),
  isConfigured: isSupabaseConfigured(),
};

/**
 * Standard singleton Supabase client instance.
 * Safe to import anywhere in the client codebase.
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? rawSupabaseUrl : PLACEHOLDER_URL,
  isSupabaseConfigured() ? rawSupabaseAnonKey : PLACEHOLDER_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Helper to retrieve the active Supabase client with runtime configuration verification.
 * Throws a descriptive error if called when environment variables are missing.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[Supabase] Client is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }
  return supabase;
};

export default supabase;
