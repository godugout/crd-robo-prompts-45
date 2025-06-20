
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Heart, Users, Star, Calendar } from 'lucide-react';

interface CollectionAnalytics {
  total_cards: number;
  unique_rarities: number;
  completion_rate: number;
  total_views: number;
  total_likes: number;
  total_followers: number;
  recent_activity: number;
}

interface CollectionStatsProps {
  collectionId: string;
  analytics?: CollectionAnalytics;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({
  collectionId,
  analytics
}) => {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-crd-mediumGray rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-crd-mediumGray rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Cards',
      value: analytics.total_cards,
      icon: Star,
      color: 'text-crd-green',
      bgColor: 'bg-crd-green/20'
    },
    {
      title: 'Unique Rarities',
      value: analytics.unique_rarities,
      icon: TrendingUp,
      color: 'text-crd-blue',
      bgColor: 'bg-crd-blue/20'
    },
    {
      title: 'Total Views',
      value: analytics.total_views,
      icon: Eye,
      color: 'text-crd-orange',
      bgColor: 'bg-crd-orange/20'
    },
    {
      title: 'Likes',
      value: analytics.total_likes,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-400/20'
    },
    {
      title: 'Followers',
      value: analytics.total_followers,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      title: 'Recent Activity',
      value: analytics.recent_activity,
      icon: Calendar,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      subtitle: 'Last 7 days'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Completion Rate Highlight */}
      <Card className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 border-crd-green/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-crd-green" />
            Collection Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-white">
              {Math.round(analytics.completion_rate)}%
            </span>
            <Badge className="bg-crd-green text-black">
              {analytics.completion_rate >= 90 ? 'Nearly Complete!' : 
               analytics.completion_rate >= 50 ? 'Good Progress' : 'Getting Started'}
            </Badge>
          </div>
          <Progress 
            value={analytics.completion_rate} 
            className="h-3"
          />
          <p className="text-sm text-crd-lightGray mt-2">
            You've collected {analytics.total_cards} cards so far
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-lightGray mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-crd-lightGray mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Collection Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-crd-mediumGray/20 rounded-lg">
              <h4 className="font-medium text-white mb-2">Rarity Diversity</h4>
              <p className="text-sm text-crd-lightGray">
                Your collection spans <span className="text-crd-green font-medium">{analytics.unique_rarities}</span> different rarities
              </p>
            </div>
            
            <div className="p-4 bg-crd-mediumGray/20 rounded-lg">
              <h4 className="font-medium text-white mb-2">Community Engagement</h4>
              <p className="text-sm text-crd-lightGray">
                <span className="text-crd-blue font-medium">{analytics.total_likes + analytics.total_followers}</span> total interactions
              </p>
            </div>
          </div>

          {analytics.recent_activity > 0 && (
            <div className="p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
              <h4 className="font-medium text-crd-green mb-2">Recent Activity</h4>
              <p className="text-sm text-crd-lightGray">
                {analytics.recent_activity} activities in the last 7 days - your collection is active!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
