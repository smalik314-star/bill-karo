import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key-placeholder';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
