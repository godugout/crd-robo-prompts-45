
import { supabase } from '@/integrations/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';
import type { OAuthProvider } from '../types';

export class AuthService {
  private getRedirectUrl(path: string = '') {
    // Use the staging URL when deployed, localhost when developing
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000'
      : 'https://5401089f-4a47-49e7-9f50-74110204007a.lovableproject.com';
    return `${baseUrl}${path}`;
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error };
  }

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async signInWithOAuth(provider: OAuthProvider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    return { error };
  }

  async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    return { error };
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: this.getRedirectUrl('/auth/reset-password'),
    });
    return { error };
  }

  async getSession() {
    return await supabase.auth.getSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
