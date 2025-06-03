
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepAction?: (step: number, action: string) => void;
}

const TOUR_STEPS = [
  {
    title: 'Welcome to Enhanced Card Viewer',
    content: 'This tour will show you how to create stunning visual effects for your cards. We\'ll start with presets and then explore custom controls.',
    action: 'Start with presets',
    highlight: 'Quick Start section'
  },
  {
    title: 'Choose a Preset',
    content: 'Click on any preset card to instantly apply a professional effect combination. Each preset is designed for different card styles.',
    action: 'Try "Holographic Premium"',
    highlight: 'Preset gallery'
  },
  {
    title: 'Explore Environment Scenes',
    content: 'Different backgrounds dramatically change how your effects appear. Switch between scenes to see how your card looks in various settings.',
    action: 'Switch to "Cosmic Void"',
    highlight: 'Scenes tab'
  },
  {
    title: 'Adjust Lighting',
    content: 'Lighting affects the intensity and appearance of all effects. Try different presets and adjust the overall brightness.',
    action: 'Try "Golden Hour" lighting',
    highlight: 'Lighting tab'
  },
  {
    title: 'Fine-tune Effects',
    content: 'Each effect has unique parameters. Use the sliders to customize intensity, colors, patterns, and animations to your liking.',
    action: 'Adjust holographic parameters',
    highlight: 'Effects controls'
  },
  {
    title: 'Save Your Creation',
    content: 'Once you\'re happy with your card, save it or share it with others. Your settings are preserved for future editing.',
    action: 'Save your masterpiece',
    highlight: 'Save & Share section'
  }
];

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isOpen,
  onClose,
  onStepAction
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepAction = () => {
    onStepAction?.(currentStep, step.action);
    // Auto-advance after action for better flow
    setTimeout(() => {
      if (!isLastStep) {
        setCurrentStep(currentStep + 1);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <Card className="bg-editor-dark border-editor-border max-w-md w-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-crd-green" />
              <span className="text-white font-medium">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-crd-lightGray hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-1 mb-6">
            <div 
              className="bg-crd-green h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">
              {step.title}
            </h3>
            
            <p className="text-crd-lightGray text-sm leading-relaxed">
              {step.content}
            </p>

            {step.highlight && (
              <div className="bg-crd-green bg-opacity-10 border border-crd-green rounded-lg p-3">
                <p className="text-crd-green text-sm">
                  <strong>Look for:</strong> {step.highlight}
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleStepAction}
              className="w-full bg-crd-green hover:bg-crd-green/80 text-black font-medium"
            >
              {step.action}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="border-editor-border text-white hover:bg-gray-700 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="border-editor-border text-white hover:bg-gray-700"
            >
              {isLastStep ? 'Finish' : 'Skip'}
              {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
