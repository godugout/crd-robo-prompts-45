
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FrameRenderer } from '../../frames/FrameRenderer';

interface ImageUploadStepProps {
  selectedFrame?: string;
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUploadStep: React.FC<ImageUploadStepProps> = ({
  selectedFrame,
  onImageUpload
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('Processing file:', file.name, file.size);
      const imageUrl = URL.createObjectURL(file);
      console.log('Created blob URL:', imageUrl);
      onImageUpload(imageUrl);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false
  });

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Browse button clicked, opening file dialog');
    open();
  };

  return (
    <div className="flex h-full">
      {/* Upload Area */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Add Your Image</h3>
            <p className="text-gray-400">
              Upload the photo you want to use in your {selectedFrame ? 'selected frame' : 'card'}.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-crd-green bg-crd-green/5' 
                : 'border-gray-600 hover:border-crd-green/50 hover:bg-crd-green/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-crd-green/20 to-crd-green/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-crd-green" />
              </div>
              <div>
                <h4 className="text-white font-medium text-lg mb-2">
                  {isDragActive ? 'Drop your image here' : 'Upload Your Image'}
                </h4>
                <p className="text-gray-400 text-sm">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Supports JPG, PNG, WebP • Max 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleBrowseClick}
              className="w-full bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Image className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>

      {/* Frame Preview */}
      <div className="w-80 bg-editor-dark border-l border-editor-border p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Frame Preview</h4>
        <div className="aspect-[5/7] bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden">
          {selectedFrame ? (
            <div className="w-full h-full">
              <FrameRenderer
                frameId={selectedFrame}
                title="Your Card Title"
                subtitle="Upload an image to see it in this frame"
                width={280}
                height={392}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-700 rounded mx-auto mb-4"></div>
              <p className="text-sm">No frame selected</p>
              <p className="text-xs mt-2">Go back to select a frame first</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-editor-darker rounded-lg">
          <h5 className="text-white text-sm font-medium mb-1">Tips:</h5>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• Use high-resolution images for best quality</li>
            <li>• Square or portrait images work best</li>
            <li>• You can adjust positioning in the next step</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
