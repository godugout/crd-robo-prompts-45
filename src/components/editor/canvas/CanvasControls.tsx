
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface CanvasControlsProps {
  brightness: number;
  contrast: number;
  onBrightnessChange: (values: number[]) => void;
  onContrastChange: (values: number[]) => void;
  title: string;
  description: string;
}

export const CanvasControls = ({
  brightness,
  contrast,
  onBrightnessChange,
  onContrastChange,
  title,
  description
}: CanvasControlsProps) => {
  return (
    <div className="mt-6 text-left">
      <h3 className="text-white text-xl font-bold">{title}</h3>
      <p className="text-cardshow-lightGray text-sm mt-2">{description}</p>
      
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-cardshow-lightGray">BRIGHTNESS</label>
            <span className="text-xs text-cardshow-lightGray">{brightness}%</span>
          </div>
          <Slider 
            value={[brightness]} 
            onValueChange={onBrightnessChange} 
            min={50} 
            max={150} 
            step={5}
            className="py-0"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-cardshow-lightGray">CONTRAST</label>
            <span className="text-xs text-cardshow-lightGray">{contrast}%</span>
          </div>
          <Slider 
            value={[contrast]} 
            onValueChange={onContrastChange} 
            min={50} 
            max={150} 
            step={5}
            className="py-0"
          />
        </div>
      </div>
    </div>
  );
};
