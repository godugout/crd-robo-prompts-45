
import React from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DropZoneProps {
  isDragActive: boolean;
  getRootProps: () => any;
  getInputProps: () => any;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DropZone = ({
  isDragActive,
  getRootProps,
  getInputProps,
  onFileChange
}: DropZoneProps) => {
  return (
    <div 
      {...getRootProps()}
      className={`p-4 border-2 border-dashed ${isDragActive ? 'border-cardshow-green bg-editor-tool/30' : 'border-editor-border'} rounded-lg text-center transition-colors`}
    >
      <div className="flex flex-col items-center justify-center py-8">
        <Upload className="w-10 h-10 text-cardshow-lightGray mb-3" />
        <p className="text-cardshow-white font-medium">Upload Card Art</p>
        <p className="text-xs text-cardshow-lightGray mt-1">
          {isDragActive ? 'Drop the file here' : 'Drag or choose your file to upload'}
        </p>
        <Input 
          {...getInputProps()}
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={onFileChange} 
          accept="image/*"
        />
        <label 
          htmlFor="file-upload" 
          className="mt-4 px-4 py-2 bg-editor-dark border border-editor-border rounded-lg text-cardshow-white text-sm hover:bg-editor-tool cursor-pointer"
        >
          Browse Files
        </label>
      </div>
    </div>
  );
};
