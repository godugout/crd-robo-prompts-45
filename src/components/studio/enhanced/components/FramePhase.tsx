
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
    description: 'Traditional gold border with championship styling',
    category: 'Sports',
    layoutType: 'Standard',
    preview: {
      border: '4px solid #d4af37',
      borderRadius: '8px',
      background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, transparent 50%, rgba(212, 175, 55, 0.1) 100%)',
      boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.3)'
    },
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    description: 'Decorative brown frame with ornamental corner details',
    category: 'Vintage',
    layoutType: 'Decorative',
    preview: {
      border: '6px solid #8b4513',
      borderRadius: '12px',
      background: 'repeating-linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0px, transparent 2px, transparent 8px, rgba(139, 69, 19, 0.1) 10px)',
      boxShadow: 'inset 0 0 15px rgba(139, 69, 19, 0.4)'
    },
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
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
      background: 'rgba(255, 255, 255, 0.02)',
      boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.1)'
    },
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  },
  {
    id: 'premium-elite',
    name: 'Premium Elite',
    description: 'Luxury orange frame with enhanced border styling',
    category: 'Premium',
    layoutType: 'Luxury',
    preview: {
      border: '5px solid #ff4500',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, transparent 25%, rgba(255, 69, 0, 0.1) 50%, transparent 75%, rgba(255, 69, 0, 0.1) 100%)',
      boxShadow: 'inset 0 0 20px rgba(255, 69, 0, 0.3), 0 0 15px rgba(255, 69, 0, 0.2)'
    },
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  },
  {
    id: 'collector-edition',
    name: 'Collector Edition',
    description: 'Special edition green frame for premium collections',
    category: 'Collector',
    layoutType: 'Special',
    preview: {
      border: '4px solid #32cd32',
      borderRadius: '10px',
      background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1) 0%, transparent 50%, rgba(50, 205, 50, 0.1) 100%)',
      boxShadow: 'inset 0 0 18px rgba(50, 205, 50, 0.3)'
    },
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  },
  {
    id: 'championship',
    name: 'Championship',
    description: 'Tournament-style silver frame with star emblems',
    category: 'Tournament',
    layoutType: 'Competitive',
    preview: {
      border: '4px solid #c0c0c0',
      borderRadius: '8px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(192, 192, 192, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
      boxShadow: 'inset 0 0 15px rgba(192, 192, 192, 0.4)'
    },
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
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
          Frame & Layout Selection
        </h3>
        <p className="text-gray-400 text-sm">
          Choose a frame style that defines your card's border and layout aesthetic
        </p>
      </div>

      {/* Frame Selection Grid with Enhanced Previews */}
      <div className="grid grid-cols-1 gap-4">
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
                <div className="flex items-start gap-4">
                  {/* Enhanced Frame Preview with Actual Thumbnail */}
                  <div className="flex-shrink-0">
                    <div
                      className="relative bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden shadow-lg"
                      style={{
                        width: cardDimensions.width,
                        height: cardDimensions.height,
                        ...frame.preview
                      }}
                    >
                      {/* Sample thumbnail image */}
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-sm overflow-hidden">
                        <img 
                          src={frame.thumbnail}
                          alt={`${frame.name} preview`}
                          className="w-full h-full object-cover opacity-70"
                          onError={(e) => {
                            // Fallback to gradient if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Frame overlay to show effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        
                        {/* Sample card title area */}
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="bg-black/70 backdrop-blur-sm rounded text-white text-xs px-1 py-0.5 text-center">
                            <div className="font-bold text-xs truncate">SAMPLE CARD</div>
                            <div className="text-xs opacity-75">{frame.category}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Frame-specific decorative elements */}
                      {frame.id === 'championship' && (
                        <>
                          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80" />
                          <div className="absolute bottom-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
                          <div className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full opacity-80" />
                        </>
                      )}
                      
                      {frame.id === 'classic-sports' && (
                        <>
                          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-400 opacity-90" />
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 opacity-90" />
                          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-400 opacity-90" />
                          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-yellow-400 opacity-90" />
                        </>
                      )}
                      
                      {frame.id === 'premium-elite' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse" />
                      )}
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
                    
                    {isSelected && (
                      <div className="mt-2 text-xs text-crd-green font-medium">
                        ✓ Currently Applied
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Frame Confirmation */}
      {selectedFrame && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-crd-green" />
              <span className="text-crd-green font-medium text-sm">Frame Applied Successfully</span>
            </div>
            <p className="text-gray-300 text-xs">
              {LAYOUT_FRAMES.find(f => f.id === selectedFrame)?.name} frame is now applied to your card.
              You can see the frame styling in the 3D preview on the right.
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Frame Option */}
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          !selectedFrame 
            ? 'bg-crd-green/10 border-crd-green/50 ring-2 ring-crd-green/20' 
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
