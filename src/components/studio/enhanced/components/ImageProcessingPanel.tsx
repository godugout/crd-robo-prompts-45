
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, 
  Scissors, 
  Sparkles, 
  Download, 
  Settings,
  Loader2,
  CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';
import { advancedImageProcessor, type ProcessingOptions } from '@/services/imageProcessing/AdvancedImageProcessor';

interface ImageProcessingPanelProps {
  imageUrl: string;
  onProcessingComplete: (processedImageUrl: string) => void;
  className?: string;
}

export const ImageProcessingPanel: React.FC<ImageProcessingPanelProps> = ({
  imageUrl,
  onProcessingComplete,
  className = ""
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    removeBackground: false,
    enhanceQuality: true,
    smartCrop: true,
    targetAspectRatio: 2.5 / 3.5,
    outputFormat: 'png',
    quality: 95,
    maxDimension: 1024
  });

  const handleProcess = async () => {
    if (!imageUrl) {
      toast.error('No image to process');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Process with advanced pipeline
      const result = await advancedImageProcessor.processImage(img, processingOptions);
      
      // Create URL for processed image
      const processedUrl = URL.createObjectURL(result.processedBlob);
      
      setProcessingProgress(100);
      onProcessingComplete(processedUrl);
      
      toast.success(`Image processed successfully!`, {
        description: `Applied: ${result.appliedOperations.join(', ')}`
      });
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const updateOption = <K extends keyof ProcessingOptions>(
    key: K,
    value: ProcessingOptions[K]
  ) => {
    setProcessingOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={`p-4 bg-editor-tool border-editor-border ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Advanced Processing
          </h3>
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-crd-green text-black hover:bg-crd-green/90"
            size="sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                Process
              </>
            )}
          </Button>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={processingProgress} className="h-2" />
            <p className="text-crd-lightGray text-xs text-center">
              Running advanced AI pipeline...
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Background Removal */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">AI Background Removal</p>
              <p className="text-crd-lightGray text-xs">Remove background automatically</p>
            </div>
            <Switch
              checked={processingOptions.removeBackground}
              onCheckedChange={(checked) => updateOption('removeBackground', checked)}
            />
          </div>

          {/* Quality Enhancement */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Quality Enhancement</p>
              <p className="text-crd-lightGray text-xs">Sharpen and enhance colors</p>
            </div>
            <Switch
              checked={processingOptions.enhanceQuality}
              onCheckedChange={(checked) => updateOption('enhanceQuality', checked)}
            />
          </div>

          {/* Smart Crop */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Smart Crop</p>
              <p className="text-crd-lightGray text-xs">Auto-crop to card aspect ratio</p>
            </div>
            <Switch
              checked={processingOptions.smartCrop}
              onCheckedChange={(checked) => updateOption('smartCrop', checked)}
            />
          </div>

          {/* Quality Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-white text-sm font-medium">Output Quality</p>
              <span className="text-crd-lightGray text-sm">{processingOptions.quality}%</span>
            </div>
            <Slider
              value={[processingOptions.quality || 95]}
              onValueChange={([value]) => updateOption('quality', value)}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Max Dimension */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-white text-sm font-medium">Max Resolution</p>
              <span className="text-crd-lightGray text-sm">{processingOptions.maxDimension}px</span>
            </div>
            <Slider
              value={[processingOptions.maxDimension || 1024]}
              onValueChange={([value]) => updateOption('maxDimension', value)}
              min={512}
              max={2048}
              step={256}
              className="w-full"
            />
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <p className="text-white text-sm font-medium">Output Format</p>
            <div className="flex gap-2">
              {(['png', 'jpeg', 'webp'] as const).map((format) => (
                <Button
                  key={format}
                  variant={processingOptions.outputFormat === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateOption('outputFormat', format)}
                  className={processingOptions.outputFormat === format ? 'bg-crd-green text-black' : ''}
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-editor-border">
          <p className="text-crd-lightGray text-xs">
            Advanced AI processing pipeline with background removal, smart cropping, and quality enhancement.
          </p>
        </div>
      </div>
    </Card>
  );
};
