
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Edit, 
  Globe, 
  Lock, 
  Eye, 
  Share2, 
  Download,
  Heart,
  Bookmark,
  Star,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { CachedImage } from '@/components/common/CachedImage';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import type { UserCard } from '@/hooks/useUserCards';

interface EnhancedCardDetailPageProps {
  card: UserCard;
  isOwner: boolean;
  onGoBack: () => void;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export const EnhancedCardDetailPage: React.FC<EnhancedCardDetailPageProps> = ({
  card,
  isOwner,
  onGoBack,
  onEdit,
  onToggleVisibility,
  onShare,
  onDownload
}) => {
  const [showStudioViewer, setShowStudioViewer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'epic': return 'border-purple-500 bg-purple-500/10 text-purple-400';
      case 'rare': return 'border-blue-500 bg-blue-500/10 text-blue-400';
      case 'uncommon': return 'border-green-500 bg-green-500/10 text-green-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  if (showStudioViewer) {
    return (
      <ImmersiveCardViewer
        card={card}
        isOpen={true}
        onClose={() => setShowStudioViewer(false)}
        onShare={onShare}
        onDownload={onDownload}
        allowRotation={true}
        showStats={true}
        ambient={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest">
      {/* Header with consistent exit button position */}
      <div className="relative z-10 p-4 md:p-6">
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

          {/* Owner Controls */}
          {isOwner && (
            <div className="flex gap-2">
              <Button
                onClick={onEdit}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Card
              </Button>
              <Button
                onClick={onToggleVisibility}
                variant="outline"
                size="sm"
                className={`border-white/20 ${
                  card.is_public 
                    ? 'text-crd-green hover:bg-crd-green/10' 
                    : 'text-yellow-400 hover:bg-yellow-400/10'
                }`}
              >
                {card.is_public ? (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Private
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div className="space-y-4">
            <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10 overflow-hidden">
              <div className="aspect-[2.5/3.5] relative group">
                {card.image_url ? (
                  <CachedImage
                    src={card.image_url}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-crd-mediumGray/20 text-crd-lightGray">
                    No Image
                  </div>
                )}
                
                {/* Studio Viewer Button Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    onClick={() => setShowStudioViewer(true)}
                    className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View in Studio
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowStudioViewer(true)}
                className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Eye className="w-4 h-4 mr-2" />
                View in Studio
              </Button>
              <Button
                onClick={onShare}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={onDownload}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Card Information */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{card.title}</h1>
              {card.description && (
                <p className="text-crd-lightGray text-lg mb-4">{card.description}</p>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getRarityColor(card.rarity)}>
                  {card.rarity}
                </Badge>
                {card.price && (
                  <Badge variant="outline" className="border-crd-green text-crd-green">
                    {card.price} CC
                  </Badge>
                )}
              </div>
            </div>

            {/* Creator Info */}
            <Card className="bg-editor-dark/30 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Creator</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-crd-mediumGray rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-crd-lightGray" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{card.creator_name || 'Unknown'}</span>
                      {card.creator_verified && (
                        <Star className="w-4 h-4 text-crd-green fill-current" />
                      )}
                    </div>
                    <span className="text-crd-lightGray text-sm">Creator</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Stats */}
            <Card className="bg-editor-dark/30 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </span>
                    <span className="text-white">{new Date(card.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Status</span>
                    <span className={`flex items-center gap-1 ${card.is_public ? 'text-crd-green' : 'text-yellow-400'}`}>
                      {card.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {card.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Edition Size</span>
                    <span className="text-white">1 of 1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <Card className="bg-editor-dark/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Actions */}
            <Card className="bg-editor-dark/30 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`border-white/20 ${
                      isLiked 
                        ? 'text-red-400 border-red-400 bg-red-400/10' 
                        : 'text-crd-lightGray hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`border-white/20 ${
                      isBookmarked 
                        ? 'text-crd-green border-crd-green bg-crd-green/10' 
                        : 'text-crd-lightGray hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
