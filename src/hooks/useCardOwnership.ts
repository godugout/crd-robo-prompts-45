
import { useUser } from '@/hooks/use-user';

export const useCardOwnership = (creatorId?: string) => {
  const { user } = useUser();
  
  // Check if current user owns the card
  const isOwner = user?.id && creatorId && user.id === creatorId;
  
  return {
    isOwner: Boolean(isOwner),
    canEdit: Boolean(isOwner)
  };
};
