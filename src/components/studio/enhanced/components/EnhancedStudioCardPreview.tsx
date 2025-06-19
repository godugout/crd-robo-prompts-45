
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage } from '@react-three/drei';
import { Card3DMesh } from '../../advanced/components/Card3DMesh';
import { Loader2, AlertTriangle, Image as ImageIcon, Wand2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BlobUrlManager {
  url: string;
  isValid: boolean;
  lastValidated: number;
  originalFile?: { name: string; size: number; type: string };
}

interface EnhancedStudioCardPreviewProps {
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues?: Record<string, any>;
  blobManager?: BlobUrlManager | null;
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
  blobManager
}) => {
  const [renderError, setRenderError] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  console.log('🎨 EnhancedStudioCardPreview - Rendering with:', {
    uploadedImage: uploadedImage ? 'Present' : 'None',
    selectedFrame: selectedFrame || 'None',
    effectValues,
    activeEffectsCount: Object.keys(effectValues).length,
    blobManagerValid: blobManager?.isValid,
    imageLoadError,
    renderError: !!renderError
  });

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

  // Monitor blob URL health
  useEffect(() => {
    if (uploadedImage && blobManager && !blobManager.isValid) {
      setRenderError('Image file is no longer accessible');
      toast.error('Image became unavailable during editing');
    } else {
      setRenderError('');
    }
  }, [uploadedImage, blobManager]);

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
  if (isImageLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 text-crd-green mx-auto mb-2 animate-spin" />
            <p className="text-white text-sm">Validating image...</p>
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

  return (
    <div className="w-full h-full bg-black relative">
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
                effects={{
                  holographic: effectValues.holographic?.intensity > 0,
                  metalness: (effectValues.metallic?.intensity || 0) / 100,
                  roughness: 1 - ((effectValues.glossy?.intensity || 0) / 100),
                  particles: effectValues.particles?.intensity > 0,
                  glow: effectValues.glow?.intensity > 0,
                  glowColor: effectValues.glow?.color || '#00ffff',
                  chrome: effectValues.chrome?.intensity > 0,
                  crystal: effectValues.crystal?.intensity > 0,
                  vintage: effectValues.vintage?.intensity > 0
                }}
              />
            </Stage>
            
            <OrbitControls
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
          <div>Valid: {blobManager?.isValid ? '✓' : '✗'}</div>
        </div>
      )}
    </div>
  );
};
