
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { EmailField } from './components/EmailField';
import { useAuthForm } from './hooks/useAuthForm';

interface MagicLinkFormData {
  email: string;
}

export const MagicLinkForm: React.FC = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { formData, isLoading, handleInputChange, handleSubmit } = useAuthForm<MagicLinkFormData>({
    initialValues: { email: '' },
    onSubmit: async (data) => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
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
    },
  });

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-crd-blue/20 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="h-8 w-8 text-crd-blue" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-crd-white">Magic link sent!</h3>
          <p className="text-crd-lightGray">
            We've sent a magic link to <strong>{formData.email}</strong>. Click the link to sign in instantly.
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
