
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Trash2, Edit, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { makeUserCardsPublic } from '@/utils/cardUtils';
import { useAuth } from '@/contexts/AuthContext';
import type { UserCard } from '@/hooks/useUserCards';

interface ProfileCardsMultiSelectProps {
  cards: UserCard[];
  onCardsUpdated: () => void;
  children: (props: {
    selectedCards: string[];
    onCardSelect: (cardId: string) => void;
    isMultiSelectMode: boolean;
    toggleMultiSelect: () => void;
  }) => React.ReactNode;
}

export const ProfileCardsMultiSelect: React.FC<ProfileCardsMultiSelectProps> = ({
  cards,
  onCardsUpdated,
  children
}) => {
  const { user } = useAuth();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardSelect = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCards.length === cards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(cards.map(card => card.id));
    }
  };

  const toggleMultiSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedCards([]);
  };

  const handleBulkMakePublic = async () => {
    if (selectedCards.length === 0) {
      toast.error('Please select cards to make public');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .in('id', selectedCards)
        .eq('creator_id', user?.id);

      if (error) throw error;

      toast.success(`${selectedCards.length} cards made public successfully!`);
      setSelectedCards([]);
      onCardsUpdated();
    } catch (error) {
      console.error('Error making cards public:', error);
      toast.error('Failed to make cards public');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkMakePrivate = async () => {
    if (selectedCards.length === 0) {
      toast.error('Please select cards to make private');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: false })
        .in('id', selectedCards)
        .eq('creator_id', user?.id);

      if (error) throw error;

      toast.success(`${selectedCards.length} cards made private successfully!`);
      setSelectedCards([]);
      onCardsUpdated();
    } catch (error) {
      console.error('Error making cards private:', error);
      toast.error('Failed to make cards private');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCards.length === 0) {
      toast.error('Please select cards to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCards.length} cards? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .in('id', selectedCards)
        .eq('creator_id', user?.id);

      if (error) throw error;

      toast.success(`${selectedCards.length} cards deleted successfully!`);
      setSelectedCards([]);
      onCardsUpdated();
    } catch (error) {
      console.error('Error deleting cards:', error);
      toast.error('Failed to delete cards');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Multi-select Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleMultiSelect}
            variant="outline"
            size="sm"
            className="border-editor-border text-white hover:bg-editor-border"
          >
            {isMultiSelectMode ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Cancel Select
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 mr-2" />
                Multi-Select
              </>
            )}
          </Button>

          {isMultiSelectMode && (
            <>
              <Button
                onClick={handleSelectAll}
                variant="ghost"
                size="sm"
                className="text-crd-lightGray hover:text-white"
              >
                {selectedCards.length === cards.length ? 'Deselect All' : 'Select All'}
              </Button>
              <span className="text-sm text-crd-lightGray">
                {selectedCards.length} selected
              </span>
            </>
          )}
        </div>

        {/* Bulk Actions */}
        {isMultiSelectMode && selectedCards.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={handleBulkMakePublic}
              disabled={isLoading}
              size="sm"
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Globe className="w-4 h-4 mr-2" />
              Make Public
            </Button>
            <Button
              onClick={handleBulkMakePrivate}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-400/10"
            >
              Make Private
            </Button>
            <Button
              onClick={handleBulkDelete}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Render children with multi-select props */}
      {children({
        selectedCards,
        onCardSelect: handleCardSelect,
        isMultiSelectMode,
        toggleMultiSelect
      })}
    </div>
  );
};
