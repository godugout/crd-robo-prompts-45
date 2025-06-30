
import React, { useState } from 'react';
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
    <div className="min-h-screen bg-cardshow-dark">
      {/* Header with CARDSHOW Design */}
      <div className="border-b border-cardshow-dark-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="cardshow-hero-text flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-cardshow-primary" />
                Enhanced Card Creator
              </h1>
              <p className="cardshow-body-text mt-2">Professional card creation with advanced effects</p>
            </div>
            <Badge className="bg-cardshow-primary/20 text-cardshow-primary border-cardshow-primary/50 px-4 py-2 text-sm font-semibold rounded-full">
              Phase {currentPhase + 1} of {PHASES.length}
            </Badge>
          </div>

          {/* Progress Bar - CARDSHOW Style */}
          <div className="space-y-4">
            <Progress 
              value={progress} 
              className="h-3 bg-cardshow-dark-100 rounded-full overflow-hidden"
            />
            <div className="grid grid-cols-5 gap-4">
              {PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`text-center ${
                    index === currentPhase ? 'text-cardshow-primary font-semibold' :
                    completedPhases.has(index) ? 'text-cardshow-green' : 'text-cardshow-light-700'
                  }`}
                >
                  <div className="cardshow-label-text">{phase.name}</div>
                  <div className="text-xs text-cardshow-light-700 mt-1">{phase.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <Card className="cardshow-card min-h-[600px] p-8">
          {renderPhase()}
        </Card>
      </div>

      {/* Navigation - CARDSHOW Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-cardshow-dark-100 border-t border-cardshow-dark-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPhase === 0}
              className="cardshow-button-secondary bg-transparent border-cardshow-dark-100 text-cardshow-light hover:bg-cardshow-dark-100/50 px-6 py-3 rounded-full flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="cardshow-body-text">
              Step {currentPhase + 1}: {PHASES[currentPhase].name}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || currentPhase === PHASES.length - 1}
              className="cardshow-button-primary px-6 py-3 rounded-full flex items-center gap-2"
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
