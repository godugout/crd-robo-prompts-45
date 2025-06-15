
import React, { useState, useEffect } from 'react';
import { useCardEditor, CardData } from '@/hooks/useCardEditor';
import { EditorPropertiesPanel } from '@/components/editor/EditorPropertiesPanel';

interface CardForEditing {
  id: string;
  cardData: CardData;
}

const EditorPanelForSelectedCard: React.FC<{ cardForEditing: CardForEditing }> = ({ cardForEditing }) => {
  const cardEditor = useCardEditor({ initialData: cardForEditing.cardData });

  useEffect(() => {
    // This effect syncs any change in the editor back to the whiteboard view
    window.dispatchEvent(new CustomEvent('cardUpdated', { 
      detail: { cardId: cardForEditing.id, cardData: cardEditor.cardData } 
    }));
  }, [cardEditor.cardData, cardForEditing.id]);

  return <EditorPropertiesPanel cardEditor={cardEditor} />;
}

interface StudioPropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioPropertiesPanel: React.FC<StudioPropertiesPanelProps> = ({ isOpen, onClose }) => {
  const [cardForEditing, setCardForEditing] = useState<{id: string, cardData: CardData} | null>(null);

  useEffect(() => {
    const handleCardSelected = (event: CustomEvent) => {
      if (event.detail && event.detail.card) {
        setCardForEditing({ id: event.detail.card.id, cardData: event.detail.card.cardData });
      } else {
        setCardForEditing(null);
      }
    };

    window.addEventListener('cardSelectedForEditing', handleCardSelected as EventListener);
    return () => {
      window.removeEventListener('cardSelectedForEditing', handleCardSelected as EventListener);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  if (cardForEditing) {
    return <EditorPanelForSelectedCard key={cardForEditing.id} cardForEditing={cardForEditing} />;
  }
  
  return (
    <div className="w-96 bg-editor-dark border-l border-editor-border overflow-y-auto rounded-xl">
      <div className="p-6">
        <h2 className="text-white text-xl font-semibold mb-6">Card Properties</h2>
        <p className="text-gray-400">Select a card on the whiteboard to edit its properties.</p>
      </div>
    </div>
  );
};
