
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { bulkElementClassificationService } from '@/services/psdProcessor/bulkElementClassificationService';
import { X, Eye, EyeOff, Download, Layers, Grid, List } from 'lucide-react';

interface PSDComparisonTableProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const PSDComparisonTable: React.FC<PSDComparisonTableProps> = ({
  psdData,
  onRemovePSD
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const analysisData = useMemo(() => {
    return bulkElementClassificationService.analyzeBulkPSDs(psdData);
  }, [psdData]);

  const elementCategories = [
    'all',
    'background',
    'player',
    'text',
    'logo',
    'border',
    'stats',
    'effect'
  ];

  const filteredElements = useMemo(() => {
    if (selectedCategory === 'all') {
      return analysisData.standardizedElements;
    }
    return analysisData.standardizedElements.filter(element => 
      element.category === selectedCategory
    );
  }, [analysisData.standardizedElements, selectedCategory]);

  const getElementPreview = (psdId: string, elementType: string) => {
    const psd = psdData.find(p => p.id === psdId);
    if (!psd) return null;

    const matchingLayers = psd.processedPSD.layers.filter(layer => 
      layer.semanticType === elementType
    );

    return matchingLayers.length > 0 ? matchingLayers[0] : null;
  };

  const ElementCell: React.FC<{ 
    psdId: string; 
    elementType: string; 
    elementName: string;
  }> = ({ psdId, elementType, elementName }) => {
    const layer = getElementPreview(psdId, elementType);
    const [isVisible, setIsVisible] = useState(true);

    if (!layer) {
      return (
        <div className="p-2 text-center text-slate-500 text-xs">
          Not found
        </div>
      );
    }

    return (
      <div className="p-2 group">
        <div className="relative">
          <div className="w-16 h-16 bg-slate-700 rounded border overflow-hidden mx-auto mb-1">
            {layer.imageData && isVisible ? (
              <img 
                src={layer.imageData} 
                alt={layer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Layers className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? 
              <Eye className="w-3 h-3" /> : 
              <EyeOff className="w-3 h-3" />
            }
          </Button>
        </div>
        
        <div className="text-xs text-slate-300 text-center truncate" title={layer.name}>
          {layer.name}
        </div>
        
        <div className="flex justify-center mt-1">
          <Badge variant="outline" className="text-xs px-1 py-0">
            {Math.round(layer.opacity * 100)}%
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-white">Element Comparison</h3>
            <Badge variant="outline">
              {psdData.length} PSDs • {analysisData.standardizedElements.length} Element Types
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 mr-1" />
              Grid
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="bg-slate-800 border-slate-700">
            {elementCategories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                {category === 'all' ? 'All Elements' : category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* PSD Files Header */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {psdData.map((psd) => (
            <div
              key={psd.id}
              className="flex-shrink-0 bg-slate-800 rounded-lg p-3 min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium text-sm truncate" title={psd.fileName}>
                  {psd.fileName.replace('.psd', '')}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePSD(psd.id)}
                  className="text-red-400 hover:text-red-300 p-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="text-xs text-slate-400 space-y-1">
                <div>Layers: {psd.processedPSD.totalLayers}</div>
                <div>Size: {psd.processedPSD.width} × {psd.processedPSD.height}</div>
                <div>Elements: {new Set(psd.processedPSD.layers.map(l => l.semanticType)).size}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left p-3 text-white font-medium border border-slate-700 min-w-[150px]">
                    Element Type
                  </th>
                  {psdData.map((psd) => (
                    <th
                      key={psd.id}
                      className="text-center p-3 text-white font-medium border border-slate-700 min-w-[120px]"
                    >
                      <div className="truncate" title={psd.fileName}>
                        {psd.fileName.replace('.psd', '')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredElements.map((element) => (
                  <tr key={element.type} className="hover:bg-slate-800/50">
                    <td className="p-3 border border-slate-700">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {element.category}
                        </Badge>
                        <span className="text-white font-medium">{element.displayName}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Found in {element.foundInPSDs.length}/{psdData.length} PSDs
                      </div>
                    </td>
                    {psdData.map((psd) => (
                      <td key={psd.id} className="border border-slate-700">
                        <ElementCell
                          psdId={psd.id}
                          elementType={element.type}
                          elementName={element.displayName}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid gap-6">
            {filteredElements.map((element) => (
              <Card key={element.type} className="bg-slate-800 border-slate-700">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium">{element.displayName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {element.category}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Found in {element.foundInPSDs.length}/{psdData.length} PSDs
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {psdData.map((psd) => (
                      <div key={psd.id} className="text-center">
                        <div className="text-xs text-slate-400 mb-2 truncate" title={psd.fileName}>
                          {psd.fileName.replace('.psd', '')}
                        </div>
                        <ElementCell
                          psdId={psd.id}
                          elementType={element.type}
                          elementName={element.displayName}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <h5 className="text-white font-medium mb-2">Consistency Score</h5>
            <div className="text-2xl font-bold text-crd-green">
              {Math.round(analysisData.consistencyScore * 100)}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Based on element presence across PSDs
            </p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4">
            <h5 className="text-white font-medium mb-2">Common Elements</h5>
            <div className="text-2xl font-bold text-blue-400">
              {analysisData.commonElements.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Found in all PSDs
            </p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4">
            <h5 className="text-white font-medium mb-2">Unique Elements</h5>
            <div className="text-2xl font-bold text-purple-400">
              {analysisData.uniqueElements.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Found in only one PSD
            </p>
          </Card>
        </div>
      </div>
    </Card>
  );
};
