
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getCollectionQuery = () => {
  return supabase
    .from('collections')
    .select('*, media(*)');
};

// We need to modify this function since collection_items table doesn't exist in the schema
// Instead, we'll use the collection_cards table which serves the same purpose
export const getCollectionItemsQuery = () => {
  return supabase
    .from('collection_cards');
};
