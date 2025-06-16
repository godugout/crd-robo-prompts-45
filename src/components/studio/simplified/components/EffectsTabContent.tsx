
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { EXTRACTED_FRAMES } from '../../frames/ExtractedFrameConfigs';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface EffectsTabContentProps {
  selectedCard: GridCard;
  onUpdateCard: (cardId: string, field: string, value: any) => void;
}

export const EffectsTabContent: React.FC<EffectsTabContentProps> = ({
  selectedCard,
  onUpdateCard
}) => {
  const { cardData } = selectedCard;

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdateCard(selectedCard.id, field, value);
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Frame Selection */}
      <Card className="bg-studio-darker/50 border-studio-border/30 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="w-6 h-6 text-studio-accent" />
          <h4 className="text-studio-text font-bold text-xl">Card Frames</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          {EXTRACTED_FRAMES.slice(0, 6).map((frame) => (
            <button
              key={frame.id}
              className={`
                aspect-video rounded-xl border-2 cursor-pointer transition-all duration-300 p-5 text-center group relative overflow-hidden
                ${cardData.template_id === frame.id 
                  ? 'border-studio-accent bg-studio-accent/10 shadow-lg shadow-studio-accent/25' 
                  : 'border-studio-border/50 hover:border-studio-accent/50 hover:bg-studio-darker/50'
                }
              `}
              onClick={() => handleFieldUpdate('template_id', frame.id)}
            >
              <div className="text-studio-text text-sm font-semibold truncate group-hover:text-studio-accent transition-colors duration-200">
                {frame.name}
              </div>
              {cardData.template_id === frame.id && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-studio-accent rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Visual Effects */}
      <Card className="bg-studio-darker/50 border-studio-border/30 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="w-6 h-6 text-studio-accent" />
          <h4 className="text-studio-text font-bold text-xl">Visual Effects</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          {[
            { name: 'Holographic', color: '#8b5cf6' },
            { name: 'Glow', color: '#3b82f6' },
            { name: 'Chrome', color: '#6b7280' },
            { name: 'Vintage', color: '#f59e0b' }
          ].map((effect) => (
            <Button
              key={effect.name}
              variant="outline"
              className="border-studio-border/50 text-studio-text/70 hover:text-studio-text hover:bg-studio-darker/50 hover:border-studio-accent/50 text-sm h-14 transition-all duration-200 rounded-xl group"
              onClick={() => toast.success(`${effect.name} effect applied`)}
            >
              <div 
                className="w-4 h-4 rounded-full mr-4 border border-studio-text/30 group-hover:border-studio-accent/50 transition-colors duration-200"
                style={{ backgroundColor: effect.color }}
              />
              {effect.name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
