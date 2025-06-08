
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { CheckSquare, Square, Trash2, RotateCcw, Play, Pause } from 'lucide-react';
import { UploadedImage } from '../../hooks/useCardUploadSession';

interface BatchOperationsBarProps {
  images: UploadedImage[];
  selectedImages: Set<string>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchRemove: (imageIds: string[]) => void;
  onBatchRetry: (imageIds: string[]) => void;
  isProcessing: boolean;
  onPauseProcessing?: () => void;
  onResumeProcessing?: () => void;
}

export const BatchOperationsBar: React.FC<BatchOperationsBarProps> = ({
  images,
  selectedImages,
  onSelectAll,
  onDeselectAll,
  onBatchRemove,
  onBatchRetry,
  isProcessing,
  onPauseProcessing,
  onResumeProcessing
}) => {
  const allSelected = images.length > 0 && selectedImages.size === images.length;
  const someSelected = selectedImages.size > 0;
  const selectedArray = Array.from(selectedImages);

  if (images.length === 0) return null;

  return (
    <div className="bg-crd-darkGray border border-crd-mediumGray rounded-lg p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Select All/None */}
          <CRDButton
            onClick={allSelected ? onDeselectAll : onSelectAll}
            variant="ghost"
            size="sm"
            className="text-crd-lightGray hover:text-crd-white"
            aria-label={allSelected ? 'Deselect all images' : 'Select all images'}
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 mr-2" />
            ) : (
              <Square className="w-4 h-4 mr-2" />
            )}
            {allSelected ? 'Deselect All' : 'Select All'}
          </CRDButton>

          {/* Selection count */}
          <span className="text-sm text-crd-lightGray">
            {selectedImages.size} of {images.length} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Processing controls */}
          {isProcessing && (onPauseProcessing || onResumeProcessing) && (
            <CRDButton
              onClick={isProcessing ? onPauseProcessing : onResumeProcessing}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
              aria-label={isProcessing ? 'Pause processing' : 'Resume processing'}
            >
              {isProcessing ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Pause' : 'Resume'}
            </CRDButton>
          )}

          {/* Batch retry for failed images */}
          {someSelected && (
            <CRDButton
              onClick={() => onBatchRetry(selectedArray)}
              variant="outline"
              size="sm"
              disabled={isProcessing}
              className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
              aria-label={`Retry validation for ${selectedImages.size} selected images`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry ({selectedImages.size})
            </CRDButton>
          )}

          {/* Batch remove */}
          {someSelected && (
            <CRDButton
              onClick={() => {
                if (window.confirm(`Remove ${selectedImages.size} selected image${selectedImages.size !== 1 ? 's' : ''}?`)) {
                  onBatchRemove(selectedArray);
                }
              }}
              variant="outline"
              size="sm"
              disabled={isProcessing}
              className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              aria-label={`Remove ${selectedImages.size} selected images`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove ({selectedImages.size})
            </CRDButton>
          )}
        </div>
      </div>

      {/* Quick actions info */}
      {!someSelected && (
        <div className="mt-2 text-xs text-crd-lightGray">
          Select images to enable batch operations
        </div>
      )}
    </div>
  );
};
