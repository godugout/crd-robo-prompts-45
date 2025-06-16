
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Type } from 'lucide-react';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface ToolPanelHeaderProps {
  selectedCard: GridCard;
}

const rarityColors = {
  common: 'hsl(210, 40%, 98%)',
  uncommon: 'hsl(142, 76%, 36%)',
  rare: 'hsl(221, 83%, 53%)',
  epic: 'hsl(262, 83%, 58%)',
  legendary: 'hsl(45, 93%, 47%)'
};

export const ToolPanelHeader: React.FC<ToolPanelHeaderProps> = ({ selectedCard }) => {
  const { cardData } = selectedCard;

  return (
    <header className="p-8 border-b border-studio-border/20 bg-gradient-to-r from-studio-dark to-studio-darker">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-gradient-to-br from-studio-accent to-studio-accent/80 rounded-2xl flex items-center justify-center shadow-lg shadow-studio-accent/25">
            <Type className="w-6 h-6 text-studio-dark" />
          </div>
          <div>
            <h2 className="text-studio-text font-bold text-2xl tracking-tight">Card Editor</h2>
            <p className="text-studio-text/60 text-sm mt-1">Professional editing tools</p>
          </div>
        </div>
        
        <Badge 
          className="text-xs font-bold px-4 py-2 rounded-full shadow-lg"
          style={{ 
            backgroundColor: rarityColors[cardData.rarity as keyof typeof rarityColors],
            color: '#1e293b'
          }}
        >
          {cardData.rarity.toUpperCase()}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-studio-text font-bold text-xl truncate">
          {cardData.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-studio-text/70">
          <div className="w-2 h-2 bg-studio-accent rounded-full animate-pulse" />
          <span>Currently editing</span>
          <div className="w-1 h-1 bg-studio-text/30 rounded-full" />
          <span>Auto-save enabled</span>
        </div>
      </div>
    </header>
  );
};
