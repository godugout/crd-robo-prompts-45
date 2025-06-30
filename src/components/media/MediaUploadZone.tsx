
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MediaUploadZoneProps {
  bucket: string;
  folder?: string;
  maxFiles?: number;
  generateThumbnail?: boolean;
  optimize?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  onUploadComplete: (files: any[]) => void;
  className?: string;
  children?: React.ReactNode;
}

export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  bucket,
  folder = '',
  maxFiles = 1,
  metadata,
  onUploadComplete,
  className,
  children
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload files');
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      path: data.path,
      publicUrl,
      metadata: {
        originalName: file.name,
        size: file.size,
        type: file.type,
        publicUrl,
        ...metadata
      }
    };
  }, [user, bucket, folder, metadata]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = acceptedFiles.slice(0, maxFiles).map(uploadFile);
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        onUploadComplete(successfulUploads);
        toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  }, [maxFiles, uploadFile, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles,
    disabled: uploading
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragActive 
          ? "border-crd-green bg-crd-green/10" 
          : "border-crd-mediumGray hover:border-crd-green",
        uploading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-8 h-8 text-crd-green animate-spin" />
          <p className="text-white">Uploading...</p>
        </div>
      ) : children ? (
        children
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-crd-green" />
              <p className="text-white">Drop files here...</p>
            </>
          ) : (
            <>
              <Image className="w-12 h-12 text-crd-lightGray" />
              <div>
                <p className="text-white mb-1">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-crd-lightGray text-sm">
                  PNG, JPG, WebP up to 50MB
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
