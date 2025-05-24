
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';

export const MagicLinkForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: 'Magic Link Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Magic Link Sent',
          description: 'Check your email for the magic link to sign in.',
        });
        setIsEmailSent(true);
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-crd-blue/20 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="h-8 w-8 text-crd-blue" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-crd-white">Magic link sent!</h3>
          <p className="text-crd-lightGray">
            We've sent a magic link to <strong>{email}</strong>. Click the link to sign in instantly.
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
        <div className="w-12 h-12 bg-crd-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <Sparkles className="h-6 w-6 text-crd-blue" />
        </div>
        <h3 className="text-lg font-semibold text-crd-white">Sign in with magic link</h3>
        <p className="text-crd-lightGray">
          Enter your email and we'll send you a magic link to sign in instantly
        </p>
      </div>

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

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !email}
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
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
