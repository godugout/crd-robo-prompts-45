
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Download, 
  MessageCircle, 
  User, 
  Calendar,
  Eye,
  Star,
  Tag
} from 'lucide-react';

interface CardDetailRightPanelProps {
  card: {
    id: string;
    title: string;
    description?: string;
    rarity: string;
    creator_name?: string;
    creator_verified?: boolean;
    price?: string;
    created_at: string;
    tags?: string[];
    view_count?: number;
    like_count?: number;
  };
  onShare?: () => void;
  onDownload?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
}

export const CardDetailRightPanel: React.FC<CardDetailRightPanelProps> = ({
  card,
  onShare,
  onDownload,
  onLike,
  onBookmark
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-orange-400 bg-orange-400/20';
      case 'epic': return 'text-purple-400 bg-purple-400/20';
      case 'rare': return 'text-blue-400 bg-blue-400/20';
      case 'uncommon': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-4 mb-0 bg-crd-mediumGray/20">
          <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
          <TabsTrigger value="comments" className="text-xs">Comments</TabsTrigger>
          <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="info" className="p-4 space-y-4 m-0">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{card.title}</h2>
              {card.description && (
                <p className="text-crd-lightGray text-sm">{card.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getRarityColor(card.rarity)}>
                {card.rarity}
              </Badge>
              {card.price && (
                <Badge variant="outline" className="border-crd-green text-crd-green">
                  {card.price} CC
                </Badge>
              )}
            </div>

            <Separator className="bg-crd-mediumGray/20" />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-crd-lightGray" />
                <span className="text-crd-lightGray">Creator:</span>
                <span className="text-white">{card.creator_name || 'Unknown'}</span>
                {card.creator_verified && (
                  <Star className="w-3 h-3 text-crd-green fill-current" />
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-crd-lightGray" />
                <span className="text-crd-lightGray">Created:</span>
                <span className="text-white">{new Date(card.created_at).toLocaleDateString()}</span>
              </div>

              {card.view_count && (
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-crd-lightGray" />
                  <span className="text-crd-lightGray">Views:</span>
                  <span className="text-white">{card.view_count.toLocaleString()}</span>
                </div>
              )}
            </div>

            {card.tags && card.tags.length > 0 && (
              <>
                <Separator className="bg-crd-mediumGray/20" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-crd-lightGray" />
                    <span className="text-sm text-crd-lightGray">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="actions" className="p-4 space-y-4 m-0">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={onLike}
                className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-red-500 hover:text-red-400"
              >
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              
              <Button
                variant="outline"
                onClick={onBookmark}
                className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-crd-green hover:text-crd-green"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={onShare}
              className="w-full border-crd-mediumGray text-crd-lightGray hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Card
            </Button>

            <Button
              variant="outline"
              onClick={onDownload}
              className="w-full border-crd-mediumGray text-crd-lightGray hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <Separator className="bg-crd-mediumGray/20" />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Quick Stats</h4>
              <div className="text-xs text-crd-lightGray space-y-1">
                <div className="flex justify-between">
                  <span>Likes:</span>
                  <span>{card.like_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Views:</span>
                  <span>{card.view_count || 0}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="p-4 m-0">
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
              <p className="text-crd-lightGray text-sm">Comments coming soon!</p>
              <p className="text-crd-lightGray text-xs mt-2">
                Connect with other collectors and share your thoughts.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-4 space-y-4 m-0">
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Technical Details</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Card ID:</span>
                  <span className="text-white font-mono">{card.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Format:</span>
                  <span className="text-white">CRD Digital Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Version:</span>
                  <span className="text-white">1.0</span>
                </div>
              </div>
            </div>

            <Separator className="bg-crd-mediumGray/20" />

            <div>
              <h4 className="text-sm font-medium text-white mb-3">Blockchain Info</h4>
              <div className="text-center py-4">
                <p className="text-crd-lightGray text-xs">
                  Blockchain features coming soon!
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
