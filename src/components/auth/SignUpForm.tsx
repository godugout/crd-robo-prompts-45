
import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useSignUpForm } from './hooks/useSignUpForm';
import { AuthFormContainer } from './components/AuthFormContainer';
import { PasswordFields } from './components/PasswordFields';
import { UserInfoFields } from './components/UserInfoFields';

export const SignUpForm: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    isPasswordMismatch,
    isFormValid,
  } = useSignUpForm();

  return (
    <AuthFormContainer>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
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
