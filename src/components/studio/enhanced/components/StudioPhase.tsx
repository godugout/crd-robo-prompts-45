
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Download, Share2, Eye, Maximize2 } from 'lucide-react';

interface StudioPhaseProps {
  show3DPreview: boolean;
  onToggle3D: () => void;
  onExport: () => void;
}

export const StudioPhase: React.FC<StudioPhaseProps> = ({
  show3DPreview,
  onToggle3D,
  onExport
}) => {
  const [lightingIntensity, setLightingIntensity] = React.useState([75]);
  const [shadowDepth, setShadowDepth] = React.useState([50]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Fine-tune your card's presentation and prepare for export.
      </div>

      {/* 3D Controls */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            3D Preview Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Enable 3D Preview</label>
              <Switch checked={show3DPreview} onCheckedChange={onToggle3D} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300">Lighting Intensity</label>
                <span className="text-xs text-crd-green">{lightingIntensity[0]}%</span>
              </div>
              <Slider
                value={lightingIntensity}
                onValueChange={setLightingIntensity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300">Shadow Depth</label>
                <span className="text-xs text-crd-green">{shadowDepth[0]}%</span>
              </div>
              <Slider
                value={shadowDepth}
                onValueChange={setShadowDepth}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export & Sharing
          </h3>
          
          <div className="space-y-3">
            <Button 
              onClick={onExport}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export High Resolution
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Export Resolution: 1500×2100 (300 DPI)</div>
              <div>• Format: PNG with transparency</div>
              <div>• Print-ready quality</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
