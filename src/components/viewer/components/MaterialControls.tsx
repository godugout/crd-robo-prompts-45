
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import type { MaterialSettings, UserTier } from '../types';

interface MaterialControlsProps {
  materialSettings: MaterialSettings;
  userTier: UserTier;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onDownload?: () => void;
}

export const MaterialControls: React.FC<MaterialControlsProps> = ({
  materialSettings,
  userTier,
  onMaterialSettingsChange,
  onDownload
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-3">Material Properties</h4>
        <div className="space-y-4">
          {Object.entries(materialSettings).map(([key, value]) => (
            <div key={key}>
              <label className="text-white text-sm mb-2 block capitalize">
                {key}: {value.toFixed(2)}
              </label>
              <Slider
                value={[value]}
                onValueChange={([newValue]) => 
                  onMaterialSettingsChange({ ...materialSettings, [key]: newValue })
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Premium Export
          <Badge className="ml-2 text-xs bg-green-400 text-black px-2 py-1 rounded">
            NO LIMITS
          </Badge>
        </h4>
        <p className="text-gray-300 text-sm mb-3">
          {userTier === 'baller' ? '4K resolution, no watermarks' : 'HD resolution, no watermarks'}
        </p>
        <Button 
          onClick={onDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export High Quality
        </Button>
      </div>
    </div>
  );
};
