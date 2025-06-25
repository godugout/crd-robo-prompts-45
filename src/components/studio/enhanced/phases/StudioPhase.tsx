
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Layers,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Save,
  Download,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import type { StudioLayer } from '../hooks/useEnhancedStudio';
import type { CardData } from '@/types/card';

interface StudioPhaseProps {
  layers: StudioLayer[];
  selectedLayerId?: string;
  cardData: CardData;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<StudioLayer>) => void;
  onLayerRemove: (layerId: string) => void;
  onAddLayer: (type: StudioLayer['type'], data?: any) => void;
  onExport: (format: 'png' | 'jpeg' | 'print') => Promise<void>;
  onSave: () => Promise<void>;
  isPlaying: boolean;
  onToggleAnimation: () => void;
}

export const StudioPhase: React.FC<StudioPhaseProps> = ({
  layers,
  selectedLayerId,
  cardData,
  onLayerSelect,
  onLayerUpdate,
  onLayerRemove,
  onAddLayer,
  onExport,
  onSave,
  isPlaying,
  onToggleAnimation
}) => {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'print'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportFormat);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Final Studio</h3>
        <p className="text-gray-400 text-sm">
          Fine-tune your card and export when ready.
        </p>
      </div>

      {/* Animation Controls */}
      <Card className="bg-black/20 border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Preview Animation</h4>
            <p className="text-gray-400 text-sm">Control real-time preview</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAnimation}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </Card>

      {/* Layers Panel */}
      <Card className="bg-black/20 border-white/10 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Layers ({layers.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddLayer('text', { content: 'New Text' })}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Layer
            </Button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedLayerId === layer.id
                    ? 'bg-crd-green/20 border border-crd-green'
                    : 'bg-black/30 border border-white/10 hover:border-white/20'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerUpdate(layer.id, { visible: !layer.visible });
                      }}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                    </Button>
                    <div>
                      <p className="text-white text-sm font-medium">{layer.name}</p>
                      <p className="text-gray-400 text-xs capitalize">{layer.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="border-white/20 text-white text-xs">
                      {Math.round(layer.opacity * 100)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerRemove(layer.id);
                      }}
                      className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Layer Properties */}
      {selectedLayer && (
        <Card className="bg-black/20 border-white/10 p-4">
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Layer Properties
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Opacity</span>
                  <span className="text-white text-sm">{Math.round(selectedLayer.opacity * 100)}%</span>
                </div>
                <Slider
                  value={[selectedLayer.opacity * 100]}
                  onValueChange={([value]) => 
                    onLayerUpdate(selectedLayer.id, { opacity: value / 100 })
                  }
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 text-sm">Scale X</label>
                  <Slider
                    value={[selectedLayer.scale.x * 100]}
                    onValueChange={([value]) => 
                      onLayerUpdate(selectedLayer.id, { 
                        scale: { ...selectedLayer.scale, x: value / 100 }
                      })
                    }
                    min={10}
                    max={200}
                    step={1}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Scale Y</label>
                  <Slider
                    value={[selectedLayer.scale.y * 100]}
                    onValueChange={([value]) => 
                      onLayerUpdate(selectedLayer.id, { 
                        scale: { ...selectedLayer.scale, y: value / 100 }
                      })
                    }
                    min={10}
                    max={200}
                    step={1}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Rotation</label>
                  <Slider
                    value={[selectedLayer.rotation.z]}
                    onValueChange={([value]) => 
                      onLayerUpdate(selectedLayer.id, { 
                        rotation: { ...selectedLayer.rotation, z: value }
                      })
                    }
                    min={-180}
                    max={180}
                    step={1}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export & Save */}
      <Card className="bg-black/20 border-white/10 p-4">
        <div className="space-y-4">
          <h4 className="text-white font-medium">Export & Save</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['png', 'jpeg', 'print'] as const).map((format) => (
                  <Button
                    key={format}
                    variant={exportFormat === format ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat(format)}
                    className={
                      exportFormat === format 
                        ? 'bg-crd-green text-black' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
