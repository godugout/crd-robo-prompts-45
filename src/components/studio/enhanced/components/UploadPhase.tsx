
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Crop, X, Wand2, AlertCircle, ArrowLeft, Sparkles, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { InlineCropInterface } from './InlineCropInterface';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';

interface UploadPhaseProps {
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
  isProcessing?: boolean;
  error?: string;
  showBackgroundRemoval?: boolean;
  onToggleBackgroundRemoval?: () => void;
  processedImage?: ProcessedImage | null;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  isProcessing = false,
  error = '',
  showBackgroundRemoval = false,
  onToggleBackgroundRemoval,
  processedImage
}) => {
  const [cropMode, setCropMode] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Update local error state when prop changes
  useEffect(() => {
    setUploadError(error);
  }, [error]);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('UploadPhase - onDrop called', { acceptedFiles, rejectedFiles });
    
    setUploadError('');
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      const errorMessage = error.code === 'file-too-large' 
        ? 'File is too large. Maximum size is 50MB.'
        : error.code === 'file-invalid-type'
        ? 'File type not supported. Please use JPG, PNG, WebP, or GIF.'
        : 'File upload failed. Please try again.';
      
      setUploadError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('UploadPhase - Processing file:', file.name, file.size, file.type);
      
      try {
        const imageUrl = URL.createObjectURL(file);
        console.log('UploadPhase - Created image URL:', imageUrl);
        onImageUpload(imageUrl);
      } catch (error) {
        console.error('UploadPhase - Upload error:', error);
        const errorMessage = 'Failed to upload image. Please try again.';
        setUploadError(errorMessage);
        toast.error(errorMessage);
      }
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled: isProcessing
  });

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    console.log('UploadPhase - Crop completed:', croppedImageUrl);
    onImageUpload(croppedImageUrl);
    setCropMode(false);
    toast.success('Image cropped successfully!');
  }, [onImageUpload]);

  const handleCropCancel = useCallback(() => {
    setCropMode(false);
  }, []);

  const handleCropImage = () => {
    if (uploadedImage) {
      console.log('UploadPhase - Entering crop mode for:', uploadedImage);
      setCropMode(true);
    } else {
      toast.error('No image to crop');
    }
  };

  const handleRemoveImage = () => {
    console.log('UploadPhase - Removing image');
    onImageUpload('');
    setCropMode(false);
    setUploadError('');
    toast.success('Image removed');
  };

  // Processing state
  if (isProcessing) {
    return (
      <div className="space-y-4">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-crd-green animate-spin" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Processing Image...</h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <div>• Validating image quality</div>
                  {showBackgroundRemoval && <div>• Removing background</div>}
                  <div>• Optimizing for 3D preview</div>
                  <div>• Creating auto-save draft</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show crop interface when in crop mode
  if (cropMode && uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCropCancel}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="text-white font-semibold">Crop Your Image</h3>
            <p className="text-gray-400 text-sm">Adjust the crop area and apply when ready</p>
          </div>
        </div>
        
        <InlineCropInterface
          imageUrl={uploadedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

  if (uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-300 mb-4 flex items-center justify-between">
          <span>Your image is ready for card creation.</span>
          {processedImage && (
            <div className="flex items-center text-xs text-crd-green">
              <Clock className="w-3 h-3 mr-1" />
              Auto-saved
            </div>
          )}
        </div>

        {/* Processing Status */}
        {processedImage && (
          <Card className="bg-crd-green/10 border-crd-green/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-crd-green">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Enhanced Image
                </div>
                <div className="text-crd-green space-x-2">
                  <span>Size: {processedImage.metadata.width}x{processedImage.metadata.height}</span>
                  {!processedImage.hasBackground && <span>• Background Removed</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="relative aspect-[2.5/3.5] w-full max-w-xs mx-auto rounded-lg overflow-hidden">
              <img
                src={uploadedImage}
                alt="Uploaded card image"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('UploadPhase - Image failed to load:', uploadedImage);
                  setUploadError('Failed to load image. Please try uploading again.');
                }}
                onLoad={() => {
                  console.log('UploadPhase - Image loaded successfully');
                  setUploadError('');
                }}
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCropImage}
                  className="bg-crd-green/90 text-black hover:bg-crd-green"
                >
                  <Crop className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleRemoveImage}
                  variant="destructive"
                  className="bg-red-500/80 hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleCropImage}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            <Crop className="w-4 h-4 mr-2" />
            Crop Image
          </Button>
          
          <Button
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              if (fileInput) fileInput.click();
            }}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Replace
          </Button>
        </div>

        {/* Hidden file input for replace functionality */}
        <div style={{ display: 'none' }}>
          <input {...getInputProps()} />
        </div>
      </div>
    );
  }

  // Upload interface
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Upload your image to get started. Advanced processing will enhance your image automatically.
      </div>

      {/* Background Removal Toggle */}
      {onToggleBackgroundRemoval && (
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-crd-green" />
                <Label htmlFor="bg-removal" className="text-white text-sm">
                  Smart Background Removal
                </Label>
              </div>
              <Switch
                id="bg-removal"
                checked={showBackgroundRemoval}
                onCheckedChange={onToggleBackgroundRemoval}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Automatically remove backgrounds for cleaner card designs
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {(uploadError || error) && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{uploadError || error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drop Zone */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : uploadError || error
                ? 'border-red-500/50 hover:border-red-400/50'
                : 'border-white/30 hover:border-crd-green/50 hover:bg-white/5'
            } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-crd-green" />
              </div>
              
              <div>
                <h3 className="text-white text-lg font-medium mb-2">
                  {isDragActive ? 'Drop your image here' : 'Upload Your Image'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {isDragActive
                    ? 'Release to upload your image'
                    : 'Drag and drop an image here, or click to browse'}
                </p>
              </div>

              <Button 
                className="bg-crd-green hover:bg-crd-green/90 text-black font-bold"
                type="button"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <div>Supported: JPG, PNG, WebP, GIF</div>
                <div>Maximum size: 50MB</div>
                <div>Recommended: High resolution images work best</div>
                <div className="text-crd-green">✓ Advanced processing • ✓ Auto-save enabled</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Tips */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-crd-green" />
            Enhanced Processing
          </h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• Automatic image validation and optimization</div>
            <div>• Optional AI-powered background removal</div>
            <div>• Smart cropping assistance with frame overlays</div>
            <div>• Continuous auto-save with undo history</div>
            <div>• Immediate draft creation for session recovery</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
