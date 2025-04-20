
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getMemoryQuery = () => {
  // Return the query builder directly without awaiting
  return supabase
    .from('memories')
    .select('*, media(*)');
};

