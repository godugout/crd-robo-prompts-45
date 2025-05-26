
import React, { useState, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Crop, RotateCw, Maximize, Minimize } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface PhotoTabProps {
  selectedTemplate: string;
  searchQuery: string;
}

export const PhotoTab = ({ selectedTemplate, searchQuery }: PhotoTabProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [cropSettings, setCropSettings] = useState({
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  const handleCropSetting = (setting: keyof typeof cropSettings, value: number) => {
    setCropSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const applyCrop = () => {
    toast.success('Photo crop applied to card!');
    setCropMode(false);
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Add Your Photo</h3>
          <p className="text-crd-lightGray text-sm">
            Replace the template content with your own image
          </p>
        </div>

        {/* Template Frame Preview */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Frame Preview</h4>
          <div className="aspect-[3/4] bg-editor-dark rounded-xl border border-editor-border relative overflow-hidden">
            <div className="absolute inset-4 border-2 border-dashed border-crd-green rounded-lg">
              {uploadedImage ? (
                <div className="w-full h-full relative overflow-hidden rounded-lg">
                  <img 
                    src={uploadedImage} 
                    alt="User uploaded" 
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${cropSettings.scale}) rotate(${cropSettings.rotation}deg) translate(${cropSettings.offsetX}px, ${cropSettings.offsetY}px)`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium">Your Photo in Frame</p>
                    <p className="text-crd-lightGray text-xs">Template: {selectedTemplate}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-crd-green mb-2 mx-auto" />
                    <p className="text-crd-green text-sm font-medium">Photo Cutout Area</p>
                    <p className="text-crd-lightGray text-xs">Upload your image here</p>
                  </div>
                </div>
              )}
            </div>
            {/* Frame overlay simulation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-4 border-gray-800 rounded-xl"></div>
              <div className="absolute top-2 left-2 right-2 h-8 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">FRAME HEADER</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-6 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white text-xs">Frame Footer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!uploadedImage && (
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm uppercase tracking-wide">Upload Photo</h4>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-crd-green bg-crd-green/10' : 'border-editor-border hover:border-crd-green/50'
            }`}>
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-crd-lightGray mb-4 mx-auto" />
              <p className="text-white font-medium mb-2">Drop your photo here</p>
              <p className="text-crd-lightGray text-sm mb-4">
                or click to browse files
              </p>
              <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
                Choose Photo
              </Button>
            </div>
          </div>
        )}

        {/* Photo Editing Tools */}
        {uploadedImage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium text-sm uppercase tracking-wide">Photo Editing</h4>
              <Button
                variant="outline"
                size="sm"
                className={`border-editor-border text-white ${cropMode ? 'bg-crd-green text-black' : ''}`}
                onClick={() => setCropMode(!cropMode)}
              >
                <Crop className="w-4 h-4 mr-1" />
                {cropMode ? 'Done' : 'Crop'}
              </Button>
            </div>

            {cropMode && (
              <div className="space-y-3 bg-editor-tool p-4 rounded-lg">
                <div>
                  <label className="text-white text-xs font-medium">Scale</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={cropSettings.scale}
                    onChange={(e) => handleCropSetting('scale', parseFloat(e.target.value))}
                    className="w-full mt-1 accent-crd-green"
                  />
                </div>
                <div>
                  <label className="text-white text-xs font-medium">Rotation</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={cropSettings.rotation}
                    onChange={(e) => handleCropSetting('rotation', parseInt(e.target.value))}
                    className="w-full mt-1 accent-crd-green"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white text-xs font-medium">X Offset</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={cropSettings.offsetX}
                      onChange={(e) => handleCropSetting('offsetX', parseInt(e.target.value))}
                      className="w-full mt-1 accent-crd-green"
                    />
                  </div>
                  <div>
                    <label className="text-white text-xs font-medium">Y Offset</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={cropSettings.offsetY}
                      onChange={(e) => handleCropSetting('offsetY', parseInt(e.target.value))}
                      className="w-full mt-1 accent-crd-green"
                    />
                  </div>
                </div>
                <Button className="w-full bg-crd-green hover:bg-crd-green/90 text-black" onClick={applyCrop}>
                  Apply Crop
                </Button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-editor-border text-white" onClick={() => setUploadedImage(null)}>
                Replace Photo
              </Button>
              <Button variant="outline" className="border-editor-border text-white">
                <RotateCw className="w-4 h-4 mr-1" />
                Auto Fit
              </Button>
            </div>
          </div>
        )}

        {/* Frame Compatibility Info */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Frame Compatibility</h4>
          <p className="text-crd-lightGray text-xs mb-3">
            Your photo will be automatically adjusted to fit all card frames while keeping static elements like logos and name plates intact.
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-crd-lightGray">Supported Formats:</span>
            <span className="text-white">JPG, PNG, WebP</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
