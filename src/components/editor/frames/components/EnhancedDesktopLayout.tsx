
import React from 'react';
import { LargeCardPreview } from './LargeCardPreview';
import { FrameSelectionPanel } from './FrameSelectionPanel';
import { UploadAssetPanel } from './UploadAssetPanel';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface EnhancedDesktopLayoutProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  currentFrame: MinimalistFrame;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  onImageUpload: (imageUrl: string) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const EnhancedDesktopLayout: React.FC<EnhancedDesktopLayoutProps> = ({
  frames,
  currentIndex,
  currentFrame,
  uploadedImage,
  isDragActive,
  onFrameSelect,
  onImageUpload,
  getRootProps,
  getInputProps
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 xl:p-8">
      <div className="grid grid-cols-4 gap-6 h-full max-h-[85vh]">
        {/* Large Card Preview Column - 50% width (2 of 4 columns) */}
        <div className="col-span-2 flex items-center justify-center">
          <LargeCardPreview
            frames={frames}
            currentIndex={currentIndex}
            uploadedImage={uploadedImage}
            isDragActive={isDragActive}
            onFrameSelect={onFrameSelect}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        </div>

        {/* Frame Selection Panel - 25% width (1 of 4 columns) */}
        <div className="col-span-1 overflow-hidden">
          <FrameSelectionPanel
            frames={frames}
            currentIndex={currentIndex}
            currentFrame={currentFrame}
            uploadedImage={uploadedImage}
            onFrameSelect={onFrameSelect}
          />
        </div>

        {/* Upload & Asset Management Panel - 25% width (1 of 4 columns) */}
        <div className="col-span-1 overflow-hidden">
          <UploadAssetPanel
            uploadedImage={uploadedImage}
            onImageUpload={onImageUpload}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        </div>
      </div>
    </div>
  );
};
