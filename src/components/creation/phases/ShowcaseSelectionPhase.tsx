
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Lightbulb, Globe, Zap } from 'lucide-react';

const SHOWCASE_ENVIRONMENTS = [
  {
    id: 'cosmic-space',
    name: 'Cosmic Space',
    environment: 'space',
    lighting: 'stellar',
    description: 'Floating in deep space with stellar lighting',
    preview: 'linear-gradient(135deg, #0f0f23, #1a1a3e, #2d1b69)',
    icon: Globe
  },
  {
    id: 'studio-spotlight',
    name: 'Studio Spotlight',
    environment: 'studio',
    lighting: 'dramatic',
    description: 'Professional studio with dramatic spotlighting',
    preview: 'linear-gradient(135deg, #1f2937, #374151, #4b5563)',
    icon: Lightbulb
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    environment: 'cyberpunk',
    lighting: 'neon',
    description: 'Futuristic cityscape with neon lighting',
    preview: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
    icon: Zap
  },
  {
    id: 'minimalist-display',
    name: 'Minimalist Display',
    environment: 'minimal',
    lighting: 'soft',
    description: 'Clean display case with soft ambient lighting',
    preview: 'linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)',
    icon: Eye
  }
];

interface ShowcaseSelectionPhaseProps {
  cardData: any;
  selectedShowcase: any;
  onShowcaseSelect: (showcase: any) => void;
}

export const ShowcaseSelectionPhase: React.FC<ShowcaseSelectionPhaseProps> = ({
  cardData,
  selectedShowcase,
  onShowcaseSelect
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Choose 3D Showcase</h2>
        <p className="theme-text-muted">
          Select how your card will be presented in virtual 3D space
        </p>
      </div>

      {/* Current Card Summary */}
      <Card className="theme-bg-accent border-crd-green/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="w-16 h-20 rounded border-2"
                style={{ background: cardData.frame?.preview || '#666' }}
              >
                {cardData.image && (
                  <img
                    src={URL.createObjectURL(cardData.image)}
                    alt="Card"
                    className="absolute inset-1 w-14 h-18 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium theme-text-primary">{cardData.frame?.name}</h4>
              <p className="text-sm theme-text-muted mb-2">
                {cardData.effects?.length || 0} effects applied
              </p>
              <div className="flex flex-wrap gap-1">
                {cardData.effects?.map((effect: any) => (
                  <Badge key={effect.id} variant="secondary" className="text-xs">
                    {effect.type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SHOWCASE_ENVIRONMENTS.map(showcase => (
          <Card
            key={showcase.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedShowcase?.id === showcase.id
                ? 'border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/20'
                : 'theme-border hover:border-crd-green/50'
            }`}
            onClick={() => onShowcaseSelect(showcase)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Showcase Preview */}
                <div className="relative">
                  <div 
                    className="aspect-video rounded-lg flex items-center justify-center"
                    style={{ background: showcase.preview }}
                  >
                    <div className="text-center">
                      <showcase.icon className="w-12 h-12 text-white/80 mx-auto mb-2" />
                      <div className="text-white/60 text-sm">3D Environment</div>
                    </div>
                  </div>
                  
                  {selectedShowcase?.id === showcase.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Showcase Info */}
                <div>
                  <h4 className="font-medium theme-text-primary text-lg mb-2">
                    {showcase.name}
                  </h4>
                  <p className="text-sm theme-text-muted mb-3">
                    {showcase.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {showcase.environment}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {showcase.lighting} lighting
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedShowcase && (
        <Card className="theme-bg-accent border-crd-green/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium theme-text-primary">
                  Selected: {selectedShowcase.name}
                </h4>
                <p className="text-sm theme-text-muted">
                  Your card will be showcased in {selectedShowcase.environment} environment
                </p>
              </div>
              <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50">
                Ready to Export
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
