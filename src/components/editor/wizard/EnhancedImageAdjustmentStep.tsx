
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FixedCardImageEditor } from '@/components/card-editor/enhanced/FixedCardImageEditor';
import { Crop, RotateCw, Maximize2, CheckCircle, Palette } from 'lucide-react';
import { toast } from 'sonner';
import type { FrameTemplate } from './wizardConfig';

interface EnhancedImageAdjustmentStepProps {
  selectedPhoto: string;
  selectedFrame?: FrameTemplate;
  onImageAdjusted: (adjustedImageUrl: string) => void;
  onFrameChanged?: (frameId: string) => void;
  onSkip?: () => void;
}

const DEFAULT_FRAMES: FrameTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Card',
    category: 'traditional',
    description: 'A timeless card design perfect for any photo',
    preview_url: '/placeholder.svg',
    is_premium: false,
    usage_count: 1247,
    tags: ['classic', 'traditional', 'versatile', 'photo'],
    template_data: {
      layout: 'standard',
      style: {
        primaryColor: '#16a085',
        accentColor: '#eee',
        backgroundColor: '#1a1a2e',
        borderRadius: 8,
        borderWidth: 2
      },
      typography: {
        titleFont: 'Inter',
        bodyFont: 'Inter',
        titleSize: 18,
        bodySize: 14
      },
      effects: ['border', 'shadow'],
      supports_stickers: true
    },
    default_colors: {
      background: '#1a1a2e',
      border: '#16a085',
      text: '#eee'
    }
  },
  {
    id: 'vintage',
    name: 'Vintage Frame',
    category: 'vintage',
    description: 'Nostalgic design with classic typography',
    preview_url: '/placeholder.svg',
    is_premium: false,
    usage_count: 892,
    tags: ['vintage', 'retro', 'warm', 'classic'],
    template_data: {
      layout: 'vintage',
      style: {
        primaryColor: '#e07a5f',
        accentColor: '#3d405b',
        backgroundColor: '#f4f1de',
        borderRadius: 12,
        borderWidth: 3
      },
      typography: {
        titleFont: 'serif',
        bodyFont: 'serif',
        titleSize: 20,
        bodySize: 15
      },
      effects: ['texture', 'sepia'],
      supports_stickers: true
    },
    default_colors: {
      background: '#f4f1de',
      border: '#e07a5f',
      text: '#3d405b'
    }
  },
  {
    id: 'modern',
    name: 'Modern Edge',
    category: 'modern',
    description: 'Sleek contemporary design',
    preview_url: '/placeholder.svg',
    is_premium: true,
    usage_count: 634,
    tags: ['modern', 'sleek', 'contemporary', 'bold'],
    template_data: {
      layout: 'modern',
      style: {
        primaryColor: '#8e44ad',
        accentColor: '#f39c12',
        backgroundColor: '#2d1b69',
        borderRadius: 6,
        borderWidth: 1
      },
      typography: {
        titleFont: 'sans-serif',
        bodyFont: 'sans-serif',
        titleSize: 16,
        bodySize: 12
      },
      effects: ['gradient', 'glow'],
      supports_stickers: true
    },
    default_colors: {
      background: '#2d1b69',
      border: '#8e44ad',
      text: '#f39c12'
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    category: 'futuristic',
    description: 'Futuristic neon design',
    preview_url: '/placeholder.svg',
    is_premium: true,
    usage_count: 423,
    tags: ['neon', 'futuristic', 'gaming', 'tech'],
    template_data: {
      layout: 'futuristic',
      style: {
        primaryColor: '#ff006e',
        accentColor: '#8338ec',
        backgroundColor: '#0f0f23',
        borderRadius: 4,
        borderWidth: 2
      },
      typography: {
        titleFont: 'monospace',
        bodyFont: 'monospace',
        titleSize: 14,
        bodySize: 11
      },
      effects: ['neon', 'glow', 'holographic'],
      supports_stickers: true
    },
    default_colors: {
      background: '#0f0f23',
      border: '#ff006e',
      text: '#8338ec'
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
  const [currentFrame, setCurrentFrame] = useState<FrameTemplate>(selectedFrame || DEFAULT_FRAMES[0]);

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

  const handleFrameSelect = (frame: FrameTemplate) => {
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
          <div className="aspect-[3/4] relative mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: currentFrame.default_colors?.background || currentFrame.template_data.style.backgroundColor }}>
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
              style={{ backgroundColor: currentFrame.template_data.style.primaryColor }}
            >
              <span className="text-white text-xs font-bold">HEADER</span>
            </div>
            
            <div 
              className="absolute bottom-2 left-2 right-2 h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: currentFrame.template_data.style.accentColor }}
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
                  style={{ backgroundColor: frame.template_data.style.backgroundColor }}
                >
                  <div 
                    className="w-full h-2 rounded-t"
                    style={{ backgroundColor: frame.template_data.style.primaryColor }}
                  />
                  <div className="flex-1" />
                  <div 
                    className="w-full h-1 rounded-b"
                    style={{ backgroundColor: frame.template_data.style.accentColor }}
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
