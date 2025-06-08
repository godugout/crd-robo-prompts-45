
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system';
import { Upload, X, CheckCircle, AlertCircle, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { UploadedImage } from '../hooks/useCardUploadSession';

interface ImageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata: {
    width: number;
    height: number;
    size: string;
    format: string;
  };
}

interface CardsUploadPhaseProps {
  uploadedImages: UploadedImage[];
  onImagesUploaded: (images: UploadedImage[]) => void;
  onStartDetection: (images: UploadedImage[]) => void;
}

export const CardsUploadPhase: React.FC<CardsUploadPhaseProps> = ({
  uploadedImages,
  onImagesUploaded,
  onStartDetection
}) => {
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [validationResults, setValidationResults] = useState<Map<string, ImageValidation>>(new Map());

  const validateImage = async (file: File): Promise<ImageValidation> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check minimum dimensions for card detection
        if (img.width < 200 || img.height < 280) {
          errors.push('Image too small for reliable card detection (minimum 200x280px)');
        }
        
        // Check if image is too large
        if (file.size > 15 * 1024 * 1024) {
          errors.push('File size too large (maximum 15MB)');
        }
        
        // Check aspect ratio warnings
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.5 || aspectRatio > 2) {
          warnings.push('Unusual aspect ratio - may affect card detection accuracy');
        }
        
        // Check resolution warnings
        if (img.width < 400 || img.height < 560) {
          warnings.push('Low resolution - consider using higher quality image');
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
          errors: ['Invalid image file'],
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

  const processUploadedImage = async (file: File, id: string) => {
    setLoadingImages(prev => new Set(prev).add(id));
    
    try {
      const validation = await validateImage(file);
      setValidationResults(prev => new Map(prev).set(id, validation));
      
      if (!validation.isValid) {
        toast.error(`Validation failed for ${file.name}`, {
          description: validation.errors.join(', ')
        });
      } else if (validation.warnings.length > 0) {
        toast.warning(`Warnings for ${file.name}`, {
          description: validation.warnings.join(', ')
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResults(prev => new Map(prev).set(id, {
        isValid: false,
        errors: ['Failed to validate image'],
        warnings: [],
        metadata: {
          width: 0,
          height: 0,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          format: file.type.split('/')[1]?.toUpperCase() || 'Unknown'
        }
      }));
    } finally {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file)
    }));

    onImagesUploaded([...uploadedImages, ...newImages]);
    
    // Process each image for validation
    for (const image of newImages) {
      await processUploadedImage(image.file, image.id);
    }
    
    toast.success(`Added ${acceptedFiles.length} image${acceptedFiles.length > 1 ? 's' : ''} for validation`);
  }, [uploadedImages, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 10
  });

  const removeImage = (imageId: string) => {
    const updatedImages = uploadedImages.filter(img => img.id !== imageId);
    onImagesUploaded(updatedImages);
    
    setValidationResults(prev => {
      const newMap = new Map(prev);
      newMap.delete(imageId);
      return newMap;
    });
    
    toast.success('Image removed');
  };

  const clearAllImages = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    onImagesUploaded([]);
    setValidationResults(new Map());
    setLoadingImages(new Set());
    toast.success('All images cleared');
  };

  const getValidImages = () => {
    return uploadedImages.filter(img => {
      const validation = validationResults.get(img.id);
      return validation?.isValid === true;
    });
  };

  const handleContinueToDetection = () => {
    const validImages = getValidImages();
    if (validImages.length === 0) {
      toast.error('Please upload valid images before proceeding');
      return;
    }
    onStartDetection(validImages);
  };

  const validImageCount = getValidImages().length;
  const hasLoadingImages = loadingImages.size > 0;
  const canProceed = validImageCount > 0 && !hasLoadingImages;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-crd-white mb-2">
          {isDragActive ? 'Drop images here' : 'Upload Card Images'}
        </h3>
        <p className="text-crd-lightGray text-lg">
          Drag and drop your trading card images, or click to browse
        </p>
        <p className="text-crd-lightGray text-sm mt-2">
          Supports JPG, PNG, WebP • Max 10 images • Minimum 200x280px recommended
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-crd-mediumGray hover:border-crd-green/50'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload images for card detection"
      >
        <input {...getInputProps()} aria-label="Image file input" />
        <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" aria-hidden="true" />
        <div className="space-y-2">
          <p className="text-crd-white font-medium">
            {isDragActive ? 'Release to add images' : 'Choose images or drag them here'}
          </p>
          <p className="text-crd-lightGray text-sm">
            Images will be validated for card detection compatibility
          </p>
        </div>
      </div>
      
      {/* Upload Progress & Status */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-crd-white font-medium">
                Uploaded Images ({uploadedImages.length})
              </h4>
              <p className="text-sm text-crd-lightGray">
                {validImageCount} valid • {hasLoadingImages ? 'Validating...' : 'Ready for detection'}
              </p>
            </div>
            <div className="flex gap-2">
              <CRDButton
                variant="outline"
                onClick={clearAllImages}
                disabled={hasLoadingImages}
                aria-label="Clear all uploaded images"
              >
                Clear All
              </CRDButton>
              <CRDButton
                variant="primary"
                onClick={handleContinueToDetection}
                disabled={!canProceed}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                aria-label={`Continue to detection with ${validImageCount} valid images`}
              >
                Continue to Detection ({validImageCount})
              </CRDButton>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => {
              const isLoading = loadingImages.has(image.id);
              const validation = validationResults.get(image.id);
              const isValid = validation?.isValid;
              
              return (
                <div key={image.id} className="relative group">
                  <div className="aspect-[3/4] bg-crd-darkGray rounded-lg overflow-hidden border-2 border-crd-mediumGray relative">
                    {/* Image */}
                    <img
                      src={image.preview}
                      alt={`Upload ${image.file.name}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Loading Overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    
                    {/* Validation Status */}
                    {!isLoading && validation && (
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
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeImage(image.id)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      aria-label={`Remove ${image.file.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Image Info */}
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
        </div>
      )}
    </div>
  );
};
