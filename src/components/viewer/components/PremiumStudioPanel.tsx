
import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  Palette, 
  Camera, 
  Settings, 
  Download,
  Share2,
  Layers,
  Sun,
  Moon,
  Zap,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface PremiumStudioPanelProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onBrightnessChange: (brightness: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onExport: () => void;
  onShare: () => void;
  card: any;
}

const PREMIUM_ENVIRONMENTS = [
  { id: 'studio', name: 'Professional Studio', description: 'Clean white infinity backdrop' },
  { id: 'gallery', name: 'Art Gallery', description: 'Museum-quality lighting' },
  { id: 'luxury', name: 'Luxury Showcase', description: 'High-end product display' },
  { id: 'dramatic', name: 'Dramatic Stage', description: 'High contrast lighting' },
  { id: 'cosmic', name: 'Cosmic Space', description: 'Ethereal space environment' },
  { id: 'crystal', name: 'Crystal Cave', description: 'Prismatic reflections' }
];

const LIGHTING_RIGS = [
  { id: 'three-point', name: 'Three-Point Lighting', description: 'Classic portrait setup' },
  { id: 'rim', name: 'Rim Lighting', description: 'Dramatic edge lighting' },
  { id: 'studio', name: 'Studio Softbox', description: 'Even professional lighting' },
  { id: 'cinematic', name: 'Cinematic', description: 'Film-style dramatic lighting' },
  { id: 'natural', name: 'Natural Light', description: 'Daylight simulation' },
  { id: 'neon', name: 'Neon Accent', description: 'Colorful accent lighting' }
];

const MATERIAL_PRESETS = [
  { id: 'carbon-fiber', name: 'Carbon Fiber', settings: { roughness: 0.2, metalness: 0.8, clearcoat: 0.9 } },
  { id: 'pearl', name: 'Pearl', settings: { roughness: 0.1, metalness: 0.0, clearcoat: 1.0 } },
  { id: 'silk', name: 'Silk', settings: { roughness: 0.8, metalness: 0.0, clearcoat: 0.1 } },
  { id: 'brushed-aluminum', name: 'Brushed Aluminum', settings: { roughness: 0.3, metalness: 1.0, clearcoat: 0.5 } },
  { id: 'ceramic', name: 'Ceramic', settings: { roughness: 0.05, metalness: 0.0, clearcoat: 0.8 } },
  { id: 'diamond', name: 'Diamond', settings: { roughness: 0.0, metalness: 0.0, clearcoat: 1.0 } }
];

