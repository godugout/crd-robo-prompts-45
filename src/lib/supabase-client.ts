
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// For browser environments, we use import.meta.env for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Declare the supabase client outside the conditional blocks
let supabase: ReturnType<typeof createClient<Database>>;

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Supabase URL and Anon Key are required. Please ensure your environment variables are set correctly:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY\n\n' +
    'For local development, create a .env file in the root directory with these variables.'
  );
  
  // Provide placeholder client with mock methods to prevent runtime errors
  // This allows the app to at least render without crashing
  const mockClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
          range: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
        order: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          range: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
        range: () => Promise.resolve({ data: [], error: null, count: 0 }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: { from: () => ({ remove: () => Promise.resolve({ error: null }) }) },
    rpc: () => Promise.resolve({ data: [], error: null }),
  };
  
  // Assign the mock client to the supabase variable
  supabase = mockClient as unknown as ReturnType<typeof createClient<Database>>;
} else {
  // Create the actual Supabase client
  supabase = createClient<Database>(supabaseUrl, supabaseKey);
}

// Export the client
export { supabase };
