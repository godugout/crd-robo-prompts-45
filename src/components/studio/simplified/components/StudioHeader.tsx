
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download } from 'lucide-react';

interface StudioHeaderProps {
  cardsCount: number;
  selectedCardTitle?: string;
  onAddCard: () => void;
  onSaveAll: () => void;
  onExportAll: () => void;
  isAddCardDisabled: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  cardsCount,
  selectedCardTitle,
  onAddCard,
  onSaveAll,
  onExportAll,
  isAddCardDisabled
}) => {
  return (
    <header className="bg-[#1a1a1d]/90 backdrop-blur-sm border-b border-[#27272a] px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Card Studio
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#a1a1aa]">
              {cardsCount} of 16 cards
            </span>
            {selectedCardTitle && (
              <>
                <div className="w-1 h-1 bg-[#4a4a4a] rounded-full" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
                  <span className="text-white font-medium">
                    Editing: {selectedCardTitle}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={onAddCard}
            disabled={isAddCardDisabled}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-6 py-2.5 h-auto transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-crd-green/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onSaveAll}
              variant="outline"
              className="border-[#3f3f46] bg-transparent text-[#a1a1aa] hover:text-white hover:bg-[#27272a] hover:border-[#4a4a4a] transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
            <Button
              onClick={onExportAll}
              variant="outline"
              className="border-[#3f3f46] bg-transparent text-[#a1a1aa] hover:text-white hover:bg-[#27272a] hover:border-[#4a4a4a] transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
