
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Eye, 
  Star, 
  Trophy, 
  DollarSign,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

interface CardStatsModuleProps {
  cardName: string;
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues: Record<string, Record<string, any>>;
}

export const CardStatsModule: React.FC<CardStatsModuleProps> = ({
  cardName,
  uploadedImage,
  selectedFrame,
  effectValues
}) => {
  // Calculate completion percentage
  const getCompletionScore = () => {
    let score = 0;
    if (cardName) score += 25;
    if (uploadedImage) score += 35;
    if (selectedFrame) score += 25;
    if (Object.keys(effectValues).length > 0) score += 15;
    return Math.min(score, 100);
  };

  const completionScore = getCompletionScore();
  const activeEffects = Object.keys(effectValues).length;

  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-crd-green" />
          <h3 className="text-white font-bold text-sm">Card Statistics</h3>
        </div>

        {/* Completion Progress */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Completion</span>
            <Badge className={`${completionScore === 100 ? 'bg-crd-green text-black' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {completionScore}%
            </Badge>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-crd-green to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionScore}%` }}
            />
          </div>
        </div>

        <Separator className="bg-white/10 mb-4" />

        {/* Creation Stats */}
        <div className="space-y-3 mb-4">
          <h4 className="text-gray-300 text-xs font-medium uppercase tracking-wide">Creation Stats</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-white text-sm font-bold">1</div>
              <div className="text-gray-400 text-xs">Views</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <div className="text-white text-sm font-bold">{activeEffects}</div>
              <div className="text-gray-400 text-xs">Effects</div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-4" />

        {/* Market Preview */}
        <div className="space-y-3 mb-4">
          <h4 className="text-gray-300 text-xs font-medium uppercase tracking-wide">Market Preview</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Est. Value</span>
              <div className="flex items-center text-crd-green text-sm font-bold">
                <DollarSign className="w-3 h-3 mr-1" />
                12.50
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Rarity</span>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                RARE
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Edition</span>
              <span className="text-crd-green text-sm font-medium">#001/100</span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-4" />

        {/* Community Stats */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-xs font-medium uppercase tracking-wide">Community</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-gray-300">0 Likes</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-gray-300">Unranked</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-300">New</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-gray-300">Rising</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
