import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Camera } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';
import { GradingLabel } from './GradingLabel';
import { toast } from 'sonner';

interface EnhancedStudioCardPreviewProps {
  uploadedImage?: string;
  selectedFrame?: string;
  orientation: CardOrientation;
  show3DPreview: boolean;
  cardName: string;
  effectValues: Record<string, Record<string, any>>;
  onImageUpload?: (imageUrl: string) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload?.(imageUrl);
      toast.success('Image uploaded successfully!');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

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
      transforms.push('perspective(1000px) rotateX(2deg) rotateY(-2deg)');
      
      if (hasActiveEffects) {
        styles.boxShadow = '0 25px 50px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.1)';
      } else {
        styles.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
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

  const cardDimensions = calculateFlexibleCardSize(320, 450, orientation, 2.5, 0.4);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] p-6">
      <style>
        {`
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
        `}
      </style>

      {/* Professional Card Slab Container */}
      <div 
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl p-6 shadow-2xl relative"
        style={{
          width: Math.max(cardDimensions.width + 80, 400),
          ...generateEffectStyles()
        }}
      >
        {/* Grading Label at Top */}
        <div className="mb-6">
          <GradingLabel 
            cardName={cardName}
            overallGrade={9.5}
            centeringGrade={9}
            cornersGrade={10}
            edgesGrade={9}
            surfaceGrade={10}
          />
        </div>

        {/* Card Area */}
        <div className="flex justify-center">
          <Card 
            className="bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800 border-white/20 rounded-xl overflow-hidden shadow-xl relative"
            style={{
              width: cardDimensions.width,
              height: cardDimensions.height,
            }}
          >
            <div className="relative w-full h-full p-4">
              {uploadedImage ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden group">
                  <img 
                    src={uploadedImage} 
                    alt="Card content"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Effect overlays */}
                  {Object.keys(effectValues).length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Dynamic effect overlays based on active effects */}
                      {effectValues.holographic?.intensity > 0 && (
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(45deg, 
                              rgba(255, 0, 150, ${effectValues.holographic.intensity / 300}) 0%, 
                              rgba(0, 255, 255, ${effectValues.holographic.intensity / 300}) 25%, 
                              rgba(255, 255, 0, ${effectValues.holographic.intensity / 300}) 50%, 
                              rgba(255, 0, 150, ${effectValues.holographic.intensity / 300}) 75%, 
                              rgba(0, 255, 255, ${effectValues.holographic.intensity / 300}) 100%)`,
                            backgroundSize: '400% 400%',
                            animation: effectValues.holographic.animated ? 'gradient-shift 3s ease infinite' : 'none'
                          }}
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Base gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Card Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <p className="text-gray-200 text-xs truncate drop-shadow-lg">
                      Frame: {selectedFrame || 'Default'} • Effects: {Object.keys(effectValues).length > 0 ? 'Active' : 'None'}
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full rounded-lg border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-crd-green/50 hover:bg-crd-green/5"
                  onClick={triggerFileSelect}
                >
                  <div className="text-center text-white/80 max-w-xs px-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-crd-green" />
                    </div>
                    <h3 className="text-sm font-bold mb-2">Add Your Image</h3>
                    <p className="text-xs mb-3 text-white/70">
                      Upload to start creating
                    </p>
                    <Button 
                      className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-4 py-1 rounded-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileSelect();
                      }}
                    >
                      <Camera className="w-3 h-3 mr-1" />
                      Browse
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Protective Case Bottom */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400 mb-1">
            Professional Card Grading Service
          </div>
          <div className="text-xs text-crd-green font-bold">
            AUTHENTICATED • PROTECTED • PRESERVED
          </div>
        </div>

        {/* Corner Security Elements */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-crd-green/50 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-crd-green/50 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-crd-green/50 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-crd-green/50 rounded-br-lg" />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Slab Info */}
      <div className="mt-4 text-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
        <div className="text-white text-sm font-medium">
          Professional Graded Slab • CRD Certified
        </div>
        <div className="text-gray-400 text-xs mt-1">
          Dimensions: {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
          {Object.keys(effectValues).length > 0 && (
            <span className="ml-2 text-crd-green">• Enhanced</span>
          )}
        </div>
      </div>
    </div>
  );
};
