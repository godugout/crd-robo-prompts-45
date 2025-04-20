
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getMemoryQuery = async () => {
  const appId = await getAppId();
  
  // Return the query builder directly, not the executed query
  return supabase
    .from('memories')
    .select('*, media(*)');
    // Don't execute the query here with .eq() since we want to chain more conditions
};
