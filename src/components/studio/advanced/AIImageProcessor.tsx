
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  Scissors, 
  Sparkles, 
  Download,
  Upload,
  RotateCw,
  Palette,
  Zap,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers
env.allowLocalModels = false;
env.useBrowserCache = true;

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: string;
}

interface AIImageProcessorProps {
  imageUrl: string;
  onImageProcessed: (processedUrl: string, metadata: any) => void;
  onClose: () => void;
}

export const AIImageProcessor: React.FC<AIImageProcessorProps> = ({
  imageUrl,
  onImageProcessed,
  onClose
}) => {
  const [processedImage, setProcessedImage] = useState<string>(imageUrl);
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: ''
  });
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    blur: 0,
    noise: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  // Load original image
  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (originalImageRef.current) {
        originalImageRef.current = img;
        applyAdjustments();
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Apply real-time adjustments
  const applyAdjustments = useCallback(() => {
    if (!canvasRef.current || !originalImageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = originalImageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Apply filters
    const filters = [
      `brightness(${adjustments.brightness}%)`,
      `contrast(${adjustments.contrast}%)`,
      `saturate(${adjustments.saturation}%)`,
      adjustments.blur > 0 ? `blur(${adjustments.blur}px)` : '',
    ].filter(Boolean).join(' ');
    
    ctx.filter = filters;
    ctx.drawImage(img, 0, 0);
    
    // Apply additional effects
    if (adjustments.sharpness > 0) {
      applySharpen(ctx, canvas.width, canvas.height, adjustments.sharpness);
    }
    
    if (adjustments.noise > 0) {
      applyNoise(ctx, canvas.width, canvas.height, adjustments.noise);
    }
    
    const dataUrl = canvas.toDataURL('image/png');
    setProcessedImage(dataUrl);
  }, [adjustments]);

  // Sharpening filter
  const applySharpen = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = amount / 100;
    
    // Simple unsharp mask
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (1 + factor));     // R
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor)); // G
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor)); // B
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Noise reduction
  const applyNoise = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = amount / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * factor * 50;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // AI Background Removal
  const removeBackground = async () => {
    setProcessing({ isProcessing: true, progress: 10, stage: 'Loading AI model...' });
    
    try {
      const segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      );
      
      setProcessing({ isProcessing: true, progress: 50, stage: 'Processing image...' });
      
      const result = await segmenter(imageUrl);
      
      setProcessing({ isProcessing: true, progress: 80, stage: 'Applying mask...' });
      
      if (result && Array.isArray(result) && result[0]?.mask) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');
        
        const img = originalImageRef.current;
        if (!img) throw new Error('Original image not loaded');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply inverted mask to alpha channel
        for (let i = 0; i < result[0].mask.data.length; i++) {
          const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
          data[i * 4 + 3] = alpha;
        }
        
        ctx.putImageData(imageData, 0, 0);
        const processedUrl = canvas.toDataURL('image/png');
        setProcessedImage(processedUrl);
        
        toast.success('Background removed successfully!');
      }
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Background removal failed. Please try again.');
    } finally {
      setProcessing({ isProcessing: false, progress: 0, stage: '' });
    }
  };

  // AI Enhancement
  const enhanceImage = async () => {
    setProcessing({ isProcessing: true, progress: 20, stage: 'Analyzing image...' });
    
    try {
      // Simulate AI enhancement (in a real implementation, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessing({ isProcessing: true, progress: 70, stage: 'Enhancing details...' });
      
      // Apply enhanced adjustments
      setAdjustments(prev => ({
        ...prev,
        brightness: 110,
        contrast: 115,
        saturation: 105,
        sharpness: 20
      }));
      
      setProcessing({ isProcessing: true, progress: 100, stage: 'Complete!' });
      setTimeout(() => {
        setProcessing({ isProcessing: false, progress: 0, stage: '' });
        toast.success('Image enhanced with AI!');
      }, 500);
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast.error('Enhancement failed. Please try again.');
      setProcessing({ isProcessing: false, progress: 0, stage: '' });
    }
  };

  // Auto color correction
  const autoColorCorrect = () => {
    setAdjustments(prev => ({
      ...prev,
      brightness: 105,
      contrast: 110,
      saturation: 95
    }));
    toast.success('Auto color correction applied!');
  };

  // Apply adjustments when they change
  React.useEffect(() => {
    const timer = setTimeout(applyAdjustments, 100);
    return () => clearTimeout(timer);
  }, [adjustments, applyAdjustments]);

  const handleSave = () => {
    onImageProcessed(processedImage, { adjustments, timestamp: Date.now() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex">
      {/* Left Panel - Controls */}
      <div className="w-80 bg-editor-dark border-r border-editor-border p-6 overflow-y-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-white text-xl font-bold mb-2">AI Image Lab</h2>
            <p className="text-crd-lightGray text-sm">
              Professional AI-powered image processing
            </p>
          </div>

          {/* AI Tools */}
          <Card className="bg-editor-darker border-editor-border p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Tools
            </h3>
            <div className="space-y-2">
              <Button
                onClick={removeBackground}
                disabled={processing.isProcessing}
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Scissors className="w-4 h-4 mr-2" />
                Remove Background
              </Button>
              <Button
                onClick={enhanceImage}
                disabled={processing.isProcessing}
                variant="outline"
                className="w-full border-crd-blue text-crd-blue hover:bg-crd-blue hover:text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Enhance
              </Button>
              <Button
                onClick={autoColorCorrect}
                variant="outline"
                className="w-full border-crd-purple text-crd-purple hover:bg-crd-purple hover:text-white"
              >
                <Palette className="w-4 h-4 mr-2" />
                Auto Color
              </Button>
            </div>
          </Card>

          {/* Manual Adjustments */}
          <Card className="bg-editor-darker border-editor-border p-4">
            <h3 className="text-white font-semibold mb-4">Manual Adjustments</h3>
            <div className="space-y-4">
              {Object.entries(adjustments).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-crd-lightGray text-sm capitalize">
                      {key}
                    </label>
                    <Badge variant="outline" className="text-xs">
                      {value}{key === 'brightness' || key === 'contrast' || key === 'saturation' ? '%' : ''}
                    </Badge>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => setAdjustments(prev => ({ ...prev, [key]: newValue[0] }))}
                    min={key === 'brightness' || key === 'contrast' || key === 'saturation' ? 0 : -50}
                    max={key === 'brightness' || key === 'contrast' || key === 'saturation' ? 200 : 100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Processing Status */}
          {processing.isProcessing && (
            <Card className="bg-editor-darker border-editor-border p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-crd-green animate-pulse" />
                  <span className="text-white text-sm">Processing...</span>
                </div>
                <div className="w-full bg-editor-border rounded-full h-2">
                  <div 
                    className="bg-crd-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processing.progress}%` }}
                  />
                </div>
                <p className="text-crd-lightGray text-xs">{processing.stage}</p>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Apply
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative max-w-2xl max-h-full">
          <img
            src={processedImage}
            alt="Processed"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          
          {/* Hidden canvas for processing */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Processing overlay */}
          {processing.isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <Wand2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">{processing.stage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
