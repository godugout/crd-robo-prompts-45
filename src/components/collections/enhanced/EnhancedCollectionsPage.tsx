
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Filter, 
  Folder,
  Image,
  Sparkles
} from 'lucide-react';
import { CollectionStats } from './CollectionStats';
import { CollectionTemplates } from './CollectionTemplates';
import { QuickCreateCollection } from './QuickCreateCollection';
import { UnifiedCard } from '@/components/ui/UnifiedCard';
import { UnifiedEmptyState } from '@/components/ui/UnifiedEmptyState';
import { UnifiedLoading } from '@/components/ui/UnifiedLoading';

export const EnhancedCollectionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stats = {
    totalCollections: 12,
    totalCards: 156,
    favoriteCollections: 3,
    recentActivity: 8
  };

  // Mock collections data
  const mockCollections = [
    {
      id: '1',
      title: 'Baseball Legends',
      description: 'Classic baseball cards from the golden era',
      cardCount: 24,
      isPublic: true,
      lastUpdated: '2 days ago'
    },
    {
      id: '2',
      title: 'Oakland A\'s Collection',
      description: 'Celebrating the rich history of Oakland Athletics',
      cardCount: 18,
      isPublic: false,
      lastUpdated: '1 week ago'
    },
    {
      id: '3',
      title: 'Modern Art Cards',
      description: 'Contemporary designs and artistic creations',
      cardCount: 31,
      isPublic: true,
      lastUpdated: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Collections</h1>
              <p className="text-gray-400">Organize and showcase your card creations</p>
            </div>
            <Button
              onClick={() => setShowQuickCreate(true)}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Collection
            </Button>
          </div>

          <CollectionStats stats={stats} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="my-collections" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="my-collections" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Folder className="w-4 h-4 mr-2" />
              My Collections
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Image className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-collections" className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently Updated</SelectItem>
                      <SelectItem value="created">Recently Created</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="cards">Most Cards</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="p-2"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="p-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Collections Display */}
            {isLoading ? (
              <div className="py-12">
                <UnifiedLoading size="lg" text="Loading your collections..." />
              </div>
            ) : mockCollections.length === 0 ? (
              <UnifiedEmptyState
                icon={<Folder className="w-16 h-16 text-gray-400" />}
                title="No Collections Yet"
                description="Create your first collection to organize your cards and showcase your creativity."
                action={{
                  label: "Create Collection",
                  onClick: () => setShowQuickCreate(true)
                }}
              />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {mockCollections.map(collection => (
                  <UnifiedCard
                    key={collection.id}
                    title={collection.title}
                    description={`${collection.cardCount} cards • ${collection.lastUpdated}`}
                    rarity={collection.isPublic ? 'rare' : 'common'}
                    stats={{
                      views: Math.floor(Math.random() * 1000),
                      likes: Math.floor(Math.random() * 100)
                    }}
                    actions={{
                      onView: () => console.log('View collection:', collection.id),
                      onLike: () => console.log('Like collection:', collection.id),
                      onShare: () => console.log('Share collection:', collection.id)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-crd-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Discover Amazing Collections</h3>
              <p className="text-gray-400 mb-6">Explore collections from creators around the world</p>
            </div>
            
            {/* Public collections would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockCollections.filter(c => c.isPublic).map(collection => (
                <UnifiedCard
                  key={collection.id}
                  title={collection.title}
                  description={collection.description}
                  rarity="epic"
                  stats={{
                    views: Math.floor(Math.random() * 5000),
                    likes: Math.floor(Math.random() * 500)
                  }}
                  actions={{
                    onView: () => console.log('View collection:', collection.id),
                    onLike: () => console.log('Like collection:', collection.id),
                    onShare: () => console.log('Share collection:', collection.id)
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <CollectionTemplates />
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Create Modal */}
      {showQuickCreate && (
        <QuickCreateCollection
          onClose={() => setShowQuickCreate(false)}
          onSuccess={() => {
            setShowQuickCreate(false);
            // Refresh collections would happen here
          }}
        />
      )}
    </div>
  );
};
