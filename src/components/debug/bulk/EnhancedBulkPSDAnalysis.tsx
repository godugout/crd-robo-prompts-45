
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { BulkPSDUploader } from './BulkPSDUploader';
import { LayerElementSelector } from './LayerElementSelector';
import { 
  Eye, 
  Layers, 
  FileImage, 
  Zap, 
  Sparkles, 
  Play,
  ChevronRight,
  Grid,
  BarChart3,
  Trash2
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'overview' | 'analysis' | 'selection'>('overview');

  const selectedPSD = psdData.find(psd => psd.id === selectedPSDId);

  const getComplexityScore = (psd: BulkPSDData) => {
    const layerTypes = new Set(psd.processedPSD.layers.map(l => l.type)).size;
    const semanticTypes = new Set(psd.processedPSD.layers.map(l => l.semanticType).filter(Boolean)).size;
    return Math.min(100, (psd.processedPSD.totalLayers * 2) + (semanticTypes * 5) + (layerTypes * 3));
  };

  const getConfidenceScore = (psd: BulkPSDData) => {
    const layersWithSemantic = psd.processedPSD.layers.filter(l => l.semanticType).length;
    return Math.round((layersWithSemantic / psd.processedPSD.totalLayers) * 100);
  };

  const handleAnalyzePSD = (psdId: string) => {
    setSelectedPSDId(psdId);
    setViewMode('analysis');
  };

  const handleCreateCRDFrame = (psdId: string) => {
    setSelectedPSDId(psdId);
    setViewMode('selection');
  };

  const renderOverviewMode = () => (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-[#131316] border-slate-700">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-crd-green/20 rounded-lg flex items-center justify-center">
              <FileImage className="w-5 h-5 text-crd-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Upload PSD Files</h3>
              <p className="text-slate-400 text-sm">Drag and drop multiple PSD files for analysis</p>
            </div>
          </div>
          <BulkPSDUploader
            onPSDsProcessed={onPSDsProcessed}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </div>
      </Card>

      {/* PSD Grid */}
      {psdData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {psdData.map((psd) => {
            const complexityScore = getComplexityScore(psd);
            const confidenceScore = getConfidenceScore(psd);
            const semanticTypes = new Set(psd.processedPSD.layers.map(l => l.semanticType).filter(Boolean));

            return (
              <Card key={psd.id} className="bg-[#131316] border-slate-700 group hover:border-crd-green/50 transition-all">
                <div className="p-6">
                  {/* PSD Preview */}
                  <div className="aspect-[4/3] bg-slate-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <div className="text-center text-slate-400">
                      <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">{psd.processedPSD.width}×{psd.processedPSD.height}</p>
                    </div>
                  </div>

                  {/* PSD Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-medium truncate">{psd.fileName}</h3>
                      <p className="text-slate-400 text-xs">{psd.uploadedAt.toLocaleDateString()}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Layers className="w-4 h-4 text-crd-green" />
                          <span className="text-xs text-slate-400">Layers</span>
                        </div>
                        <p className="text-white font-medium">{psd.processedPSD.totalLayers}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-slate-400">Elements</span>
                        </div>
                        <p className="text-white font-medium">{semanticTypes.size}</p>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Complexity</span>
                          <span className="text-white">{complexityScore}</span>
                        </div>
                        <Progress value={complexityScore} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">AI Confidence</span>
                          <span className="text-white">{confidenceScore}%</span>
                        </div>
                        <Progress value={confidenceScore} className="h-1" />
                      </div>
                    </div>

                    {/* Semantic Types */}
                    <div className="flex flex-wrap gap-1">
                      {Array.from(semanticTypes).slice(0, 3).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs text-crd-green border-crd-green/30">
                          {type}
                        </Badge>
                      ))}
                      {semanticTypes.size > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{semanticTypes.size - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAnalyzePSD(psd.id)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCreateCRDFrame(psd.id)}
                        className="flex-1 bg-crd-green text-black hover:bg-crd-green/90"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Frame
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemovePSD(psd.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {psdData.length === 0 && !isUploading && (
        <Card className="bg-[#131316] border-slate-700">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Ready for Analysis</h3>
            <p className="text-slate-400 mb-6">
              Upload PSD files to start analyzing their layer structure and create CRD frames
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Visual layer analysis
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Smart element detection
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                One-click CRD creation
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderAnalysisMode = () => {
    if (!selectedPSD) return null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setViewMode('overview')} className="text-slate-300">
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Back to Overview
        </Button>

        {/* Analysis Content - Import the existing visual analysis */}
        <Card className="bg-[#131316] border-slate-700">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Layer Analysis - {selectedPSD.fileName}
            </h3>
            {/* This would integrate with the existing VisualLayerAnalysis component */}
            <div className="text-center py-12 text-slate-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <p>Detailed layer analysis will be shown here</p>
              <p className="text-sm mt-2">Integration with existing VisualLayerAnalysis component</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderSelectionMode = () => {
    if (!selectedPSD) return null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setViewMode('overview')} className="text-slate-300">
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Back to Overview
        </Button>

        {/* Element Selection */}
        <LayerElementSelector processedPSD={selectedPSD.processedPSD} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {viewMode === 'overview' && renderOverviewMode()}
      {viewMode === 'analysis' && renderAnalysisMode()}
      {viewMode === 'selection' && renderSelectionMode()}
    </div>
  );
};
