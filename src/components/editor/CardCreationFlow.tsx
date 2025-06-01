
import React, { useState } from 'react';
import { SimpleCardWizard } from './SimpleCardWizard';
import { SimpleEditor } from './SimpleEditor';
import { Button } from '@/components/ui/button';
import { Upload, Plus, ArrowLeft } from 'lucide-react';
import { CardsPage } from '@/components/cards/CardsPage';
import type { CardData } from '@/hooks/useCardEditor';

type FlowType = 'single' | 'bulk' | 'editing';

interface CardCreationFlowProps {
  initialCardId?: string;
}

export const CardCreationFlow = ({ initialCardId }: CardCreationFlowProps) => {
  const [flowType, setFlowType] = useState<FlowType>(initialCardId ? 'editing' : 'single');
  const [wizardComplete, setWizardComplete] = useState(!!initialCardId);
  const [cardData, setCardData] = useState<CardData | null>(null);

  const handleWizardComplete = (data: CardData) => {
    setCardData(data);
    setWizardComplete(true);
    setFlowType('editing');
  };

  const handleStartOver = () => {
    setFlowType('single');
    setWizardComplete(false);
    setCardData(null);
  };

  // If we have an initial card ID, go directly to editing
  if (initialCardId && flowType === 'editing') {
    return <SimpleEditor initialData={cardData} onStartOver={handleStartOver} />;
  }

  // Bulk upload flow
  if (flowType === 'bulk') {
    return (
      <div className="min-h-screen bg-crd-darkest">
        <div className="border-b border-editor-border bg-editor-dark">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFlowType('single')}
                className="text-white hover:bg-editor-border hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Single Card Creation
              </Button>
              <h1 className="text-xl font-semibold text-white">Bulk Card Upload</h1>
            </div>
          </div>
        </div>
        <CardsPage />
      </div>
    );
  }

  // Single card creation flow (primary)
  if (!wizardComplete) {
    return (
      <div className="min-h-screen bg-crd-darkest">
        {/* Header with bulk upload option */}
        <div className="border-b border-editor-border bg-editor-dark">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Create Your Card</h1>
              <div className="text-crd-lightGray text-sm">
                Upload a photo and let AI suggest the perfect details
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFlowType('bulk')}
              className="bg-transparent border-crd-lightGray text-black hover:bg-crd-lightGray hover:text-black hover:border-crd-lightGray transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>

        {/* Main wizard content */}
        <div className="flex-1">
          <SimpleCardWizard onComplete={handleWizardComplete} />
        </div>
      </div>
    );
  }

  // Card editing after wizard completion
  return cardData ? (
    <SimpleEditor initialData={cardData} onStartOver={handleStartOver} />
  ) : null;
};
