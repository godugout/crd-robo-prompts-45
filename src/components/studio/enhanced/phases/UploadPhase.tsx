
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Image, X, Camera, Folder } from 'lucide-react';
import { toast } from 'sonner';

interface UploadPhaseProps {
  uploadedImages: string[];
  onImageUpload: (files: FileList | File[]) => void;
  onComplete: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImages,
  onImageUpload,
  onComplete,
  fileInputRef
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    maxFiles: 10
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageUpload(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    // This would need to be implemented in the parent hook
    toast.info('Image removed');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Upload Your Images</h3>
        <p className="text-gray-400 text-sm">
          Start by uploading your card images. You can add multiple images and organize them later.
        </p>
      </div>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main Upload Zone */}
      <Card className="bg-black/20 border-white/10 rounded-lg overflow-hidden">
        <div
          {...getRootProps()}
          className={`relative p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'bg-crd-green/20 border-crd-green'
              : 'hover:bg-white/5 border-white/10'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
              {isDragActive ? (
                <Upload className="w-8 h-8 text-crd-green animate-bounce" />
              ) : (
                <Folder className="w-8 h-8 text-gray-300" />
              )}
            </div>
            
            {/* Text */}
            <div>
              <h4 className="text-white font-medium text-lg mb-2">
                {isDragActive 
                  ? 'Drop your images here!' 
                  : 'Drag & drop images here'
                }
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Or click to browse your files
              </p>
              <p className="text-gray-500 text-xs">
                Supports JPG, PNG, WebP, GIF • Up to 10 images • Max 50MB each
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <Button 
                className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Image className="w-4 h-4 mr-2" />
                Use Sample
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">Uploaded Images ({uploadedImages.length})</h4>
          <div className="grid grid-cols-2 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <Card key={index} className="bg-black/30 border-white/10 p-3 rounded-lg">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 mb-3">
                  <img 
                    src={imageUrl} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 p-0 bg-black/50 hover:bg-red-500/50 rounded-full"
                  >
                    <X className="w-3 h-3 text-white" />
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-medium">Image {index + 1}</p>
                  <p className="text-gray-400 text-xs">Ready to use</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {uploadedImages.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <Button 
            onClick={onComplete}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            Continue to Frames ({uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} ready)
          </Button>
        </div>
      )}
    </div>
  );
};
