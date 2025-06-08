
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system';
import { Upload, FileImage, FolderOpen, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  isProcessing?: boolean;
  maxFiles?: number;
}

export const EnhancedDropZone: React.FC<EnhancedDropZoneProps> = ({
  onFilesAdded,
  isProcessing = false,
  maxFiles = 10
}) => {
  const [dragDepth, setDragDepth] = useState(0);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const reasons = rejectedFiles.map(f => f.errors[0]?.message).join(', ');
      toast.warning(`Some files were rejected: ${reasons}`);
    }

    if (acceptedFiles.length > maxFiles) {
      toast.warning(`Only first ${maxFiles} files will be processed`);
      onFilesAdded(acceptedFiles.slice(0, maxFiles));
    } else {
      onFilesAdded(acceptedFiles);
    }

    setDragDepth(0);
    setDraggedFiles([]);
  }, [onFilesAdded, maxFiles]);

  const onDragEnter = useCallback((e: any) => {
    setDragDepth(prev => prev + 1);
    
    // Preview dragged files
    if (e.dataTransfer?.items) {
      const files = Array.from(e.dataTransfer.items)
        .filter((item: any) => item.kind === 'file')
        .map((item: any) => item.getAsFile())
        .filter(Boolean) as File[];
      setDraggedFiles(files.slice(0, 3)); // Show preview of first 3 files
    }
  }, []);

  const onDragLeave = useCallback(() => {
    setDragDepth(prev => {
      const newDepth = prev - 1;
      if (newDepth === 0) {
        setDraggedFiles([]);
      }
      return newDepth;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxFiles,
    noClick: true,
    noKeyboard: true,
    disabled: isProcessing
  });

  const handleFolderUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true;
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > maxFiles) {
        toast.warning(`Only first ${maxFiles} images will be processed`);
        onFilesAdded(imageFiles.slice(0, maxFiles));
      } else {
        onFilesAdded(imageFiles);
      }
    };
    
    input.click();
  }, [onFilesAdded, maxFiles]);

  const isDragging = dragDepth > 0;

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
        isDragging
          ? 'border-crd-green bg-crd-green/20 scale-105'
          : isDragActive
          ? 'border-crd-green bg-crd-green/10'
          : 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-darkGray/50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enhanced upload drop zone"
    >
      <input {...getInputProps()} aria-label="File input for enhanced upload" />
      
      {/* Animated background effect when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-br from-crd-green/30 to-crd-blue/30 rounded-xl animate-pulse" />
      )}
      
      <div className="relative z-10 space-y-6">
        <div className="w-20 h-20 rounded-full bg-crd-mediumGray flex items-center justify-center mx-auto">
          <FileImage className={`w-10 h-10 transition-colors ${
            isDragging ? 'text-crd-green animate-bounce' : 'text-crd-lightGray'
          }`} aria-hidden="true" />
        </div>
        
        <div>
          <h3 className="text-crd-white font-medium text-xl mb-2">
            {isDragging 
              ? `Drop ${draggedFiles.length} file${draggedFiles.length !== 1 ? 's' : ''} here!`
              : isDragActive 
              ? 'Release to upload files'
              : 'Enhanced Bulk Upload'
            }
          </h3>
          <p className="text-crd-lightGray text-sm max-w-md mx-auto">
            {isDragging 
              ? 'Release to add these files to your processing queue'
              : 'Drag multiple images, folders, or use the upload options below'
            }
          </p>
        </div>

        {/* File preview when dragging */}
        {draggedFiles.length > 0 && (
          <div className="flex justify-center gap-2">
            {draggedFiles.slice(0, 3).map((file, index) => (
              <div key={index} className="w-12 h-12 bg-crd-darkGray rounded border border-crd-green flex items-center justify-center">
                <FileImage className="w-6 h-6 text-crd-green" />
              </div>
            ))}
            {draggedFiles.length > 3 && (
              <div className="w-12 h-12 bg-crd-darkGray rounded border border-crd-green flex items-center justify-center">
                <span className="text-xs text-crd-green">+{draggedFiles.length - 3}</span>
              </div>
            )}
          </div>
        )}

        {!isDragging && !isDragActive && (
          <div className="flex flex-wrap justify-center gap-3">
            <CRDButton
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              variant="primary"
              disabled={isProcessing}
              className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
              aria-label="Select multiple images"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Images
            </CRDButton>
            
            <CRDButton
              onClick={(e) => {
                e.stopPropagation();
                handleFolderUpload();
              }}
              variant="secondary"
              disabled={isProcessing}
              className="bg-crd-lightGray hover:bg-crd-lightGray/90 text-black font-medium"
              aria-label="Upload entire folder"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Upload Folder
            </CRDButton>
          </div>
        )}
        
        <div className="text-xs text-crd-lightGray">
          Supports JPG, PNG, WebP • Max {maxFiles} images • Enhanced drag & drop
        </div>
      </div>
    </div>
  );
};
