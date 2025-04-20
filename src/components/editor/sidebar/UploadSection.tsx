
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelection(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload || !cardEditor) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to upload images');
        return;
      }

      const result = await uploadCardImage({
        file: fileToUpload,
        cardId: cardEditor.cardData.id,
        userId: user.id,
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
        <DropZone
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          onFileChange={handleFileChange}
        />
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
