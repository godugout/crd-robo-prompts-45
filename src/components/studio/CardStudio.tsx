import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Layers, 
  Lightbulb, 
  Palette, 
  Download, 
  Share2, 
  Eye,
  Settings,
  Maximize,
  ArrowLeft,
  Save,
  Upload,
  Zap,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { AdvancedImageProcessor } from './image/AdvancedImageProcessor';
import { EffectLayer, EffectLayerData } from './effects/EffectLayer';
import { DynamicTemplateRenderer } from '@/components/editor/canvas/DynamicTemplateRenderer';
import { ExportCardRenderer } from '@/components/editor/canvas/ExportCardRenderer';
import { DEFAULT_TEMPLATES } from '@/components/editor/wizard/wizardConfig';
import { ProfessionalToolbar } from './interface/ProfessionalToolbar';
import { AdvancedEffectSystem } from './effects/AdvancedEffectSystem';
import { CRDCardBack } from './branding/CRDCardBack';
import { EnhancedExportDialog } from './export/EnhancedExportDialog';
import { StudioLayout } from './interface/StudioLayout';
import { LightingControls } from './lighting/LightingControls';
import { DesignTools } from './design/DesignTools';
import { EnhancedLayersPanel } from './layers/EnhancedLayersPanel';

interface StudioTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'creation' | 'effects' | 'presentation';
}

const STUDIO_TABS: StudioTab[] = [
  { id: 'photo', label: 'Photo', icon: Camera, category: 'creation' },
  { id: 'effects', label: 'Effects', icon: Sparkles, category: 'effects' },
  { id: 'layers', label: 'Layers', icon: Layers, category: 'effects' },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb, category: 'effects' },
  { id: 'design', label: 'Design', icon: Palette, category: 'creation' },
  { id: 'branding', label: 'CRD Back', icon: Zap, category: 'creation' },
  { id: 'preview', label: 'Preview', icon: Eye, category: 'presentation' }
];

