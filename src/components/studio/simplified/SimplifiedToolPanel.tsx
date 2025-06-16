
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Sparkles } from 'lucide-react';
import {
  ToolPanelHeader,
  DesignTabContent,
  EffectsTabContent,
  ToolPanelFooter
} from './components';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface SimplifiedToolPanelProps {
  selectedCard: GridCard | null;
  onUpdateCard: (cardId: string, field: string, value: any) => void;
}

export const SimplifiedToolPanel: React.FC<SimplifiedToolPanelProps> = ({
  selectedCard,
  onUpdateCard
}) => {
  const [activeTab, setActiveTab] = useState('design');

  if (!selectedCard) {
    return (
      <aside className="w-96 bg-gradient-to-b from-studio-darkest to-studio-dark border-l border-studio-border/20 flex flex-col">
        <div className="p-8 flex-1 flex items-center justify-center">
          <div className="text-center space-y-8">
            <div className="w-24 h-24 mx-auto bg-studio-darker rounded-3xl flex items-center justify-center shadow-xl">
              <Palette className="w-12 h-12 text-studio-text/50" />
            </div>
            <div className="space-y-4">
              <h3 className="text-studio-text font-bold text-2xl">Design Tools</h3>
              <p className="text-studio-text/60 text-base leading-relaxed max-w-xs">
                Select a card from the grid to start customizing its design, effects, and content.
              </p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-96 bg-gradient-to-b from-studio-darkest to-studio-dark border-l border-studio-border/20 flex flex-col">
      <ToolPanelHeader selectedCard={selectedCard} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-8 mt-8 bg-studio-darker/80 p-2 rounded-2xl shadow-inner backdrop-blur-sm">
          <TabsTrigger 
            value="design" 
            className="data-[state=active]:bg-studio-accent data-[state=active]:text-studio-dark text-studio-text/70 font-semibold transition-all duration-300 rounded-xl py-4 text-base"
          >
            <Palette className="w-5 h-5 mr-3" />
            Design
          </TabsTrigger>
          <TabsTrigger 
            value="effects" 
            className="data-[state=active]:bg-studio-accent data-[state=active]:text-studio-dark text-studio-text/70 font-semibold transition-all duration-300 rounded-xl py-4 text-base"
          >
            <Sparkles className="w-5 h-5 mr-3" />
            Effects
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <TabsContent value="design" className="m-0">
            <DesignTabContent 
              selectedCard={selectedCard}
              onUpdateCard={onUpdateCard}
            />
          </TabsContent>

          <TabsContent value="effects" className="m-0">
            <EffectsTabContent 
              selectedCard={selectedCard}
              onUpdateCard={onUpdateCard}
            />
          </TabsContent>
        </div>
      </Tabs>

      <ToolPanelFooter selectedCard={selectedCard} />
    </aside>
  );
};
