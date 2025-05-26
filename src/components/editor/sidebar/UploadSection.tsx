
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
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
  const { user } = useCustomAuth();

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

    if (!user) {
      toast.error('You must be logged in to upload images');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadCardImage({
        file: fileToUpload,
        cardId: cardEditor.cardData.id,
        userId: user.id,
        onProgress: setUploadProgress
      });

      if (result) {
        cardEditor.updateCardField('image_url', result.url);
        if (result.thumbnailUrl) {
          cardEditor.updateCardField('thumbnail_url', result.thumbnailUrl);
          cardEditor.updateDesignMetadata('thumbnailUrl', result.thumbnailUrl);
        }
        
        toast.success('Image uploaded successfully', {
          description: 'Your card image has been updated.',
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
