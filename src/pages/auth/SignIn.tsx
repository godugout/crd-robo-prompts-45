
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignInForm } from '@/components/auth/SignInForm';

const SignIn = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your Cardshow account"
    >
      <SignInForm />
    </AuthLayout>
  );
};

export default SignIn;
