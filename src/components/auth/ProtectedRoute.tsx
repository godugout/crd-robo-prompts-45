
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { LoadingState } from '@/components/common/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useCustomAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Authenticating..." fullPage size="lg" />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
