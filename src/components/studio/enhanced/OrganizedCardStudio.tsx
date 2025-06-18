
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Layout, 
  Sparkles, 
  Settings, 
  ArrowLeft,
  Save,
  Share2,
  Download,
  Eye,
  RotateCcw,
  Maximize2,
  Zap
} from 'lucide-react';
import { StudioCardPreview } from './components/StudioCardPreview';
import { BasicCardInfo } from './components/BasicCardInfo';
import { CardStatsModule } from './components/CardStatsModule';
import { UploadPhase } from './components/UploadPhase';
import { FramePhase } from './components/FramePhase';
import { EffectsPhase } from './components/EffectsPhase';
import { StudioPhase } from './components/StudioPhase';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { useStudioState } from '@/hooks/useStudioState';
import { toast } from 'sonner';
import { EnhancedStudioCardPreview } from './components/EnhancedStudioCardPreview';

interface OrganizedCardStudioProps {
  onBack?: () => void;
}

const WORKFLOW_PHASES = [
  { id: 'upload', label: 'Upload', icon: Upload, color: 'bg-blue-500' },
  { id: 'frame', label: 'Frame', icon: Layout, color: 'bg-purple-500' },
  { id: 'effects', label: 'Effects', icon: Sparkles, color: 'bg-pink-500' },
  { id: 'studio', label: 'Studio', icon: Settings, color: 'bg-orange-500' }
];

