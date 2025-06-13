
import React, { useState, useRef } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { DropZone } from './DropZone';
import { MediaPreview } from './MediaPreview';
import type { MediaItem } from '@/types/media';

interface MediaUploaderProps {
  bucket: 'static-assets' | 'user-content' | 'card-assets';
  folder?: string;
  onUploadComplete: (mediaItem: any) => void;
  onError?: (error: Error) => void;
  generateThumbnail?: boolean;
  optimize?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  bucket,
  folder,
  onUploadComplete,
  onError,
  generateThumbnail = true,
  optimize = true,
  tags = [],
  metadata = {}
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, isUploading, progress } = useMediaUpload({
    bucket,
    folder,
    generateThumbnail,
    optimize,
    tags,
    metadata,
    onComplete: onUploadComplete,
    onError: (error) => onError?.(new Error(error))
  });

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      createPreview(file);
    }
  };
  
  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      createPreview(file);
    }
  };
  
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const mediaItem = await uploadFile(selectedFile);
      if (mediaItem) {
        handleRemoveFile();
      }
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
    }
  };
  
  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      
      {!selectedFile ? (
        <DropZone
          onBrowse={handleBrowseClick}
          onCamera={handleCameraClick}
          onFileSelect={handleFileSelect}
        />
      ) : (
        <MediaPreview
          file={selectedFile}
          preview={preview || ''}
          isUploading={isUploading}
          uploadProgress={progress}
          onRemove={handleRemoveFile}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};
