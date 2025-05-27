
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Upload, Search, Eye, Sparkles } from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/types';
import { CardsUploadFeature } from './CardsUploadFeature';
import { CardsDetectionProgress } from './CardsDetectionProgress';
import { CardsReviewStep } from './CardsReviewStep';
import { CardsFinalizingStep } from './CardsFinalizingStep';
import { CardsCompleteStep } from './CardsCompleteStep';

interface CardsWorkflowSectionProps {
  currentStep: 'upload' | 'detecting' | 'review' | 'finalizing' | 'complete';
  totalCards: number;
  selectedCards: number;
  detectedCardsArray: DetectedCard[];
  selectedCardsSet: Set<string>;
  isProcessing: boolean;
  onUploadComplete: (count: number) => void;
  onCardToggle: (cardId: string) => void;
  onCardEdit: (cardId: string, bounds: DetectedCard['bounds']) => void;
  onReviewComplete: () => void;
  onStartOver: () => void;
}

const workflowSteps = [
  { id: 'upload', label: 'Upload Images', icon: Upload },
  { id: 'detecting', label: 'AI Detection', icon: Search },
  { id: 'review', label: 'Review & Select', icon: Eye },
  { id: 'finalizing', label: 'Creating Cards', icon: Sparkles },
  { id: 'complete', label: 'Complete', icon: CheckCircle }
];

export const CardsWorkflowSection: React.FC<CardsWorkflowSectionProps> = ({
  currentStep,
  totalCards,
  selectedCards,
  detectedCardsArray,
  selectedCardsSet,
  isProcessing,
  onUploadComplete,
  onCardToggle,
  onCardEdit,
  onReviewComplete,
  onStartOver
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return <CardsUploadFeature onUploadComplete={onUploadComplete} />;
      case 'detecting':
        return <CardsDetectionProgress isProcessing={isProcessing} />;
      case 'review':
        return (
          <CardsReviewStep
            detectedCards={detectedCardsArray}
            selectedCards={selectedCardsSet}
            onCardToggle={onCardToggle}
            onCardEdit={onCardEdit}
            onReviewComplete={onReviewComplete}
            onStartOver={onStartOver}
          />
        );
      case 'finalizing':
        return <CardsFinalizingStep selectedCards={selectedCards} />;
      case 'complete':
        return <CardsCompleteStep selectedCards={selectedCards} onStartOver={onStartOver} />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        {/* Workflow Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-xl font-bold text-white mr-4">Card Creation Workflow</h2>
            {totalCards > 0 && (
              <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
                {totalCards} cards detected, {selectedCards} selected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {workflowSteps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = workflowSteps.findIndex(s => s.id === currentStep) > index;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${isActive ? 'text-crd-green' : isCompleted ? 'text-green-400' : 'text-crd-lightGray'}`}>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${
                      isActive ? 'border-crd-green bg-crd-green/20' : 
                      isCompleted ? 'border-green-400 bg-green-400/20' : 
                      'border-crd-mediumGray'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-center">{step.label}</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 transition-colors ${
                      isCompleted ? 'bg-green-400' : 'bg-crd-mediumGray'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};
