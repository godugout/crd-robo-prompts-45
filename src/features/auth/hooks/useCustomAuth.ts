
import { useState, useEffect } from 'react';
import { customAuthService } from '../services/customAuthService';
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
    const subscription = customAuthService.onAuthStateChange((user) => {
      setAuthState({
        user,
        loading: false,
      });
    });

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
