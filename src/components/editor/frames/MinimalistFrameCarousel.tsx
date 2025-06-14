
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
    }, 150);
  };

  const prevFrame = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newIndex = currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
      setIsTransitioning(false);
    }, 150);
  };

  const goToFrame = (index: number) => {
    if (index === currentIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      onFrameSelect(MINIMALIST_FRAMES[index].id);
      setIsTransitioning(false);
    }, 150);
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
  const prevFrameData = MINIMALIST_FRAMES[currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1];
  const nextFrameData = MINIMALIST_FRAMES[(currentIndex + 1) % MINIMALIST_FRAMES.length];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex gap-1 animate-fade-in">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 transform ${
              viewMode === 'carousel' 
                ? 'bg-crd-green text-black scale-105 shadow-lg' 
                : 'text-gray-400 hover:text-white hover:scale-102'
            }`}
          >
            Carousel View
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
          {/* Enhanced Carousel Container */}
          <div className="relative overflow-hidden" {...getRootProps()}>
            <input {...getInputProps()} />
            
            {/* Subtle Edge Navigation */}
            <button
              onClick={prevFrame}
              className="fixed left-2 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/10 hover:bg-black/30 rounded-full transition-all duration-300 opacity-40 hover:opacity-100 backdrop-blur-sm border border-white/10 hover:scale-110"
              style={{ willChange: 'transform, opacity' }}
            >
              <ChevronLeft className="w-5 h-5 text-white drop-shadow-lg" />
            </button>
            
            <button
              onClick={nextFrame}
              className="fixed right-2 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/10 hover:bg-black/30 rounded-full transition-all duration-300 opacity-40 hover:opacity-100 backdrop-blur-sm border border-white/10 hover:scale-110"
              style={{ willChange: 'transform, opacity' }}
            >
              <ChevronRight className="w-5 h-5 text-white drop-shadow-lg" />
            </button>

            {/* Enhanced Frame Display with Fluid Animations */}
            <div className="flex items-center justify-center mb-8 px-8 py-6">
              {/* Previous Frame Preview - Enhanced */}
              <div 
                className={`hidden lg:block cursor-pointer transition-all duration-500 ease-out transform hover:scale-[0.98] ${
                  isTransitioning ? 'opacity-50 scale-90' : 'opacity-75 scale-95'
                } hover:opacity-90 -translate-x-8 hover:-translate-x-6`}
                onClick={prevFrame}
                style={{ 
                  willChange: 'transform, opacity',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="relative">
                  <FramePreview 
                    frame={prevFrameData}
                    imageUrl={uploadedImage}
                    size="small"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
                </div>
              </div>

              {/* Current Frame - Hero Element */}
              <div className={`mx-16 transform transition-all duration-500 ease-out ${
                isTransitioning ? 'scale-105 opacity-90' : 'scale-110 opacity-100'
              } z-10 relative`}
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
                  {/* Subtle glow effect for selected frame */}
                  <div className="absolute inset-0 bg-crd-green/5 rounded-lg animate-pulse opacity-50 pointer-events-none" />
                </div>
              </div>

              {/* Next Frame Preview - Enhanced */}
              <div 
                className={`hidden lg:block cursor-pointer transition-all duration-500 ease-out transform hover:scale-[0.98] ${
                  isTransitioning ? 'opacity-50 scale-90' : 'opacity-75 scale-95'
                } hover:opacity-90 translate-x-8 hover:translate-x-6`}
                onClick={nextFrame}
                style={{ 
                  willChange: 'transform, opacity',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="relative">
                  <FramePreview 
                    frame={nextFrameData}
                    imageUrl={uploadedImage}
                    size="small"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Frame Info with Animation */}
          <div className="animate-fade-in">
            <FrameInfo frame={currentFrame} />
          </div>

          {/* Enhanced Dot Indicators */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
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
          <div className="relative" {...getRootProps()}>
            <input {...getInputProps()} />
            
            <div className="flex gap-6 overflow-x-auto pb-6 px-4 frame-gallery-scroll">
              {MINIMALIST_FRAMES.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-500 ease-out transform ${
                    index === currentIndex 
                      ? 'scale-110 ring-2 ring-crd-green shadow-2xl opacity-100' 
                      : 'opacity-75 hover:opacity-90 hover:scale-105 hover:shadow-lg'
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
          <div className="mt-8 animate-fade-in">
            <FrameInfo frame={currentFrame} />
          </div>
        </>
      )}

      {/* Enhanced Upload Prompt */}
      <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <FrameUploadPrompt show={!uploadedImage} />
      </div>
    </div>
  );
};
