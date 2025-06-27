
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
      imageData: layer.imageData
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
            Upload and process Photoshop files to extract layers and convert them into CRD frame elements
          </p>
        </div>

        {/* File Processor */}
        <PSDFileProcessor onPSDProcessed={handlePSDProcessed} />

        {/* Main Content - Only show if PSD is processed */}
        {processedPSD && layers.length > 0 && (
          <div className="space-y-8">
            {/* PSD Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">PSD Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-white mb-2">No PSD File Processed</h3>
            <p className="text-gray-400">
              Upload a PSD file above to start extracting layers and creating CRD elements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
