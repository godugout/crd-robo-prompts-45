
import React, { useState } from 'react';
import { PSDFileProcessor } from './components/PSDFileProcessor';
import { PSDLayerInspector } from './components/PSDLayerInspector';
import { CRDElementConverter } from './components/CRDElementConverter';
import { FrameAssemblyPreview } from './components/FrameAssemblyPreview';
import { DebugTools } from './components/DebugTools';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';

// Convert ProcessedPSD types to component types
interface PSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  visible: boolean;
  opacity: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zIndex: number;
  imageData?: string;
  // New semantic properties
  semanticType?: 'background' | 'player' | 'stats' | 'logo' | 'effect' | 'border' | 'text';
  inferredDepth?: number;
  materialHints?: {
    isMetallic: boolean;
    isHolographic: boolean;
    hasGlow: boolean;
  };
}

interface CRDElementDraft {
  id: string;
  layerId: string;
  name: string;
  type: 'border' | 'logo' | 'label' | 'decorative' | 'corner' | 'accent';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  zIndex: number;
  opacity: number;
  rotation: number;
  scale: number;
  imageUrl: string;
}

const getSemanticTypeColor = (type?: string) => {
  switch (type) {
    case 'background': return 'bg-blue-500/20 text-blue-300';
    case 'player': return 'bg-green-500/20 text-green-300';
    case 'stats': return 'bg-yellow-500/20 text-yellow-300';
    case 'logo': return 'bg-purple-500/20 text-purple-300';
    case 'border': return 'bg-red-500/20 text-red-300';
    case 'text': return 'bg-cyan-500/20 text-cyan-300';
    case 'effect': return 'bg-orange-500/20 text-orange-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

const getMaterialBadge = (materialHints?: PSDLayer['materialHints']) => {
  if (!materialHints) return null;
  
  const badges = [];
  if (materialHints.isMetallic) {
    badges.push(
      <span key="metallic" className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs rounded-full">
        ✨ Metallic
      </span>
    );
  }
  if (materialHints.isHolographic) {
    badges.push(
      <span key="holographic" className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white text-xs rounded-full">
        🌈 Holographic
      </span>
    );
  }
  if (materialHints.hasGlow) {
    badges.push(
      <span key="glow" className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-xs rounded-full">
        💫 Glow
      </span>
    );
  }
  
  return badges.length > 0 ? <div className="flex flex-wrap gap-1 mt-1">{badges}</div> : null;
};

export const PSDPreviewInterface: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<ProcessedPSD | null>(null);
  const [layers, setLayers] = useState<PSDLayer[]>([]);
  const [elements, setElements] = useState<CRDElementDraft[]>([]);
  const [debugMode, setDebugMode] = useState(true);

  const handlePSDProcessed = (psd: ProcessedPSD) => {
    console.log('PSD processed in interface:', psd);
    setProcessedPSD(psd);
    
    // Convert processed layers to component format
    const convertedLayers: PSDLayer[] = psd.layers.map(layer => ({
      id: layer.id,
      name: layer.name,
      type: layer.type,
      visible: layer.visible,
      opacity: layer.opacity,
      bounds: layer.bounds,
      zIndex: layer.zIndex,
      imageData: layer.imageData,
      semanticType: layer.semanticType,
      inferredDepth: layer.inferredDepth,
      materialHints: layer.materialHints
    }));
    
    setLayers(convertedLayers);
    setElements([]); // Reset elements when new PSD is processed
  };

  const handleLayersChange = (updatedLayers: PSDLayer[]) => {
    setLayers(updatedLayers);
  };

  const handleElementsChange = (updatedElements: CRDElementDraft[]) => {
    setElements(updatedElements);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            PSD Preview Interface
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload and process Photoshop files to extract layers and convert them into CRD frame elements with semantic 3D analysis
          </p>
        </div>

        {/* File Processor */}
        <PSDFileProcessor onPSDProcessed={handlePSDProcessed} />

        {/* Main Content - Only show if PSD is processed */}
        {processedPSD && layers.length > 0 && (
          <div className="space-y-8">
            {/* PSD Info with Semantic Analysis */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">PSD Information & Semantic Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <span className="text-gray-400">Dimensions:</span>
                  <span className="text-white ml-2">{processedPSD.width} × {processedPSD.height} px</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Layers:</span>
                  <span className="text-white ml-2">{layers.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Visible Layers:</span>
                  <span className="text-white ml-2">{layers.filter(l => l.visible).length}</span>
                </div>
                <div>
                  <span className="text-gray-400">3D Ready:</span>
                  <span className="text-crd-green ml-2">{layers.filter(l => l.semanticType).length}</span>
                </div>
              </div>

              {/* Semantic Type Distribution */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Layer Semantic Analysis</h4>
                <div className="flex flex-wrap gap-2">
                  {['background', 'player', 'stats', 'logo', 'border', 'text', 'effect'].map(type => {
                    const count = layers.filter(l => l.semanticType === type).length;
                    if (count === 0) return null;
                    return (
                      <span key={type} className={`px-3 py-1 rounded-full text-xs font-medium ${getSemanticTypeColor(type)}`}>
                        {type}: {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Material Hints Summary */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Material Effects Detected</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {layers.filter(l => l.materialHints?.isMetallic).length}
                    </div>
                    <div className="text-sm text-gray-400">Metallic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {layers.filter(l => l.materialHints?.isHolographic).length}
                    </div>
                    <div className="text-sm text-gray-400">Holographic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {layers.filter(l => l.materialHints?.hasGlow).length}
                    </div>
                    <div className="text-sm text-gray-400">Glowing</div>
                  </div>
                </div>
              </div>
              
              {/* Full PSD Preview */}
              {processedPSD.fullImageData && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Full PSD Composite</h4>
                  <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700 p-4">
                    <img 
                      src={processedPSD.fullImageData} 
                      alt="Full PSD Composite"
                      className="max-w-full max-h-64 object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Layer Inspector */}
            <PSDLayerInspector 
              layers={layers} 
              onLayersChange={handleLayersChange}
            />

            {/* CRD Element Converter */}
            <CRDElementConverter 
              layers={layers}
              elements={elements}
              onElementsChange={handleElementsChange}
            />

            {/* Frame Assembly Preview */}
            <FrameAssemblyPreview 
              elements={elements}
              debugMode={debugMode}
            />

            {/* Debug Tools */}
            <DebugTools 
              layers={layers}
              elements={elements}
              onElementsChange={handleElementsChange}
            />
          </div>
        )}

        {/* Empty State */}
        {!processedPSD && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered PSD Analysis</h3>
            <p className="text-gray-400">
              Upload a PSD file to automatically analyze layers for semantic type, 3D depth, and material properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
