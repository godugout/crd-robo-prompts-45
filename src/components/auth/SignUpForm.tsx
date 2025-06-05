
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/contexts/AuthContext';
import { AuthFormContainer } from './components/AuthFormContainer';
import { PasswordFields } from './components/PasswordFields';
import { UserInfoFields } from './components/UserInfoFields';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
}

export const SignUpForm: React.FC = () => {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
  });

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const isPasswordMismatch = formData.password !== formData.confirmPassword && formData.confirmPassword !== '';
  const isFormValid = formData.email && formData.password && formData.confirmPassword && 
                     formData.username && formData.fullName && !isPasswordMismatch && 
                     formData.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔧 Signup form submitting with data:', { 
      email: formData.email,
      fullName: formData.fullName,
      username: formData.username,
      passwordLength: formData.password.length,
      isFormValid
    });
    
    if (!isFormValid) {
      console.log('🔧 Form validation failed');
      return;
    }

    if (isPasswordMismatch) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    
    // Pass user metadata to signUp
    const { error: signUpError } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      username: formData.username
    });
    
    if (signUpError) {
      console.error('🔧 Signup failed with error:', signUpError);
      setError(signUpError.message || 'Failed to create account');
    } else {
      console.log('🔧 Signup successful, navigating to signin');
      navigate('/auth/signin');
    }
  };

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

        {isPasswordMismatch && (
          <div className="text-red-400 text-sm">
            Passwords do not match
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded">
            {error}
          </div>
        )}

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
