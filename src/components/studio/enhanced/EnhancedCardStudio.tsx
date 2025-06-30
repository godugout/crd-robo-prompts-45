
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EnhancedFrameBrowser } from './EnhancedFrameBrowser';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { InlineCropInterface } from './components/InlineCropInterface';
import { ImageCropperModal } from '@/components/editor/modals/ImageCropperModal';
import { Sparkles, Download, Share2, Eye, Settings, RotateCcw, Maximize2, Upload, Camera, Crop, Edit3, Plus, ImagePlus, Menu, X, Scissors } from 'lucide-react';
import { 
  calculateFlexibleCardSize, 
  formatScaledDimensions, 
  type CardOrientation,
  type FlexibleCardDimensions 
} from '@/utils/cardDimensions';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isMobile, isTablet, isDesktop, responsivePadding } = useResponsiveBreakpoints();

  // Calculate flexible card dimensions based on container size
  const updateCardDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    if (containerWidth > 0 && containerHeight > 0) {
      const maxScale = isMobile ? 2.5 : isTablet ? 3 : 4;
      const minScale = isMobile ? 0.4 : 0.3;
      
      const flexibleDimensions = calculateFlexibleCardSize(
        containerWidth,
        containerHeight,
        orientation,
        maxScale,
        minScale
      );
      setCardDimensions(flexibleDimensions);
    }
  }, [orientation, isMobile, isTablet]);

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
    setCropMode(false);
  }, [onImageUpload]);

  const handleCropCancel = useCallback(() => {
    setCropMode(false);
  }, []);

  const enterCropMode = useCallback(() => {
    if (uploadedImage) {
      setCropMode(true);
    }
  }, [uploadedImage]);

  const renderCardPreview = () => {
    if (!cardDimensions) return null;

    const cardSize = isMobile 
      ? { width: Math.min(cardDimensions.width, 280), height: Math.min(cardDimensions.height, 390) }
      : { width: cardDimensions.width, height: cardDimensions.height };

    return (
      <div className="relative w-full h-full flex items-center justify-center min-h-[400px] md:min-h-[500px]">
        <Card 
          className={`bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
            isDragActive ? 'ring-4 ring-crd-green border-crd-green scale-105' : ''
          }`}
          style={cardSize}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Card Content */}
          <div className="relative w-full h-full p-4 md:p-6 lg:p-8">
            {uploadedImage ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                <img 
                  src={uploadedImage} 
                  alt="Card content"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Crop Button Overlay - Desktop */}
                {!cropMode && isHoveringImage && !isMobile && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300">
                    <Button
                      onClick={enterCropMode}
                      className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Scissors className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Crop Image
                    </Button>
                  </div>
                )}
                
                {/* Mobile Crop Button */}
                {!cropMode && isMobile && (
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      onClick={enterCropMode}
                      className="bg-crd-green hover:bg-crd-green/90 text-black w-8 h-8 p-0 rounded-full"
                    >
                      <Scissors className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {/* Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                  <h3 className="text-white text-lg md:text-2xl font-bold mb-1 md:mb-2 truncate">
                    {cardName || 'Your Card'}
                  </h3>
                  <p className="text-gray-200 text-xs md:text-sm truncate">
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
                <div className="text-center text-white/80 max-w-xs md:max-w-md px-4">
                  {isDragActive ? (
                    <>
                      <Upload className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 text-crd-green animate-bounce" />
                      <p className="text-xl md:text-3xl font-bold text-crd-green mb-2">Drop your image here!</p>
                      <p className="text-sm md:text-lg">Release to upload and start creating</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                        <ImagePlus className="w-8 h-8 md:w-10 md:h-10 text-crd-green" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">Add Your Image</h3>
                      <p className="text-sm md:text-lg mb-3 md:mb-4 text-white/70">
                        {isMobile ? "Tap to browse" : "Drag & drop your image here or click to browse"}
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-3 md:mb-4">
                        <Button 
                          className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('image-upload')?.click();
                          }}
                        >
                          <Camera className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                          Browse Files
                        </Button>
                      </div>
                      <p className="text-xs md:text-sm text-white/50">
                        Supports JPG, PNG, WebP • Up to 50MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Premium Effects Overlay */}
          {selectedFrame && uploadedImage && !cropMode && (
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
        {cardDimensions && !isMobile && !cropMode && (
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

        {/* Action Buttons - Desktop Only */}
        {!isMobile && !cropMode && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-white/10">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-white/10">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Header */}
        <div className={`${responsivePadding} py-4 md:py-6 lg:py-8`}>
          <div className="max-w-7xl mx-auto">
            {/* Mobile Header */}
            {isMobile && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Badge className="bg-crd-green text-black font-bold px-2 py-1 text-xs">
                    ENHANCED STUDIO
                  </Badge>
                  {cropMode && (
                    <Badge className="bg-purple-500 text-white font-bold px-2 py-1 text-xs">
                      CROP MODE
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              </div>
            )}

            {/* Desktop Header */}
            {!isMobile && (
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-crd-green text-black font-bold px-3 py-1">
                      ENHANCED STUDIO
                    </Badge>
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                      FLEXIBLE CANVAS
                    </Badge>
                    {cropMode && (
                      <Badge className="bg-purple-500 text-white font-bold px-3 py-1">
                        CROP MODE ACTIVE
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">
                    Professional Card Creator
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300">
                    {cropMode ? 'Crop and adjust your image with precision tools' : 'Create stunning cards with flexible scaling and premium visual effects'}
                  </p>
                </div>
                
                {!cropMode && (
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
                )}
              </div>
            )}

            {/* Card Details and Controls Row - Hide in Crop Mode */}
            {!cropMode && (
              <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'} mb-6 md:mb-8`}>
                {/* Left Side - Card Details */}
                <div className={`${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 md:w-6 md:h-6" />
                    Card Details
                  </h2>
                  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg p-3 md:p-4 border border-white/10">
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
                <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2 md:gap-3`}>
                  {/* Orientation Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                    className="bg-black/50 text-white border-white/20 hover:bg-white/10 text-xs md:text-sm"
                  >
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                  </Button>
                  
                  {/* 2D/3D Toggle */}
                  <div className="flex gap-1">
                    <Button
                      variant={previewMode === '2d' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('2d')}
                      className={`text-xs md:text-sm ${previewMode === '2d' ? 'bg-crd-green text-black' : 'bg-black/50 text-white border-white/20'}`}
                    >
                      2D
                    </Button>
                    <Button
                      variant={previewMode === '3d' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('3d')}
                      className={`text-xs md:text-sm ${previewMode === '3d' ? 'bg-crd-green text-black' : 'bg-black/50 text-white border-white/20'}`}
                    >
                      3D
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu */}
            {isMobile && isMobileMenuOpen && !cropMode && (
              <div className="mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg p-4 border border-white/10">
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 text-sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-bold text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            )}

            {/* Main Layout - Responsive */}
            <div className={`${
              isMobile 
                ? 'flex flex-col gap-6' 
                : isTablet 
                  ? 'flex flex-col gap-8'
                  : 'grid grid-cols-12 gap-8'
            }`}>
              
              {/* Card Preview */}
              <div className={`${
                isMobile 
                  ? 'order-1' 
                  : isTablet 
                    ? 'order-1'
                    : 'col-span-7 order-1'
              }`}>
                <div 
                  ref={containerRef} 
                  className={`${
                    isMobile 
                      ? 'h-[400px]' 
                      : isTablet 
                        ? 'h-[500px]'
                        : 'h-[calc(100vh-500px)] min-h-[500px]'
                  } flex items-center justify-center`}
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                >
                  {renderCardPreview()}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className={`${
                isMobile 
                  ? 'order-2' 
                  : isTablet 
                    ? 'order-2'
                    : 'col-span-5 order-2'
              } ${isMobile ? 'pb-6' : ''}`}>
                <div className={`${isMobile ? 'max-h-[60vh] overflow-y-auto' : ''} space-y-6`}>
                  
                  {/* Crop Interface */}
                  {cropMode && uploadedImage && (
                    <InlineCropInterface
                      imageUrl={uploadedImage}
                      onCropComplete={handleCropComplete}
                      onCancel={handleCropCancel}
                      aspectRatio={2.5 / 3.5}
                    />
                  )}

                  {/* Image Upload Section */}
                  {!cropMode && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                          <Camera className="w-5 h-5 md:w-6 md:h-6" />
                          Image Upload
                        </h2>
                        {uploadedImage && (
                          <Button
                            size="sm"
                            onClick={enterCropMode}
                            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium px-3 py-1 text-xs"
                          >
                            <Scissors className="w-3 h-3 mr-1" />
                            Crop
                          </Button>
                        )}
                      </div>
                      <EnhancedUploadZone
                        onImageUpload={onImageUpload}
                        uploadedImage={uploadedImage}
                      />
                    </div>
                  )}

                  {/* Effects Selection - Hidden in Crop Mode */}
                  {!cropMode && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Choose Visual Effects</h2>
                      <EnhancedFrameBrowser
                        onFrameSelect={onFrameSelect}
                        selectedFrame={selectedFrame}
                        orientation={orientation}
                      />
                    </div>
                  )}
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
