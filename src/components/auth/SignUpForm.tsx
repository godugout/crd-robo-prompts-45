
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/contexts/AuthContext';
import { useSignUpForm } from './hooks/useSignUpForm';
import { AuthFormContainer } from './components/AuthFormContainer';
import { PasswordFields } from './components/PasswordFields';
import { UserInfoFields } from './components/UserInfoFields';

export const SignUpForm: React.FC = () => {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isPasswordMismatch,
    isFormValid,
  } = useSignUpForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    console.log('🔧 Signup form submitting with data:', { 
      email: formData.email,
      fullName: formData.fullName,
      username: formData.username
    });
    
    const { error } = await signUp(formData.email, formData.password);
    
    if (!error) {
      console.log('🔧 Signup successful, navigating to home');
      navigate('/');
    } else {
      console.error('🔧 Signup failed with error:', error);
    }
  };

  return (
    <AuthFormContainer>
      <form onSubmit={onSubmit} className="space-y-4">
        <UserInfoFields
          fullName={formData.fullName}
          username={formData.username}
          email={formData.email}
          onFullNameChange={(value) => handleInputChange('fullName', value)}
          onUsernameChange={(value) => handleInputChange('username', value)}
          onEmailChange={(value) => handleInputChange('email', value)}
        />

        <PasswordFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(value) => handleInputChange('password', value)}
          onConfirmPasswordChange={(value) => handleInputChange('confirmPassword', value)}
        />

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </CRDButton>
      </form>

      <div className="text-center">
        <span className="text-crd-lightGray">Already have an account? </span>
        <Link to="/auth/signin" className="text-crd-blue hover:text-crd-blue/80">
          Sign in
        </Link>
      </div>
    </AuthFormContainer>
  );
};
