
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FlexibleMobilePanel } from './components/FlexibleMobilePanel';
import { MobileControlProvider, useMobileControl } from './context/MobileControlContext';
import { EffectProvider } from './contexts/EffectContext';
import { ViewerControlButtons } from './components/ViewerControlButtons';
import { Enhanced3DCardViewer } from '../3d/enhanced/Enhanced3DCardViewer';
import { Enhanced3DCardMesh } from './components/Enhanced3DCardMesh';
import { useCardInteraction } from './hooks/useCardInteraction';
import { useViewerEffects } from './hooks/useViewerEffects';
import { detectWebGLCapabilities } from '../3d/utils/webglDetection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { CardData } from '@/types/card';

interface EnhancedCardViewerProps {
  card: CardData;
  onDownload?: () => void;
  onShare?: () => void;
  cardDetails?: {
    id: string;
    title: string;
    description?: string;
    rarity: string;
    creator_name?: string;
    creator_verified?: boolean;
    price?: string;
    created_at: string;
    tags?: string[];
    view_count?: number;
    like_count?: number;
  };
  onLike?: () => void;
  onBookmark?: () => void;
  selectedFrame?: string;
  frameConfig?: any;
}

// Error boundary component
class ViewerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ViewerErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Enhanced Card Viewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold mb-4">Card Viewer Error</h2>
            <p className="text-gray-400 mb-4">
              Unable to load the card viewer. Please try refreshing the page.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Error: {this.state.error?.message}
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-crd-green text-black px-4 py-2 rounded-lg hover:bg-crd-green/90"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const EnhancedCardViewerContent: React.FC<EnhancedCardViewerProps> = ({
  card,
  onDownload,
  onShare,
  cardDetails,
  onLike,
  onBookmark,
  selectedFrame,
  frameConfig
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCardData, setCurrentCardData] = useState(card);
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [webgl3DSupported, setWebgl3DSupported] = useState(false);
  
  console.log('EnhancedCardViewer: Starting render', { card: card?.id, hasCard: !!card, selectedFrame });

  // Check 3D support on mount
  useEffect(() => {
    const capabilities = detectWebGLCapabilities();
    const supported = capabilities.supported && capabilities.performanceScore > 30;
    setWebgl3DSupported(supported);
    
    // Load user preference
    const saved = localStorage.getItem('crd-3d-enabled');
    if (saved && supported) {
      setIs3DEnabled(JSON.parse(saved));
    }
  }, []);

  // Initialize hooks with error handling
  let cardInteractionHook;
  let viewerEffectsHook;

  try {
    cardInteractionHook = useCardInteraction();
    console.log('EnhancedCardViewer: Card interaction hook loaded');
  } catch (error) {
    console.error('Failed to load card interaction hook:', error);
    throw new Error('Card interaction system failed to initialize');
  }

  try {
    viewerEffectsHook = useViewerEffects();
    console.log('EnhancedCardViewer: Viewer effects hook loaded');
  } catch (error) {
    console.error('Failed to load viewer effects hook:', error);
    throw new Error('Effects system failed to initialize');
  }

  const {
    isFlipped,
    rotation,
    zoom,
    isDragging,
    mousePosition,
    isHovering,
    cameraPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleClick
  } = cardInteractionHook;

  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    presetState,
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    handleSceneChange,
    handleLightingChange,
    handleMaterialSettingsChange,
    handleApplyCombo,
    setOverallBrightness,
    setInteractiveLighting
  } = viewerEffectsHook;

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleToggle3D = () => {
    const newState = !is3DEnabled;
    setIs3DEnabled(newState);
    localStorage.setItem('crd-3d-enabled', JSON.stringify(newState));
    toast.success(`Switched to ${newState ? '3D' : '2D'} view`);
  };

  const handleReset = () => {
    // Reset camera and interactions
    resetAllEffects();
    toast.success('View reset');
  };

  const handleCardImageUpdate = (imageBlob: Blob) => {
    const imageUrl = URL.createObjectURL(imageBlob);
    setCurrentCardData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
    toast.success('Card image updated! The new image is now displayed in the viewer.');
  };

  if (!card) {
    console.warn('EnhancedCardViewer: No card provided');
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>Loading card...</p>
      </div>
    );
  }

  console.log('EnhancedCardViewer: Rendering card:', card.id, 'Image URL:', card.image_url);

  const effectContextValue = {
    effectValues,
    mousePosition,
    isHovering,
    showEffects: true,
    materialSettings,
    interactiveLighting,
    effectIntensity: [80],
    handleEffectChange,
    resetEffect: () => {},
    resetAllEffects
  };

  return (
    <ViewerErrorBoundary>
      <div className={cn(
        "relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex",
        isFullscreen && "fixed inset-0 z-50"
      )}>
        {/* Main Viewer Area */}
        <div className="flex-1 relative">
          <ViewerControlButtons 
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            is3DEnabled={is3DEnabled}
            onToggle3D={webgl3DSupported ? handleToggle3D : undefined}
            onReset={handleReset}
            webgl3DSupported={webgl3DSupported}
          />

          {/* 3D Enhanced Viewer */}
          {is3DEnabled && webgl3DSupported ? (
            <Enhanced3DCardViewer
              card={currentCardData}
              className="w-full h-full"
              autoEnable={false}
              onModeChange={(enabled) => {
                if (!enabled) {
                  setIs3DEnabled(false);
                  toast.info('Switched to 2D view due to performance');
                }
              }}
              fallbackComponent={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="relative max-w-md">
                    <img
                      src={currentCardData.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'}
                      alt={currentCardData.title}
                      className="w-full h-auto rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              }
            />
          ) : (
            /* Original 2D Canvas Viewer */
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              className="w-full h-full"
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
              }}
              onCreated={({ gl, scene, camera }) => {
                gl.setClearColor('#000000', 0);
                console.log('Canvas created successfully');
              }}
            >
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={12}
                autoRotate={false}
                autoRotateSpeed={0.5}
              />
              
              {/* Enhanced lighting setup for better metallic reflections */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <directionalLight position={[-10, -10, -5]} intensity={0.4} />
              <pointLight position={[0, 0, 10]} intensity={0.8} />
              <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
              <pointLight position={[-5, -5, 5]} intensity={0.6} color="#ffffff" />
              
              <EffectProvider value={effectContextValue}>
                <Enhanced3DCardMesh 
                  card={currentCardData}
                  rotation={rotation}
                  zoom={zoom}
                  materialSettings={materialSettings}
                  selectedFrame={selectedFrame}
                  frameConfig={frameConfig}
                  quality="high"
                  mousePosition={mousePosition}
                />
              </EffectProvider>
            </Canvas>
          )}
        </div>

        {/* Flexible Panel */}
        <div className="w-80 h-full">
          <FlexibleMobilePanel
            card={currentCardData}
            cardDetails={cardDetails}
            effectValues={effectValues}
            onEffectChange={handleEffectChange}
            onResetAllEffects={resetAllEffects}
            overallBrightness={overallBrightness}
            onBrightnessChange={setOverallBrightness}
            interactiveLighting={interactiveLighting}
            onInteractiveLightingToggle={setInteractiveLighting}
            materialSettings={materialSettings}
            onMaterialSettingsChange={handleMaterialSettingsChange}
            onLike={onLike}
            onBookmark={onBookmark}
            onShare={onShare}
            onDownload={onDownload}
            onCardImageUpdate={handleCardImageUpdate}
          />
        </div>
      </div>
    </ViewerErrorBoundary>
  );
};

export const EnhancedCardViewer: React.FC<EnhancedCardViewerProps> = (props) => {
  console.log('EnhancedCardViewer: Wrapper component rendering');
  
  return (
    <MobileControlProvider>
      <EnhancedCardViewerContent {...props} />
    </MobileControlProvider>
  );
};
