
import React, { useState } from 'react';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { toast } from '@/hooks/use-toast';

interface ProfileSetupFormProps {
  onComplete: () => void;
}

export const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCustomAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to set up your profile',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // For now, we'll just store this locally or in the future connect to profiles table
      console.log('🔧 Profile setup data:', { fullName, bio, username: user.username });
      
      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been set up successfully',
      });
      
      onComplete();
    } catch (error) {
      console.error('🔧 Profile setup error:', error);
      toast({
        title: 'Setup Failed',
        description: 'Failed to set up your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-crd-white">Full Name (Optional)</Label>
        <CRDInput
          id="fullName"
          type="text"
          variant="crd"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-crd-white">Bio (Optional)</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray focus-visible:ring-crd-blue focus-visible:border-crd-blue min-h-[100px] resize-none"
          maxLength={200}
        />
        <p className="text-xs text-crd-lightGray">{bio.length}/200 characters</p>
      </div>

      <div className="space-y-4 pt-4">
        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </CRDButton>

        <CRDButton
          type="button"
          variant="ghost"
          size="lg"
          className="w-full text-crd-lightGray"
          onClick={onComplete}
          disabled={isLoading}
        >
          Skip for now
        </CRDButton>
      </div>
    </form>
  );
};
