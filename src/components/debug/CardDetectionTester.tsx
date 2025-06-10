
import React, { useState, useCallback } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card } from '@/components/ui/card';
import { Upload, Play, RotateCcw, Settings, Download } from 'lucide-react';
import { toast } from 'sonner';
import { improvedCardDetector } from '@/services/cardDetection/improvedCardDetection';
import { DetectionDebugViewer } from './DetectionDebugViewer';
import type { DetectedCard, DetectionDebugInfo } from '@/services/cardDetection/improvedCardDetection';

interface DetectionSettings {
  sensitivity: number;
  backgroundType: 'auto' | 'clean' | 'cluttered' | 'mixed';
  cardCondition: 'auto' | 'raw' | 'sleeved' | 'graded' | 'cased';
  minSize: number;
  maxSize: number;
}

export const CardDetectionTester: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [debugInfo, setDebugInfo] = useState<DetectionDebugInfo>({ 
    processingTime: 0, 
    strategiesUsed: [], 
    totalCandidates: 0, 
    processingSteps: [] 
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DetectedCard | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DetectionSettings>({
    sensitivity: 70,
    backgroundType: 'auto',
    cardCondition: 'auto',
    minSize: 5,
    maxSize: 80
  });

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
      toast.success('Image loaded! Click "Detect Cards" to analyze.');
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

    console.log('🚀 Starting improved card detection...');
    setIsProcessing(true);
    
    const detectionToast = toast.loading('🔍 Analyzing image with advanced detection...', {
      description: 'Using multi-strategy algorithm for precise card detection'
    });

    try {
      const result = await improvedCardDetector.detectCards(image);
      
      console.log('✅ Detection completed:', {
        cardsFound: result.cards.length,
        processingTime: result.debugInfo.processingTime,
        strategies: result.debugInfo.strategiesUsed
      });
      
      setDetectedCards(result.cards);
      setDebugInfo(result.debugInfo);
      setSelectedCard(null);
      
      toast.dismiss(detectionToast);
      
      if (result.cards.length > 0) {
        toast.success(`🎯 Detected ${result.cards.length} potential cards!`, {
          description: `Analysis completed in ${result.debugInfo.processingTime}ms`
        });
      } else {
        toast.info('🤔 No cards detected in this image', {
          description: 'Try adjusting detection settings or use a different image'
        });
      }
    } catch (error) {
      console.error('💥 Detection error:', error);
      toast.dismiss(detectionToast);
      toast.error('❌ Detection failed', {
        description: 'Please check the console for details'
      });
    } finally {
      setIsProcessing(false);
      console.log('🏁 Detection process finished');
    }
  }, [image]);

  const exportApprovedCards = useCallback(() => {
    // This would implement exporting approved cards
    toast.success('Export functionality coming soon!');
  }, []);

  const reset = useCallback(() => {
    console.log('🔄 Resetting detection tester...');
    setImage(null);
    setImageFile(null);
    setDetectedCards([]);
    setDebugInfo({ processingTime: 0, strategiesUsed: [], totalCandidates: 0, processingSteps: [] });
    setSelectedCard(null);
    setShowSettings(false);
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      {/* Header Controls */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-white text-xl font-bold mb-2">Advanced Card Detection Studio</h2>
            <p className="text-gray-400">
              Upload any image to detect trading cards with intelligent cropping and analysis.
            </p>
          </div>
          
          <div className="flex gap-2">
            <CRDButton
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </CRDButton>
            
            {detectedCards.length > 0 && (
              <CRDButton
                variant="outline"
                onClick={exportApprovedCards}
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </CRDButton>
            )}
          </div>
        </div>
        
        {/* Detection Settings */}
        {showSettings && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <h3 className="text-white font-semibold mb-4">Detection Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Sensitivity: {settings.sensitivity}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.sensitivity}
                  onChange={(e) => setSettings(prev => ({ ...prev, sensitivity: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Background Type</label>
                <select
                  value={settings.backgroundType}
                  onChange={(e) => setSettings(prev => ({ ...prev, backgroundType: e.target.value as any }))}
                  className="w-full bg-gray-700 text-white rounded border border-gray-600 px-3 py-2"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="clean">Clean background</option>
                  <option value="cluttered">Cluttered background</option>
                  <option value="mixed">Mixed background</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Card Condition</label>
                <select
                  value={settings.cardCondition}
                  onChange={(e) => setSettings(prev => ({ ...prev, cardCondition: e.target.value as any }))}
                  className="w-full bg-gray-700 text-white rounded border border-gray-600 px-3 py-2"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="raw">Raw cards</option>
                  <option value="sleeved">Sleeved cards</option>
                  <option value="graded">Graded/slabbed</option>
                  <option value="cased">In cases</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Size Range: {settings.minSize}%-{settings.maxSize}%
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={settings.minSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, minSize: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={settings.maxSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxSize: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Upload and Action Controls */}
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
                Detecting...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Detect Cards
              </>
            )}
          </CRDButton>
          
          <CRDButton
            variant="outline"
            onClick={reset}
            disabled={isProcessing}
            className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </CRDButton>
        </div>

        {/* File Info */}
        {imageFile && (
          <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
            <div className="text-sm text-gray-300">
              <strong>Loaded:</strong> {imageFile.name} 
              <span className="ml-2 text-gray-400">
                ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              {image && (
                <span className="ml-2 text-gray-400">
                  • {image.width}×{image.height}px
                </span>
              )}
            </div>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600 rounded">
            <div className="flex items-center text-blue-400">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
              <div>
                <p className="font-medium">Advanced detection in progress...</p>
                <p className="text-sm text-blue-300 mt-1">
                  Running multi-strategy analysis for optimal card detection
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Detection Results */}
      {image && (
        <DetectionDebugViewer
          originalImage={image}
          rectangles={detectedCards}
          debugInfo={debugInfo}
          onRectangleSelect={setSelectedCard}
        />
      )}

      {/* Selected Card Details */}
      {selectedCard && (
        <Card className="p-4 bg-gray-900 border-gray-700">
          <h3 className="text-white font-semibold mb-3">Selected Card Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Position</div>
              <div className="text-white">{Math.round(selectedCard.x)}, {Math.round(selectedCard.y)}</div>
            </div>
            <div>
              <div className="text-gray-400">Dimensions</div>
              <div className="text-white">{Math.round(selectedCard.width)}×{Math.round(selectedCard.height)}</div>
            </div>
            <div>
              <div className="text-gray-400">Confidence</div>
              <div className="text-white">{(selectedCard.confidence * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-400">Aspect Ratio</div>
              <div className="text-white">{selectedCard.aspectRatio.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-400">Background</div>
              <div className="text-white capitalize">{selectedCard.backgroundType}</div>
            </div>
            <div>
              <div className="text-gray-400">Condition</div>
              <div className="text-white capitalize">{selectedCard.cardCondition}</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Edge Strength</div>
              <div className="text-white">{(selectedCard.edgeStrength * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-400">Geometry Score</div>
              <div className="text-white">{(selectedCard.geometryScore * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-gray-400 text-sm mb-1">Standard Card Comparison</div>
            <div className="text-gray-300 text-sm">
              Target Ratio: 0.714 • Difference: {Math.abs(selectedCard.aspectRatio - 0.714).toFixed(3)}
              {Math.abs(selectedCard.aspectRatio - 0.714) < 0.1 && 
                <span className="text-green-400 ml-2">✓ Excellent match!</span>
              }
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
