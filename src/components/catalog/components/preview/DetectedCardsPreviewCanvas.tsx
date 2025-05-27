
import React, { useRef, useEffect } from 'react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';

interface DetectedCardsPreviewCanvasProps {
  selectedImage: DetectedCard;
  selectedCards: Set<string>;
}

export const DetectedCardsPreviewCanvas: React.FC<DetectedCardsPreviewCanvasProps> = ({
  selectedImage,
  selectedCards
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDetectionOverlay = (card: DetectedCard) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Draw detection rectangle
      ctx.strokeStyle = selectedCards.has(card.id) ? '#00ff00' : '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      ctx.strokeRect(
        card.bounds.x,
        card.bounds.y,
        card.bounds.width,
        card.bounds.height
      );
      
      // Draw confidence label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(card.bounds.x, card.bounds.y - 25, 80, 25);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${Math.round(card.confidence * 100)}%`,
        card.bounds.x + 5,
        card.bounds.y - 8
      );
    };
    
    img.src = URL.createObjectURL(card.originalFile);
  };

  useEffect(() => {
    if (selectedImage) {
      drawDetectionOverlay(selectedImage);
    }
  }, [selectedImage, selectedCards]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-h-80 object-contain border border-gray-600 rounded"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
