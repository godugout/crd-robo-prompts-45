
import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useDropzone } from 'react-dropzone';

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
      // Check if user is logged in through Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to upload images');
        return;
      }

      // Upload the file
      const result = await uploadCardImage({
        file: fileToUpload,
        cardId: cardEditor.cardData.id,
        userId: user.id,
        onProgress: setUploadProgress
      });

      if (result) {
        // Update card with image URL
        cardEditor.updateCardField('image_url', result.url);
        cardEditor.updateDesignMetadata('thumbnailUrl', result.thumbnailUrl);
        
        toast.success('Image uploaded successfully', {
          description: 'Your card image has been updated.',
          action: {
            label: 'View',
            onClick: () => window.open(result.url, '_blank')
          }
        });

        // Clear the form
        setFileToUpload(null);
        setUploadPreview(null);
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
        <div 
          {...getRootProps()}
          className={`p-4 border-2 border-dashed ${isDragActive ? 'border-cardshow-green bg-editor-tool/30' : 'border-editor-border'} rounded-lg text-center transition-colors`}
        >
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="w-10 h-10 text-cardshow-lightGray mb-3" />
            <p className="text-cardshow-white font-medium">Upload Card Art</p>
            <p className="text-xs text-cardshow-lightGray mt-1">
              {isDragActive ? 'Drop the file here' : 'Drag or choose your file to upload'}
            </p>
            <Input 
              {...getInputProps()}
              type="file" 
              className="hidden" 
              id="file-upload" 
              onChange={handleFileChange} 
              accept="image/*"
            />
            <label 
              htmlFor="file-upload" 
              className="mt-4 px-4 py-2 bg-editor-dark border border-editor-border rounded-lg text-cardshow-white text-sm hover:bg-editor-tool cursor-pointer"
            >
              Browse Files
            </label>
          </div>
        </div>
      ) : (
        <div className="p-4 border-2 border-editor-border rounded-lg">
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square mb-4 bg-editor-darker rounded-lg overflow-hidden">
              <img 
                src={uploadPreview || ''} 
                alt="Upload preview" 
                className="w-full h-full object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-16 h-16 rounded-full border-4 border-cardshow-green border-t-transparent animate-spin"></div>
                  <div className="absolute text-white font-bold">{uploadProgress}%</div>
                </div>
              )}
            </div>
            <p className="text-cardshow-white font-medium text-center truncate w-full">
              {fileToUpload.name}
            </p>
            <p className="text-xs text-cardshow-lightGray">
              {(fileToUpload.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-2 mt-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1 text-cardshow-lightGray"
                onClick={cancelUpload}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                className="flex-1 bg-cardshow-green text-white"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? `Uploading (${uploadProgress}%)` : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
