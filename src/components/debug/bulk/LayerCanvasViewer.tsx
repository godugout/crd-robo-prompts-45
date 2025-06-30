
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface LayerCanvasViewerProps {
  processedPSD: EnhancedProcessedPSD;
}

export const LayerCanvasViewer: React.FC<LayerCanvasViewerProps> = ({
  processedPSD
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <div className="space-y-4">
      {/* Canvas Controls */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <span className="text-sm text-slate-400">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Canvas Display */}
      <Card className="bg-slate-800 border-slate-600 p-4">
        <div className="relative overflow-auto max-h-96">
          <div
            className="relative bg-slate-900 rounded"
            style={{
              width: processedPSD.width * zoom,
              height: processedPSD.height * zoom,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left'
            }}
          >
            {processedPSD.extractedImages.flattenedImageUrl ? (
              <img
                src={processedPSD.extractedImages.flattenedImageUrl}
                alt="PSD Canvas"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <span className="text-slate-400">Canvas Preview</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
