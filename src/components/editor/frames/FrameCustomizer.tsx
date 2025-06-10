
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ModularFrameBuilder, FrameConfiguration } from './ModularFrameBuilder';
import { ALL_FRAME_CONFIGS } from './VintageFrameConfigs';
import { Palette, Settings, Layers } from 'lucide-react';

interface FrameCustomizerProps {
  initialConfig?: FrameConfiguration;
  onConfigChange: (config: FrameConfiguration) => void;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

export const FrameCustomizer: React.FC<FrameCustomizerProps> = ({
  initialConfig,
  onConfigChange,
  imageUrl,
  title = 'CARD TITLE',
  subtitle = 'Subtitle'
}) => {
  const [config, setConfig] = useState<FrameConfiguration>(
    initialConfig || ALL_FRAME_CONFIGS[0]
  );

  const updateConfig = (updates: Partial<FrameConfiguration>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const colorOptions = [
    '#fbbf24', '#dc2626', '#1e3a8a', '#059669', '#7c3aed', 
    '#ea580c', '#0891b2', '#be123c', '#374151', '#92400e'
  ];

  return (
    <div className="w-full space-y-4">
      {/* Live Preview */}
      <div className="flex justify-center mb-6">
        <ModularFrameBuilder
          config={config}
          imageUrl={imageUrl}
          title={title}
          subtitle={subtitle}
          width={200}
          height={280}
        />
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-editor-darker">
          <TabsTrigger value="colors" className="text-white">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="elements" className="text-white">
            <Layers className="w-4 h-4 mr-2" />
            Elements
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Border Color</label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${
                    config.borders.outer?.color === color ? 'border-white' : 'border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateConfig({
                    borders: {
                      ...config.borders,
                      outer: { ...config.borders.outer!, color }
                    }
                  })}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">Background Colors</label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => updateConfig({
                    background: {
                      ...config.background,
                      colors: [color]
                    }
                  })}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="elements" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Corner Style</label>
            <div className="grid grid-cols-3 gap-2">
              {['classic', 'ornate', 'modern'].map((style) => (
                <Button
                  key={style}
                  variant={config.corners?.style === style ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateConfig({
                    corners: {
                      ...config.corners!,
                      style: style as 'classic' | 'ornate' | 'modern'
                    }
                  })}
                  className="capitalize"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">Side Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {['lines', 'dots', 'diamonds', 'classic'].map((pattern) => (
                <Button
                  key={pattern}
                  variant={config.sidePatterns?.pattern === pattern ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateConfig({
                    sidePatterns: {
                      ...config.sidePatterns!,
                      pattern: pattern as 'dots' | 'lines' | 'diamonds' | 'classic'
                    }
                  })}
                  className="capitalize"
                >
                  {pattern}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Border Thickness: {config.borders.outer?.thickness || 4}px
            </label>
            <Slider
              value={[config.borders.outer?.thickness || 4]}
              onValueChange={([value]) => updateConfig({
                borders: {
                  ...config.borders,
                  outer: { ...config.borders.outer!, thickness: value }
                }
              })}
              max={8}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Corner Size: {config.corners?.size || 16}px
            </label>
            <Slider
              value={[config.corners?.size || 16]}
              onValueChange={([value]) => updateConfig({
                corners: {
                  ...config.corners!,
                  size: value
                }
              })}
              max={32}
              min={8}
              step={2}
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setConfig(ALL_FRAME_CONFIGS[0]);
            onConfigChange(ALL_FRAME_CONFIGS[0]);
          }}
          className="border-editor-border text-white"
        >
          Reset to Default
        </Button>
        <Button
          size="sm"
          className="bg-crd-green text-black hover:bg-crd-green/90"
          onClick={() => console.log('Save custom frame:', config)}
        >
          Save Custom Frame
        </Button>
      </div>
    </div>
  );
};
