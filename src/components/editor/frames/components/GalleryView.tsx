
import React from 'react';
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
  return (
    <div className="relative z-20" {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className="flex gap-8 overflow-x-auto pb-6 px-8 frame-gallery-scroll">
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            className={`flex-shrink-0 cursor-pointer transition-all duration-500 ease-out transform ${
              index === currentIndex 
                ? 'scale-125 ring-2 ring-crd-green shadow-2xl opacity-100' 
                : 'opacity-75 hover:opacity-90 hover:scale-110 hover:shadow-xl'
            }`}
            onClick={() => onFrameSelect(index)}
            style={{ 
              willChange: 'transform, opacity',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              animationDelay: `${index * 50}ms`
            }}
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
  );
};