export const CardStudio: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('photo');
  const [showImageProcessor, setShowImageProcessor] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES[0]);
  const [effectLayers, setEffectLayers] = useState<EffectLayerData[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCRDBack, setShowCRDBack] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Studio Project');
  const exportRef = useRef<HTMLDivElement>(null);

  const cardEditor = useCardEditor({
    initialData: {
      title: 'My Studio Card',
      rarity: 'rare',
      tags: ['studio', 'professional'],
      design_metadata: selectedTemplate.template_data,
      template_id: selectedTemplate.id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentPhoto(url);
      cardEditor.updateCardField('image_url', url);
      setActiveTab('effects');
    }
  };

  const handleImageProcessed = (processedUrl: string) => {
    setCurrentPhoto(processedUrl);
    cardEditor.updateCardField('image_url', processedUrl);
    setShowImageProcessor(false);
    toast.success('Image processing complete!');
  };

  const addEffectLayer = (type: EffectLayerData['type']) => {
    const newLayer: EffectLayerData = {
      id: `layer-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Effect`,
      type,
      opacity: 100,
      blendMode: 'normal',
      visible: true,
      parameters: {
        intensity: 50,
        spread: 30,
        shimmer: 40,
        depth: 25
      }
    };
    setEffectLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateEffectLayer = (updatedLayer: EffectLayerData) => {
    setEffectLayers(prev => prev.map(layer => 
      layer.id === updatedLayer.id ? updatedLayer : layer
    ));
  };

  const removeEffectLayer = (layerId: string) => {
    setEffectLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId('');
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    setEffectLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const handleSaveProject = () => {
    // Save current state to localStorage or database
    const projectData = {
      name: projectName,
      cardData: cardEditor.cardData,
      currentPhoto,
      effectLayers,
      template: selectedTemplate,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`studio-project-${Date.now()}`, JSON.stringify(projectData));
    toast.success('Project saved successfully!');
  };

  const handleExport = async () => {
    if (!exportRef.current) {
      toast.error('Export renderer not ready');
      return;
    }
    
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: 'transparent',
        scale: 2,
        useCORS: true,
        width: 750,
        height: 1050,
        windowWidth: 750,
        windowHeight: 1050
      });
      
      const link = document.createElement('a');
      link.download = `${cardEditor.cardData.title.replace(/\s+/g, '_')}_studio_card_hd.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('🎉 Studio card exported in HD!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'photo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg mb-2">Photo Studio</h3>
              <p className="text-crd-lightGray text-sm mb-6">
                Upload and enhance your card image with professional tools
              </p>
            </div>

            {!currentPhoto ? (
              <div className="border-2 border-dashed border-editor-border rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                <p className="text-white mb-4">No photo selected</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-editor-darker rounded-lg overflow-hidden">
                  <img 
                    src={currentPhoto} 
                    alt="Card preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowImageProcessor(true)}
                    variant="outline"
                    className="flex-1 border-editor-border text-white hover:bg-editor-border"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Image
                  </Button>
                  <Button
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    variant="outline"
                    className="border-editor-border text-white hover:bg-editor-border"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'effects':
        return (
          <AdvancedEffectSystem
            effectLayers={effectLayers}
            selectedLayerId={selectedLayerId}
            onAddLayer={addEffectLayer}
            onUpdateLayer={updateEffectLayer}
            onRemoveLayer={removeEffectLayer}
            onSelectLayer={setSelectedLayerId}
            onToggleVisibility={toggleLayerVisibility}
          />
        );

      case 'layers':
        return <EnhancedLayersPanel />;

      case 'lighting':
        return <LightingControls />;

      case 'design':
        return <DesignTools />;

      case 'branding':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg mb-2">CRD Card Back</h3>
              <p className="text-crd-lightGray text-sm mb-6">
                Professional CRD branding for your card back
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setShowCRDBack(!showCRDBack)}
                className={`w-full ${showCRDBack ? 'bg-crd-green text-black' : 'bg-editor-border text-white hover:bg-crd-green hover:text-black'}`}
              >
                <Zap className="w-4 h-4 mr-2" />
                {showCRDBack ? 'Hide CRD Back' : 'Show CRD Back'}
              </Button>

              {showCRDBack && (
                <div className="aspect-[3/4] bg-editor-darker rounded-lg overflow-hidden">
                  <CRDCardBack />
                </div>
              )}

              <div className="text-xs text-crd-lightGray p-3 bg-editor-tool rounded">
                The CRD card back features the official logo and branding elements. 
                This will be automatically included when exporting double-sided cards.
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg mb-2">Studio Preview</h3>
              <p className="text-crd-lightGray text-sm mb-6">
                Professional preview and export tools
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="outline"
                className="w-full border-editor-border text-white hover:bg-editor-border"
              >
                <Maximize className="w-4 h-4 mr-2" />
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export HD'}
                </Button>
                <Button
                  onClick={() => setShowExportDialog(true)}
                  variant="outline"
                  className="border-crd-purple text-crd-purple hover:bg-crd-purple hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced
                </Button>
              </div>

              <Button
                onClick={() => toast.success('Share feature coming soon!')}
                variant="outline"
                className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Project
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-crd-lightGray py-8">
            <p>Feature coming soon...</p>
          </div>
        );
    }
  };

  const templateForRenderer = {
    id: selectedTemplate.id,
    name: selectedTemplate.name,
    template_data: selectedTemplate.template_data
  };

  return (
    <StudioLayout>
      {/* Professional Header with Toolbar */}
      <ProfessionalToolbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSave={handleSaveProject}
        onExport={() => setShowExportDialog(true)}
        onShare={() => toast.success('Share feature coming soon!')}
        onBack={() => navigate('/cards')}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Enhanced Sidebar */}
        <div className="w-80 bg-editor-dark border-r border-editor-border overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full">
            <TabsList className="grid grid-cols-1 h-auto bg-transparent p-2 gap-1">
              {STUDIO_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="w-full justify-start data-[state=active]:bg-crd-green data-[state=active]:text-black text-white hover:bg-editor-border transition-colors"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.category === 'effects' && effectLayers.length > 0 && (
                    <span className="ml-auto text-xs bg-crd-purple text-white px-1.5 py-0.5 rounded-full">
                      {effectLayers.filter(l => l.visible).length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-4 border-t border-editor-border">
              {STUDIO_TABS.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  {renderTabContent()}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        {/* Enhanced Main Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-editor-darker via-black to-editor-darker relative">
          {/* Card Preview Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-crd-green/20 via-transparent to-crd-purple/20 blur-3xl"></div>
            <div className="relative z-10">
              <DynamicTemplateRenderer
                template={templateForRenderer}
                cardData={cardEditor.cardData}
                currentPhoto={currentPhoto}
                scaleFactor={1.3}
                onPhotoUpload={() => document.getElementById('photo-upload')?.click()}
                onElementSelect={() => {}}
              />
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <Button
              onClick={() => setShowCRDBack(!showCRDBack)}
              className={`w-12 h-12 rounded-full ${showCRDBack ? 'bg-crd-green text-black' : 'bg-editor-dark text-white border border-editor-border'}`}
            >
              <Zap className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-12 h-12 rounded-full bg-editor-dark text-white border border-editor-border hover:bg-editor-border"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showImageProcessor && currentPhoto && (
        <AdvancedImageProcessor
          imageUrl={currentPhoto}
          onImageProcessed={handleImageProcessed}
          onClose={() => setShowImageProcessor(false)}
        />
      )}

      {showExportDialog && (
        <EnhancedExportDialog
          cardData={cardEditor.cardData}
          currentPhoto={currentPhoto}
          effectLayers={effectLayers}
          showCRDBack={showCRDBack}
          onClose={() => setShowExportDialog(false)}
          onExport={handleExport}
        />
      )}

      {/* Hidden Export Renderer */}
      <div ref={exportRef} className="absolute -left-[9999px] -top-[9999px] pointer-events-none">
        <ExportCardRenderer
          template={templateForRenderer}
          cardData={cardEditor.cardData}
          currentPhoto={currentPhoto}
          dimensions={{ width: 750, height: 1050 }}
        />
      </div>
    </StudioLayout>
  );
};
