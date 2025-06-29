
import React, { useState } from 'react';
import { MediaUploadZone } from '@/components/media/MediaUploadZone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export const LogoUploader = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = async (files: any[]) => {
    if (files.length > 0) {
      const file = files[0];
      const publicUrl = file.metadata.publicUrl;
      
      console.log('Logo uploaded successfully:', publicUrl);
      toast.success('Logo uploaded to storage successfully!');
      
      // Here you could update a config or notify other components
      // For now, we'll just log the URL for manual update
      console.log('Update the CardshowLogo component to use:', publicUrl);
    }
  };

  const uploadCurrentLogo = async () => {
    setIsUploading(true);
    try {
      // Fetch the current logo from the lovable uploads
      const response = await fetch('/lovable-uploads/e4fec02d-cb72-4dd5-955e-ead1e8e3020c.png');
      const blob = await response.blob();
      const file = new File([blob], 'cardshow-logo-script.png', { type: 'image/png' });
      
      // This would trigger the upload process
      console.log('Ready to upload file:', file);
      toast.info('Use the upload zone below to upload the logo to storage');
    } catch (error) {
      console.error('Error preparing logo for upload:', error);
      toast.error('Failed to prepare logo for upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6 bg-editor-dark border-editor-border">
        <h2 className="text-white text-xl font-semibold mb-4">Logo Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="/lovable-uploads/e4fec02d-cb72-4dd5-955e-ead1e8e3020c.png"
              alt="Current Logo"
              className="h-12 w-auto border border-editor-border rounded"
            />
            <div>
              <p className="text-white">Current Cardshow Script Logo</p>
              <p className="text-crd-lightGray text-sm">Ready to upload to storage</p>
            </div>
          </div>
          
          <Button 
            onClick={uploadCurrentLogo} 
            disabled={isUploading}
            className="bg-crd-orange hover:bg-crd-orange/90"
          >
            {isUploading ? 'Preparing...' : 'Prepare for Storage Upload'}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-editor-dark border-editor-border">
        <h3 className="text-white text-lg font-medium mb-4">Upload Logo to Storage</h3>
        
        <MediaUploadZone
          bucket="static-assets"
          folder="brand"
          maxFiles={1}
          generateThumbnail={false}
          optimize={true}
          tags={['logo', 'brand']}
          onUploadComplete={handleUploadComplete}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                Upload Logo to Storage
              </h3>
              <p className="text-crd-lightGray">
                Drop the Cardshow script logo here to store it properly
              </p>
            </div>
            
            <div className="text-sm text-crd-lightGray">
              PNG, JPG, WebP, SVG up to 50MB
            </div>
          </div>
        </MediaUploadZone>
      </Card>
    </div>
  );
};
