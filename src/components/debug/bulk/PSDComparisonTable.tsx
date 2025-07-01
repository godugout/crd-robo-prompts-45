
import React, { useState } from 'react';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { enhancedLayerAnalysisService } from '@/services/psdProcessor/enhancedLayerAnalysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Trash2, 
  Download, 
  BarChart3,
  Layers,
  Zap
} from 'lucide-react';

interface PSDComparisonTableProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const PSDComparisonTable: React.FC<PSDComparisonTableProps> = ({
  psdData,
  onRemovePSD
}) => {
  const [selectedPSDs, setSelectedPSDs] = useState<Set<string>>(new Set());

  const togglePSDSelection = (id: string) => {
    const newSelected = new Set(selectedPSDs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPSDs(newSelected);
  };

  const getAnalysisStats = (psd: BulkPSDData) => {
    const analysis = psd.processedPSD.layers.map(layer => 
      enhancedLayerAnalysisService.analyzeLayer(layer)
    );
    
    return {
      highConfidence: analysis.filter(a => a.confidence > 0.7).length,
      frameElements: analysis.filter(a => a.frameElementPotential === 'high').length,
      semanticTypes: new Set(analysis.map(a => a.semanticType)).size,
      avgConfidence: analysis.reduce((acc, a) => acc + a.confidence, 0) / analysis.length
    };
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-crd-green" />
            PSD Comparison Analysis
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {selectedPSDs.size > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedPSDs.size} selected
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export Comparison
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">File</TableHead>
                <TableHead className="text-slate-300">Dimensions</TableHead>
                <TableHead className="text-slate-300">Layers</TableHead>
                <TableHead className="text-slate-300">High Confidence</TableHead>
                <TableHead className="text-slate-300">Frame Elements</TableHead>
                <TableHead className="text-slate-300">Semantic Types</TableHead>
                <TableHead className="text-slate-300">Avg Confidence</TableHead>
                <TableHead className="text-slate-300">Uploaded</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {psdData.map((psd) => {
                const stats = getAnalysisStats(psd);
                const isSelected = selectedPSDs.has(psd.id);
                
                return (
                  <TableRow 
                    key={psd.id} 
                    className={`border-slate-700 cursor-pointer transition-colors ${
                      isSelected ? 'bg-crd-green/10' : 'hover:bg-slate-800/50'
                    }`}
                    onClick={() => togglePSDSelection(psd.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePSDSelection(psd.id)}
                          className="rounded border-slate-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <p className="text-white font-medium truncate max-w-[150px]">
                            {psd.fileName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(psd.processedPSD.fileSize / 1024 / 1024).toFixed(1)} MB
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
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-400" />
                        <span className="text-white">{psd.processedPSD.totalLayers}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-green-400" />
                        <span className="text-white">{stats.highConfidence}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={stats.frameElements > 0 ? "default" : "outline"}
                        className="text-xs"
                      >
                        {stats.frameElements}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-white">{stats.semanticTypes}</span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-1.5">
                          <div 
                            className="h-full bg-crd-green rounded-full" 
                            style={{ width: `${stats.avgConfidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-white">
                          {(stats.avgConfidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-xs text-slate-400">
                        {psd.uploadedAt.toLocaleDateString()}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to detail view
                          }}
                          className="p-1 h-6 w-6"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePSD(psd.id);
                          }}
                          className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {psdData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No PSD files to compare</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
