
import { deleteMedia } from '@/lib/mediaManager';
import { getMemoryById } from './queries';
import { supabase } from '@/lib/supabase-client';

export const deleteMemory = async (id: string): Promise<void> => {
  const memory = await getMemoryById(id);
  if (!memory) throw new Error(`Memory not found: ${id}`);

  const deleteMediaPromises = memory.media?.map(media => 
    deleteMedia(media.id, memory.userId)
  ) || [];

  await Promise.all(deleteMediaPromises);

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete memory: ${error.message}`);
};

