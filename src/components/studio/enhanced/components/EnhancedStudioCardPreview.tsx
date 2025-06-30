
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage } from '@react-three/drei';
import { Card3DMesh } from '../../advanced/components/Card3DMesh';
import { Loader2, AlertTriangle, Image as ImageIcon, Wand2, RotateCcw, Pause, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';

interface EnhancedStudioCardPreviewProps {
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues?: Record<string, any>;
  processedImage?: ProcessedImage | null;
  isProcessing?: boolean;
}

const FallbackCard: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[4, 5.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.2} />
      </mesh>
    </group>
  );
};

const ErrorBoundary: React.FC<{ 
  children: React.ReactNode; 
  onError: (error: Error) => void;
}> = ({ children, onError }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('🚨 3D Render Error:', error);
      setHasError(true);
      onError(new Error(error.message));
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 text-sm">3D Preview Error</p>
            <Button
              size="sm"
              onClick={() => setHasError(false)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export const EnhancedStudioCardPreview: React.FC<EnhancedStudioCardPreviewProps> = ({
  uploadedImage,
  selectedFrame,
  effectValues = {},
  processedImage,
  isProcessing = false
}) => {
  const [renderError, setRenderError] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [orbitControlsRef, setOrbitControlsRef] = useState<any>(null);

  console.log('🎨 EnhancedStudioCardPreview - Rendering with:', {
    uploadedImage: uploadedImage ? 'Present' : 'None',
    selectedFrame: selectedFrame || 'None',
    effectValues,
    activeEffectsCount: Object.keys(effectValues).length,
    processedImageValid: processedImage ? 'Present' : 'None',
    imageLoadError,
    renderError: !!renderError,
    rotationEnabled
  });

  // Convert effectValues to the format expected by Card3DMesh
  const convertEffectsForCard3D = useCallback((effects: Record<string, any>) => {
    const converted = {
      holographic: false,
      metalness: 0.1,
      roughness: 0.4,
      particles: false,
      glow: false,
      glowColor: '#00ffff',
      chrome: false,
      crystal: false,
      vintage: false
    };

    // Convert effect values to boolean/number format expected by 3D component
    Object.entries(effects).forEach(([effectId, effectData]) => {
      if (effectData && typeof effectData === 'object') {
        const intensity = effectData.intensity || 0;
        
        switch (effectId) {
          case 'holographic':
            converted.holographic = intensity > 0;
            break;
          case 'chrome':
            converted.chrome = intensity > 0;
            converted.metalness = Math.max(converted.metalness, intensity / 100);
            converted.roughness = Math.min(converted.roughness, 1 - (intensity / 100));
            break;
          case 'crystal':
            converted.crystal = intensity > 0;
            break;
          case 'gold':
            if (intensity > 0) {
              converted.chrome = true; // Use chrome effect for gold
              converted.metalness = Math.max(converted.metalness, 0.8);
              converted.roughness = Math.min(converted.roughness, 0.2);
            }
            break;
          case 'foilspray':
          case 'prizm':
            if (intensity > 0) {
              converted.holographic = true;
              converted.particles = intensity > 50;
            }
            break;
        }
      }
    });

    console.log('🔄 Converted effects for 3D:', { original: effects, converted });
    return converted;
  }, []);

  // Validate image before rendering
  const validateImage = useCallback(async (imageUrl: string): Promise<boolean> => {
    if (!imageUrl) return false;
    
    setIsImageLoading(true);
    setImageLoadError(false);
    
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn('🚨 Image validation timeout:', imageUrl);
        setImageLoadError(true);
        setIsImageLoading(false);
        resolve(false);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('✅ Image validated successfully:', imageUrl);
        setIsImageLoading(false);
        setImageLoadError(false);
        resolve(true);
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ Image validation failed:', imageUrl, error);
        setImageLoadError(true);
        setIsImageLoading(false);
        resolve(false);
      };
      
      img.src = imageUrl;
    });
  }, []);

  // Validate image when it changes
  useEffect(() => {
    if (uploadedImage) {
      validateImage(uploadedImage);
    }
  }, [uploadedImage, validateImage]);

  const handleRenderError = useCallback((error: Error) => {
    console.error('🚨 3D Preview render error:', error);
    setRenderError(error.message);
    toast.error('3D preview error occurred');
  }, []);

  const handleToggleRotation = () => {
    setRotationEnabled(!rotationEnabled);
    toast.info(`Auto-rotation ${!rotationEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleResetView = () => {
    if (orbitControlsRef) {
      orbitControlsRef.reset();
      toast.success('View reset to front');
    }
  };

  const createCardData = () => ({
    id: 'preview-card',
    title: 'Preview Card',
    description: 'Live preview of your card design',
    image_url: uploadedImage || '',
    rarity: 'common' as const,
    template_id: selectedFrame || '',
    tags: [],
    visibility: 'private' as const,
    creator_attribution: { collaboration_type: 'solo' as const },
    design_metadata: {},
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: { currency: 'USD' as const },
      distribution: { limited_edition: false }
    }
  });

  // Show loading state
  if (isProcessing || isImageLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 text-crd-green mx-auto mb-2 animate-spin" />
            <p className="text-white text-sm">
              {isProcessing ? 'Processing image...' : 'Validating image...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show image load error
  if (imageLoadError) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-red-400 font-semibold mb-2">Image Load Error</h3>
            <p className="text-red-300 text-sm mb-4">
              The uploaded image could not be loaded for 3D preview.
            </p>
            <div className="text-xs text-red-400 space-y-1">
              <div>• Check if the image file is corrupted</div>
              <div>• Try uploading a different image</div>
              <div>• Ensure stable internet connection</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show render error
  if (renderError) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Card className="bg-yellow-900/20 border-yellow-500/50">
          <CardContent className="p-6 text-center">
            <Wand2 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-yellow-400 font-semibold mb-2">Preview Unavailable</h3>
            <p className="text-yellow-300 text-sm mb-2">
              {renderError}
            </p>
            <Button
              size="sm"
              onClick={() => setRenderError('')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Retry Preview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show placeholder when no image
  if (!uploadedImage) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-8 text-center">
            <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">3D Preview</h3>
            <p className="text-gray-400 text-sm">
              Upload an image to see your card in stunning 3D
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const convertedEffects = convertEffectsForCard3D(effectValues);

  return (
    <div className="w-full h-full bg-black relative">
      {/* 3D Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleRotation}
          className="bg-black/80 border-white/20 text-white hover:bg-white/10"
        >
          {rotationEnabled ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {rotationEnabled ? 'Pause' : 'Rotate'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-black/80 border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <ErrorBoundary onError={handleRenderError}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Card className="bg-black/20 border-white/10">
              <CardContent className="p-6 text-center">
                <Loader2 className="w-8 h-8 text-crd-green mx-auto mb-2 animate-spin" />
                <p className="text-white text-sm">Loading 3D preview...</p>
              </CardContent>
            </Card>
          </div>
        }>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: 'high-performance'
            }}
          >
            <Stage environment="city" intensity={0.6}>
              <Card3DMesh
                cardData={createCardData()}
                imageUrl={uploadedImage}
                selectedFrame={selectedFrame}
                effects={convertedEffects}
                rotationEnabled={rotationEnabled}
              />
            </Stage>
            
            <OrbitControls
              ref={setOrbitControlsRef}
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>

      {/* Debug overlay in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/80 text-white text-xs p-2 rounded">
          <div>Image: {uploadedImage ? '✓' : '✗'}</div>
          <div>Frame: {selectedFrame ? '✓' : '✗'}</div>
          <div>Effects: {Object.keys(effectValues).length}</div>
          <div>Processed: {processedImage ? '✓' : '✗'}</div>
          <div>Rotation: {rotationEnabled ? 'On' : 'Off'}</div>
        </div>
      )}
    </div>
  );
};
