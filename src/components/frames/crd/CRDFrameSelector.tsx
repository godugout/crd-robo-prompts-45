
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Frame, Sparkles } from 'lucide-react';
import { CRDFrameRenderer } from './CRDFrameRenderer';
import { CRD_FRAMES } from '@/data/crdFrames';
import { CRDFrame } from '@/types/crdFrames';

interface CRDFrameSelectorProps {
  selectedFrameId?: string;
  onFrameSelect: (frameId: string) => void;
  userImage?: string;
  className?: string;
}

export const CRDFrameSelector: React.FC<CRDFrameSelectorProps> = ({
  selectedFrameId,
  onFrameSelect,
  userImage,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'sports', 'modern', 'vintage'];
  
  const filteredFrames = selectedCategory === 'all' 
    ? CRD_FRAMES 
    : CRD_FRAMES.filter(frame => frame.category === selectedCategory);

  const getRarityInfo = (rarity?: string) => {
    switch (rarity) {
      case 'common': return { color: 'bg-gray-500', label: 'Common' };
      case 'uncommon': return { color: 'bg-green-500', label: 'Uncommon' };
      case 'rare': return { color: 'bg-blue-500', label: 'Rare' };
      case 'epic': return { color: 'bg-purple-500', label: 'Epic' };
      case 'legendary': return { color: 'bg-yellow-500', label: 'Legendary' };
      default: return { color: 'bg-gray-500', label: 'Standard' };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          <Frame className="w-5 h-5 text-crd-green" />
          CRD Frame Templates
        </h3>
        <p className="text-gray-400 text-sm">
          Professional frames with transparent image areas
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`capitalize ${
              selectedCategory === category 
                ? 'bg-crd-green text-black' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrames.map((frame) => {
          const isSelected = selectedFrameId === frame.id;
          const rarityInfo = getRarityInfo(frame.rarity);
          
          return (
            <Card
              key={frame.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/20' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-crd-green/50 hover:bg-gray-800/70'
              }`}
              onClick={() => onFrameSelect(frame.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Frame Preview */}
                  <div className="relative">
                    <div className="aspect-[5/7] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                      <CRDFrameRenderer
                        frame={frame}
                        userImage={userImage}
                        width={150}
                        height={210}
                        interactive={false}
                      />
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </div>

                  {/* Frame Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm truncate">
                        {frame.name}
                      </h4>
                      <Badge 
                        className={`text-xs text-white border-0 ${rarityInfo.color}`}
                      >
                        {frame.rarity && (
                          <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        {rarityInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                      {frame.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{frame.elements.length} elements</span>
                      <span>•</span>
                      <span className="capitalize">{frame.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredFrames.length === 0 && (
        <div className="text-center py-12">
          <Frame className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">No frames found in this category</p>
          <Button
            variant="outline"
            onClick={() => setSelectedCategory('all')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            View All Frames
          </Button>
        </div>
      )}
    </div>
  );
};
