
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, FolderOpen, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const UploadDropZone = ({ onFilesAdded }: UploadDropZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.warning(`${acceptedFiles.length - imageFiles.length} non-image files were skipped`);
    }

    if (imageFiles.length > 0) {
      onFilesAdded(imageFiles);
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  });

  const handleFolderUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true;
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        onFilesAdded(imageFiles);
        toast.success(`Added ${imageFiles.length} images from folder`);
      }
    };
    
    input.click();
  }, [onFilesAdded]);

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        onFilesAdded(files);
      }
    };
    
    input.click();
  }, [onFilesAdded]);

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={`p-12 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
            dragActive
              ? 'border-crd-green bg-crd-green/10'
              : 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-darkGray/50'
          }`}
          role="button"
          tabIndex={0}
          aria-label="Bulk card upload drop zone"
        >
          <input {...getInputProps()} aria-label="File input for bulk upload" />
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-crd-mediumGray flex items-center justify-center mx-auto">
              <Upload className="w-10 h-10 text-crd-green" aria-hidden="true" />
            </div>
            
            <div>
              <h3 className="text-crd-white font-medium text-xl mb-2">
                {dragActive ? 'Drop your images here!' : 'Bulk Card Upload'}
              </h3>
              <p className="text-crd-lightGray text-sm max-w-md mx-auto">
                {dragActive 
                  ? 'Release to add these images to your processing queue'
                  : 'Drag and drop multiple card images, paste from clipboard (Ctrl+V), or use the upload options below'
                }
              </p>
            </div>

            {!dragActive && (
              <div className="flex flex-wrap justify-center gap-4">
                <CRDButton
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  variant="primary"
                  className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
                  aria-label="Select multiple images"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Images
                </CRDButton>
                
                <CRDButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFolderUpload();
                  }}
                  variant="secondary"
                  className="bg-crd-lightGray hover:bg-crd-lightGray/90 text-black font-medium"
                  aria-label="Upload entire folder"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Upload Folder
                </CRDButton>
                
                <CRDButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCameraCapture();
                  }}
                  variant="secondary"
                  className="bg-crd-lightGray hover:bg-crd-lightGray/90 text-black font-medium"
                  aria-label="Take photo with camera"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </CRDButton>

                <CRDButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info('Copy an image and paste it here with Ctrl+V (or Cmd+V on Mac)', {
                      duration: 4000
                    });
                  }}
                  variant="outline"
                  aria-label="Paste images from clipboard"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Paste Images
                </CRDButton>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
