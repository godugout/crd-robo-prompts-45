
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { Wand2, Sparkles, Download } from 'lucide-react';

interface CRDFrameBuilderProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId?: string;
  hiddenLayers: Set<string>;
  flippedLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onFlippedLayersChange: (flipped: Set<string>) => void;
  onFrameGenerated?: (svgContent: string) => void;
}

export const CRDFrameBuilder: React.FC<CRDFrameBuilderProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  flippedLayers,
  onLayerSelect,
  onToggleVisibility,
  onFlippedLayersChange,
  onFrameGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFrame, setGeneratedFrame] = useState<string | null>(null);

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);

  const generateCRDFrame = async () => {
    setIsGenerating(true);
    
    // Simulate frame generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const svgContent = `
      <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <rect width="400" height="600" fill="url(#crdGradient)" rx="20"/>
        <rect x="20" y="60" width="360" height="240" fill="white" rx="10"/>
        <rect x="20" y="320" width="360" height="120" fill="rgba(255,255,255,0.9)" rx="10"/>
        <rect x="20" y="460" width="360" height="80" fill="rgba(255,255,255,0.8)" rx="10"/>
        
        <text x="200" y="40" text-anchor="middle" fill="white" font-size="16" font-weight="bold">
          CRD TRADING CARD
        </text>
        
        ${selectedLayer ? `
          <text x="200" y="570" text-anchor="middle" fill="white" font-size="12">
            Layer: ${selectedLayer.name}
          </text>
        ` : ''}
      </svg>
    `;
    
    setGeneratedFrame(svgContent);
    setIsGenerating(false);
    
    if (onFrameGenerated) {
      onFrameGenerated(svgContent);
    }
  };

  const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
  const flippedLayersCount = flippedLayers.size;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b]">
      <div className="flex-1 p-6 space-y-6">
        <Card className="bg-[#1a1f2e] border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="w-6 h-6 text-crd-green" />
            <h3 className="text-xl font-semibold text-white">CRD Frame Builder</h3>
          </div>
          
          <p className="text-slate-400 mb-6">
            Generate custom CRD frames based on your PSD layers and analysis
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">Visible Layers</h4>
              <p className="text-2xl font-bold text-crd-green">{visibleLayers.length}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">Flipped Layers</h4>
              <p className="text-2xl font-bold text-crd-green">{flippedLayersCount}</p>
            </div>
          </div>
          
          {selectedLayer && (
            <div className="mb-6 p-4 bg-slate-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">Selected Layer</h4>
              <p className="text-slate-300">{selectedLayer.name}</p>
              <p className="text-sm text-slate-400">
                {Math.round(selectedLayer.bounds.right - selectedLayer.bounds.left)} × {Math.round(selectedLayer.bounds.bottom - selectedLayer.bounds.top)}
              </p>
            </div>
          )}
          
          <Button
            onClick={generateCRDFrame}
            disabled={isGenerating}
            className="w-full bg-crd-green text-black hover:bg-crd-green/90 h-12"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating Frame...' : 'Generate CRD Frame'}
          </Button>
        </Card>

        {generatedFrame && (
          <Card className="bg-[#1a1f2e] border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Generated Frame</h4>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export SVG
              </Button>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div
                className="w-full h-64 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: generatedFrame }}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
