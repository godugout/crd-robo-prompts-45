
import React from 'react';
import type { Collection } from './types';
import { formatDate } from './utils';

interface CollectionsListProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (collectionId: string) => void;
}

export const CollectionsList: React.FC<CollectionsListProps> = ({
  collections,
  selectedCollectionId,
  onSelectCollection
}) => {
  if (collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-crd-lightGray mb-4">No collections yet</p>
        <p className="text-sm text-crd-lightGray">Create your first collection to save these cards</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedCollectionId === collection.id
              ? 'border-crd-green bg-crd-green/10'
              : 'border-crd-mediumGray hover:border-crd-green/50'
          }`}
          onClick={() => onSelectCollection(collection.id)}
        >
          <h6 className="font-semibold text-crd-white mb-1">{collection.name}</h6>
          {collection.description && (
            <p className="text-sm text-crd-lightGray mb-2 line-clamp-2">
              {collection.description}
            </p>
          )}
          <div className="text-xs text-crd-lightGray">
            {collection.cardCount} cards • Created {formatDate(collection.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
};
