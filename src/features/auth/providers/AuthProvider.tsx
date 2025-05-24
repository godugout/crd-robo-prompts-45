
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthActions } from '../hooks/useAuthActions';
import type { AuthContextType } from '../types';

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
  const authState = useAuthState();
  const authActions = useAuthActions(authState.user?.id);

  const value: AuthContextType = {
    ...authState,
    ...authActions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
