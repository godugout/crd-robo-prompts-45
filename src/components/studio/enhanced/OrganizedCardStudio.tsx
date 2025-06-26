
import React, { useState, useCallback } from 'react';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { Live3DPreview } from '../Live3DPreview';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  Palette, 
  Frame, 
  Wand2,
  Save,
  Share2,
  Download,
  Eye
} from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

export const OrganizedCardStudio = () => {
  const cardEditor = useCardEditor();
  const [currentStep, setCurrentStep] = useState<'upload' | 'frames' | 'effects' | 'finalize'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [effects, setEffects] = useState({
    holographic: 0,
    metallic: 0,
    chrome: 0,
    particles: false
  });

  const handleImageUpload = useCallback((imageUrl: string) => {
    console.log('OrganizedCardStudio: Image uploaded:', imageUrl);
    setUploadedImage(imageUrl);
    cardEditor.updateCardField('image_url', imageUrl);
    cardEditor.updateCardField('thumbnail_url', imageUrl);
    
    // Auto-advance to frames step if image is uploaded
    if (imageUrl && currentStep === 'upload') {
      setCurrentStep('frames');
      toast.success('Image uploaded! Choose a frame style.');
    }
  }, [cardEditor, currentStep]);

  const handleFrameSelect = useCallback((frameId: string) => {
    setSelectedFrame(frameId);
    cardEditor.updateCardField('template_id', frameId);
    toast.success(`Frame "${frameId}" selected!`);
  }, [cardEditor]);

  const handleEffectChange = useCallback((effectType: keyof typeof effects, value: number | boolean) => {
    setEffects(prev => ({
      ...prev,
      [effectType]: value
    }));
    
    // Update card editor with effect metadata
    cardEditor.updateCardField('design_metadata', {
      ...cardEditor.cardData.design_metadata,
      effects: {
        ...effects,
        [effectType]: value
      }
    });
  }, [cardEditor, effects]);

  const handleSave = useCallback(async () => {
    try {
      await cardEditor.saveCard();
      toast.success('Card saved successfully!');
    } catch (error) {
      toast.error('Failed to save card');
    }
  }, [cardEditor]);

  const steps = [
    { id: 'upload', label: 'Upload', icon: Eye, description: 'Add your image' },
    { id: 'frames', label: 'Frames', icon: Frame, description: 'Choose frame style' },
    { id: 'effects', label: 'Effects', icon: Sparkles, description: 'Add visual effects' },
    { id: 'finalize', label: 'Finalize', icon: Wand2, description: 'Review & publish' }
  ];

  const frameOptions = [
    { id: 'classic', name: 'Classic', preview: '#8b5cf6' },
    { id: 'modern', name: 'Modern', preview: '#06b6d4' },
    { id: 'vintage', name: 'Vintage', preview: '#f59e0b' },
    { id: 'holographic', name: 'Holographic', preview: '#ec4899' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Card Studio</h1>
          
          {/* Step Navigation */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <Button
                    variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentStep(step.id as any)}
                    className={`flex items-center gap-2 ${
                      isActive 
                        ? 'bg-crd-green text-black' 
                        : isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {step.label}
                  </Button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-white/20"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {currentStep === 'upload' && (
              <Card className="bg-black/20 border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Upload Your Image</h2>
                <EnhancedUploadZone
                  onImageUpload={handleImageUpload}
                  uploadedImage={uploadedImage}
                  cardEditor={cardEditor}
                />
              </Card>
            )}

            {currentStep === 'frames' && (
              <Card className="bg-black/20 border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Choose Frame Style</h2>
                <div className="grid grid-cols-2 gap-3">
                  {frameOptions.map((frame) => (
                    <Button
                      key={frame.id}
                      variant={selectedFrame === frame.id ? "default" : "outline"}
                      onClick={() => handleFrameSelect(frame.id)}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        selectedFrame === frame.id
                          ? 'bg-crd-green text-black'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: frame.preview }}
                      />
                      <span className="text-sm font-medium">{frame.name}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {currentStep === 'effects' && (
              <Card className="bg-black/20 border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Visual Effects</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">
                      Holographic Effect: {Math.round(effects.holographic * 100)}%
                    </label>
                    <Slider
                      value={[effects.holographic]}
                      onValueChange={([value]) => handleEffectChange('holographic', value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">
                      Metallic Effect: {Math.round(effects.metallic * 100)}%
                    </label>
                    <Slider
                      value={[effects.metallic]}
                      onValueChange={([value]) => handleEffectChange('metallic', value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">
                      Chrome Effect: {Math.round(effects.chrome * 100)}%
                    </label>
                    <Slider
                      value={[effects.chrome]}
                      onValueChange={([value]) => handleEffectChange('chrome', value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-medium">Particle Effects</label>
                    <Button
                      variant={effects.particles ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEffectChange('particles', !effects.particles)}
                      className={
                        effects.particles
                          ? 'bg-crd-green text-black'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }
                    >
                      {effects.particles ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 'finalize' && (
              <Card className="bg-black/20 border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Finalize Your Card</h2>
                <div className="space-y-4">
                  <div className="text-white">
                    <h3 className="font-medium mb-2">Card Summary</h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>Title: {cardEditor.cardData.title || 'Untitled Card'}</div>
                      <div>Frame: {selectedFrame || 'None'}</div>
                      <div>Effects: {Object.entries(effects).filter(([_, value]) => value > 0 || value === true).length} active</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Card
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Live 3D Preview */}
          <div className="lg:sticky lg:top-6">
            <Card className="bg-black/20 border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Live Preview</h2>
                <Badge variant="outline" className="border-crd-green text-crd-green">
                  Real-time 3D
                </Badge>
              </div>
              
              <div className="aspect-square">
                <Live3DPreview
                  frontImage={uploadedImage}
                  selectedFrame={selectedFrame}
                  effects={effects}
                  cardData={cardEditor.cardData}
                  className="w-full h-full"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
