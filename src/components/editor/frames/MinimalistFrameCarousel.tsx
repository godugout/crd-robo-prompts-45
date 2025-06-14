
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (viewMode !== 'carousel') return;
      
      if (event.key === 'ArrowLeft') {
        const newIndex = currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
        goToFrame(newIndex);
      } else if (event.key === 'ArrowRight') {
        const newIndex = (currentIndex + 1) % MINIMALIST_FRAMES.length;
        goToFrame(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, viewMode]);

  useEffect(() => {
    if (!selectedFrame && MINIMALIST_FRAMES.length > 0) {
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  // Desktop layout: two-column with carousel on left, info on right
  if (!isMobile && viewMode === 'carousel') {
    return (
      <div className="w-full max-w-none mx-auto relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] max-h-[90vh]">
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />

        <div className="relative z-10 flex h-full max-h-[80vh]" {...getRootProps()}>
          <input {...getInputProps()} />
          
          {/* Left side: Carousel */}
          <div className="flex-1 flex items-center justify-center px-8 py-8">
            <DesktopFrameCarousel
              frames={MINIMALIST_FRAMES}
              currentIndex={currentIndex}
              uploadedImage={uploadedImage}
              onFrameSelect={goToFrame}
              isDragActive={isDragActive}
            />
          </div>

          {/* Right side: Frame info and controls */}
          <div className="w-96 flex flex-col justify-center px-8 py-12 bg-black/20 backdrop-blur-sm">
            <div className="space-y-8">
              <MinimalistFrameInfo 
                frame={currentFrame}
                className="animate-fade-in"
              />
              
              <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                <FrameUploadPrompt show={!uploadedImage} />
              </div>
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
