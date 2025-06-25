
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  
  // In production, check for admin role from user profile/permissions
  const isAdmin = user?.email === 'admin@cardshow.com' || process.env.NODE_ENV === 'development';
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard isEnterprise={true} />;
};

export default AdminDashboardPage;
