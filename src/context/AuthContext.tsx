import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Defense-in-depth helper to ensure public.profiles has a row for the user.
 * Complements the PostgreSQL trigger defined in 002_auth_profile_trigger.sql.
 */
async function ensureProfileExists(user: User): Promise<void> {
  if (!user || !isSupabaseConfigured()) return;

  try {
    const { data: existing, error: selectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (selectError) {
      console.warn('[LearnWise Auth] Profile lookup warning:', selectError.message);
      return;
    }

    if (!existing) {
      const rawName = (user.user_metadata?.name as string) || (user.user_metadata?.full_name as string) || '';
      const cleanName = rawName.trim() || 'New Learner';

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: cleanName,
          education_level: 'University_Undergrad',
          institution: '',
          field_of_study: '',
          year_of_study: '',
          available_hours_per_week: 6,
          learning_context: [],
          target_exam: null,
        });

      if (insertError) {
        // If row was already created by trigger concurrently, ignore duplicate key error
        if (!insertError.message.includes('duplicate key') && !insertError.message.includes('conflict')) {
          console.warn('[LearnWise Auth] Client profile provisioning fallback:', insertError.message);
        }
      }
    }
  } catch (err) {
    console.warn('[LearnWise Auth] Unexpected error verifying profile:', err);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // 1. Resolve initial session on mount
    async function initSession() {
      try {
        if (!isSupabaseConfigured()) {
          if (mounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[LearnWise Auth] Error fetching initial session:', error.message);
        }

        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          if (data.session?.user) {
            void ensureProfileExists(data.session.user);
          }
        }
      } catch (err) {
        console.warn('[LearnWise Auth] Unexpected session init error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initSession();

    // 2. Subscribe to live auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);

      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && newSession?.user) {
        void ensureProfileExists(newSession.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in the environment.',
          status: 500,
        } as AuthError,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        void ensureProfileExists(data.user);
      }

      return { error: null };
    } catch (err: any) {
      return {
        error: {
          name: 'UnexpectedAuthError',
          message: err?.message || 'An unexpected error occurred during sign in.',
          status: 500,
        } as AuthError,
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | null;
  }> => {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in the environment.',
          status: 500,
        } as AuthError,
      };
    }

    try {
      const cleanName = name.trim() || 'New Learner';
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
            full_name: cleanName,
          },
        },
      });

      if (error) {
        return { data: null, error };
      }

      // If instant session is returned (email confirmation disabled), provision profile
      if (data.user && data.session) {
        void ensureProfileExists(data.user);
      }

      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: {
          name: 'UnexpectedAuthError',
          message: err?.message || 'An unexpected error occurred during registration.',
          status: 500,
        } as AuthError,
      };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signOut();
        if (error) return { error };
      }
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (err: any) {
      return {
        error: {
          name: 'UnexpectedSignOutError',
          message: err?.message || 'Failed to sign out cleanly.',
          status: 500,
        } as AuthError,
      };
    }
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
