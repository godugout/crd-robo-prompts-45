
import React, { useState, useEffect, useMemo } from 'react';
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
import { InteractiveFrameBrowser } from './components/InteractiveFrameBrowser';
import { FramePreview } from './components/FramePreview';
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

  console.log('MinimalistFrameCarousel rendering:', {
    selectedFrame,
    uploadedImage,
    currentIndex,
    viewMode,
    isMobile,
    isDesktop,
    framesCount: MINIMALIST_FRAMES.length
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
      toast.success('Image uploaded!');
    },
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true
  });

  const goToFrame = (index: number) => {
    if (index === currentIndex) return;
    console.log('Switching to frame index:', index, 'frame:', MINIMALIST_FRAMES[index]);
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
      console.log('Auto-selecting first frame:', MINIMALIST_FRAMES[0]);
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  // Convert frames to format expected by InteractiveFrameBrowser
  const browserFrames = useMemo(() => MINIMALIST_FRAMES.map(frame => ({
    id: frame.id,
    name: frame.name,
    category: frame.category,
    premium: false,
    preview: `linear-gradient(135deg, ${frame.accentColor.replace('bg-', '')} 0%, ${frame.backgroundColor.replace('bg-', '')} 100%)`,
    description: frame.description
  })), []);

  const handleFrameSelectById = (frameId: string) => {
    const frameIndex = MINIMALIST_FRAMES.findIndex(f => f.id === frameId);
    if (frameIndex >= 0) {
      goToFrame(frameIndex);
    }
  };

  // Professional showcase layout for desktop - THIS IS THE ENHANCED LAYOUT
  if (isDesktop && viewMode === 'showcase') {
    console.log('Rendering ProfessionalShowcaseView (Enhanced Layout)');
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

  // Enhanced desktop layout with larger card preview and improved frame browser
  if (isDesktop && viewMode === 'carousel') {
    console.log('Rendering Enhanced Desktop Layout with InteractiveFrameBrowser');
    return (
      <div className="w-full h-full">
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
        <div className="flex h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Left side - Expanded main preview (now takes more space) */}
          <div className="flex-1 flex items-center justify-center p-6" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="w-full max-w-lg aspect-[3/4] max-h-[80vh]">
              <FramePreview
                frame={currentFrame}
                imageUrl={uploadedImage}
                size="large"
                isDragActive={isDragActive}
                onImageUpdate={onImageUpload}
              />
            </div>
          </div>
          
          {/* Right side - Enhanced frame browser with better layout */}
          <div className="w-96 bg-black/20 backdrop-blur-sm border-l border-white/10 overflow-y-auto">
            <InteractiveFrameBrowser
              frames={browserFrames}
              selectedFrame={selectedFrame || ''}
              onFrameSelect={handleFrameSelectById}
            />
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout or gallery view
  console.log('Rendering Mobile/Gallery Layout');
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
