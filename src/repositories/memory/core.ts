
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getMemoryQuery = async () => {
  const appId = await getAppId();
  
  return supabase
    .from('memories')
    .select('*, media(*)')
    .eq('app_id', appId);
};
