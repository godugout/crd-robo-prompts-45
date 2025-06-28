
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { bulkElementClassificationService, BulkAnalysisResult } from '@/services/psdProcessor/bulkElementClassificationService';
import { 
  X, 
  Download, 
  BarChart3, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Eye,
  Layers
} from 'lucide-react';

interface PSDComparisonTableProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const PSDComparisonTable: React.FC<PSDComparisonTableProps> = ({
  psdData,
  onRemovePSD
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState<BulkAnalysisResult | null>(null);

  // Run enhanced analysis when data changes
  const enhancedAnalysis = useMemo(() => {
    if (psdData.length === 0) return null;
    
    console.log('Running enhanced bulk analysis...');
    const result = bulkElementClassificationService.analyzeBulkPSDs(psdData);
    setAnalysisResult(result);
    return result;
  }, [psdData]);

  const exportAnalysis = () => {
    if (!enhancedAnalysis) return;
    
    const report = bulkElementClassificationService.exportAnalysisReport(enhancedAnalysis, psdData);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-psd-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.8) return 'default';
    if (confidence >= 0.6) return 'secondary';
    return 'destructive';
  };

  if (!enhancedAnalysis) {
    return (
      <Card className="bg-[#0a0f1b] border-slate-800 p-6">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">Upload PSDs to see enhanced comparison analysis</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-crd-green" />
            <h3 className="text-xl font-semibold text-white">Enhanced Analysis Results</h3>
          </div>
          <Button variant="outline" onClick={exportAnalysis}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Analysis Quality Overview */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-crd-green" />
              <span className="text-sm text-slate-400">Analysis Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress 
                value={enhancedAnalysis.analysisQuality.overallScore * 100} 
                className="flex-1 h-2" 
              />
              <span className="text-sm font-medium text-white">
                {Math.round(enhancedAnalysis.analysisQuality.overallScore * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">High Confidence</span>
            </div>
            <p className="text-xl font-bold text-white">
              {Math.round(enhancedAnalysis.analysisQuality.highConfidencePercentage)}%
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Position Consistency</span>
            </div>
            <p className="text-xl font-bold text-white">
              {Math.round(enhancedAnalysis.analysisQuality.positionConsistencyAvg * 100)}%
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-4">
              {/* PSD Files Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Layers</TableHead>
                    <TableHead>Avg Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {psdData.map((psd) => {
                    const avgConfidence = psd.processedPSD.layers.length > 0
                      ? psd.processedPSD.layers.reduce((sum, layer) => sum + (layer.confidence || 0), 0) / psd.processedPSD.layers.length
                      : 0;

                    return (
                      <TableRow key={psd.id}>
                        <TableCell className="font-medium text-white">
                          {psd.fileName}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {psd.processedPSD.width} × {psd.processedPSD.height}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {psd.processedPSD.totalLayers}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getConfidenceBadgeVariant(avgConfidence)}>
                            {Math.round(avgConfidence * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemovePSD(psd.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="elements" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white mb-4">Element Analysis</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Element Type</TableHead>
                    <TableHead>Found In</TableHead>
                    <TableHead>Avg Confidence</TableHead>
                    <TableHead>Position Consistency</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enhancedAnalysis.standardizedElements.map((element) => (
                    <TableRow key={element.type}>
                      <TableCell className="font-medium text-white">
                        {element.displayName}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {element.foundInPSDs.length} / {psdData.length} PSDs
                      </TableCell>
                      <TableCell>
                        <span className={getConfidenceColor(element.avgConfidence)}>
                          {Math.round(element.avgConfidence * 100)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getConfidenceColor(element.positionConsistency)}>
                          {Math.round(element.positionConsistency * 100)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{element.category}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white mb-4">Template Patterns</h4>
              {enhancedAnalysis.templatePatterns.length > 0 ? (
                <div className="grid gap-4">
                  {enhancedAnalysis.templatePatterns.map((template) => (
                    <div key={template.id} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-white">{template.name}</h5>
                        <Badge variant="outline">
                          {template.commonElementCount} PSDs
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Layout Score: {Math.round(template.layoutScore * 100)}%</span>
                        <span>Elements: {template.layerStructure.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400">No consistent template patterns detected</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white mb-4">Analysis Issues</h4>
              
              {/* Low Confidence Elements */}
              {enhancedAnalysis.lowConfidenceElements.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <h5 className="font-medium text-yellow-400">Low Confidence Elements</h5>
                  </div>
                  <div className="space-y-2">
                    {enhancedAnalysis.lowConfidenceElements.map((element) => (
                      <div key={element.type} className="flex items-center justify-between">
                        <span className="text-white">{element.displayName}</span>
                        <Badge variant="destructive">
                          {Math.round(element.avgConfidence * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-2">
                <h5 className="font-medium text-white">Recommendations</h5>
                {[...enhancedAnalysis.recommendations, ...enhancedAnalysis.analysisQuality.recommendations].map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 bg-crd-green rounded-full mt-2 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
