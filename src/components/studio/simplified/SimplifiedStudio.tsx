
import React from 'react';
import { StudioHeader, StudioMainContent } from './components';
import { SimplifiedToolPanel } from './SimplifiedToolPanel';
import { useStudioState } from './hooks/useStudioState';

export const SimplifiedStudio: React.FC = () => {
  const {
    cards,
    selectedCardId,
    selectedCard,
    handleAddCard,
    handleCardSelect,
    handleCardUpdate,
    handleCardMove,
    handleSaveAll,
    handleExportAll
  } = useStudioState();

  return (
    <div className="h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316] flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <StudioHeader
          cardsCount={cards.length}
          selectedCardTitle={selectedCard?.cardData.title}
          onAddCard={handleAddCard}
          onSaveAll={handleSaveAll}
          onExportAll={handleExportAll}
          isAddCardDisabled={cards.length >= 16}
        />

        <StudioMainContent
          cards={cards}
          selectedCardId={selectedCardId}
          onCardSelect={handleCardSelect}
          onCardMove={handleCardMove}
        />
      </div>

      {/* Tool Panel */}
      <SimplifiedToolPanel
        selectedCard={selectedCard}
        onUpdateCard={handleCardUpdate}
      />
    </div>
  );
};
