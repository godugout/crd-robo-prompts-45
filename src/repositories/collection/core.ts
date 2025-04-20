
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getCollectionQuery = () => {
  return supabase
    .from('collections')
    .select('*, media(*)');
};

export const getCollectionItemsQuery = (collectionId: string) => {
  return supabase
    .from('collection_items')
    .select('*, memory:memories(*)')
    .eq('collection_id', collectionId)
    .order('display_order', { ascending: true });
};
