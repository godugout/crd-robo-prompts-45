
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Trash2, 
  Eye, 
  Download,
  ChevronDown,
  ChevronRight,
  Layers,
  Palette,
  Box
} from 'lucide-react';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { enhancedLayerAnalysisService } from '@/services/psdProcessor/enhancedLayerAnalysisService';

interface BulkAnalysisTableProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const BulkAnalysisTable: React.FC<BulkAnalysisTableProps> = ({
  psdData,
  onRemovePSD
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getSemanticTypeStats = (psd: BulkPSDData['processedPSD']) => {
    const stats: Record<string, number> = {};
    psd.layers.forEach(layer => {
      const analysis = enhancedLayerAnalysisService.analyzeLayer(layer);
      stats[analysis.semanticType] = (stats[analysis.semanticType] || 0) + 1;
    });
    return stats;
  };

  const getFrameElementsCount = (psd: BulkPSDData['processedPSD']) => {
    return psd.layers.filter(layer => {
      const analysis = enhancedLayerAnalysisService.analyzeLayer(layer);
      return analysis.frameElementPotential === 'high';
    }).length;
  };

  const getAverageConfidence = (psd: BulkPSDData['processedPSD']) => {
    const confidences = psd.layers.map(layer => {
      const analysis = enhancedLayerAnalysisService.analyzeLayer(layer);
      return analysis.confidence;
    });
    return confidences.length > 0 
      ? (confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(2)
      : '0.00';
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-crd-green" />
            <h3 className="text-lg font-semibold text-white">PSD Analysis Comparison</h3>
          </div>
          <div className="text-sm text-slate-400">
            {psdData.length} files analyzed
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300 w-8"></TableHead>
                <TableHead className="text-slate-300">File Name</TableHead>
                <TableHead className="text-slate-300">Dimensions</TableHead>
                <TableHead className="text-slate-300">Layers</TableHead>
                <TableHead className="text-slate-300">Frame Elements</TableHead>
                <TableHead className="text-slate-300">Avg Confidence</TableHead>
                <TableHead className="text-slate-300">Semantic Types</TableHead>
                <TableHead className="text-slate-300">Uploaded</TableHead>
                <TableHead className="text-slate-300 w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {psdData.map((psd) => {
                const isExpanded = expandedRows.has(psd.id);
                const semanticStats = getSemanticTypeStats(psd.processedPSD);
                const frameElementsCount = getFrameElementsCount(psd.processedPSD);
                const avgConfidence = getAverageConfidence(psd.processedPSD);

                return (
                  <React.Fragment key={psd.id}>
                    <TableRow className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(psd.id)}
                          className="p-1 h-6 w-6"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {psd.fileName}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {psd.processedPSD.width} × {psd.processedPSD.height}px
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span className="text-white">{psd.processedPSD.totalLayers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={frameElementsCount > 0 ? 'text-crd-green border-crd-green' : 'text-slate-400 border-slate-600'}
                        >
                          {frameElementsCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={parseFloat(avgConfidence) > 0.7 ? 'text-green-400 border-green-500' : 'text-yellow-400 border-yellow-500'}
                        >
                          {avgConfidence}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(semanticStats).slice(0, 3).map(([type, count]) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}: {count}
                            </Badge>
                          ))}
                          {Object.keys(semanticStats).length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{Object.keys(semanticStats).length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {psd.uploadedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={() => onRemovePSD(psd.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <TableRow className="border-slate-700 bg-slate-800/20">
                        <TableCell colSpan={9} className="p-6">
                          <div className="space-y-4">
                            {/* Layer Analysis Summary */}
                            <div>
                              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-crd-green" />
                                Layer Analysis Summary
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(semanticStats).map(([type, count]) => (
                                  <div key={type} className="bg-slate-900/50 rounded-lg p-3">
                                    <div className="text-slate-400 text-sm capitalize">{type}</div>
                                    <div className="text-white font-semibold">{count} layers</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top Layers by Confidence */}
                            <div>
                              <h4 className="text-white font-medium mb-3">Top Layers by Confidence</h4>
                              <div className="space-y-2">
                                {psd.processedPSD.layers
                                  .map(layer => ({
                                    ...layer,
                                    analysis: enhancedLayerAnalysisService.analyzeLayer(layer)
                                  }))
                                  .sort((a, b) => b.analysis.confidence - a.analysis.confidence)
                                  .slice(0, 5)
                                  .map((layer) => (
                                    <div key={layer.id} className="flex items-center justify-between p-2 bg-slate-900/30 rounded">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-700 rounded border"></div>
                                        <div>
                                          <div className="text-white text-sm font-medium">{layer.name}</div>
                                          <div className="text-slate-400 text-xs">{layer.analysis.semanticType} • {layer.analysis.positionCategory}</div>
                                        </div>
                                      </div>
                                      <Badge variant="outline" className="text-green-400 border-green-500">
                                        {(layer.analysis.confidence * 100).toFixed(0)}%
                                      </Badge>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {psdData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">No PSD files to analyze</div>
            <div className="text-slate-500 text-sm">Upload some PSD files to see the comparison</div>
          </div>
        )}
      </div>
    </Card>
  );
};
