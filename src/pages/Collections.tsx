import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useHotCollections } from '@/hooks/useCollections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Filter, 
  Grid3X3, 
  List, 
  Search,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Collections: React.FC = () => {
  const { theme } = useTheme();
  const { hotCollections, loading } = useHotCollections();

  // Fallback data
  const fallbackCollections = [
    {
      title: "Awesome Collection",
      owner: "@randomdash",
      items: 28,
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/c53d34af6eeaf5de2e7c1dd33b25a4a97a8b6f85?placeholderIfAbsent=true",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/d95bd2a5c1fda0f04a12b61d44ee1d9ad2acd3af?placeholderIfAbsent=true",
    },
    {
      title: "Card Collection",
      owner: "@tranmautritam",
      items: 28,
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f77e9a2f29b3d6ca3e2ef7eb58bb96f8f61ae2e3?placeholderIfAbsent=true",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f6caac64d16e17f3f15df6f4d5025ff7abc64fa5?placeholderIfAbsent=true",
    },
    {
      title: "3D Collection",
      owner: "@aaronfinch",
      items: 28,
      image: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/bbddb7b98ca0d36e27c86999c1ba359a0f28d302?placeholderIfAbsent=true",
      avatar: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/61c3d18b79da00e4d4a71ab2c4f04cf9a7da8c20?placeholderIfAbsent=true",
    },
  ];

  // Map real data or use fallback
  const collections = hotCollections.length > 0 
    ? hotCollections.map((collection, index) => ({
        title: collection.title || "Unnamed Collection",
        owner: collection.profiles ? `@${collection.profiles.full_name?.toLowerCase().replace(/\s+/g, '') || 'user'}` : "@user",
        items: 28, // Placeholder
        image: collection.cover_image_url || fallbackCollections[index % fallbackCollections.length].image,
        avatar: collection.profiles?.avatar_url || fallbackCollections[index % fallbackCollections.length].avatar,
      }))
    : fallbackCollections;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Collections</h1>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loading state
            Array(8).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-5 w-4/5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/5 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Mapped collections
            collections.map((collection, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{collection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-32 object-cover mb-4 rounded-md"
                  />
                  <p className="text-sm text-gray-500">Owner: {collection.owner}</p>
                  <p className="text-sm text-gray-500">Items: {collection.items}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
