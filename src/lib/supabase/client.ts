import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if real Supabase environment variables are provided
export const hasRealSupabase = Boolean(supabaseUrl && supabaseAnonKey);

// Safe mock client that intercepts all calls to prevent network activities entirely
const mockSupabaseChain: any = {
  select: () => mockSupabaseChain,
  insert: async () => ({ data: null, error: null }),
  update: () => mockSupabaseChain,
  delete: () => mockSupabaseChain,
  eq: () => mockSupabaseChain,
  order: () => mockSupabaseChain,
  limit: () => mockSupabaseChain,
  then: (resolve: any) => resolve({ data: [], error: null })
};

const mockSupabase: any = {
  auth: {
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    getSession: async () => ({ data: { session: null } }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => mockSupabaseChain
};

// Initialize real client if configuration is present, otherwise fallback to mock
export const supabase = hasRealSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;

/**
 * Diagnostic logger - tests the Supabase connection if configured
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!hasRealSupabase) {
    console.log('VOOX operates in pure frontend mode with offline local storage database.');
    return false;
  }
  try {
    const { data, error } = await supabase.from('categories').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection test succeeded!');
    return true;
  } catch (err: any) {
    console.error('Supabase connection test exception:', err);
    return false;
  }
}

