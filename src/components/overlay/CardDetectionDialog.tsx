
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, ArrowLeft } from 'lucide-react';
import { useCardDetectionDialog } from './hooks/useCardDetectionDialog';
import { CardDetectionUploadStep } from './components/CardDetectionUploadStep';
import { CardDetectionReviewStep } from './components/CardDetectionReviewStep';
import { ExtractedCard } from '@/services/cardExtractor';

interface CardDetectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const CardDetectionDialog = ({ 
  isOpen, 
  onClose, 
  onCardsExtracted 
}: CardDetectionDialogProps) => {
  const {
    isProcessing,
    extractedCards,
    selectedCards,
    viewMode,
    currentStep,
    processImage,
    toggleCardSelection,
    handleUseSelected,
    resetDialog,
    goBackToUpload,
    setViewMode,
    setSelectedCards
  } = useCardDetectionDialog(onCardsExtracted);

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleUseSelectedAndClose = () => {
    handleUseSelected();
    handleClose();
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'grid' ? 'large' : 'grid');
  };

  const handleSelectAll = () => {
    setSelectedCards(new Set(extractedCards.map((_, i) => i)));
  };

  const handleClearSelection = () => {
    setSelectedCards(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-gray-900 border-gray-700">
        <DialogHeader className="p-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep === 'review' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBackToUpload}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <DialogTitle className="text-white text-xl">
                {currentStep === 'upload' 
                  ? 'Card Detection & Extraction' 
                  : `Review Detected Cards (${extractedCards.length})`
                }
              </DialogTitle>
            </div>
            {currentStep === 'review' && (
              <Button
                onClick={handleUseSelectedAndClose}
                disabled={selectedCards.size === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Use {selectedCards.size} Cards
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentStep === 'upload' ? (
            <CardDetectionUploadStep 
              isProcessing={isProcessing}
              onImageDrop={processImage}
            />
          ) : (
            <CardDetectionReviewStep
              extractedCards={extractedCards}
              selectedCards={selectedCards}
              viewMode={viewMode}
              onCardToggle={toggleCardSelection}
              onViewModeToggle={handleViewModeToggle}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
