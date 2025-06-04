
import React, { useState } from 'react';
import { Download, Image, Film, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import type { ExportOptions } from '../hooks/useCardExport';

interface ExportOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
  exportProgress: number;
  cardTitle: string;
}

const QUICK_PRESETS = [
  {
    id: 'hq-png',
    name: 'High Quality PNG',
    description: 'Perfect for sharing or printing',
    icon: <Image className="w-4 h-4" />,
    options: { format: 'png' as const, resolution: 2 as const, background: 'transparent' as const }
  },
  {
    id: 'web-jpg',
    name: 'Web JPG',
    description: 'Optimized for web use',
    icon: <Image className="w-4 h-4" />,
    options: { format: 'jpg' as const, resolution: 1 as const, background: 'scene' as const, quality: 0.8 }
  },
  {
    id: 'smooth-rotation',
    name: 'Smooth Rotation GIF',
    description: '4-second smooth rotation',
    icon: <Film className="w-4 h-4" />,
    options: {
      format: 'gif' as const,
      resolution: 1 as const,
      background: 'scene' as const,
      animation: { duration: 4 as const, effectCycling: false, lightingChanges: false, frameRate: 30 as const }
    }
  },
  {
    id: 'effect-showcase',
    name: 'Effect Showcase GIF',
    description: 'Rotation with cycling effects',
    icon: <Film className="w-4 h-4" />,
    options: {
      format: 'gif' as const,
      resolution: 1 as const,
      background: 'scene' as const,
      animation: { duration: 6 as const, effectCycling: true, lightingChanges: true, frameRate: 30 as const }
    }
  }
];

export const ExportOptionsDialog: React.FC<ExportOptionsDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting,
  exportProgress,
  cardTitle
}) => {
  const [customOptions, setCustomOptions] = useState<ExportOptions>({
    format: 'png',
    resolution: 2,
    background: 'transparent',
    quality: 0.9
  });

  const handleQuickExport = (options: ExportOptions) => {
    onExport(options);
  };

  const handleCustomExport = () => {
    onExport(customOptions);
  };

  const updateCustomOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setCustomOptions(prev => ({ ...prev, [key]: value }));
  };

  if (isExporting) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-editor-dark border-editor-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Exporting Card...
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center space-y-2">
              <div className="text-crd-lightGray text-sm">
                {customOptions.format === 'gif' ? 'Creating animated GIF...' : 'Capturing image...'}
              </div>
              <Progress value={exportProgress} className="w-full" />
              <div className="text-white text-sm">{exportProgress}%</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-editor-dark border-editor-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Export "{cardTitle}"
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-crd-lightGray hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="quick" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Quick Export
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-white data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-1" />
              Custom Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              {QUICK_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  className="h-auto p-4 border-editor-border hover:border-crd-green hover:bg-crd-green hover:bg-opacity-10 flex-col items-start text-left"
                  onClick={() => handleQuickExport(preset.options)}
                >
                  <div className="flex items-center w-full mb-2">
                    {preset.icon}
                    <span className="text-white font-medium ml-2">{preset.name}</span>
                  </div>
                  <p className="text-crd-lightGray text-xs">{preset.description}</p>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Format Selection */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Format</h4>
                <div className="space-y-2">
                  {[
                    { value: 'png', label: 'PNG (Transparent)', desc: 'Best quality with transparency' },
                    { value: 'jpg', label: 'JPG (Compressed)', desc: 'Smaller file size' },
                    { value: 'gif', label: 'GIF (Animated)', desc: 'Animated with effects' }
                  ].map(format => (
                    <label key={format.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={customOptions.format === format.value}
                        onChange={(e) => updateCustomOption('format', e.target.value as any)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-white text-sm">{format.label}</div>
                        <div className="text-crd-lightGray text-xs">{format.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Resolution</h4>
                <div className="space-y-2">
                  <div className="text-crd-lightGray text-sm">
                    {customOptions.resolution}x ({400 * customOptions.resolution} × {560 * customOptions.resolution}px)
                  </div>
                  <Slider
                    value={[customOptions.resolution]}
                    onValueChange={([value]) => updateCustomOption('resolution', value as 1 | 2 | 4)}
                    min={1}
                    max={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-crd-lightGray">
                    <span>1x (Web)</span>
                    <span>2x (HD)</span>
                    <span>4x (Print)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation Options (only for GIF) */}
            {customOptions.format === 'gif' && (
              <div className="space-y-4 border-t border-editor-border pt-4">
                <h4 className="text-white font-medium">Animation Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-crd-lightGray text-sm mb-2 block">
                      Duration: {customOptions.animation?.duration || 4}s
                    </label>
                    <Slider
                      value={[customOptions.animation?.duration || 4]}
                      onValueChange={([value]) => updateCustomOption('animation', {
                        ...customOptions.animation,
                        duration: value as 2 | 4 | 6
                      })}
                      min={2}
                      max={6}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-crd-lightGray text-sm mb-2 block">
                      Frame Rate: {customOptions.animation?.frameRate || 30}fps
                    </label>
                    <Slider
                      value={[customOptions.animation?.frameRate || 30]}
                      onValueChange={([value]) => updateCustomOption('animation', {
                        ...customOptions.animation,
                        frameRate: value as 15 | 30 | 60
                      })}
                      min={15}
                      max={60}
                      step={15}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customOptions.animation?.effectCycling || false}
                      onChange={(e) => updateCustomOption('animation', {
                        ...customOptions.animation,
                        effectCycling: e.target.checked
                      })}
                    />
                    <span className="text-white text-sm">Effect Cycling</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customOptions.animation?.lightingChanges || false}
                      onChange={(e) => updateCustomOption('animation', {
                        ...customOptions.animation,
                        lightingChanges: e.target.checked
                      })}
                    />
                    <span className="text-white text-sm">Lighting Changes</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleCustomExport}
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                Export {customOptions.format.toUpperCase()}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
