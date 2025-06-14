
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FrameRenderer } from '../../frames/FrameRenderer';
import { toast } from 'sonner';

interface EnhancedImageUploadStepProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
}

export const EnhancedImageUploadStep: React.FC<EnhancedImageUploadStepProps> = ({
  selectedFrame,
  uploadedImage,
  onImageUpload
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{
    width: number;
    height: number;
    size: string;
    format: string;
  } | null>(null);

  const processImage = useCallback((file: File) => {
    setIsProcessing(true);
    setUploadError(null);

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      setIsProcessing(false);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a JPG, PNG, or WebP image');
      setIsProcessing(false);
      return;
    }

    // Create image to get metadata
    const img = new Image();
    img.onload = () => {
      setImageMetadata({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        format: file.type.split('/')[1].toUpperCase()
      });

      // Check minimum dimensions
      if (img.naturalWidth < 200 || img.naturalHeight < 200) {
        setUploadError('Image must be at least 200x200 pixels for best quality');
        setIsProcessing(false);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
      setIsProcessing(false);
      toast.success('Image uploaded successfully!');
    };

    img.onerror = () => {
      setUploadError('Failed to load image. Please try another file.');
      setIsProcessing(false);
    };

    img.src = URL.createObjectURL(file);
  }, [onImageUpload]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setUploadError('Please upload a valid image file');
      return;
    }

    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0]);
    }
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
    disabled: isProcessing
  });

  const handleRemoveImage = () => {
    onImageUpload('');
    setImageMetadata(null);
    setUploadError(null);
  };

  return (
    <div className="flex h-full">
      {/* Upload Area */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-white mb-3">Upload Your Image</h3>
            <p className="text-gray-400 text-lg">
              Add the photo you want to feature in your {selectedFrame ? 'selected frame' : 'card'}.
            </p>
          </div>

          {!uploadedImage ? (
            <>
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer ${
                  isDragActive && !isDragReject
                    ? 'border-crd-green bg-crd-green/5 scale-105' 
                    : isDragReject
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-gray-600 hover:border-crd-green/50 hover:bg-crd-green/5'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-crd-green/20 to-crd-green/10 rounded-full flex items-center justify-center">
                    {isProcessing ? (
                      <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-10 h-10 text-crd-green" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold text-xl mb-2">
                      {isProcessing ? 'Processing...' : 
                       isDragActive ? 'Drop your image here' : 'Upload Your Image'}
                    </h4>
                    <p className="text-gray-400 text-base mb-4">
                      {isProcessing ? 'Please wait while we process your image' :
                       'Drag and drop an image, or click anywhere in this area'}
                    </p>
                    <div className="text-gray-500 text-sm space-y-1">
                      <p>Supports JPG, PNG, WebP • Max 10MB</p>
                      <p>Minimum 200x200 pixels recommended</p>
                    </div>
                  </div>

                  {!isProcessing && (
                    <Button 
                      className="bg-crd-green hover:bg-crd-green/90 text-black font-medium px-8 py-3"
                      disabled={isProcessing}
                    >
                      <Image className="w-5 h-5 mr-2" />
                      Choose Image
                    </Button>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {uploadError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-medium">Upload Error</p>
                    <p className="text-red-300 text-sm mt-1">{uploadError}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Uploaded Image Display */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-crd-green">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Image uploaded successfully!</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-400"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded content" 
                  className="w-full h-full object-contain"
                />
              </div>

              {imageMetadata && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-editor-dark rounded-lg border border-editor-border">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Dimensions</p>
                    <p className="text-white font-medium">{imageMetadata.width} × {imageMetadata.height}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Size</p>
                    <p className="text-white font-medium">{imageMetadata.size}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Format</p>
                    <p className="text-white font-medium">{imageMetadata.format}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Quality</p>
                    <p className="text-crd-green font-medium">Good</p>
                  </div>
                </div>
              )}

              <Button 
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium py-3"
                onClick={() => toast.success('Ready to continue to image adjustment!')}
              >
                Continue to Adjustment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Frame Preview */}
      <div className="w-80 bg-editor-darker border-l border-editor-border p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Live Preview</h4>
        
        <div className="aspect-[5/7] bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
          {selectedFrame ? (
            <FrameRenderer
              frameId={selectedFrame}
              imageUrl={uploadedImage}
              title="YOUR CARD"
              subtitle={uploadedImage ? "Looking great!" : "Upload an image to see it here"}
              width={280}
              height={392}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded mx-auto mb-4"></div>
                <p className="text-sm">No frame selected</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-editor-dark rounded-lg">
          <h5 className="text-white text-sm font-medium mb-2">Pro Tips:</h5>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• Use high-resolution images (1000px+ width)</li>
            <li>• Square or portrait images work best</li>
            <li>• Clear, well-lit photos look professional</li>
            <li>• You can adjust positioning in the next step</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
