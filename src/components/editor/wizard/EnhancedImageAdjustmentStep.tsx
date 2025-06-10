
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FixedCardImageEditor } from '@/components/card-editor/enhanced/FixedCardImageEditor';
import { Crop, RotateCw, Maximize2, CheckCircle, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface Frame {
  id: string;
  name: string;
  preview: string;
  style: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
}

interface EnhancedImageAdjustmentStepProps {
  selectedPhoto: string;
  selectedFrame?: Frame;
  onImageAdjusted: (adjustedImageUrl: string) => void;
  onFrameChanged?: (frameId: string) => void;
  onSkip?: () => void;
}

const DEFAULT_FRAMES: Frame[] = [
  {
    id: 'classic',
    name: 'Classic Card',
    preview: '/placeholder.svg',
    style: {
      primaryColor: '#16a085',
      accentColor: '#eee',
      backgroundColor: '#1a1a2e'
    }
  },
  {
    id: 'vintage',
    name: 'Vintage Frame',
    preview: '/placeholder.svg',
    style: {
      primaryColor: '#e07a5f',
      accentColor: '#3d405b',
      backgroundColor: '#f4f1de'
    }
  },
  {
    id: 'modern',
    name: 'Modern Edge',
    preview: '/placeholder.svg',
    style: {
      primaryColor: '#8e44ad',
      accentColor: '#f39c12',
      backgroundColor: '#2d1b69'
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    preview: '/placeholder.svg',
    style: {
      primaryColor: '#ff006e',
      accentColor: '#8338ec',
      backgroundColor: '#0f0f23'
    }
  }
];

export const EnhancedImageAdjustmentStep = ({ 
  selectedPhoto, 
  selectedFrame,
  onImageAdjusted, 
  onFrameChanged,
  onSkip 
}: EnhancedImageAdjustmentStepProps) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState<Frame>(selectedFrame || DEFAULT_FRAMES[0]);

  useEffect(() => {
    if (selectedPhoto) {
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
        setIsLoading(false);
      };
      img.onerror = () => {
        toast.error('Failed to load image for editing');
        setIsLoading(false);
      };
      img.src = selectedPhoto;
    }
  }, [selectedPhoto]);

  const handleImageConfirmed = (adjustedImageData: string) => {
    onImageAdjusted(adjustedImageData);
    toast.success('Image perfectly adjusted for your card frame!');
  };

  const handleSkipAdjustment = () => {
    onImageAdjusted(selectedPhoto);
    if (onSkip) onSkip();
  };

  const handleFrameSelect = (frame: Frame) => {
    setCurrentFrame(frame);
    if (onFrameChanged) onFrameChanged(frame.id);
    toast.success(`Frame changed to ${frame.name}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Preparing Image Editor</h2>
          <p className="text-crd-lightGray">Loading your image for frame adjustment...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crd-green"></div>
        </div>
      </div>
    );
  }

  if (!imageElement) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Image Loading Error</h2>
          <p className="text-crd-lightGray">There was an issue loading your image for editing.</p>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleSkipAdjustment}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Continue with Original Image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-3 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Adjust Your Image</h2>
          <p className="text-crd-lightGray">
            Position and scale your image to fit perfectly within the selected frame
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-editor-tool p-4 rounded-lg text-center">
            <Crop className="w-6 h-6 text-crd-green mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Smart Positioning</h3>
            <p className="text-crd-lightGray text-xs">Drag and scale with precision</p>
          </div>
          <div className="bg-editor-tool p-4 rounded-lg text-center">
            <RotateCw className="w-6 h-6 text-crd-green mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Perfect Alignment</h3>
            <p className="text-crd-lightGray text-xs">Auto-fit and grid assistance</p>
          </div>
          <div className="bg-editor-tool p-4 rounded-lg text-center">
            <Maximize2 className="w-6 h-6 text-crd-green mx-auto mb-2" />
            <h3 className="text-white font-medium text-sm">Live Preview</h3>
            <p className="text-crd-lightGray text-xs">See exactly how it will look</p>
          </div>
        </div>

        <FixedCardImageEditor
          image={imageElement}
          onConfirm={handleImageConfirmed}
          onCancel={handleSkipAdjustment}
          className="w-full"
        />
      </div>

      {/* Frame Selection Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="text-center">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Frame Styles
          </h3>
          <p className="text-crd-lightGray text-sm">Choose your card frame</p>
        </div>

        {/* Current Frame Preview */}
        <Card className="bg-editor-dark border-editor-border p-4">
          <div className="aspect-[3/4] relative mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: currentFrame.style.backgroundColor }}>
            {/* Frame preview with image */}
            <div className="absolute inset-2 border-2 border-dashed border-gray-500 rounded overflow-hidden">
              <img 
                src={selectedPhoto}
                alt="Preview"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            
            {/* Frame elements */}
            <div 
              className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: currentFrame.style.primaryColor }}
            >
              <span className="text-white text-xs font-bold">HEADER</span>
            </div>
            
            <div 
              className="absolute bottom-2 left-2 right-2 h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: currentFrame.style.accentColor }}
            >
              <span className="text-black text-xs">Footer</span>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-white text-sm font-medium">{currentFrame.name}</h4>
            <p className="text-crd-lightGray text-xs">Current selection</p>
          </div>
        </Card>

        {/* Frame Options */}
        <div className="space-y-2">
          {DEFAULT_FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() => handleFrameSelect(frame)}
              className={`w-full p-3 rounded-lg border transition-all ${
                currentFrame.id === frame.id
                  ? 'border-crd-green bg-crd-green/10'
                  : 'border-editor-border hover:border-crd-green/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-10 rounded border"
                  style={{ backgroundColor: frame.style.backgroundColor }}
                >
                  <div 
                    className="w-full h-2 rounded-t"
                    style={{ backgroundColor: frame.style.primaryColor }}
                  />
                  <div className="flex-1" />
                  <div 
                    className="w-full h-1 rounded-b"
                    style={{ backgroundColor: frame.style.accentColor }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{frame.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleSkipAdjustment}
            variant="outline"
            className="w-full border-editor-border text-crd-lightGray hover:text-white"
            size="sm"
          >
            Skip Adjustment
          </Button>
        </div>
      </div>
    </div>
  );
};
