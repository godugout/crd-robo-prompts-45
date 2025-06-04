
import { supabase } from '@/integrations/supabase/client';

interface AuthResult {
  user: CustomUser | null;
  error: string | null;
}

interface CustomUser {
  id: string;
  username: string;
}

export class CustomAuthService {
  private currentUser: CustomUser | null = null;
  private listeners: ((user: CustomUser | null) => void)[] = [];

  constructor() {
    // Check for stored session on initialization
    this.loadStoredSession();
  }

  private loadStoredSession() {
    const storedUser = localStorage.getItem('cardshow_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        console.log('🔧 Loaded stored session for:', this.currentUser?.username);
        this.notifyListeners();
      } catch (error) {
        console.error('Error loading stored session:', error);
        localStorage.removeItem('cardshow_user');
      }
    }
  }

  private storeSession(user: CustomUser) {
    localStorage.setItem('cardshow_user', JSON.stringify(user));
    this.currentUser = user;
    console.log('🔧 Stored session for:', user.username);
    this.notifyListeners();
  }

  private clearSession() {
    localStorage.removeItem('cardshow_user');
    this.currentUser = null;
    console.log('🔧 Cleared session');
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  onAuthStateChange(callback: (user: CustomUser | null) => void) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    return {
      unsubscribe: () => {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }

  getCurrentUser(): CustomUser | null {
    return this.currentUser;
  }

  async signIn(username: string, passcode: string): Promise<AuthResult> {
    console.log('🔧 Attempting sign in with username:', username);
    
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        username_input: username,
        passcode_input: passcode
      });

      if (error) {
        console.error('🔧 Sign in error:', error);
        return { user: null, error: error.message };
      }

      const result = data[0];
      if (result?.success) {
        const user: CustomUser = {
          id: result.user_id,
          username: result.username
        };
        
        console.log('🔧 Sign in successful for:', user.username);
        this.storeSession(user);
        return { user, error: null };
      } else {
        console.log('🔧 Invalid credentials provided');
        return { user: null, error: 'Invalid username or passcode' };
      }
    } catch (err) {
      console.error('🔧 Sign in exception:', err);
      return { user: null, error: 'Sign in failed. Please try again.' };
    }
  }

  async signUp(username: string, passcode: string): Promise<AuthResult> {
    console.log('🔧 Attempting sign up with username:', username);
    
    try {
      const { data, error } = await supabase.rpc('register_user', {
        username_input: username,
        passcode_input: passcode
      });

      if (error) {
        console.error('🔧 Sign up error:', error);
        return { user: null, error: error.message };
      }

      const result = data[0];
      if (result?.success) {
        const user: CustomUser = {
          id: result.user_id,
          username: result.username
        };
        
        console.log('🔧 Sign up successful for:', user.username);
        this.storeSession(user);
        return { user, error: null };
      } else {
        console.log('🔧 Sign up failed:', result?.error_message);
        return { user: null, error: result?.error_message || 'Registration failed' };
      }
    } catch (err) {
      console.error('🔧 Sign up exception:', err);
      return { user: null, error: 'Registration failed. Please try again.' };
    }
  }

  signOut(): void {
    console.log('🔧 Signing out user');
    this.clearSession();
  }

  // Development mode helpers
  isDevMode(): boolean {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost';
  }
}

export const customAuthService = new CustomAuthService();
