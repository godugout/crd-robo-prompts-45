
import React from 'react';
import type { Memory } from '@/types/memory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface MemoryCardProps {
  memory: Memory;
  onReaction?: (memoryId: string, reactionType: 'heart' | 'thumbs-up' | 'party' | 'baseball') => void;
  onClick?: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onReaction, onClick }) => {
  const handleReaction = () => {
    if (onReaction) {
      onReaction(memory.id, 'heart');
      toast({
        title: "Reaction added",
        description: "You liked this card",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/card/' + memory.id);
    toast({
      title: "Link copied",
      description: "Card link copied to clipboard",
    });
  };

  const handleCardClick = () => {
    onClick?.();
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={memory.user?.profileImage} alt={memory.user?.username || 'User'} />
              <AvatarFallback>{memory.user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{memory.user?.username || 'Anonymous'}</p>
              <p className="text-xs text-muted-foreground">{formatDate(memory.createdAt)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{memory.title}</CardTitle>
        {memory.description && (
          <CardDescription className="line-clamp-2">{memory.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {memory.media && memory.media.length > 0 && (
          <div className="mb-3 rounded-md overflow-hidden bg-muted/20">
            <img 
              src={memory.media[0].thumbnailUrl || memory.media[0].url} 
              alt={memory.title}
              className="w-full h-auto object-cover max-h-[300px]"
            />
          </div>
        )}
        
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {memory.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex gap-1 items-center text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleReaction();
            }}
          >
            <Heart className={`h-4 w-4 ${(memory.reactions?.filter(r => r.type === 'heart').length || 0) > 0 ? 'fill-primary text-primary' : ''}`} />
            <span>
              {memory.reactions?.filter(r => r.type === 'heart').length || 0}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex gap-1 items-center text-muted-foreground hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{memory.commentCount || 0}</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex gap-1 items-center text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex gap-1 items-center text-muted-foreground hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
