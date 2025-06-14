
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface LargeCardPreviewProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const LargeCardPreview: React.FC<LargeCardPreviewProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  isDragActive,
  onFrameSelect,
  getRootProps,
  getInputProps
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePrevFrame = () => {
    const newIndex = currentIndex === 0 ? frames.length - 1 : currentIndex - 1;
    onFrameSelect(newIndex);
  };

  const handleNextFrame = () => {
    const newIndex = (currentIndex + 1) % frames.length;
    onFrameSelect(newIndex);
  };

  const currentFrame = frames[currentIndex];

  return (
    <div 
      className="relative flex items-center justify-center w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      {/* Large Frame Preview */}
      <div className="relative">
        <FramePreview
          frame={currentFrame}
          imageUrl={uploadedImage}
          size="large"
          isDragActive={isDragActive}
        />
        
        {/* Drag overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-crd-green/20 border-2 border-dashed border-crd-green rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crd-green/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-crd-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-crd-green font-medium text-lg">Drop your image here</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {isHovered && (
        <>
          <button
            onClick={handlePrevFrame}
            className="absolute left-4 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNextFrame}
            className="absolute right-4 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-3">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {frames.length}
        </span>
        <div className="w-px h-4 bg-white/30"></div>
        {Array.from({ length: Math.min(5, frames.length) }).map((_, index) => (
          <button
            key={index}
            onClick={() => onFrameSelect(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentIndex
                ? 'bg-crd-green scale-125 shadow-lg shadow-crd-green/30'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
        {frames.length > 5 && (
          <span className="text-white/60 text-xs">...</span>
        )}
      </div>
    </div>
  );
};
