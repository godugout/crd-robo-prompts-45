
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
              await ensureProfile(session.user);
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
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
            error: error as AuthError, 
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

  const ensureProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0],
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url,
          });

        if (error) {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    setAuthState(prev => ({ ...prev, loading: false, error }));

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

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setAuthState(prev => ({ ...prev, loading: false, error }));

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

    return { error };
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    const { error } = await supabase.auth.signOut();
    
    setAuthState(prev => ({ ...prev, loading: false, error }));

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

    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setAuthState(prev => ({ ...prev, loading: false, error }));

    if (error) {
      toast({
        title: 'OAuth Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

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
    if (!authState.user) {
      const error = new Error('No user logged in') as AuthError;
      return { error };
    }

    setAuthState(prev => ({ ...prev, loading: true }));

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authState.user.id);

    setAuthState(prev => ({ ...prev, loading: false }));

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

    return { error };
  };

  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
