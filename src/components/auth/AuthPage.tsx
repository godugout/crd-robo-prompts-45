
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { EnhancedSignInForm } from './EnhancedSignInForm';
import { CustomSignUpForm } from './CustomSignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { MagicLinkForm } from './MagicLinkForm';
import { ResetPasswordForm } from './ResetPasswordForm';

export const AuthPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/signin" replace />} />
      
      <Route path="/signin" element={
        <AuthLayout
          title="Welcome Back"
          description="Sign in with your username and passcode"
        >
          <EnhancedSignInForm />
        </AuthLayout>
      } />
      
      <Route path="/signup" element={
        <AuthLayout
          title="Create Account"
          description="Join Cardshow and start creating amazing cards"
        >
          <CustomSignUpForm />
        </AuthLayout>
      } />
      
      <Route path="/forgot-password" element={
        <AuthLayout
          title="Forgot Password"
          description="Enter your email to reset your password"
        >
          <ForgotPasswordForm />
        </AuthLayout>
      } />
      
      <Route path="/magic-link" element={
        <AuthLayout
          title="Magic Link"
          description="Sign in with a magic link sent to your email"
        >
          <MagicLinkForm />
        </AuthLayout>
      } />
      
      <Route path="/reset-password" element={
        <AuthLayout
          title="Reset Password"
          description="Enter your new password"
        >
          <ResetPasswordForm />
        </AuthLayout>
      } />
    </Routes>
  );
};
