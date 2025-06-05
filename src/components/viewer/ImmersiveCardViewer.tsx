
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Settings, 
  Download, 
  Share, 
  RotateCcw, 
  Zap, 
  Palette, 
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { QuickComboPresets } from './components/QuickComboPresets';
import { EnhancedEffectControls } from './components/EnhancedEffectControls';
import { EnvironmentComboSection } from './components/EnvironmentComboSection';
import { LightingComboSection } from './components/LightingComboSection';
import { MaterialComboSection } from './components/MaterialComboSection';
import { useEnhancedCardEffects, type EffectValues } from './hooks/useEnhancedCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import type { CardData } from '@/types/card';

interface ImmersiveCardViewerProps {
  card?: CardData;
  cards?: CardData[];
  currentCardIndex?: number;
  onCardChange?: (newIndex: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample card data for demonstration if no card provided
  const defaultCard: CardData = {
    id: 'demo-card',
    title: 'Sample CRD Card',
    description: 'Experience different 3D interaction modes with this demo card. Try switching between modes to see how each one feels!',
    rarity: 'epic',
    tags: ['demo', '3d', 'interactive'],
    design_metadata: {},
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Demo Creator',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  };

  const currentCard = card || defaultCard;
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Enhanced card effects hook
  const { 
    effectValues, 
    handleEffectChange, 
    resetAllEffects, 
    applyPreset 
  } = useEnhancedCardEffects();

  // Dynamic materials hook
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleEffects = () => {
    setShowEffects(!showEffects);
  };

  const handleReset = () => {
    resetAllEffects();
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: 'Check out this awesome card!',
        text: 'I designed this card using Cardshow!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const handleComboApply = useCallback((combo: any) => {
    applyPreset(combo.effects);
    setSelectedPresetId(combo.id);
  }, [applyPreset]);

  const handleEffectReset = useCallback(() => {
    resetAllEffects();
    setSelectedPresetId('');
  }, [resetAllEffects]);

  const handleCardNavigation = (direction: 'prev' | 'next') => {
    if (!onCardChange || !cards.length) return;
    
    if (direction === 'prev') {
      const newIndex = currentCardIndex > 0 ? currentCardIndex - 1 : cards.length - 1;
      onCardChange(newIndex);
    } else {
      const newIndex = currentCardIndex < cards.length - 1 ? currentCardIndex + 1 : 0;
      onCardChange(newIndex);
    }
  };

  const viewportConfig = {
    desktop: { width: 'max-w-md', icon: Monitor },
    tablet: { width: 'max-w-sm', icon: Tablet },
    mobile: { width: 'max-w-xs', icon: Smartphone },
  };

  const ViewportButton = ({ size }: { size: keyof typeof viewportConfig }) => {
    const { width, icon: Icon } = viewportConfig[size];
    const isActive = viewportSize === size;

    return (
      <Button
        variant={isActive ? 'default' : 'outline'}
        onClick={() => setViewportSize(size)}
        className="w-full text-xs"
      >
        <Icon className="w-4 h-4 mr-2" />
        {size.charAt(0).toUpperCase() + size.slice(1)}
      </Button>
    );
  };

  // Add missing default values for the viewer
  const defaultScene = { id: 'default', name: 'Default Scene', background: 'gradient' };
  const defaultLighting = { id: 'default', name: 'Default Lighting', ambient: 0.5, directional: 0.8, color: '#ffffff' };
  const defaultMaterialSettings = { metalness: 0.5, roughness: 0.5, reflectivity: 0.5, clearcoat: 0.3 };
  const defaultBrightness = [100];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-crd-darkest">
      {/* Header Section - Using site design patterns */}
      <div className="bg-crd-dark border-b border-crd-mediumGray sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-crd-white text-xl font-bold">Immersive Card Viewer</h1>
            <Badge variant="outline" className="text-crd-orange border-crd-orange">Beta</Badge>
          </div>
          <div className="flex items-center gap-3">
            {/* Card Navigation */}
            {cards.length > 1 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCardNavigation('prev')}
                  className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-crd-lightGray text-sm px-2">
                  {currentCardIndex + 1} / {cards.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCardNavigation('next')}
                  className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFlip}
              className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Flip Card
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleEffects}
              className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
            >
              <Zap className="w-4 h-4 mr-2" />
              {showEffects ? 'Hide Effects' : 'Show Effects'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={handleDownload} 
              size="sm"
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {onClose && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Card Display */}
          <div className="xl:col-span-2">
            <Card className="bg-crd-darkGray border-crd-mediumGray">
              <CardHeader className="text-center border-b border-crd-mediumGray">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-crd-blue" />
                    <CardTitle className="text-crd-white text-lg">Card Preview</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs text-crd-lightGray border-crd-mediumGray">
                    Material: {selectedMaterial.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div 
                  className={`mx-auto transition-all duration-500 ${
                    viewportSize === 'desktop' ? 'max-w-md' : 
                    viewportSize === 'tablet' ? 'max-w-sm' : 'max-w-xs'
                  }`}
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setMousePosition({ x: 0.5, y: 0.5 })}
                >
                  <EnhancedCardContainer
                    card={currentCard}
                    effectValues={effectValues}
                    showEffects={showEffects}
                    interactiveLighting={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Controls Panel - Updated to match site design */}
          <div className="space-y-6">
            {/* Viewport Controls */}
            <Card className="bg-crd-darkGray border-crd-mediumGray">
              <CardHeader className="pb-3 border-b border-crd-mediumGray">
                <CardTitle className="text-crd-white text-sm flex items-center">
                  <Monitor className="w-4 h-4 mr-2 text-crd-blue" />
                  Viewport Size
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2 pt-4">
                <ViewportButton size="desktop" />
                <ViewportButton size="tablet" />
                <ViewportButton size="mobile" />
              </CardContent>
            </Card>

            {/* Quick Combo Presets */}
            <Card className="bg-crd-darkGray border-crd-mediumGray">
              <CardHeader className="pb-3 border-b border-crd-mediumGray">
                <CardTitle className="text-crd-white text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-crd-orange" />
                  Quick Effect Combos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <QuickComboPresets
                  onApplyCombo={handleComboApply}
                  currentEffects={effectValues}
                  selectedPresetId={selectedPresetId}
                  onPresetSelect={setSelectedPresetId}
                />
                <Separator className="my-4 bg-crd-mediumGray" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleEffectReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Effects
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="effects" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-crd-darkGray border border-crd-mediumGray">
                <TabsTrigger value="effects" className="text-xs data-[state=active]:bg-crd-mediumGray data-[state=active]:text-crd-white">
                  <Zap className="w-4 h-4 mr-1" />
                  Effects
                </TabsTrigger>
                <TabsTrigger value="materials" className="text-xs data-[state=active]:bg-crd-mediumGray data-[state=active]:text-crd-white">
                  <Palette className="w-4 h-4 mr-1" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="lighting" className="text-xs data-[state=active]:bg-crd-mediumGray data-[state=active]:text-crd-white">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Lighting
                </TabsTrigger>
                <TabsTrigger value="environment" className="text-xs data-[state=active]:bg-crd-mediumGray data-[state=active]:text-crd-white">
                  <Settings className="w-4 h-4 mr-1" />
                  Scene
                </TabsTrigger>
              </TabsList>

              <TabsContent value="effects" className="mt-4">
                <EnhancedEffectControls
                  effectValues={effectValues}
                  onEffectChange={handleEffectChange}
                  onResetEffect={(effectId) => resetAllEffects()}
                  onResetAll={handleEffectReset}
                />
              </TabsContent>

              <TabsContent value="materials" className="mt-4">
                <MaterialComboSection
                  materialSettings={defaultMaterialSettings}
                  onMaterialSettingsChange={() => {}}
                />
              </TabsContent>

              <TabsContent value="lighting" className="mt-4">
                <LightingComboSection
                  selectedLighting={defaultLighting}
                  overallBrightness={defaultBrightness}
                  interactiveLighting={true}
                  onLightingChange={() => {}}
                  onBrightnessChange={() => {}}
                  onInteractiveLightingToggle={() => {}}
                />
              </TabsContent>

              <TabsContent value="environment" className="mt-4">
                <EnvironmentComboSection
                  selectedScene={defaultScene}
                  onSceneChange={() => {}}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
