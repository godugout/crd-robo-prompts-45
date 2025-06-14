
import React from 'react';
import { DesktopFrameCarousel } from './DesktopFrameCarousel';
import { DesktopCarouselSidebar } from './DesktopCarouselSidebar';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface DesktopCarouselContainerProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  currentFrame: MinimalistFrame;
  uploadedImage?: string;
  isDragActive: boolean;
  responsivePadding: string;
  onFrameSelect: (index: number) => void;
  onImageUpload: (imageUrl: string) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const DesktopCarouselContainer: React.FC<DesktopCarouselContainerProps> = ({
  frames,
  currentIndex,
  currentFrame,
  uploadedImage,
  isDragActive,
  responsivePadding,
  onFrameSelect,
  onImageUpload,
  getRootProps,
  getInputProps
}) => {
  return (
    <div className={`w-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] max-h-[85vh] ${responsivePadding}`}>
      <div className="relative z-10 flex h-full max-h-[75vh] gap-6 lg:gap-8 xl:gap-12" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* Carousel Section - 65% of width */}
        <div 
          className="flex-[65] flex items-center justify-center py-6 min-w-0"
          data-carousel-area
        >
          <DesktopFrameCarousel
            frames={frames}
            currentIndex={currentIndex}
            uploadedImage={uploadedImage}
            onFrameSelect={onFrameSelect}
            isDragActive={isDragActive}
          />
        </div>

        {/* Sidebar - 35% of width */}
        <DesktopCarouselSidebar
          currentFrame={currentFrame}
          frames={frames}
          currentIndex={currentIndex}
          uploadedImage={uploadedImage}
          onFrameSelect={onFrameSelect}
          onImageUpload={onImageUpload}
        />
      </div>
    </div>
  );
};
