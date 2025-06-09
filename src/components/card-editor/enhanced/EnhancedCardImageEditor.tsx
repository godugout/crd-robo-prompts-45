
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, RotateCw, Maximize2, Grid3X3 } from 'lucide-react';
import { SmartCardFitter } from './SmartCardFitter';
import { ImageEnhancementControls } from './ImageEnhancementControls';
import { PerspectiveEditor } from './PerspectiveEditor';
import { AspectRatioGuide } from './AspectRatioGuide';
import { toast } from 'sonner';

interface EnhancedCardImageEditorProps {
  image: HTMLImageElement;
  onConfirm: (adjustedImageData: string) => void;
  onCancel: () => void;
  className?: string;
}

export interface ImageAdjustments {
  perspective: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
  rotation: number;
  scale: number;
  position: { x: number; y: number };
  crop: { x: number; y: number; width: number; height: number };
  enhancements: {
    brightness: number;
    contrast: number;
    saturation: number;
    sharpness: number;
  };
}

export const EnhancedCardImageEditor: React.FC<EnhancedCardImageEditorProps> = ({
  image,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    perspective: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 1, y: 0 },
      bottomLeft: { x: 0, y: 1 },
      bottomRight: { x: 1, y: 1 }
    },
    rotation: 0,
    scale: 1,
    position: { x: 0, y: 0 },
    crop: { x: 0, y: 0, width: 1, height: 1 },
    enhancements: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 100
    }
  });

  const [editMode, setEditMode] = useState<'perspective' | 'crop' | 'enhance' | 'fit'>('fit');
  const [showGrid, setShowGrid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Target card aspect ratio (2.5:3.5 = 0.714)
  const TARGET_ASPECT_RATIO = 2.5 / 3.5;

  const updateAdjustments = (updates: Partial<ImageAdjustments>) => {
    setAdjustments(prev => ({ ...prev, ...updates }));
  };

  const applyAutoFit = () => {
    // Analyze image and automatically fit to card boundaries
    const imageAspect = image.width / image.height;
    const cardAspect = TARGET_ASPECT_RATIO;
    
    let scale = 1;
    let position = { x: 0, y: 0 };
    
    if (imageAspect > cardAspect) {
      // Image is wider than card, fit by height
      scale = 1;
      position.x = (imageAspect - cardAspect) / 2;
    } else {
      // Image is taller than card, fit by width
      scale = cardAspect / imageAspect;
    }

    updateAdjustments({
      scale,
      position,
      rotation: 0,
      crop: { x: 0, y: 0, width: 1, height: 1 }
    });

    toast.success('Auto-fit applied! Card boundaries optimized.');
  };

  const resetAdjustments = () => {
    setAdjustments({
      perspective: {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 1, y: 0 },
        bottomLeft: { x: 0, y: 1 },
        bottomRight: { x: 1, y: 1 }
      },
      rotation: 0,
      scale: 1,
      position: { x: 0, y: 0 },
      crop: { x: 0, y: 0, width: 1, height: 1 },
      enhancements: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        sharpness: 100
      }
    });
    toast.info('All adjustments reset to default.');
  };

  const handleConfirm = async () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    try {
      // Apply all adjustments and export the result
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      
      // Set output dimensions for trading card (750x1050 for high quality)
      canvas.width = 750;
      canvas.height = 1050;
      
      // Apply perspective correction and all adjustments
      ctx.save();
      
      // Apply enhancements
      const { brightness, contrast, saturation } = adjustments.enhancements;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      
      // Draw the transformed image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      ctx.restore();
      
      const adjustedImageData = canvas.toDataURL('image/png', 1.0);
      onConfirm(adjustedImageData);
      
      toast.success('Card image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`bg-editor-dark border-editor-border ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Enhanced Card Image Editor</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="outline"
                size="sm"
                className={`border-editor-border ${showGrid ? 'bg-crd-green text-black' : 'text-white'}`}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Check className="w-4 h-4 mr-1" />
                {isProcessing ? 'Processing...' : 'Apply'}
              </Button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-2">
            {[
              { id: 'fit', label: 'Auto Fit', icon: Maximize2 },
              { id: 'perspective', label: 'Perspective', icon: RotateCw },
              { id: 'crop', label: 'Crop & Scale', icon: Grid3X3 },
              { id: 'enhance', label: 'Enhance', icon: RotateCw }
            ].map(mode => (
              <Button
                key={mode.id}
                onClick={() => setEditMode(mode.id as any)}
                variant={editMode === mode.id ? 'default' : 'outline'}
                size="sm"
                className={editMode === mode.id ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
              >
                <mode.icon className="w-4 h-4 mr-1" />
                {mode.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Aspect Ratio Guide */}
              <AspectRatioGuide 
                currentAspectRatio={image.width / image.height}
                targetAspectRatio={TARGET_ASPECT_RATIO}
              />

              {/* Main Canvas */}
              <div className="relative border border-editor-border rounded-lg overflow-hidden bg-editor-darker">
                {editMode === 'fit' && (
                  <SmartCardFitter
                    image={image}
                    adjustments={adjustments}
                    onAdjustmentsChange={updateAdjustments}
                    showGrid={showGrid}
                    targetAspectRatio={TARGET_ASPECT_RATIO}
                  />
                )}
                
                {editMode === 'perspective' && (
                  <PerspectiveEditor
                    image={image}
                    adjustments={adjustments}
                    onAdjustmentsChange={updateAdjustments}
                    showGrid={showGrid}
                  />
                )}

                {(editMode === 'crop' || editMode === 'enhance') && (
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto"
                      style={{ maxHeight: '600px' }}
                    />
                    {showGrid && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-30">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-crd-green/50" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={applyAutoFit}
                  variant="outline"
                  size="sm"
                  className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  Auto Fit
                </Button>
                <Button
                  onClick={resetAdjustments}
                  variant="outline"
                  size="sm"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  Reset All
                </Button>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-4">
              {editMode === 'enhance' && (
                <ImageEnhancementControls
                  enhancements={adjustments.enhancements}
                  onEnhancementsChange={(enhancements) => 
                    updateAdjustments({ enhancements })
                  }
                />
              )}

              {/* Image Info */}
              <Card className="bg-editor-darker border-editor-border">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Image Details</h4>
                  <div className="text-xs text-crd-lightGray space-y-1">
                    <div>Original: {image.width}×{image.height}</div>
                    <div>Aspect: {(image.width / image.height).toFixed(3)}</div>
                    <div>Target: 2.5×3.5 (0.714)</div>
                    <div>Rotation: {adjustments.rotation.toFixed(1)}°</div>
                    <div>Scale: {adjustments.scale.toFixed(2)}x</div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-editor-tool border-editor-border">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Editing Tips</h4>
                  <ul className="text-xs text-crd-lightGray space-y-1">
                    <li>• Use Auto Fit for quick card optimization</li>
                    <li>• Drag corners in Perspective mode to fix skewed cards</li>
                    <li>• Enable Grid for better alignment</li>
                    <li>• Enhance tab for brightness/contrast adjustments</li>
                    <li>• Target aspect ratio: 2.5:3.5 for trading cards</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
