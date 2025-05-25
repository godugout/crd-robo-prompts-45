import { supabase } from '@/integrations/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';
import type { OAuthProvider } from '../types';

export class AuthService {
  private getRedirectUrl(path: string = '') {
    // Use the current origin for redirect URLs
    const origin = window.location.origin;
    return `${origin}${path}`;
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    console.log('Attempting sign up for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
    } else {
      console.log('Sign up successful:', data.user?.email);
    }
    
    return { data, error };
  }

  async signIn(email: string, password: string) {
    console.log('Attempting sign in for:', email);
    console.log('Current origin:', window.location.origin);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in response:', { data, error });
    
    if (error) {
      console.error('Sign in error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
    } else {
      console.log('Sign in successful:', data.user?.email);
    }
    
    return { data, error };
  }

  async signOut() {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('Sign out successful');
    }
    
    return { error };
  }

  async signInWithOAuth(provider: OAuthProvider) {
    console.log('Attempting OAuth sign in with:', provider);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    
    if (error) {
      console.error('OAuth sign in error:', error);
    }
    
    return { data, error };
  }

  async signInWithMagicLink(email: string) {
    console.log('Sending magic link to:', email);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    
    if (error) {
      console.error('Magic link error:', error);
    } else {
      console.log('Magic link sent successfully');
    }
    
    return { data, error };
  }

  async resetPassword(email: string) {
    console.log('Sending password reset to:', email);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: this.getRedirectUrl('/auth/reset-password'),
    });
    
    if (error) {
      console.error('Password reset error:', error);
    } else {
      console.log('Password reset email sent');
    }
    
    return { data, error };
  }

  async getSession() {
    const result = await supabase.auth.getSession();
    console.log('Session check:', result.data.session ? 'Session exists' : 'No session');
    return result;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
