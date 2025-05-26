
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Sun, Moon, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Effect {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface EffectsTabProps {
  searchQuery: string;
  onEffectsComplete?: () => void;
}

export const EffectsTab = ({ searchQuery, onEffectsComplete }: EffectsTabProps) => {
  const effects: Effect[] = [
    { id: 'fx1', name: 'Holographic', icon: Sparkles, color: 'text-cyan-400', description: 'Rainbow shimmer effect' },
    { id: 'fx2', name: 'Neon Glow', icon: Zap, color: 'text-pink-400', description: 'Electric outline glow' },
    { id: 'fx3', name: 'Golden Hour', icon: Sun, color: 'text-yellow-400', description: 'Warm lighting effect' },
    { id: 'fx4', name: 'Moonlight', icon: Moon, color: 'text-blue-300', description: 'Cool silver glow' },
    { id: 'fx5', name: 'Fire Edge', icon: Sparkles, color: 'text-red-400', description: 'Burning border effect' },
    { id: 'fx6', name: 'Crystal Shine', icon: Sparkles, color: 'text-purple-300', description: 'Prismatic reflection' }
  ];

  const filteredEffects = effects.filter(effect => 
    effect.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Effects & Layers</h3>
          <p className="text-crd-lightGray text-sm">
            Add visual effects to make your card unique and immersive
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Lighting & Effects</h4>
          <div className="grid grid-cols-2 gap-3">
            {filteredEffects.map((effect) => {
              const IconComponent = effect.icon;
              return (
                <div 
                  key={effect.id}
                  className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-3"
                  onClick={() => toast.success(`${effect.name} effect applied`)}
                >
                  <IconComponent className={`w-8 h-8 ${effect.color}`} />
                  <div className="text-center">
                    <p className="text-white text-xs font-medium">{effect.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{effect.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-editor-tool rounded-xl">
          <h4 className="text-white font-medium text-sm mb-3">Effect Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="text-gray-300 text-xs">Intensity</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="50"
                className="w-full mt-1 accent-crd-green"
              />
            </div>
            <div>
              <label className="text-gray-300 text-xs">Blend Mode</label>
              <select className="w-full mt-1 bg-editor-dark border border-editor-border rounded-lg px-3 py-2 text-white text-xs">
                <option>Normal</option>
                <option>Multiply</option>
                <option>Screen</option>
                <option>Overlay</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3D Preview Info */}
        <div className="bg-crd-purple/20 border border-crd-purple/30 p-4 rounded-xl">
          <h4 className="text-crd-purple font-medium text-sm mb-2">3D Effects Preview</h4>
          <p className="text-crd-lightGray text-xs mb-3">
            Effects will be fully visible in the immersive 3D viewer with dynamic lighting and depth.
          </p>
          <Button variant="outline" className="w-full border-crd-purple text-crd-purple hover:bg-crd-purple hover:text-black">
            Preview in 3D
          </Button>
        </div>

        {/* Continue Button */}
        <div className="pt-4 border-t border-editor-border">
          <Button 
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium" 
            onClick={onEffectsComplete}
          >
            Continue to Photo Upload
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
