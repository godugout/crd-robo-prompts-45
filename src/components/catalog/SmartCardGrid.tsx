
import React from 'react';
import { useCardCatalog } from '@/hooks/useCardCatalog';
import { DetectedCard } from '@/services/cardCatalog/types';
import { SmartCardGridControls } from './components/SmartCardGridControls';
import { SmartCardGridEmpty } from './components/SmartCardGridEmpty';
import { SmartCardGridItem } from './components/SmartCardGridItem';
import { SmartCardListItem } from './components/SmartCardListItem';

interface SmartCardGridProps {
  onCardEdit?: (card: DetectedCard) => void;
  onCardCreate?: (card: DetectedCard) => void;
}

export const SmartCardGrid = ({ onCardEdit, onCardCreate }: SmartCardGridProps) => {
  const {
    filteredCards,
    selectedCards,
    viewMode,
    sortBy,
    toggleCardSelection,
    selectAllVisible,
    clearSelection,
    deleteSelected,
    setViewMode,
    updateSort
  } = useCardCatalog();

  if (filteredCards.length === 0) {
    return <SmartCardGridEmpty />;
  }

  const isAllSelected = selectedCards.size === filteredCards.length;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <SmartCardGridControls
        filteredCardsCount={filteredCards.length}
        selectedCardsCount={selectedCards.size}
        viewMode={viewMode}
        sortBy={sortBy}
        onViewModeChange={setViewMode}
        onSortChange={updateSort}
        onSelectAll={isAllSelected ? clearSelection : selectAllVisible}
        onClearSelection={clearSelection}
        onDeleteSelected={deleteSelected}
        isAllSelected={isAllSelected}
      />

      {/* Cards Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredCards.map((card) => (
            <SmartCardGridItem
              key={card.id}
              card={card}
              isSelected={selectedCards.has(card.id)}
              onToggleSelection={toggleCardSelection}
              onEdit={onCardEdit}
              onCreate={onCardCreate}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <SmartCardListItem
              key={card.id}
              card={card}
              isSelected={selectedCards.has(card.id)}
              onToggleSelection={toggleCardSelection}
              onEdit={onCardEdit}
              onCreate={onCardCreate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
