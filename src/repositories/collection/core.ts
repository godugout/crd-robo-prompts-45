
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getCollectionQuery = () => {
  return supabase
    .from('collections')
    .select('*, media(*)');
};

export const getCollectionItemsQuery = () => {
  // We'll manually build the query instead of using collection_items
  // since it seems to have typing issues
  return supabase
    .from('collection_items');
};
