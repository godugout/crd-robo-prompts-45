
import React, { useState } from 'react';
import { useCollectionsRealtime } from '@/hooks/collections/useCollectionRealtime';
import { useAuth } from '@/contexts/AuthContext';
import { CollectionGrid } from '../CollectionGrid';
import { CollectionDetail } from '../CollectionDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Grid, List, Sparkles } from 'lucide-react';

export const EnhancedCollectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Enable global real-time updates for collections
  const { isConnected } = useCollectionsRealtime();

  if (selectedCollectionId) {
    return (
      <CollectionDetail
        collectionId={selectedCollectionId}
        onBack={() => setSelectedCollectionId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Collections</h1>
              <p className="text-crd-lightGray">
                Organize and showcase your card collections
                {isConnected && (
                  <span className="ml-2 inline-flex items-center text-xs text-crd-green">
                    <div className="w-2 h-2 bg-crd-green rounded-full mr-1 animate-pulse" />
                    Live
                  </span>
                )}
              </p>
            </div>
            
            {user && (
              <Button className="bg-crd-green text-black hover:bg-crd-green/80">
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            )}
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-crd-mediumGray border-crd-mediumGray text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-crd-green text-black' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-crd-green text-black' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-crd-mediumGray mb-6">
            <TabsTrigger 
              value="discover" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            {user && (
              <TabsTrigger 
                value="mine" 
                className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                My Collections
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <CollectionGrid
              variant="public"
              onCollectionSelect={setSelectedCollectionId}
            />
          </TabsContent>

          {user && (
            <TabsContent value="mine">
              <CollectionGrid
                variant="user"
                userId={user.id}
                onCollectionSelect={setSelectedCollectionId}
              />
            </TabsContent>
          )}

          <TabsContent value="featured">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-white mb-2">Featured Collections</h3>
              <p className="text-crd-lightGray">
                Coming soon - curated collections from top creators
              </p>
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">Trending Collections</h3>
              <p className="text-crd-lightGray">
                Coming soon - collections gaining popularity
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
