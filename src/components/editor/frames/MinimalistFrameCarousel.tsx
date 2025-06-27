
import React from 'react';
import { FramePreviewGrid } from './FramePreviewGrid';

interface MinimalistFrameCarouselProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const MinimalistFrameCarousel: React.FC<MinimalistFrameCarouselProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  return (
    <div className="w-full h-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Choose Your Frame</h3>
        <p className="text-gray-400">Professional card frames with real designs</p>
      </div>

      {/* Frame Grid */}
      <div className="flex-1">
        <FramePreviewGrid
          selectedFrame={selectedFrame}
          onSelectFrame={onFrameSelect}
          uploadedImage={uploadedImage}
          cardName="Your Card"
        />
      </div>

      {/* Image Upload Section */}
      {!uploadedImage && (
        <div className="bg-black/20 rounded-lg border border-white/10 p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">Upload an image to see it in the frames</p>
            <button
              onClick={() => document.getElementById('frame-image-upload')?.click()}
              className="px-4 py-2 bg-crd-green hover:bg-crd-green/90 text-black font-medium rounded-lg transition-colors"
            >
              Upload Image
            </button>
            <input
              id="frame-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  onImageUpload(url);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
