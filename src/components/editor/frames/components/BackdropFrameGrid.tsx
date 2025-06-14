
import React from 'react';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface BackdropFrameGridProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  onFrameSelect: (index: number) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const BackdropFrameGrid: React.FC<BackdropFrameGridProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  onFrameSelect,
  getRootProps,
  getInputProps
}) => {
  return (
    <div className="fixed inset-0 z-10 overflow-hidden" {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-8 w-full max-w-7xl px-8">
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              className={`backdrop-frame-item cursor-pointer transition-all duration-700 ease-out transform ${
                index === currentIndex 
                  ? 'backdrop-frame-selected opacity-0 pointer-events-none' 
                  : 'backdrop-frame-background opacity-40 hover:opacity-60 hover:scale-110'
              }`}
              onClick={() => onFrameSelect(index)}
              style={{
                animationDelay: `${index * 100}ms`,
                willChange: 'transform, opacity'
              }}
            >
              <FramePreview 
                frame={frame}
                imageUrl={uploadedImage}
                size="small"
                isDragActive={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
