import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Crop, RotateCw, Maximize2, Download, X, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageCropperModal } from '@/components/editor/modals/ImageCropperModal';

interface UploadPhaseProps {
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onCropImage?: () => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  onCropImage
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setIsProcessing(true);
      setProcessingStep('Uploading image...');
      setProgress(25);

      try {
        const imageUrl = URL.createObjectURL(file);
        setOriginalImage(imageUrl);
        
        setProcessingStep('Processing image...');
        setProgress(75);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProgress(100);
        onImageUpload(imageUrl);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
        console.error('Upload error:', error);
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingStep('');
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
    multiple: false
  });

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    onImageUpload(croppedImageUrl);
    setShowCropModal(false);
    toast.success('Image cropped successfully!');
  }, [onImageUpload]);

  const handleCropImage = () => {
    if (uploadedImage) {
      setOriginalImage(uploadedImage);
      setShowCropModal(true);
    }
  };

  const handleRemoveImage = () => {
    onImageUpload('');
    setOriginalImage('');
    toast.success('Image removed');
  };

  const handleReplaceImage = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  if (isProcessing) {
    return (
      <div className="space-y-4">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-crd-green animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">{processingStep}</h3>
                <Progress value={progress} className="w-full mb-2" />
                <p className="text-gray-400 text-sm">{progress}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-300 mb-4">
          Your image has been uploaded. You can crop, enhance, or replace it.
        </div>

        {/* Image Preview */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="relative aspect-[2.5/3.5] w-full max-w-xs mx-auto rounded-lg overflow-hidden">
              <img
                src={uploadedImage}
                alt="Uploaded card image"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCropImage}
                  className="bg-black/70 text-white hover:bg-black/90"
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
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Crop className="w-4 h-4 mr-2" />
            Crop Image
          </Button>
          
          <Button
            onClick={handleReplaceImage}
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

        {/* Image Info */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <h4 className="text-white font-medium text-sm mb-2">Image Details</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>• Format: Detected automatically</div>
              <div>• Quality: High resolution recommended</div>
              <div>• Aspect Ratio: Optimized for card format</div>
              <div>• Processing: Enhanced for best results</div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Modal */}
        {showCropModal && originalImage && (
          <ImageCropperModal
            isOpen={showCropModal}
            onClose={() => setShowCropModal(false)}
            imageUrl={originalImage}
            onCropComplete={handleCropComplete}
          />
        )}
      </div>
    );
  }

  // Upload interface
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Upload your image to get started. Supports JPG, PNG, WebP, and GIF formats.
      </div>

      {/* Drop Zone */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-white/30 hover:border-crd-green/50 hover:bg-white/5'
            }`}
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
                onClick={(e) => e.stopPropagation()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <div>Supported: JPG, PNG, WebP, GIF</div>
                <div>Maximum size: 50MB</div>
                <div>Recommended: High resolution images work best</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Tips */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center">
            <Wand2 className="w-4 h-4 mr-2 text-crd-green" />
            Pro Tips
          </h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• Use high-resolution images for best quality</div>
            <div>• Square or portrait orientation works best</div>
            <div>• Clear, well-lit photos produce better results</div>
            <div>• You can crop and adjust after uploading</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
