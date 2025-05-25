
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CustomSignUpForm } from '@/components/auth/CustomSignUpForm';

const SignUp = () => {
  return (
    <AuthLayout
      title="Create Account"
      description="Join Cardshow with just a username and passcode"
    >
      <CustomSignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
