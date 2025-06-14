
import React, { useState } from 'react';
import { Upload, X, RotateCcw, Trash2 } from 'lucide-react';

interface UploadAssetPanelProps {
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const UploadAssetPanel: React.FC<UploadAssetPanelProps> = ({
  uploadedImage,
  onImageUpload,
  getRootProps,
  getInputProps
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    uploadedImage ? [uploadedImage] : []
  );

  const handleImageSelect = (imageUrl: string) => {
    onImageUpload(imageUrl);
  };

  const handleImageDelete = (imageUrl: string) => {
    const updatedImages = uploadedImages.filter(img => img !== imageUrl);
    setUploadedImages(updatedImages);
    
    if (uploadedImage === imageUrl) {
      const nextImage = updatedImages[0] || '';
      onImageUpload(nextImage);
    }
  };

  const handleClearAll = () => {
    setUploadedImages([]);
    onImageUpload('');
  };

  return (
    <div className="h-full bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Assets</h3>
          <p className="text-gray-400 text-sm">Manage your uploads</p>
        </div>
        {uploadedImages.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div className="mb-4">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-600 hover:border-crd-green rounded-xl p-4 text-center cursor-pointer transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400 text-sm">Drop images here</p>
          <p className="text-gray-500 text-xs mt-1">or click to browse</p>
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <h4 className="text-white text-sm font-medium mb-3">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="space-y-3">
            {uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                  uploadedImage === imageUrl
                    ? 'ring-2 ring-crd-green shadow-lg'
                    : 'hover:scale-105'
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection indicator */}
                  {uploadedImage === imageUrl && (
                    <div className="absolute top-2 left-2 w-4 h-4 bg-crd-green rounded-full flex items-center justify-center">
                      <span className="text-black text-xs font-bold">✓</span>
                    </div>
                  )}
                  
                  {/* Hover controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageDelete(imageUrl);
                      }}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Delete image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-2 bg-black/40">
                  <p className="text-white text-xs">Image {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {uploadedImage && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h5 className="text-white text-sm font-medium mb-2">Quick Actions</h5>
          <div className="space-y-2">
            <button className="w-full p-2 bg-black/30 hover:bg-black/50 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Adjust Image
            </button>
          </div>
        </div>
      )}

      {/* Upload Stats */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Supports JPG, PNG, WebP up to 10MB
      </div>
    </div>
  );
};
