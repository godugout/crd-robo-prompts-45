
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      {...getRootProps()}
      className={`p-4 border-2 border-dashed ${
        isDragActive ? 'border-cardshow-green bg-editor-tool/30' : 'border-editor-border'
      } rounded-lg text-center transition-colors cursor-pointer`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center py-8">
        <Upload className="w-10 h-10 text-cardshow-lightGray mb-3" />
        <p className="text-cardshow-white font-medium">Upload Card Art</p>
        <p className="text-xs text-cardshow-lightGray mt-1">
          {isDragActive ? 'Drop the file here' : 'Drag and drop your file here, or click to browse'}
        </p>
        <Input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={handleFileChange} 
          accept="image/*"
        />
        <label 
          htmlFor="file-upload" 
          className="mt-4 px-4 py-2 bg-editor-dark border border-editor-border rounded-lg text-cardshow-white text-sm hover:bg-editor-tool cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        >
          Browse Files
        </label>
      </div>
    </div>
  );
};
