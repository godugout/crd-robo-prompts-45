
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { BulkPSDUploader } from './BulkPSDUploader';
import { PSDComparisonTable } from './PSDComparisonTable';
import { EnhancedPSDCard } from './enhanced/EnhancedPSDCard';
import { RealLayerPreviewGrid } from './enhanced/RealLayerPreviewGrid';
import { InteractiveCardOverlay } from './enhanced/InteractiveCardOverlay';
import { Upload, Grid, Eye, Sparkles, ArrowRight } from 'lucide-react';

interface EnhancedBulkPSDAnalysisProps {
  psdData: BulkPSDData[];
  onPSDsProcessed: (newPSDs: BulkPSDData[]) => void;
  onRemovePSD: (id: string) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export const EnhancedBulkPSDAnalysis: React.FC<EnhancedBulkPSDAnalysisProps> = ({
  psdData,
  onPSDsProcessed,
  onRemovePSD,
  isUploading,
  setIsUploading
}) => {
  const [selectedPSDId, setSelectedPSDId] = useState<string | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<'grid' | 'analysis' | 'overlay'>('grid');

  const selectedPSD = psdData.find(psd => psd.id === selectedPSDId);

  const handleLayerToggle = useCallback((layerId: string) => {
    setSelectedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const handleLayerSelect = useCallback((layerId: string) => {
    console.log('Layer selected:', layerId);
  }, []);

  const handleLayerPreview = useCallback((layerId: string) => {
    console.log('Layer preview:', layerId);
  }, []);

  const handleCreateCRDFrame = useCallback((psdId: string) => {
    console.log('Create CRD frame for PSD:', psdId);
    // TODO: Implement enhanced CRD frame creation workflow
  }, []);

  const handleBulkCreateFrames = useCallback(() => {
    const selectedElements = Array.from(selectedLayers);
    console.log('Create CRD frames for selected elements:', selectedElements);
    // TODO: Implement bulk CRD frame creation with real images
  }, [selectedLayers]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {psdData.length === 0 && (
        <Card className="bg-[#131316] border-slate-700">
          <div className="p-6">
            <BulkPSDUploader
              onPSDsProcessed={onPSDsProcessed}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>
        </Card>
      )}

      {/* Main Content */}
      {psdData.length > 0 && (
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-slate-800">
              <TabsTrigger 
                value="grid"
                className="flex items-center gap-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                <Grid className="w-4 h-4" />
                Visual Gallery
              </TabsTrigger>
              <TabsTrigger 
                value="analysis"
                className="flex items-center gap-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                <Eye className="w-4 h-4" />
                Real Layer Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="overlay"
                className="flex items-center gap-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                <Sparkles className="w-4 h-4" />
                Interactive Overlay
              </TabsTrigger>
            </TabsList>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="upload-more">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload More PSDs
                </label>
              </Button>
              <input
                id="upload-more"
                type="file"
                multiple
                accept=".psd"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    // Handle additional uploads
                    console.log('Additional files:', e.target.files);
                  }
                }}
              />
              
              {selectedLayers.size > 0 && (
                <Button
                  onClick={handleBulkCreateFrames}
                  className="bg-crd-green text-black hover:bg-crd-green/90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create {selectedLayers.size} CRD Frames
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Visual Gallery View */}
          <TabsContent value="grid" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {psdData.map((psd) => (
                <EnhancedPSDCard
                  key={psd.id}
                  psd={psd}
                  onSelect={setSelectedPSDId}
                  onAnalyze={handleCreateCRDFrame}
                  isSelected={selectedPSDId === psd.id}
                />
              ))}
            </div>
          </TabsContent>

          {/* Real Layer Analysis View */}
          <TabsContent value="analysis" className="space-y-6">
            {selectedPSD ? (
              <RealLayerPreviewGrid
                processedPSD={selectedPSD.enhancedProcessedPSD}
                selectedLayers={selectedLayers}
                onLayerToggle={handleLayerToggle}
                onLayerSelect={handleLayerSelect}
                onLayerPreview={handleLayerPreview}
              />
            ) : (
              <Card className="bg-[#131316] border-slate-700">
                <div className="p-12 text-center">
                  <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Select a PSD for Real Layer Analysis</h3>
                  <p className="text-slate-400">
                    Choose a PSD card above to explore its layers with real image previews
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Interactive Overlay View */}
          <TabsContent value="overlay" className="space-y-6">
            {selectedPSD ? (
              <InteractiveCardOverlay
                processedPSD={selectedPSD.enhancedProcessedPSD}
                selectedLayers={selectedLayers}
                onLayerSelect={handleLayerSelect}
                onLayerToggle={handleLayerToggle}
              />
            ) : (
              <Card className="bg-[#131316] border-slate-700">
                <div className="p-12 text-center">
                  <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Select a PSD for Interactive Overlay</h3>
                  <p className="text-slate-400">
                    Choose a PSD card above to see color-coded element overlays with real images
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Legacy Table View */}
      {psdData.length > 0 && (
        <PSDComparisonTable
          psdData={psdData}
          onRemovePSD={onRemovePSD}
        />
      )}
    </div>
  );
};
