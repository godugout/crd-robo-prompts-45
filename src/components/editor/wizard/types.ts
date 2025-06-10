
import type { TemplateConfig } from './wizardConfig';

export interface WizardState {
  currentStep: number;
  selectedPhoto: string;
  selectedTemplate: TemplateConfig | null;
  aiAnalysisComplete: boolean;
}

export interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleImageAdjusted: (adjustedImageUrl: string) => void;
  handleTemplateSelect: (template: TemplateConfig) => void;
  handleAiAnalysis: (analysis: any) => void;
  updateCardField: (field: string, value: any) => void;
  updateCreatorAttribution: (attribution: any) => void;
  updatePublishingOptions: (options: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => void;
}