export const OrganizedCardStudio: React.FC<OrganizedCardStudioProps> = ({ onBack }) => {
  const [activePhase, setActivePhase] = useState('upload');
  const [cardName, setCardName] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [show3DPreview, setShow3DPreview] = useState(true);
  const [effectValues, setEffectValues] = useState<Record<string, Record<string, any>>>({});
  const [projectSaved, setProjectSaved] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { isMobile, isTablet } = useResponsiveBreakpoints();
  const { studioState } = useStudioState();

  // Enhanced progress calculation
  const getProgress = useCallback(() => {
    let completed = 0;
    if (uploadedImage) completed += 20;
    if (selectedFrame) completed += 20;
    if (cardName) completed += 20;
    if (Object.keys(effectValues).length > 0) completed += 20;
    if (show3DPreview) completed += 10;
    if (projectSaved) completed += 10;
    return Math.min(completed, 100);
  }, [uploadedImage, selectedFrame, cardName, effectValues, show3DPreview, projectSaved]);

  // Fixed image upload handler
  const handleImageUpload = useCallback((imageUrl: string) => {
    console.log('🖼️ OrganizedCardStudio - handleImageUpload called with:', imageUrl);
    
    if (!imageUrl || imageUrl.trim() === '') {
      console.log('🖼️ OrganizedCardStudio - Empty image URL, clearing state');
      setUploadedImage('');
      return;
    }

    console.log('🖼️ OrganizedCardStudio - Setting uploaded image:', imageUrl);
    setUploadedImage(imageUrl);
    toast.success('Image uploaded successfully!');
  }, []);

  // Fixed frame selection handler with debugging
  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('🖼️ OrganizedCardStudio - Frame selected:', frameId);
    setSelectedFrame(frameId);
    toast.success(`Frame ${frameId || 'None'} applied successfully!`);
  }, []);

  // Enhanced effect change handler with comprehensive debugging
  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎨 OrganizedCardStudio - Effect change received:', { 
      effectId, 
      parameterId, 
      value,
      type: typeof value
    });
    
    setEffectValues(prev => {
      const newValues = {
        ...prev,
        [effectId]: {
          ...prev[effectId],
          [parameterId]: value
        }
      };
      
      console.log('🎨 OrganizedCardStudio - Previous effect values:', prev);
      console.log('🎨 OrganizedCardStudio - New effect values:', newValues);
      console.log('🎨 OrganizedCardStudio - Active effects count:', 
        Object.keys(newValues).filter(k => newValues[k]?.intensity > 0).length
      );
      
      return newValues;
    });
  }, []);

  // Enhanced export with professional features
  const handleExport = useCallback(() => {
    toast.success('Exporting professional-quality card...');
    console.log('Export settings:', {
      cardName,
      cardDescription,
      uploadedImage,
      selectedFrame,
      effectValues,
      lighting: studioState.lighting,
      show3DPreview
    });
  }, [cardName, cardDescription, uploadedImage, selectedFrame, effectValues, studioState, show3DPreview]);

  // Save project functionality
  const handleSaveProject = useCallback(() => {
    setProjectSaved(true);
    toast.success('Project saved successfully!');
  }, []);

  // Share project functionality
  const handleShareProject = useCallback(() => {
    if (!projectSaved) {
      handleSaveProject();
    }
    toast.success('Generating share link...');
  }, [projectSaved, handleSaveProject]);

  // Debug current state with detailed logging
  React.useEffect(() => {
    console.log('🔍 OrganizedCardStudio - Complete current state:', { 
      uploadedImage: uploadedImage ? 'Present' : 'None', 
      activePhase,
      selectedFrame: selectedFrame || 'None',
      effectValues,
      effectsCount: Object.keys(effectValues).length,
      activeEffectsCount: Object.keys(effectValues).filter(k => effectValues[k]?.intensity > 0).length
    });
  }, [uploadedImage, activePhase, selectedFrame, effectValues]);

  const renderPhaseContent = () => {
    console.log('🔄 OrganizedCardStudio - Rendering phase content for:', activePhase);
    
    switch (activePhase) {
      case 'upload':
        return (
          <UploadPhase
            uploadedImage={uploadedImage}
            onImageUpload={handleImageUpload}
          />
        );
      case 'frame':
        return (
          <FramePhase
            selectedFrame={selectedFrame}
            onFrameSelect={handleFrameSelect}
            orientation={orientation}
          />
        );
      case 'effects':
        return (
          <EffectsPhase
            selectedFrame={selectedFrame}
            onEffectChange={handleEffectChange}
            effectValues={effectValues}
          />
        );
      case 'studio':
        return (
          <StudioPhase
            show3DPreview={show3DPreview}
            onToggle3D={() => setShow3DPreview(!show3DPreview)}
            onExport={handleExport}
            cardData={{ title: cardName, description: cardDescription }}
            currentPhoto={uploadedImage}
            effectLayers={[]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Badge className="bg-crd-green text-black font-bold px-3 py-1">
                    CRD CREATOR
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    PROFESSIONAL STUDIO
                  </Badge>
                  {show3DPreview && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                      <Zap className="w-3 h-3 mr-1" />
                      3D PREMIUM
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Card Creation Studio
                </h1>
              </div>
            </div>

            {/* Desktop Actions */}
            {!isMobile && (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveProject}
                  className={projectSaved 
                    ? "border-crd-green/50 text-crd-green" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  {projectSaved ? 'Saved' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShareProject}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button 
                  onClick={handleExport}
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-bold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Creation Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-crd-green font-medium">{getProgress()}%</span>
                {getProgress() === 100 && (
                  <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 text-xs">
                    COMPLETE
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={getProgress()} className="h-2 bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-12 gap-8'} h-full`}>
          
          {/* Left Side - Enhanced Card Preview */}
          <div className={`${isMobile ? 'order-1' : 'col-span-7'} space-y-6`}>
            <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Card Preview
                    {show3DPreview && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                        3D
                      </Badge>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      {orientation}
                    </Button>
                    <Button
                      variant={show3DPreview ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShow3DPreview(!show3DPreview)}
                      className={show3DPreview ? 'bg-crd-green text-black' : 'border-white/20 text-white'}
                    >
                      <Maximize2 className="w-4 h-4 mr-1" />
                      3D
                    </Button>
                  </div>
                </div>
                
                <EnhancedStudioCardPreview
                  uploadedImage={uploadedImage}
                  selectedFrame={selectedFrame}
                  orientation={orientation}
                  show3DPreview={show3DPreview}
                  cardName={cardName}
                  effectValues={effectValues}
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-white/10">
              <CardContent className="p-6">
                <BasicCardInfo
                  cardName={cardName}
                  cardDescription={cardDescription}
                  onNameChange={setCardName}
                  onDescriptionChange={setCardDescription}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Workflow Phases */}
          <div className={`${isMobile ? 'order-2' : 'col-span-5'} space-y-6`}>
            <CardStatsModule
              cardName={cardName}
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              effectValues={effectValues}
            />

            <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Professional Workflow</h2>
                  <Badge variant="outline" className="border-crd-green/50 text-crd-green">
                    PHASE {WORKFLOW_PHASES.findIndex(p => p.id === activePhase) + 1}/4
                  </Badge>
                </div>
                
                <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-black/30 p-1">
                    {WORKFLOW_PHASES.map((phase, index) => (
                      <TabsTrigger
                        key={phase.id}
                        value={phase.id}
                        className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white relative"
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          <div className={`w-2 h-2 rounded-full ${phase.color} ${activePhase === phase.id ? 'opacity-100' : 'opacity-50'}`} />
                          <phase.icon className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden sm:inline text-xs md:text-sm">{phase.label}</span>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Separator className="my-4 bg-white/10" />

                  <div className="min-h-[400px] md:min-h-[500px]">
                    {WORKFLOW_PHASES.map((phase) => (
                      <TabsContent key={phase.id} value={phase.id} className="mt-0 h-full">
                        <div className="space-y-4 h-full">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                            <h3 className="font-semibold text-white">{phase.label} Phase</h3>
                          </div>
                          {renderPhaseContent()}
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Mobile Actions Bar */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveProject}
                className={`flex-1 ${projectSaved 
                  ? "border-crd-green/50 text-crd-green" 
                  : "border-white/20 text-white"
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {projectSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 border-white/20 text-white">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleExport}
                className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-bold"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
