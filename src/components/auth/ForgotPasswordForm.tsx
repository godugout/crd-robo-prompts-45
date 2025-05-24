
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import { EmailField } from './components/EmailField';
import { useAuthForm } from './hooks/useAuthForm';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const { formData, isLoading, handleInputChange, handleSubmit } = useAuthForm<ForgotPasswordFormData>({
    initialValues: { email: '' },
    onSubmit: async (data) => {
      const { error } = await resetPassword(data.email);
      if (!error) {
        setIsEmailSent(true);
      }
    },
  });

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-crd-blue/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="h-8 w-8 text-crd-blue" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-crd-white">Check your email</h3>
          <p className="text-crd-lightGray">
            We've sent a password reset link to <strong>{formData.email}</strong>
          </p>
        </div>
        <div className="space-y-3">
          <CRDButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setIsEmailSent(false)}
          >
            Try another email
          </CRDButton>
          <Link to="/auth/signin" className="block">
            <CRDButton variant="outline" size="lg" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </CRDButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-crd-white">Reset your password</h3>
        <p className="text-crd-lightGray">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <EmailField
          email={formData.email}
          onEmailChange={(value) => handleInputChange('email', value)}
        />

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !formData.email}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </CRDButton>
      </form>

      <div className="text-center">
        <Link to="/auth/signin" className="text-crd-blue hover:text-crd-blue/80 text-sm">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
