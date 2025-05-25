
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from './components/OnboardingLayout';
import { CustomSignUpForm } from './CustomSignUpForm';
import { ProfileSetupForm } from './ProfileSetupForm';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';

type OnboardingStep = 'signup' | 'profile-setup' | 'complete';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('signup');
  const { user } = useCustomAuth();
  const navigate = useNavigate();

  const handleSignUpComplete = () => {
    setCurrentStep('profile-setup');
  };

  const handleProfileSetupComplete = () => {
    setCurrentStep('complete');
    // Navigate to main app after a brief delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'signup': return 1;
      case 'profile-setup': return 2;
      case 'complete': return 3;
      default: return 1;
    }
  };

  if (currentStep === 'signup') {
    return (
      <OnboardingLayout
        title="Create Your Account"
        description="Join Cardshow with just a username and passcode"
        step={1}
        totalSteps={3}
      >
        <CustomSignUpForm onComplete={handleSignUpComplete} />
      </OnboardingLayout>
    );
  }

  if (currentStep === 'profile-setup') {
    return (
      <OnboardingLayout
        title="Set Up Your Profile"
        description="Tell us a bit about yourself"
        step={2}
        totalSteps={3}
      >
        <ProfileSetupForm onComplete={handleProfileSetupComplete} />
      </OnboardingLayout>
    );
  }

  if (currentStep === 'complete') {
    return (
      <OnboardingLayout
        title="Welcome to Cardshow!"
        description="Your account is ready. Redirecting you to the app..."
        step={3}
        totalSteps={3}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crd-blue mx-auto mb-4"></div>
          <p className="text-crd-lightGray">Setting up your experience...</p>
        </div>
      </OnboardingLayout>
    );
  }

  return null;
};
