
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { OAuthButtons } from './OAuthButtons';

interface AuthFormContainerProps {
  children: React.ReactNode;
  showOAuth?: boolean;
  showSeparator?: boolean;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  children,
  showOAuth = true,
  showSeparator = true,
}) => {
  return (
    <div className="space-y-6">
      {children}

      {showSeparator && showOAuth && (
        <div className="relative">
          <Separator className="bg-crd-mediumGray" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-crd-dark px-2 text-sm text-crd-lightGray">Or continue with</span>
          </div>
        </div>
      )}

      {showOAuth && <OAuthButtons />}
    </div>
  );
};
