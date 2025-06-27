
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Folder, Image, Heart, Activity } from 'lucide-react';

interface CollectionStatsProps {
  stats: {
    totalCollections: number;
    totalCards: number;
    favoriteCollections: number;
    recentActivity: number;
  };
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Collections',
      value: stats.totalCollections,
      icon: Folder,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      label: 'Total Cards',
      value: stats.totalCards,
      icon: Image,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      label: 'Favorites',
      value: stats.favoriteCollections,
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/20'
    },
    {
      label: 'Recent Activity',
      value: stats.recentActivity,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
