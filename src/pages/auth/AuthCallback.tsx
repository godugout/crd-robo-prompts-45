
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/common/LoadingState';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: 'Authentication Error',
            description: error.message,
            variant: 'destructive',
          });
          navigate('/auth/signin');
          return;
        }

        if (data.session) {
          toast({
            title: 'Welcome!',
            description: 'You have been signed in successfully.',
          });
          navigate('/');
        } else {
          navigate('/auth/signin');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        navigate('/auth/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
      <LoadingState message="Completing sign in..." size="lg" />
    </div>
  );
};

export default AuthCallback;
