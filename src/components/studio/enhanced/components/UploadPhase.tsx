
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, ToggleLeft, Loader2, CheckCircle2, RotateCcw, Smartphone, Monitor } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

type CardOrientation = 'portrait' | 'landscape';

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
  const [selectedOrientation, setSelectedOrientation] = useState<CardOrientation>('portrait');
  const [detectedOrientation, setDetectedOrientation] = useState<CardOrientation | null>(null);

  const analyzeImageOrientation = (file: File): Promise<CardOrientation> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const suggestedOrientation: CardOrientation = aspectRatio > 1 ? 'landscape' : 'portrait';
        setDetectedOrientation(suggestedOrientation);
        setSelectedOrientation(suggestedOrientation);
        resolve(suggestedOrientation);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File too large. Please choose an image under 10MB.');
        return;
      }
      
      console.log('🔄 Starting image upload process:', file.name);
      
      // Analyze orientation
      await analyzeImageOrientation(file);
      
      const imageUrl = URL.createObjectURL(file);
      console.log('📸 Created image URL:', imageUrl);
      
      await onImageUpload(imageUrl);
      console.log('✅ Image upload completed');
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

  const clearImage = () => {
    console.log('🗑️ Clearing uploaded image');
    onImageUpload('');
    setDetectedOrientation(null);
    setSelectedOrientation('portrait');
  };

  // Trading card dimensions (2.5" x 3.5" ratio)
  const cardAspectRatio = 2.5 / 3.5; // 0.714
  const dropzoneWidth = selectedOrientation === 'portrait' ? 300 : 420;
  const dropzoneHeight = selectedOrientation === 'portrait' ? 420 : 300;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Upload Your Image</h3>
        <p className="text-crd-lightGray text-sm">
          Choose a high-quality image to create your trading card
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

      {/* Orientation Selection */}
      {(uploadedImage || detectedOrientation) && (
        <div className="space-y-3">
          <p className="text-white font-medium text-sm">Card Orientation</p>
          <div className="flex gap-2">
            <Button
              variant={selectedOrientation === 'portrait' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedOrientation('portrait')}
              className={selectedOrientation === 'portrait' ? 'bg-crd-green text-black' : ''}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Portrait (2.5" × 3.5")
            </Button>
            <Button
              variant={selectedOrientation === 'landscape' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedOrientation('landscape')}
              className={selectedOrientation === 'landscape' ? 'bg-crd-green text-black' : ''}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Landscape (3.5" × 2.5")
            </Button>
          </div>
          {detectedOrientation && (
            <p className="text-crd-lightGray text-xs">
              Suggested: {detectedOrientation === 'portrait' ? 'Portrait' : 'Landscape'} 
              (based on image dimensions)
            </p>
          )}
        </div>
      )}

      {/* Trading Card Dropzone */}
      <div className="flex justify-center">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg cursor-pointer transition-all
            ${isDragActive ? 'border-crd-green bg-crd-green/10' : 'border-editor-border hover:border-crd-green/50'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ 
            width: `${dropzoneWidth}px`, 
            height: `${dropzoneHeight}px`,
            minWidth: `${dropzoneWidth}px`,
            minHeight: `${dropzoneHeight}px`
          }}
        >
          <input {...getInputProps()} />
          
          {/* Trading card frame border */}
          <div className="absolute inset-2 border border-white/20 rounded-md pointer-events-none" />
          <div className="absolute inset-4 border border-white/10 rounded-sm pointer-events-none" />
          
          {isProcessing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
              <Loader2 className="w-12 h-12 text-crd-green animate-spin" />
              <p className="text-white text-center">Processing your image...</p>
              <p className="text-crd-lightGray text-sm text-center">This may take a few moments</p>
            </div>
          ) : uploadedImage ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <img 
                src={uploadedImage} 
                alt="Uploaded card image" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              
              {/* Success indicator */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-crd-green rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-black" />
              </div>
              
              {/* Replace button */}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="flex-1 bg-black/80 border-white/20 text-white hover:bg-black/90"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Replace
                </Button>
              </div>
              
              {/* Card info overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-medium">
                  {selectedOrientation === 'portrait' ? '2.5" × 3.5"' : '3.5" × 2.5"'} Trading Card
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-crd-green/20 flex items-center justify-center">
                <Image className="w-8 h-8 text-crd-green" />
              </div>
              <div>
                <p className="text-white font-medium mb-2">
                  {isDragActive ? 'Drop your image here...' : 'Upload Card Image'}
                </p>
                <p className="text-crd-lightGray text-sm">
                  {isDragActive 
                    ? 'Release to create your trading card'
                    : 'Drag & drop or click to browse'
                  }
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-crd-lightGray mb-2">
                  Trading Card Format: {selectedOrientation === 'portrait' ? '2.5" × 3.5"' : '3.5" × 2.5"'}
                </p>
                <p className="text-xs text-crd-lightGray">
                  Supports PNG, JPG, JPEG, GIF, WebP (max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Success Indicator */}
      {uploadedImage && !isProcessing && (
        <div className="p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
          <p className="text-crd-green text-sm font-medium">✓ Image uploaded successfully!</p>
          <p className="text-crd-lightGray text-sm">
            Ready for frame selection - click "Frames" in the sidebar to continue
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="space-y-2">
        <h4 className="text-white font-medium">Tips for best results:</h4>
        <ul className="text-crd-lightGray text-sm space-y-1">
          <li>• Use high-resolution images (1024x1024 or larger)</li>
          <li>• Ensure good lighting and contrast</li>
          <li>• Choose images with clear subjects</li>
          <li>• Portrait orientation works best for player cards</li>
          <li>• Landscape orientation works well for action shots</li>
        </ul>
      </div>
    </div>
  );
};
