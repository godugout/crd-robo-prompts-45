
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
}

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isPasswordMismatch = formData.password !== formData.confirmPassword;
  const isFormValid = formData.email && formData.password && formData.confirmPassword && 
                     formData.username && formData.fullName && !isPasswordMismatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPasswordMismatch) {
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password);
    
    if (!error) {
      navigate('/auth/signin');
    }
    
    setIsLoading(false);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    isPasswordMismatch,
    isFormValid,
  };
};
