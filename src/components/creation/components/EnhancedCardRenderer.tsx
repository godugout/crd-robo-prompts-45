
import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

interface CardLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  visible: boolean;
  opacity: number;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any;
}

interface CardData {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: File | null;
  imageUrl: string;
  frameConfig: {
    style: string;
    border: { width: number; color: string; style: string };
    background: string;
    effects: string[];
  };
  layers: CardLayer[];
}

interface EnhancedCardRendererProps {
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

export const EnhancedCardRenderer = forwardRef<{ exportCard: () => Promise<Blob> }, EnhancedCardRendererProps>(
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

      // Sort layers by zIndex
      const sortedLayers = [...cardData.layers].sort((a, b) => a.zIndex - b.zIndex);

      // Draw each layer
      for (const layer of sortedLayers) {
        if (!layer.visible) continue;

        ctx.save();
        ctx.globalAlpha = layer.opacity;

        switch (layer.type) {
          case 'shape':
            if (layer.id === 'background') {
              // Draw background with gradient
              if (cardData.frameConfig.background.includes('gradient')) {
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
              } else {
                ctx.fillStyle = cardData.frameConfig.background;
              }
              ctx.fillRect(0, 0, width, height);
            } else if (layer.id === 'frame') {
              // Draw frame border
              const borderWidth = cardData.frameConfig.border.width;
              ctx.strokeStyle = cardData.frameConfig.border.color;
              ctx.lineWidth = borderWidth;
              
              if (cardData.frameConfig.border.style === 'dashed') {
                ctx.setLineDash([10, 5]);
              } else if (cardData.frameConfig.border.style === 'dotted') {
                ctx.setLineDash([2, 5]);
              }
              
              ctx.strokeRect(borderWidth/2, borderWidth/2, width - borderWidth, height - borderWidth);
              ctx.setLineDash([]);
            } else {
              // Draw regular shape
              ctx.fillStyle = layer.data?.color || '#ffffff';
              ctx.fillRect(layer.position.x, layer.position.y, layer.size.width, layer.size.height);
            }
            break;

          case 'image':
            if (layer.data?.url) {
              try {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                  img.src = layer.data.url;
                });

                // Draw image with proper scaling
                const imgAspect = img.width / img.height;
                const areaAspect = layer.size.width / layer.size.height;

                let drawWidth, drawHeight, drawX, drawY;

                if (imgAspect > areaAspect) {
                  drawHeight = layer.size.height;
                  drawWidth = drawHeight * imgAspect;
                  drawX = layer.position.x + (layer.size.width - drawWidth) / 2;
                  drawY = layer.position.y;
                } else {
                  drawWidth = layer.size.width;
                  drawHeight = drawWidth / imgAspect;
                  drawX = layer.position.x;
                  drawY = layer.position.y + (layer.size.height - drawHeight) / 2;
                }

                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
              } catch (error) {
                console.error('Failed to load layer image:', error);
                // Draw placeholder
                ctx.fillStyle = '#374151';
                ctx.fillRect(layer.position.x, layer.position.y, layer.size.width, layer.size.height);
                ctx.fillStyle = '#9ca3af';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Image Error', 
                  layer.position.x + layer.size.width / 2, 
                  layer.position.y + layer.size.height / 2
                );
              }
            }
            break;

          case 'text':
            ctx.fillStyle = layer.data?.color || '#ffffff';
            ctx.font = `${layer.data?.fontSize || 16}px ${layer.data?.fontFamily || 'Arial'}`;
            ctx.textAlign = layer.data?.align || 'left';
            ctx.fillText(
              layer.data?.text || layer.name, 
              layer.position.x, 
              layer.position.y + (layer.data?.fontSize || 16)
            );
            break;

          case 'effect':
            // Draw effect overlays
            if (layer.data?.type === 'glow') {
              ctx.shadowColor = layer.data.color || '#ffffff';
              ctx.shadowBlur = layer.data.intensity || 10;
              ctx.fillStyle = 'transparent';
              ctx.fillRect(layer.position.x, layer.position.y, layer.size.width, layer.size.height);
            }
            break;
        }

        ctx.restore();
      }

      // Draw card title and description
      const textAreaY = height * 0.75;
      const textAreaHeight = height * 0.25;
      
      // Text area background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, textAreaY, width, textAreaHeight);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cardData.title, width / 2, textAreaY + 40);

      // Description
      ctx.fillStyle = '#d1d5db';
      ctx.font = '16px Arial';
      const words = cardData.description.split(' ');
      let line = '';
      let y = textAreaY + 80;
      const lineHeight = 20;
      const maxWidth = width - 40;

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

      // Rarity indicator
      const rarityY = textAreaY + textAreaHeight - 20;
      ctx.fillStyle = RARITY_COLORS[cardData.rarity];
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(cardData.rarity.toUpperCase(), width - 20, rarityY);
    };

    useEffect(() => {
      drawCard();
    }, [cardData, width, height]);

    useImperativeHandle(ref, () => ({
      exportCard: async (): Promise<Blob> => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not available');

        await drawCard();

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
            border: '2px solid #374151',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}
        />
      </div>
    );
  }
);

EnhancedCardRenderer.displayName = 'EnhancedCardRenderer';
