
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  X,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CardDetectionResult } from '@/services/cardDetection';

interface EnhancedCardReviewInterfaceProps {
  detectionResults: CardDetectionResult[];
  selectedCards: Set<string>;
  currentImageIndex: number;
  onImageIndexChange: (index: number) => void;
  onToggleCardSelection: (cardId: string) => void;
}

export const EnhancedCardReviewInterface: React.FC<EnhancedCardReviewInterfaceProps> = ({
  detectionResults,
  selectedCards,
  currentImageIndex,
  onImageIndexChange,
  onToggleCardSelection
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showAllBoxes, setShowAllBoxes] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageData, setImageData] = useState<{ width: number; height: number } | null>(null);

  const currentResult = detectionResults[currentImageIndex];
  const currentCards = currentResult?.detectedCards || [];

  useEffect(() => {
    drawCanvas();
  }, [currentResult, selectedCards, selectedCardId, showAllBoxes, zoom, pan, imageData]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Store image dimensions for later use
      setImageData({ width: img.width, height: img.height });

      // Set canvas size
      const maxWidth = 1200;
      const maxHeight = 800;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Clear and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Apply zoom and pan
      ctx.scale(zoom, zoom);
      ctx.translate(pan.x / zoom, pan.y / zoom);
      
      ctx.drawImage(img, 0, 0, canvas.width / zoom, canvas.height / zoom);

      // Draw detection boxes
      currentCards.forEach(card => {
        const isSelected = selectedCards.has(card.id);
        const isHighlighted = card.id === selectedCardId;
        const shouldShow = showAllBoxes || isSelected || isHighlighted;

        if (!shouldShow) return;

        const x = (card.bounds.x * canvas.width) / (img.width * zoom);
        const y = (card.bounds.y * canvas.height) / (img.height * zoom);
        const width = (card.bounds.width * canvas.width) / (img.width * zoom);
        const height = (card.bounds.height * canvas.height) / (img.height * zoom);

        // Box styling
        ctx.strokeStyle = isHighlighted ? '#3b82f6' : isSelected ? '#10b981' : '#64748b';
        ctx.lineWidth = isHighlighted ? 3 : 2;
        ctx.setLineDash(isHighlighted ? [] : [5, 5]);

        // Draw box
        ctx.strokeRect(x, y, width, height);

        // Draw confidence badge
        if (isHighlighted || isSelected) {
          ctx.fillStyle = isHighlighted ? '#3b82f6' : '#10b981';
          ctx.fillRect(x, y - 24, 80, 24);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(`${Math.round(card.confidence * 100)}%`, x + 4, y - 8);
        }

        // Selection indicator
        if (isSelected) {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(x + width - 20, y + 4, 16, 16);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.fillText('✓', x + width - 16, y + 15);
        }
      });

      ctx.restore();
    };

    // Get original image URL from the first detected card, or create one from the original file
    const originalImageUrl = currentCards.length > 0 
      ? currentCards[0].originalImageUrl 
      : URL.createObjectURL(currentResult.originalImage);
    
    img.src = originalImageUrl;
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || isDragging || !imageData) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    // Find clicked card
    const clickedCard = currentCards.find(card => {
      const cardX = (card.bounds.x * canvas.width) / imageData.width;
      const cardY = (card.bounds.y * canvas.height) / imageData.height;
      const cardWidth = (card.bounds.width * canvas.width) / imageData.width;
      const cardHeight = (card.bounds.height * canvas.height) / imageData.height;
      
      return x >= cardX && 
             x <= cardX + cardWidth &&
             y >= cardY && 
             y <= cardY + cardHeight;
    });

    if (clickedCard) {
      setSelectedCardId(clickedCard.id);
      onToggleCardSelection(clickedCard.id);
    } else {
      setSelectedCardId(null);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const selectedCardsInCurrentImage = currentCards.filter(card => selectedCards.has(card.id)).length;

  return (
    <div className="h-full flex bg-gray-900">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-medium">
              Image {currentImageIndex + 1} of {detectionResults.length}
            </h3>
            <Badge variant="secondary">
              {currentCards.length} cards • {selectedCardsInCurrentImage} selected
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
              onClick={resetView}
              className="text-gray-300"
            >
              <RotateCcw className="w-4 h-4" />
              Reset View
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 overflow-hidden p-4" ref={containerRef}>
          <div className="relative h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border border-gray-600 cursor-crosshair max-w-none shadow-lg"
              style={{ 
                cursor: isDragging ? 'grabbing' : 'crosshair',
                transform: `translate(${pan.x}px, ${pan.y}px)`
              }}
            />
          </div>
        </div>

        {/* Image Navigation */}
        {detectionResults.length > 1 && (
          <div className="flex items-center justify-center p-4 bg-gray-800 border-t border-gray-700 gap-4">
            <Button
              variant="outline"
              onClick={() => onImageIndexChange(Math.max(0, currentImageIndex - 1))}
              disabled={currentImageIndex === 0}
              className="text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {detectionResults.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentImageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => onImageIndexChange(index)}
                  className={index === currentImageIndex ? "bg-blue-600" : "text-gray-300"}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => onImageIndexChange(Math.min(detectionResults.length - 1, currentImageIndex + 1))}
              disabled={currentImageIndex === detectionResults.length - 1}
              className="text-gray-300"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Card List Sidebar */}
      <div className="w-80 border-l border-gray-700 bg-gray-800 p-4 overflow-y-auto">
        <h4 className="text-white font-medium mb-4">Detected Cards</h4>
        
        <div className="space-y-2">
          {currentCards.map((card, index) => {
            const isSelected = selectedCards.has(card.id);
            const isHighlighted = card.id === selectedCardId;
            
            return (
              <Card
                key={card.id}
                className={`p-3 cursor-pointer transition-all ${
                  isHighlighted 
                    ? 'bg-blue-600 border-blue-500' 
                    : isSelected 
                      ? 'bg-green-600/20 border-green-500' 
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
                onClick={() => {
                  setSelectedCardId(card.id);
                  onToggleCardSelection(card.id);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">
                    Card {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(card.confidence * 100)}%
                    </Badge>
                    <div className={`p-1 rounded ${isSelected ? 'text-green-400' : 'text-gray-400'}`}>
                      {isSelected ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-300">
                  {Math.round(card.bounds.width)} × {Math.round(card.bounds.height)}px
                </div>
              </Card>
            );
          })}
        </div>

        {selectedCardId && (
          <div className="mt-6 pt-4 border-t border-gray-600">
            <h5 className="text-white font-medium mb-3">Card Details</h5>
            <p className="text-gray-400 text-sm">
              Click on cards in the image to select/deselect them. 
              Use zoom controls for better precision.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
