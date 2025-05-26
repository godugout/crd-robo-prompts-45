
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Camera, RotateCw, Maximize, Minimize, Crop } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoStepProps {
  selectedTemplate: string;
  searchQuery: string;
}

export const PhotoStep = ({ selectedTemplate, searchQuery }: PhotoStepProps) => {
  const handlePhotoAction = (action: string) => {
    // Send action to the main canvas
    window.dispatchEvent(new CustomEvent('photoAction', { 
      detail: { action } 
    }));
    toast.success(`${action} activated - use the center canvas to upload and edit`);
  };

  const handleBrightnessChange = (value: number) => {
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: 'brightness', value }
    }));
  };

  const handleContrastChange = (value: number) => {
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: 'contrast', value }
    }));
  };

  const handleSaturationChange = (value: number) => {
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: 'saturation', value }
    }));
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Photo Settings</h3>
          <p className="text-crd-lightGray text-sm">
            Upload and edit your photo in the center canvas
          </p>
        </div>

        {/* Photo Actions */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Photo Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => handlePhotoAction('upload')}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload New Photo
            </Button>
            <Button
              onClick={() => handlePhotoAction('crop')}
              variant="outline"
              className="w-full border-editor-border text-white"
            >
              <Crop className="w-4 h-4 mr-2" />
              Crop & Adjust
            </Button>
            <Button
              onClick={() => handlePhotoAction('autofit')}
              variant="outline"
              className="w-full border-editor-border text-white"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Auto Fit to Frame
            </Button>
          </div>
        </div>

        {/* Photo Adjustments */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Adjustments</h4>
          <div className="space-y-3">
            <div>
              <label className="text-white text-xs font-medium">Brightness</label>
              <input
                type="range"
                min="50"
                max="150"
                defaultValue="100"
                onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                className="w-full mt-1 accent-crd-green"
              />
            </div>
            <div>
              <label className="text-white text-xs font-medium">Contrast</label>
              <input
                type="range"
                min="50"
                max="150"
                defaultValue="100"
                onChange={(e) => handleContrastChange(parseInt(e.target.value))}
                className="w-full mt-1 accent-crd-green"
              />
            </div>
            <div>
              <label className="text-white text-xs font-medium">Saturation</label>
              <input
                type="range"
                min="0"
                max="200"
                defaultValue="100"
                onChange={(e) => handleSaturationChange(parseInt(e.target.value))}
                className="w-full mt-1 accent-crd-green"
              />
            </div>
          </div>
        </div>

        {/* Photo Filters */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Filters</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Original', 'Vintage', 'B&W', 'Sepia', 'Vibrant', 'Cool'].map((filter) => (
              <Button
                key={filter}
                onClick={() => handlePhotoAction(`filter-${filter.toLowerCase()}`)}
                variant="outline"
                size="sm"
                className="border-editor-border text-white hover:bg-crd-green hover:text-black"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Frame Compatibility */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Current Frame</h4>
          <p className="text-crd-lightGray text-xs mb-3">
            Template: {selectedTemplate}
          </p>
          <p className="text-crd-lightGray text-xs">
            Your photo will automatically adjust to fit this frame while preserving important elements.
          </p>
        </div>

        {/* Photo Tips */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Photo Tips</h4>
          <ul className="text-crd-lightGray text-xs space-y-1">
            <li>• Use high-resolution images for best quality</li>
            <li>• Portrait orientation works best for cards</li>
            <li>• Center your subject for optimal framing</li>
            <li>• Supported: JPG, PNG, WebP</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
};
