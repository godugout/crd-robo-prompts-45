
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Palette, Sparkles, Eye, Download, Save, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Live3DPreview } from '@/components/studio/Live3DPreview';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { EffectsPhase } from './components/EffectsPhase';
import { useEnhancedStudio } from './hooks/useEnhancedStudio';

const STUDIO_PHASES = [
  { id: 'upload', title: 'Upload', icon: Upload, description: 'Add your card images' },
  { id: 'frame', title: 'Frame', icon: Palette, description: 'Choose frame style' },
  { id: 'effects', title: 'Effects', icon: Sparkles, description: 'Add visual effects' },
  { id: 'preview', title: 'Preview', icon: Eye, description: 'Final review' }
];

export const OrganizedCardStudio: React.FC = () => {
  const {
    currentPhase,
    setCurrentPhase,
    completedPhases,
    uploadedImages,
    selectedFrame,
    effects,
    effectValues,
    cardData,
    handleImageUpload,
    selectFrame,
    completePhase,
    updateEffect,
    saveCard,
    exportCard
  } = useEnhancedStudio();

  const [show3DPreview, setShow3DPreview] = useState(true);

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    updateEffect(effectId, { parameters: { [parameterId]: value } });
  }, [updateEffect]);

  const handlePhaseNavigation = (phaseIndex: number) => {
    if (phaseIndex <= currentPhase || completedPhases.has(phaseIndex)) {
      setCurrentPhase(phaseIndex);
    }
  };

  const handleNextPhase = () => {
    if (currentPhase < STUDIO_PHASES.length - 1) {
      completePhase(currentPhase);
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentPhase) {
      case 0: return uploadedImages.length > 0;
      case 1: return selectedFrame !== null;
      case 2: return true; // Effects are optional
      case 3: return true; // Preview phase
      default: return false;
    }
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 0: // Upload Phase
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Upload Your Images</h2>
              <p className="text-gray-400">Start by uploading the main image for your card</p>
            </div>
            <EnhancedUploadZone
              onImageUpload={(files) => handleImageUpload(files)}
              uploadedImage={uploadedImages.length > 0 ? URL.createObjectURL(uploadedImages[0]) : undefined}
            />
          </div>
        );

      case 1: // Frame Phase
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Choose Your Frame</h2>
              <p className="text-gray-400">Select a frame style that matches your vision</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['classic', 'modern', 'vintage', 'holographic'].map((frameId) => (
                <Card
                  key={frameId}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedFrame === frameId
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => selectFrame(frameId)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-2" />
                  <div className="text-center">
                    <h3 className="text-white font-medium capitalize">{frameId}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2: // Effects Phase
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Add Effects</h2>
              <p className="text-gray-400">Enhance your card with visual effects</p>
            </div>
            <EffectsPhase
              selectedFrame={selectedFrame || undefined}
              onEffectChange={handleEffectChange}
              effectValues={effectValues}
            />
          </div>
        );

      case 3: // Preview Phase
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Final Preview</h2>
              <p className="text-gray-400">Review your card and make final adjustments</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-medium mb-3">Card Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Images:</span>
                    <span className="text-white">{uploadedImages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Frame:</span>
                    <span className="text-white capitalize">{selectedFrame || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Effects:</span>
                    <span className="text-white">
                      {Object.entries(effectValues).filter(([_, effect]) => {
                        if (typeof effect === 'object' && effect !== null) {
                          return typeof effect.intensity === 'number' && effect.intensity > 0;
                        }
                        return false;
                      }).length}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-medium mb-3">Export Options</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={() => exportCard('png')}
                    className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as PNG
                  </Button>
                  <Button 
                    onClick={() => saveCard()}
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save to Gallery
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Card Studio</h1>
            <p className="text-gray-400">Create professional trading cards with advanced 3D effects</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShow3DPreview(!show3DPreview)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              {show3DPreview ? 'Hide' : 'Show'} 3D Preview
            </Button>
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {STUDIO_PHASES.map((phase, index) => (
              <React.Fragment key={phase.id}>
                <div
                  className={`flex items-center space-x-2 cursor-pointer transition-all ${
                    index === currentPhase
                      ? 'text-crd-green'
                      : completedPhases.has(index)
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                  onClick={() => handlePhaseNavigation(index)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      index === currentPhase
                        ? 'bg-crd-green text-black'
                        : completedPhases.has(index)
                        ? 'bg-white text-black'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {completedPhases.has(index) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <phase.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium">{phase.title}</div>
                    <div className="text-xs text-gray-400">{phase.description}</div>
                  </div>
                </div>
                {index < STUDIO_PHASES.length - 1 && (
                  <div className="w-12 h-px bg-gray-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phase Content */}
          <div className="space-y-6">
            {renderPhaseContent()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevPhase}
                disabled={currentPhase === 0}
                className="border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Badge variant="secondary" className="bg-gray-700 text-white">
                Step {currentPhase + 1} of {STUDIO_PHASES.length}
              </Badge>
              
              <Button
                onClick={handleNextPhase}
                disabled={!canProceedToNext() || currentPhase === STUDIO_PHASES.length - 1}
                className="bg-crd-green hover:bg-crd-green/90 text-black disabled:opacity-50"
              >
                {currentPhase === STUDIO_PHASES.length - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* 3D Preview */}
          {show3DPreview && (
            <div className="lg:sticky lg:top-6">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Live Preview</h3>
                  <Badge variant="outline" className="border-crd-green text-crd-green">
                    3D Interactive
                  </Badge>
                </div>
                
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Live3DPreview
                    frontImage={uploadedImages.length > 0 ? URL.createObjectURL(uploadedImages[0]) : undefined}
                    selectedFrame={selectedFrame || undefined}
                    effects={effectValues}
                    cardData={cardData}
                    className="w-full h-full"
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
