
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { Plus, FolderPlus } from 'lucide-react';

interface CreateCollectionFormProps {
  isCreatingNew: boolean;
  newCollectionName: string;
  newCollectionDescription: string;
  onStartCreating: () => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  isCreatingNew,
  newCollectionName,
  newCollectionDescription,
  onStartCreating,
  onNameChange,
  onDescriptionChange,
  onCreate,
  onCancel,
  isSaving
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-crd-white">Select Collection</h4>
        <CRDButton
          variant="outline"
          onClick={onStartCreating}
          disabled={isSaving}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </CRDButton>
      </div>

      {isCreatingNew && (
        <div className="bg-editor-tool rounded-lg p-4 mb-6">
          <h5 className="font-medium text-crd-white mb-3">Create New Collection</h5>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Collection name..."
              value={newCollectionName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-3 py-2 bg-crd-darkGray border border-crd-mediumGray rounded-lg text-white"
              autoFocus
            />
            <textarea
              placeholder="Collection description (optional)..."
              value={newCollectionDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-crd-darkGray border border-crd-mediumGray rounded-lg text-white resize-none"
            />
            <div className="flex gap-2">
              <CRDButton
                variant="primary"
                size="sm"
                onClick={onCreate}
                disabled={!newCollectionName.trim()}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Create
              </CRDButton>
              <CRDButton
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </CRDButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
