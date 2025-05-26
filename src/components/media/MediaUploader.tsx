
import React, { useState, useRef } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { DropZone } from './DropZone';
import { MediaPreview } from './MediaPreview';
import type { MediaItem } from '@/types/media';

interface MediaUploaderProps {
  memoryId: string;
  userId: string;
  onUploadComplete: (mediaItem: MediaItem) => void;
  onError?: (error: Error) => void;
  isPrivate?: boolean;
  detectFaces?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  memoryId,
  userId,
  onUploadComplete,
  onError,
  isPrivate = false,
  detectFaces = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { upload, isUploading, progress } = useMediaUpload({
    memoryId,
    userId,
    isPrivate,
    detectFaces
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
      const mediaItem = await upload(selectedFile);
      if (mediaItem) {
        onUploadComplete(mediaItem);
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
