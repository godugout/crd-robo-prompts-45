
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketAnalytics } from '@/hooks/marketplace/useMarketAnalytics';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const MarketAnalyticsDashboard: React.FC = () => {
  const { marketMetrics, metricsLoading, trendingCards, trendingLoading } = useMarketAnalytics();

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {Math.abs(percentage).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Total Volume</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(marketMetrics?.totalVolume || 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-crd-green" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">24h trading volume</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Transactions</p>
                <p className="text-2xl font-bold text-white">
                  {marketMetrics?.totalTransactions || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">24h transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Avg Price</p>
                <p className="text-2xl font-bold text-white">
                  ${(marketMetrics?.averagePrice || 0).toFixed(2)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2">
              {formatPercentage(marketMetrics?.priceChange24h || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-crd-lightGray">Market Cap</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(marketMetrics?.marketCap || 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-xs text-crd-lightGray mt-2">Total market value</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Cards */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-crd-green" />
            Trending Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-crd-mediumGray rounded-lg animate-pulse">
                  <div className="w-16 h-16 bg-crd-lightGray rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-crd-lightGray rounded mb-2"></div>
                    <div className="h-3 bg-crd-lightGray rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : trendingCards.length === 0 ? (
            <div className="text-center py-8 text-crd-lightGray">
              No trending cards data available
            </div>
          ) : (
            <div className="space-y-4">
              {trendingCards.slice(0, 10).map((item: any, index) => (
                <div key={item.card_id} className="flex items-center gap-4 p-4 bg-crd-mediumGray rounded-lg hover:bg-crd-mediumGray/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-crd-green text-black flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {item.cards?.image_url && (
                      <img
                        src={item.cards.image_url}
                        alt={item.cards.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-white">{item.cards?.title || 'Unknown Card'}</h4>
                      <p className="text-sm text-crd-lightGray capitalize">{item.cards?.rarity}</p>
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-crd-lightGray">Trending Score</div>
                      <div className="font-semibold text-white">
                        {(item.trending_score * 100).toFixed(1)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-crd-lightGray">24h Change</div>
                      <div className="font-semibold">
                        {formatPercentage(item.price_change_24h || 0)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-crd-lightGray">Volume</div>
                      <div className="font-semibold text-white">{item.volume || 0}</div>
                    </div>

                    <Badge 
                      variant="outline" 
                      className="border-crd-green text-crd-green"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
