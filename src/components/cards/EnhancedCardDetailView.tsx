
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Maximize2, 
  Share, 
  Download, 
  Star, 
  Calendar, 
  Tag, 
  Heart,
  Eye,
  Bookmark,
  ArrowLeft,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { CompactCardViewer } from '@/components/viewer/CompactCardViewer';
import { CommentSection } from '@/components/social/CommentSection';
import { ReactionBar } from '@/components/social/ReactionBar';
import { convertToViewerCardData } from '@/components/viewer/types';
import type { CardData } from '@/hooks/useCardData';

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

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      case 'uncommon':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
    stock: 3,
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
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
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
            <div className="lg:col-span-2 space-y-8">
              {/* Card Viewer - Full Space */}
              <div className="relative min-h-[700px] rounded-2xl overflow-hidden bg-gradient-to-br from-editor-dark to-editor-darker border border-white/10 shadow-2xl">
                {/* Card viewer fills entire container - removed all padding and margin */}
                <div className="absolute inset-0 w-full h-full">
                  <CompactCardViewer
                    card={viewerCard}
                    onFullscreen={onOpenViewer}
                    width={800}
                    height={700}
                  />
                </div>
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
            <div className="space-y-6">
              {/* Card Title & Creator */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{card.title}</h1>
                
                <div className="flex items-center justify-center lg:justify-start gap-2 text-crd-lightGray mb-4">
                  <span>Created by</span>
                  <span className="text-white font-semibold">{card.creator_name}</span>
                  {card.creator_verified && (
                    <Star className="w-4 h-4 text-crd-green fill-current" />
                  )}
                </div>
                
                {/* Rarity Badge with card info */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center lg:justify-start">
                    <Badge className={`bg-gradient-to-r ${getRarityColor(card.rarity)} text-white font-bold px-4 py-2`}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {card.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Quick stats row */}
                  <div className="flex justify-center lg:justify-start gap-4 text-sm text-crd-lightGray">
                    {card.price && (
                      <span className="text-crd-green font-medium">${card.price}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(card.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {likeCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
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

              {/* Description */}
              {card.description && (
                <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-crd-lightGray leading-relaxed">{card.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                      className="w-full justify-start border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Create Similar
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
