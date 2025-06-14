
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { ViewModeToggle } from './components/ViewModeToggle';
import { IPhoneStyleCarousel } from './components/IPhoneStyleCarousel';
import { DesktopFrameCarousel } from './components/DesktopFrameCarousel';
import { GalleryView } from './components/GalleryView';
import { MinimalistFrameInfo } from './components/MinimalistFrameInfo';
import { FrameUploadPrompt } from './components/FrameUploadPrompt';
import { MINIMALIST_FRAMES, type MinimalistFrame } from './data/minimalistFrames';

interface FrameCarouselProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const MinimalistFrameCarousel: React.FC<FrameCarouselProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'gallery'>('carousel');
  const isMobile = useIsMobile();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    onImageUpload(imageUrl);
    toast.success('Image uploaded!');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true
  });

  const goToFrame = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    onFrameSelect(MINIMALIST_FRAMES[index].id);
  };

  // Enhanced keyboard navigation with number keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode !== 'carousel') return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const newIndex = currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
        goToFrame(newIndex);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const newIndex = (currentIndex + 1) % MINIMALIST_FRAMES.length;
        goToFrame(newIndex);
      } else if (event.key >= '1' && event.key <= '9') {
        const frameIndex = parseInt(event.key) - 1;
        if (frameIndex < MINIMALIST_FRAMES.length) {
          goToFrame(frameIndex);
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (viewMode !== 'carousel' || isMobile) return;
      
      // Only handle wheel events when over the carousel
      const target = event.target as Element;
      if (!target.closest('[data-carousel-area]')) return;
      
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      const newIndex = direction > 0 
        ? (currentIndex + 1) % MINIMALIST_FRAMES.length
        : currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
      goToFrame(newIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex, viewMode, isMobile]);

  useEffect(() => {
    if (!selectedFrame && MINIMALIST_FRAMES.length > 0) {
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  // Enhanced desktop layout: full-width with smart responsive padding
  if (!isMobile && viewMode === 'carousel') {
    return (
      <div className="w-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] max-h-[85vh] px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />

        <div className="relative z-10 flex h-full max-h-[75vh] gap-8 lg:gap-12" {...getRootProps()}>
          <input {...getInputProps()} />
          
          {/* Enhanced Carousel Section - 65% of width */}
          <div 
            className="flex-[65] flex items-center justify-center py-8 min-w-0"
            data-carousel-area
          >
            <DesktopFrameCarousel
              frames={MINIMALIST_FRAMES}
              currentIndex={currentIndex}
              uploadedImage={uploadedImage}
              onFrameSelect={goToFrame}
              isDragActive={isDragActive}
            />
          </div>

          {/* Enhanced Sidebar - 35% of width */}
          <div className="flex-[35] min-w-[320px] max-w-[500px] flex flex-col justify-center py-8">
            {/* Frame Info Section */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <MinimalistFrameInfo 
                frame={currentFrame}
                className="animate-fade-in"
              />
              
              {/* Frame Navigation Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {MINIMALIST_FRAMES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFrame(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-crd-green scale-125'
                        : 'bg-white/40 hover:bg-white/60 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
              
              {/* Keyboard Shortcuts Hint */}
              <div className="text-center mt-4 text-xs text-gray-400">
                Use ← → keys, 1-9 numbers, or mouse wheel
              </div>
            </div>

            {/* Enhanced Upload Section */}
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6">
              {!uploadedImage ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crd-green/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-crd-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium mb-2">Add Your Image</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Drag and drop anywhere or click to browse
                  </p>
                  <div className="text-xs text-gray-500">
                    Supports JPG, PNG, GIF up to 10MB
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-700">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-green-400 text-sm mb-2">✓ Image uploaded</p>
                  <button 
                    onClick={() => onImageUpload('')}
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                  >
                    Change image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout or gallery view - keep existing behavior
  return (
    <div className="w-full max-w-none mx-auto relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] max-h-screen">
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      <div className="relative z-10 h-full" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {viewMode === 'carousel' ? (
          <>
            {/* iPhone-style carousel for mobile */}
            <div className="flex items-center justify-center h-[50vh] max-h-[500px] px-4">
              <IPhoneStyleCarousel
                frames={MINIMALIST_FRAMES}
                currentIndex={currentIndex}
                uploadedImage={uploadedImage}
                onFrameSelect={goToFrame}
                isDragActive={isDragActive}
              />
            </div>

            {/* Frame info below carousel */}
            <div className="relative z-20 px-8 pb-8">
              <MinimalistFrameInfo 
                frame={currentFrame}
                className="animate-fade-in"
              />
            </div>
          </>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-y-auto">
              <GalleryView
                frames={MINIMALIST_FRAMES}
                currentIndex={currentIndex}
                uploadedImage={uploadedImage}
                isDragActive={isDragActive}
                onFrameSelect={goToFrame}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
              />
            </div>

            <div className="relative z-20 mt-8 animate-fade-in">
              <MinimalistFrameInfo frame={currentFrame} />
            </div>
          </>
        )}

        <div className="relative z-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <FrameUploadPrompt show={!uploadedImage} />
        </div>
      </div>
    </div>
  );
};
