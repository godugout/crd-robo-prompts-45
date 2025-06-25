import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Square, 
  Sparkles, 
  Monitor,
  ChevronLeft,
  ChevronRight,
  Check,
  Play,
  Pause,
  Save,
  Download
} from 'lucide-react';
import { WorkflowNavigation } from '../workflow/WorkflowNavigation';
import { UploadPhase } from './phases/UploadPhase';
import { FramePhase } from './phases/FramePhase';
import { EffectsPhase } from './phases/EffectsPhase';
import { StudioPhase } from './phases/StudioPhase';
import { useEnhancedStudio } from './hooks/useEnhancedStudio';
import { Enhanced3DCardViewer } from '@/components/3d/enhanced/Enhanced3DCardViewer';

const PHASE_CONFIG = [
  {
    id: 'upload',
    title: 'Upload Images',
    description: 'Add your card images and assets',
    icon: Upload,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'frame',
    title: 'Choose Frame',
    description: 'Select your card template and layout',
    icon: Square,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'effects',
    title: 'Apply Effects',
    description: 'Add premium materials and effects',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'studio',
    title: 'Final Studio',
    description: 'Fine-tune and export your creation',
    icon: Monitor,
    color: 'from-orange-500 to-red-500'
  }
];

export const OrganizedCardStudio = () => {
  const studio = useEnhancedStudio();

  const currentPhaseConfig = PHASE_CONFIG[studio.currentPhase];

  const handlePhaseComplete = () => {
    studio.completePhase(studio.currentPhase);
  };

  const renderPhaseContent = () => {
    switch (studio.currentPhase) {
      case 0:
        return (
          <UploadPhase
            uploadedImages={studio.uploadedImages}
            onImageUpload={studio.handleImageUpload}
            onComplete={handlePhaseComplete}
            fileInputRef={studio.fileInputRef}
          />
        );
      case 1:
        return (
          <FramePhase
            selectedFrame={studio.selectedFrame}
            frameData={studio.frameData}
            onFrameSelect={studio.selectFrame}
            onComplete={handlePhaseComplete}
            uploadedImages={studio.uploadedImages}
            onImageAdjust={studio.handleImageAdjust}
          />
        );
      case 2:
        return (
          <EffectsPhase
            effects={studio.effects}
            onAddEffect={studio.addEffect}
            onUpdateEffect={studio.updateEffect}
            onRemoveEffect={studio.removeEffect}
            onComplete={handlePhaseComplete}
            isPlaying={studio.isPlaying}
            onToggleAnimation={studio.toggleAnimation}
          />
        );
      case 3:
        return (
          <StudioPhase
            layers={studio.layers}
            selectedLayerId={studio.selectedLayerId}
            cardData={studio.cardData}
            onLayerSelect={studio.selectLayer}
            onLayerUpdate={studio.updateLayer}
            onLayerRemove={studio.removeLayer}
            onAddLayer={studio.addLayer}
            onExport={studio.exportCard}
            onSave={studio.saveCard}
            isPlaying={studio.isPlaying}
            onToggleAnimation={studio.toggleAnimation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentPhaseConfig.color} flex items-center justify-center`}>
                  <currentPhaseConfig.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{currentPhaseConfig.title}</h1>
                  <p className="text-sm text-gray-400">{currentPhaseConfig.description}</p>
                </div>
              </div>
            </div>
            
            {/* Phase Navigation */}
            <div className="flex items-center space-x-2">
              {PHASE_CONFIG.map((phase, index) => (
                <Button
                  key={phase.id}
                  variant={studio.currentPhase === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => studio.setCurrentPhase(index)}
                  className={`${
                    studio.currentPhase === index 
                      ? 'bg-crd-green text-black' 
                      : studio.completedPhases.has(index)
                        ? 'border-crd-green/50 text-crd-green'
                        : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                  disabled={index > 0 && !studio.completedPhases.has(index - 1) && studio.currentPhase < index}
                >
                  {studio.completedPhases.has(index) && <Check className="w-3 h-3 mr-1" />}
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Panel - Phase Content */}
          <div className="space-y-6">
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
              {renderPhaseContent()}
            </Card>
          </div>

          {/* Right Panel - Enhanced 3D Preview */}
          <div className="space-y-6">
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                      Real-time 3D
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={studio.toggleAnimation}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {studio.isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Enhanced 3D Card Viewer with Better Scaling */}
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-white/10">
                  <Enhanced3DCardViewer
                    card={studio.cardData}
                    className="w-full h-full"
                    autoEnable={true}
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => studio.saveCard()}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => studio.exportCard('png')}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>

            {/* Progress Card */}
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl p-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium">Creation Progress</h4>
                <div className="space-y-3">
                  {PHASE_CONFIG.map((phase, index) => (
                    <div key={phase.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        studio.completedPhases.has(index)
                          ? 'bg-crd-green text-black'
                          : studio.currentPhase === index
                            ? 'bg-crd-green/20 border-2 border-crd-green text-crd-green'
                            : 'bg-gray-700 text-gray-400'
                      }`}>
                        {studio.completedPhases.has(index) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          studio.completedPhases.has(index) || studio.currentPhase === index
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}>
                          {phase.title}
                        </p>
                        <p className="text-xs text-gray-500">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
