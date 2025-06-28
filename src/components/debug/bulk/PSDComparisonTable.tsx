import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { VisualLayerAnalysis } from './VisualLayerAnalysis';
import { X, FileImage, Layers, Eye, BarChart3, Trash2 } from 'lucide-react';

interface PSDComparisonTableProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const PSDComparisonTable: React.FC<PSDComparisonTableProps> = ({
  psdData,
  onRemovePSD
}) => {
  const [selectedPSDId, setSelectedPSDId] = useState<string | null>(null);

  return (
    <Card className="bg-[#131316] border-slate-700">
      <Tabs defaultValue="table" className="w-full">
        <div className="p-4 border-b border-slate-700">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger 
              value="table"
              className="flex items-center gap-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <BarChart3 className="w-4 h-4" />
              Comparison Table
            </TabsTrigger>
            <TabsTrigger 
              value="visual"
              className="flex items-center gap-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Eye className="w-4 h-4" />
              Visual Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300">File</TableHead>
                  <TableHead className="text-slate-300">Dimensions</TableHead>
                  <TableHead className="text-slate-300">Layers</TableHead>
                  <TableHead className="text-slate-300">Layer Types</TableHead>
                  <TableHead className="text-slate-300">Semantic Elements</TableHead>
                  <TableHead className="text-slate-300">Complexity</TableHead>
                  <TableHead className="text-slate-300">Depth Range</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {psdData.map((psd) => {
                  const layerTypes = psd.processedPSD.layers.reduce((acc, layer) => {
                    acc[layer.type] = (acc[layer.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                  const semanticTypes = psd.processedPSD. layers.reduce((acc, layer) => {
                    if (layer.semanticType) {
                      acc[layer.semanticType] = (acc[layer.semanticType] || 0) + 1;
                    }
                    return acc;
                  }, {} as Record<string, number>);

                  const depthValues = psd.processedPSD.layers
                    .filter(layer => layer.inferredDepth !== undefined)
                    .map(layer => layer.inferredDepth!);
                  
                  const minDepth = depthValues.length > 0 ? Math.min(...depthValues) : 0;
                  const maxDepth = depthValues.length > 0 ? Math.max(...depthValues) : 0;

                  const complexityScore = Math.min(100, 
                    (psd.processedPSD.totalLayers * 2) + 
                    (Object.keys(semanticTypes).length * 5) + 
                    (Object.keys(layerTypes).length * 3)
                  );

                  return (
                    <TableRow key={psd.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-white font-medium">{psd.fileName}</p>
                            <p className="text-slate-400 text-xs">
                              {psd.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {psd.processedPSD.width} × {psd.processedPSD.height}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-crd-green" />
                          <span className="text-white">{psd.processedPSD.totalLayers}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(layerTypes).map(([type, count]) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}: {count}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(semanticTypes).map(([type, count]) => (
                            <Badge key={type} variant="outline" className="text-xs text-crd-green border-crd-green/30">
                              {type}: {count}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-crd-green h-2 rounded-full" 
                              style={{ width: `${complexityScore}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">{complexityScore}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {depthValues.length > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            {minDepth.toFixed(2)} - {maxDepth.toFixed(2)}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">No depth data</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemovePSD(psd.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="visual" className="p-4">
          <VisualLayerAnalysis
            psdData={psdData}
            selectedPSDId={selectedPSDId}
            onSelectPSD={setSelectedPSDId}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
