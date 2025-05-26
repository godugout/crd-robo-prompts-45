
import React from 'react';

export const QuickAdjustments = () => {
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

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium text-sm uppercase tracking-wide">Quick Adjustments</h4>
      <div className="space-y-3">
        <div>
          <label className="text-white text-xs font-medium">Overall Brightness</label>
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
      </div>
    </div>
  );
};
