
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricImage, Rect } from 'fabric';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  RotateCw, 
  RotateCcw, 
  Move, 
  Check, 
  X, 
  Sparkles,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { exportCroppedImage } from '@/utils/cropUtils';
import { CardAnalysisSection } from './CardAnalysisSection';
import { CardDetailsForm } from './CardDetailsForm';
import { toast } from 'sonner';
import type { CardMetadata } from '@/services/cardAnalyzer/CardMetadataAnalyzer';

interface CardFormData {
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  rarity: string;
  tags: string[];
  sports_metadata: CardMetadata;
}

type CreationPhase = 'upload' | 'crop' | 'analyze' | 'details' | 'preview';

export const UnifiedCardCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentPhase, setCurrentPhase] = useState<CreationPhase>('upload');
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState<CardFormData>({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    rarity: 'common',
    tags: [],
    sports_metadata: {}
  });

  // Initialize the fixed-size canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#f8f9fa',
      selection: false
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !fabricCanvas) return;

    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);

    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      if (!img) return;

      // Clear canvas first
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#f8f9fa';

      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = 600;
      const canvasHeight = 400;
      const imageAspect = img.width! / img.height!;
      const canvasAspect = canvasWidth / canvasHeight;

      let scaleFactor;
      if (imageAspect > canvasAspect) {
        scaleFactor = (canvasWidth * 0.8) / img.width!;
      } else {
        scaleFactor = (canvasHeight * 0.8) / img.height!;
      }

      img.scale(scaleFactor);
      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });

      fabricCanvas.add(img);
      setOriginalImage(img);

      // Create crop rectangle
      const cropWidth = Math.min(250, img.getScaledWidth() * 0.8);
      const cropHeight = cropWidth * (3.5 / 2.5); // Trading card aspect ratio

      const rect = new Rect({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        width: cropWidth,
        height: cropHeight,
        fill: 'transparent',
        stroke: '#10b981',
        strokeWidth: 2,
        strokeDashArray: [8, 4],
        originX: 'center',
        originY: 'center',
        selectable: true,
        evented: true,
        hasRotatingPoint: true,
        transparentCorners: false,
        cornerColor: '#10b981',
        cornerSize: 10,
        borderColor: '#10b981',
        borderScaleFactor: 2
      });

      // Lock aspect ratio during scaling
      rect.on('scaling', () => {
        const aspectRatio = 2.5 / 3.5;
        const newWidth = rect.width! * rect.scaleX!;
        const newHeight = newWidth / aspectRatio;
        rect.set({
          height: newHeight / rect.scaleY!
        });
      });

      rect.on('modified', () => {
        setCropRect(rect);
      });

      fabricCanvas.add(rect);
      setCropRect(rect);
      fabricCanvas.setActiveObject(rect);
      fabricCanvas.renderAll();

      setCurrentPhase('crop');
      toast.success('Image loaded! Adjust the crop area as needed.');
    });
  }, [fabricCanvas]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isProcessing || currentPhase !== 'upload',
    noClick: currentPhase !== 'upload'
  });

  const handleRotateImage = (degrees: number) => {
    if (!originalImage || !fabricCanvas) return;

    const newAngle = (originalImage.angle || 0) + degrees;
    originalImage.set({ angle: newAngle });
    fabricCanvas.renderAll();
  };

  const handleApplyCrop = async () => {
    if (!fabricCanvas || !cropRect || !originalImage) return;

    setIsProcessing(true);
    try {
      const croppedUrl = await exportCroppedImage(fabricCanvas, cropRect, originalImage);
      setCroppedImageUrl(croppedUrl);
      setCardData(prev => ({ 
        ...prev, 
        image_url: croppedUrl, 
        thumbnail_url: croppedUrl 
      }));
      setCurrentPhase('analyze');
      toast.success('Crop applied! Ready for AI analysis.');
    } catch (error) {
      console.error('Crop failed:', error);
      toast.error('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMetadataExtracted = (metadata: CardMetadata) => {
    setCardData(prev => ({
      ...prev,
      sports_metadata: metadata,
      title: metadata.player || prev.title,
      description: `${metadata.year || ''} ${metadata.brand || ''} ${metadata.series || ''}`.trim() || prev.description
    }));
    setCurrentPhase('details');
  };

  const resetCreator = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#f8f9fa';
      fabricCanvas.renderAll();
    }
    setCurrentPhase('upload');
    setOriginalImage(null);
    setCropRect(null);
    setCroppedImageUrl('');
    setCardData({
      title: '',
      description: '',
      image_url: '',
      thumbnail_url: '',
      rarity: 'common',
      tags: [],
      sports_metadata: {}
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="h-full flex">
        {/* Fixed Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Enhanced Card Creator</h1>
                <p className="text-gray-400">Create professional trading cards with AI</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentPhase === 'upload' ? 'bg-blue-500/20 text-blue-400' :
                  currentPhase === 'crop' ? 'bg-green-500/20 text-green-400' :
                  currentPhase === 'analyze' ? 'bg-purple-500/20 text-purple-400' :
                  currentPhase === 'details' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                </div>
                
                {currentPhase !== 'upload' && (
                  <Button
                    onClick={resetCreator}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center">
            <Card className="bg-gray-800/50 border-gray-600 p-6">
              <div 
                {...(currentPhase === 'upload' ? getRootProps() : {})}
                className={`relative ${currentPhase === 'upload' ? 'cursor-pointer' : ''}`}
              >
                {currentPhase === 'upload' && <input {...getInputProps()} />}
                
                <canvas 
                  ref={canvasRef} 
                  className="border border-gray-600 rounded-lg bg-gray-50"
                />
                
                {currentPhase === 'upload' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg">
                    <div className="text-center text-white">
                      <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-green-400' : 'text-gray-400'}`} />
                      <h3 className="text-lg font-semibold mb-2">
                        {isDragActive ? 'Drop your image here!' : 'Upload Card Image'}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WebP • Max 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {croppedImageUrl && currentPhase !== 'upload' && currentPhase !== 'crop' && (
                <div className="mt-4 text-center">
                  <div className="w-32 h-44 mx-auto bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={croppedImageUrl} 
                      alt="Card Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Card Preview</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {currentPhase === 'crop' && originalImage && (
            <div className="p-6 space-y-4">
              <h3 className="text-white font-semibold">Crop Controls</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleRotateImage(-90)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rotate Left
                </Button>
                
                <Button
                  onClick={() => handleRotateImage(90)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate Right
                </Button>
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  • Drag corners to resize crop area
                </p>
                <p className="text-gray-400 text-sm">
                  • Drag rotation handle to rotate
                </p>
                <p className="text-gray-400 text-sm">
                  • Drag center to move position
                </p>
              </div>

              <Button
                onClick={handleApplyCrop}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Apply Crop
                  </>
                )}
              </Button>
            </div>
          )}

          {currentPhase === 'analyze' && croppedImageUrl && (
            <div className="flex-1 p-6">
              <CardAnalysisSection
                onMetadataExtracted={handleMetadataExtracted}
                existingImageUrl={croppedImageUrl}
              />
              
              <Button
                onClick={() => setCurrentPhase('details')}
                variant="outline"
                className="w-full mt-4 border-gray-600 text-gray-300"
              >
                Skip Analysis & Continue
              </Button>
            </div>
          )}

          {currentPhase === 'details' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <CardDetailsForm
                initialData={cardData}
                onSubmit={(data) => {
                  console.log('Card created:', data);
                  toast.success('Card created successfully!');
                  setCurrentPhase('preview');
                }}
                previewImage={croppedImageUrl}
              />
            </div>
          )}

          {currentPhase === 'preview' && (
            <div className="flex-1 p-6 space-y-4">
              <h3 className="text-white font-semibold">Card Complete!</h3>
              <p className="text-gray-400">Your card has been created successfully.</p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View in Gallery
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Card
                </Button>
                
                <Button
                  onClick={resetCreator}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Create Another Card
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
