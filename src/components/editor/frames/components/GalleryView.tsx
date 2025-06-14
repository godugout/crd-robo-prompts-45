
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface GalleryViewProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  isDragActive,
  onFrameSelect,
  getRootProps,
  getInputProps
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative z-10 p-4 lg:p-6" {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Clean Grid Layout */}
      <div className={`
        grid gap-4 lg:gap-6
        ${isMobile 
          ? 'grid-cols-2' 
          : 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        }
      `}>
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            className={`
              relative cursor-pointer transition-all duration-300 ease-out
              ${index === currentIndex 
                ? 'ring-2 ring-crd-green ring-offset-2 ring-offset-gray-800 scale-105 z-10' 
                : 'hover:scale-102 hover:ring-1 hover:ring-gray-500 hover:ring-offset-1 hover:ring-offset-gray-800'
              }
              rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm
            `}
            onClick={() => onFrameSelect(index)}
          >
            {/* Frame Preview Container - Fixed aspect ratio 2.5:3.5 (5:7) */}
            <div className="aspect-[5/7] w-full">
              <FramePreview 
                frame={frame}
                imageUrl={uploadedImage}
                size="medium"
                isDragActive={isDragActive && index === currentIndex}
              />
            </div>
            
            {/* Frame Info */}
            <div className="p-3 bg-gray-900/90 backdrop-blur-sm">
              <h3 className="text-white text-sm font-medium truncate mb-1">
                {frame.name}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {frame.description}
              </p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-crd-green/20 text-crd-green text-xs rounded-full">
                  {frame.category}
                </span>
              </div>
            </div>

            {/* Selected Indicator */}
            {index === currentIndex && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
            )}

            {/* Drag Active Overlay */}
            {isDragActive && index === currentIndex && (
              <div className="absolute inset-0 bg-crd-green/20 border-2 border-dashed border-crd-green rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-crd-green/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-crd-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-crd-green font-medium text-xs">Drop here</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Prompt */}
      {!uploadedImage && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-gray-300 text-sm">Drop your image anywhere to get started</span>
          </div>
        </div>
      )}
    </div>
  );
};
