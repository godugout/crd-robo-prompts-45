
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import type { DetectedRectangle, DetectionDebugInfo } from '@/services/cardDetection/enhancedRectangleDetection';

interface DetectionDebugViewerProps {
  originalImage: HTMLImageElement;
  rectangles: DetectedRectangle[];
  debugInfo: DetectionDebugInfo;
  onRectangleSelect?: (rectangle: DetectedRectangle) => void;
}

export const DetectionDebugViewer: React.FC<DetectionDebugViewerProps> = ({
  originalImage,
  rectangles,
  debugInfo,
  onRectangleSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const edgeCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawDetectionResults();
  }, [originalImage, rectangles]);

  useEffect(() => {
    if (debugInfo.edgeCanvas && edgeCanvasRef.current) {
      const ctx = edgeCanvasRef.current.getContext('2d');
      if (ctx) {
        edgeCanvasRef.current.width = debugInfo.edgeCanvas.width;
        edgeCanvasRef.current.height = debugInfo.edgeCanvas.height;
        ctx.drawImage(debugInfo.edgeCanvas, 0, 0);
      }
    }
  }, [debugInfo.edgeCanvas]);

  const drawDetectionResults = () => {
    if (!canvasRef.current || !originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const maxWidth = 800;
    const scale = Math.min(maxWidth / originalImage.width, 1);
    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // Draw detected rectangles
    rectangles.forEach((rect, index) => {
      const x = rect.x * scale;
      const y = rect.y * scale;
      const width = rect.width * scale;
      const height = rect.height * scale;

      // Rectangle outline
      ctx.strokeStyle = `hsl(${index * 60}, 70%, 50%)`;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Fill with semi-transparent color
      ctx.fillStyle = `hsla(${index * 60}, 70%, 50%, 0.15)`;
      ctx.fillRect(x, y, width, height);

      // Confidence score
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.lineWidth = 3;
      const text = `${(rect.confidence * 100).toFixed(1)}%`;
      ctx.strokeText(text, x + 5, y + 20);
      ctx.fillText(text, x + 5, y + 20);

      // Aspect ratio
      const aspectText = `${rect.aspectRatio.toFixed(2)}`;
      ctx.strokeText(aspectText, x + 5, y + 40);
      ctx.fillText(aspectText, x + 5, y + 40);

      // Card number
      const cardText = `Card ${index + 1}`;
      ctx.strokeText(cardText, x + 5, y + height - 10);
      ctx.fillText(cardText, x + 5, y + height - 10);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onRectangleSelect) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to image coordinates
    const scale = canvas.width / originalImage.width;
    const imageX = x / scale;
    const imageY = y / scale;

    // Find clicked rectangle
    const clickedRect = rectangles.find(r =>
      imageX >= r.x && imageX <= r.x + r.width &&
      imageY >= r.y && imageY <= r.y + r.height
    );

    if (clickedRect) {
      onRectangleSelect(clickedRect);
    }
  };

  const downloadDebugImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'card-detection-debug.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const downloadEdgeImage = () => {
    if (!edgeCanvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'edge-detection-debug.png';
    link.href = edgeCanvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Detection Results</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={downloadDebugImage}
              className="text-white border-gray-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main detection view */}
          <div>
            <h4 className="text-gray-300 text-sm mb-2">Detection Overlay</h4>
            <canvas
              ref={canvasRef}
              className="border border-gray-600 rounded cursor-pointer max-w-full"
              onClick={handleCanvasClick}
            />
          </div>

          {/* Edge detection view */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-gray-300 text-sm">Edge Detection</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={downloadEdgeImage}
                className="text-gray-400 hover:text-white p-1"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <canvas
              ref={edgeCanvasRef}
              className="border border-gray-600 rounded max-w-full"
              style={{ filter: 'invert(1)' }}
            />
          </div>
        </div>
      </Card>

      {/* Detection Statistics */}
      <Card className="p-4 bg-gray-900 border-gray-700">
        <h3 className="text-white font-semibold mb-3">Detection Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Rectangles Found</div>
            <div className="text-white font-bold">{rectangles.length}</div>
          </div>
          <div>
            <div className="text-gray-400">Avg Confidence</div>
            <div className="text-white font-bold">
              {rectangles.length > 0 
                ? (rectangles.reduce((sum, r) => sum + r.confidence, 0) / rectangles.length * 100).toFixed(1) + '%'
                : '0%'
              }
            </div>
          </div>
          <div>
            <div className="text-gray-400">Best Match</div>
            <div className="text-white font-bold">
              {rectangles.length > 0 ? (rectangles[0].confidence * 100).toFixed(1) + '%' : '0%'}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Processing Steps</div>
            <div className="text-white font-bold">{debugInfo.processingSteps.length}</div>
          </div>
        </div>
      </Card>

      {/* Processing Steps */}
      <Card className="p-4 bg-gray-900 border-gray-700">
        <h3 className="text-white font-semibold mb-3">Processing Steps</h3>
        <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
          {debugInfo.processingSteps.map((step, index) => (
            <div key={index} className="text-gray-300">
              {index + 1}. {step}
            </div>
          ))}
        </div>
      </Card>

      {/* Rectangle Details */}
      {rectangles.length > 0 && (
        <Card className="p-4 bg-gray-900 border-gray-700">
          <h3 className="text-white font-semibold mb-3">Detected Rectangles</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {rectangles.map((rect, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => onRectangleSelect?.(rect)}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">Card {index + 1}</div>
                  <div className="text-green-400">{(rect.confidence * 100).toFixed(1)}%</div>
                </div>
                <div className="text-gray-400 text-sm">
                  {rect.width}×{rect.height} • Ratio: {rect.aspectRatio.toFixed(2)}
                </div>
                <div className="text-gray-500 text-xs">
                  Position: ({rect.x}, {rect.y})
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
