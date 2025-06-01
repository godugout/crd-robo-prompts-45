
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Sparkles,
  Eye,
  EyeOff,
  Settings,
  Sun,
  Moon,
  Palette,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CardData } from '@/hooks/useCardEditor';

// Extended interface for viewer-specific props
interface CardEffect {
  type: 'holographic' | 'refractor' | 'foil' | 'prizm';
  intensity: number;
  color?: string;
}

interface EnvironmentScene {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  lighting: {
    ambient: number;
    directional: number;
    color: string;
  };
}

interface LightingPreset {
  id: string;
  name: string;
  description: string;
  settings: {
    brightness: number;
    contrast: number;
    shadows: number;
    highlights: number;
  };
}

interface ImmersiveCardViewerProps {
  card: CardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    gradient: 'from-gray-800 via-gray-700 to-gray-900',
    lighting: { ambient: 0.6, directional: 0.8, color: '#ffffff' }
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: '🏛️',
    gradient: 'from-slate-600 via-slate-500 to-slate-700',
    lighting: { ambient: 0.7, directional: 0.6, color: '#f8f9fa' }
  },
  {
    id: 'stadium',
    name: 'Stadium',
    icon: '🏟️',
    gradient: 'from-green-800 via-green-600 to-green-900',
    lighting: { ambient: 0.8, directional: 1.0, color: '#ffffff' }
  },
  {
    id: 'twilight',
    name: 'Twilight',
    icon: '🌅',
    gradient: 'from-orange-600 via-purple-600 to-blue-800',
    lighting: { ambient: 0.4, directional: 0.7, color: '#ffa500' }
  },
  {
    id: 'quarry',
    name: 'Quarry',
    icon: '⚡',
    gradient: 'from-yellow-600 via-orange-700 to-red-800',
    lighting: { ambient: 0.5, directional: 0.9, color: '#ffeb3b' }
  },
  {
    id: 'coastline',
    name: 'Coastline',
    icon: '🌊',
    gradient: 'from-blue-600 via-cyan-500 to-teal-700',
    lighting: { ambient: 0.6, directional: 0.8, color: '#87ceeb' }
  },
  {
    id: 'hillside',
    name: 'Hillside',
    icon: '🌲',
    gradient: 'from-green-700 via-emerald-600 to-forest-800',
    lighting: { ambient: 0.5, directional: 0.6, color: '#90ee90' }
  },
  {
    id: 'milkyway',
    name: 'Milky Way',
    icon: '🌌',
    gradient: 'from-indigo-900 via-purple-800 to-black',
    lighting: { ambient: 0.3, directional: 0.4, color: '#4a5568' }
  },
  {
    id: 'esplanade',
    name: 'Esplanade',
    icon: '✨',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    lighting: { ambient: 0.7, directional: 0.8, color: '#ffd700' }
  },
  {
    id: 'neonclub',
    name: 'Neon Club',
    icon: '🎭',
    gradient: 'from-pink-600 via-purple-600 to-cyan-600',
    lighting: { ambient: 0.8, directional: 1.0, color: '#ff00ff' }
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: '🏭',
    gradient: 'from-gray-700 via-red-800 to-orange-900',
    lighting: { ambient: 0.4, directional: 0.7, color: '#ff4500' }
  }
];

const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio',
    name: 'Studio',
    description: 'Multiple professional setup. Clean, balanced lighting with full clarity.',
    settings: { brightness: 120, contrast: 110, shadows: 85, highlights: 95 }
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Warm daylight with soft shadows. Golden hour outdoor lighting.',
    settings: { brightness: 100, contrast: 100, shadows: 70, highlights: 80 }
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast single source. Dark, moody with strong highlights.',
    settings: { brightness: 90, contrast: 140, shadows: 40, highlights: 120 }
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Museum display with spot lights. Even illumination from multiple angles.',
    settings: { brightness: 110, contrast: 105, shadows: 60, highlights: 85 }
  }
];

