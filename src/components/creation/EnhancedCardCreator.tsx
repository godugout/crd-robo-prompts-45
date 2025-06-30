
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { FrameGalleryPhase } from './phases/FrameGalleryPhase';
import { ImageUploadPhase } from './phases/ImageUploadPhase';
import { EffectsMaterialsPhase } from './phases/EffectsMaterialsPhase';
import { ShowcaseSelectionPhase } from './phases/ShowcaseSelectionPhase';
import { ExportPublishPhase } from './phases/ExportPublishPhase';
import { useEnhancedCardCreation } from '@/hooks/useEnhancedCardCreation';

const PHASES = [
  { id: 'frames', name: 'Frame Gallery', description: 'Choose your card\'s foundation' },
  { id: 'image', name: 'Image Upload', description: 'Add your photo or artwork' },
  { id: 'effects', name: 'Effects & Materials', description: 'Apply professional effects' },
  { id: 'showcase', name: '3D Showcase', description: 'Select presentation environment' },
  { id: 'export', name: 'Export & Publish', description: 'Finalize your creation' }
];

export const EnhancedCardCreator: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  
  const {
    selectedFrame,
    uploadedImage,
    selectedEffects,
    selectedShowcase,
    cardData,
    selectFrame,
    uploadImage,
    updateEffects,
    selectShowcase,
    exportCard
  } = useEnhancedCardCreation();

  const canProceed = () => {
    switch (currentPhase) {
      case 0: return !!selectedFrame;
      case 1: return !!uploadedImage;
      case 2: return selectedEffects.length > 0;
      case 3: return !!selectedShowcase;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentPhase < PHASES.length - 1) {
      setCompletedPhases(prev => new Set([...prev, currentPhase]));
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 0:
        return (
          <FrameGalleryPhase
            selectedFrame={selectedFrame}
            onFrameSelect={selectFrame}
          />
        );
      case 1:
        return (
          <ImageUploadPhase
            selectedFrame={selectedFrame}
            uploadedImage={uploadedImage}
            onImageUpload={uploadImage}
          />
        );
      case 2:
        return (
          <EffectsMaterialsPhase
            selectedFrame={selectedFrame}
            uploadedImage={uploadedImage}
            selectedEffects={selectedEffects}
            onEffectsUpdate={updateEffects}
          />
        );
      case 3:
        return (
          <ShowcaseSelectionPhase
            cardData={cardData}
            selectedShowcase={selectedShowcase}
            onShowcaseSelect={selectShowcase}
          />
        );
      case 4:
        return (
          <ExportPublishPhase
            cardData={cardData}
            onExport={exportCard}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentPhase + 1) / PHASES.length) * 100;

  return (
    <div className="min-h-screen theme-bg-primary">
      {/* Header */}
      <div className="border-b theme-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold theme-text-primary flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-crd-green" />
                Enhanced Card Creator
              </h1>
              <p className="theme-text-muted text-sm">Professional card creation with advanced effects</p>
            </div>
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50">
              Phase {currentPhase + 1} of {PHASES.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs theme-text-muted">
              {PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`flex flex-col items-center ${
                    index === currentPhase ? 'text-crd-green font-medium' :
                    completedPhases.has(index) ? 'text-green-400' : ''
                  }`}
                >
                  <span>{phase.name}</span>
                  <span className="text-xs opacity-70">{phase.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card className="theme-bg-secondary theme-border min-h-[600px]">
          {renderPhase()}
        </Card>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 theme-bg-secondary border-t theme-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPhase === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm theme-text-muted">
              Step {currentPhase + 1}: {PHASES[currentPhase].name}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || currentPhase === PHASES.length - 1}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-medium flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
