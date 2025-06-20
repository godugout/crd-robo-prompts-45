
import React from 'react';
import { MediaUploader } from '@/components/media/MediaUploader';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface StudioMediaUploaderProps {
  onUploadComplete: (publicUrl: string) => void;
  onError?: (error: Error) => void;
}

export const StudioMediaUploader: React.FC<StudioMediaUploaderProps> = ({
  onUploadComplete,
  onError
}) => {
  const handleUploadComplete = (mediaItem: any) => {
    console.log('🎯 Studio media upload completed:', mediaItem);
    
    if (mediaItem?.metadata?.publicUrl) {
      onUploadComplete(mediaItem.metadata.publicUrl);
      toast.success('Image uploaded successfully for studio!');
    } else {
      const error = new Error('No public URL returned from upload');
      console.error('❌ Studio upload error:', error);
      onError?.(error);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('❌ Studio upload error:', error);
    toast.error(`Upload failed: ${error.message}`);
    onError?.(error);
  };

  return (
    <Card className="p-4 bg-editor-tool border-editor-border">
      <div className="space-y-3">
        <h3 className="text-white font-medium text-sm">Upload Card Image</h3>
        <p className="text-crd-lightGray text-xs">
          Upload images for your trading card using our optimized media pipeline
        </p>
        
        <MediaUploader
          bucket="card-assets"
          folder="studio-uploads"
          onUploadComplete={handleUploadComplete}
          onError={handleUploadError}
          generateThumbnail={true}
          optimize={true}
          tags={['studio', 'card-image']}
          metadata={{
            source: 'studio',
            purpose: 'card-creation'
          }}
        />
      </div>
    </Card>
  );
};
