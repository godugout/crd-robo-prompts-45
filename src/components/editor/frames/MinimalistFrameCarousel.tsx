
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { FramePreview } from './components/FramePreview';
import { FrameInfo } from './components/FrameInfo';
import { FrameUploadPrompt } from './components/FrameUploadPrompt';
import { DotIndicators } from './components/DotIndicators';
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
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const nextFrame = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % MINIMALIST_FRAMES.length;
      setCurrentIndex(newIndex);
      onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
      setIsTransitioning(false);
    }, 200);
  };

  const prevFrame = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newIndex = currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
      setIsTransitioning(false);
    }, 200);
  };

  const goToFrame = (index: number) => {
    if (index === currentIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      onFrameSelect(MINIMALIST_FRAMES[index].id);
      setIsTransitioning(false);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevFrame();
      } else if (event.key === 'ArrowRight') {
        nextFrame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    if (!selectedFrame && MINIMALIST_FRAMES.length > 0) {
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  return (
    <div className="w-full max-w-none mx-auto relative min-h-screen">
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8 relative z-30">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-1 flex gap-1 animate-fade-in shadow-2xl">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 transform ${
              viewMode === 'carousel' 
                ? 'bg-crd-green text-black scale-105 shadow-lg' 
                : 'text-gray-400 hover:text-white hover:scale-102'
            }`}
          >
            Showcase View
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 transform ${
              viewMode === 'gallery' 
                ? 'bg-crd-green text-black scale-105 shadow-lg' 
                : 'text-gray-400 hover:text-white hover:scale-102'
            }`}
          >
            Gallery View
          </button>
        </div>
      </div>

      {viewMode === 'carousel' ? (
        <>
          {/* Full-Page Frame Backdrop */}
          <div className="fixed inset-0 z-10 overflow-hidden" {...getRootProps()}>
            <input {...getInputProps()} />
            
            {/* Background Frames Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-6 gap-8 w-full max-w-7xl px-8">
                {MINIMALIST_FRAMES.map((frame, index) => (
                  <div
                    key={frame.id}
                    className={`backdrop-frame-item cursor-pointer transition-all duration-700 ease-out transform ${
                      index === currentIndex 
                        ? 'backdrop-frame-selected opacity-0 pointer-events-none' 
                        : 'backdrop-frame-background opacity-40 hover:opacity-60 hover:scale-110'
                    }`}
                    onClick={() => goToFrame(index)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      willChange: 'transform, opacity'
                    }}
                  >
                    <FramePreview 
                      frame={frame}
                      imageUrl={uploadedImage}
                      size="small"
                      isDragActive={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle Navigation Controls */}
            <button
              onClick={prevFrame}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/20 hover:bg-black/40 rounded-full transition-all duration-300 opacity-50 hover:opacity-100 backdrop-blur-sm border border-white/10 hover:scale-110 group"
              style={{ willChange: 'transform, opacity' }}
            >
              <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={nextFrame}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/20 hover:bg-black/40 rounded-full transition-all duration-300 opacity-50 hover:opacity-100 backdrop-blur-sm border border-white/10 hover:scale-110 group"
              style={{ willChange: 'transform, opacity' }}
            >
              <ChevronRight className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Hero Frame in Focus */}
          <div className="relative z-20 flex items-center justify-center min-h-[60vh] px-8 py-12">
            <div className={`hero-frame-container transform transition-all duration-500 ease-out ${
              isTransitioning ? 'scale-95 opacity-80' : 'scale-125 opacity-100'
            }`}
            style={{ 
              willChange: 'transform, opacity',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <div className="relative">
                <FramePreview 
                  frame={currentFrame}
                  imageUrl={uploadedImage}
                  size="large"
                  isDragActive={isDragActive}
                />
                {/* Hero glow effect */}
                <div className="absolute inset-0 bg-crd-green/10 rounded-lg animate-pulse opacity-70 pointer-events-none shadow-2xl" />
                <div className="absolute inset-0 shadow-2xl shadow-crd-green/20 rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Enhanced Frame Info */}
          <div className="relative z-20 animate-fade-in">
            <FrameInfo frame={currentFrame} />
          </div>

          {/* Enhanced Dot Indicators */}
          <div className="relative z-20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <DotIndicators 
              totalFrames={MINIMALIST_FRAMES.length}
              currentIndex={currentIndex}
              onDotClick={goToFrame}
            />
          </div>
        </>
      ) : (
        <>
          {/* Enhanced Gallery View */}
          <div className="relative z-20" {...getRootProps()}>
            <input {...getInputProps()} />
            
            <div className="flex gap-8 overflow-x-auto pb-6 px-8 frame-gallery-scroll">
              {MINIMALIST_FRAMES.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-500 ease-out transform ${
                    index === currentIndex 
                      ? 'scale-125 ring-2 ring-crd-green shadow-2xl opacity-100' 
                      : 'opacity-75 hover:opacity-90 hover:scale-110 hover:shadow-xl'
                  }`}
                  onClick={() => goToFrame(index)}
                  style={{ 
                    willChange: 'transform, opacity',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <FramePreview 
                    frame={frame}
                    imageUrl={uploadedImage}
                    size="small"
                    isDragActive={isDragActive && index === currentIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Frame Info for Gallery */}
          <div className="relative z-20 mt-8 animate-fade-in">
            <FrameInfo frame={currentFrame} />
          </div>
        </>
      )}

      {/* Enhanced Upload Prompt */}
      <div className="relative z-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <FrameUploadPrompt show={!uploadedImage} />
      </div>
    </div>
  );
};
