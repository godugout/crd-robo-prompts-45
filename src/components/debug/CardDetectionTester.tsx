
import React, { useState, useCallback } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { Typography } from '@/components/ui/design-system/Typography';
import { Upload, Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { enhancedRectangleDetector } from '@/services/cardDetection/enhancedRectangleDetection';
import { DetectionDebugViewer } from './DetectionDebugViewer';
import type { DetectedRectangle, DetectionDebugInfo } from '@/services/cardDetection/enhancedRectangleDetection';

export const CardDetectionTester: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [rectangles, setRectangles] = useState<DetectedRectangle[]>([]);
  const [debugInfo, setDebugInfo] = useState<DetectionDebugInfo>({ processingSteps: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRectangle, setSelectedRectangle] = useState<DetectedRectangle | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image file is too large. Please use an image smaller than 15MB.');
      return;
    }

    setImageFile(file);
    
    const img = new Image();
    img.onload = () => {
      console.log('🖼️ Image loaded:', { width: img.width, height: img.height, file: file.name });
      setImage(img);
      toast.success('Image loaded! Click "Run Detection" to test.');
    };
    img.onerror = () => {
      console.error('❌ Failed to load image');
      toast.error('Failed to load image');
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const runDetection = useCallback(async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    console.log('🚀 Starting detection process...');
    setIsProcessing(true);
    toast.loading('Running enhanced rectangle detection...');

    // Create a timeout to prevent infinite hanging
    const detectionTimeout = setTimeout(() => {
      console.error('⏰ Detection timeout after 30 seconds');
      setIsProcessing(false);
      toast.dismiss();
      toast.error('Detection timed out. The image might be too complex or large.');
    }, 30000);

    try {
      console.log('🔍 Calling enhancedRectangleDetector.detectCardRectangles...');
      
      // Add a small delay to allow the UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await enhancedRectangleDetector.detectCardRectangles(image);
      
      console.log('✅ Detection completed:', result);
      clearTimeout(detectionTimeout);
      
      setRectangles(result.rectangles);
      setDebugInfo(result.debugInfo);
      setSelectedRectangle(null);
      
      toast.dismiss();
      if (result.rectangles.length > 0) {
        toast.success(`Detected ${result.rectangles.length} potential cards!`);
      } else {
        toast.info('No rectangles detected. Try adjusting the image or detection parameters.');
      }
    } catch (error) {
      clearTimeout(detectionTimeout);
      console.error('💥 Detection error:', error);
      toast.dismiss();
      toast.error('Detection failed. Check console for details.');
    } finally {
      setIsProcessing(false);
      console.log('🏁 Detection process finished');
    }
  }, [image]);

  const reset = useCallback(() => {
    console.log('🔄 Resetting detection tester...');
    setImage(null);
    setImageFile(null);
    setRectangles([]);
    setDebugInfo({ processingSteps: [] });
    setSelectedRectangle(null);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <Typography variant="h3" className="mb-4">Card Detection Tester</Typography>
        <Typography variant="caption" className="mb-6 block">
          Test the enhanced rectangle detection algorithm with your own images.
        </Typography>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <CRDButton variant="primary" asChild>
              <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </label>
            </CRDButton>
          </div>
          
          <CRDButton
            variant="primary"
            onClick={runDetection}
            disabled={!image || isProcessing}
            className="bg-crd-green hover:bg-crd-green/90"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Detection
              </>
            )}
          </CRDButton>
          
          <CRDButton
            variant="outline"
            onClick={reset}
            disabled={isProcessing}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </CRDButton>
        </div>

        {imageFile && (
          <div className="mt-4 text-sm text-crd-lightGray">
            Loaded: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
            {image && ` • ${image.width}×${image.height}px`}
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded">
            <Typography variant="caption" className="text-yellow-400">
              🔄 Detection is running... This may take up to 30 seconds for complex images.
              <br />
              If it takes longer, the process will timeout automatically.
            </Typography>
          </div>
        )}
      </div>

      {image && (
        <DetectionDebugViewer
          originalImage={image}
          rectangles={rectangles}
          debugInfo={debugInfo}
          onRectangleSelect={setSelectedRectangle}
        />
      )}

      {selectedRectangle && (
        <CRDCard className="p-4">
          <Typography variant="h4" className="mb-3">Selected Rectangle Details</Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Typography variant="caption" className="block">Position</Typography>
              <Typography variant="body" className="text-crd-white">({selectedRectangle.x}, {selectedRectangle.y})</Typography>
            </div>
            <div>
              <Typography variant="caption" className="block">Size</Typography>
              <Typography variant="body" className="text-crd-white">{selectedRectangle.width}×{selectedRectangle.height}</Typography>
            </div>
            <div>
              <Typography variant="caption" className="block">Confidence</Typography>
              <Typography variant="body" className="text-crd-white">{(selectedRectangle.confidence * 100).toFixed(1)}%</Typography>
            </div>
            <div>
              <Typography variant="caption" className="block">Aspect Ratio</Typography>
              <Typography variant="body" className="text-crd-white">{selectedRectangle.aspectRatio.toFixed(3)}</Typography>
            </div>
          </div>
          
          <div className="mt-3">
            <Typography variant="caption" className="block mb-1">Standard Card Comparison</Typography>
            <Typography variant="caption" className="text-crd-lightGray">
              Target: 0.714 • Difference: {Math.abs(selectedRectangle.aspectRatio - (2.5/3.5)).toFixed(3)}
              {Math.abs(selectedRectangle.aspectRatio - (2.5/3.5)) < 0.1 && 
                <span className="text-crd-green ml-2">✓ Good match!</span>
              }
            </Typography>
          </div>
        </CRDCard>
      )}
    </div>
  );
};
