
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAllCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreators } from '@/hooks/useCreators';

const GallerySection = ({ 
  title, 
  children 
}: { 
  title: string, 
  children: React.ReactNode 
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-[#FCFCFD]">{title}</h2>
    {children}
  </div>
);

const Gallery = () => {
  const { collections, loading: collectionsLoading } = useAllCollections(1, 3);
  const { featuredCards, loading: cardsLoading } = useCards();
  const { popularCreators, loading: creatorsLoading } = useCreators();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[#FCFCFD]">Gallery</h1>
        
        <Tabs defaultValue="featured" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="mt-0">
            <GallerySection title="Featured Collections">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {collectionsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))
                ) : collections && collections.length > 0 ? (
                  collections.map((collection, index) => (
                    <Card key={index} className="bg-[#23262F] border-[#353945] overflow-hidden">
                      <div 
                        className="h-32 bg-cover bg-center"
                        style={{ 
                          backgroundImage: collection.coverImageUrl 
                            ? `url(${collection.coverImageUrl})` 
                            : 'url(https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80)'
                        }}
                      ></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-[#FCFCFD]">{collection.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-[#777E90] text-sm">{collection.description || 'A beautiful collection of cards'}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Collection</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#777E90] col-span-3 text-center py-8">No collections found</p>
                )}
              </div>
            </GallerySection>

            <GallerySection title="Featured Artists">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {creatorsLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))
                ) : popularCreators && popularCreators.length > 0 ? (
                  popularCreators.map((creator, index) => (
                    <Card key={index} className="bg-[#23262F] border-[#353945]">
                      <CardHeader className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-[#353945] mb-2">
                          {creator.avatarUrl && (
                            <img 
                              src={creator.avatarUrl} 
                              alt={creator.name} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          )}
                        </div>
                        <CardTitle className="text-center text-[#FCFCFD]">{creator.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center pb-2">
                        <p className="text-[#777E90] text-sm">{creator.bio || 'Artist'}</p>
                      </CardContent>
                      <CardFooter className="justify-center">
                        <Button variant="outline" size="sm">Follow</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#777E90] col-span-4 text-center py-8">No featured artists found</p>
                )}
              </div>
            </GallerySection>

            <GallerySection title="Featured Cards">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cardsLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))
                ) : featuredCards && featuredCards.length > 0 ? (
                  featuredCards.slice(0, 4).map((card, index) => (
                    <Card key={index} className="bg-[#23262F] border-[#353945] overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ 
                          backgroundImage: card.image_url 
                            ? `url(${card.image_url})` 
                            : 'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80)'
                        }}
                      ></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-[#FCFCFD] text-lg">{card.title}</CardTitle>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Card</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#777E90] col-span-4 text-center py-8">No featured cards found</p>
                )}
              </div>
            </GallerySection>
          </TabsContent>
          
          <TabsContent value="trending">
            <p className="text-[#777E90] text-center py-8">Trending content coming soon</p>
          </TabsContent>
          
          <TabsContent value="new">
            <p className="text-[#777E90] text-center py-8">New content coming soon</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Gallery;
