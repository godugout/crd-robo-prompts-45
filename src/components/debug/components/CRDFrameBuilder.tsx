
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { CRDFrame, CRDElement } from '@/types/crdFrames';
import { Save, Eye, Layers, Settings, MapPin } from 'lucide-react';

interface CRDFrameBuilderProps {
  processedLayers: ProcessedPSDLayer[];
  layerGroups: LayerGroup[];
  psdDimensions: { width: number; height: number };
  onFrameCreated: (frame: CRDFrame) => void;
}

export const CRDFrameBuilder: React.FC<CRDFrameBuilderProps> = ({
  processedLayers,
  layerGroups,
  psdDimensions,
  onFrameCreated
}) => {
  const [frameName, setFrameName] = useState('');
  const [frameDescription, setFrameDescription] = useState('');
  const [frameCategory, setFrameCategory] = useState('');
  const [frameRarity, setFrameRarity] = useState<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('common');
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());
  const [placeholderArea, setPlaceholderArea] = useState({
    x: 50,
    y: 50,
    width: 300,
    height: 200
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleLayerToggle = (layerId: string) => {
    const newSelected = new Set(selectedLayers);
    if (newSelected.has(layerId)) {
      newSelected.delete(layerId);
    } else {
      newSelected.add(layerId);
    }
    setSelectedLayers(newSelected);
  };

  const handleGroupToggle = (group: LayerGroup) => {
    const newSelected = new Set(selectedLayers);
    const groupLayerIds = group.layers.map(l => l.id);
    const allSelected = groupLayerIds.every(id => newSelected.has(id));
    
    if (allSelected) {
      groupLayerIds.forEach(id => newSelected.delete(id));
    } else {
      groupLayerIds.forEach(id => newSelected.add(id));
    }
    setSelectedLayers(newSelected);
  };

  const mapLayerToElement = (layer: ProcessedPSDLayer, index: number): CRDElement => {
    const elementType = mapSemanticTypeToElementType(layer.semanticType);
    
    return {
      id: `element-${layer.id}`,
      name: layer.name,
      type: elementType,
      imageUrl: layer.imageData || '/placeholder-element.png',
      zIndex: layer.zIndex,
      position: { x: layer.bounds.left, y: layer.bounds.top },
      dimensions: {
        width: layer.bounds.right - layer.bounds.left,
        height: layer.bounds.bottom - layer.bounds.top
      },
      opacity: layer.opacity
    };
  };

  const mapSemanticTypeToElementType = (semanticType?: string): CRDElement['type'] => {
    switch (semanticType) {
      case 'border':
        return 'border';
      case 'logo':
        return 'logo';
      case 'text':
      case 'stats':
        return 'label';
      case 'effect':
        return 'accent';
      default:
        return 'decorative';
    }
  };

  const createFrame = (): CRDFrame => {
    const selectedLayerObjects = processedLayers.filter(layer => selectedLayers.has(layer.id));
    const elements = selectedLayerObjects.map(mapLayerToElement);
    
    return {
      id: `custom-frame-${Date.now()}`,
      name: frameName,
      description: frameDescription,
      category: frameCategory,
      rarity: frameRarity,
      elements,
      placeholderDimensions: placeholderArea,
      totalDimensions: {
        width: psdDimensions.width,
        height: psdDimensions.height
      }
    };
  };

  const handleSaveFrame = () => {
    if (!frameName.trim()) {
      alert('Please enter a frame name');
      return;
    }
    
    if (selectedLayers.size === 0) {
      alert('Please select at least one layer');
      return;
    }
    
    const frame = createFrame();
    onFrameCreated(frame);
    
    // Reset form
    setFrameName('');
    setFrameDescription('');
    setFrameCategory('');
    setFrameRarity('common');
    setSelectedLayers(new Set());
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-crd-green" />
          CRD Frame Builder
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Create a reusable frame template from selected PSD layers
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Frame Properties */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frame-name" className="text-white">Frame Name</Label>
              <Input
                id="frame-name"
                value={frameName}
                onChange={(e) => setFrameName(e.target.value)}
                placeholder="My Custom Frame"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="frame-category" className="text-white">Category</Label>
              <Input
                id="frame-category"
                value={frameCategory}
                onChange={(e) => setFrameCategory(e.target.value)}
                placeholder="sports, modern, vintage..."
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="frame-description" className="text-white">Description</Label>
            <Textarea
              id="frame-description"
              value={frameDescription}
              onChange={(e) => setFrameDescription(e.target.value)}
              placeholder="Describe your frame template..."
              className="bg-slate-800 border-slate-600 text-white"
              rows={2}
            />
          </div>
          
          <div>
            <Label className="text-white">Rarity</Label>
            <Select value={frameRarity} onValueChange={(value: any) => setFrameRarity(value)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Layer Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Select Layers ({selectedLayers.size} selected)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="border-slate-600 text-slate-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
          
          <ScrollArea className="h-64 border border-slate-700 rounded-lg p-3">
            <div className="space-y-3">
              {layerGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div 
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-slate-800/50"
                    onClick={() => handleGroupToggle(group)}
                  >
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="text-white font-medium">{group.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {group.layers.length} layers
                    </Badge>
                  </div>
                  
                  <div className="ml-6 space-y-1">
                    {group.layers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedLayers.has(layer.id)
                            ? 'bg-blue-600/20 border border-blue-500/50'
                            : 'hover:bg-slate-800/30'
                        }`}
                        onClick={() => handleLayerToggle(layer.id)}
                      >
                        <div className="w-8 h-8 bg-slate-700 rounded border overflow-hidden flex-shrink-0">
                          {layer.imageData && (
                            <img
                              src={layer.imageData}
                              alt={layer.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="text-slate-300 text-sm truncate">{layer.name}</span>
                        {selectedLayers.has(layer.id) && (
                          <Badge className="bg-blue-600 text-white text-xs ml-auto">
                            Selected
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-slate-700" />

        {/* Placeholder Area Configuration */}
        <div>
          <h3 className="text-white font-medium flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4" />
            Image Placeholder Area
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Position (X, Y)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={placeholderArea.x}
                  onChange={(e) => setPlaceholderArea(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="X"
                />
                <Input
                  type="number"
                  value={placeholderArea.y}
                  onChange={(e) => setPlaceholderArea(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Y"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Size (W, H)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={placeholderArea.width}
                  onChange={(e) => setPlaceholderArea(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Width"
                />
                <Input
                  type="number"
                  value={placeholderArea.height}
                  onChange={(e) => setPlaceholderArea(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Height"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveFrame}
          className="w-full bg-crd-green hover:bg-green-600 text-black"
          disabled={!frameName.trim() || selectedLayers.size === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Create CRD Frame
        </Button>
      </CardContent>
    </Card>
  );
};
