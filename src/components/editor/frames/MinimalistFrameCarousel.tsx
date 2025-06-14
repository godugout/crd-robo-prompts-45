
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { FramePreview } from './components/FramePreview';
import { FrameCarouselControls } from './components/FrameCarouselControls';
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
    const newIndex = (currentIndex + 1) % MINIMALIST_FRAMES.length;
    setCurrentIndex(newIndex);
    onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
  };

  const prevFrame = () => {
    const newIndex = currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
  };

  const goToFrame = (index: number) => {
    setCurrentIndex(index);
    onFrameSelect(MINIMALIST_FRAMES[index].id);
  };

  useEffect(() => {
    if (!selectedFrame && MINIMALIST_FRAMES.length > 0) {
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div className="relative" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* Main Frame Display */}
        <div className="flex items-center justify-center mb-8">
          {/* Previous Frame Preview */}
          <div 
            className="hidden md:block opacity-30 scale-75 transform -translate-x-4 cursor-pointer hover:opacity-50 transition-all"
            onClick={prevFrame}
          >
            <FramePreview 
              frame={MINIMALIST_FRAMES[currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1]}
              imageUrl={uploadedImage}
              size="small"
            />
          </div>

          {/* Current Frame */}
          <div className="mx-8 transform scale-110 z-10">
            <FramePreview 
              frame={currentFrame}
              imageUrl={uploadedImage}
              size="large"
              isDragActive={isDragActive}
            />
          </div>

          {/* Next Frame Preview */}
          <div 
            className="hidden md:block opacity-30 scale-75 transform translate-x-4 cursor-pointer hover:opacity-50 transition-all"
            onClick={nextFrame}
          >
            <FramePreview 
              frame={MINIMALIST_FRAMES[(currentIndex + 1) % MINIMALIST_FRAMES.length]}
              imageUrl={uploadedImage}
              size="small"
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <FrameCarouselControls onPrevious={prevFrame} onNext={nextFrame} />
      </div>

      {/* Frame Info */}
      <FrameInfo frame={currentFrame} />

      {/* Dot Indicators */}
      <DotIndicators 
        totalFrames={MINIMALIST_FRAMES.length}
        currentIndex={currentIndex}
        onDotClick={goToFrame}
      />

      {/* Upload Prompt */}
      <FrameUploadPrompt show={!uploadedImage} />
    </div>
  );
};
