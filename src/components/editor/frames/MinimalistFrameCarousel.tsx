
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { ViewModeToggle } from './components/ViewModeToggle';
import { BackdropFrameGrid } from './components/BackdropFrameGrid';
import { HeroFrameDisplay } from './components/HeroFrameDisplay';
import { NavigationControls } from './components/NavigationControls';
import { GalleryView } from './components/GalleryView';
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
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {viewMode === 'carousel' ? (
        <>
          <BackdropFrameGrid
            frames={MINIMALIST_FRAMES}
            currentIndex={currentIndex}
            uploadedImage={uploadedImage}
            onFrameSelect={goToFrame}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />

          <NavigationControls
            onPrevious={prevFrame}
            onNext={nextFrame}
          />

          <HeroFrameDisplay
            frame={currentFrame}
            uploadedImage={uploadedImage}
            isDragActive={isDragActive}
            isTransitioning={isTransitioning}
          />

          <div className="relative z-20 animate-fade-in">
            <FrameInfo frame={currentFrame} />
          </div>

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
          <GalleryView
            frames={MINIMALIST_FRAMES}
            currentIndex={currentIndex}
            uploadedImage={uploadedImage}
            isDragActive={isDragActive}
            onFrameSelect={goToFrame}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />

          <div className="relative z-20 mt-8 animate-fade-in">
            <FrameInfo frame={currentFrame} />
          </div>
        </>
      )}

      <div className="relative z-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <FrameUploadPrompt show={!uploadedImage} />
      </div>
    </div>
  );
};
