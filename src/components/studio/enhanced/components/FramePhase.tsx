
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Frame } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

interface FramePhaseProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  orientation: CardOrientation;
}

const LAYOUT_FRAMES = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    description: 'Traditional trading card layout with balanced proportions',
    category: 'Sports',
    layoutType: 'Standard',
    preview: {
      border: '4px solid #d4af37',
      borderRadius: '8px',
      background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, transparent 50%, rgba(212, 175, 55, 0.1) 100%)'
    }
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    description: 'Decorative frame with ornamental corner details',
    category: 'Vintage',
    layoutType: 'Decorative',
    preview: {
      border: '6px solid #8b4513',
      borderRadius: '12px',
      background: 'repeating-linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0px, transparent 2px, transparent 8px, rgba(139, 69, 19, 0.1) 10px)'
    }
  },
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    description: 'Minimalist layout with clean lines and subtle borders',
    category: 'Modern',
    layoutType: 'Minimal',
    preview: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '6px',
      background: 'rgba(255, 255, 255, 0.02)'
    }
  },
  {
    id: 'premium-elite',
    name: 'Premium Elite',
    description: 'Luxury frame design with enhanced border styling',
    category: 'Premium',
    layoutType: 'Luxury',
    preview: {
      border: '5px solid #ff4500',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, transparent 25%, rgba(255, 69, 0, 0.1) 50%, transparent 75%, rgba(255, 69, 0, 0.1) 100%)'
    }
  },
  {
    id: 'collector-edition',
    name: 'Collector Edition',
    description: 'Special edition frame for premium card collections',
    category: 'Collector',
    layoutType: 'Special',
    preview: {
      border: '4px solid #32cd32',
      borderRadius: '10px',
      background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1) 0%, transparent 50%, rgba(50, 205, 50, 0.1) 100%)'
    }
  },
  {
    id: 'championship',
    name: 'Championship',
    description: 'Tournament-style frame with competitive aesthetics',
    category: 'Tournament',
    layoutType: 'Competitive',
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
        <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-center">
          <Frame className="w-5 h-5 mr-2 text-crd-green" />
          Frame & Layout
        </h3>
        <p className="text-gray-400 text-sm">
          Choose a frame style that defines your card's border and layout aesthetic
        </p>
      </div>

      {/* Frame Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LAYOUT_FRAMES.map((frame) => {
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
                          LAYOUT<br/>PREVIEW
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
                    
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                        {frame.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300">
                        {frame.layoutType}
                      </Badge>
                    </div>
                    
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
              {LAYOUT_FRAMES.find(f => f.id === selectedFrame)?.name} frame is now applied to your card.
              This affects the border style and layout structure, while effects control the surface materials and lighting.
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
                Clean layout without border styling - effects will still apply to the card surface
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
