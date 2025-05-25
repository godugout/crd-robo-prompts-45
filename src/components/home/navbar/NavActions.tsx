import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';

export const NavActions = () => {
  const { user, loading, signOut } = useCustomAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-crd-mediumGray rounded-full animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/auth/signin">
          <CRDButton variant="ghost" size="sm">
            Sign In
          </CRDButton>
        </Link>
        <Link to="/auth/signup">
          <CRDButton variant="primary" size="sm">
            Sign Up
          </CRDButton>
        </Link>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-crd-dark transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-crd-blue text-crd-white">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-crd-dark border-crd-mediumGray">
          <DropdownMenuLabel className="text-crd-white">
            {user.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-crd-mediumGray" />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="text-crd-lightGray hover:text-crd-white">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account" className="text-crd-lightGray hover:text-crd-white">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-crd-mediumGray" />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="text-crd-lightGray hover:text-crd-white cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
