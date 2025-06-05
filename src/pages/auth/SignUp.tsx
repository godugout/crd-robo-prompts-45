
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

const SignUp = () => {
  return (
    <AuthLayout
      title="Create Account"
      description="Join Cardshow to start collecting"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
