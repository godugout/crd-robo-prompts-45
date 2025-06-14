
import React from 'react';
import { IPhoneStyleCarousel } from './IPhoneStyleCarousel';
import { MinimalistFrameInfo } from './MinimalistFrameInfo';
import { FrameUploadPrompt } from './FrameUploadPrompt';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface MobileCarouselContainerProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  currentFrame: MinimalistFrame;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const MobileCarouselContainer: React.FC<MobileCarouselContainerProps> = ({
  frames,
  currentIndex,
  currentFrame,
  uploadedImage,
  isDragActive,
  onFrameSelect,
  getRootProps,
  getInputProps
}) => {
  return (
    <div className="relative z-10 h-full" {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* iPhone-style carousel for mobile */}
      <div className="flex items-center justify-center h-[50vh] max-h-[500px] px-4">
        <IPhoneStyleCarousel
          frames={frames}
          currentIndex={currentIndex}
          uploadedImage={uploadedImage}
          onFrameSelect={onFrameSelect}
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

      <div className="relative z-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <FrameUploadPrompt show={!uploadedImage} />
      </div>
    </div>
  );
};
