
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageUploadZone } from './ImageUploadZone';
import { CardAnalysisSection } from './CardAnalysisSection';
import { CardDetailsForm } from './CardDetailsForm';
import { ImageCropEditor } from './ImageCropEditor';
import { ArrowLeft, ArrowRight, Sparkles, Image, Edit3 } from 'lucide-react';
import type { CardMetadata } from '@/services/cardAnalyzer/CardMetadataAnalyzer';

type CreationStep = 'upload' | 'crop' | 'analyze' | 'details';

interface CardFormData {
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  rarity: string;
  tags: string[];
  sports_metadata: CardMetadata;
}

export const EnhancedCardCreator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CreationStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [cardData, setCardData] = useState<CardFormData>({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    rarity: 'common',
    tags: [],
    sports_metadata: {}
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (file: File) => {
    setIsProcessing(true);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setOriginalImage(imageUrl);
    setCardData(prev => ({ ...prev, image_url: imageUrl, thumbnail_url: imageUrl }));
    setIsProcessing(false);
    setCurrentStep('crop');
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setUploadedImage(croppedImageUrl);
    setCardData(prev => ({ ...prev, image_url: croppedImageUrl, thumbnail_url: croppedImageUrl }));
    setCurrentStep('analyze');
  };

  const handleCropCancel = () => {
    setCurrentStep('upload');
  };

  const handleMetadataExtracted = (metadata: CardMetadata) => {
    setCardData(prev => ({
      ...prev,
      sports_metadata: metadata,
      title: metadata.player || prev.title,
      description: `${metadata.year || ''} ${metadata.brand || ''} ${metadata.series || ''}`.trim() || prev.description
    }));
    setCurrentStep('details');
  };

  const handleSkipAnalysis = () => {
    setCurrentStep('details');
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
    setUploadedImage('');
    setOriginalImage('');
    setCardData({
      title: '',
      description: '',
      image_url: '',
      thumbnail_url: '',
      rarity: 'common',
      tags: [],
      sports_metadata: {}
    });
  };

  const handleBackToCrop = () => {
    setCurrentStep('crop');
  };

  const handleBackToAnalysis = () => {
    setCurrentStep('analyze');
  };

  const steps = [
    { id: 'upload', name: 'Upload Image', icon: Image },
    { id: 'crop', name: 'Crop & Edit', icon: Edit3 },
    { id: 'analyze', name: 'AI Analysis', icon: Sparkles },
    { id: 'details', name: 'Card Details', icon: Edit3 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Enhanced Card Creator</h1>
          <p className="text-gray-400">Create professional trading cards with AI-powered analysis</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                    ${isActive 
                      ? 'bg-crd-green border-crd-green text-black' 
                      : isCompleted 
                      ? 'bg-crd-green/20 border-crd-green text-crd-green' 
                      : 'bg-gray-800 border-gray-600 text-gray-400'
                    }
                  `}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-4 ${
                      index < currentStepIndex ? 'bg-crd-green' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-gray-800/50 border-gray-600 min-h-[600px]">
          {currentStep === 'upload' && (
            <div className="p-8">
              <ImageUploadZone
                onImageUpload={handleImageUpload}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {currentStep === 'crop' && uploadedImage && (
            <ImageCropEditor
              imageUrl={originalImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
              aspectRatio={2.5 / 3.5}
            />
          )}

          {currentStep === 'analyze' && uploadedImage && (
            <div className="p-8">
              <CardAnalysisSection
                onMetadataExtracted={handleMetadataExtracted}
                existingImageUrl={uploadedImage}
              />
              
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleSkipAnalysis}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Skip Analysis & Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'details' && (
            <div className="p-8">
              <CardDetailsForm
                initialData={cardData}
                onSubmit={(data) => {
                  console.log('Card created:', data);
                  // Handle card creation
                }}
                previewImage={uploadedImage}
              />
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => {
              if (currentStep === 'crop') handleBackToUpload();
              else if (currentStep === 'analyze') handleBackToCrop();
              else if (currentStep === 'details') handleBackToAnalysis();
            }}
            variant="outline"
            className="border-gray-600 text-gray-300"
            disabled={currentStep === 'upload'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={() => {
              if (currentStep === 'upload' && uploadedImage) setCurrentStep('crop');
              else if (currentStep === 'crop') setCurrentStep('analyze');
              else if (currentStep === 'analyze') setCurrentStep('details');
            }}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            disabled={!uploadedImage || currentStep === 'details'}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
