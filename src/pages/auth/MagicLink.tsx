
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';

const MagicLink = () => {
  return (
    <AuthLayout
      title="Magic Link"
      description="Sign in instantly with a magic link sent to your email"
    >
      <MagicLinkForm />
    </AuthLayout>
  );
};

export default MagicLink;
