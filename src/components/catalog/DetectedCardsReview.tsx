
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  Edit, 
  Check, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Move,
  Crop
} from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';

interface DetectedCardsReviewProps {
  detectedCards: DetectedCard[];
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
  onCardEdit: (cardId: string, bounds: DetectedCard['bounds']) => void;
  onCreateSelected: () => void;
  onClearAll: () => void;
}

export const DetectedCardsReview = ({
  detectedCards,
  selectedCards,
  onCardToggle,
  onCardEdit,
  onCreateSelected,
  onClearAll
}: DetectedCardsReviewProps) => {
  const [selectedImage, setSelectedImage] = useState<DetectedCard | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-600';
    if (confidence >= 0.6) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (detectedCards.length === 0) {
    return null;
  }

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-medium text-lg mb-2">
              Review Detected Cards ({detectedCards.length})
            </h3>
            <p className="text-crd-lightGray text-sm">
              Select cards to create and adjust detection boundaries if needed
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => {
                detectedCards.forEach(card => {
                  if (!selectedCards.has(card.id)) {
                    onCardToggle(card.id);
                  }
                });
              }}
              variant="outline"
              className="border-editor-border text-white"
            >
              Select All
            </Button>
            <Button
              onClick={onClearAll}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Clear All
            </Button>
            <Button
              onClick={onCreateSelected}
              disabled={selectedCards.size === 0}
              className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
            >
              <Check className="w-4 h-4 mr-2" />
              Create {selectedCards.size} Cards
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cards List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {detectedCards.map((card, index) => (
              <div
                key={card.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCards.has(card.id)
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-editor-border bg-editor-tool hover:border-crd-green/50'
                }`}
                onClick={() => setSelectedImage(card)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCards.has(card.id)}
                    onCheckedChange={() => onCardToggle(card.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div className="w-16 h-20 rounded overflow-hidden bg-gray-700">
                    <img
                      src={URL.createObjectURL(card.imageBlob)}
                      alt={`Card ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        Card {index + 1}
                      </span>
                      <Badge className={`${getConfidenceColor(card.confidence)} text-white text-xs`}>
                        {Math.round(card.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="text-crd-lightGray text-sm">
                      {Math.round(card.bounds.width)} × {Math.round(card.bounds.height)}px
                    </div>
                    
                    {card.metadata?.player?.name && (
                      <div className="text-crd-lightGray text-xs mt-1">
                        {card.metadata.player.name}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCard(card.id);
                      setSelectedImage(card);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-crd-green hover:bg-crd-green/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Image Preview */}
          <div className="bg-editor-tool rounded-lg p-4">
            {selectedImage ? (
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
            ) : (
              <div className="flex items-center justify-center h-80 text-crd-lightGray">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a card to preview detection</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
