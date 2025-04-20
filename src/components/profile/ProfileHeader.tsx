
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Settings } from 'lucide-react';
import type { User } from '@/types/user';

interface ProfileHeaderProps {
  user: User;
  profile: any;
  displayName: string;
  bioText: string;
  avatarUrl: string;
}

export const ProfileHeader = ({ user, profile, displayName, bioText, avatarUrl }: ProfileHeaderProps) => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex flex-1 space-x-4 items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-2xl">{(displayName?.[0] || '').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{displayName}</CardTitle>
            <CardDescription>{bioText}</CardDescription>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
