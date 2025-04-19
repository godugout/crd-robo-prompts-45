
import { supabase } from '@/lib/supabase-client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getMemoryQuery = () => {
  return supabase
    .from('memories')
    .select('*, media(*)');
};

