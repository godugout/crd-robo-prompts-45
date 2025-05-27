
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { CreatedCard } from '../hooks/useCardUploadSession';

interface CardsCollectionProps {
  createdCards: CreatedCard[];
}

export const CardsCollection: React.FC<CardsCollectionProps> = ({ createdCards }) => {
  const downloadCard = (card: CreatedCard) => {
    const link = document.createElement('a');
    link.download = `${card.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.href = card.image;
    link.click();
    toast.success('Card downloaded!');
  };

  if (createdCards.length === 0) {
    return null;
  }

  return (
    <div className="bg-editor-dark rounded-xl p-8 border border-crd-mediumGray/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Card Collection</h2>
          <p className="text-crd-lightGray">{createdCards.length} cards in your collection</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {createdCards.map((card) => (
          <div key={card.id} className="relative group">
            <div className="aspect-[3/4] bg-editor-tool rounded-lg overflow-hidden border border-crd-mediumGray">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadCard(card)}
                  className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-white text-xs font-medium">{card.title}</p>
                <p className="text-crd-lightGray text-xs">
                  {Math.round(card.confidence * 100)}% confidence
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
