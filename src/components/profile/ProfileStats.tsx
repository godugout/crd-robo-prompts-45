
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileStatsProps {
  memoriesCount: number;
  followers: number;
  following: number;
}

export const ProfileStats = ({ memoriesCount, followers, following }: ProfileStatsProps) => {
  return (
    <CardContent>
      <div className="mt-2 flex space-x-6">
        <div className="text-center">
          <p className="font-bold text-xl">{memoriesCount || 0}</p>
          <p className="text-sm text-gray-500">Cards</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-xl">{followers}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-xl">{following}</p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
      </div>
    </CardContent>
  );
};
