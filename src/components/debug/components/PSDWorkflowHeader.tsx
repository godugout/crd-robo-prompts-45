import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  FileImage,
  Layers,
  Settings,
  Download
} from 'lucide-react';
import { EnhancedProcessedPSD } from '@/types/psdTypes';

interface PSDWorkflowHeaderProps {
  processedPSD: EnhancedProcessedPSD | null;
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
    <Card className="bg-[#1a1f2e] border-slate-700">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <FileImage className="w-6 h-6 text-crd-blue" />
          <h2 className="text-xl font-semibold text-white">
            PSD Workflow
          </h2>
          {processedPSD && (
            <Badge className="bg-crd-green text-black font-medium">
              {processedPSD.fileName}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleUpload}
          >
            {showUpload ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Upload
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Show Upload
              </>
            )}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New PSD
          </Button>
        </div>
      </div>
    </Card>
  );
};
