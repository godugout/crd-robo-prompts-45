
import React from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface FilePreviewProps {
  file: File;
  uploadPreview: string | null;
  isUploading: boolean;
  uploadProgress: number;
  onCancel: () => void;
  onUpload: () => void;
}

export const FilePreview = ({
  file,
  uploadPreview,
  isUploading,
  uploadProgress,
  onCancel,
  onUpload
}: FilePreviewProps) => {
  return (
    <div className="p-4 border-2 border-editor-border rounded-lg">
      <div className="flex flex-col items-center">
        <div className="relative w-full aspect-square mb-4 bg-editor-darker rounded-lg overflow-hidden">
          <img 
            src={uploadPreview || ''} 
            alt="Upload preview" 
            className="w-full h-full object-contain"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-16 h-16 rounded-full border-4 border-cardshow-green border-t-transparent animate-spin"></div>
              <div className="absolute text-white font-bold">{uploadProgress}%</div>
            </div>
          )}
        </div>
        <p className="text-cardshow-white font-medium text-center truncate w-full">
          {file.name}
        </p>
        <p className="text-xs text-cardshow-lightGray">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
        <div className="flex gap-2 mt-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1 text-cardshow-lightGray"
            onClick={onCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            className="flex-1 bg-cardshow-green text-white"
            onClick={onUpload}
            disabled={isUploading}
          >
            {isUploading ? `Uploading (${uploadProgress}%)` : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};
