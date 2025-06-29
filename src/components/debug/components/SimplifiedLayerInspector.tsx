
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerModeToggle, LayerMode } from './LayerModeToggle';
import { ElementsModeView } from './ElementsModeView';
import { FrameModeView } from './FrameModeView';
import { PreviewModeView } from './PreviewModeView';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Focus, Layers } from 'lucide-react';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onModeChange?: (mode: LayerMode) => void;
  onFlippedLayersChange?: (flippedLayers: Set<string>) => void;
  viewMode?: 'inspect' | 'frame' | 'build';
  focusMode?: boolean;
  showBackground?: boolean;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle,
  onModeChange,
  onFlippedLayersChange,
  viewMode = 'inspect',
  focusMode = false,
  showBackground = true
}) => {
  const [currentMode, setCurrentMode] = useState<LayerMode>('elements');

  // Sort layers by visual stacking order for display
  const sortedLayers = [...layers].sort((a, b) => {
    const aDepth = a.inferredDepth || a.bounds.top;
    const bDepth = b.inferredDepth || b.bounds.top;
    return aDepth - bDepth;
  });

  const handleModeChange = (mode: LayerMode) => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);
  const visibleLayerCount = layers.length - hiddenLayers.size;

  const renderModeContent = () => {
    switch (currentMode) {
      case 'elements':
        return (
          <ElementsModeView
            layers={sortedLayers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
          />
        );
      case 'frame':
        return (
          <FrameModeView
            layers={sortedLayers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
          />
        );
      case 'preview':
        return (
          <PreviewModeView
            layers={sortedLayers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
          />
        );
      default:
        return null;
    }
  };

  const renderModeSpecificInfo = () => {
    if (viewMode === 'inspect') {
      return (
        <div className="space-y-3">
          {/* Canvas State Indicators */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={showBackground ? "default" : "outline"} className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Background {showBackground ? 'On' : 'Off'}
            </Badge>
            <Badge variant={focusMode ? "default" : "outline"} className="text-xs">
              <Focus className="w-3 h-3 mr-1" />
              Focus {focusMode ? 'On' : 'Off'}
            </Badge>
          </div>

          {/* Layer Stats */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Visible</span>
                <div className="text-white font-medium">{visibleLayerCount}</div>
              </div>
              <div>
                <span className="text-slate-400">Total</span>
                <div className="text-white font-medium">{layers.length}</div>
              </div>
            </div>
          </div>

          {/* Selected Layer Info */}
          {selectedLayer && (
            <div className="bg-crd-green/10 border border-crd-green/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-crd-green" />
                <span className="text-crd-green font-medium text-sm">Selected Layer</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div><span className="text-slate-400">Name:</span> {selectedLayer.name}</div>
                <div><span className="text-slate-400">Type:</span> {selectedLayer.layerType}</div>
                <div><span className="text-slate-400">Size:</span> {Math.round(selectedLayer.bounds.right - selectedLayer.bounds.left)} × {Math.round(selectedLayer.bounds.bottom - selectedLayer.bounds.top)}</div>
                {selectedLayer.inferredDepth && (
                  <div><span className="text-slate-400">Depth:</span> {selectedLayer.inferredDepth.toFixed(2)}</div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (viewMode === 'frame') {
      return (
        <div className="space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-blue-400 font-medium text-sm">Frame Analysis Mode</span>
            </div>
            <p className="text-xs text-slate-400">
              Analyzing layer composition for optimal frame fitting. Blue outlines show layer boundaries.
            </p>
          </div>

          {selectedLayer && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-sm font-medium text-white mb-2">Frame Suitability</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Content Type</span>
                  <span className="text-white">{selectedLayer.layerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Position</span>
                  <span className="text-white">
                    {selectedLayer.bounds.left > 50 ? 'Centered' : 'Edge'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frame Priority</span>
                  <span className="text-green-400">
                    {selectedLayer.layerType === 'rasterLayer' ? 'High' : 'Medium'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (viewMode === 'build') {
      return (
        <div className="space-y-3">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-purple-400 rounded"></div>
              <span className="text-purple-400 font-medium text-sm">Build Mode</span>
            </div>
            <p className="text-xs text-slate-400">
              Ready to generate CRD frames based on your layer selection and analysis.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-sm font-medium text-white mb-2">Build Status</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Ready Layers</span>
                <span className="text-green-400">{visibleLayerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Focus Layer</span>
                <span className="text-white">{selectedLayer?.name || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Mode Toggle */}
      <div className="flex-shrink-0 p-3 border-b border-slate-700 bg-[#1a1f2e]">
        <LayerModeToggle
          currentMode={currentMode}
          onModeChange={handleModeChange}
          layerCount={layers.length}
        />
      </div>
      
      {/* Mode-Specific Information */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
        {renderModeSpecificInfo()}
      </div>

      {/* Scrollable Layer Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderModeContent()}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-3 border-t border-slate-700/50 bg-[#1a1f2e]/50">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Canvas: {Math.round(100 * (visibleLayerCount / layers.length))}% visible</span>
          {focusMode && <span className="text-blue-400">Focus Active</span>}
        </div>
      </div>
    </div>
  );
};
