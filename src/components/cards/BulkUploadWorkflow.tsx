
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UploadAndPreviewStep } from './components/UploadAndPreviewStep';
import { ReviewAndMarkStep } from './components/ReviewAndMarkStep';
import { AdjustAndFinalizeStep } from './components/AdjustAndFinalizeStep';
import { CollectionSelectionPhase } from './components/CollectionSelectionPhase';
import { StepIndicator } from './components/StepIndicator';
import { bulkCardSaver } from '@/services/cardSaving/bulkCardSaver';
import type { FramedImage, UploadWorkflowState, ExtractedCard } from './types/bulkUploadTypes';

type WorkflowStep = 1 | 2 | 3 | 4 | 5;

interface ExtendedWorkflowState extends UploadWorkflowState {
  selectedCollectionId?: string;
  savedCards: any[];
  isSaving: boolean;
}

export const BulkUploadWorkflow: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);
  const [workflowState, setWorkflowState] = useState<ExtendedWorkflowState>({
    uploadedImages: [],
    framedImages: [],
    approvedImages: [],
    imagesToEdit: [],
    processedImages: [],
    savedCards: [],
    isSaving: false
  });

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error('Please sign in to upload cards');
      // In a real app, you'd redirect to auth page here
    }
  }, [user]);

  const handleImagesUploaded = (framedImages: FramedImage[]) => {
    // Ensure each framed image has an imageUrl (using the preview for now)
    const imagesWithUrl = framedImages.map(img => ({
      ...img,
      imageUrl: img.preview
    }));
    
    setWorkflowState(prev => ({
      ...prev,
      framedImages: imagesWithUrl,
      uploadedImages: imagesWithUrl.map(img => img.originalFile)
    }));
    setCurrentStep(2);
  };

  const handleReviewComplete = (approved: FramedImage[], needsEdit: FramedImage[]) => {
    setWorkflowState(prev => ({
      ...prev,
      approvedImages: approved,
      imagesToEdit: needsEdit
    }));
    
    if (needsEdit.length > 0) {
      setCurrentStep(3);
    } else {
      // Skip adjustment step and go to collection selection
      setWorkflowState(prev => ({
        ...prev,
        processedImages: approved
      }));
      setCurrentStep(4);
    }
  };

  const handleAdjustmentsComplete = (adjustedImages: FramedImage[]) => {
    const allProcessedImages = [...workflowState.approvedImages, ...adjustedImages];
    setWorkflowState(prev => ({
      ...prev,
      processedImages: allProcessedImages
    }));
    setCurrentStep(4); // Go to collection selection
  };

  // Helper function to convert FramedImage to ExtractedCard (synchronous version for props)
  const convertToExtractedCard = (framedImage: FramedImage): ExtractedCard => {
    return {
      id: framedImage.id,
      name: framedImage.originalFile.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      description: 'Extracted from bulk upload',
      rarity: 'common' as const,
      tags: ['bulk-upload'],
      confidence: 0.95,
      sourceImageName: framedImage.originalFile.name,
      imageUrl: framedImage.imageUrl,
      imageBlob: new Blob() // Placeholder blob, will be created during save
    };
  };

  const handleCollectionSelected = async (collectionId: string) => {
    if (!user) {
      toast.error('Please sign in to save cards');
      return;
    }

    setWorkflowState(prev => ({ ...prev, isSaving: true, selectedCollectionId: collectionId }));

    const saveToast = toast.loading('Saving your cards...', {
      description: `Processing ${workflowState.processedImages.length} cards`
    });

    try {
      const result = await bulkCardSaver.saveFramedImages(
        workflowState.processedImages,
        collectionId,
        user.id
      );

      toast.dismiss(saveToast);

      if (result.success) {
        setWorkflowState(prev => ({
          ...prev,
          savedCards: result.savedCards,
          isSaving: false
        }));
        setCurrentStep(5); // Success step

        toast.success(`🎉 Successfully saved ${result.savedCards.length} cards!`, {
          description: result.errors.length > 0 
            ? `${result.errors.length} cards failed to save`
            : 'All cards saved to your collection'
        });

        // Show any errors
        if (result.errors.length > 0) {
          console.warn('Some cards failed to save:', result.errors);
        }
      } else {
        throw new Error(`Failed to save cards: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('💥 Card saving failed:', error);
      toast.dismiss(saveToast);
      toast.error('Failed to save cards', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      setWorkflowState(prev => ({ ...prev, isSaving: false }));
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WorkflowStep);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setWorkflowState({
      uploadedImages: [],
      framedImages: [],
      approvedImages: [],
      imagesToEdit: [],
      processedImages: [],
      savedCards: [],
      isSaving: false
    });
  };

  const startNewSession = () => {
    resetWorkflow();
    toast.success('Started new upload session');
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-4">Authentication Required</h3>
        <p className="text-crd-lightGray mb-6">Please sign in to upload and save cards.</p>
        {/* In a real app, add sign-in button/link here */}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Step Content */}
      {currentStep === 1 && (
        <UploadAndPreviewStep
          onImagesUploaded={handleImagesUploaded}
          existingImages={workflowState.framedImages}
        />
      )}

      {currentStep === 2 && (
        <ReviewAndMarkStep
          framedImages={workflowState.framedImages}
          onReviewComplete={handleReviewComplete}
          onGoBack={goBack}
        />
      )}

      {currentStep === 3 && (
        <AdjustAndFinalizeStep
          imagesToEdit={workflowState.imagesToEdit}
          onAdjustmentsComplete={handleAdjustmentsComplete}
          onGoBack={goBack}
        />
      )}

      {currentStep === 4 && (
        <CollectionSelectionPhase
          extractedCards={workflowState.processedImages.map(img => convertToExtractedCard(img))}
          onCollectionSelected={handleCollectionSelected}
          onGoBack={goBack}
        />
      )}

      {currentStep === 5 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Cards Saved Successfully!</h3>
          <p className="text-crd-lightGray max-w-lg mx-auto mb-8">
            {workflowState.savedCards.length} cards have been added to your collection and are ready to view.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={startNewSession}
              className="px-6 py-3 bg-crd-green hover:bg-crd-green/90 text-black font-medium rounded-lg transition-colors"
            >
              Upload More Cards
            </button>
            <button
              onClick={() => {
                if (workflowState.selectedCollectionId) {
                  window.location.href = `/collection/${workflowState.selectedCollectionId}`;
                } else {
                  window.location.href = '/gallery';
                }
              }}
              className="px-6 py-3 border border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-crd-lightGray rounded-lg transition-colors"
            >
              View Collection
            </button>
          </div>
        </div>
      )}

      {/* Reset Button (available on steps 2-4) */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={resetWorkflow}
            disabled={workflowState.isSaving}
            className="px-4 py-2 text-sm text-crd-lightGray hover:text-white border border-crd-mediumGray hover:border-crd-lightGray rounded-lg transition-colors disabled:opacity-50"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};