const VISUAL_EFFECTS = [
  { id: 'holographic', name: 'Holographic', description: 'Rainbow prismatic finish' },
  { id: 'premiumfoil', name: 'Premium Foil', description: 'Luxury metallic shine' },
  { id: 'vintage', name: 'Vintage Classic', description: 'Aged premium look' },
  { id: 'cosmic', name: 'Cosmic Flare', description: 'Deep space shimmer' }
];

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  
  // Advanced settings
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[3]); // Twilight
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [selectedEffect, setSelectedEffect] = useState(VISUAL_EFFECTS[0]);
  const [effectIntensity, setEffectIntensity] = useState([70]);
  const [overallBrightness, setOverallBrightness] = useState([120]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  
  // Material properties
  const [materialSettings, setMaterialSettings] = useState({
    roughness: 0.30,
    metalness: 0.60,
    clearcoat: 0.75,
    reflectivity: 0.50
  });
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging]);

  // Handle mouse movement for effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation]);

  // Handle drag
  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset view
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Get frame-specific styles based on template
  const getFrameStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb'
    };

    switch (card.template_id) {
      case 'neon':
        return {
          ...baseStyles,
          boxShadow: `0 0 40px ${selectedScene.lighting.color}`,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: `2px solid ${selectedScene.lighting.color}`
        };
      case 'vintage':
        return {
          ...baseStyles,
          boxShadow: '0 10px 20px rgba(139,69,19,0.3)',
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e6d7c3 100%)',
          border: '3px solid #8b4513'
        };
      case 'classic':
        return {
          ...baseStyles,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          background: '#ffffff',
          border: '2px solid #d1d5db'
        };
      case 'modern':
        return {
          ...baseStyles,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid #cbd5e1'
        };
      default:
        return baseStyles;
    }
  };

  // Apply effects based on mouse position and settings
  const getEffectStyles = useCallback(() => {
    const styles: React.CSSProperties = {};
    
    if (showEffects) {
      const intensity = effectIntensity[0] / 100;
      const brightness = overallBrightness[0] / 100;
      
      // Apply lighting effects
      const hueRotate = interactiveLighting ? mousePosition.x * 360 : 0;
      const shimmerX = mousePosition.x * 100;
      const shimmerY = mousePosition.y * 100;
      
      styles.filter = `brightness(${brightness}) hue-rotate(${hueRotate}deg) contrast(${selectedLighting.settings.contrast}%) saturate(${1 + intensity})`;
      
      // Apply selected visual effect
      switch (selectedEffect.id) {
        case 'holographic':
          styles.background = `radial-gradient(circle at ${shimmerX}% ${shimmerY}%, 
            rgba(255,0,150,${intensity * 0.3}), 
            rgba(0,255,150,${intensity * 0.2}), 
            rgba(150,0,255,${intensity * 0.1}), 
            transparent 60%)`;
          break;
        case 'premiumfoil':
          styles.background = `linear-gradient(135deg, 
            rgba(255,215,0,${intensity * 0.4}), 
            rgba(255,223,0,${intensity * 0.6}), 
            rgba(255,215,0,${intensity * 0.3}))`;
          break;
        case 'vintage':
          styles.filter += ` sepia(${intensity * 0.5})`;
          break;
        case 'cosmic':
          styles.background = `radial-gradient(circle at ${shimmerX}% ${shimmerY}%, 
            rgba(138,43,226,${intensity * 0.3}), 
            rgba(75,0,130,${intensity * 0.2}), 
            transparent 50%)`;
          break;
      }
    }
    
    return styles;
  }, [card.template_id, mousePosition, showEffects, selectedEffect, effectIntensity, overallBrightness, interactiveLighting, selectedLighting]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-8'
      }`}
      style={{
        background: `linear-gradient(135deg, ${selectedScene.gradient.split(' ').join(', ')})`
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Ambient Background Effect */}
      {ambient && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              ${selectedScene.lighting.color} 0%, transparent 50%)`
          }}
        />
      )}

      {/* Main Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCustomizePanel(!showCustomizePanel)}
          className={`bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur ${showCustomizePanel ? 'bg-opacity-30' : ''}`}
        >
          <Settings className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEffects(!showEffects)}
          className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
        >
          {showEffects ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur ${autoRotate ? 'bg-opacity-30' : ''}`}
        >
          <RotateCw className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
        >
          <Move className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom(0.1)}
          className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom(-0.1)}
          className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
        </Button>
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(card)}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
          >
            <Share2 className="w-4 h-4 text-white" />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(card)}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
          >
            <Download className="w-4 h-4 text-white" />
          </Button>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        )}
      </div>

      {/* Customize Panel */}
      {showCustomizePanel && (
        <div className="absolute top-4 right-4 mt-12 w-80 max-h-[80vh] bg-black bg-opacity-90 backdrop-blur rounded-lg overflow-hidden">
          <Tabs defaultValue="scenes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="scenes" className="text-white data-[state=active]:bg-blue-600">Scenes</TabsTrigger>
              <TabsTrigger value="customize" className="text-white data-[state=active]:bg-blue-600">Customize</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scenes" className="p-4 max-h-96 overflow-y-auto">
              <h3 className="text-white font-medium mb-4">Environment Scenes</h3>
              <div className="grid grid-cols-2 gap-3">
                {ENVIRONMENT_SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`aspect-square rounded-lg p-3 transition-all ${
                      selectedScene.id === scene.id 
                        ? 'ring-2 ring-blue-500 scale-105' 
                        : 'hover:scale-102'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${scene.gradient.split(' ').join(', ')})`
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <span className="text-lg mb-1">{scene.icon}</span>
                      <span className="text-xs font-medium text-center">{scene.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="customize" className="p-4 max-h-96 overflow-y-auto space-y-6">
              {/* Visual Effects */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Visual Effects
                </h4>
                <div className="space-y-2 mb-4">
                  {VISUAL_EFFECTS.map((effect) => (
                    <button
                      key={effect.id}
                      onClick={() => setSelectedEffect(effect)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedEffect.id === effect.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{effect.name}</div>
                      <div className="text-xs opacity-75">{effect.description}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-sm mb-2 block">Effect Intensity: {effectIntensity[0]}%</label>
                    <Slider
                      value={effectIntensity}
                      onValueChange={setEffectIntensity}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Lighting */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Lighting
                </h4>
                <div className="space-y-2 mb-4">
                  {LIGHTING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedLighting(preset)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedLighting.id === preset.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs opacity-75">{preset.description}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-sm mb-2 block">Overall Brightness: {overallBrightness[0]}%</label>
                    <Slider
                      value={overallBrightness}
                      onValueChange={setOverallBrightness}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Interactive Lighting</span>
                    <button
                      onClick={() => setInteractiveLighting(!interactiveLighting)}
                      className={`px-3 py-1 rounded text-xs ${
                        interactiveLighting ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {interactiveLighting ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Material Properties */}
              <div>
                <h4 className="text-white font-medium mb-3">Material Properties</h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(materialSettings).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-white mb-2 block capitalize">
                        {key}: {value.toFixed(2)}
                      </label>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => 
                          setMaterialSettings(prev => ({ ...prev, [key]: newValue }))
                        }
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save & Share */}
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-3">Save & Share</h4>
                <p className="text-gray-400 text-sm mb-4">Save your customized card or share with others</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onDownload && onDownload(card)}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                    onClick={() => onShare && onShare(card)}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Card Container */}
      <div 
        className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
      >
        {/* 3D Card */}
        <div
          ref={cardRef}
          className="relative"
          style={{
            width: '400px',
            height: '560px',
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.1s ease'
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
            style={{
              ...getFrameStyles(),
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Background Layer */}
            <div className="absolute inset-0" style={getFrameStyles()} />
            
            {/* Effects Layer */}
            <div className="absolute inset-0 pointer-events-none" style={getEffectStyles()} />
            
            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col">
              {/* Image Section */}
              {card.image_url && (
                <div className="flex-1 mb-6 relative overflow-hidden rounded-lg">
                  <img 
                    src={card.image_url} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Image overlay effects */}
                  {showEffects && (
                    <div className="absolute inset-0 mix-blend-overlay">
                      <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-20" />
                    </div>
                  )}
                </div>
              )}
              
              {/* Details Section */}
              <div className={`mt-auto p-4 rounded-lg ${
                card.template_id === 'neon'
                  ? 'bg-black bg-opacity-80'
                  : 'bg-white bg-opacity-90'
              }`}>
                <h2 className={`text-2xl font-bold mb-1 ${
                  card.template_id === 'neon'
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {card.title}
                </h2>
                {card.description && (
                  <p className={`text-lg ${
                    card.template_id === 'neon'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>
                    {card.description}
                  </p>
                )}
                {card.series && (
                  <p className={`text-sm ${
                    card.template_id === 'neon'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>
                    Series: {card.series}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    card.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                    card.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    card.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    card.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {card.rarity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
            style={{
              ...getFrameStyles(),
              transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="relative h-full p-6 flex flex-col">
              <h3 className={`text-xl font-bold mb-4 ${
                card.template_id === 'neon'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                Card Details
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className={`flex justify-between p-2 rounded ${
                  card.template_id === 'neon'
                    ? 'bg-gray-800'
                    : 'bg-gray-100'
                }`}>
                  <span className={`text-sm ${
                    card.template_id === 'neon'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>Type:</span>
                  <span className={`font-medium ${
                    card.template_id === 'neon'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>{card.type || 'Character'}</span>
                </div>
                
                <div className={`flex justify-between p-2 rounded ${
                  card.template_id === 'neon'
                    ? 'bg-gray-800'
                    : 'bg-gray-100'
                }`}>
                  <span className={`text-sm ${
                    card.template_id === 'neon'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>Rarity:</span>
                  <span className={`font-medium ${
                    card.template_id === 'neon'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>{card.rarity}</span>
                </div>

                {card.tags.length > 0 && (
                  <div className={`p-2 rounded ${
                    card.template_id === 'neon'
                      ? 'bg-gray-800'
                      : 'bg-gray-100'
                  }`}>
                    <span className={`text-sm block mb-1 ${
                      card.template_id === 'neon'
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    }`}>Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            card.template_id === 'neon'
                              ? 'bg-gray-700 text-gray-200'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {card.description && (
                <p className={`text-sm mt-auto ${
                  card.template_id === 'neon'
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}>
                  {card.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showStats && !isFlipped && !showCustomizePanel && (
        <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex space-x-4 text-sm">
                <span>Click card to flip</span>
                <span>•</span>
                <span>Drag to rotate manually</span>
                <span>•</span>
                <span>Move mouse for effects</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">
                  Scene: {selectedScene.name} | Effect: {selectedEffect.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
