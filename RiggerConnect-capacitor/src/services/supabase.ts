import { createClient } from '@supabase/supabase-js';

// Get configuration from window.APP_CONFIG or environment variables
const supabaseUrl = (window as any).APP_CONFIG?.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://supabase.sxc.codes';
const supabaseAnonKey = (window as any).APP_CONFIG?.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
