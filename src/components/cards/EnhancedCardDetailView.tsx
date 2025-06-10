
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Maximize2, 
  Share, 
  Download, 
  Heart,
  Bookmark,
  ArrowLeft,
  MoreHorizontal,
} from 'lucide-react';
import { CompactCardViewer } from '@/components/viewer/CompactCardViewer';
import { CommentSection } from '@/components/social/CommentSection';
import { ReactionBar } from '@/components/social/ReactionBar';
import { convertToViewerCardData } from '@/components/viewer/types';
import type { CardData } from '@/hooks/useCardData';
import { CardQuickFactsPanel } from './components/CardQuickFactsPanel';
import { CardMetadataPanel } from './components/CardMetadataPanel';

interface EnhancedCardDetailViewProps {
  card: CardData;
  onOpenViewer: () => void;
  onShare: () => void;
  onDownload: () => void;
  onGoBack: () => void;
}

export const EnhancedCardDetailView: React.FC<EnhancedCardDetailViewProps> = ({
  card,
  onOpenViewer,
  onShare,
  onDownload,
  onGoBack
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Convert CardData to viewer format
  const universalCard = {
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity,
    price: card.price,
    creator_name: card.creator_name,
    creator_verified: card.creator_verified,
    stock: card.edition_size || 3,
    tags: card.tags
  };

  const viewerCard = convertToViewerCardData(universalCard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-crd-blue/5 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-crd-green/5 to-transparent rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Header Navigation */}
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area - Full Card Viewer + Community */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-0 leading-tight lg:hidden">{card.title}</h1>
              
              {/* Card Viewer - Full Space */}
              <div className="relative min-h-[500px] md:min-h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-editor-dark to-editor-darker border border-white/10 shadow-2xl">
                {/* Card viewer fills entire container */}
                <div className="absolute inset-0 w-full h-full">
                  <CompactCardViewer
                    card={viewerCard}
                    onFullscreen={onOpenViewer}
                    width="100%"
                    height="100%"
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

              {/* Action Buttons - Mobile Only */}
              <div className="grid grid-cols-3 gap-3 lg:hidden">
                <Button 
                  variant="outline" 
                  className={`border-white/20 backdrop-blur-sm ${isLiked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'text-white hover:bg-white/10'}`}
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  onClick={onShare}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  onClick={onDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              {/* Community Section */}
              <div className="space-y-6">
                {/* Reactions */}
                <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Community Reactions</h3>
                    <ReactionBar 
                      memoryId={card.id}
                      initialReactions={[]}
                      initialUserReactions={[]}
                    />
                  </CardContent>
                </Card>
                
                {/* Comments Section */}
                <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
                  <CardContent className="p-6">
                    <CommentSection 
                      memoryId={card.id}
                      expanded={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar - Card Information & Actions */}
            <div className="space-y-5">
              {/* Card Title & Creator - Desktop Only */}
              <div className="hidden lg:block">
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{card.title}</h1>
              </div>
              
              {/* Quick Facts Panel */}
              <CardQuickFactsPanel
                card={card}
                likeCount={likeCount}
                isLiked={isLiked}
                isBookmarked={isBookmarked}
              />

              {/* Actions - Desktop Only */}
              <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10 hidden lg:block">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={handleLike}
                        className={`border-white/20 backdrop-blur-sm ${
                          isLiked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                        {isLiked ? 'Liked' : 'Like'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleBookmark}
                        className={`border-white/20 backdrop-blur-sm ${
                          isBookmarked ? 'bg-crd-green/20 text-crd-green border-crd-green/30' : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                        Save
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={onShare}
                        className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={onDownload}
                        className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Enhanced Metadata */}
              <CardMetadataPanel card={card} />

              {/* More Actions */}
              <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">More Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white"
                    >
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      Add to Collection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onOpenViewer}
                      className="w-full justify-start border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      View in 3D
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
