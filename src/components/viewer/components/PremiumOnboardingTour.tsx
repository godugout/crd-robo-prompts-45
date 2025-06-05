
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Crown, Sparkles, Settings, Download, Star } from 'lucide-react';
import type { UserTier } from '../types/tierSystem';
import { TIER_SYSTEM } from '../types/tierSystem';

interface PremiumOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  userTier: UserTier;
  onComplete: () => void;
}

interface TourStep {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  gradient: string;
}

export const PremiumOnboardingTour: React.FC<PremiumOnboardingTourProps> = ({
  isOpen,
  onClose,
  userTier,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const tierInfo = TIER_SYSTEM[userTier];

  const tourSteps: TourStep[] = [
    {
      title: `Welcome to ${tierInfo.name}! 🎉`,
      description: `You've unlocked amazing new features as a ${tierInfo.displayName}`,
      features: tierInfo.features.slice(0, 4),
      icon: userTier === 'pro' ? <Sparkles className="w-8 h-8" /> : <Crown className="w-8 h-8" />,
      gradient: userTier === 'pro' ? 'from-blue-500 to-purple-600' : 'from-amber-500 to-orange-600'
    },
    {
      title: 'Advanced Effects Studio',
      description: 'Access professional-grade card effects and customization',
      features: [
        'All premium effect presets',
        'Advanced control sliders',
        'Real-time effect preview',
        'Custom combinations'
      ],
      icon: <Settings className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Unlimited Exports',
      description: 'Save and share your enhanced cards without limits',
      features: [
        'No watermarks',
        'High-quality exports',
        'Multiple formats',
        userTier === 'baller' ? '4K resolution' : 'HD resolution'
      ],
      icon: <Download className="w-8 h-8" />,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      title: "Let's Get Started!",
      description: 'Your enhanced studio is ready to use',
      features: [
        'Try the new effect presets',
        'Experiment with sliders',
        'Export your creations',
        'Join our premium community'
      ],
      icon: <Star className="w-8 h-8" />,
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-black text-white border-gray-800">
        <div className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentTourStep.gradient} opacity-10`} />
          
          <div className="relative z-10 p-6">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-white' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="text-center mb-8">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${currentTourStep.gradient} mb-4`}>
                {currentTourStep.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-2">{currentTourStep.title}</h2>
              
              {/* Tier Badge */}
              <Badge 
                className="mb-4" 
                style={{ backgroundColor: tierInfo.color, color: 'white' }}
              >
                {tierInfo.icon} {tierInfo.displayName}
              </Badge>

              {/* Description */}
              <p className="text-gray-300 mb-6">{currentTourStep.description}</p>

              {/* Features List */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <ul className="space-y-2">
                  {currentTourStep.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-gray-400 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-gray-400">
                {currentStep + 1} of {tourSteps.length}
              </span>

              <Button
                onClick={handleNext}
                className={`bg-gradient-to-r ${currentTourStep.gradient} hover:opacity-90`}
              >
                {isLastStep ? 'Start Creating!' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
