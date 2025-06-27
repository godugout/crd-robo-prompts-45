
import React from 'react';
import { FramePreviewGrid } from '@/components/editor/frames/FramePreviewGrid';

interface FrameAndImageStepProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const FrameAndImageStep: React.FC<FrameAndImageStepProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  console.log('FrameAndImageStep rendering:', {
    selectedFrame,
    uploadedImage,
    hasOnFrameSelect: !!onFrameSelect,
    hasOnImageUpload: !!onImageUpload
  });

  return (
    <div className="w-full h-full min-h-[600px] space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Frame & Upload Image</h2>
        <p className="text-gray-400">Select a professional frame template and upload your image</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Frame Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Frame Templates</h3>
          <div className="bg-black/20 rounded-lg border border-white/10 p-4 h-full">
            <FramePreviewGrid
              selectedFrame={selectedFrame}
              onSelectFrame={onFrameSelect}
              uploadedImage={uploadedImage}
              cardName="Sample Card"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Upload Image</h3>
          <div className="bg-black/20 rounded-lg border border-white/10 p-6 h-full flex flex-col">
            {uploadedImage ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="max-w-full max-h-64 object-contain rounded-lg border border-white/20"
                />
                <button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="px-4 py-2 bg-crd-green hover:bg-crd-green/90 text-black font-medium rounded-lg transition-colors"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
                <button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="px-6 py-3 bg-crd-green hover:bg-crd-green/90 text-black font-medium rounded-lg transition-colors"
                >
                  Upload Image
                </button>
                <p className="text-gray-400 text-sm text-center">
                  Choose a high-quality image for your card
                </p>
              </div>
            )}
            
            <input
              id="image-upload"
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
      </div>

      {/* Progress Indicator */}
      {selectedFrame && uploadedImage && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <div className="w-2 h-2 bg-crd-green rounded-full"></div>
            <span className="text-crd-green text-sm font-medium">Ready to continue</span>
          </div>
        </div>
      )}
    </div>
  );
};
