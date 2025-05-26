
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CardAdjustment } from './InteractiveCardToolbar';

interface DetectedCard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  adjustment: CardAdjustment;
}

interface PreciseCardCanvasProps {
  image: HTMLImageElement;
  detectedCards: DetectedCard[];
  selectedCardId: string | null;
  activeMode: 'move' | 'crop' | 'rotate' | null;
  onCardSelect: (cardId: string) => void;
  onCardUpdate: (cardId: string, updates: Partial<DetectedCard>) => void;
  className?: string;
}

export const PreciseCardCanvas = ({
  image,
  detectedCards,
  selectedCardId,
  activeMode,
  onCardSelect,
  onCardUpdate,
  className = ''
}: PreciseCardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerRect = canvas.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    // Calculate scale to fit image in container
    const imageAspect = image.width / image.height;
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = Math.min(containerRect.width * 0.9, image.width);
      displayHeight = displayWidth / imageAspect;
    } else {
      displayHeight = Math.min(containerRect.height * 0.9, image.height);
      displayWidth = displayHeight * imageAspect;
    }

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    setScale(displayWidth / image.width);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw detected cards
    detectedCards.forEach(card => {
      const isSelected = card.id === selectedCardId;
      const { adjustment } = card;
      
      // Calculate adjusted position and size
      const x = (card.x + adjustment.x) * scale;
      const y = (card.y + adjustment.y) * scale;
      const width = (card.width + adjustment.width - 100) * scale;
      const height = (card.height + adjustment.height - 140) * scale;
      
      // Save context for rotation
      ctx.save();
      
      // Apply rotation
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((adjustment.rotation * Math.PI) / 180);
      ctx.scale(adjustment.scale, adjustment.scale);
      ctx.translate(-width / 2, -height / 2);
      
      // Draw card outline
      ctx.strokeStyle = isSelected ? '#10b981' : '#3b82f6';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.fillStyle = isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)';
      
      // Draw rounded rectangle
      const radius = 8;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, radius);
      ctx.fill();
      ctx.stroke();
      
      // Draw corner handles for selected card in crop mode
      if (isSelected && activeMode === 'crop') {
        const handleSize = 8;
        ctx.fillStyle = '#10b981';
        
        // Corner handles
        ctx.fillRect(-handleSize/2, -handleSize/2, handleSize, handleSize);
        ctx.fillRect(width - handleSize/2, -handleSize/2, handleSize, handleSize);
        ctx.fillRect(-handleSize/2, height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(width - handleSize/2, height - handleSize/2, handleSize, handleSize);
        
        // Edge handles
        ctx.fillRect(width/2 - handleSize/2, -handleSize/2, handleSize, handleSize);
        ctx.fillRect(width/2 - handleSize/2, height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(-handleSize/2, height/2 - handleSize/2, handleSize, handleSize);
        ctx.fillRect(width - handleSize/2, height/2 - handleSize/2, handleSize, handleSize);
      }
      
      // Draw rotation handle for selected card in rotate mode
      if (isSelected && activeMode === 'rotate') {
        const handleY = -20;
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, handleY);
        ctx.stroke();
        
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(width / 2, handleY, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.restore();
      
      // Draw confidence score
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(`${Math.round(card.confidence * 100)}%`, x + 5, y + 18);
      ctx.fillText(`${Math.round(card.confidence * 100)}%`, x + 5, y + 18);
      
      // Draw card number
      ctx.strokeText(`Card ${detectedCards.indexOf(card) + 1}`, x + 5, y + 35);
      ctx.fillText(`Card ${detectedCards.indexOf(card) + 1}`, x + 5, y + 35);
    });
  }, [image, detectedCards, selectedCardId, activeMode, scale]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const handleResize = () => drawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawCanvas]);

  const getCardAtPosition = (x: number, y: number): DetectedCard | null => {
    for (let i = detectedCards.length - 1; i >= 0; i--) {
      const card = detectedCards[i];
      const { adjustment } = card;
      
      const cardX = (card.x + adjustment.x) * scale;
      const cardY = (card.y + adjustment.y) * scale;
      const cardWidth = (card.width + adjustment.width - 100) * scale;
      const cardHeight = (card.height + adjustment.height - 140) * scale;
      
      if (x >= cardX && x <= cardX + cardWidth && 
          y >= cardY && y <= cardY + cardHeight) {
        return card;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const card = getCardAtPosition(x, y);
    if (card) {
      onCardSelect(card.id);
      if (activeMode === 'move') {
        setIsDragging(true);
        setDragStart({ x, y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedCardId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = (x - dragStart.x) / scale;
    const deltaY = (y - dragStart.y) / scale;
    
    const selectedCard = detectedCards.find(c => c.id === selectedCardId);
    if (selectedCard) {
      onCardUpdate(selectedCardId, {
        adjustment: {
          ...selectedCard.adjustment,
          x: selectedCard.adjustment.x + deltaX,
          y: selectedCard.adjustment.y + deltaY
        }
      });
    }
    
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`relative overflow-auto bg-gray-800 rounded-lg ${className}`}>
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ 
          cursor: activeMode === 'move' ? 'move' : 
                 activeMode === 'crop' ? 'crosshair' :
                 activeMode === 'rotate' ? 'grab' : 'pointer'
        }}
      />
      
      {/* Aspect Ratio Guide Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        Target: 2.5" × 3.5" (0.714 ratio)
        {selectedCardId && (() => {
          const card = detectedCards.find(c => c.id === selectedCardId);
          if (card) {
            const ratio = card.width / card.height;
            const deviation = Math.abs(ratio - (2.5/3.5)) * 100;
            return (
              <div className={`mt-1 ${deviation < 5 ? 'text-green-400' : deviation < 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                Current: {ratio.toFixed(3)} ({deviation.toFixed(1)}% off)
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};
