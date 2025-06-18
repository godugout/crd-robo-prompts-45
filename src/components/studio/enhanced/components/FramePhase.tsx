
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

interface FramePhaseProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  orientation: CardOrientation;
}

const FRAME_TEMPLATES = [
  {
    id: 'template1',
    name: 'Classic Sports',
    description: 'Traditional sports card frame with gold accent',
    category: 'Sports',
    preview: {
      border: '4px solid #d4af37',
      borderRadius: '8px',
      background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, transparent 50%, rgba(212, 175, 55, 0.1) 100%)'
    }
  },
  {
    id: 'template2',
    name: 'Vintage Ornate',
    description: 'Ornate vintage frame with brown wood finish',
    category: 'Vintage',
    preview: {
      border: '6px solid #8b4513',
      borderRadius: '12px',
      background: 'repeating-linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0px, transparent 2px, transparent 8px, rgba(139, 69, 19, 0.1) 10px)'
    }
  },
  {
    id: 'template3',
    name: 'Holographic Modern',
    description: 'Modern holographic frame with rainbow effects',
    category: 'Modern',
    preview: {
      border: '3px solid transparent',
      borderRadius: '10px',
      background: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #ff006e)',
      backgroundClip: 'padding-box'
    }
  },
  {
    id: 'template4',
    name: 'Donruss Special',
    description: 'Special edition frame with orange accent',
    category: 'Special',
    preview: {
      border: '5px solid #ff4500',
      borderRadius: '6px',
      background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, transparent 25%, rgba(255, 69, 0, 0.1) 50%, transparent 75%, rgba(255, 69, 0, 0.1) 100%)'
    }
  },
  {
    id: 'donruss-rookie',
    name: 'Rookie Edition',
    description: 'Special rookie card frame with green accent',
    category: 'Rookie',
    preview: {
      border: '4px solid #32cd32',
      borderRadius: '8px',
      background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1) 0%, transparent 50%, rgba(50, 205, 50, 0.1) 100%)'
    }
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    description: 'Metallic chrome frame with silver finish',
    category: 'Premium',
    preview: {
      border: '3px solid #c0c0c0',
      borderRadius: '8px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(192, 192, 192, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)'
    }
  }
];

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  orientation
}) => {
  const cardDimensions = calculateFlexibleCardSize(120, 160, orientation, 2.5, 0.4);

  const handleFrameSelect = (frameId: string) => {
    console.log('FramePhase - Frame selected:', frameId);
    onFrameSelect(frameId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Choose Your Frame</h3>
        <p className="text-gray-400 text-sm">
          Select a frame style that complements your card design
        </p>
      </div>

      {/* Frame Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FRAME_TEMPLATES.map((frame) => {
          const isSelected = selectedFrame === frame.id;
          
          return (
            <Card 
              key={frame.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'bg-crd-green/10 border-crd-green/50 shadow-lg shadow-crd-green/20' 
                  : 'bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/30'
              }`}
              onClick={() => handleFrameSelect(frame.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Frame Preview */}
                  <div className="flex-shrink-0">
                    <div
                      className="relative bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden shadow-lg"
                      style={{
                        width: cardDimensions.width,
                        height: cardDimensions.height,
                        ...frame.preview
                      }}
                    >
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-sm flex items-center justify-center">
                        <div className="text-white text-xs font-bold text-center">
                          PREVIEW
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Frame Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm truncate">
                        {frame.name}
                      </h4>
                      <div className="flex-shrink-0 ml-2">
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-crd-green" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className="text-xs mb-2 border-gray-500 text-gray-300"
                    >
                      {frame.category}
                    </Badge>
                    
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {frame.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Frame Info */}
      {selectedFrame && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-crd-green" />
              <span className="text-crd-green font-medium text-sm">Frame Applied</span>
            </div>
            <p className="text-gray-300 text-xs">
              {FRAME_TEMPLATES.find(f => f.id === selectedFrame)?.name} is now applied to your card preview.
              You can change frames at any time or proceed to add effects.
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Frame Option */}
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          !selectedFrame 
            ? 'bg-crd-green/10 border-crd-green/50' 
            : 'bg-black/20 border-white/10 hover:border-white/20'
        }`}
        onClick={() => handleFrameSelect('')}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium text-sm mb-1">No Frame</h4>
              <p className="text-gray-400 text-xs">
                Use your card without any frame overlay
              </p>
            </div>
            {!selectedFrame ? (
              <CheckCircle className="w-5 h-5 text-crd-green" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
