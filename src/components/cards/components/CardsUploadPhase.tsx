
import React, { useCallback, useState, useMemo } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { UploadedImage } from '../hooks/useCardUploadSession';
import { EnhancedDropZone } from './upload/EnhancedDropZone';
import { BatchOperationsBar } from './upload/BatchOperationsBar';
import { UploadQueueManager } from './upload/UploadQueueManager';
import { ErrorRecoveryHelper } from './upload/ErrorRecoveryHelper';
import { VirtualizedImageGrid } from './upload/VirtualizedImageGrid';

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

interface QueueItem extends UploadedImage {
  priority: number;
  estimatedTime?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
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
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [processingPaused, setProcessingPaused] = useState(false);
  const [retryCount, setRetryCount] = useState<Map<string, number>>(new Map());

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
      if (!processingPaused) {
        await processUploadedImage(image.file, image.id);
      }
    }
    
    toast.success(`Added ${acceptedFiles.length} image${acceptedFiles.length > 1 ? 's' : ''} for validation`);
  }, [uploadedImages, onImagesUploaded, processingPaused]);

  // Batch operations
  const handleSelectAll = useCallback(() => {
    setSelectedImages(new Set(uploadedImages.map(img => img.id)));
  }, [uploadedImages]);

  const handleDeselectAll = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  const handleBatchRemove = useCallback((imageIds: string[]) => {
    const updatedImages = uploadedImages.filter(img => !imageIds.includes(img.id));
    onImagesUploaded(updatedImages);
    
    // Clean up validation results
    imageIds.forEach(id => {
      validationResults.delete(id);
      const img = uploadedImages.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
    });
    
    setSelectedImages(new Set());
    toast.success(`Removed ${imageIds.length} image${imageIds.length !== 1 ? 's' : ''}`);
  }, [uploadedImages, onImagesUploaded, validationResults]);

  const handleBatchRetry = useCallback(async (imageIds: string[]) => {
    for (const imageId of imageIds) {
      const image = uploadedImages.find(img => img.id === imageId);
      if (image) {
        const currentRetries = retryCount.get(imageId) || 0;
        setRetryCount(prev => new Map(prev).set(imageId, currentRetries + 1));
        await processUploadedImage(image.file, image.id);
      }
    }
    toast.success(`Retrying validation for ${imageIds.length} image${imageIds.length !== 1 ? 's' : ''}`);
  }, [uploadedImages, retryCount]);

  // Individual operations
  const handleToggleSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  const handleRemoveImage = useCallback((imageId: string) => {
    handleBatchRemove([imageId]);
  }, [handleBatchRemove]);

  const handleRetryImage = useCallback(async (imageId: string) => {
    await handleBatchRetry([imageId]);
  }, [handleBatchRetry]);

  // Processing controls
  const handlePauseProcessing = useCallback(() => {
    setProcessingPaused(true);
    toast.info('Processing paused');
  }, []);

  const handleResumeProcessing = useCallback(() => {
    setProcessingPaused(false);
    toast.info('Processing resumed');
  }, []);

  // Queue management - convert images to queue items with proper typing
  const queueItems = useMemo((): QueueItem[] => {
    return uploadedImages.map((img, index) => {
      const validation = validationResults.get(img.id);
      const isLoading = loadingImages.has(img.id);
      
      let status: 'pending' | 'processing' | 'completed' | 'failed';
      if (isLoading) {
        status = 'processing';
      } else if (validation?.isValid === true) {
        status = 'completed';
      } else if (validation?.isValid === false) {
        status = 'failed';
      } else {
        status = 'pending';
      }
      
      return {
        ...img,
        priority: index,
        estimatedTime: isLoading ? 30 : undefined,
        status,
        progress: isLoading ? 50 : validation ? 100 : 0
      };
    });
  }, [uploadedImages, validationResults, loadingImages]);

  const clearAllImages = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    onImagesUploaded([]);
    setValidationResults(new Map());
    setLoadingImages(new Set());
    setSelectedImages(new Set());
    setRetryCount(new Map());
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
  const hasErrors = Array.from(validationResults.values()).some(v => !v.isValid);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-crd-white mb-2">
          Enhanced Card Image Upload
        </h3>
        <p className="text-crd-lightGray text-lg">
          Upload multiple images with advanced batch processing and error recovery
        </p>
      </div>

      {/* Enhanced Upload Drop Zone */}
      <EnhancedDropZone
        onFilesAdded={onDrop}
        isProcessing={hasLoadingImages}
        maxFiles={20}
      />

      {/* Batch Operations Bar */}
      {uploadedImages.length > 0 && (
        <BatchOperationsBar
          images={uploadedImages}
          selectedImages={selectedImages}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBatchRemove={handleBatchRemove}
          onBatchRetry={handleBatchRetry}
          isProcessing={hasLoadingImages}
          onPauseProcessing={processingPaused ? undefined : handlePauseProcessing}
          onResumeProcessing={processingPaused ? handleResumeProcessing : undefined}
        />
      )}

      {/* Upload Queue Manager */}
      {queueItems.length > 0 && (
        <UploadQueueManager
          queueItems={queueItems}
          onMovePriority={(id, direction) => {
            // Simple priority management
            const currentIndex = uploadedImages.findIndex(img => img.id === id);
            if (currentIndex === -1) return;
            
            const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
            if (newIndex < 0 || newIndex >= uploadedImages.length) return;
            
            const newImages = [...uploadedImages];
            [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];
            onImagesUploaded(newImages);
          }}
          onRemoveFromQueue={handleRemoveImage}
          onCancelOperation={handleRemoveImage}
          isProcessing={hasLoadingImages}
        />
      )}

      {/* Error Recovery Helpers */}
      {hasErrors && (
        <div className="space-y-3">
          {uploadedImages.map(image => {
            const validation = validationResults.get(image.id);
            if (!validation || validation.isValid) return null;
            
            const errors = validation.errors.map(error => ({
              type: 'unknown' as const,
              message: error,
              suggestion: validation.warnings?.[0],
              autoRetryable: error.includes('network') || error.includes('timeout')
            }));

            return (
              <ErrorRecoveryHelper
                key={image.id}
                errors={errors}
                fileName={image.file.name}
                onRetry={() => handleRetryImage(image.id)}
                onOptimize={() => {
                  toast.info('Image optimization coming soon!');
                }}
                onShowHelp={() => {
                  toast.info('Opening help documentation...', {
                    description: 'Common upload issues and solutions'
                  });
                }}
                isRetrying={loadingImages.has(image.id)}
                retryCount={retryCount.get(image.id) || 0}
              />
            );
          })}
        </div>
      )}

      {/* Virtualized Image Grid */}
      {uploadedImages.length > 0 && (
        <VirtualizedImageGrid
          images={uploadedImages}
          selectedImages={selectedImages}
          onToggleSelection={handleToggleSelection}
          onRemoveImage={handleRemoveImage}
          onRetryImage={handleRetryImage}
          validationResults={validationResults}
          isProcessing={hasLoadingImages}
          containerWidth={800} // Mock container width
          containerHeight={400} // Mock container height
        />
      )}

      {/* Action Controls */}
      {uploadedImages.length > 0 && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-crd-white font-medium">
              Ready for Detection ({uploadedImages.length} images)
            </h4>
            <p className="text-sm text-crd-lightGray">
              {validImageCount} valid • {hasLoadingImages ? 'Processing...' : 'Ready to proceed'}
              {processingPaused && ' • Paused'}
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
      )}
    </div>
  );
};
