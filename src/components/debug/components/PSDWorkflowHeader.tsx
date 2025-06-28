
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';

interface PSDWorkflowHeaderProps {
  processedPSD: ProcessedPSD | null;
  showUpload: boolean;
  onToggleUpload: () => void;
  onReset: () => void;
}

export const PSDWorkflowHeader: React.FC<PSDWorkflowHeaderProps> = ({
  processedPSD,
  showUpload,
  onToggleUpload,
  onReset
}) => {
  return (
    <Card className="bg-[#0a0f1b] border-slate-800 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-crd-green" />
              <h1 className="text-white font-semibold text-lg">PSD Processing Studio</h1>
            </div>
            
            {processedPSD && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-crd-green border-crd-green/50">
                  {processedPSD.layers.length} layers
                </Badge>
                <Badge variant="outline" className="text-slate-300">
                  {processedPSD.width}×{processedPSD.height}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {processedPSD && (
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New PSD
              </Button>
            )}
            
            <Button
              onClick={onToggleUpload}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {showUpload ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
              {showUpload ? 'Hide Upload' : 'Show Upload'}
            </Button>
          </div>
        </div>

        {processedPSD && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              PSD processed successfully. Use the layer inspector and depth visualization below to analyze your file.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
