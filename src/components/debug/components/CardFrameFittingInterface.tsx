import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';

interface CardFrameFittingInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

export const CardFrameFittingInterface: React.FC<CardFrameFittingInterfaceProps> = ({ processedPSD }) => {
  const [layerImages, setLayerImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Extract image URLs from layers
    const images = processedPSD.layerImages.map(layer => layer.imageUrl);
    setLayerImages(images);
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [processedPSD]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b]">
      <div className="flex-1 p-6 space-y-6">
        <Card className="bg-[#1a1f2e] border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Card Frame Fitting</h3>
          <p className="text-slate-400 mb-6">
            Select an image to fit within a card frame
          </p>

          <div className="grid grid-cols-3 gap-4">
            {layerImages.map((imageUrl) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt="Layer"
                className={`w-full h-32 object-cover rounded-md cursor-pointer ${
                  selectedImage === imageUrl ? 'ring-2 ring-crd-green' : ''
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              />
            ))}
          </div>

          {selectedImage && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-white mb-2">Selected Image</h4>
              <img
                src={selectedImage}
                alt="Selected Layer"
                className="w-full h-64 object-contain rounded-md"
              />
            </div>
          )}

          <Button className="w-full bg-crd-green text-black hover:bg-crd-green/90 h-12">
            Fit Image to Frame
          </Button>
        </Card>
      </div>
    </div>
  );
};
