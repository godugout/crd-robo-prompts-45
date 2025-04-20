
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// For browser environments, we need to use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
