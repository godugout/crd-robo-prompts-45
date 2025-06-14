
import React from 'react';
import { MinimalistFrameInfo } from './MinimalistFrameInfo';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface DesktopCarouselSidebarProps {
  currentFrame: MinimalistFrame;
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  onFrameSelect: (index: number) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const DesktopCarouselSidebar: React.FC<DesktopCarouselSidebarProps> = ({
  currentFrame,
  frames,
  currentIndex,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  return (
    <div className="flex-[35] min-w-[320px] max-w-[450px] flex flex-col justify-center py-6">
      {/* Frame Info Section */}
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-4">
        <MinimalistFrameInfo 
          frame={currentFrame}
          className="animate-fade-in"
        />
        
        {/* Frame Navigation Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {frames.map((_, index) => (
            <button
              key={index}
              onClick={() => onFrameSelect(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-crd-green scale-125'
                  : 'bg-white/40 hover:bg-white/60 hover:scale-110'
              }`}
            />
          ))}
        </div>
        
        {/* Keyboard Shortcuts Hint */}
        <div className="text-center mt-3 text-xs text-gray-400">
          Use ← → keys, 1-9 numbers, or mouse wheel
        </div>
      </div>

      {/* Enhanced Upload Section */}
      <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-5">
        {!uploadedImage ? (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-crd-green/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-crd-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-2">Add Your Image</h4>
            <p className="text-gray-400 text-sm mb-3">
              Drag and drop anywhere or click to browse
            </p>
            <div className="text-xs text-gray-500">
              Supports JPG, PNG, GIF up to 10MB
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-700">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-green-400 text-sm mb-2">✓ Image uploaded</p>
            <button 
              onClick={() => onImageUpload('')}
              className="text-gray-400 text-xs hover:text-white transition-colors"
            >
              Change image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
