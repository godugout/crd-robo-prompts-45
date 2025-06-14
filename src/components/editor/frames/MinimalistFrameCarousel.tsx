
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { useCarouselKeyboardNavigation } from './hooks/useCarouselKeyboardNavigation';
import { ViewModeToggle } from './components/ViewModeToggle';
import { DesktopCarouselContainer } from './components/DesktopCarouselContainer';
import { MobileCarouselContainer } from './components/MobileCarouselContainer';
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
  const { responsivePadding, isDesktop } = useResponsiveBreakpoints();

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

  // Use keyboard navigation hook
  useCarouselKeyboardNavigation({
    currentIndex,
    totalFrames: MINIMALIST_FRAMES.length,
    viewMode,
    isMobile,
    onFrameSelect: goToFrame
  });

  useEffect(() => {
    if (!selectedFrame && MINIMALIST_FRAMES.length > 0) {
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  // Desktop carousel view
  if (isDesktop && viewMode === 'carousel') {
    return (
      <>
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
        <DesktopCarouselContainer
          frames={MINIMALIST_FRAMES}
          currentIndex={currentIndex}
          currentFrame={currentFrame}
          uploadedImage={uploadedImage}
          isDragActive={isDragActive}
          responsivePadding={responsivePadding}
          onFrameSelect={goToFrame}
          onImageUpload={onImageUpload}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      </>
    );
  }

  // Mobile layout or gallery view
  return (
    <div className="w-full max-w-none mx-auto relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] max-h-screen">
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {viewMode === 'carousel' ? (
        <MobileCarouselContainer
          frames={MINIMALIST_FRAMES}
          currentIndex={currentIndex}
          currentFrame={currentFrame}
          uploadedImage={uploadedImage}
          isDragActive={isDragActive}
          onFrameSelect={goToFrame}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      ) : (
        <div className="relative z-10 h-full" {...getRootProps()}>
          <input {...getInputProps()} />
          
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

          <div className="relative z-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <FrameUploadPrompt show={!uploadedImage} />
          </div>
        </div>
      )}
    </div>
  );
};
