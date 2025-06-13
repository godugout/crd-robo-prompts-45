
import React from 'react';
import { MediaUploadZone } from '@/components/media/MediaUploadZone';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { toast } from 'sonner';

interface UploadSectionProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const UploadSection = ({ cardEditor }: UploadSectionProps) => {
  const { user } = useCustomAuth();

  const handleUploadComplete = (files: any[]) => {
    if (files.length > 0 && cardEditor) {
      const file = files[0];
      const publicUrl = file.metadata.publicUrl;
      
      // Update card with the uploaded image
      cardEditor.updateCardField('image_url', publicUrl);
      
      if (file.thumbnail_path) {
        cardEditor.updateCardField('thumbnail_url', file.metadata.publicUrl);
        cardEditor.updateDesignMetadata('thumbnailUrl', file.metadata.publicUrl);
      }
      
      toast.success('Card image updated successfully!');
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-crd-lightGray mb-4">Please sign in to upload images</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="section" aria-label="File upload section">
      <h3 className="text-white font-medium">Upload Image</h3>
      
      <MediaUploadZone
        bucket="card-assets"
        folder="card-images"
        maxFiles={1}
        generateThumbnail={true}
        optimize={true}
        tags={['card-image']}
        onUploadComplete={handleUploadComplete}
        className="min-h-[200px]"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🖼️</span>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-2">
              Upload Card Image
            </h3>
            <p className="text-crd-lightGray">
              Drag & drop your image here or click to browse
            </p>
          </div>
          
          <div className="text-sm text-crd-lightGray">
            PNG, JPG, WebP up to 50MB
          </div>
        </div>
      </MediaUploadZone>
    </div>
  );
};
