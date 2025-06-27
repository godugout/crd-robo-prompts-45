import React, { useState } from 'react';
import { CollectionGrid } from '../real-time/CollectionGrid';
import { useCollectionRealtime } from '@/hooks/collections/useCollectionRealtime';
import { useAuth } from '@/contexts/AuthContext';

export const EnhancedCollectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Enable real-time updates for collections
  useCollectionRealtime('all');

  const handleCollectionClick = (collection: any) => {
    setSelectedCollectionId(collection.id);
  };

  const handleBack = () => {
    setSelectedCollectionId(null);
  };

  return (
    <div className="min-h-screen bg-crd-darkest text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
          {selectedCollectionId ? 'Collection Detail' : 'Collections'}
        </h1>

        {selectedCollectionId ? (
          <div>
            {/*<CollectionDetail collectionId={selectedCollectionId} onBack={handleBack} />*/}
          </div>
        ) : (
          <CollectionGrid
            showUserCollections
            userId={user?.id}
            onCollectionClick={handleCollectionClick}
          />
        )}
      </div>
    </div>
  );
};
