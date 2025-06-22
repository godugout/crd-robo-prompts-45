
import React, { useState } from 'react';
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid';
import { CheckoutFlow } from '@/components/marketplace/CheckoutFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus } from 'lucide-react';
import type { MarketplaceListing } from '@/types/marketplace';

const Marketplace = () => {
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priceMin: '',
    priceMax: '',
    condition: '',
    location: ''
  });

  const handleListingSelect = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-2">Buy and sell collectible cards</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            List a Card
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cards..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Min Price"
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              />
            </div>
            <div>
              <Input
                placeholder="Max Price"
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              />
            </div>
            <div>
              <Select value={filters.condition} onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mint">Mint</SelectItem>
                  <SelectItem value="near_mint">Near Mint</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Marketplace Grid */}
        <MarketplaceGrid 
          filters={filters}
          onListingSelect={handleListingSelect}
        />

        {/* Checkout Flow */}
        <CheckoutFlow
          listing={selectedListing}
          open={checkoutOpen}
          onClose={() => {
            setCheckoutOpen(false);
            setSelectedListing(null);
          }}
        />
      </div>
    </div>
  );
};

export default Marketplace;
