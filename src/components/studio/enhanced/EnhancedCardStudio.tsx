
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EnhancedFrameBrowser } from './EnhancedFrameBrowser';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { ImageCropperModal } from '@/components/editor/modals/ImageCropperModal';
import { Sparkles, Download, Share2, Eye, Settings, RotateCcw, Maximize2, Upload, Camera, Crop, Edit3, Plus, ImagePlus } from 'lucide-react';
import { 
  calculateFlexibleCardSize, 
  formatScaledDimensions, 
  type CardOrientation,
  type FlexibleCardDimensions 
} from '@/utils/cardDimensions';

interface EnhancedCardStudioProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const EnhancedCardStudio: React.FC<EnhancedCardStudioProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d');
  const [orientation, setOrientation] = useState<CardOrientation>('portrait');
  const [cardDimensions, setCardDimensions] = useState<FlexibleCardDimensions | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [cardName, setCardName] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate flexible card dimensions based on container size
  const updateCardDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    if (containerWidth > 0 && containerHeight > 0) {
      const flexibleDimensions = calculateFlexibleCardSize(
        containerWidth,
        containerHeight,
        orientation,
        4, // maxScale
        0.3 // minScale
      );
      setCardDimensions(flexibleDimensions);
    }
  }, [orientation]);

  // Update dimensions on mount, orientation change, and window resize
  useEffect(() => {
    updateCardDimensions();
    
    const handleResize = () => updateCardDimensions();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCardDimensions]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(imageUrl);
      }
    }
  }, [onImageUpload]);

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    onImageUpload(croppedImageUrl);
    setShowCropModal(false);
  }, [onImageUpload]);

  const renderCardPreview = () => {
    if (!cardDimensions) return null;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <Card 
          className={`bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
            isDragActive ? 'ring-4 ring-crd-green border-crd-green scale-105' : ''
          }`}
          style={{
            width: `${cardDimensions.width}px`,
            height: `${cardDimensions.height}px`,
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Card Content */}
          <div className="relative w-full h-full p-8">
            {uploadedImage ? (
              <div 
                className="relative w-full h-full rounded-2xl overflow-hidden group"
                onMouseEnter={() => setIsHoveringImage(true)}
                onMouseLeave={() => setIsHoveringImage(false)}
              >
                <img 
                  src={uploadedImage} 
                  alt="Card content"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Crop Button Overlay */}
                {isHoveringImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300">
                    <Button
                      onClick={() => setShowCropModal(true)}
                      className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Crop className="w-5 h-5 mr-2" />
                      Crop Image
                    </Button>
                  </div>
                )}
                
                {/* Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {cardName || 'Your Card'}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    Effect: {selectedFrame || 'None selected'}
                  </p>
                </div>
              </div>
            ) : (
              <div 
                className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  isDragActive ? 'border-crd-green bg-crd-green/20' : 'border-white/30 hover:border-crd-green/50'
                }`}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <div className="text-center text-white/80 max-w-md">
                  {isDragActive ? (
                    <>
                      <Upload className="w-24 h-24 mx-auto mb-6 text-crd-green animate-bounce" />
                      <p className="text-3xl font-bold text-crd-green mb-2">Drop your image here!</p>
                      <p className="text-lg">Release to upload and start creating</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                        <ImagePlus className="w-10 h-10 text-crd-green" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Add Your Image</h3>
                      <p className="text-lg mb-4 text-white/70">
                        Drag & drop your image here or click to browse
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <Button 
                          className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-6 py-3 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('image-upload')?.click();
                          }}
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Browse Files
                        </Button>
                      </div>
                      <p className="text-sm text-white/50">
                        Supports JPG, PNG, WebP • Up to 50MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Premium Effects Overlay */}
          {selectedFrame && uploadedImage && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
            </div>
          )}
        </Card>

        {/* Hidden file input */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const imageUrl = URL.createObjectURL(file);
              onImageUpload(imageUrl);
            }
          }}
        />

        {/* Enhanced Dimension Display */}
        {cardDimensions && (
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <div className="text-white text-sm font-medium">
              {formatScaledDimensions(cardDimensions, orientation)}
            </div>
            <div className="text-gray-300 text-xs flex items-center">
              <Maximize2 className="w-3 h-3 mr-1" />
              Scale: {Math.round(cardDimensions.scale * 100)}%
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-white/10">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-white/10">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Header */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-crd-green text-black font-bold px-3 py-1">
                    ENHANCED STUDIO
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                    FLEXIBLE CANVAS
                  </Badge>
                </div>
                <h1 className="text-4xl font-black text-white mb-2">
                  Professional Card Creator
                </h1>
                <p className="text-xl text-gray-300">
                  Create stunning cards with flexible scaling and premium visual effects
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-bold">
                  <Download className="w-4 h-4 mr-2" />
                  Export HD
                </Button>
              </div>
            </div>

            {/* Card Details and Controls Row */}
            <div className="flex items-center justify-between mb-8">
              {/* Left Side - Card Details */}
              <div className="flex-1 max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Edit3 className="w-6 h-6" />
                  Card Details
                </h2>
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg p-4 border border-white/10">
                  <label htmlFor="card-name" className="block text-sm font-medium text-white mb-2">
                    Card Name
                  </label>
                  <Input
                    id="card-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Enter your card name..."
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {cardName.length}/50 characters
                  </p>
                </div>
              </div>

              {/* Right Side - Controls */}
              <div className="flex gap-3">
                {/* Orientation Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                  className="bg-black/50 text-white border-white/20 hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                </Button>
                
                {/* 2D/3D Toggle */}
                <Button
                  variant={previewMode === '2d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('2d')}
                  className={previewMode === '2d' ? 'bg-crd-green text-black' : 'bg-black/50 text-white border-white/20'}
                >
                  2D
                </Button>
                <Button
                  variant={previewMode === '3d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('3d')}
                  className={previewMode === '3d' ? 'bg-crd-green text-black' : 'bg-black/50 text-white border-white/20'}
                >
                  3D
                </Button>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-12 gap-8 h-[calc(100vh-400px)]">
              {/* Left Side - Flexible Card Preview */}
              <div className="col-span-7">
                <div ref={containerRef} className="h-full flex items-center justify-center">
                  {renderCardPreview()}
                </div>
              </div>

              {/* Right Side - Effects Selection */}
              <div className="col-span-5 overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Choose Visual Effects</h2>
                  <EnhancedFrameBrowser
                    onFrameSelect={onFrameSelect}
                    selectedFrame={selectedFrame}
                    orientation={orientation}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropModal && uploadedImage && (
        <ImageCropperModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageUrl={uploadedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};
