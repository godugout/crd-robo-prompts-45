
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { CheckSquare, Square, X, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { UploadedImage } from '../../hooks/useCardUploadSession';

interface SimpleImageGridProps {
  images: UploadedImage[];
  selectedImages: Set<string>;
  onToggleSelection: (imageId: string) => void;
  onRemoveImage: (imageId: string) => void;
  onRetryImage: (imageId: string) => void;
  validationResults: Map<string, any>;
  isProcessing: boolean;
}

export const SimpleImageGrid: React.FC<SimpleImageGridProps> = ({
  images,
  selectedImages,
  onToggleSelection,
  onRemoveImage,
  onRetryImage,
  validationResults,
  isProcessing
}) => {
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-crd-lightGray">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div className="bg-crd-darkGray border border-crd-mediumGray rounded-lg p-4">
      <div className="mb-4">
        <h4 className="text-crd-white font-medium mb-2">
          Uploaded Images ({images.length})
        </h4>
        <div className="text-sm text-crd-lightGray">
          Review your uploaded images before detection
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => {
          const isSelected = selectedImages.has(image.id);
          const validation = validationResults.get(image.id);
          const isValid = validation?.isValid;

          return (
            <div key={image.id} className="relative group">
              <div className={`aspect-[3/4] bg-crd-darkGray rounded-lg overflow-hidden border-2 transition-all ${
                isSelected 
                  ? 'border-crd-green shadow-lg shadow-crd-green/20' 
                  : isValid === false
                  ? 'border-red-500/50'
                  : 'border-crd-mediumGray hover:border-crd-green/50'
              }`}>
                {/* Selection checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <CRDButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelection(image.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded ${
                      isSelected 
                        ? 'bg-crd-green text-black' 
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${image.file.name}`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3 h-3" />
                    ) : (
                      <Square className="w-3 h-3" />
                    )}
                  </CRDButton>
                </div>

                {/* Image */}
                <img
                  src={image.preview}
                  alt={`Upload ${image.file.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Status indicator */}
                <div className="absolute top-2 right-2">
                  {validation && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isValid ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {isValid ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                </div>

                {/* Hover controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isValid && validation && (
                    <CRDButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onRetryImage(image.id);
                      }}
                      variant="secondary"
                      size="sm"
                      className="bg-crd-lightGray hover:bg-crd-lightGray/90 text-black"
                      aria-label={`Retry validation for ${image.file.name}`}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </CRDButton>
                  )}
                  
                  <CRDButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                    disabled={isProcessing}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    aria-label={`Remove ${image.file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </CRDButton>
                </div>

                {/* Image info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate font-medium">
                    {image.file.name}
                  </p>
                  {validation && (
                    <div className="text-xs">
                      <p className="text-crd-lightGray">
                        {validation.metadata?.width || 0}×{validation.metadata?.height || 0}
                      </p>
                      {validation.errors?.length > 0 && (
                        <p className="text-red-400 truncate" title={validation.errors.join(', ')}>
                          {validation.errors[0]}
                        </p>
                      )}
                      {validation.warnings?.length > 0 && !validation.errors?.length && (
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
  );
};
