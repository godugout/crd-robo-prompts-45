
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Check, X, RotateCcw, Move, Crop } from 'lucide-react';
import type { DetectedCard, DetectionDebugInfo } from '@/services/cardDetection/improvedCardDetection';

interface DetectionDebugViewerProps {
  originalImage: HTMLImageElement;
  rectangles: DetectedCard[];
  debugInfo: DetectionDebugInfo;
  onRectangleSelect?: (rectangle: DetectedCard | null) => void;
}

export const DetectionDebugViewer: React.FC<DetectionDebugViewerProps> = ({
  originalImage,
  rectangles,
  debugInfo,
  onRectangleSelect
}) => {
  const [selectedRectId, setSelectedRectId] = useState<number | null>(null);
  const [croppedCards, setCroppedCards] = useState<Array<{ id: number; imageUrl: string; rect: DetectedCard }>>([]);
  const [approvedCards, setApprovedCards] = useState<Set<number>>(new Set());
  const [rejectedCards, setRejectedCards] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'overlay' | 'grid'>('overlay');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [adjustmentMode, setAdjustmentMode] = useState<'move' | 'resize' | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (rectangles.length > 0) {
      generateCroppedCards();
    }
  }, [rectangles, originalImage]);

  useEffect(() => {
    drawOverlay();
  }, [selectedRectId, zoomLevel, rectangles]);

  const generateCroppedCards = async () => {
    const cards = [];
    
    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i];
      const croppedUrl = await cropCardFromImage(rect, i);
      if (croppedUrl) {
        cards.push({ id: i, imageUrl: croppedUrl, rect });
      }
    }
    
    setCroppedCards(cards);
  };

  const cropCardFromImage = async (rect: DetectedCard, id: number): Promise<string | null> => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Standard card dimensions for consistent output
      const targetWidth = 300;
      const targetHeight = 420;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Apply perspective correction if needed
      if (rect.angle !== 0) {
        ctx.save();
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rect.angle * Math.PI) / 180);
        ctx.translate(-targetWidth / 2, -targetHeight / 2);
      }

      // Draw the cropped region
      ctx.drawImage(
        originalImage,
        rect.x, rect.y, rect.width, rect.height,
        0, 0, targetWidth, targetHeight
      );

      if (rect.angle !== 0) {
        ctx.restore();
      }

      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Failed to crop card:', error);
      return null;
    }
  };

  const drawOverlay = () => {
    const canvas = canvasRef.current;
    if (!canvas || rectangles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match original image with zoom
    const displayWidth = originalImage.width * zoomLevel;
    const displayHeight = originalImage.height * zoomLevel;
    
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Draw the original image
    ctx.drawImage(originalImage, 0, 0, displayWidth, displayHeight);

    // Draw detection rectangles
    rectangles.forEach((rect, index) => {
      const isSelected = selectedRectId === index;
      const isApproved = approvedCards.has(index);
      const isRejected = rejectedCards.has(index);
      
      // Scale rectangle coordinates for zoom level
      const scaledRect = {
        x: rect.x * zoomLevel,
        y: rect.y * zoomLevel,
        width: rect.width * zoomLevel,
        height: rect.height * zoomLevel
      };

      // Set stroke style based on state
      if (isApproved) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
      } else if (isRejected) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
      } else if (isSelected) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
      }

      // Draw rectangle
      ctx.strokeRect(scaledRect.x, scaledRect.y, scaledRect.width, scaledRect.height);

      // Draw confidence score
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(scaledRect.x, scaledRect.y - 25, 80, 25);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${Math.round(rect.confidence * 100)}%`,
        scaledRect.x + 5,
        scaledRect.y - 8
      );

      // Draw corner indicators for selected rectangle
      if (isSelected && rect.corners) {
        ctx.fillStyle = '#3b82f6';
        rect.corners.forEach(corner => {
          ctx.beginPath();
          ctx.arc(corner.x * zoomLevel, corner.y * zoomLevel, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoomLevel;
    const y = (event.clientY - rect.top) / zoomLevel;

    // Find clicked rectangle
    const clickedIndex = rectangles.findIndex(r => 
      x >= r.x && x <= r.x + r.width && 
      y >= r.y && y <= r.y + r.height
    );

    if (clickedIndex !== -1) {
      setSelectedRectId(clickedIndex);
      onRectangleSelect?.(rectangles[clickedIndex]);
    } else {
      setSelectedRectId(null);
      onRectangleSelect?.(null);
    }
  };

  const approveCard = (id: number) => {
    setApprovedCards(prev => new Set([...prev, id]));
    setRejectedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const rejectCard = (id: number) => {
    setRejectedCards(prev => new Set([...prev, id]));
    setApprovedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const resetCardState = (id: number) => {
    setApprovedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setRejectedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Detection Summary */}
      <Card className="p-4 bg-gray-900 border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Detection Results</h3>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'overlay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overlay')}
            >
              Overlay View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{rectangles.length}</div>
            <div className="text-gray-400">Detected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{approvedCards.size}</div>
            <div className="text-gray-400">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{rejectedCards.size}</div>
            <div className="text-gray-400">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {rectangles.length - approvedCards.size - rejectedCards.size}
            </div>
            <div className="text-gray-400">Pending</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Processing time: {debugInfo.processingTime}ms | 
          Strategies: {debugInfo.strategiesUsed.join(', ')}
        </div>
      </Card>

      {viewMode === 'overlay' && (
        <Card className="p-4 bg-gray-900 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Image Overlay</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setZoomLevel(prev => Math.max(0.25, prev - 0.25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                <Button variant="outline" size="sm" onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-700 rounded-lg overflow-auto max-h-96">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </Card>
      )}

      {viewMode === 'grid' && croppedCards.length > 0 && (
        <Card className="p-4 bg-gray-900 border-gray-700">
          <h3 className="text-white font-semibold mb-4">Cropped Cards Grid</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {croppedCards.map(({ id, imageUrl, rect }) => (
              <div key={id} className="relative group">
                <div className="border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg"
                     style={{
                       borderColor: approvedCards.has(id) ? '#22c55e' : 
                                   rejectedCards.has(id) ? '#ef4444' : '#374151'
                     }}>
                  <img
                    src={imageUrl}
                    alt={`Card ${id + 1}`}
                    className="w-full h-auto"
                    onClick={() => setSelectedRectId(selectedRectId === id ? null : id)}
                  />
                  
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-600 border-green-600 text-white hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        approveCard(id);
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-600 border-red-600 text-white hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        rejectCard(id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-600 border-yellow-600 text-white hover:bg-yellow-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetCardState(id);
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Card info */}
                <div className="mt-2 text-xs">
                  <div className="flex justify-between items-center">
                    <Badge variant={rect.confidence > 0.8 ? 'default' : 'secondary'}>
                      {Math.round(rect.confidence * 100)}%
                    </Badge>
                    <span className="text-gray-400">
                      {Math.round(rect.width)}×{Math.round(rect.height)}
                    </span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    Ratio: {rect.aspectRatio.toFixed(3)} | {rect.backgroundType} | {rect.cardCondition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Batch Actions */}
      {rectangles.length > 0 && (
        <Card className="p-4 bg-gray-900 border-gray-700">
          <h3 className="text-white font-semibold mb-4">Batch Actions</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              onClick={() => {
                rectangles.forEach((_, index) => approveCard(index));
              }}
            >
              Approve All
            </Button>
            <Button
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              onClick={() => {
                rectangles.forEach((_, index) => rejectCard(index));
              }}
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
              onClick={() => {
                setApprovedCards(new Set());
                setRejectedCards(new Set());
              }}
            >
              Reset All
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
