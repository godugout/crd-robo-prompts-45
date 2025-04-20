
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash } from 'lucide-react';

interface MediaPreviewProps {
  file: File;
  preview: string;
  isUploading: boolean;
  uploadProgress: number;
  onRemove: () => void;
  onUpload: () => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  preview,
  isUploading,
  uploadProgress,
  onRemove,
  onUpload
}) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <div className="aspect-video bg-black flex items-center justify-center">
        {file.type.startsWith('image/') ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-full max-w-full object-contain"
          />
        ) : file.type.startsWith('video/') ? (
          <video 
            src={preview} 
            controls 
            className="max-h-full max-w-full"
          />
        ) : (
          <div className="text-white">Unsupported file type</div>
        )}
      </div>
      
      <div className="p-3 bg-white">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm truncate">{file.name}</div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            disabled={isUploading}
          >
            <Trash size={16} className="text-gray-500" />
          </Button>
        </div>
        
        {isUploading ? (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <div className="text-xs text-gray-500 text-right">
              {Math.round(uploadProgress)}%
            </div>
          </div>
        ) : (
          <Button 
            onClick={onUpload} 
            size="sm" 
            className="w-full"
          >
            Upload
          </Button>
        )}
      </div>
    </div>
  );
};
