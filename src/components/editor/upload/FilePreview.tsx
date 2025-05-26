
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';

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
    <div className="p-4 border-2 border-editor-border rounded-lg bg-editor-tool">
      <div className="flex flex-col items-center">
        <div className="relative w-full aspect-square mb-4 bg-editor-darker rounded-lg overflow-hidden">
          {uploadPreview && (
            <img 
              src={uploadPreview} 
              alt="Upload preview" 
              className="w-full h-full object-cover"
            />
          )}
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-crd-green border-t-transparent animate-spin mb-2"></div>
                <div className="text-white font-bold">{uploadProgress}%</div>
              </div>
            </div>
          )}
          
          {!isUploading && (
            <button
              onClick={onCancel}
              className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="text-center mb-4">
          <p className="text-crd-white font-medium truncate w-full max-w-[200px]">
            {file.name}
          </p>
          <p className="text-xs text-crd-lightGray">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 border-editor-border text-crd-lightGray hover:bg-editor-dark"
            onClick={onCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            onClick={onUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
