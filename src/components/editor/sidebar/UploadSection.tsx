
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const UploadSection = () => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileToUpload(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('File selected', { 
        description: file.name
      });
    }
  };
  
  const handleUpload = () => {
    if (fileToUpload) {
      toast.success('File uploaded successfully', { 
        description: fileToUpload.name,
        action: {
          label: 'View',
          onClick: () => console.log('Viewing uploaded file')
        }
      });
      setFileToUpload(null);
      setUploadPreview(null);
    }
  };

  return (
    <div className="space-y-4">
      {!fileToUpload ? (
        <div className="p-4 border-2 border-dashed border-editor-border rounded-lg text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="w-10 h-10 text-cardshow-lightGray mb-3" />
            <p className="text-cardshow-white font-medium">Upload Card Files</p>
            <p className="text-xs text-cardshow-lightGray mt-1">Drag or choose your file to upload</p>
            <Input 
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
                onClick={() => {
                  setFileToUpload(null);
                  setUploadPreview(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                className="flex-1 bg-cardshow-green text-white"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
