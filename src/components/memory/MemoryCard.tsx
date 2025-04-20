
import React from 'react';
import type { Memory } from '@/types/memory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onReaction?: (memoryId: string, reactionType: 'heart' | 'thumbs-up' | 'party' | 'baseball') => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onReaction }) => {
  const handleReaction = () => {
    if (onReaction) {
      onReaction(memory.id, 'heart');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{memory.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{memory.user?.username || 'Anonymous'}</span>
          <span>•</span>
          <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{memory.description}</p>
        
        {memory.media && memory.media.length > 0 && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img 
              src={memory.media[0].thumbnailUrl || memory.media[0].url} 
              alt={memory.title}
              className="w-full h-auto object-cover max-h-[300px]"
            />
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex gap-1 items-center"
            onClick={handleReaction}
          >
            <Heart className="h-4 w-4" />
            <span>
              {memory.reactions?.filter(r => r.type === 'heart').length || 0}
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
            <MessageCircle className="h-4 w-4" />
            <span>{memory.comments?.count || 0}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex gap-1 items-center">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

