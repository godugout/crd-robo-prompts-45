
import type { TemplateConfig } from './wizardConfig';
import type { CardData, CardRarity, CardVisibility } from '@/hooks/useCardEditor';
import type { CardAnalysisResult } from '@/services/cardAnalyzer';

export interface WizardState {
  currentStep: number;
  selectedPhoto: string;
  selectedTemplate: TemplateConfig | null;
  aiAnalysisComplete: boolean;
}

export interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleAiAnalysis: (analysis: CardAnalysisResult) => void;
  handleTemplateSelect: (template: TemplateConfig) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => Promise<void>;
  updatePublishingOptions: (key: string, value: any) => void;
  updateCreatorAttribution: (key: string, value: any) => void;
  updateCardField: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
}

export interface EnhancedCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel?: () => void;
}

