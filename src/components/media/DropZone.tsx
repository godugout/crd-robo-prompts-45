
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

interface DropZoneProps {
  onBrowse: () => void;
  onCamera: () => void;
  onFileSelect: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onBrowse, onCamera, onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    noClick: true,
    noKeyboard: true
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${
        isDragActive 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <p className="text-gray-700 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag and drop files here, or'}
        </p>
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onBrowse();
            }}
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload size={16} />
            Browse
          </Button>
          
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onCamera();
            }}
            size="sm"
            className="flex items-center gap-1"
          >
            <Camera size={16} />
            Camera
          </Button>
        </div>
      </div>
    </div>
  );
};
