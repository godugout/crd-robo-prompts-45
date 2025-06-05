
import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
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
    <Card className="bg-crd-dark border-crd-mediumGray mb-8">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex flex-1 space-x-4 items-center">
          <Avatar className="h-20 w-20 border-2 border-crd-blue">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-2xl bg-crd-mediumGray text-crd-white">
              {(displayName?.[0] || '').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-crd-white">{displayName}</CardTitle>
            <CardDescription className="text-crd-lightGray">{bioText}</CardDescription>
          </div>
        </div>
        <div className="flex space-x-2">
          <CRDButton variant="outline" size="sm" asChild>
            <Link to="/settings">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </CRDButton>
          <CRDButton variant="outline" size="sm" asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </CRDButton>
        </div>
      </CardHeader>
    </Card>
  );
};
