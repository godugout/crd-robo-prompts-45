
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  X, 
  Crop,
  Eye,
  EyeOff
} from 'lucide-react';

interface DetectedCard {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  selected: boolean;
  category?: string;
}

interface CardDetectionInterfaceProps {
  originalImageUrl: string;
  detectedCards: DetectedCard[];
  onCardUpdate: (cardId: string, bounds: DetectedCard['bounds']) => void;
  onCardToggle: (cardId: string) => void;
  onFinalize: () => void;
}

export const CardDetectionInterface: React.FC<CardDetectionInterfaceProps> = ({
  originalImageUrl,
  detectedCards,
  onCardUpdate,
  onCardToggle,
  onFinalize
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showAllBoxes, setShowAllBoxes] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  useEffect(() => {
    drawCanvas();
  }, [detectedCards, selectedCardId, showAllBoxes, zoom]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width * zoom;
      canvas.height = img.height * zoom;

      // Clear and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw detection boxes
      detectedCards.forEach(card => {
        const isSelected = card.id === selectedCardId;
        const shouldShow = showAllBoxes || isSelected || card.selected;

        if (!shouldShow) return;

        const x = card.bounds.x * zoom;
        const y = card.bounds.y * zoom;
        const width = card.bounds.width * zoom;
        const height = card.bounds.height * zoom;

        // Box styling
        ctx.strokeStyle = isSelected ? '#3b82f6' : card.selected ? '#10b981' : '#64748b';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.setLineDash(isSelected ? [] : [5, 5]);

        // Draw box
        ctx.strokeRect(x, y, width, height);

        // Draw confidence badge
        if (isSelected || card.selected) {
          ctx.fillStyle = isSelected ? '#3b82f6' : '#10b981';
          ctx.fillRect(x, y - 24, 80, 24);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(`${Math.round(card.confidence * 100)}%`, x + 4, y - 8);
        }

        // Draw resize handles for selected card
        if (isSelected) {
          const handles = [
            { x: x - 4, y: y - 4, cursor: 'nw-resize' },
            { x: x + width - 4, y: y - 4, cursor: 'ne-resize' },
            { x: x - 4, y: y + height - 4, cursor: 'sw-resize' },
            { x: x + width - 4, y: y + height - 4, cursor: 'se-resize' },
            { x: x + width/2 - 4, y: y - 4, cursor: 'n-resize' },
            { x: x + width/2 - 4, y: y + height - 4, cursor: 's-resize' },
            { x: x - 4, y: y + height/2 - 4, cursor: 'w-resize' },
            { x: x + width - 4, y: y + height/2 - 4, cursor: 'e-resize' }
          ];

          ctx.fillStyle = '#3b82f6';
          handles.forEach(handle => {
            ctx.fillRect(handle.x, handle.y, 8, 8);
          });
        }
      });
    };
    img.src = originalImageUrl;
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    // Find clicked card
    const clickedCard = detectedCards.find(card => 
      x >= card.bounds.x && 
      x <= card.bounds.x + card.bounds.width &&
      y >= card.bounds.y && 
      y <= card.bounds.y + card.bounds.height
    );

    if (clickedCard) {
      setSelectedCardId(clickedCard.id);
    } else {
      setSelectedCardId(null);
    }
  };

  const selectedCardsCount = detectedCards.filter(card => card.selected).length;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium">Refine Card Detection</h3>
          <Badge variant="secondary">
            {detectedCards.length} cards detected • {selectedCardsCount} selected
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllBoxes(!showAllBoxes)}
            className="text-gray-300"
          >
            {showAllBoxes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAllBoxes ? 'Hide Unselected' : 'Show All'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
            className="text-gray-300"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <span className="text-gray-300 text-sm">{Math.round(zoom * 100)}%</span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            className="text-gray-300"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(1)}
            className="text-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>

          <Button
            onClick={onFinalize}
            disabled={selectedCardsCount === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Create {selectedCardsCount} Cards
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 p-4 overflow-auto" ref={containerRef}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="border border-gray-600 cursor-crosshair max-w-none"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'crosshair'
            }}
          />
        </div>

        {/* Card List Sidebar */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 p-4 overflow-y-auto">
          <h4 className="text-white font-medium mb-4">Detected Cards</h4>
          
          <div className="space-y-2">
            {detectedCards.map((card, index) => (
              <Card
                key={card.id}
                className={`p-3 cursor-pointer transition-all ${
                  card.id === selectedCardId 
                    ? 'bg-blue-600 border-blue-500' 
                    : card.selected 
                      ? 'bg-green-600/20 border-green-500' 
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCardId(card.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">
                    Card {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(card.confidence * 100)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardToggle(card.id);
                      }}
                      className={`p-1 ${
                        card.selected ? 'text-green-400' : 'text-gray-400'
                      }`}
                    >
                      {card.selected ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-300">
                  {Math.round(card.bounds.width)} × {Math.round(card.bounds.height)}px
                </div>

                {card.category && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {card.category}
                  </Badge>
                )}
              </Card>
            ))}
          </div>

          {selectedCardId && (
            <div className="mt-6 pt-4 border-t border-gray-600">
              <h5 className="text-white font-medium mb-3">Crop Adjustment</h5>
              <p className="text-gray-400 text-sm mb-4">
                Click and drag the corners or edges to adjust the crop area. 
                Use the zoom controls for precision.
              </p>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-gray-300"
                  onClick={() => {
                    // Reset to original position
                    const card = detectedCards.find(c => c.id === selectedCardId);
                    if (card) {
                      onCardUpdate(selectedCardId, card.bounds);
                    }
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Crop
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
