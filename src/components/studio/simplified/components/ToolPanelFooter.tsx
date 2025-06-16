
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface ToolPanelFooterProps {
  selectedCard: GridCard;
}

export const ToolPanelFooter: React.FC<ToolPanelFooterProps> = ({ selectedCard }) => {
  const { cardData } = selectedCard;

  return (
    <footer className="p-8 border-t border-studio-border/20 space-y-5 bg-gradient-to-r from-studio-dark to-studio-darker">
      <Button
        className="w-full bg-gradient-to-r from-studio-accent to-studio-accent/90 hover:from-studio-accent/90 hover:to-studio-accent text-studio-dark font-bold h-14 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-studio-accent/25 rounded-xl text-base"
        onClick={() => toast.success(`"${cardData.title}" saved and published!`)}
      >
        <Save className="w-5 h-5 mr-3" />
        Save & Publish
      </Button>
      
      <Button
        variant="outline"
        className="w-full border-studio-border/50 bg-transparent text-studio-text/70 hover:text-studio-text hover:bg-studio-darker/50 hover:border-studio-border h-13 transition-all duration-200 rounded-xl text-base"
        onClick={() => toast.success('Share link copied to clipboard!')}
      >
        <Share2 className="w-5 h-5 mr-3" />
        Share Card
      </Button>
    </footer>
  );
};
