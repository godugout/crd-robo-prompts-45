
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, X } from 'lucide-react';

interface UploadPhaseProps {
  uploadedImages: File[];
  onImageUpload: (files: File[]) => void;
  onComplete: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImages,
  onImageUpload,
  onComplete,
  fileInputRef
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    onImageUpload(newImages);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Upload Your Images</h3>
        <p className="text-gray-400">Add photos or artwork to create your trading card</p>
      </div>

      {/* Upload Zone */}
      <Card 
        className="border-2 border-dashed border-white/20 bg-black/30 hover:border-crd-green/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <div className="p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Drop images here</h4>
          <p className="text-gray-400 mb-4">or click to browse your files</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </Card>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">Uploaded Images ({uploadedImages.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((file, index) => (
              <Card key={index} className="relative bg-black/30 border-white/20 overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                    <p className="text-white text-xs truncate">{file.name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {uploadedImages.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            onClick={onComplete}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Continue to Frames
          </Button>
        </div>
      )}
    </div>
  );
};
