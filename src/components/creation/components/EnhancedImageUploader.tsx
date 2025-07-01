
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EnhancedImageUploaderProps {
  onImageUpload: (file: File, url: string) => void;
}

export const EnhancedImageUploader: React.FC<EnhancedImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    
    try {
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
      <Card className="relative bg-gray-700 border-gray-600 overflow-hidden">
        <img 
          src={preview} 
          alt="Uploaded preview" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            onClick={clearImage}
            size="sm"
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
          Click to remove
        </div>
      </Card>
    );
  }

  return (
    <Card
      {...getRootProps()}
      className={`
        border-2 border-dashed cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-purple-400 bg-purple-50/10' 
          : 'border-gray-600 hover:border-purple-500/50 bg-gray-700/30'
        }
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="p-8 text-center space-y-4">
        {uploading ? (
          <div className="animate-spin w-8 h-8 mx-auto">
            <Upload className="w-8 h-8 text-purple-400" />
          </div>
        ) : (
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-600/20 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-purple-400" />
          </div>
        )}
        
        <div>
          <p className="text-white font-medium text-lg">
            {uploading 
              ? 'Processing...' 
              : isDragActive 
              ? 'Drop your image here!' 
              : 'Drag & drop an image'
            }
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {!uploading && 'Supports JPG, PNG, WebP • Max 10MB'}
          </p>
        </div>

        {!uploading && (
          <Button 
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        )}
      </div>
    </Card>
  );
};
