
import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { FRAME_TEMPLATES } from './FrameSelector';

interface CardData {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
  frameId: string;
}

interface CardRendererProps {
  cardData: CardData;
  width: number;
  height: number;
}

const RARITY_COLORS = {
  common: '#6b7280',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};

export const CardRenderer = forwardRef<{ exportCard: () => Promise<Blob> }, CardRendererProps>(
  ({ cardData, width, height }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCard = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Get frame template
      const frame = FRAME_TEMPLATES.find(f => f.id === cardData.frameId) || FRAME_TEMPLATES[0];
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#1f2937');
      gradient.addColorStop(1, '#111827');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw main content area
      const contentPadding = 20;
      const contentX = contentPadding;
      const contentY = contentPadding;
      const contentWidth = width - (contentPadding * 2);
      const contentHeight = height - (contentPadding * 2);

      // Draw frame border
      ctx.strokeStyle = frame.preview;
      ctx.lineWidth = frame.borderWidth;
      ctx.setLineDash(frame.borderStyle === 'dashed' ? [5, 5] : []);
      
      if (frame.borderRadius > 0) {
        // Rounded rectangle
        const radius = frame.borderRadius;
        ctx.beginPath();
        ctx.moveTo(contentX + radius, contentY);
        ctx.lineTo(contentX + contentWidth - radius, contentY);
        ctx.quadraticCurveTo(contentX + contentWidth, contentY, contentX + contentWidth, contentY + radius);
        ctx.lineTo(contentX + contentWidth, contentY + contentHeight - radius);
        ctx.quadraticCurveTo(contentX + contentWidth, contentY + contentHeight, contentX + contentWidth - radius, contentY + contentHeight);
        ctx.lineTo(contentX + radius, contentY + contentHeight);
        ctx.quadraticCurveTo(contentX, contentY + contentHeight, contentX, contentY + contentHeight - radius);
        ctx.lineTo(contentX, contentY + radius);
        ctx.quadraticCurveTo(contentX, contentY, contentX + radius, contentY);
        ctx.closePath();
        ctx.stroke();
      } else {
        // Rectangle
        ctx.strokeRect(contentX, contentY, contentWidth, contentHeight);
      }

      // Draw image if available
      if (cardData.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = cardData.imageUrl;
          });

          // Calculate image area (top 60% of card)
          const imgAreaHeight = contentHeight * 0.6;
          const imgPadding = 10;
          const imgX = contentX + imgPadding;
          const imgY = contentY + imgPadding;
          const imgWidth = contentWidth - (imgPadding * 2);
          const imgHeight = imgAreaHeight - imgPadding;

          // Draw image with proper scaling
          const imgAspect = img.width / img.height;
          const areaAspect = imgWidth / imgHeight;

          let drawWidth, drawHeight, drawX, drawY;

          if (imgAspect > areaAspect) {
            // Image is wider - fit to height
            drawHeight = imgHeight;
            drawWidth = drawHeight * imgAspect;
            drawX = imgX + (imgWidth - drawWidth) / 2;
            drawY = imgY;
          } else {
            // Image is taller - fit to width
            drawWidth = imgWidth;
            drawHeight = drawWidth / imgAspect;
            drawX = imgX;
            drawY = imgY + (imgHeight - drawHeight) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        } catch (error) {
          console.error('Failed to load image:', error);
          // Draw placeholder
          ctx.fillStyle = '#374151';
          ctx.fillRect(contentX + 10, contentY + 10, contentWidth - 20, contentHeight * 0.6 - 10);
          ctx.fillStyle = '#9ca3af';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Image not available', width / 2, contentY + contentHeight * 0.3);
        }
      }

      // Draw text area background
      const textAreaY = contentY + (contentHeight * 0.6);
      const textAreaHeight = contentHeight * 0.4;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(contentX, textAreaY, contentWidth, textAreaHeight);

      // Draw title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cardData.title, width / 2, textAreaY + 40);

      // Draw description
      ctx.fillStyle = '#d1d5db';
      ctx.font = '16px Arial';
      const words = cardData.description.split(' ');
      let line = '';
      let y = textAreaY + 80;
      const lineHeight = 20;
      const maxWidth = contentWidth - 40;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, width / 2, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, width / 2, y);

      // Draw rarity indicator
      const rarityY = textAreaY + textAreaHeight - 30;
      ctx.fillStyle = RARITY_COLORS[cardData.rarity];
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(cardData.rarity.toUpperCase(), contentX + contentWidth - 20, rarityY);
    };

    useEffect(() => {
      drawCard();
    }, [cardData, width, height]);

    useImperativeHandle(ref, () => ({
      exportCard: async (): Promise<Blob> => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not available');

        await drawCard(); // Ensure latest render

        return new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to export canvas'));
            }
          }, 'image/png', 1.0);
        });
      }
    }));

    return (
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid #374151',
            borderRadius: '8px'
          }}
        />
      </div>
    );
  }
);

CardRenderer.displayName = 'CardRenderer';
