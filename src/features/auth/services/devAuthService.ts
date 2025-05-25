
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export class DevAuthService {
  private static readonly DEV_USER_EMAIL = 'jay@godugout.com';
  private static readonly DEV_USER_ID = '46a8c68a-e05b-4bc3-b25f-5a951b59c46f'; // From your logs

  async createDevUserSession(): Promise<{ user: User | null; session: Session | null; error: any }> {
    // Only run in development
    if (window.location.hostname !== 'localhost') {
      return { user: null, session: null, error: new Error('Dev auth only works in development') };
    }

    try {
      // Create a mock session for development
      const mockUser: User = {
        id: DevAuthService.DEV_USER_ID,
        email: DevAuthService.DEV_USER_EMAIL,
        email_confirmed_at: new Date().toISOString(),
        phone: '',
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          full_name: 'Jay Dev User',
          username: 'jay_dev'
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: 'authenticated'
      };

      const mockSession: Session = {
        access_token: 'dev_access_token_' + Date.now(),
        refresh_token: 'dev_refresh_token_' + Date.now(),
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      };

      // Store in localStorage to persist across page reloads
      localStorage.setItem('dev_auth_session', JSON.stringify(mockSession));
      localStorage.setItem('dev_auth_user', JSON.stringify(mockUser));

      console.log('🔧 Development: Auto-logged in as', DevAuthService.DEV_USER_EMAIL);
      
      return { user: mockUser, session: mockSession, error: null };
    } catch (error) {
      console.error('Dev auth error:', error);
      return { user: null, session: null, error };
    }
  }

  getStoredDevSession(): { user: User | null; session: Session | null } {
    // Only run in development
    if (window.location.hostname !== 'localhost') {
      return { user: null, session: null };
    }

    try {
      const storedSession = localStorage.getItem('dev_auth_session');
      const storedUser = localStorage.getItem('dev_auth_user');
      
      if (storedSession && storedUser) {
        return {
          session: JSON.parse(storedSession),
          user: JSON.parse(storedUser)
        };
      }
    } catch (error) {
      console.error('Error getting stored dev session:', error);
    }

    return { user: null, session: null };
  }

  clearDevSession(): void {
    localStorage.removeItem('dev_auth_session');
    localStorage.removeItem('dev_auth_user');
    console.log('🔧 Development: Cleared dev auth session');
  }

  isDevMode(): boolean {
    return window.location.hostname === 'localhost';
  }
}

export const devAuthService = new DevAuthService();
