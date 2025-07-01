
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Sparkles, Zap, Minimize2 } from 'lucide-react';

interface ShowcaseEnvironmentSelectorProps {
  selectedEnvironment: string;
  onEnvironmentSelect: (environment: string) => void;
  cardPreview: {
    frame: string;
    image: string;
    effects: any;
  };
}

const ENVIRONMENTS = [
  {
    id: 'studio',
    name: 'Studio Spotlight',
    description: 'Professional studio lighting with dramatic shadows',
    icon: Monitor,
    lighting: 'Dramatic',
    background: 'Dark Gradient',
    preview: '🎬'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    description: 'Deep space environment with starfield background',
    icon: Sparkles,
    lighting: 'Ambient',
    background: 'Star Field',
    preview: '🌌'
  },
  {
    id: 'neon',
    name: 'Neon Cyberpunk',
    description: 'Futuristic neon-lit environment with electric colors',
    icon: Zap,
    lighting: 'Neon',
    background: 'Electric',
    preview: '⚡'
  },
  {
    id: 'minimal',
    name: 'Minimalist Display',
    description: 'Clean, simple environment focusing on the card',
    icon: Minimize2,
    lighting: 'Soft',
    background: 'Clean White',
    preview: '⬜'
  }
];

export const ShowcaseEnvironmentSelector: React.FC<ShowcaseEnvironmentSelectorProps> = ({
  selectedEnvironment,
  onEnvironmentSelect,
  cardPreview
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Environment Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#FCFCFD] mb-2">3D Showcase Environment</h2>
            <p className="text-[#777E90]">Choose how your card will be presented in 3D space</p>
          </div>

          {/* Environment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENVIRONMENTS.map((env) => {
              const IconComponent = env.icon;
              return (
                <Card
                  key={env.id}
                  className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                    selectedEnvironment === env.id
                      ? 'border-[#3772FF] bg-[#3772FF]/10 shadow-lg shadow-[#3772FF]/20'
                      : 'border-[#353945] bg-[#23262F] hover:border-[#3772FF]/50 hover:bg-[#23262F]/80'
                  }`}
                  onClick={() => onEnvironmentSelect(env.id)}
                >
                  {/* Preview */}
                  <div className="aspect-square bg-gradient-to-br from-[#353945] to-[#23262F] rounded-lg mb-4 flex items-center justify-center text-4xl">
                    {env.preview}
                  </div>

                  {/* Environment Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#FCFCFD] text-sm">{env.name}</h3>
                      {selectedEnvironment === env.id && (
                        <div className="w-2 h-2 bg-[#3772FF] rounded-full"></div>
                      )}
                    </div>

                    <p className="text-xs text-[#777E90]">{env.description}</p>

                    {/* Environment Details */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs bg-[#353945] text-[#B1B5C3]">
                        {env.lighting}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-[#353945] text-[#B1B5C3]">
                        {env.background}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Live 3D Preview */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#FCFCFD] mb-2">Environment Preview</h3>
            <p className="text-[#777E90]">See your card in the selected showcase environment</p>
          </div>

          {/* 3D Environment Preview */}
          <Card className="aspect-[4/3] bg-gradient-to-br from-[#353945] to-[#23262F] border-[#353945] overflow-hidden relative">
            {cardPreview.frame && cardPreview.image ? (
              <div className="w-full h-full flex items-center justify-center p-8 relative">
                {/* Environment Background */}
                <div 
                  className={`absolute inset-0 ${
                    selectedEnvironment === 'cosmic' ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' :
                    selectedEnvironment === 'neon' ? 'bg-gradient-to-br from-pink-500/20 to-cyan-500/20' :
                    selectedEnvironment === 'minimal' ? 'bg-gradient-to-br from-gray-100/10 to-white/10' :
                    'bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
                  }`}
                />
                
                {/* Card in 3D Space */}
                <div className="relative w-48 h-64 bg-[#141416] rounded-lg overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <img
                    src={cardPreview.image}
                    alt="Card in Environment"
                    className="w-full h-full object-cover"
                  />
                  {/* Environmental lighting overlay */}
                  <div className={`absolute inset-0 ${
                    selectedEnvironment === 'studio' ? 'bg-gradient-to-t from-black/30 to-transparent' :
                    selectedEnvironment === 'cosmic' ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10' :
                    selectedEnvironment === 'neon' ? 'bg-gradient-to-br from-pink-500/20 to-cyan-500/20' :
                    'bg-gradient-to-br from-gray-100/5 to-white/5'
                  }`} />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#777E90]">
                <div className="text-center">
                  <Monitor className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Complete previous steps to see environment preview</p>
                </div>
              </div>
            )}
          </Card>

          {/* Environment Info */}
          {selectedEnvironment && (
            <Card className="p-4 bg-[#23262F] border-[#353945]">
              <h4 className="text-sm font-bold text-[#FCFCFD] mb-2">Environment Details</h4>
              {(() => {
                const env = ENVIRONMENTS.find(e => e.id === selectedEnvironment);
                return env ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#777E90]">Lighting Style:</span>
                      <span className="text-[#FCFCFD]">{env.lighting}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#777E90]">Background:</span>
                      <span className="text-[#FCFCFD]">{env.background}</span>
                    </div>
                  </div>
                ) : null;
              })()}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
