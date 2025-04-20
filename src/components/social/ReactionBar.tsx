
import React, { useState, useEffect } from 'react';
import { ThumbsUp, Heart, PartyPopper, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import * as socialRepository from '@/repositories/social';
import type { Reaction, ReactionCount } from '@/types/social';

interface ReactionBarProps {
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
  initialReactions?: Reaction[];
  initialUserReactions?: Reaction[];
}

const REACTION_TYPES = [
  { type: 'thumbs-up', Icon: ThumbsUp },
  { type: 'heart', Icon: Heart },
  { type: 'party', Icon: PartyPopper },
  { type: 'baseball', Icon: Medal },
];

export const ReactionBar = ({
  memoryId,
  collectionId,
  commentId,
  initialReactions,
  initialUserReactions,
}: ReactionBarProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions || []);
  const [userReactions, setUserReactions] = useState<Reaction[]>(initialUserReactions || []);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!initialReactions && (memoryId || collectionId || commentId)) {
      const fetchReactions = async () => {
        try {
          const result = await socialRepository.getReactions({
            memoryId,
            collectionId,
            commentId,
          });
          setReactions(result.reactions);
          setCounts(
            result.counts.reduce((acc, { type, count }) => ({ ...acc, [type]: count }), {})
          );
          if (user) {
            setUserReactions(
              result.reactions.filter((reaction) => reaction.userId === user.id)
            );
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load reactions',
            variant: 'destructive',
          });
        }
      };
      fetchReactions();
    }
  }, [memoryId, collectionId, commentId, initialReactions, user, toast]);

  const handleReactionClick = async (type: string) => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const hasReacted = userReactions.some((r) => r.type === type);
      
      if (hasReacted) {
        // Find the reaction to remove
        const reactionToRemove = userReactions.find(r => r.type === type);
        if (reactionToRemove) {
          await socialRepository.removeReaction(reactionToRemove.id);
          setUserReactions(userReactions.filter((r) => r.type !== type));
          setCounts({ ...counts, [type]: (counts[type] || 0) - 1 });
        }
      } else {
        // Determine which ID to use based on what was provided
        const targetId = memoryId || collectionId || commentId;
        const targetType = memoryId ? 'memory' : collectionId ? 'collection' : 'comment';
        
        if (!targetId) {
          throw new Error('No target ID provided');
        }
        
        const newReaction = await socialRepository.addReaction({
          userId: user.id,
          type,
          targetId,
          targetType: targetType as 'memory' | 'comment' | 'collection'
        });
        
        setUserReactions([...userReactions, newReaction]);
        setCounts({ ...counts, [type]: (counts[type] || 0) + 1 });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reaction',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_TYPES.map(({ type, Icon }) => {
        const hasReacted = userReactions.some((r) => r.type === type);
        const count = counts[type] || 0;

        return (
          <Button
            key={type}
            variant={hasReacted ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={() => handleReactionClick(type)}
            disabled={!user || loading}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{count}</span>
          </Button>
        );
      })}
    </div>
  );
};
