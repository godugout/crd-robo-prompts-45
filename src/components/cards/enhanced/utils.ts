
import type { Step } from './types';
import type { CardData } from '@/types/card';

export const canContinueStep = (
  step: Step,
  selectedFrame: string,
  cardData: CardData
): boolean => {
  switch (step) {
    case 'frameAndImage':
      return Boolean(selectedFrame && cardData.image_url);
    case 'customize':
      return Boolean(cardData.title.trim().length > 0);
    case 'polish':
      return true;
    case 'preview':
      return true;
    default:
      return false;
  }
};

export const getStepTitle = (step: Step): string => {
  switch (step) {
    case 'frameAndImage':
      return 'Professional Studio';
    case 'customize':
      return 'Customize Your Card';
    case 'polish':
      return 'Add Finishing Touches';
    case 'preview':
      return 'Preview & Publish';
    default:
      return '';
  }
};

export const navigateSteps = (
  currentStep: Step,
  direction: 'next' | 'previous'
): Step => {
  const steps: Step[] = ['frameAndImage', 'customize', 'polish', 'preview'];
  const currentIndex = steps.indexOf(currentStep);
  
  if (direction === 'next' && currentIndex < steps.length - 1) {
    return steps[currentIndex + 1];
  }
  
  if (direction === 'previous' && currentIndex > 0) {
    return steps[currentIndex - 1];
  }
  
  return currentStep;
};

export const validateTheme = (theme: string): string => {
  return ['default', 'dark', 'light'].includes(theme) ? theme : 'default';
};
