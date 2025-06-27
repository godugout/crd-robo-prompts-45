
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Maximize, Download } from 'lucide-react';

interface CardPreviewAreaProps {
  template?: string;
  uploadedImage?: string | null;
  cardData: {
    title: string;
    description: string;
    rarity: string;
    effects: {
      holographic: number;
      metallic: number;
      chrome: number;
      particles: boolean;
    };
  };
  effects: {
    holographic: number;
    metallic: number;
    chrome: number;
    particles: boolean;
  };
}

export const CardPreviewArea: React.FC<CardPreviewAreaProps> = ({
  template,
  uploadedImage,
  cardData,
  effects
}) => {
  const getEffectStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (effects.holographic > 0) {
      styles.background = `linear-gradient(45deg, 
        rgba(255,0,255,${effects.holographic * 0.3}), 
        rgba(0,255,255,${effects.holographic * 0.3}), 
        rgba(255,255,0,${effects.holographic * 0.3}))`;
      styles.backgroundBlendMode = 'overlay';
    }
    
    if (effects.metallic > 0) {
      styles.filter = `sepia(${effects.metallic * 0.5}) saturate(${1 + effects.metallic}) brightness(${1 + effects.metallic * 0.3})`;
    }
    
    if (effects.chrome > 0) {
      styles.border = `2px solid rgba(255,255,255,${effects.chrome * 0.8})`;
      styles.boxShadow = `0 0 20px rgba(255,255,255,${effects.chrome * 0.5})`;
    }
    
    return styles;
  };

  return (
    <div className="space-y-4">
      {/* Preview Card Container */}
      <div className="relative">
        <div 
          className="aspect-[3/4] w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-600 overflow-hidden relative transition-all duration-300"
          style={getEffectStyles()}
        >
          {/* Background Image */}
          {uploadedImage && (
            <img 
              src={uploadedImage} 
              alt="Card background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Template Overlay */}
          {template && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          )}
          
          {/* Card Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-bold mb-1 line-clamp-1">
              {cardData.title || 'Card Title'}
            </h3>
            <p className="text-sm text-gray-200 line-clamp-2 mb-2">
              {cardData.description || 'Card description will appear here'}
            </p>
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`text-xs border-white/50 ${
                  cardData.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                  cardData.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                  cardData.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                  'text-white'
                }`}
              >
                {cardData.rarity}
              </Badge>
              {effects.particles && (
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-crd-green rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Placeholder when no content */}
          {!uploadedImage && !template && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🎴</span>
                </div>
                <p className="text-sm">Your card preview will appear here</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Preview Controls */}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-black/50 border-white/20 hover:bg-black/70"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-black/50 border-white/20 hover:bg-black/70"
          >
            <Maximize className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
