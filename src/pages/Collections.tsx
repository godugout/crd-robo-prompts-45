
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, Plus, Users, Palette, Star, Crown, Gem, Grid } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingState } from '@/components/common/LoadingState';
import { handleApiError } from '@/utils/toast-handlers';
import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { toast } from 'sonner';
import { getUserCollections, getAllCollections } from '@/repositories/collection/queries';
import { createCollection, updateCollection, deleteCollection } from '@/repositories/collection/mutations';
import { useCreators } from '@/hooks/useCreators';
import { useAllCollections } from '@/hooks/useCollections';
import type { Collection } from '@/repositories/collection/types';

const Collections = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('my-collections');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // My Collections data
  const { data: myCollectionsData, isLoading: myCollectionsLoading } = useQuery({
    queryKey: ['user-collections', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await getUserCollections(user.id, { pageSize: 20 });
    },
    enabled: !!user?.id && activeTab === 'my-collections'
  });

  // Discover Collections data
  const { data: discoverCollectionsData, isLoading: discoverLoading } = useQuery({
    queryKey: ['all-collections'],
    queryFn: async () => {
      return await getAllCollections({ pageSize: 20 });
    },
    enabled: activeTab === 'discover'
  });

  // Creators data
  const { popularCreators, loading: creatorsLoading } = useCreators();

  const createMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection created successfully!');
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection. Please try again.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection. Please try again.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete collection:', error);
      toast.error('Failed to delete collection. Please try again.');
    }
  });

  const handleCreateCollection = async (collectionData: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to create collections');
      return;
    }

    createMutation.mutate({
      title: collectionData.name,
      description: collectionData.description,
      ownerId: user.id,
      visibility: collectionData.visibility || 'private'
    });
  };

  const handleEditCollection = (collection: Collection) => {
    toast.info('Edit functionality coming soon!');
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      deleteMutation.mutate(collectionId);
    }
  };

  const handleViewCollection = (collection: Collection) => {
    window.location.href = `/collection/${collection.id}`;
  };

  // Frame data (simplified for now)
  const framesData = [
    {
      name: 'Classic Baseball',
      preview: '/placeholder.svg',
      creator: 'Community',
      price: 0,
      rarity: 'common',
      description: "A vintage-style frame perfect for baseball cards.",
      downloads: 1520,
      rating: 4.8
    },
    {
      name: 'Gold Signature',
      preview: '/placeholder.svg',
      creator: 'RookieCollectibles',
      price: 20,
      rarity: 'legendary',
      description: "Premium gold foil frame for ultra-rare cards.",
      downloads: 350,
      rating: 4.9
    }
  ];

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4 text-orange-400" />;
      case 'epic': return <Gem className="h-4 w-4 text-purple-400" />;
      default: return <Star className="h-4 w-4 text-blue-400" />;
    }
  };

  const myCollections = myCollectionsData?.collections || [];
  const discoverCollections = discoverCollectionsData?.collections || [];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 px-8 rounded-2xl bg-editor-dark border border-crd-mediumGray/20 mb-8">
          <h1 className="text-5xl font-bold mb-6 text-crd-white">
            Collections Hub
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-crd-lightGray">
            Create, discover, and explore collections from the community. Organize your cards, find amazing frames, and connect with creators.
          </p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Collection
          </Button>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-8 p-1 rounded-xl bg-editor-dark border border-crd-mediumGray/20">
            <TabsTrigger value="my-collections" className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Grid className="mr-2 h-4 w-4" />
              My Collections
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Star className="mr-2 h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="frames" className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Palette className="mr-2 h-4 w-4" />
              Frames & Assets
            </TabsTrigger>
            <TabsTrigger value="creators" className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Users className="mr-2 h-4 w-4" />
              Creators
            </TabsTrigger>
          </TabsList>
          
          {/* My Collections Tab */}
          <TabsContent value="my-collections" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-crd-white">My Collections</h2>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Collection
              </Button>
            </div>

            {myCollectionsLoading ? (
              <LoadingState message="Loading your collections..." />
            ) : myCollections.length === 0 ? (
              <EmptyState 
                title="No collections yet" 
                description="Create your first collection to organize your cards into themed groups"
                action={{
                  label: "Create Collection",
                  onClick: () => setShowCreateModal(true),
                  icon: <Plus className="mr-2 h-4 w-4" />
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onEdit={handleEditCollection}
                    onDelete={handleDeleteCollection}
                    onView={handleViewCollection}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discover Collections Tab */}
          <TabsContent value="discover" className="space-y-8">
            <h2 className="text-2xl font-bold text-crd-white">Discover Collections</h2>
            
            {discoverLoading ? (
              <LoadingState message="Loading collections..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {discoverCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onView={handleViewCollection}
                    showOwner={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Frames & Assets Tab */}
          <TabsContent value="frames" className="space-y-8">
            <h2 className="text-2xl font-bold text-crd-white">Frames & Assets</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {framesData.map((frame, index) => (
                <div key={index} className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 overflow-hidden">
                  <div className="relative h-48 bg-crd-mediumGray"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {getRarityIcon(frame.rarity)}
                      <h3 className="font-bold text-lg text-crd-white">{frame.name}</h3>
                    </div>
                    <p className="text-sm mb-4 text-crd-lightGray">{frame.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-crd-lightGray">by {frame.creator}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-crd-lightGray">{frame.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-crd-green">
                        {frame.price === 0 ? "Free" : `${frame.price} CC`}
                      </span>
                      <span className="text-xs text-crd-lightGray">{frame.downloads} downloads</span>
                    </div>
                    <Button className="w-full bg-crd-green hover:bg-crd-green/90 text-black">
                      Use Frame
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators" className="space-y-8">
            <h2 className="text-2xl font-bold text-crd-white">Featured Creators</h2>
            
            {creatorsLoading ? (
              <LoadingState message="Loading creators..." />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularCreators.slice(0, 8).map((creator, index) => (
                  <div key={index} className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-crd-mediumGray mx-auto mb-4">
                      {creator.avatar_url && (
                        <img 
                          src={creator.avatar_url} 
                          alt={creator.full_name} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      )}
                    </div>
                    <h3 className="font-bold text-crd-white mb-2">{creator.full_name || 'Creator'}</h3>
                    <p className="text-sm text-crd-lightGray mb-4">{creator.bio || 'Card Creator'}</p>
                    <Button variant="outline" size="sm" className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-crd-lightGray">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCollection}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
};

export default Collections;
