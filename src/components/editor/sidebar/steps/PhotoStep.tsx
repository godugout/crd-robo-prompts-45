
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Camera, RotateCw, Maximize, Minimize, Crop, Target, Download } from 'lucide-react';
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
          <h3 className="text-white font-medium text-lg mb-2">Photo & Crop Tools</h3>
          <p className="text-crd-lightGray text-sm">
            Upload images and extract perfect rectangular crops
          </p>
        </div>

        {/* Photo Actions */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Upload & Crop</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => handlePhotoAction('upload')}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload & Crop Image
            </Button>
            <Button
              onClick={() => handlePhotoAction('autofit')}
              variant="outline"
              className="w-full border-editor-border text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Auto-Fit Rectangle
            </Button>
            <Button
              onClick={() => handlePhotoAction('crop')}
              variant="outline"
              className="w-full border-editor-border text-white"
            >
              <Crop className="w-4 h-4 mr-2" />
              Manual Crop
            </Button>
          </div>
        </div>

        {/* Crop Settings */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Crop Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="text-white text-xs font-medium">Aspect Ratio</label>
              <select className="w-full mt-1 bg-editor-dark border border-editor-border rounded text-white p-2">
                <option value="free">Free Crop</option>
                <option value="card">Trading Card (2.5:3.5)</option>
                <option value="document">Document (8.5:11)</option>
                <option value="square">Square (1:1)</option>
                <option value="photo">Photo (4:6)</option>
              </select>
            </div>
            <div>
              <label className="text-white text-xs font-medium">Output Quality</label>
              <input
                type="range"
                min="50"
                max="100"
                defaultValue="95"
                className="w-full mt-1 accent-crd-green"
              />
              <span className="text-crd-lightGray text-xs">95% Quality</span>
            </div>
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

        {/* Cropping Tips */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Cropping Tips</h4>
          <ul className="text-crd-lightGray text-xs space-y-1">
            <li>• Drag corners to resize the crop area</li>
            <li>• Click and drag inside to move the crop</li>
            <li>• Use Auto-Fit for quick rectangle detection</li>
            <li>• High-quality extraction preserves details</li>
            <li>• Perfect for cards, documents, and photos</li>
          </ul>
        </div>

        {/* Frame Compatibility */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Current Template</h4>
          <p className="text-crd-lightGray text-xs mb-3">
            Template: {selectedTemplate}
          </p>
          <p className="text-crd-lightGray text-xs">
            Your cropped images will automatically adjust to fit this template while preserving quality.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};
