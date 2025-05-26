
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Crop, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoUploadCanvasProps {
  onPhotoSelect: (file: File, preview: string) => void;
}

export const PhotoUploadCanvas = ({ onPhotoSelect }: PhotoUploadCanvasProps) => {
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
        const preview = reader.result as string;
        setUploadedImage(preview);
        onPhotoSelect(file, preview);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: !!uploadedImage,
    noKeyboard: true
  });

  const handleCropSetting = (setting: keyof typeof cropSettings, value: number) => {
    setCropSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const applyChanges = () => {
    toast.success('Photo changes applied!');
    setCropMode(false);
  };

  const removePhoto = () => {
    setUploadedImage(null);
    setCropSettings({
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0
    });
    toast.success('Photo removed');
  };

  if (!uploadedImage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div 
          {...getRootProps()}
          className={`w-80 h-96 border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-editor-border hover:border-crd-green/50 hover:bg-gray-800/50'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-6">
            <Upload className="w-16 h-16 text-crd-lightGray" />
            <div className="text-white text-xl font-medium">
              {isDragActive ? 'Drop photo here' : 'Upload Your Photo'}
            </div>
            <div className="text-crd-lightGray text-sm max-w-md">
              {isDragActive 
                ? 'Release to upload your photo' 
                : 'Drag and drop your photo here, or click to browse files'
              }
            </div>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {/* Photo Preview */}
      <div className="relative">
        <div 
          className="relative bg-editor-canvas rounded-xl shadow-xl overflow-hidden"
          style={{ width: 320, height: 420 }}
        >
          <img 
            src={uploadedImage}
            alt="Uploaded photo" 
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${cropSettings.scale}) rotate(${cropSettings.rotation}deg) translate(${cropSettings.offsetX}px, ${cropSettings.offsetY}px)`
            }}
          />
          
          {/* Frame overlay simulation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-4 border-gray-800/50 rounded-xl"></div>
            <div className="absolute top-2 left-2 right-2 h-8 bg-black/70 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">FRAME HEADER</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 h-6 bg-black/70 rounded flex items-center justify-center">
              <span className="text-white text-xs">Frame Footer</span>
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={removePhoto}
            className="absolute top-4 right-4 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photo Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCropMode(!cropMode)}
          className={`border-editor-border text-white ${cropMode ? 'bg-crd-green text-black' : ''}`}
        >
          <Crop className="w-4 h-4 mr-2" />
          {cropMode ? 'Done Editing' : 'Edit Photo'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setCropSettings({
              scale: 1,
              rotation: 0,
              offsetX: 0,
              offsetY: 0
            });
            toast.success('Photo reset to original');
          }}
          className="border-editor-border text-white"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Crop Controls */}
      {cropMode && (
        <div className="bg-editor-tool p-4 rounded-lg w-80">
          <h4 className="text-white font-medium text-sm mb-4">Photo Adjustments</h4>
          <div className="space-y-3">
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
              <span className="text-crd-lightGray text-xs">{cropSettings.scale}x</span>
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
              <span className="text-crd-lightGray text-xs">{cropSettings.rotation}°</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-white text-xs font-medium">X Position</label>
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
                <label className="text-white text-xs font-medium">Y Position</label>
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
            <Button 
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black mt-4" 
              onClick={applyChanges}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
