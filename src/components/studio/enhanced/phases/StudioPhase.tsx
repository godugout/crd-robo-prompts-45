
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Share, Eye, EyeOff, Lock, Unlock, Layers, Sparkles } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'frame';
  visible: boolean;
  locked: boolean;
  opacity: number;
  transform: any;
  data: any;
}

interface StudioPhaseProps {
  layers: Layer[];
  selectedLayerId: string;
  cardData: any;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void;
  onLayerRemove: (layerId: string) => void;
  onAddLayer: (type: Layer['type']) => void;
  onExport: (format: string) => void;
  onSave: () => void;
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
  const [showProMode, setShowProMode] = React.useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Final Studio</h3>
          <p className="text-gray-400">Fine-tune your card and prepare for export</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProMode(!showProMode)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Layers className="w-4 h-4 mr-2" />
            {showProMode ? 'Simple Mode' : 'Pro Mode'}
          </Button>
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
            Ready to Export
          </Badge>
        </div>
      </div>

      {/* Card Summary */}
      <Card className="p-4 bg-black/30 border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">{cardData.title || 'Untitled Card'}</h4>
            <p className="text-gray-400 text-sm">{cardData.description || 'No description'}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                {cardData.rarity || 'common'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {layers.length} Layers
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Last updated</p>
            <p className="text-white text-sm">Just now</p>
          </div>
        </div>
      </Card>

      {/* Pro Mode - Layer Controls */}
      {showProMode && (
        <Card className="p-4 bg-black/30 border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Advanced Controls
            </h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onAddLayer('text')}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                Add Text
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddLayer('shape')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Add Shape
              </Button>
            </div>
          </div>

          {/* Layer List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-3 rounded border transition-colors cursor-pointer ${
                  selectedLayerId === layer.id
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerUpdate(layer.id, { visible: !layer.visible });
                      }}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerUpdate(layer.id, { locked: !layer.locked });
                      }}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    >
                      {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </Button>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{layer.name}</p>
                    <p className="text-gray-400 text-xs capitalize">{layer.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{Math.round(layer.opacity * 100)}%</span>
                  {layer.id !== 'background' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerRemove(layer.id);
                      }}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-red-400"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export Options */}
      <Card className="p-4 bg-black/30 border-white/20">
        <h4 className="text-white font-medium mb-4">Export & Share</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => onExport('png')}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button
            onClick={() => onExport('jpg')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            JPG
          </Button>
          <Button
            onClick={onSave}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={() => {}}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex justify-between pt-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back to Effects
        </Button>
        <Button
          onClick={() => onExport('png')}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Card
        </Button>
      </div>
    </div>
  );
};
