
import React, { useState } from 'react';
import { UploadAndPreviewStep } from './components/UploadAndPreviewStep';
import { ReviewAndMarkStep } from './components/ReviewAndMarkStep';
import { AdjustAndFinalizeStep } from './components/AdjustAndFinalizeStep';
import { StepIndicator } from './components/StepIndicator';
import type { FramedImage, UploadWorkflowState } from './types/bulkUploadTypes';

export const BulkUploadWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [workflowState, setWorkflowState] = useState<UploadWorkflowState>({
    uploadedImages: [],
    framedImages: [],
    approvedImages: [],
    imagesToEdit: [],
    processedImages: []
  });

  const handleImagesUploaded = (framedImages: FramedImage[]) => {
    setWorkflowState(prev => ({
      ...prev,
      framedImages,
      uploadedImages: framedImages.map(img => img.originalFile)
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
      // If no images need editing, we can finish
      handleWorkflowComplete([...approved]);
    }
  };

  const handleAdjustmentsComplete = (adjustedImages: FramedImage[]) => {
    const allProcessedImages = [...workflowState.approvedImages, ...adjustedImages];
    handleWorkflowComplete(allProcessedImages);
  };

  const handleWorkflowComplete = (processedImages: FramedImage[]) => {
    setWorkflowState(prev => ({
      ...prev,
      processedImages
    }));
    
    // Here you would typically save the cards to the database
    console.log('Workflow complete! Processed images:', processedImages);
    
    // Reset for next batch
    setCurrentStep(1);
    setWorkflowState({
      uploadedImages: [],
      framedImages: [],
      approvedImages: [],
      imagesToEdit: [],
      processedImages: []
    });
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setWorkflowState({
      uploadedImages: [],
      framedImages: [],
      approvedImages: [],
      imagesToEdit: [],
      processedImages: []
    });
  };

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

      {/* Reset Button (available on all steps except step 1) */}
      {currentStep > 1 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={resetWorkflow}
            className="px-4 py-2 text-sm text-crd-lightGray hover:text-white border border-crd-mediumGray hover:border-crd-lightGray rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};
