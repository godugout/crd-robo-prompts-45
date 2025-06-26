
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ENHANCED_FRAMES, EnhancedFrameData } from '@/components/studio/data/enhancedFrames';
import { Check, Sparkles } from 'lucide-react';

interface FramePhaseProps {
  selectedFrame: string | null;
  frameData: EnhancedFrameData | null;
  onFrameSelect: (frameId: string) => void;
  onComplete: () => void;
  uploadedImages: File[];
  onImageAdjust: (adjustments: any) => void;
}

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  frameData,
  onFrameSelect,
  onComplete,
  uploadedImages
}) => {
  const categories = ['all', 'sports', 'trading', 'minimal', 'vintage', 'modern', 'fantasy'];
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredFrames = selectedCategory === 'all' 
    ? ENHANCED_FRAMES 
    : ENHANCED_FRAMES.filter(frame => frame.category === selectedCategory);

  const handleFrameSelect = (frameId: string) => {
    onFrameSelect(frameId);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Choose Your Frame</h3>
        <p className="text-gray-400">Select a template that matches your card's style and rarity</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`capitalize ${
              selectedCategory === category 
                ? 'bg-crd-green text-black' 
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFrames.map((frame) => (
          <Card
            key={frame.id}
            className={`p-4 cursor-pointer transition-all border ${
              selectedFrame === frame.id
                ? 'border-crd-green bg-crd-green/10'
                : 'border-white/20 bg-black/30 hover:border-crd-green/50'
            }`}
            onClick={() => handleFrameSelect(frame.id)}
          >
            <div className="space-y-3">
              {/* Frame Preview */}
              <div className="aspect-[5/7] bg-gradient-to-br from-gray-800 to-gray-900 rounded border flex items-center justify-center">
                <div 
                  className="w-full h-full rounded border-2 flex items-center justify-center text-xs text-gray-400"
                  style={{ 
                    borderColor: frame.template_data.borders.outer.color,
                    background: `linear-gradient(135deg, ${frame.template_data.colors.background}, ${frame.template_data.colors.primary}20)`
                  }}
                >
                  Preview
                </div>
              </div>

              {/* Frame Info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white text-sm">{frame.name}</h4>
                  {selectedFrame === frame.id && (
                    <Check className="w-4 h-4 text-crd-green" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">{frame.description}</p>
                
                {/* Effects Badges */}
                <div className="flex flex-wrap gap-1">
                  {frame.template_data.effects.holographic && (
                    <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                      <Sparkles className="w-2 h-2 mr-1" />
                      Holo
                    </Badge>
                  )}
                  {frame.template_data.effects.metallic && (
                    <Badge variant="secondary" className="text-xs bg-gray-500/20 text-gray-300">
                      Chrome
                    </Badge>
                  )}
                  {frame.template_data.effects.foil && (
                    <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-300">
                      Foil
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      {selectedFrame && (
        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            onClick={onComplete}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Continue to Effects
          </Button>
        </div>
      )}
    </div>
  );
};
