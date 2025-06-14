
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
    <div className="w-full max-w-6xl mx-auto">
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'carousel' ? 'bg-crd-green text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Carousel View
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'gallery' ? 'bg-crd-green text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Gallery View
          </button>
        </div>
      </div>

      {viewMode === 'carousel' ? (
        <>
          {/* Carousel Container with Edge Navigation */}
          <div className="relative" {...getRootProps()}>
            <input {...getInputProps()} />
            
            {/* Subtle Edge Navigation */}
            <button
              onClick={prevFrame}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-all opacity-60 hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={nextFrame}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-all opacity-60 hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Main Frame Display */}
            <div className="flex items-center justify-center mb-8 px-8">
              {/* Previous Frame Preview */}
              <div 
                className="hidden lg:block opacity-60 scale-90 transform -translate-x-6 cursor-pointer hover:opacity-80 transition-all duration-300"
                onClick={prevFrame}
              >
                <FramePreview 
                  frame={MINIMALIST_FRAMES[currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1]}
                  imageUrl={uploadedImage}
                  size="small"
                />
              </div>

              {/* Current Frame */}
              <div className="mx-12 transform scale-110 z-10">
                <FramePreview 
                  frame={currentFrame}
                  imageUrl={uploadedImage}
                  size="large"
                  isDragActive={isDragActive}
                />
              </div>

              {/* Next Frame Preview */}
              <div 
                className="hidden lg:block opacity-60 scale-90 transform translate-x-6 cursor-pointer hover:opacity-80 transition-all duration-300"
                onClick={nextFrame}
              >
                <FramePreview 
                  frame={MINIMALIST_FRAMES[(currentIndex + 1) % MINIMALIST_FRAMES.length]}
                  imageUrl={uploadedImage}
                  size="small"
                />
              </div>
            </div>
          </div>

          {/* Frame Info */}
          <FrameInfo frame={currentFrame} />

          {/* Dot Indicators */}
          <DotIndicators 
            totalFrames={MINIMALIST_FRAMES.length}
            currentIndex={currentIndex}
            onDotClick={goToFrame}
          />
        </>
      ) : (
        <>
          {/* Gallery View - All Frames Horizontal */}
          <div className="relative" {...getRootProps()}>
            <input {...getInputProps()} />
            
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
              {MINIMALIST_FRAMES.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                    index === currentIndex 
                      ? 'scale-110 ring-2 ring-crd-green' 
                      : 'opacity-70 hover:opacity-90 hover:scale-105'
                  }`}
                  onClick={() => goToFrame(index)}
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
          <div className="mt-6">
            <FrameInfo frame={currentFrame} />
          </div>
        </>
      )}

      {/* Upload Prompt */}
      <FrameUploadPrompt show={!uploadedImage} />
    </div>
  );
};
