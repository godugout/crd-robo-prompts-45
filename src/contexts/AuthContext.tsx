
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { devAuthService } from '@/features/auth/services/devAuthService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: string) => Promise<{ error: any }>;
  isDevelopment: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isDevelopment = devAuthService.isDevMode();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('🔧 Initializing auth system...');

      // Development mode auto-login
      if (isDevelopment) {
        console.log('🔧 Development mode detected - checking for dev session');
        
        const storedDevAuth = devAuthService.getStoredDevSession();
        
        if (storedDevAuth.user && storedDevAuth.session) {
          console.log('🔧 Using stored dev session for', storedDevAuth.user.email);
          if (mounted) {
            setSession(storedDevAuth.session);
            setUser(storedDevAuth.user);
            setLoading(false);
          }
          return;
        } else {
          // Auto-create dev session
          console.log('🔧 Creating auto-login dev session');
          const { user: devUser, session: devSession, error } = await devAuthService.createDevUserSession();
          if (mounted && devUser && devSession) {
            console.log('🔧 Dev session created for', devUser.email);
            setSession(devSession);
            setUser(devUser);
            setLoading(false);
            return;
          } else if (error) {
            console.error('🔧 Failed to create dev session:', error);
          }
        }
      }

      // Production Supabase auth flow
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('🔧 Auth initialization error:', error);
          setLoading(false);
          return;
        }

        console.log('🔧 Supabase session check:', session ? 'Found session' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('🔧 Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener for production
    let subscription: { unsubscribe: () => void } | null = null;
    
    if (!isDevelopment) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔧 Supabase auth state changed:', event, session?.user?.id);
          
          if (!mounted) return;

          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = data.subscription;
    }

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [isDevelopment]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    // Clear dev session if in dev mode
    if (isDevelopment) {
      devAuthService.clearDevSession();
      setUser(null);
      setSession(null);
      return;
    }
    
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const signInWithOAuth = async (provider: string) => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: provider as any 
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithOAuth,
    isDevelopment
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
