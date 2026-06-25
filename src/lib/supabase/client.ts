import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasRealSupabase = Boolean(supabaseUrl && supabaseAnonKey);

let _supabaseOnline: boolean | null = null;
let _checking = false;
const _checkCallbacks: Array<(v: boolean) => void> = [];

export function supabaseOnReady(cb: (online: boolean) => void) {
  if (_supabaseOnline !== null) { cb(_supabaseOnline); return; }
  _checkCallbacks.push(cb);
  if (!_checking) checkSupabaseOnline();
}

async function checkSupabaseOnline() {
  _checking = true;
  let online = false;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    supabase.from('categories').select('id').limit(1).then(({ error }) => {
      clearTimeout(id);
      if (!error) online = true;
    });
  } catch {}
  // Wait a moment for the check to complete
  await new Promise(r => setTimeout(r, 3500));
  _supabaseOnline = online;
  _checkCallbacks.forEach(cb => cb(online));
  _checkCallbacks.length = 0;
}

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

export const supabase = hasRealSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;

export async function testSupabaseConnection(): Promise<boolean> {
  if (!hasRealSupabase) return false;
  try {
    const { error } = await supabase.from('categories').select('id').limit(1);
    return !error;
  } catch { return false; }
}

