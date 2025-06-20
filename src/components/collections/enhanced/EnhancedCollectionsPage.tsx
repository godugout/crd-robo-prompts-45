
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  TrendingUp, 
  Star, 
  Users, 
  Grid,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useCollectionsRealtime } from '@/hooks/collections/useCollectionRealtime';
import { useFeaturedCollections, usePublicCollections } from '@/hooks/collections/useCollectionQueries';
import { CollectionGrid } from '../real-time/CollectionGrid';
import { CollectionDetail } from '../real-time/CollectionDetail';
import { CreateCollectionModal } from '../CreateCollectionModal';
import type { Collection } from '@/types/collections';

export const EnhancedCollectionsPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Enable global real-time updates
  const { isConnected } = useCollectionsRealtime();

  // Featured collections
  const { data: featuredCollections } = useFeaturedCollections();

  if (selectedCollection) {
    return (
      <CollectionDetail
        collectionId={selectedCollection.id}
        onBack={() => setSelectedCollection(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 px-8 rounded-2xl bg-gradient-to-r from-editor-dark to-crd-darkGray border border-crd-mediumGray/20 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <Sparkles className="w-8 h-8 text-crd-green animate-pulse" />
            </div>
            <div className="absolute top-8 right-8">
              <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
            <div className="absolute bottom-6 left-8">
              <Zap className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-crd-green to-blue-400 bg-clip-text text-transparent">
              Collections Hub
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-crd-lightGray">
              Discover amazing collections, create your own masterpieces, and connect with fellow collectors in real-time.
            </p>
            
            {/* Real-time Status */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-crd-green/10 border border-crd-green/20 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-crd-green animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm text-crd-white">
                  {isConnected ? 'Live Updates Active' : 'Connecting...'}
                </span>
              </div>
            </div>

            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold text-lg px-8 py-3"
            >
              <Plus className="mr-2 h-6 w-6" />
              Create Collection
            </Button>
          </div>
        </div>

        {/* Featured Collections */}
        {featuredCollections && featuredCollections.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-crd-white">Featured Collections</h2>
              <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                Trending
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredCollections.slice(0, 4).map((collection) => (
                <div
                  key={collection.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="relative bg-editor-dark rounded-xl border border-crd-mediumGray/20 hover:border-crd-green/50 transition-all transform hover:scale-105 overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-crd-green/20 to-blue-400/20 relative">
                      {collection.cover_image_url ? (
                        <img 
                          src={collection.cover_image_url} 
                          alt={collection.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Grid className="w-12 h-12 text-crd-lightGray" />
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-yellow-400 text-black font-bold">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-crd-white mb-2 line-clamp-1">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-crd-lightGray mb-3 line-clamp-2">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-crd-lightGray">
                        <span>{collection.views_count} views</span>
                        <span>{Math.round(collection.completion_rate)}% complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-8 p-1 rounded-xl bg-editor-dark border border-crd-mediumGray/20">
            <TabsTrigger 
              value="discover" 
              className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Discover
            </TabsTrigger>
            {user && (
              <TabsTrigger 
                value="my-collections" 
                className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                <Grid className="mr-2 h-4 w-4" />
                My Collections
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="trending" 
              className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Star className="mr-2 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="flex-1 rounded-lg data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Users className="mr-2 h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-crd-white">Discover Collections</h2>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </div>

            <CollectionGrid 
              onCollectionClick={setSelectedCollection}
              className="min-h-96"
            />
          </TabsContent>

          {/* My Collections Tab */}
          {user && (
            <TabsContent value="my-collections" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-crd-white">My Collections</h2>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </Button>
              </div>

              <CollectionGrid 
                showUserCollections={true}
                userId={user.id}
                onCollectionClick={setSelectedCollection}
                className="min-h-96"
              />
            </TabsContent>
          )}

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-crd-white">Trending Collections</h2>
              <Badge className="bg-crd-green/10 text-crd-green border-crd-green/20">
                Updated Live
              </Badge>
            </div>

            <CollectionGrid 
              onCollectionClick={setSelectedCollection}
              className="min-h-96"
            />
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-crd-white">Community Collections</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Most Liked</Badge>
                <Badge variant="secondary">Most Viewed</Badge>
              </div>
            </div>

            <CollectionGrid 
              onCollectionClick={setSelectedCollection}
              className="min-h-96"
            />
          </TabsContent>
        </Tabs>

        {/* Create Collection Modal */}
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Create collection:', data);
            setShowCreateModal(false);
          }}
          isLoading={false}
        />
      </div>
    </div>
  );
};
