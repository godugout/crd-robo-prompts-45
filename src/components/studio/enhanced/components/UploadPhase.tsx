
import React, { useCallback, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, ToggleLeft, Loader2, CheckCircle2, RotateCcw, Smartphone, Monitor, Wand2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { MediaManager } from '@/lib/storage/MediaManager';
import { ImageProcessingPanel } from './ImageProcessingPanel';
import { BatchImageProcessor } from './BatchImageProcessor';

type CardOrientation = 'portrait' | 'landscape';

interface UploadPhaseProps {
  uploadedImage: string;
  onImageUpload: (imageUrl: string) => Promise<void>;
  isProcessing: boolean;
  error: string;
  showBackgroundRemoval: boolean;
  onToggleBackgroundRemoval: () => void;
  cardOrientation?: CardOrientation;
  onOrientationChange?: (orientation: CardOrientation) => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  isProcessing,
  error,
  showBackgroundRemoval,
  onToggleBackgroundRemoval,
  cardOrientation = 'portrait',
  onOrientationChange
}) => {
  const [selectedOrientation, setSelectedOrientation] = useState<CardOrientation>(cardOrientation);
  const [detectedOrientation, setDetectedOrientation] = useState<CardOrientation | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAdvancedProcessing, setShowAdvancedProcessing] = useState(false);
  const [showBatchProcessor, setShowBatchProcessor] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const analyzeImageOrientation = (file: File): Promise<CardOrientation> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const suggestedOrientation: CardOrientation = aspectRatio > 1 ? 'landscape' : 'portrait';
        setDetectedOrientation(suggestedOrientation);
        setSelectedOrientation(suggestedOrientation);
        onOrientationChange?.(suggestedOrientation);
        resolve(suggestedOrientation);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Clear any previous errors
    setUploadError('');
    setUploadProgress(0);

    // Validate file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      const errorMsg = 'File too large. Please choose an image under 10MB.';
      setUploadError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    console.log('🔄 Starting MediaManager upload process:', file.name, file.size);
    
    try {
      // Analyze orientation first
      await analyzeImageOrientation(file);
      
      // Upload using MediaManager with proper progress tracking
      const mediaFile = await MediaManager.uploadFile(file, {
        bucket: 'card-assets',
        folder: 'studio-cards',
        generateThumbnail: true,
        optimize: true,
        tags: ['studio-upload', 'card-image'],
        metadata: {
          originalName: file.name,
          cardOrientation: selectedOrientation,
          source: 'studio',
          uploadTimestamp: Date.now()
        },
        onProgress: (progress) => {
          console.log('📊 Upload progress:', progress);
          setUploadProgress(progress);
        }
      });

      if (!mediaFile) {
        throw new Error('MediaManager returned null - upload failed');
      }

      // Get the public URL from metadata first, then fallback to MediaManager
      let publicUrl = mediaFile.metadata?.publicUrl;
      if (!publicUrl) {
        publicUrl = MediaManager.getPublicUrl(mediaFile.bucket_id, mediaFile.file_path);
      }

      console.log('✅ MediaManager upload completed successfully:', {
        fileId: mediaFile.id,
        publicUrl,
        filePath: mediaFile.file_path,
        bucket: mediaFile.bucket_id
      });

      // Call the upload handler with the public URL
      await onImageUpload(publicUrl);
      
      setUploadProgress(100);
      toast.success('Image uploaded successfully!', {
        description: 'Ready for frame selection'
      });

    } catch (error) {
      console.error('❌ MediaManager upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed - please try again';
      setUploadError(errorMessage);
      setUploadProgress(0);
      toast.error(errorMessage, {
        description: 'Please check your connection and try again'
      });
    }
  }, [onImageUpload, onOrientationChange, selectedOrientation]);

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
    setUploadProgress(0);
    setUploadError('');
  };

  const handleOrientationChange = (orientation: CardOrientation) => {
    setSelectedOrientation(orientation);
    onOrientationChange?.(orientation);
  };

  const handleProcessingComplete = async (processedImageUrl: string) => {
    await onImageUpload(processedImageUrl);
    toast.success('Advanced processing complete!');
  };

  const handleBatchComplete = (processedImages: { original: File; processed: string }[]) => {
    if (processedImages.length > 0) {
      // Use the first processed image for now
      handleProcessingComplete(processedImages[0].processed);
    }
  };

  // Trading card dimensions (2.5" x 3.5" ratio)
  const dropzoneWidth = selectedOrientation === 'portrait' ? 300 : 420;
  const dropzoneHeight = selectedOrientation === 'portrait' ? 420 : 300;

  // Determine current error to display (prioritize upload errors)
  const displayError = uploadError || error;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Upload Your Image</h3>
        <p className="text-crd-lightGray text-sm">
          Choose a high-quality image to create your trading card
        </p>
      </div>

      {/* Advanced Processing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={showAdvancedProcessing ? "default" : "outline"}
          size="sm"
          onClick={() => setShowAdvancedProcessing(!showAdvancedProcessing)}
          className={showAdvancedProcessing ? 'bg-crd-green text-black' : ''}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Advanced Processing
        </Button>
        <Button
          variant={showBatchProcessor ? "default" : "outline"}
          size="sm"
          onClick={() => setShowBatchProcessor(!showBatchProcessor)}
          className={showBatchProcessor ? 'bg-crd-green text-black' : ''}
        >
          Batch Processor
        </Button>
      </div>

      {/* Advanced Processing Panel */}
      {showAdvancedProcessing && uploadedImage && (
        <ImageProcessingPanel
          imageUrl={uploadedImage}
          onProcessingComplete={handleProcessingComplete}
        />
      )}

      {/* Batch Processor */}
      {showBatchProcessor && (
        <BatchImageProcessor
          onBatchComplete={handleBatchComplete}
        />
      )}

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
              onClick={() => handleOrientationChange('portrait')}
              className={selectedOrientation === 'portrait' ? 'bg-crd-green text-black' : ''}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Portrait (2.5" × 3.5")
            </Button>
            <Button
              variant={selectedOrientation === 'landscape' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleOrientationChange('landscape')}
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
              <p className="text-white text-center">Uploading via MediaManager...</p>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-crd-green h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              <p className="text-crd-lightGray text-sm text-center">
                {uploadProgress > 0 ? `${uploadProgress}% complete` : 'Processing...'}
              </p>
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
              <div className="absolute bottom-12 left-3 right-3">
                <p className="text-white text-sm font-medium">
                  {selectedOrientation === 'portrait' ? '2.5" × 3.5"' : '3.5" × 2.5"'} Trading Card
                </p>
                <p className="text-crd-lightGray text-xs">
                  Stored in MediaManager • Ready for frames
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
                    ? 'Release to upload via MediaManager'
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
      {displayError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm font-medium">Upload Error</p>
          <p className="text-red-300 text-sm">{displayError}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setUploadError('');
              setUploadProgress(0);
            }}
            className="mt-2 text-red-400 border-red-400 hover:bg-red-400/10"
          >
            Clear Error
          </Button>
        </div>
      )}

      {/* Success Indicator */}
      {uploadedImage && !isProcessing && !displayError && (
        <div className="p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
          <p className="text-crd-green text-sm font-medium">✓ Image uploaded successfully!</p>
          <p className="text-crd-lightGray text-sm">
            File stored securely with MediaManager - ready for frame selection
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
          <li>• Images are automatically optimized for web and storage</li>
          <li>• Use Advanced Processing for AI-powered enhancements</li>
        </ul>
      </div>
    </div>
  );
};
