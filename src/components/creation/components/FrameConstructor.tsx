
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Palette, Square, Circle, Triangle, Star, Diamond } from 'lucide-react';

interface FrameConfig {
  style: string;
  border: { width: number; color: string; style: string };
  background: string;
  effects: string[];
}

interface FrameConstructorProps {
  frameConfig: FrameConfig;
  onConfigUpdate: (config: Partial<FrameConfig>) => void;
}

const FRAME_STYLES = [
  { id: 'classic', name: 'Classic', preview: '#4f46e5' },
  { id: 'modern', name: 'Modern', preview: '#059669' },
  { id: 'vintage', name: 'Vintage', preview: '#d97706' },
  { id: 'futuristic', name: 'Futuristic', preview: '#7c3aed' },
  { id: 'elegant', name: 'Elegant', preview: '#be185d' },
  { id: 'bold', name: 'Bold', preview: '#dc2626' }
];

const BORDER_STYLES = [
  { id: 'solid', name: 'Solid' },
  { id: 'dashed', name: 'Dashed' },
  { id: 'dotted', name: 'Dotted' },
  { id: 'double', name: 'Double' },
  { id: 'groove', name: 'Groove' },
  { id: 'ridge', name: 'Ridge' }
];

const GRADIENT_PRESETS = [
  { id: 'blue', name: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'purple', name: 'Purple Haze', value: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)' },
  { id: 'sunset', name: 'Sunset', value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  { id: 'forest', name: 'Forest', value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { id: 'cosmic', name: 'Cosmic', value: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)' },
  { id: 'gold', name: 'Gold Rush', value: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }
];

const EFFECT_OPTIONS = [
  { id: 'shadow', name: 'Drop Shadow', icon: Square },
  { id: 'glow', name: 'Outer Glow', icon: Circle },
  { id: 'emboss', name: 'Emboss', icon: Triangle },
  { id: 'holographic', name: 'Holographic', icon: Star },
  { id: 'metallic', name: 'Metallic', icon: Diamond }
];

export const FrameConstructor: React.FC<FrameConstructorProps> = ({
  frameConfig,
  onConfigUpdate
}) => {
  const toggleEffect = (effectId: string) => {
    const effects = frameConfig.effects.includes(effectId)
      ? frameConfig.effects.filter(e => e !== effectId)
      : [...frameConfig.effects, effectId];
    onConfigUpdate({ effects });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Frame Constructor</h3>
      
      {/* Frame Style Selection */}
      <div>
        <Label className="text-gray-300 text-sm font-medium mb-3 block">Frame Style</Label>
        <div className="grid grid-cols-2 gap-3">
          {FRAME_STYLES.map((style) => (
            <Button
              key={style.id}
              onClick={() => onConfigUpdate({ style: style.id })}
              variant={frameConfig.style === style.id ? "default" : "outline"}
              className={`
                h-16 p-3 flex flex-col items-center justify-center gap-1
                ${frameConfig.style === style.id 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              <div
                className="w-8 h-6 rounded border-2"
                style={{
                  backgroundColor: style.preview,
                  borderColor: frameConfig.style === style.id ? '#ffffff' : style.preview
                }}
              />
              <span className="text-xs">{style.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-600" />

      {/* Border Configuration */}
      <div className="space-y-4">
        <Label className="text-gray-300 text-sm font-medium">Border Settings</Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300 text-xs">Style</Label>
            <Select 
              value={frameConfig.border.style} 
              onValueChange={(value) => onConfigUpdate({ 
                border: { ...frameConfig.border, style: value }
              })}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BORDER_STYLES.map(style => (
                  <SelectItem key={style.id} value={style.id}>{style.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-gray-300 text-xs">Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={frameConfig.border.color}
                onChange={(e) => onConfigUpdate({ 
                  border: { ...frameConfig.border, color: e.target.value }
                })}
                className="w-12 h-10 p-1 bg-gray-700 border-gray-600"
              />
              <Input
                value={frameConfig.border.color}
                onChange={(e) => onConfigUpdate({ 
                  border: { ...frameConfig.border, color: e.target.value }
                })}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-gray-300 text-xs">
            Width: {frameConfig.border.width}px
          </Label>
          <Slider
            value={[frameConfig.border.width]}
            onValueChange={([value]) => onConfigUpdate({ 
              border: { ...frameConfig.border, width: value }
            })}
            min={0}
            max={20}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <Separator className="bg-gray-600" />

      {/* Background Configuration */}
      <div className="space-y-4">
        <Label className="text-gray-300 text-sm font-medium">Background</Label>
        
        <div className="grid grid-cols-2 gap-2">
          {GRADIENT_PRESETS.map((preset) => (
            <Card
              key={preset.id}
              className={`
                relative cursor-pointer border-2 transition-all h-12 overflow-hidden
                ${frameConfig.background === preset.value 
                  ? 'border-purple-400' 
                  : 'border-gray-600 hover:border-gray-500'
                }
              `}
              onClick={() => onConfigUpdate({ background: preset.value })}
            >
              <div 
                className="w-full h-full" 
                style={{ background: preset.value }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs font-medium">{preset.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-600" />

      {/* Effects */}
      <div className="space-y-4">
        <Label className="text-gray-300 text-sm font-medium">Effects</Label>
        
        <div className="grid grid-cols-1 gap-2">
          {EFFECT_OPTIONS.map((effect) => (
            <Button
              key={effect.id}
              onClick={() => toggleEffect(effect.id)}
              variant="outline"
              className={`
                flex items-center justify-between p-3 h-auto
                ${frameConfig.effects.includes(effect.id)
                  ? 'bg-purple-600/20 border-purple-400 text-purple-200'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <effect.icon className="w-4 h-4" />
                <span>{effect.name}</span>
              </div>
              {frameConfig.effects.includes(effect.id) && (
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
        <Label className="text-gray-300 text-sm font-medium mb-2 block">Preview</Label>
        <div className="flex justify-center">
          <div
            className="w-24 h-32 rounded"
            style={{
              background: frameConfig.background,
              border: `${frameConfig.border.width}px ${frameConfig.border.style} ${frameConfig.border.color}`,
              filter: frameConfig.effects.includes('glow') ? 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};
