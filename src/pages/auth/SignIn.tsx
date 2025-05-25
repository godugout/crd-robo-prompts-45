
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CustomSignInForm } from '@/components/auth/CustomSignInForm';

const SignIn = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in with your username and passcode"
    >
      <CustomSignInForm />
    </AuthLayout>
  );
};

export default SignIn;
