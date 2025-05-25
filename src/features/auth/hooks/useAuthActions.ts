
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { devAuthService } from '../services/devAuthService';
import type { OAuthProvider } from '../types';

export const useAuthActions = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setIsLoading(true);
    
    const { error } = await authService.signUp(email, password, metadata);

    if (error) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created',
        description: 'Please check your email to verify your account.',
      });
    }

    setIsLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { error } = await authService.signIn(email, password);

    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
    }

    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    
    // Clear dev session if in dev mode
    if (devAuthService.isDevMode()) {
      devAuthService.clearDevSession();
      window.location.reload(); // Force reload to reset auth state
      return { error: null };
    }
    
    const { error } = await authService.signOut();
    
    if (error) {
      toast({
        title: 'Sign Out Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
      });
    }

    setIsLoading(false);
    return { error };
  };

  const signInWithOAuth = async (provider: OAuthProvider) => {
    setIsLoading(true);
    
    const { error } = await authService.signInWithOAuth(provider);

    if (error) {
      toast({
        title: 'OAuth Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    setIsLoading(true);
    
    const { error } = await authService.signInWithMagicLink(email);

    if (error) {
      toast({
        title: 'Magic Link Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Magic Link Sent',
        description: 'Check your email for the magic link to sign in.',
      });
    }

    setIsLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);

    if (error) {
      toast({
        title: 'Password Reset Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });
    }

    return { error };
  };

  const updateProfile = async (updates: Record<string, any>) => {
    if (!userId) {
      const error = new Error('No user logged in') as any;
      return { error };
    }

    setIsLoading(true);

    const { error } = await profileService.updateProfile(userId, updates);

    if (error) {
      toast({
        title: 'Profile Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    }

    setIsLoading(false);
    return { error };
  };

  return {
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    signInWithMagicLink,
    resetPassword,
    updateProfile,
    isLoading,
  };
};
