import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Public Supabase client — uses the Anon key.
 * All operations here are governed by Supabase Row Level Security (RLS) policies.
 * Safe to use in the browser.
 *
 * ⚠️  The service role key (admin bypass) has been intentionally moved to server.ts
 *     and is NEVER exposed to the frontend bundle.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
