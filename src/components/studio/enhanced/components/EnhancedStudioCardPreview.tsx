
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Camera } from 'lucide-react';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';
import { GradingLabel } from './GradingLabel';
import { Advanced3DCardRenderer } from '@/components/studio/advanced/Advanced3DCardRenderer';
import { FrameOverlay } from './FrameOverlay';
import { CardEffectsLayer } from './CardEffectsLayer';
import { CardEffectOverlays } from './CardEffectOverlays';
import { DebugEffectValues } from './DebugEffectValues';

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
  const cardDimensions = calculateFlexibleCardSize(320, 450, orientation, 2.5, 0.4);

  console.log('🎨 EnhancedStudioCardPreview - Rendering with:', {
    uploadedImage: uploadedImage ? 'Present' : 'None',
    selectedFrame: selectedFrame || 'None',
    effectValues,
    activeEffectsCount: Object.keys(effectValues).filter(k => effectValues[k]?.intensity > 0).length
  });

  // Create card data for the 3D renderer
  const cardData = {
    id: 'preview-card',
    title: cardName || 'Your Card',
    description: 'Professional graded card with enhanced effects',
    image_url: uploadedImage,
    template_id: selectedFrame || 'premium',
    rarity: 'legendary' as const,
    tags: ['3d-preview', 'enhanced'],
    edition_size: 1,
    visibility: 'private' as const,
    creator_attribution: {
      creator_name: 'CRD Studio User',
      collaboration_type: 'solo' as const
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: {
        currency: 'USD'
      }
    },
    design_metadata: {
      effects: Object.fromEntries(
        Object.entries(effectValues).map(([key, value]) => [
          key, 
          typeof value === 'object' && value.intensity ? value.intensity / 100 : 0
        ])
      )
    }
  };

  // Create effects configuration for the 3D renderer
  const create3DEffects = () => {
    const effects: any = {};
    
    if (effectValues.holographic?.intensity > 0) {
      effects.holographic = true;
    }
    if (effectValues.chrome?.intensity > 0) {
      effects.metalness = effectValues.chrome.intensity / 100;
      effects.chrome = true;
    }
    if (effectValues.crystal?.intensity > 0) {
      effects.particles = true;
      effects.glow = true;
      effects.glowColor = '#ffffff';
      effects.crystal = true;
    }
    if (effectValues.gold?.intensity > 0) {
      effects.metalness = 0.8;
      effects.roughness = 0.2;
    }
    if (effectValues.prizm?.intensity > 0) {
      effects.holographic = true;
    }
    if (effectValues.foilspray?.intensity > 0) {
      effects.metalness = 0.6;
    }

    return effects;
  };

  // If 3D preview is enabled and we have an image, use the Advanced3DCardRenderer
  if (show3DPreview && uploadedImage) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[800px] p-6">
        <style>
          {`
          @keyframes holographic-shift {
            0% { filter: hue-rotate(0deg) saturate(1.2); }
            25% { filter: hue-rotate(90deg) saturate(1.4); }
            50% { filter: hue-rotate(180deg) saturate(1.6); }
            75% { filter: hue-rotate(270deg) saturate(1.4); }
            100% { filter: hue-rotate(360deg) saturate(1.2); }
          }
          `}
        </style>

        {/* Large 3D WebGL Renderer with proper z-index stacking */}
        <div className="w-full max-w-5xl h-[700px] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
          <Advanced3DCardRenderer
            cardData={cardData}
            imageUrl={uploadedImage}
            effects={create3DEffects()}
            onInteraction={(type, data) => {
              console.log('3D Card Interaction:', type, data);
            }}
          />
        </div>

        {/* Enhanced Info Below 3D Card - proper z-index */}
        <div className="mt-6 text-center bg-black/40 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/10 max-w-2xl relative z-20">
          <div className="text-white text-lg font-bold mb-2">
            Professional 3D Card Experience • CRD Enhanced
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Interactive 3D View • Drag to rotate • Scroll to zoom • Effects: {Object.keys(effectValues).filter(k => effectValues[k]?.intensity > 0).length} active
          </div>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-crd-green rounded-full mr-2"></div>
              Premium Materials
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Holographic Effects
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Real-time Lighting
            </span>
          </div>
        </div>

        {/* Debug Component */}
        <div className="mt-4 w-full max-w-2xl">
          <DebugEffectValues 
            effectValues={effectValues}
            selectedFrame={selectedFrame}
            uploadedImage={uploadedImage}
          />
        </div>
      </div>
    );
  }

  // Enhanced 2D preview with proper layer stacking and effect application
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
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes crystal-glow {
          0%, 100% { box-shadow: inset 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: inset 0 0 40px rgba(255,255,255,0.3); }
        }
        `}
      </style>

      {/* Professional Card Slab Container - Base Layer (z-index: 1) */}
      <div 
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-white/30 rounded-2xl p-6 shadow-2xl relative z-10"
        style={{
          width: Math.max(cardDimensions.width + 80, 400),
        }}
      >
        {/* Grading Label at Top - Layer 2 */}
        <div className="mb-6 relative z-20">
          <GradingLabel 
            cardName={cardName}
            overallGrade={9.5}
            centeringGrade={9}
            cornersGrade={10}
            edgesGrade={9}
            surfaceGrade={10}
          />
        </div>

        {/* Card Area - Layer 3 */}
        <div className="flex justify-center relative z-30">
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
                  {/* Layer 1: Base Image with Effects (z-index: 10) */}
                  <div className="absolute inset-0" style={{ zIndex: 10 }}>
                    <CardEffectsLayer effectValues={effectValues}>
                      <img 
                        src={uploadedImage} 
                        alt="Card content"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </CardEffectsLayer>
                  </div>
                  
                  {/* Layer 2: Additional Effect Overlays (z-index: 15) */}
                  <div className="absolute inset-0" style={{ zIndex: 15 }}>
                    <CardEffectOverlays effectValues={effectValues} />
                  </div>
                  
                  {/* Layer 3: Frame Overlay (z-index: 25) */}
                  {selectedFrame && (
                    <div className="absolute inset-0" style={{ zIndex: 25 }}>
                      <FrameOverlay 
                        frameId={selectedFrame} 
                        width={cardDimensions.width} 
                        height={cardDimensions.height} 
                      />
                    </div>
                  )}
                  
                  {/* Layer 4: Text/UI Overlays (z-index: 30+) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 rounded-lg" style={{ zIndex: 30 }} />
                  
                  <div className="absolute bottom-3 left-3 right-3" style={{ zIndex: 40 }}>
                    <p className="text-gray-200 text-xs truncate drop-shadow-lg">
                      Frame: {selectedFrame || 'None'} • Effects: {Object.keys(effectValues).filter(k => effectValues[k]?.intensity > 0).length} active
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-lg border-2 border-dashed border-white/30 flex flex-col items-center justify-center relative z-10">
                  <div className="text-center text-white/80 max-w-xs px-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-crd-green" />
                    </div>
                    <h3 className="text-sm font-bold mb-2">No Image Uploaded</h3>
                    <p className="text-xs mb-3 text-white/70">
                      Upload an image in the Upload phase to see your card preview
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Protective Case Bottom - Layer 2 */}
        <div className="mt-4 text-center relative z-20">
          <div className="text-xs text-gray-400 mb-1">
            Professional Card Grading Service
          </div>
          <div className="text-xs text-crd-green font-bold">
            AUTHENTICATED • PROTECTED • PRESERVED
          </div>
        </div>

        {/* Corner Security Elements - Top Layer */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-crd-green/50 rounded-tl-lg z-50" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-crd-green/50 rounded-tr-lg z-50" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-crd-green/50 rounded-bl-lg z-50" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-crd-green/50 rounded-br-lg z-50" />
      </div>

      {/* Debug Component */}
      <div className="mt-6 w-full max-w-2xl">
        <DebugEffectValues 
          effectValues={effectValues}
          selectedFrame={selectedFrame}
          uploadedImage={uploadedImage}
        />
      </div>

      {/* Slab Info - Outside main container */}
      <div className="mt-4 text-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 relative z-60">
        <div className="text-white text-sm font-medium">
          Professional Graded Slab • CRD Certified
        </div>
        <div className="text-gray-400 text-xs mt-1">
          Dimensions: {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
          {Object.keys(effectValues).filter(k => effectValues[k]?.intensity > 0).length > 0 && (
            <span className="ml-2 text-crd-green">• {Object.keys(effectValues).filter(k => effectValues[k]?.intensity > 0).length} Effects Active</span>
          )}
          {show3DPreview && (
            <span className="ml-2 text-purple-400">• Enable 3D with image upload</span>
          )}
        </div>
      </div>
    </div>
  );
};
