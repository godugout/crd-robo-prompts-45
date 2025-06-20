
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Users, 
  Star,
  Activity,
  Calendar,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { CollectionAnalytics } from '@/types/collections';

interface CollectionStatsProps {
  collectionId: string;
  analytics?: CollectionAnalytics;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({
  collectionId,
  analytics
}) => {
  // Mock data for charts - in a real app, this would come from the API
  const viewsData = [
    { date: '2024-01-01', views: 45 },
    { date: '2024-01-02', views: 52 },
    { date: '2024-01-03', views: 48 },
    { date: '2024-01-04', views: 61 },
    { date: '2024-01-05', views: 55 },
    { date: '2024-01-06', views: 67 },
    { date: '2024-01-07', views: 72 },
  ];

  const rarityData = [
    { name: 'Common', value: 40, color: '#6b7280' },
    { name: 'Uncommon', value: 25, color: '#10b981' },
    { name: 'Rare', value: 20, color: '#3b82f6' },
    { name: 'Epic', value: 10, color: '#8b5cf6' },
    { name: 'Legendary', value: 5, color: '#f59e0b' },
  ];

  const stats = [
    {
      title: 'Total Views',
      value: analytics?.total_views || 0,
      icon: <Eye className="w-5 h-5" />,
      change: '+12%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Likes',
      value: analytics?.total_likes || 0,
      icon: <Heart className="w-5 h-5" />,
      change: '+8%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Followers',
      value: analytics?.total_followers || 0,
      icon: <Users className="w-5 h-5" />,
      change: '+15%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Completion',
      value: `${Math.round(analytics?.completion_rate || 0)}%`,
      icon: <Target className="w-5 h-5" />,
      change: '+3%',
      changeColor: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-editor-dark border-crd-mediumGray/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-lightGray mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-crd-white">{stat.value}</p>
                  <p className={`text-sm ${stat.changeColor}`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className="text-crd-green">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card className="bg-editor-dark border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rarity Distribution */}
        <Card className="bg-editor-dark border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Star className="w-5 h-5" />
              Card Rarity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rarityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rarityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {rarityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-crd-lightGray">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-editor-dark border-crd-mediumGray/20">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-crd-green mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-crd-white mb-2">Recent Activity</h3>
            <p className="text-2xl font-bold text-crd-green mb-1">
              {analytics?.recent_activity || 0}
            </p>
            <p className="text-sm text-crd-lightGray">actions this week</p>
          </CardContent>
        </Card>

        <Card className="bg-editor-dark border-crd-mediumGray/20">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-crd-white mb-2">Collection Age</h3>
            <p className="text-2xl font-bold text-blue-400 mb-1">45</p>
            <p className="text-sm text-crd-lightGray">days old</p>
          </CardContent>
        </Card>

        <Card className="bg-editor-dark border-crd-mediumGray/20">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-crd-white mb-2">Average Rating</h3>
            <p className="text-2xl font-bold text-yellow-400 mb-1">4.8</p>
            <p className="text-sm text-crd-lightGray">out of 5 stars</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
