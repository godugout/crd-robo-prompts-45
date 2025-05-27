
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ZoomIn, ZoomOut, Move, Crop, RotateCw } from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';

interface DetectedCardsPreviewProps {
  selectedImage: DetectedCard | null;
  selectedCards: Set<string>;
  editingCard: string | null;
}

export const DetectedCardsPreview: React.FC<DetectedCardsPreviewProps> = ({
  selectedImage,
  selectedCards,
  editingCard
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

  if (!selectedImage) {
    return (
      <div className="bg-editor-tool rounded-lg p-4">
        <div className="flex items-center justify-center h-80 text-crd-lightGray">
          <div className="text-center">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a card to preview detection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-editor-tool rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">Detection Preview</h4>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full max-h-80 object-contain border border-gray-600 rounded"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          
          {editingCard === selectedImage.id && (
            <div className="absolute top-2 right-2 bg-black/70 rounded p-2 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-gray-700"
              >
                <Move className="w-4 h-4 mr-2" />
                Move
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-gray-700"
              >
                <Crop className="w-4 h-4 mr-2" />
                Resize
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-gray-700"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-sm text-crd-lightGray">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Confidence:</span> {Math.round(selectedImage.confidence * 100)}%
            </div>
            <div>
              <span className="font-medium">Status:</span> {selectedImage.status}
            </div>
            <div>
              <span className="font-medium">Dimensions:</span> {Math.round(selectedImage.bounds.width)} × {Math.round(selectedImage.bounds.height)}
            </div>
            <div>
              <span className="font-medium">Position:</span> ({Math.round(selectedImage.bounds.x)}, {Math.round(selectedImage.bounds.y)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
