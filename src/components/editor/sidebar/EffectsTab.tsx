
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Zap, Sun, Moon } from 'lucide-react';
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
}

export const EffectsTab = ({ searchQuery }: EffectsTabProps) => {
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
      <div className="space-y-4">
        <h3 className="text-white font-medium text-sm uppercase tracking-wide">Lighting & Effects</h3>
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
      </div>
    </ScrollArea>
  );
};
