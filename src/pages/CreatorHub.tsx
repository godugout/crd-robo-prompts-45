
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreatorDashboard } from '@/components/creator/CreatorDashboard';
import { CreatorProfileSetup } from '@/components/creator/CreatorProfileSetup';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { Navigate } from 'react-router-dom';

const CreatorHub = () => {
  const { user } = useAuth();
  const { isCreator, isLoading } = useCreatorProfile();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-white">Loading creator hub...</div>
      </div>
    );
  }

  return isCreator ? <CreatorDashboard /> : <CreatorProfileSetup />;
};

export default CreatorHub;
