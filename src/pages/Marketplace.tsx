
import React, { useState } from 'react';
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid';
import { CheckoutFlow } from '@/components/marketplace/CheckoutFlow';
import { MarketAnalyticsDashboard } from '@/components/marketplace/MarketAnalyticsDashboard';
import { SellerAnalyticsDashboard } from '@/components/marketplace/SellerAnalyticsDashboard';
import { AdvancedMarketplaceSearch } from '@/components/marketplace/AdvancedMarketplaceSearch';
import { MarketplaceErrorBoundary } from '@/components/marketplace/MarketplaceErrorBoundary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, BarChart3, Search } from 'lucide-react';
import type { MarketplaceListing } from '@/types/marketplace';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace = () => {
  const { user } = useAuth();
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

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <MarketplaceErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Marketplace</h1>
              <p className="text-crd-lightGray mt-2">Buy, sell, and discover premium collectible cards</p>
            </div>
            {user && (
              <Button className="flex items-center gap-2 bg-crd-green hover:bg-green-600 text-black">
                <Plus className="w-4 h-4" />
                List a Card
              </Button>
            )}
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="bg-crd-dark border border-crd-mediumGray">
              <TabsTrigger value="browse" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Search className="w-4 h-4 mr-2" />
                Browse
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <TrendingUp className="w-4 h-4 mr-2" />
                Market Data
              </TabsTrigger>
              {user && (
                <TabsTrigger value="seller" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Seller Dashboard
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Advanced Search */}
              <AdvancedMarketplaceSearch
                onFiltersChange={handleFiltersChange}
              />

              {/* Marketplace Grid */}
              <MarketplaceGrid 
                filters={filters}
                onListingSelect={handleListingSelect}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <MarketAnalyticsDashboard />
            </TabsContent>

            {user && (
              <TabsContent value="seller">
                <SellerAnalyticsDashboard />
              </TabsContent>
            )}
          </Tabs>

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
    </MarketplaceErrorBoundary>
  );
};

export default Marketplace;
