
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { LayerThumbnailGrid } from './LayerThumbnailGrid';
import { LayerCanvasViewer } from './LayerCanvasViewer';
import { LayerArchitectureView } from './LayerArchitectureView';
import { Eye, Layers, Info, Grid, Paintbrush, Building } from 'lucide-react';

interface VisualLayerAnalysisProps {
  psdData: BulkPSDData[];
  selectedPSDId: string | null;
  onSelectPSD: (id: string) => void;
}

export const VisualLayerAnalysis: React.FC<VisualLayerAnalysisProps> = ({
  psdData,
  selectedPSDId,
  onSelectPSD
}) => {
  const [viewMode, setViewMode] = useState<'thumbnails' | 'canvas' | 'architecture'>('thumbnails');
  
  const selectedPSD = psdData.find(psd => psd.id === selectedPSDId);

  return (
    <div className="space-y-6">
      {/* PSD Selection */}
      <Card className="bg-[#131316] border-slate-700">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-crd-green" />
            Select PSD for Visual Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {psdData.map((psd) => (
              <Button
                key={psd.id}
                variant={selectedPSDId === psd.id ? "default" : "outline"}
                className={`h-auto p-3 text-left justify-start ${
                  selectedPSDId === psd.id 
                    ? 'bg-crd-green text-black' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
                }`}
                onClick={() => onSelectPSD(psd.id)}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="font-medium truncate w-full">{psd.fileName}</span>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {psd.processedPSD.width}×{psd.processedPSD.height}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {psd.processedPSD.totalLayers} layers
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Visual Analysis Content */}
      {selectedPSD && (
        <Card className="bg-[#131316] border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-crd-green" />
                Visual Layer Analysis - {selectedPSD.fileName}
              </h3>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'thumbnails' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('thumbnails')}
                  className={viewMode === 'thumbnails' ? 'bg-crd-green text-black' : ''}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Thumbnails
                </Button>
                <Button
                  variant={viewMode === 'canvas' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('canvas')}
                  className={viewMode === 'canvas' ? 'bg-crd-green text-black' : ''}
                >
                  <Paintbrush className="w-4 h-4 mr-2" />
                  Canvas
                </Button>
                <Button
                  variant={viewMode === 'architecture' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('architecture')}
                  className={viewMode === 'architecture' ? 'bg-crd-green text-black' : ''}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Architecture
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4">
            {viewMode === 'thumbnails' && (
              <LayerThumbnailGrid processedPSD={selectedPSD.processedPSD} />
            )}
            {viewMode === 'canvas' && (
              <LayerCanvasViewer processedPSD={selectedPSD.processedPSD} />
            )}
            {viewMode === 'architecture' && (
              <LayerArchitectureView processedPSD={selectedPSD.processedPSD} />
            )}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedPSD && (
        <Card className="bg-[#131316] border-slate-700">
          <div className="p-12 text-center">
            <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Select a PSD for Visual Analysis</h3>
            <p className="text-slate-400">
              Choose a PSD file above to explore its layer structure in detail
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
