
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Camera, Upload } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

interface EnhancedStudioCardPreviewProps {
  uploadedImage?: string;
  selectedFrame?: string;
  orientation: CardOrientation;
  show3DPreview: boolean;
  cardName: string;
  effectValues: Record<string, Record<string, any>>;
  onImageUpload?: () => void;
}

export const EnhancedStudioCardPreview: React.FC<EnhancedStudioCardPreviewProps> = ({
  uploadedImage,
  selectedFrame,
  orientation,
  show3DPreview,
  cardName,
  effectValues,
  onImageUpload
}) => {
  const cardDimensions = calculateFlexibleCardSize(400, 500, orientation, 3, 0.5);

  // Generate effect styles based on active effects
  const generateEffectStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    const filters: string[] = [];
    const transforms: string[] = [];
    let hasActiveEffects = false;

    // Holographic effect
    if (effectValues.holographic?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.holographic.intensity / 100;
      filters.push(`hue-rotate(${(effectValues.holographic.shiftSpeed || 100) * 0.01 * 360}deg)`);
      filters.push(`saturate(${1 + intensity * 0.5})`);
      
      if (effectValues.holographic.animated) {
        styles.animation = `holographic-shift ${2 / (effectValues.holographic.shiftSpeed || 100) * 100}s linear infinite`;
      }
    }

    // Chrome effect
    if (effectValues.chrome?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.chrome.intensity / 100;
      filters.push(`contrast(${1 + intensity * 0.3})`);
      filters.push(`brightness(${1 + intensity * 0.2})`);
    }

    // Crystal effect
    if (effectValues.crystal?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.crystal.intensity / 100;
      filters.push(`brightness(${1 + intensity * 0.3})`);
      filters.push(`contrast(${1 + intensity * 0.4})`);
      
      if (effectValues.crystal.sparkle) {
        styles.boxShadow = `inset 0 0 ${20 * intensity}px rgba(255, 255, 255, ${0.3 * intensity})`;
      }
    }

    // Gold effect
    if (effectValues.gold?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.gold.intensity / 100;
      filters.push(`sepia(${intensity * 0.8})`);
      filters.push(`saturate(${1 + intensity * 0.5})`);
      filters.push(`hue-rotate(${effectValues.gold.goldTone === 'rose' ? '30deg' : '45deg'})`);
      
      if (effectValues.gold.colorEnhancement) {
        filters.push(`brightness(${1 + intensity * 0.1})`);
      }
    }

    // Vintage effect
    if (effectValues.vintage?.intensity > 0) {
      hasActiveEffects = true;
      const intensity = effectValues.vintage.intensity / 100;
      filters.push(`sepia(${intensity * 0.6})`);
      filters.push(`contrast(${1 - intensity * 0.2})`);
      filters.push(`brightness(${1 - intensity * 0.1})`);
    }

    // Apply 3D transform if enabled
    if (show3DPreview) {
      transforms.push('perspective(1000px) rotateX(5deg) rotateY(-5deg)');
      
      if (hasActiveEffects) {
        styles.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.1)';
      }
    }

    if (filters.length > 0) {
      styles.filter = filters.join(' ');
    }
    
    if (transforms.length > 0) {
      styles.transform = transforms.join(' ');
    }

    styles.transition = 'all 0.3s ease';
    
    return styles;
  };

  const effectOverlays = () => {
    const overlays: React.ReactNode[] = [];

    // Holographic overlay
    if (effectValues.holographic?.intensity > 0) {
      const intensity = effectValues.holographic.intensity / 100;
      overlays.push(
        <div
          key="holographic"
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `linear-gradient(45deg, 
              rgba(255, 0, 150, ${intensity * 0.3}) 0%, 
              rgba(0, 255, 255, ${intensity * 0.3}) 25%, 
              rgba(255, 255, 0, ${intensity * 0.3}) 50%, 
              rgba(255, 0, 150, ${intensity * 0.3}) 75%, 
              rgba(0, 255, 255, ${intensity * 0.3}) 100%)`,
            backgroundSize: '400% 400%',
            animation: effectValues.holographic.animated ? 'gradient-shift 3s ease infinite' : 'none'
          }}
        />
      );
    }

    // Chrome reflection overlay
    if (effectValues.chrome?.intensity > 0) {
      const intensity = effectValues.chrome.intensity / 100;
      overlays.push(
        <div
          key="chrome"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, ${intensity * 0.4}) 0%, 
              transparent 30%, 
              transparent 70%, 
              rgba(255, 255, 255, ${intensity * 0.2}) 100%)`,
            opacity: 0.6
          }}
        />
      );
    }

    // Crystal facets overlay
    if (effectValues.crystal?.intensity > 0 && effectValues.crystal.sparkle) {
      const intensity = effectValues.crystal.intensity / 100;
      overlays.push(
        <div
          key="crystal"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${intensity * 0.6}) 0%, transparent 50%),
                        radial-gradient(circle at 70% 20%, rgba(255, 255, 255, ${intensity * 0.4}) 0%, transparent 40%),
                        radial-gradient(circle at 50% 80%, rgba(255, 255, 255, ${intensity * 0.5}) 0%, transparent 30%)`,
            animation: 'sparkle 2s ease-in-out infinite alternate'
          }}
        />
      );
    }

    return overlays;
  };

  return (
    <div className="relative flex items-center justify-center min-h-[400px] p-4">
      <style jsx>{`
        @keyframes holographic-shift {
          0% { filter: hue-rotate(0deg) saturate(1.2); }
          25% { filter: hue-rotate(90deg) saturate(1.4); }
          50% { filter: hue-rotate(180deg) saturate(1.6); }
          75% { filter: hue-rotate(270deg) saturate(1.4); }
          100% { filter: hue-rotate(360deg) saturate(1.2); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes sparkle {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
      
      <Card 
        className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-crd-green/20 relative"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          ...generateEffectStyles()
        }}
      >
        <div className="relative w-full h-full p-6">
          {uploadedImage ? (
            <div className="relative w-full h-full rounded-2xl overflow-hidden group">
              <img 
                src={uploadedImage} 
                alt="Card content"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Effect overlays */}
              {effectOverlays()}
              
              {/* Base gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              
              {/* Card Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-white text-xl font-bold mb-1 truncate drop-shadow-lg">
                  {cardName || 'Your Card'}
                </h3>
                <p className="text-gray-200 text-sm truncate drop-shadow-lg">
                  Frame: {selectedFrame || 'Default'} • Effects: Active
                </p>
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-crd-green/50 hover:bg-crd-green/5"
              onClick={onImageUpload}
            >
              <div className="text-center text-white/80 max-w-xs px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-crd-green" />
                </div>
                <h3 className="text-lg font-bold mb-2">Add Your Image</h3>
                <p className="text-sm mb-4 text-white/70">
                  Upload your photo to start creating
                </p>
                <Button 
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-6 py-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageUpload?.();
                  }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <p className="text-xs text-white/50 mt-3">
                  Supports JPG, PNG, WebP • Up to 50MB
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Dimension Info */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
        <div className="text-white text-xs font-medium">
          {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
          {Object.values(effectValues).some(effect => effect.intensity > 0) && (
            <span className="ml-2 text-crd-green">• Effects Active</span>
          )}
        </div>
      </div>
    </div>
  );
};
