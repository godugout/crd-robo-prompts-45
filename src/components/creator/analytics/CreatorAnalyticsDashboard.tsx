
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplaceOptimization } from '@/hooks/creator/useMarketplaceOptimization';
import { BarChart3, TrendingUp, Eye, Download, Heart, Users } from 'lucide-react';

export const CreatorAnalyticsDashboard: React.FC = () => {
  const { performanceMetrics, loadingMetrics } = useMarketplaceOptimization();

  // Mock data for demonstration - in a real app, this would come from the API
  const analyticsData = {
    totalViews: 15420,
    totalDownloads: 3240,
    totalLikes: 892,
    totalFollowers: 156,
    viewsGrowth: 12.5,
    downloadsGrowth: 8.3,
    likesGrowth: 15.2,
    followersGrowth: 5.7,
  };

  const chartData = [
    { name: 'Mon', views: 120, downloads: 23 },
    { name: 'Tue', views: 150, downloads: 31 },
    { name: 'Wed', views: 180, downloads: 28 },
    { name: 'Thu', views: 140, downloads: 35 },
    { name: 'Fri', views: 200, downloads: 42 },
    { name: 'Sat', views: 250, downloads: 38 },
    { name: 'Sun', views: 180, downloads: 29 },
  ];

  if (loadingMetrics) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
              <div className="h-8 bg-crd-mediumGray rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Creator Analytics Dashboard</h2>
        <p className="text-crd-lightGray">
          Track your performance, engagement, and growth metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalViews.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analyticsData.viewsGrowth}%
                </Badge>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Downloads</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalDownloads.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analyticsData.downloadsGrowth}%
                </Badge>
              </div>
              <Download className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalLikes.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analyticsData.likesGrowth}%
                </Badge>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Followers</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalFollowers.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analyticsData.followersGrowth}%
                </Badge>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Chart */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((day, index) => (
              <div key={day.name} className="flex items-center gap-4">
                <div className="w-12 text-crd-lightGray text-sm font-medium">{day.name}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-crd-lightGray text-xs">Views</div>
                    <div className="flex-1 bg-crd-mediumGray rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(day.views / 300) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-white text-sm">{day.views}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-crd-lightGray text-xs">Downloads</div>
                    <div className="flex-1 bg-crd-mediumGray rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(day.downloads / 50) * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-white text-sm">{day.downloads}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Vintage Baseball Card Template', views: 1240, downloads: 89 },
              { name: 'Modern Sports Card Design', views: 980, downloads: 67 },
              { name: 'Holographic Effect Pack', views: 756, downloads: 45 },
              { name: 'Classic Trading Card Frame', views: 623, downloads: 34 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-crd-mediumGray rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{item.name}</h4>
                  <p className="text-crd-lightGray text-sm">{item.views} views • {item.downloads} downloads</p>
                </div>
                <Badge variant="secondary">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Engagement Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Peak Activity Hours</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-crd-lightGray">2:00 PM - 3:00 PM</span>
                  <span className="text-white">Peak</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-crd-lightGray">7:00 PM - 8:00 PM</span>
                  <span className="text-white">High</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-crd-lightGray">11:00 AM - 12:00 PM</span>
                  <span className="text-white">Moderate</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Audience Demographics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-crd-lightGray">Sports Enthusiasts</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-crd-lightGray">Card Collectors</span>
                  <span className="text-white">32%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-crd-lightGray">Design Professionals</span>
                  <span className="text-white">23%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
