
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Plus, 
  Grid, 
  Users, 
  TrendingUp,
  ArrowRight,
  Eye,
  Heart
} from 'lucide-react';

const Collections = () => {
  const collectionFeatures = [
    {
      id: 'create-collection',
      title: 'Create Collection',
      description: 'Start a new collection and organize your cards',
      status: 'Active',
      color: 'bg-crd-green',
      icon: Plus,
      features: ['Custom themes', 'Organization tools', 'Privacy controls', 'Sharing options']
    },
    {
      id: 'browse-collections',
      title: 'Browse Collections',
      description: 'Discover amazing collections from the community',
      status: 'Active',
      color: 'bg-blue-500',
      icon: Grid,
      features: ['Featured collections', 'Search & filter', 'Category browsing', 'Trending content']
    },
    {
      id: 'social-features',
      title: 'Social Features',
      description: 'Connect with other collectors and creators',
      status: 'Beta',
      color: 'bg-purple-500',
      icon: Users,
      features: ['Follow collectors', 'Comments & likes', 'Collection sharing', 'Community feeds']
    },
    {
      id: 'analytics',
      title: 'Collection Analytics',
      description: 'Track your collection performance and growth',
      status: 'Active',
      color: 'bg-orange-500',
      icon: TrendingUp,
      features: ['View statistics', 'Growth tracking', 'Engagement metrics', 'Popular cards']
    }
  ];

  const featuredCollections = [
    {
      title: 'Sports Legends',
      creator: 'CardMaster',
      cards: 124,
      views: '2.3k',
      likes: 89
    },
    {
      title: 'Fantasy Warriors',
      creator: 'ArtistPro',
      cards: 67,
      views: '1.8k',
      likes: 156
    },
    {
      title: 'Retro Gaming',
      creator: 'PixelCreator',
      cards: 203,
      views: '3.1k',
      likes: 234
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-purple-500 rounded-2xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Collections</h1>
              <p className="text-gray-600">Organize, showcase, and discover amazing card collections</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Create beautiful collections to organize your cards, discover inspiring work from other creators, 
              and connect with the CardShow community.
            </p>
            
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 mb-8">
              <Camera className="w-3 h-3 mr-1" />
              Collection Tools
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-crd-green/10 to-purple-500/10 border-crd-green/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-crd-green rounded-2xl flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Create Your First Collection</h3>
                    <p className="text-gray-600">Start organizing your cards in beautiful collections</p>
                  </div>
                </div>
                <Button className="bg-crd-green hover:bg-crd-green/90 text-white">
                  Create Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {collectionFeatures.map((feature) => (
            <Card key={feature.id} className="bg-white border-gray-200 hover:border-crd-green/50 transition-all duration-300 group hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      feature.status === 'Active' 
                        ? 'border-green-500/50 text-green-600 bg-green-50'
                        : 'border-blue-500/50 text-blue-600 bg-blue-50'
                    }
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-gray-900 text-lg mb-2">{feature.title}</CardTitle>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                    <ul className="space-y-1">
                      {feature.features.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-crd-green rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-gray-200 hover:border-crd-green hover:bg-crd-green hover:text-white transition-colors"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Collections */}
        <Card className="bg-white border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-crd-green" />
              Featured Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCollections.map((collection, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-crd-green/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{collection.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {collection.cards} cards
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">by {collection.creator}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {collection.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {collection.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Collections;
