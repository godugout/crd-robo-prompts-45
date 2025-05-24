
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PasswordField } from './components/PasswordField';
import { useAuthForm } from './hooks/useAuthForm';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { formData, isLoading, handleInputChange, handleSubmit } = useAuthForm<ResetPasswordFormData>({
    initialValues: { password: '', confirmPassword: '' },
    onSubmit: async (data) => {
      if (data.password !== data.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (data.password.length < 6) {
        toast({
          title: 'Password Too Short',
          description: 'Password must be at least 6 characters long.',
          variant: 'destructive',
        });
        return;
      }

      try {
        const { error } = await supabase.auth.updateUser({
          password: data.password
        });

        if (error) {
          toast({
            title: 'Password Update Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Password Updated',
            description: 'Your password has been updated successfully.',
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: 'Unexpected Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    },
  });

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      toast({
        title: 'Invalid Reset Link',
        description: 'This password reset link is invalid or has expired.',
        variant: 'destructive',
      });
      navigate('/auth/forgot-password');
    }
  }, [searchParams, navigate]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-crd-white">Set new password</h3>
        <p className="text-crd-lightGray">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          password={formData.password}
          onPasswordChange={(value) => handleInputChange('password', value)}
          placeholder="Enter new password"
          label="New Password"
        />

        <PasswordField
          password={formData.confirmPassword}
          onPasswordChange={(value) => handleInputChange('confirmPassword', value)}
          placeholder="Confirm new password"
          label="Confirm Password"
        />

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !formData.password || !formData.confirmPassword}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </CRDButton>
      </form>
    </div>
  );
};
