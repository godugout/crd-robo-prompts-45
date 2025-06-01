
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Crop, RotateCw, X, Download, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImageCropper } from '../ImageCropper';
import { useImageCropper } from '@/hooks/useImageCropper';
import { useCardEditor } from '@/hooks/useCardEditor';

interface PhotoUploadCanvasProps {
  onPhotoSelect: (file: File, preview: string) => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const PhotoUploadCanvas = ({ onPhotoSelect, cardEditor }: PhotoUploadCanvasProps) => {
  const [mode, setMode] = useState<'upload' | 'crop' | 'results'>('upload');
  const {
    originalImage,
    croppedResults,
    loadImage,
    addCropResult,
    removeCropResult,
    clearAll,
    downloadCrop,
    downloadAllCrops
  } = useImageCropper();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        await loadImage(file);
        setMode('crop');
        onPhotoSelect(file, URL.createObjectURL(file));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load image');
      }
    }
  }, [loadImage, onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: mode !== 'upload',
    noKeyboard: true
  });

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    addCropResult(croppedImageUrl);
    
    // Automatically set as card image if card editor is available
    if (cardEditor) {
      cardEditor.updateCardField('image_url', croppedImageUrl);
      cardEditor.updateCardField('thumbnail_url', croppedImageUrl);
      toast.success('Cropped image set as card photo');
    }
    
    setMode('results');
  }, [addCropResult, cardEditor]);

  const handleUseAsCrop = useCallback((croppedImageUrl: string) => {
    if (cardEditor) {
      cardEditor.updateCardField('image_url', croppedImageUrl);
      cardEditor.updateCardField('thumbnail_url', croppedImageUrl);
      toast.success('Image set as card photo');
      
      // Switch to preview mode to show the card with the new image
      window.dispatchEvent(new CustomEvent('switchToPreview'));
    }
  }, [cardEditor]);

  const handleNewCrop = useCallback(() => {
    setMode('crop');
  }, []);

  const handleStartOver = useCallback(() => {
    clearAll();
    setMode('upload');
  }, [clearAll]);

  // Upload mode
  if (mode === 'upload') {
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
              {isDragActive ? 'Drop image here' : 'Upload Image to Crop'}
            </div>
            <div className="text-crd-lightGray text-sm max-w-md">
              {isDragActive 
                ? 'Release to upload your image' 
                : 'Drag and drop any image here, or click to browse files. Perfect for extracting cards, documents, or any rectangular objects.'
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
              Choose Image
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Crop mode
  if (mode === 'crop' && originalImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <h3 className="text-white text-xl font-medium mb-2">Crop Your Image</h3>
          <p className="text-crd-lightGray">
            Drag the crop area to select the rectangle you want to extract
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <ImageCropper
            imageUrl={originalImage}
            onCropComplete={handleCropComplete}
            aspectRatio={2.5 / 3.5} // Default to trading card ratio
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleStartOver}
            variant="outline"
            className="border-editor-border text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Different Image
          </Button>
          
          {croppedResults.length > 0 && (
            <Button
              onClick={() => setMode('results')}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              View Results ({croppedResults.length})
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Results mode
  if (mode === 'results') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <h3 className="text-white text-xl font-medium mb-2">Extracted Crops</h3>
          <p className="text-crd-lightGray">
            {croppedResults.length} crop{croppedResults.length !== 1 ? 's' : ''} extracted successfully
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl w-full max-h-96 overflow-auto">
          {croppedResults.map((result, index) => (
            <Card key={index} className="relative group bg-editor-dark border-editor-border overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={result.croppedImageUrl}
                  alt={`Crop ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {cardEditor && (
                    <Button
                      size="sm"
                      onClick={() => handleUseAsCrop(result.croppedImageUrl)}
                      className="bg-crd-green hover:bg-crd-green/90 text-black"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => downloadCrop(result, `crop_${index + 1}.png`)}
                    variant="outline"
                    className="border-editor-border text-white"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeCropResult(index)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-crd-lightGray text-center">
                  {cardEditor ? 'Click camera to use as card photo' : 'Download to save'}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 flex-wrap">
          <Button
            onClick={handleNewCrop}
            variant="outline"
            className="border-editor-border text-white"
          >
            <Crop className="w-4 h-4 mr-2" />
            Make Another Crop
          </Button>
          
          <Button
            onClick={downloadAllCrops}
            disabled={croppedResults.length === 0}
            variant="outline"
            className="border-editor-border text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All ({croppedResults.length})
          </Button>
          
          {cardEditor && cardEditor.cardData.image_url && (
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent('switchToPreview'))}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              View Card Preview
            </Button>
          )}
          
          <Button
            onClick={handleStartOver}
            variant="outline"
            className="border-editor-border text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
