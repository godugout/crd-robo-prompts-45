
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/contexts/AuthContext';

export const OAuthButtons: React.FC = () => {
  const { signInWithOAuth } = useAuth();

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    await signInWithOAuth(provider);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <CRDButton
        variant="outline"
        size="sm"
        onClick={() => handleOAuthSignIn('google')}
        className="w-full"
      >
        Google
      </CRDButton>
      <CRDButton
        variant="outline"
        size="sm"
        onClick={() => handleOAuthSignIn('github')}
        className="w-full"
      >
        GitHub
      </CRDButton>
      <CRDButton
        variant="outline"
        size="sm"
        onClick={() => handleOAuthSignIn('discord')}
        className="w-full"
      >
        Discord
      </CRDButton>
    </div>
  );
};
