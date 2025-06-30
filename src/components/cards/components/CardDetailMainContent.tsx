
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2 } from 'lucide-react';
import { CompactCardViewer } from '@/components/viewer/CompactCardViewer';
import { CommentSection } from '@/components/social/CommentSection';
import { ReactionBar } from '@/components/social/ReactionBar';
import type { CardData } from '@/hooks/useCardEditor';

interface CardDetailMainContentProps {
  cardTitle: string;
  cardId: string;
  viewerCard: CardData;
  onOpenViewer: () => void;
}

export const CardDetailMainContent: React.FC<CardDetailMainContentProps> = ({
  cardTitle,
  cardId,
  viewerCard,
  onOpenViewer
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Card Title - Mobile Only */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-0 leading-tight lg:hidden">
        {cardTitle}
      </h1>
      
      {/* Card Viewer - Full Space */}
      <div className="relative min-h-[500px] md:min-h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-editor-dark to-editor-darker border border-white/10 shadow-2xl">
        {/* Card viewer fills entire container */}
        <div className="absolute inset-0 w-full h-full">
          <CompactCardViewer
            card={viewerCard}
            onFullscreen={onOpenViewer}
          />
        </div>
        
        {/* Floating action button for fullscreen */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenViewer}
          className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white rounded-full w-10 h-10 p-0 z-10"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Community Section */}
      <div className="space-y-6">
        {/* Reactions */}
        <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Community Reactions</h3>
            <ReactionBar 
              memoryId={cardId}
              initialReactions={[]}
              initialUserReactions={[]}
            />
          </CardContent>
        </Card>
        
        {/* Comments Section */}
        <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <CommentSection 
              memoryId={cardId}
              expanded={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
