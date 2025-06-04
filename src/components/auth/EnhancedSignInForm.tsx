
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthFormContainer } from './components/AuthFormContainer';
import { SignInFormFields } from './components/SignInFormFields';
import { SecurityFeatures } from './components/SecurityFeatures';
import { SignInFormActions } from './components/SignInFormActions';
import { DevLoginButton } from './components/DevLoginButton';
import { customDevAuthService } from '@/features/auth/services/customDevAuthService';
import { useSecurityLock } from './hooks/useSecurityLock';
import { useRememberCredentials } from './hooks/useRememberCredentials';
import { toast } from '@/hooks/use-toast';

export const EnhancedSignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    attempts,
    isLocked,
    lockTime,
    maxAttempts,
    recordFailedAttempt,
    clearLock,
  } = useSecurityLock();

  const {
    rememberMe,
    setRememberMe,
    saveCredentials,
  } = useRememberCredentials();

  // Auto-fill dev credentials and handle remember me
  useEffect(() => {
    if (customDevAuthService.isDevMode()) {
      const { username: devUsername, passcode: devPasscode } = customDevAuthService.getDevCredentials();
      setUsername(devUsername);
      setPasscode(devPasscode);
      console.log('🔧 Dev mode: Auto-filled credentials');
    }

    // Load remembered credentials
    const remembered = localStorage.getItem('cardshow_remember_credentials');
    if (remembered) {
      try {
        const { username: savedUsername, rememberMe: savedRemember } = JSON.parse(remembered);
        if (savedRemember) {
          setUsername(savedUsername);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
      }
    }
  }, [setRememberMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: 'Account Temporarily Locked',
        description: `Too many failed attempts. Try again in ${Math.ceil((lockTime! - Date.now()) / 60000)} minutes.`,
        variant: 'destructive',
      });
      return;
    }

    if (!username || !passcode) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both username and passcode.',
        variant: 'destructive',
      });
      return;
    }

    if (passcode.length < 4) {
      toast({
        title: 'Invalid Passcode',
        description: 'Passcode must be at least 4 digits.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('🔧 Enhanced form submitting with:', { username, passcodeLength: passcode.length });
    
    const { error } = await signIn(username, passcode);
    
    if (!error) {
      console.log('🔧 Sign in successful, navigating');
      
      // Handle remember me
      saveCredentials(username, rememberMe);

      // Clear any lock data on successful login
      clearLock();

      // Navigate to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

      toast({
        title: 'Welcome back!',
        description: `Successfully signed in as ${username}`,
      });
    } else {
      console.error('🔧 Sign in failed:', error);
      recordFailedAttempt();
    }
    
    setIsLoading(false);
  };

  const handleAutoFill = (devUsername: string, devPasscode: string) => {
    setUsername(devUsername);
    setPasscode(devPasscode);
    toast({
      title: 'Dev Credentials Filled',
      description: 'Ready to sign in with development account',
    });
  };

  const handleDevLogin = async () => {
    const result = await customDevAuthService.autoSignIn();
    if (!result.error) {
      console.log('🔧 Dev auto-login successful, navigating to home');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      toast({
        title: 'Dev Login Successful',
        description: 'Signed in with development account',
      });
    } else {
      console.error('🔧 Dev auto-login failed:', result.error);
      toast({
        title: 'Dev Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthFormContainer showOAuth={false} showSeparator={false}>
      <DevLoginButton 
        onAutoFill={handleAutoFill}
        onDevLogin={handleDevLogin}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <SignInFormFields
          username={username}
          onUsernameChange={setUsername}
          passcode={passcode}
          onPasscodeChange={setPasscode}
          disabled={isLocked}
        />

        <SecurityFeatures
          rememberMe={rememberMe}
          onRememberMeChange={setRememberMe}
          attempts={attempts}
          maxAttempts={maxAttempts}
          isLocked={isLocked}
          lockTime={lockTime}
          disabled={isLocked}
        />

        <SignInFormActions
          isLoading={isLoading}
          isLocked={isLocked}
          username={username}
          passcode={passcode}
          lockTime={lockTime}
        />
      </form>
    </AuthFormContainer>
  );
};
