import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Upload, 
  EyeOff, 
  RotateCcw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-crd-green" />
              <h1 className="text-2xl font-bold text-white">PSD Analysis Studio</h1>
            </div>
            
            {processedPSD && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {processedPSD.width} × {processedPSD.height}px
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {processedPSD.totalLayers} layers
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-purple-400 border-purple-500 hover:bg-purple-500/10"
            >
              <Link to="/debug/bulk-psd-analysis">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Analysis
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleUpload}
              className={showUpload ? 'bg-slate-700' : ''}
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
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-red-400 border-red-500 hover:bg-red-500/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New PSD
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
