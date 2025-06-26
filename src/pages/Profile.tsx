
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
        {user && (
          <div className="text-crd-lightGray">
            <p>Email: {user.email}</p>
            <p>Name: {user.user_metadata?.full_name || 'Not set'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
