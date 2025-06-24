
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, Eye, Users, ShoppingCart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const SellerAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['seller-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [salesData, listingsData, performanceData] = await Promise.all([
        // Get sales summary
        supabase
          .from('marketplace_listings')
          .select('price, created_at, status')
          .eq('seller_id', user.id)
          .eq('status', 'sold'),
        
        // Get active listings
        supabase
          .from('marketplace_listings')
          .select('id, title, price, views_count, watchers_count, created_at')
          .eq('seller_id', user.id)
          .eq('status', 'active'),
        
        // Get performance metrics
        supabase
          .from('seller_analytics')
          .select('*')
          .eq('seller_id', user.id)
          .order('date', { ascending: false })
          .limit(30)
      ]);

      const totalSales = salesData.data?.reduce((sum, sale) => sum + (sale.price || 0), 0) || 0;
      const totalListings = listingsData.data?.length || 0;
      const totalViews = listingsData.data?.reduce((sum, listing) => sum + listing.views_count, 0) || 0;
      const totalWatchers = listingsData.data?.reduce((sum, listing) => sum + listing.watchers_count, 0) || 0;

      return {
        totalSales,
        totalListings,
        totalViews,
        totalWatchers,
        salesCount: salesData.data?.length || 0,
        averageSalePrice: totalSales / Math.max(salesData.data?.length || 1, 1),
        conversionRate: (salesData.data?.length || 0) / Math.max(totalListings, 1) * 100,
        activeListings: listingsData.data || [],
        performanceHistory: performanceData.data || []
      };
    },
    enabled: !!user?.id
  });

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
                <div className="h-8 bg-crd-mediumGray rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-crd-lightGray">
        <p>No seller data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Total Sales</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(analytics.totalSales)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-crd-green" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">
              {analytics.salesCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Active Listings</p>
                <p className="text-2xl font-bold text-white">{analytics.totalListings}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">
              {analytics.conversionRate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Total Views</p>
                <p className="text-2xl font-bold text-white">{analytics.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">
              Avg: {(analytics.totalViews / Math.max(analytics.totalListings, 1)).toFixed(1)} per listing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Watchers</p>
                <p className="text-2xl font-bold text-white">{analytics.totalWatchers}</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">
              Avg price: {formatCurrency(analytics.averageSalePrice)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      {analytics.performanceHistory.length > 0 && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_sales" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Total Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_sale_price" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Avg Sale Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Active Listings Performance */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Active Listings Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.activeListings.slice(0, 10).map((listing: any) => (
              <div key={listing.id} className="flex items-center justify-between p-4 bg-crd-mediumGray rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{listing.title}</h4>
                  <p className="text-sm text-crd-lightGray">
                    Listed: {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(listing.price)}</p>
                  <div className="flex items-center gap-4 text-sm text-crd-lightGray">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {listing.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {listing.watchers_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
