
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Import the Supabase URL and key from the integrations file
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// Get the Supabase project details from the existing client
const supabaseUrl = "https://wxlwhqlbxyuyujhqeyur.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bHdocWxieHl1eXVqaHFleXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjAyNTMsImV4cCI6MjA1Mzc5NjI1M30.6TlBEqXOPZRgwhPrHQBYjMMVzmCTmCb-Q1-sNnFhVrc";

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
