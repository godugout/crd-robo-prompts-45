
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, AlertTriangle, Check, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadPhaseProps {
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
  isProcessing?: boolean;
  error?: string;
  showBackgroundRemoval?: boolean;
  onToggleBackgroundRemoval?: () => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  isProcessing = false,
  error = '',
  showBackgroundRemoval = false,
  onToggleBackgroundRemoval
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        console.log('📁 File uploaded, triggering image processing');
        onImageUpload(result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }, [handleFileUpload]);

  if (uploadedImage && !error) {
    return (
      <div className="p-6 space-y-4">
        <Card className="bg-green-900/20 border-green-500/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-green-400 font-semibold">Image Uploaded Successfully</h3>
                <p className="text-green-300 text-sm">
                  Your image has been processed and is ready for card creation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-editor-tool border border-editor-border rounded-lg p-4">
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => {
            // Reset to upload new image
            onImageUpload('');
          }}
          className="w-full border-editor-border text-white hover:bg-white/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Different Image
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-red-400 font-semibold">Upload Error</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={() => {
            // Clear error and try again
            onImageUpload('');
          }}
          className="w-full border-editor-border text-white hover:bg-white/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-white text-xl font-bold mb-2">Upload Your Image</h2>
        <p className="text-crd-lightGray text-sm">
          Start creating your premium card by uploading an image
        </p>
      </div>

      {/* Background Removal Toggle */}
      {onToggleBackgroundRemoval && (
        <Card className="bg-editor-tool border-editor-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wand2 className="w-5 h-5 text-crd-green" />
                <div>
                  <h3 className="text-white font-medium">AI Background Removal</h3>
                  <p className="text-crd-lightGray text-xs">
                    Automatically remove image background using AI
                  </p>
                </div>
              </div>
              <Button
                variant={showBackgroundRemoval ? "default" : "outline"}
                size="sm"
                onClick={onToggleBackgroundRemoval}
                className={showBackgroundRemoval 
                  ? "bg-crd-green text-black hover:bg-crd-green/90" 
                  : "border-editor-border text-white hover:bg-white/10"
                }
              >
                {showBackgroundRemoval ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-all ${
        dragActive 
          ? 'border-crd-green bg-crd-green/10' 
          : 'border-editor-border bg-editor-tool hover:border-crd-green/50'
      }`}>
        <CardContent className="p-8">
          <div
            className="text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              {isProcessing ? (
                <div className="animate-spin w-12 h-12 border-4 border-crd-green border-t-transparent rounded-full mx-auto" />
              ) : (
                <Image className="w-12 h-12 text-crd-lightGray mx-auto" />
              )}
            </div>
            
            <h3 className="text-white font-semibold mb-2">
              {isProcessing ? 'Processing Image...' : 'Drop your image here'}
            </h3>
            
            <p className="text-crd-lightGray text-sm mb-4">
              {isProcessing 
                ? 'Please wait while we process your image'
                : 'or click to browse files'
              }
            </p>
            
            {!isProcessing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="image-upload"
              />
            )}
            
            <Button
              asChild={!isProcessing}
              disabled={isProcessing}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              {isProcessing ? (
                <div>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Processing...
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </label>
              )}
            </Button>
            
            {!isProcessing && (
              <div className="mt-4 text-xs text-crd-lightGray">
                Supports: JPG, PNG, GIF, WebP (max 10MB)
                {showBackgroundRemoval && (
                  <div className="mt-1 text-crd-green">
                    ✨ AI background removal enabled
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
