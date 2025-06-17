
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Maximize2, 
  Download, 
  Settings, 
  Sun, 
  Moon, 
  Zap,
  Palette,
  Camera,
  FileImage,
  Share2
} from 'lucide-react';
import { EnhancedExportDialog } from '@/components/studio/export/EnhancedExportDialog';
import { useStudioState } from '@/hooks/useStudioState';
import { toast } from 'sonner';

interface StudioPhaseProps {
  show3DPreview: boolean;
  onToggle3D: () => void;
  onExport: () => void;
  cardData?: any;
  currentPhoto?: string;
  effectLayers?: any[];
}

const LIGHTING_PRESETS = [
  { id: 'studio', name: 'Studio', icon: Camera, description: 'Professional studio lighting' },
  { id: 'dramatic', name: 'Dramatic', icon: Moon, description: 'High contrast shadows' },
  { id: 'soft', name: 'Soft', icon: Sun, description: 'Even, diffused lighting' },
  { id: 'neon', name: 'Neon', icon: Zap, description: 'Colorful accent lighting' }
];

const ENVIRONMENT_SCENES = [
  { id: 'studio', name: 'Studio', gradient: 'from-gray-600 to-gray-800' },
  { id: 'outdoor', name: 'Outdoor', gradient: 'from-blue-400 to-blue-600' },
  { id: 'golden', name: 'Golden Hour', gradient: 'from-orange-400 to-yellow-500' },
  { id: 'dramatic', name: 'Dramatic', gradient: 'from-purple-600 to-black' }
];

export const StudioPhase: React.FC<StudioPhaseProps> = ({
  show3DPreview,
  onToggle3D,
  onExport,
  cardData,
  currentPhoto,
  effectLayers = []
}) => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('studio');
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  
  const { 
    studioState, 
    updateLighting, 
    applyLightingPreset 
  } = useStudioState();

  const handleLightingPresetChange = (presetId: string) => {
    applyLightingPreset(presetId);
  };

  const handleBrightnessChange = (value: number[]) => {
    updateLighting({ ambientIntensity: value[0] });
  };

  const handleContrastChange = (value: number[]) => {
    updateLighting({ directionalIntensity: value[0] });
  };

  const handleColorTemperatureChange = (value: number[]) => {
    updateLighting({ colorTemperature: value[0] });
  };

  const handleQuickExport = () => {
    toast.success('Quick export started...');
    onExport();
  };

  const handleAdvancedExport = () => {
    setShowExportDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-300">
        Fine-tune lighting, environment, and export your professional card.
      </div>

      {/* 3D Preview Controls */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">3D Preview</h3>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              PREMIUM
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">3D Rendering</label>
              <Button
                onClick={onToggle3D}
                variant={show3DPreview ? "default" : "outline"}
                size="sm"
                className={show3DPreview ? "bg-crd-green text-black" : "border-white/20 text-white"}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                {show3DPreview ? 'ON' : 'OFF'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Interactive Lighting</label>
              <Button
                onClick={() => setInteractiveLighting(!interactiveLighting)}
                variant={interactiveLighting ? "default" : "outline"}
                size="sm"
                className={interactiveLighting ? "bg-crd-green text-black" : "border-white/20 text-white"}
              >
                <Zap className="w-3 h-3 mr-1" />
                {interactiveLighting ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lighting Controls */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">Lighting Setup</h3>
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
              {studioState.lighting.preset.toUpperCase()}
            </Badge>
          </div>

          {/* Lighting Presets */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {LIGHTING_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                onClick={() => handleLightingPresetChange(preset.id)}
                variant={studioState.lighting.preset === preset.id ? "default" : "outline"}
                size="sm"
                className={
                  studioState.lighting.preset === preset.id
                    ? "bg-crd-green text-black"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <preset.icon className="w-3 h-3 mr-1" />
                <span className="text-xs">{preset.name}</span>
              </Button>
            ))}
          </div>

          {/* Fine Controls */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-300">Brightness</label>
                <span className="text-xs text-crd-green">{studioState.lighting.ambientIntensity}%</span>
              </div>
              <Slider
                value={[studioState.lighting.ambientIntensity]}
                onValueChange={handleBrightnessChange}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-300">Contrast</label>
                <span className="text-xs text-crd-green">{studioState.lighting.directionalIntensity}%</span>
              </div>
              <Slider
                value={[studioState.lighting.directionalIntensity]}
                onValueChange={handleContrastChange}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-300">Color Temperature</label>
                <span className="text-xs text-crd-green">{studioState.lighting.colorTemperature}K</span>
              </div>
              <Slider
                value={[studioState.lighting.colorTemperature]}
                onValueChange={handleColorTemperatureChange}
                min={2700}
                max={6500}
                step={100}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Scene */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <h3 className="text-white font-medium text-sm mb-3">Environment Scene</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {ENVIRONMENT_SCENES.map((scene) => (
              <Button
                key={scene.id}
                onClick={() => setSelectedEnvironment(scene.id)}
                variant={selectedEnvironment === scene.id ? "default" : "outline"}
                size="sm"
                className={
                  selectedEnvironment === scene.id
                    ? "bg-crd-green text-black"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${scene.gradient} mr-2`} />
                <span className="text-xs">{scene.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-white/10" />

      {/* Export Section */}
      <Card className="bg-gradient-to-r from-crd-green/20 to-blue-500/20 border-crd-green/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium text-sm">Export Your Card</h3>
              <p className="text-gray-300 text-xs">High-quality renders ready for sharing or printing</p>
            </div>
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50">
              READY
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleQuickExport}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Quick Export
            </Button>
            
            <Button
              onClick={handleAdvancedExport}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <FileImage className="w-3 h-3 mr-1" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Export Dialog */}
      {showExportDialog && (
        <EnhancedExportDialog
          cardData={cardData || { title: 'Untitled Card' }}
          currentPhoto={currentPhoto || ''}
          effectLayers={effectLayers}
          showCRDBack={true}
          onClose={() => setShowExportDialog(false)}
          onExport={onExport}
        />
      )}
    </div>
  );
};
