import type { CardData } from '@/hooks/useCardEditor';
import type { TemplateConfig } from './wizardConfig';
import type { CardAnalysisResult } from '@/services/cardAnalyzer';

export interface WizardState {
  currentStep: number;
  selectedPhoto: string;
  selectedTemplate: TemplateConfig | null;
  aiAnalysisComplete: boolean;
}

export interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleImageAdjusted: (adjustedImageUrl: string) => void;
  handleTemplateSelect: (template: any) => void;
  handleAiAnalysis: (analysis: any) => void;
  updateCardField: (field: string, value: any) => void;
  updateCreatorAttribution: (attribution: any) => void;
  updatePublishingOptions: (options: any) => void;
}

export interface EnhancedCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
}
