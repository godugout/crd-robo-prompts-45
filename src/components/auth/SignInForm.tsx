
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    await signInWithOAuth(provider);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-crd-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
            <CRDInput
              id="email"
              type="email"
              variant="crd"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex justify-end">
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
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
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
        <span className="text-crd-lightGray">Don't have an account? </span>
        <Link to="/auth/signup" className="text-crd-blue hover:text-crd-blue/80">
          Sign up
        </Link>
      </div>
    </div>
  );
};
