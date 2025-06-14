
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { ViewModeToggle } from './components/ViewModeToggle';
import { iPhoneStyleCarousel } from './components/iPhoneStyleCarousel';
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

  return (
    <div className="w-full max-w-none mx-auto relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      <div className="relative z-10" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {viewMode === 'carousel' ? (
          <>
            {/* iPhone-style carousel */}
            <div className="flex items-center justify-center min-h-[70vh] px-4">
              <iPhoneStyleCarousel
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
