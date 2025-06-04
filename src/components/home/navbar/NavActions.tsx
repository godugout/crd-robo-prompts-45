
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { CRDButton } from "@/components/ui/design-system";
import { LogOut, User, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const NavActions = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      signOut();
      navigate('/');
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'There was an error signing out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-crd-lightGray text-sm">
          <User className="w-4 h-4" />
          <span>Welcome, {user.username}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <CRDButton
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile
            </CRDButton>
          </Link>
          
          <CRDButton
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </CRDButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/auth/signin">
        <CRDButton
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Sign In
        </CRDButton>
      </Link>
    </div>
  );
};
