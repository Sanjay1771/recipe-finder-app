import { createClient } from '@supabase/supabase-js';

// ============================================
// Supabase Client Initialization
// ============================================
// This client is used to interact with your 
// Supabase Auth and Database services.
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
