
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (file: File, url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageUpload(file, url);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview('');
  };

  if (preview) {
    return (
      <div className="relative">
        <img 
          src={preview} 
          alt="Uploaded preview" 
          className="w-full h-48 object-cover rounded-lg border-2 border-gray-600"
        />
        <Button
          onClick={clearImage}
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-400 bg-blue-50/10' : 'border-gray-600 hover:border-gray-500'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        {uploading ? (
          <div className="animate-spin w-8 h-8 mx-auto">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        ) : (
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
        )}
        
        <div>
          <p className="text-white font-medium">
            {uploading ? 'Processing...' : isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {!uploading && 'or click to browse files'}
          </p>
        </div>
      </div>
    </div>
  );
};
