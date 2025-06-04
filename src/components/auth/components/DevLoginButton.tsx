
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { customDevAuthService } from '@/features/auth/services/customDevAuthService';
import { toast } from '@/hooks/use-toast';

interface DevLoginButtonProps {
  onAutoFill: (username: string, passcode: string) => void;
  onDevLogin: () => Promise<void>;
}

export const DevLoginButton: React.FC<DevLoginButtonProps> = ({ onAutoFill, onDevLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  if (!customDevAuthService.isDevMode()) {
    return null;
  }

  const handleAutoFill = () => {
    const { username, passcode } = customDevAuthService.getDevCredentials();
    onAutoFill(username, passcode);
    
    toast({
      title: 'Dev Credentials Filled',
      description: 'Ready to sign in with development account',
    });
  };

  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      await onDevLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
      <div className="text-sm text-yellow-600 font-medium">
        🛠️ Development Mode
      </div>
      
      <div className="flex gap-2">
        <CRDButton
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoFill}
          className="flex-1 border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10"
        >
          Fill Dev Credentials
        </CRDButton>
        
        <CRDButton
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDevLogin}
          disabled={isLoading}
          className="flex-1 border-green-500/50 text-green-600 hover:bg-green-500/10"
        >
          {isLoading ? 'Signing in...' : 'Quick Login'}
        </CRDButton>
      </div>
      
      <div className="text-xs text-yellow-600/80">
        Username: jay@godugout.com | Passcode: ChangeMe
      </div>
    </div>
  );
};
