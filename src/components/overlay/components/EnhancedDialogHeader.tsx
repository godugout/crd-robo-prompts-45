import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Scissors, Download, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { EnhancedDialogStep } from '../hooks/types';

interface EnhancedDialogHeaderProps {
  currentStep: EnhancedDialogStep;
  detectedRegionsCount: number;
  selectedRegionsCount: number;
  extractedCardsCount: number;
  isEditMode: boolean;
  isProcessing: boolean;
  onGoBack: () => void;
  onToggleEditMode: () => void;
  onDeleteSelected: () => void;
  onExtractCards: () => void;
  onUseCards: () => void;
}

export const EnhancedDialogHeader = ({
  currentStep,
  detectedRegionsCount,
  selectedRegionsCount,
  extractedCardsCount,
  isEditMode,
  isProcessing,
  onGoBack,
  onToggleEditMode,
  onDeleteSelected,
  onExtractCards,
  onUseCards
}: EnhancedDialogHeaderProps) => {
  const getTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Enhanced Card Detection';
      case 'detect':
        return 'Detecting Cards...';
      case 'refine':
        return `Refine Card Boundaries (${detectedRegionsCount} regions)`;
      case 'extract':
        return `Review Extracted Cards (${extractedCardsCount})`;
      default:
        return 'Enhanced Card Detection';
    }
  };

  return (
    <DialogHeader className="p-6 pb-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentStep !== 'upload' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="text-gray-300 hover:text-white p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <DialogTitle className="text-white text-xl">
            {getTitle()}
          </DialogTitle>
        </div>
        
        {currentStep === 'refine' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleEditMode}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditMode ? 'Exit Edit' : 'Edit Mode'}
            </Button>
            {isEditMode && selectedRegionsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteSelected}
                className="border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              onClick={onExtractCards}
              disabled={selectedRegionsCount === 0 || isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Extract {selectedRegionsCount} Cards
            </Button>
          </div>
        )}
        
        {currentStep === 'extract' && (
          <Button
            onClick={onUseCards}
            disabled={extractedCardsCount === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Use {extractedCardsCount} Cards
          </Button>
        )}
      </div>
    </DialogHeader>
  );
};
