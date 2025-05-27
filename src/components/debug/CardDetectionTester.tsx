
import React, { useState, useCallback } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card } from '@/components/ui/card';
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
      setImage(img);
      toast.success('Image loaded! Click "Run Detection" to test.');
    };
    img.onerror = () => {
      toast.error('Failed to load image');
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const runDetection = useCallback(async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    toast.loading('Running enhanced rectangle detection...');

    try {
      const result = await enhancedRectangleDetector.detectCardRectangles(image);
      
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
      console.error('Detection error:', error);
      toast.dismiss();
      toast.error('Detection failed. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  }, [image]);

  const reset = useCallback(() => {
    setImage(null);
    setImageFile(null);
    setRectangles([]);
    setDebugInfo({ processingSteps: [] });
    setSelectedRectangle(null);
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h2 className="text-white text-xl font-bold mb-4">Card Detection Tester</h2>
        <p className="text-gray-400 mb-6">
          Test the enhanced rectangle detection algorithm with your own images.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <CRDButton variant="primary" asChild className="cursor-pointer">
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </span>
              </CRDButton>
            </label>
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
            className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </CRDButton>
        </div>

        {imageFile && (
          <div className="mt-4 text-sm text-gray-400">
            Loaded: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
            {image && ` • ${image.width}×${image.height}px`}
          </div>
        )}
      </Card>

      {image && (
        <DetectionDebugViewer
          originalImage={image}
          rectangles={rectangles}
          debugInfo={debugInfo}
          onRectangleSelect={setSelectedRectangle}
        />
      )}

      {selectedRectangle && (
        <Card className="p-4 bg-gray-900 border-gray-700">
          <h3 className="text-white font-semibold mb-3">Selected Rectangle Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Position</div>
              <div className="text-white">({selectedRectangle.x}, {selectedRectangle.y})</div>
            </div>
            <div>
              <div className="text-gray-400">Size</div>
              <div className="text-white">{selectedRectangle.width}×{selectedRectangle.height}</div>
            </div>
            <div>
              <div className="text-gray-400">Confidence</div>
              <div className="text-white">{(selectedRectangle.confidence * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-400">Aspect Ratio</div>
              <div className="text-white">{selectedRectangle.aspectRatio.toFixed(3)}</div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-gray-400 text-sm mb-1">Standard Card Comparison</div>
            <div className="text-gray-300 text-sm">
              Target: 0.714 • Difference: {Math.abs(selectedRectangle.aspectRatio - (2.5/3.5)).toFixed(3)}
              {Math.abs(selectedRectangle.aspectRatio - (2.5/3.5)) < 0.1 && 
                <span className="text-green-400 ml-2">✓ Good match!</span>
              }
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
