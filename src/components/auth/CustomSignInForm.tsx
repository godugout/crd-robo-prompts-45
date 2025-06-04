
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { AuthFormContainer } from './components/AuthFormContainer';
import { UsernameField } from './components/UsernameField';
import { PasscodeField } from './components/PasscodeField';
import { DevLoginButton } from './components/DevLoginButton';
import { customDevAuthService } from '@/features/auth/services/customDevAuthService';

export const CustomSignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useCustomAuth();
  const navigate = useNavigate();

  // Auto-fill dev credentials on component mount in dev mode
  useEffect(() => {
    if (customDevAuthService.isDevMode()) {
      const { username: devUsername, passcode: devPasscode } = customDevAuthService.getDevCredentials();
      setUsername(devUsername);
      setPasscode(devPasscode);
      console.log('🔧 Dev mode: Auto-filled credentials');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !passcode) {
      return;
    }

    setIsLoading(true);
    console.log('🔧 Form submitting with:', { username, passcodeLength: passcode.length });
    
    const { error } = await signIn(username, passcode);
    
    if (!error) {
      console.log('🔧 Sign in successful, navigating to home');
      navigate('/');
    } else {
      console.error('🔧 Sign in failed:', error);
    }
    
    setIsLoading(false);
  };

  const handleAutoFill = (devUsername: string, devPasscode: string) => {
    setUsername(devUsername);
    setPasscode(devPasscode);
  };

  const handleDevLogin = async () => {
    const result = await customDevAuthService.autoSignIn();
    if (!result.error) {
      console.log('🔧 Dev auto-login successful, navigating to home');
      navigate('/');
    } else {
      console.error('🔧 Dev auto-login failed:', result.error);
    }
  };

  return (
    <AuthFormContainer showOAuth={false} showSeparator={false}>
      <DevLoginButton 
        onAutoFill={handleAutoFill}
        onDevLogin={handleDevLogin}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <UsernameField
          username={username}
          onUsernameChange={setUsername}
        />

        <PasscodeField
          passcode={passcode}
          onPasscodeChange={setPasscode}
        />

        <CRDButton
          type="submit"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading || !username || !passcode || passcode.length < 4}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </CRDButton>
      </form>

      <div className="text-center">
        <span className="text-crd-lightGray">Don't have an account? </span>
        <Link to="/auth/signup" className="text-crd-lightGray hover:text-crd-white underline">
          Sign up
        </Link>
      </div>
    </AuthFormContainer>
  );
};
