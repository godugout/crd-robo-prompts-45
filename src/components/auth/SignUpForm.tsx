
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return; // Handle password mismatch
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      username: formData.username,
      full_name: formData.fullName,
    });
    
    if (!error) {
      navigate('/auth/signin');
    }
    
    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    await signInWithOAuth(provider);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-crd-white">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
              <CRDInput
                id="fullName"
                variant="crd"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-crd-white">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
              <CRDInput
                id="username"
                variant="crd"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-crd-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
            <CRDInput
              id="email"
              type="email"
              variant="crd"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-crd-white">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
            <CRDInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              variant="crd"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-crd-white">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
            <CRDInput
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="crd"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || formData.password !== formData.confirmPassword}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </CRDButton>
      </form>

      <div className="relative">
        <Separator className="bg-crd-mediumGray" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-crd-dark px-2 text-sm text-crd-lightGray">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <CRDButton
          variant="outline"
          size="sm"
          onClick={() => handleOAuthSignIn('google')}
          className="w-full"
        >
          Google
        </CRDButton>
        <CRDButton
          variant="outline"
          size="sm"
          onClick={() => handleOAuthSignIn('github')}
          className="w-full"
        >
          GitHub
        </CRDButton>
        <CRDButton
          variant="outline"
          size="sm"
          onClick={() => handleOAuthSignIn('discord')}
          className="w-full"
        >
          Discord
        </CRDButton>
      </div>

      <div className="text-center">
        <span className="text-crd-lightGray">Already have an account? </span>
        <Link to="/auth/signin" className="text-crd-blue hover:text-crd-blue/80">
          Sign in
        </Link>
      </div>
    </div>
  );
};
