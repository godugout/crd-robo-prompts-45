
import React, { useRef, useEffect, useState } from 'react';
import { CardDetectionResult, DetectedCard } from '@/services/cardDetection';

interface ReviewCanvasProps {
  currentResult: CardDetectionResult;
  selectedCards: Set<string>;
  selectedCardId: string | null;
  showAllBoxes: boolean;
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  onCardClick: (cardId: string | null) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseMove: (event: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export const ReviewCanvas: React.FC<ReviewCanvasProps> = ({
  currentResult,
  selectedCards,
  selectedCardId,
  showAllBoxes,
  zoom,
  pan,
  isDragging,
  onCardClick,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<{ width: number; height: number } | null>(null);

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
      setImageData({ width: img.width, height: img.height });

      const maxWidth = 1200;
      const maxHeight = 800;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      ctx.scale(zoom, zoom);
      ctx.translate(pan.x / zoom, pan.y / zoom);
      
      ctx.drawImage(img, 0, 0, canvas.width / zoom, canvas.height / zoom);

      currentCards.forEach(card => {
        const isSelected = selectedCards.has(card.id);
        const isHighlighted = card.id === selectedCardId;
        const shouldShow = showAllBoxes || isSelected || isHighlighted;

        if (!shouldShow) return;

        const x = (card.bounds.x * canvas.width) / (img.width * zoom);
        const y = (card.bounds.y * canvas.height) / (img.height * zoom);
        const width = (card.bounds.width * canvas.width) / (img.width * zoom);
        const height = (card.bounds.height * canvas.height) / (img.height * zoom);

        ctx.strokeStyle = isHighlighted ? '#3b82f6' : isSelected ? '#10b981' : '#64748b';
        ctx.lineWidth = isHighlighted ? 3 : 2;
        ctx.setLineDash(isHighlighted ? [] : [5, 5]);

        ctx.strokeRect(x, y, width, height);

        if (isHighlighted || isSelected) {
          ctx.fillStyle = isHighlighted ? '#3b82f6' : '#10b981';
          ctx.fillRect(x, y - 24, 80, 24);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(`${Math.round(card.confidence * 100)}%`, x + 4, y - 8);
        }

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
      onCardClick(clickedCard.id);
    } else {
      onCardClick(null);
    }
  };

  return (
    <div className="flex-1 overflow-hidden p-4">
      <div className="relative h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="border border-gray-600 cursor-crosshair max-w-none shadow-lg"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'crosshair',
            transform: `translate(${pan.x}px, ${pan.y}px)`
          }}
        />
      </div>
    </div>
  );
};
