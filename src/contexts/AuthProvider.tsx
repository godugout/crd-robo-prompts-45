
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { LoadingState } from '@/components/common/LoadingState';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (username: string, passcode: string) => Promise<{ error: string | null }>;
  signUp: (username: string, passcode: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('🔧 AuthProvider rendering');
  
  const customAuth = useCustomAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('🔧 AuthProvider useEffect - customAuth.loading:', customAuth.loading);
    
    // Wait for custom auth to initialize
    if (!customAuth.loading) {
      console.log('🔧 AuthProvider initialized');
      setIsInitialized(true);
    }
  }, [customAuth.loading]);

  const value: AuthContextType = {
    user: customAuth.user,
    loading: customAuth.loading,
    signIn: customAuth.signIn,
    signUp: customAuth.signUp,
    signOut: customAuth.signOut,
    isAuthenticated: !!customAuth.user,
  };

  console.log('🔧 AuthProvider state:', {
    isInitialized,
    loading: customAuth.loading,
    hasUser: !!customAuth.user
  });

  if (!isInitialized) {
    console.log('🔧 AuthProvider showing loading state');
    return <LoadingState message="Initializing authentication..." fullPage size="lg" />;
  }

  console.log('🔧 AuthProvider rendering children');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
