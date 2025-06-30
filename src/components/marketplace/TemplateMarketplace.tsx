
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCardTemplates } from '@/hooks/creator/useCardTemplates';
import { Search, Star, Download, ShoppingCart } from 'lucide-react';

export const TemplateMarketplace: React.FC = () => {
  const { publicTemplates, purchaseTemplate, isLoading } = useCardTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const categories = ['all', 'Sports Cards', 'Trading Cards', 'Fantasy Art', 'Abstract', 'Vintage', 'Modern'];

  const filteredTemplates = publicTemplates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating_average - a.rating_average;
        case 'sales':
          return b.sales_count - a.sales_count;
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handlePurchase = async (templateId: string) => {
    await purchaseTemplate.mutateAsync({ templateId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Template Marketplace</h1>
        <p className="text-crd-lightGray">Discover premium card templates from verified creators</p>
      </div>

      {/* Filters */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
              <Input
                placeholder="Search templates..."
                className="pl-10 bg-crd-mediumGray border-crd-lightGray text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="sales">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-crd-lightGray flex items-center">
              {filteredTemplates.length} templates found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="text-center text-white">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="bg-crd-dark border-crd-mediumGray overflow-hidden hover:border-crd-green transition-colors">
              <div className="aspect-[3/4] bg-crd-mediumGray relative">
                {template.preview_images[0] ? (
                  <img
                    src={template.preview_images[0]}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
                    No Preview
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {template.is_premium && (
                    <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-2 left-2">
                  <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs">
                      {template.rating_average.toFixed(1)}
                    </span>
                    <span className="text-crd-lightGray text-xs">
                      ({template.rating_count})
                    </span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg leading-tight">
                  {template.name}
                </CardTitle>
                <p className="text-sm text-crd-lightGray line-clamp-2">
                  by Creator
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-crd-lightGray">
                    <Download className="w-3 h-3" />
                    {template.sales_count}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-crd-green">
                    {formatCurrency(template.price)}
                  </span>
                  <Button
                    size="sm"
                    className="bg-crd-green hover:bg-green-600 text-black"
                    onClick={() => handlePurchase(template.id)}
                    disabled={purchaseTemplate.isPending}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && !isLoading && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="text-center py-12">
            <div className="text-crd-lightGray mb-4">
              No templates found matching your criteria
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
