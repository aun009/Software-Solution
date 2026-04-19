import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Main client using the Anon Public Key for frontend queries
export const supabase = createClient(supabaseUrl, supabaseKey);

// ONLY FOR SECURE ADMIN USE (Do not expose this in production frontend ideally)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
