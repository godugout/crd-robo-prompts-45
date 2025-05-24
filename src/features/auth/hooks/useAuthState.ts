
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import type { AuthState } from '../types';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          error: null,
        }));

        // Handle profile creation/updates after auth state change
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              await profileService.ensureProfile(session.user);
            } catch (error) {
              console.error('Error ensuring profile:', error);
            }
          }, 0);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await authService.getSession();
        
        if (!mounted) return;

        if (error) {
          setAuthState(prev => ({ ...prev, error, loading: false }));
          return;
        }

        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      } catch (error) {
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            error: error as any, 
            loading: false 
          }));
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
