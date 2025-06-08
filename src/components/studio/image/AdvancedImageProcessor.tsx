
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Sparkles, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  adjustments: Partial<ImageAdjustments>;
}

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0
};

const FILTER_PRESETS: FilterPreset[] = [
  { id: 'none', name: 'Original', description: 'No filters applied', adjustments: {} },
  { id: 'vibrant', name: 'Vibrant', description: 'Enhanced colors', adjustments: { saturation: 20, contrast: 10 } },
  { id: 'warm', name: 'Warm', description: 'Warm temperature', adjustments: { temperature: 15, exposure: 5 } },
  { id: 'cool', name: 'Cool', description: 'Cool temperature', adjustments: { temperature: -15, tint: -5 } },
  { id: 'dramatic', name: 'Dramatic', description: 'High contrast', adjustments: { contrast: 25, shadows: -10, highlights: -10 } },
  { id: 'vintage', name: 'Vintage', description: 'Retro look', adjustments: { saturation: -10, temperature: 10, exposure: -5 } }
];

interface AdvancedImageProcessorProps {
  imageUrl: string;
  onImageProcessed: (processedUrl: string) => void;
  onClose?: () => void;
}

export const AdvancedImageProcessor: React.FC<AdvancedImageProcessorProps> = ({
  imageUrl,
  onImageProcessed,
  onClose
}) => {
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [selectedPreset, setSelectedPreset] = useState<string>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const removeBackground = async () => {
    setIsRemovingBackground(true);
    try {
      const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'webgpu',
      });
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const result = await segmenter(canvas.toDataURL('image/jpeg', 0.8));
        
        if (result && Array.isArray(result) && result[0]?.mask) {
          const outputCanvas = document.createElement('canvas');
          outputCanvas.width = canvas.width;
          outputCanvas.height = canvas.height;
          const outputCtx = outputCanvas.getContext('2d');
          if (!outputCtx) return;

          outputCtx.drawImage(canvas, 0, 0);
          const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
          const data = imageData.data;

          for (let i = 0; i < result[0].mask.data.length; i++) {
            const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
            data[i * 4 + 3] = alpha;
          }

          outputCtx.putImageData(imageData, 0, 0);
          onImageProcessed(outputCanvas.toDataURL('image/png'));
          toast.success('Background removed successfully!');
        }
      };
      img.src = imageUrl;
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Background removal failed');
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const applyAdjustments = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply CSS filters for real-time preview
      const filters = [
        `brightness(${100 + adjustments.brightness}%)`,
        `contrast(${100 + adjustments.contrast}%)`,
        `saturate(${100 + adjustments.saturation}%)`,
        `hue-rotate(${adjustments.hue}deg)`,
        `sepia(${adjustments.temperature > 0 ? adjustments.temperature / 2 : 0}%)`,
        `invert(${adjustments.temperature < 0 ? Math.abs(adjustments.temperature) / 10 : 0}%)`
      ].join(' ');
      
      ctx.filter = filters;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';
    };
    img.src = imageUrl;
  }, [imageUrl, adjustments]);

  const handleAdjustmentChange = (key: keyof ImageAdjustments, value: number[]) => {
    setAdjustments(prev => ({ ...prev, [key]: value[0] }));
    setSelectedPreset('none');
  };

  const applyPreset = (presetId: string) => {
    const preset = FILTER_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setAdjustments(prev => ({ ...DEFAULT_ADJUSTMENTS, ...preset.adjustments }));
      setSelectedPreset(presetId);
    }
  };

  const resetAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setSelectedPreset('none');
  };

  const saveProcessedImage = () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    try {
      const processedUrl = canvasRef.current.toDataURL('image/png', 1.0);
      onImageProcessed(processedUrl);
      toast.success('Image processed successfully!');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    if (previewEnabled) {
      applyAdjustments();
    }
  }, [applyAdjustments, previewEnabled]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-hidden bg-editor-dark border-editor-border">
        <div className="flex h-full">
          {/* Image Preview */}
          <div className="flex-1 p-6 flex items-center justify-center bg-editor-darker">
            <div className="relative max-w-lg max-h-96">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg shadow-xl"
                style={{ display: previewEnabled ? 'block' : 'none' }}
              />
              {!previewEnabled && (
                <img 
                  src={imageUrl} 
                  alt="Original" 
                  className="max-w-full max-h-full rounded-lg shadow-xl"
                />
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="w-80 bg-editor-dark border-l border-editor-border p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Image Editor</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewEnabled(!previewEnabled)}
                    className="text-white"
                  >
                    {previewEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAdjustments}
                    className="text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="adjust" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-editor-tool">
                  <TabsTrigger value="adjust" className="text-white">Adjust</TabsTrigger>
                  <TabsTrigger value="filters" className="text-white">Filters</TabsTrigger>
                  <TabsTrigger value="ai" className="text-white">AI Tools</TabsTrigger>
                </TabsList>

                <TabsContent value="adjust" className="space-y-4 mt-4">
                  {Object.entries(adjustments).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-crd-lightGray text-sm capitalize">{key}</label>
                        <span className="text-white text-sm">{value}</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(val) => handleAdjustmentChange(key as keyof ImageAdjustments, val)}
                        min={-50}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="filters" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {FILTER_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.id)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          selectedPreset === preset.id
                            ? 'bg-crd-green text-black'
                            : 'bg-editor-tool text-white hover:bg-editor-border'
                        }`}
                      >
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="text-xs opacity-75">{preset.description}</div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4 mt-4">
                  <Button
                    onClick={removeBackground}
                    disabled={isRemovingBackground}
                    className="w-full bg-crd-purple hover:bg-crd-purple/90 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isRemovingBackground ? 'Removing...' : 'Remove Background'}
                  </Button>
                  
                  <div className="text-crd-lightGray text-xs p-3 bg-editor-tool rounded">
                    AI background removal uses advanced machine learning to automatically detect and remove backgrounds from your images.
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t border-editor-border">
                <Button
                  onClick={saveProcessedImage}
                  disabled={isProcessing}
                  className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Apply Changes'}
                </Button>
                {onClose && (
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-editor-border text-white hover:bg-editor-border"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
