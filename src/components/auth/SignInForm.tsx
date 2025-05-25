
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/features/auth';
import { Sparkles } from 'lucide-react';
import { AuthFormContainer } from './components/AuthFormContainer';
import { EmailField } from './components/EmailField';
import { PasswordField } from './components/PasswordField';
import { useAuthForm } from './hooks/useAuthForm';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignInForm: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const { formData, handleInputChange, handleSubmit } = useAuthForm<SignInFormData>({
    initialValues: { email: '', password: '' },
    onSubmit: async (data) => {
      console.log('Submitting sign in form for:', data.email);
      const { error } = await signIn(data.email, data.password);
      if (!error) {
        console.log('Sign in successful, navigating to home');
        navigate('/');
      } else {
        console.error('Sign in failed:', error);
      }
    },
  });

  return (
    <AuthFormContainer>
      <form onSubmit={handleSubmit} className="space-y-4">
        <EmailField
          email={formData.email}
          onEmailChange={(value) => handleInputChange('email', value)}
        />

        <PasswordField
          password={formData.password}
          onPasswordChange={(value) => handleInputChange('password', value)}
        />

        <div className="flex justify-between items-center">
          <Link 
            to="/auth/magic-link" 
            className="text-sm text-crd-blue hover:text-crd-blue/80 flex items-center"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Magic link
          </Link>
          <Link 
            to="/auth/forgot-password" 
            className="text-sm text-crd-blue hover:text-crd-blue/80"
          >
            Forgot password?
          </Link>
        </div>

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </CRDButton>
      </form>

      <div className="text-center">
        <span className="text-crd-lightGray">Don't have an account? </span>
        <Link to="/auth/signup" className="text-crd-blue hover:text-crd-blue/80">
          Sign up
        </Link>
      </div>
    </AuthFormContainer>
  );
};
