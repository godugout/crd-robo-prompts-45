
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { useCarouselKeyboardNavigation } from './hooks/useCarouselKeyboardNavigation';
import { ViewModeToggle } from './components/ViewModeToggle';
import { EnhancedDesktopLayout } from './components/EnhancedDesktopLayout';
import { ProfessionalShowcaseView } from './components/ProfessionalShowcaseView';
import { MobileCarouselContainer } from './components/MobileCarouselContainer';
import { GalleryView } from './components/GalleryView';
import { MinimalistFrameInfo } from './components/MinimalistFrameInfo';
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
  const [viewMode, setViewMode] = useState<'carousel' | 'gallery' | 'showcase'>('showcase');
  const isMobile = useIsMobile();
  const { isDesktop } = useResponsiveBreakpoints();

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

  // Professional showcase layout for desktop
  if (isDesktop && viewMode === 'showcase') {
    return (
      <div className="w-full h-full">
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
        <ProfessionalShowcaseView
          frames={MINIMALIST_FRAMES}
          currentIndex={currentIndex}
          uploadedImage={uploadedImage}
          isDragActive={isDragActive}
          onFrameSelect={goToFrame}
          onImageUpload={onImageUpload}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      </div>
    );
  }

  // Enhanced desktop layout
  if (isDesktop && viewMode === 'carousel') {
    return (
      <div className="w-full h-full">
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
        <EnhancedDesktopLayout
          frames={MINIMALIST_FRAMES}
          currentIndex={currentIndex}
          currentFrame={currentFrame}
          uploadedImage={uploadedImage}
          isDragActive={isDragActive}
          onFrameSelect={goToFrame}
          onImageUpload={onImageUpload}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      </div>
    );
  }

  // Mobile layout or gallery view
  return (
    <div className="w-full max-w-none mx-auto relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px]">
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
        <div className="relative z-10 h-full overflow-y-auto" {...getRootProps()}>
          <input {...getInputProps()} />
          
          <GalleryView
            frames={MINIMALIST_FRAMES}
            currentIndex={currentIndex}
            uploadedImage={uploadedImage}
            isDragActive={isDragActive}
            onFrameSelect={goToFrame}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />

          <div className="relative z-20 mt-8 px-4 lg:px-6">
            <MinimalistFrameInfo frame={currentFrame} />
          </div>
        </div>
      )}
    </div>
  );
};
