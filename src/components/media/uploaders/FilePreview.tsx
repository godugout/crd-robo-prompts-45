
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import type { UploadingFile } from './types';

interface FilePreviewProps {
  file: UploadingFile;
  onRemove: () => void;
  disabled?: boolean;
}

export const FilePreview = ({ file, onRemove, disabled }: FilePreviewProps) => (
  <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
    {file.file.type.startsWith('image/') ? (
      <img
        src={file.preview}
        alt={`Preview ${file.file.name}`}
        className="w-full h-full object-cover"
      />
    ) : file.file.type.startsWith('video/') ? (
      <video
        src={file.preview}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">Audio file</p>
      </div>
    )}
    
    {file.status === 'uploading' && (
      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
        <Progress value={file.progress} className="w-2/3" />
      </div>
    )}

    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2"
      onClick={onRemove}
      disabled={disabled}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);
