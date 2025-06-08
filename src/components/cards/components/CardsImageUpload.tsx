
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system';
import { Upload, X, CheckCircle, AlertCircle, FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
      width: number;
      height: number;
      size: string;
      format: string;
    };
  };
}

interface CardsImageUploadProps {
  onImagesProcessed: (images: UploadedImage[]) => void;
}

export const CardsImageUpload: React.FC<CardsImageUploadProps> = ({
  onImagesProcessed
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [processingImages, setProcessingImages] = useState<Set<string>>(new Set());

  const validateImage = async (file: File): Promise<UploadedImage['validation']> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Validation checks
        if (img.width < 200 || img.height < 280) {
          errors.push('Image too small for card detection');
        }
        
        if (file.size > 15 * 1024 * 1024) {
          errors.push('File size exceeds 15MB limit');
        }
        
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.5 || aspectRatio > 2) {
          warnings.push('Unusual aspect ratio detected');
        }
        
        if (img.width < 400 || img.height < 560) {
          warnings.push('Low resolution - higher quality recommended');
        }

        resolve({
          isValid: errors.length === 0,
          errors,
          warnings,
          metadata: {
            width: img.width,
            height: img.height,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            format: file.type.split('/')[1].toUpperCase()
          }
        });
      };
      
      img.onerror = () => {
        resolve({
          isValid: false,
          errors: ['Invalid or corrupted image file'],
          warnings: [],
          metadata: {
            width: 0,
            height: 0,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            format: file.type.split('/')[1]?.toUpperCase() || 'Unknown'
          }
        });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const processImage = async (file: File, imageId: string) => {
    setProcessingImages(prev => new Set(prev).add(imageId));
    
    try {
      const validation = await validateImage(file);
      
      setUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { ...img, validation, processed: true }
            : img
        )
      );
      
      if (!validation.isValid) {
        toast.error(`Validation failed: ${file.name}`, {
          description: validation.errors.join(', ')
        });
      } else if (validation.warnings.length > 0) {
        toast.warning(`Warnings for ${file.name}`, {
          description: validation.warnings.join(', ')
        });
      }
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error(`Failed to process ${file.name}`);
    } finally {
      setProcessingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: `image-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      processed: false
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    toast.success(`Added ${acceptedFiles.length} image${acceptedFiles.length > 1 ? 's' : ''}`);
    
    // Process each image
    for (const image of newImages) {
      await processImage(image.file, image.id);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10
  });

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
    toast.success('Image removed');
  };

  const proceedToDetection = () => {
    const validImages = uploadedImages.filter(img => img.validation?.isValid);
    if (validImages.length === 0) {
      toast.error('Please upload valid images first');
      return;
    }
    onImagesProcessed(validImages);
  };

  const clearAll = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
    toast.success('Cleared all images');
  };

  const validCount = uploadedImages.filter(img => img.validation?.isValid).length;
  const isProcessing = processingImages.size > 0;
  const canProceed = validCount > 0 && !isProcessing;

  return (
    <div className="space-y-6" role="region" aria-label="Image upload section">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-crd-mediumGray hover:border-crd-green/50'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for uploading card images"
      >
        <input {...getInputProps()} aria-label="Image file input" />
        <div className="space-y-4">
          <FileImage className="w-12 h-12 text-crd-lightGray mx-auto" aria-hidden="true" />
          <div>
            <h3 className="text-crd-white font-medium text-lg mb-2">
              {isDragActive ? 'Drop images here' : 'Upload Card Images'}
            </h3>
            <p className="text-crd-lightGray">
              Drag and drop your trading card images, or click to browse
            </p>
            <p className="text-crd-lightGray text-sm mt-2">
              Supports JPG, PNG, WebP • Max 10 images • Up to 15MB each
            </p>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      {uploadedImages.length > 0 && (
        <div className="bg-crd-darkGray p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-crd-white font-medium">
              Upload Status ({uploadedImages.length} images)
            </h4>
            <div className="text-sm text-crd-lightGray">
              {validCount} valid • {isProcessing ? 'Processing...' : 'Ready'}
            </div>
          </div>
          
          <div className="flex gap-2">
            <CRDButton
              variant="outline"
              onClick={clearAll}
              disabled={isProcessing}
              aria-label="Clear all uploaded images"
            >
              Clear All
            </CRDButton>
            <CRDButton
              variant="primary"
              onClick={proceedToDetection}
              disabled={!canProceed}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
              aria-label={`Continue to detection with ${validCount} valid images`}
            >
              Continue to Detection ({validCount})
            </CRDButton>
          </div>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => {
            const isImageProcessing = processingImages.has(image.id);
            const validation = image.validation;
            const isValid = validation?.isValid;
            
            return (
              <div key={image.id} className="relative group">
                <div className="aspect-[3/4] bg-crd-darkGray rounded-lg overflow-hidden border border-crd-mediumGray relative">
                  <img
                    src={image.preview}
                    alt={`Upload ${image.file.name}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Processing Overlay */}
                  {isImageProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  {/* Validation Status */}
                  {!isImageProcessing && validation && (
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      isValid ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {isValid ? (
                        <CheckCircle className="w-4 h-4 text-white" aria-label="Valid image" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-white" aria-label="Invalid image" />
                      )}
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    disabled={isImageProcessing}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    aria-label={`Remove ${image.file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p className="text-white text-xs truncate font-medium">
                      {image.file.name}
                    </p>
                    {validation && (
                      <div className="text-xs">
                        <p className="text-crd-lightGray">
                          {validation.metadata.width}×{validation.metadata.height} • {validation.metadata.size}
                        </p>
                        {validation.errors.length > 0 && (
                          <p className="text-red-400 truncate" title={validation.errors.join(', ')}>
                            {validation.errors[0]}
                          </p>
                        )}
                        {validation.warnings.length > 0 && validation.errors.length === 0 && (
                          <p className="text-yellow-400 truncate" title={validation.warnings.join(', ')}>
                            {validation.warnings[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
