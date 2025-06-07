
import React, { useState } from 'react';
import { UnifiedCardCreator } from './UnifiedCardCreator';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft } from 'lucide-react';
import { CardsPage } from '@/components/cards/CardsPage';
import type { CardData } from '@/hooks/useCardEditor';

type FlowType = 'single' | 'bulk';

interface CardCreationFlowProps {
  initialCardId?: string;
}

export const CardCreationFlow = ({ initialCardId }: CardCreationFlowProps) => {
  const [flowType, setFlowType] = useState<FlowType>('single');

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

  // Single card creation flow (new unified experience)
  return (
    <div className="relative">
      {/* Floating bulk upload button */}
      <Button
        onClick={() => setFlowType('bulk')}
        className="fixed top-20 right-6 z-50 bg-editor-dark border border-editor-border text-crd-lightGray hover:bg-editor-border hover:text-white shadow-lg"
        size="sm"
      >
        <Upload className="w-4 h-4 mr-2" />
        Bulk Upload
      </Button>
      
      <UnifiedCardCreator />
    </div>
  );
};
