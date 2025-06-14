
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
    <div className="relative z-20" {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className={`
        ${isMobile 
          ? 'flex gap-8 overflow-x-auto pb-6 px-8 frame-gallery-scroll' 
          : 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-8 py-12'
        }
      `}>
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            className={`
              ${isMobile ? 'flex-shrink-0' : ''}
              cursor-pointer transition-all duration-500 ease-out transform 
              ${index === currentIndex 
                ? `${isMobile ? 'scale-125' : 'scale-110'} ring-2 ring-crd-green shadow-2xl opacity-100` 
                : 'opacity-75 hover:opacity-90 hover:scale-105 hover:shadow-xl'
              }
            `}
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
              size={isMobile ? "small" : "large"}
              isDragActive={isDragActive && index === currentIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
