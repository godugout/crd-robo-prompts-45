
import React from 'react';
import { CardElementType } from './DraggableCardItem';

interface StudioAnalyticsProps {
  cards: CardElementType[];
  selectedCard: CardElementType | null;
  creationMode: string;
}
export const StudioAnalytics: React.FC<StudioAnalyticsProps> = ({ cards, selectedCard, creationMode }) => (
  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-4 text-white border border-purple-400/20">
    <div className="text-sm opacity-75 mb-2 text-purple-200">Studio Analytics</div>
    <div className="space-y-1 text-xs">
      <div>Cards Forged: <span className="text-emerald-400 font-bold">{cards.length}</span></div>
      <div>Active: <span className="text-purple-400 font-bold">
        {selectedCard ? selectedCard.cardData.title : 'None'}
      </span></div>
      <div>Style: <span className="text-cyan-400 font-bold">{creationMode}</span></div>
      <div>Rarity Mix: <span className="text-yellow-400 font-bold">
        {cards.filter(c => c.cardData.rarity === 'legendary').length}L, {cards.filter(c => c.cardData.rarity === 'epic').length}E
      </span></div>
    </div>
  </div>
);
