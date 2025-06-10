import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { Save } from 'lucide-react';
import type { CollectionSelectionPhaseProps } from './types';
import { CardsSummary } from './CardsSummary';
import { CreateCollectionForm } from './CreateCollectionForm';
import { CollectionsList } from './CollectionsList';
import { useCollectionOperations } from './useCollectionOperations';

export const CollectionSelectionPhase: React.FC<CollectionSelectionPhaseProps> = ({
  extractedCards,
  onCollectionSelected,
  onGoBack
}) => {
  const {
    collections,
    selectedCollectionId,
    setSelectedCollectionId,
    isCreatingNew,
    setIsCreatingNew,
    newCollectionName,
    setNewCollectionName,
    newCollectionDescription,
    setNewCollectionDescription,
    isSaving,
    handleCreateNewCollection,
    handleSaveCards,
    cancelNewCollection
  } = useCollectionOperations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-crd-white mb-2">
            Save to Collection
          </h3>
          <p className="text-crd-lightGray">
            Choose a collection for your {extractedCards.length} cards
          </p>
        </div>
        <CRDButton
          variant="outline"
          onClick={onGoBack}
          disabled={isSaving}
        >
          Back to Customization
        </CRDButton>
      </div>

      {/* Card Summary */}
      <CardsSummary extractedCards={extractedCards} />

      {/* Collection Selection */}
      <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
        <CreateCollectionForm
          isCreatingNew={isCreatingNew}
          newCollectionName={newCollectionName}
          newCollectionDescription={newCollectionDescription}
          onStartCreating={() => setIsCreatingNew(true)}
          onNameChange={setNewCollectionName}
          onDescriptionChange={setNewCollectionDescription}
          onCreate={handleCreateNewCollection}
          onCancel={cancelNewCollection}
          isSaving={isSaving}
        />

        {/* Existing Collections */}
        <CollectionsList
          collections={collections}
          selectedCollectionId={selectedCollectionId}
          onSelectCollection={setSelectedCollectionId}
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-crd-white font-medium">
            {selectedCollectionId ? 'Ready to Save' : 'Select a Collection'}
          </p>
          <p className="text-sm text-crd-lightGray">
            {selectedCollectionId
              ? `${extractedCards.length} cards will be added to the selected collection`
              : 'Choose an existing collection or create a new one'
            }
          </p>
        </div>
        <CRDButton
          variant="primary"
          onClick={() => handleSaveCards(extractedCards, onCollectionSelected)}
          disabled={!selectedCollectionId || isSaving}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save {extractedCards.length} Cards
            </>
          )}
        </CRDButton>
      </div>
    </div>
  );
};
