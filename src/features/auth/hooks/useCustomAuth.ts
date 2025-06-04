
import { useState, useEffect } from 'react';
import { customAuthService } from '../services/customAuthService';
import { customDevAuthService } from '../services/customDevAuthService';
import { toast } from '@/hooks/use-toast';

interface CustomUser {
  id: string;
  username: string;
}

interface AuthState {
  user: CustomUser | null;
  loading: boolean;
}

export const useCustomAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    console.log('🔧 Setting up custom auth listener');
    
    const subscription = customAuthService.onAuthStateChange((user) => {
      console.log('🔧 Auth state changed:', user ? user.username : 'signed out');
      setAuthState({
        user,
        loading: false,
      });
    });

    // Check if we should auto-login in dev mode
    const checkDevAutoLogin = async () => {
      if (customDevAuthService.isDevMode() && !customAuthService.getCurrentUser()) {
        console.log('🔧 Dev mode: Checking if auto-login should be performed');
        
        // Small delay to let component mount
        setTimeout(async () => {
          const stored = localStorage.getItem('cardshow_dev_auto_login');
          if (!stored || stored === 'true') {
            console.log('🔧 Dev mode: Attempting auto-login');
            const result = await customDevAuthService.autoSignIn();
            if (result.error) {
              console.log('🔧 Dev auto-login failed, user will need to login manually');
            }
          }
        }, 100);
      }
    };

    checkDevAutoLogin();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, passcode: string) => {
    const { user, error } = await customAuthService.signIn(username, passcode);
    
    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error,
        variant: 'destructive',
      });
      return { error };
    } else {
      toast({
        title: 'Welcome back!',
        description: `Signed in as ${user?.username}`,
      });
      
      // Store dev auto-login preference
      if (customDevAuthService.isDevMode()) {
        localStorage.setItem('cardshow_dev_auto_login', 'true');
      }
      
      return { error: null };
    }
  };

  const signUp = async (username: string, passcode: string) => {
    const { user, error } = await customAuthService.signUp(username, passcode);
    
    if (error) {
      toast({
        title: 'Sign Up Failed',
        description: error,
        variant: 'destructive',
      });
      return { error };
    } else {
      toast({
        title: 'Account Created!',
        description: `Welcome to Cardshow, ${user?.username}!`,
      });
      return { error: null };
    }
  };

  const signOut = () => {
    customAuthService.signOut();
    
    // Clear dev auto-login preference
    if (customDevAuthService.isDevMode()) {
      localStorage.setItem('cardshow_dev_auto_login', 'false');
    }
    
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signIn,
    signUp,
    signOut,
  };
};
