
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase-client';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useCardEditor } from '@/hooks/useCardEditor';
import { DropZone } from '../upload/DropZone';
import { FilePreview } from '../upload/FilePreview';

interface UploadSectionProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const UploadSection = ({ cardEditor }: UploadSectionProps) => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelection = (file: File) => {
    setFileToUpload(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast.success('File selected', { 
      description: file.name
    });
  };

  const handleUpload = async () => {
    if (!fileToUpload || !cardEditor) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate a mock user ID for development/testing
      const mockUserId = 'test-user-' + Math.random().toString(36).substring(2, 9);
      
      const result = await uploadCardImage({
        file: fileToUpload,
        cardId: cardEditor.cardData.id,
        userId: mockUserId,
        onProgress: setUploadProgress
      });

      if (result) {
        cardEditor.updateCardField('image_url', result.url);
        cardEditor.updateDesignMetadata('thumbnailUrl', result.thumbnailUrl);
        
        toast.success('Image uploaded successfully', {
          description: 'Your card image has been updated.',
          action: {
            label: 'View',
            onClick: () => window.open(result.url, '_blank')
          }
        });

        cancelUpload();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const cancelUpload = () => {
    setFileToUpload(null);
    setUploadPreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      {!fileToUpload ? (
        <DropZone onFileSelect={handleFileSelection} />
      ) : (
        <FilePreview
          file={fileToUpload}
          uploadPreview={uploadPreview}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onCancel={cancelUpload}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};
