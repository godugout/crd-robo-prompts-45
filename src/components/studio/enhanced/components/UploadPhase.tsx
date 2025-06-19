
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, ToggleLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface UploadPhaseProps {
  uploadedImage: string;
  onImageUpload: (imageUrl: string) => Promise<void>;
  isProcessing: boolean;
  error: string;
  showBackgroundRemoval: boolean;
  onToggleBackgroundRemoval: () => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  isProcessing,
  error,
  showBackgroundRemoval,
  onToggleBackgroundRemoval
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File too large. Please choose an image under 10MB.');
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      await onImageUpload(imageUrl);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Upload Your Image</h3>
        <p className="text-crd-lightGray text-sm">
          Choose a high-quality image to create your card
        </p>
      </div>

      {/* Background Removal Toggle */}
      <div className="flex items-center justify-between p-4 bg-editor-tool rounded-lg border border-editor-border">
        <div>
          <p className="text-white font-medium">AI Background Removal</p>
          <p className="text-crd-lightGray text-sm">Automatically remove image background</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleBackgroundRemoval}
          className={`${showBackgroundRemoval ? 'bg-crd-green text-black' : ''}`}
        >
          <ToggleLeft className="w-4 h-4 mr-2" />
          {showBackgroundRemoval ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-crd-green bg-crd-green/10' : 'border-editor-border hover:border-crd-green/50'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-crd-green animate-spin" />
            <p className="text-white">Processing your image...</p>
            <p className="text-crd-lightGray text-sm">This may take a few moments</p>
          </div>
        ) : uploadedImage ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="max-w-48 max-h-48 rounded-lg object-cover"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-black" />
              </div>
            </div>
            <p className="text-crd-green font-medium">Image uploaded successfully!</p>
            <p className="text-crd-lightGray text-sm">You can now proceed to select a frame</p>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Choose Different Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Image className="w-12 h-12 text-crd-lightGray" />
            <div>
              <p className="text-white mb-2">
                {isDragActive ? 'Drop your image here...' : 'Drag & drop an image here'}
              </p>
              <p className="text-crd-lightGray text-sm">or click to browse your files</p>
            </div>
            <p className="text-xs text-crd-lightGray">
              Supports PNG, JPG, JPEG, GIF, WebP (max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Progress Indicator */}
      {uploadedImage && !isProcessing && (
        <div className="p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
          <p className="text-crd-green text-sm font-medium">✓ Ready for next step</p>
          <p className="text-crd-lightGray text-sm">Click on "Frames" in the sidebar to continue</p>
        </div>
      )}

      {/* Tips */}
      <div className="space-y-2">
        <h4 className="text-white font-medium">Tips for best results:</h4>
        <ul className="text-crd-lightGray text-sm space-y-1">
          <li>• Use high-resolution images (1024x1024 or larger)</li>
          <li>• Ensure good lighting and contrast</li>
          <li>• Choose images with clear subjects</li>
          <li>• PNG files preserve transparency</li>
        </ul>
      </div>
    </div>
  );
};
