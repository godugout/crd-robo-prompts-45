
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CRDButton, Typography } from '@/components/ui/design-system';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import type { CardRarity } from '@/types/card';
import { MinimalistFrameCarousel } from '@/components/editor/frames/MinimalistFrameCarousel';

const RARITIES: { value: CardRarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

type Step = 'frameAndImage' | 'customize' | 'polish' | 'preview';

export const EmbeddedCardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cardData, updateField, saveCard, isSaving } = useSimpleCardEditor();
  const [step, setStep] = useState<Step>('frameAndImage');
  const [selectedFrame, setSelectedFrame] = useState<string>('');

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
    updateField('template_id', frameId);
  };

  const handleImageUpload = (imageUrl: string) => {
    updateField('image_url', imageUrl);
  };

  const handleContinueInStudio = () => {
    localStorage.setItem('draft-card', JSON.stringify({
      ...cardData,
      selectedFrame,
    }));
    navigate('/cards/create');
    toast.success('Opening card in studio...');
  };

  const handleQuickPublish = async () => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      navigate('/auth');
      return;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }

    const saved = await saveCard();
    if (saved) {
      toast.success('Card created successfully!');
      // Reset to first step
      setStep('frameAndImage');
      updateField('title', '');
      updateField('description', '');
      updateField('image_url', '');
      updateField('rarity', 'common');
      setSelectedFrame('');
    }
  };

  const canContinue = () => {
    switch (step) {
      case 'frameAndImage':
        return selectedFrame && cardData.image_url;
      case 'customize':
        return cardData.title.trim().length > 0;
      case 'polish':
        return true;
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'frameAndImage':
        return 'Choose Frame & Upload Image';
      case 'customize':
        return 'Customize Your Card';
      case 'polish':
        return 'Add Finishing Touches';
      case 'preview':
        return 'Preview & Publish';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'frameAndImage':
        return 'Select a frame style and upload your image to get started';
      case 'customize':
        return 'Add your card title, description, and set the rarity';
      case 'polish':
        return 'Fine-tune your card with effects and adjustments';
      case 'preview':
        return 'Review your card and publish when ready';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'frameAndImage':
        return (
          <div className="space-y-8">
            <MinimalistFrameCarousel
              selectedFrame={selectedFrame}
              uploadedImage={cardData.image_url}
              onFrameSelect={handleFrameSelect}
              onImageUpload={handleImageUpload}
            />
          </div>
        );

      case 'customize':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Card Title *
              </label>
              <Input
                value={cardData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter your card title"
                className="bg-[#353945] border-crd-mediumGray text-crd-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Description
              </label>
              <Textarea
                value={cardData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your card..."
                rows={3}
                className="bg-[#353945] border-crd-mediumGray text-crd-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Rarity
              </label>
              <Select 
                value={cardData.rarity} 
                onValueChange={(value) => updateField('rarity', value as CardRarity)}
              >
                <SelectTrigger className="bg-[#353945] border-crd-mediumGray text-crd-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RARITIES.map((rarity) => (
                    <SelectItem key={rarity.value} value={rarity.value}>
                      <span className={rarity.color}>{rarity.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'polish':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <Typography variant="h3" className="mb-4">
                Add Some Magic
              </Typography>
              <Typography variant="body" className="text-crd-lightGray">
                Your card looks great! You can add effects or adjustments here, or continue to preview.
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#353945] rounded-lg border border-crd-mediumGray">
                <Wand2 className="w-8 h-8 mx-auto mb-2 text-crd-green" />
                <h4 className="text-white font-medium mb-1">Quick Effects</h4>
                <p className="text-crd-lightGray text-sm">Add instant visual polish</p>
              </div>
              
              <div className="p-4 bg-[#353945] rounded-lg border border-crd-mediumGray">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-crd-green" />
                <h4 className="text-white font-medium mb-1">Fine Adjustments</h4>
                <p className="text-crd-lightGray text-sm">Perfect positioning & colors</p>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="text-center space-y-8">
            <div>
              <Typography variant="h3" className="mb-2">
                Your Card is Ready!
              </Typography>
              <Typography variant="body" className="text-crd-lightGray">
                You can publish it now or continue editing in our full studio
              </Typography>
            </div>

            {/* Card Preview - Using the selected frame and data */}
            <div className="flex justify-center">
              <div className="relative w-80 h-[28rem] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                {cardData.image_url && (
                  <img 
                    src={cardData.image_url} 
                    alt={cardData.title} 
                    className="w-full h-3/4 object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-white font-bold text-xl mb-1">{cardData.title}</h3>
                  {cardData.description && (
                    <p className="text-gray-200 text-sm mb-2">{cardData.description}</p>
                  )}
                  <span className={`text-sm font-medium ${RARITIES.find(r => r.value === cardData.rarity)?.color}`}>
                    {RARITIES.find(r => r.value === cardData.rarity)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <CRDButton
                onClick={handleQuickPublish}
                disabled={isSaving}
              >
                {isSaving ? 'Publishing...' : 'Publish Now'}
              </CRDButton>
              <CRDButton
                variant="secondary"
                onClick={handleContinueInStudio}
                className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue in Studio
              </CRDButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#141416] py-20 px-4 md:px-8 lg:px-[352px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography as="h2" variant="h1" className="mb-4">
            Create Your Card in 4 Easy Steps
          </Typography>
          <Typography variant="body" className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            {getStepDescription()}
          </Typography>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {(['frameAndImage', 'customize', 'polish', 'preview'] as const).map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === stepName 
                    ? 'bg-crd-green text-black' 
                    : index < (['frameAndImage', 'customize', 'polish', 'preview'] as const).indexOf(step)
                    ? 'bg-crd-green text-black'
                    : 'bg-crd-mediumGray text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-1 mx-2 transition-colors ${
                    index < (['frameAndImage', 'customize', 'polish', 'preview'] as const).indexOf(step) 
                      ? 'bg-crd-green' 
                      : 'bg-crd-mediumGray'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[#23262F] rounded-2xl p-8 min-h-[500px]">
          <div className="mb-8 text-center">
            <Typography variant="h2" className="mb-2">
              {getStepTitle()}
            </Typography>
          </div>
          
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <CRDButton
            variant="secondary"
            onClick={() => {
              const steps: Step[] = ['frameAndImage', 'customize', 'polish', 'preview'];
              const currentIndex = steps.indexOf(step);
              if (currentIndex > 0) {
                setStep(steps[currentIndex - 1]);
              }
            }}
            disabled={step === 'frameAndImage'}
          >
            Previous
          </CRDButton>

          <CRDButton
            onClick={() => {
              const steps: Step[] = ['frameAndImage', 'customize', 'polish', 'preview'];
              const currentIndex = steps.indexOf(step);
              if (currentIndex < steps.length - 1) {
                setStep(steps[currentIndex + 1]);
              }
            }}
            disabled={!canContinue() || step === 'preview'}
          >
            {step === 'preview' ? 'Complete' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </CRDButton>
        </div>
      </div>
    </div>
  );
};
