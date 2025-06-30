
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Eye, Plus } from 'lucide-react';

export const CollectionTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'sports', name: 'Sports' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'art', name: 'Art & Design' },
    { id: 'nostalgia', name: 'Nostalgia' },
    { id: 'premium', name: 'Premium' }
  ];

  const templates = [
    {
      id: '1',
      name: 'Oakland A\'s Legacy',
      description: 'Celebrate the rich history of Oakland Athletics with this nostalgic template',
      category: 'sports',
      thumbnail: '/lovable-uploads/sample.png',
      isPremium: false,
      rating: 4.8,
      downloads: 1250,
      tags: ['baseball', 'oakland', 'vintage']
    },
    {
      id: '2',
      name: 'Gaming Champions',
      description: 'Perfect for gaming achievement cards and esports collections',
      category: 'gaming',
      thumbnail: '/lovable-uploads/sample2.png',
      isPremium: true,
      rating: 4.9,
      downloads: 890,
      tags: ['gaming', 'esports', 'achievements']
    },
    {
      id: '3',
      name: 'Artistic Masterpiece',
      description: 'Showcase your artistic creations with this elegant template',
      category: 'art',
      thumbnail: '/lovable-uploads/sample3.png',
      isPremium: false,
      rating: 4.7,
      downloads: 2100,
      tags: ['art', 'creative', 'elegant']
    },
    {
      id: '4',
      name: 'Retro Vibes',
      description: 'Bring back the 80s and 90s with this nostalgic design',
      category: 'nostalgia',
      thumbnail: '/lovable-uploads/sample4.png',
      isPremium: false,
      rating: 4.6,
      downloads: 675,
      tags: ['retro', '80s', '90s', 'vintage']
    }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Collection Templates</h2>
        <p className="text-gray-400">Jump-start your collection with professionally designed templates</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={
              selectedCategory === category.id 
                ? 'bg-crd-green text-black' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
            <div className="aspect-video bg-gray-700 rounded-t-lg overflow-hidden relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{template.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {template.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {template.downloads.toLocaleString()}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No templates found in this category</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setSelectedCategory('all')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            View All Templates
          </Button>
        </div>
      )}
    </div>
  );
};
