
import React from 'react';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface FrameSelectionPanelProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  currentFrame: MinimalistFrame;
  uploadedImage?: string;
  onFrameSelect: (index: number) => void;
}

export const FrameSelectionPanel: React.FC<FrameSelectionPanelProps> = ({
  frames,
  currentIndex,
  currentFrame,
  uploadedImage,
  onFrameSelect
}) => {
  return (
    <div className="h-full bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg mb-2">Frame Styles</h3>
        <p className="text-gray-400 text-sm">Choose your card frame</p>
      </div>

      {/* Current Frame Info */}
      <div className="mb-4 p-3 bg-black/30 rounded-lg">
        <h4 className="text-crd-green font-medium text-sm mb-1">{currentFrame.name}</h4>
        <p className="text-gray-400 text-xs">{currentFrame.description}</p>
        <div className="mt-2">
          <span className="text-xs px-2 py-1 bg-crd-green/20 text-crd-green rounded-full">
            {currentFrame.category}
          </span>
        </div>
      </div>

      {/* Frame Thumbnails */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            className={`cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${
              index === currentIndex
                ? 'ring-2 ring-crd-green shadow-lg scale-105'
                : 'hover:scale-102 hover:shadow-md'
            }`}
            onClick={() => onFrameSelect(index)}
          >
            <div className="relative">
              <FramePreview
                frame={frame}
                imageUrl={uploadedImage}
                size="small"
              />
              {index === currentIndex && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
              )}
            </div>
            <div className="p-2 bg-black/40">
              <p className="text-white text-xs font-medium truncate">{frame.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Frame Elements Info */}
      <div className="mt-4 p-3 bg-black/30 rounded-lg">
        <h5 className="text-white text-sm font-medium mb-2">Available Elements</h5>
        <div className="space-y-1 text-xs text-gray-400">
          <div>• Name plate area</div>
          <div>• Logo placement</div>
          <div>• Team name space</div>
          <div>• Stats section</div>
        </div>
      </div>
    </div>
  );
};
