
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CardsPageHeaderProps {
  onAddCards: () => void;
}

export const CardsPageHeader: React.FC<CardsPageHeaderProps> = ({ onAddCards }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Card Catalog Manager</h1>
        <p className="text-crd-lightGray">
          AI-powered card detection and collection management
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={onAddCards}
          className="bg-crd-green hover:bg-crd-green/80 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Cards
        </Button>
      </div>
    </div>
  );
};
