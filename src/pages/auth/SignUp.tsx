
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

const SignUp = () => {
  return (
    <AuthLayout
      title="Create Account"
      description="Join Cardshow and start building your collection"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