export const PremiumStudioPanel: React.FC<PremiumStudioPanelProps> = ({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  onEffectChange,
  onSceneChange,
  onLightingChange,
  onMaterialSettingsChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onExport,
  onShare,
  card
}) => {
  const [activeTab, setActiveTab] = useState('effects');
  const [renderQuality, setRenderQuality] = useState([100]);
  const [hdrIntensity, setHdrIntensity] = useState([50]);
  const [depthOfField, setDepthOfField] = useState([0]);
  const [bloomIntensity, setBloomIntensity] = useState([20]);

  return (
    <div className="w-96 bg-black/90 backdrop-blur-lg border-l border-white/10 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-white font-semibold">Premium Studio</h2>
            <Badge className="bg-amber-500 text-black text-xs">PRO</Badge>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={onShare} className="text-white hover:bg-white/10">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onExport} className="text-white hover:bg-white/10">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Professional card enhancement studio</p>
      </div>

      {/* Main Controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4 bg-black/50 border-b border-white/10 rounded-none">
          <TabsTrigger value="effects" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="lighting" className="text-xs">
            <Sun className="w-3 h-3 mr-1" />
            Lighting
          </TabsTrigger>
          <TabsTrigger value="materials" className="text-xs">
            <Palette className="w-3 h-3 mr-1" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="render" className="text-xs">
            <Monitor className="w-3 h-3 mr-1" />
            Render
          </TabsTrigger>
        </TabsList>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4 p-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center">
                <Zap className="w-4 h-4 mr-2 text-amber-400" />
                Premium Effect Stacks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Holographic Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Holographic Intensity</span>
                  <span className="text-gray-400 text-xs">{Math.round((effectValues.holographic?.intensity || 0) * 100)}%</span>
                </div>
                <Slider
                  value={[effectValues.holographic?.intensity || 0]}
                  onValueChange={([value]) => onEffectChange('holographic', 'intensity', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Prizm Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Prizm Intensity</span>
                  <span className="text-gray-400 text-xs">{Math.round((effectValues.prizm?.intensity || 0) * 100)}%</span>
                </div>
                <Slider
                  value={[effectValues.prizm?.intensity || 0]}
                  onValueChange={([value]) => onEffectChange('prizm', 'intensity', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Crystal Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Crystal Clarity</span>
                  <span className="text-gray-400 text-xs">{Math.round((effectValues.crystal?.intensity || 0) * 100)}%</span>
                </div>
                <Slider
                  value={[effectValues.crystal?.intensity || 0]}
                  onValueChange={([value]) => onEffectChange('crystal', 'intensity', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Chrome Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Chrome Finish</span>
                  <span className="text-gray-400 text-xs">{Math.round((effectValues.chrome?.intensity || 0) * 100)}%</span>
                </div>
                <Slider
                  value={[effectValues.chrome?.intensity || 0]}
                  onValueChange={([value]) => onEffectChange('chrome', 'intensity', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Gold Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Gold Plating</span>
                  <span className="text-gray-400 text-xs">{Math.round((effectValues.gold?.intensity || 0) * 100)}%</span>
                </div>
                <Slider
                  value={[effectValues.gold?.intensity || 0]}
                  onValueChange={([value]) => onEffectChange('gold', 'intensity', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lighting Tab */}
        <TabsContent value="lighting" className="space-y-4 p-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Studio Lighting Rigs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {LIGHTING_RIGS.map((rig) => (
                <Button
                  key={rig.id}
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{rig.name}</div>
                    <div className="text-xs text-gray-400">{rig.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Advanced Lighting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">HDR Intensity</span>
                  <span className="text-gray-400 text-xs">{hdrIntensity[0]}%</span>
                </div>
                <Slider
                  value={hdrIntensity}
                  onValueChange={setHdrIntensity}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Overall Brightness</span>
                  <span className="text-gray-400 text-xs">{overallBrightness[0]}%</span>
                </div>
                <Slider
                  value={overallBrightness}
                  onValueChange={onBrightnessChange}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Interactive Lighting</span>
                <Switch
                  checked={interactiveLighting}
                  onCheckedChange={onInteractiveLightingToggle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4 p-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Material Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MATERIAL_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                  onClick={() => onMaterialSettingsChange(preset.settings)}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  {preset.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Fine Tuning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Roughness</span>
                  <span className="text-gray-400 text-xs">{Math.round(materialSettings.roughness * 100)}%</span>
                </div>
                <Slider
                  value={[materialSettings.roughness]}
                  onValueChange={([value]) => onMaterialSettingsChange({ ...materialSettings, roughness: value })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Metalness</span>
                  <span className="text-gray-400 text-xs">{Math.round(materialSettings.metalness * 100)}%</span>
                </div>
                <Slider
                  value={[materialSettings.metalness]}
                  onValueChange={([value]) => onMaterialSettingsChange({ ...materialSettings, metalness: value })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Clearcoat</span>
                  <span className="text-gray-400 text-xs">{Math.round(materialSettings.clearcoat * 100)}%</span>
                </div>
                <Slider
                  value={[materialSettings.clearcoat]}
                  onValueChange={([value]) => onMaterialSettingsChange({ ...materialSettings, clearcoat: value })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Reflectivity</span>
                  <span className="text-gray-400 text-xs">{Math.round(materialSettings.reflectivity * 100)}%</span>
                </div>
                <Slider
                  value={[materialSettings.reflectivity]}
                  onValueChange={([value]) => onMaterialSettingsChange({ ...materialSettings, reflectivity: value })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Render Tab */}
        <TabsContent value="render" className="space-y-4 p-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Render Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Render Quality</span>
                  <span className="text-gray-400 text-xs">{renderQuality[0]}%</span>
                </div>
                <Slider
                  value={renderQuality}
                  onValueChange={setRenderQuality}
                  min={25}
                  max={200}
                  step={25}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Depth of Field</span>
                  <span className="text-gray-400 text-xs">{depthOfField[0]}%</span>
                </div>
                <Slider
                  value={depthOfField}
                  onValueChange={setDepthOfField}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Bloom Intensity</span>
                  <span className="text-gray-400 text-xs">{bloomIntensity[0]}%</span>
                </div>
                <Slider
                  value={bloomIntensity}
                  onValueChange={setBloomIntensity}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={onExport}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                Export 8K PNG
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  4K JPG
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  WebP
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Layers className="w-4 h-4 mr-2" />
                Batch Export
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
