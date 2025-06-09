
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Sparkles, Shapes, Upload, Zap, Download, Share2, Settings, Maximize, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { AdvancedEffectSystem } from '../effects/AdvancedEffectSystem';
import { EnhancedLayersPanel } from '../layers/EnhancedLayersPanel';
import { LightingControls } from '../lighting/LightingControls';
import { DesignTools } from '../design/DesignTools';
import { CRDCardBack } from '../branding/CRDCardBack';
import { Advanced3DCardRenderer } from '../advanced/Advanced3DCardRenderer';
import type { CardData } from '@/hooks/useCardEditor';
import type { StudioState } from '@/hooks/useStudioState';
import type { EffectLayerData } from '../hooks/useStudioEffects';

interface StudioTabContentProps {
  activeTab: string;
  currentPhoto: string;
  cardData: CardData;
  advanced3DEffects: any;
  effectLayers: EffectLayerData[];
  selectedLayerId: string;
  studioState: StudioState;
  show3DPreview: boolean;
  showCRDBack: boolean;
  isFullscreen: boolean;
  isExporting: boolean;
  setShow3DPreview: (value: boolean) => void;
  setShowCRDBack: (value: boolean) => void;
  setIsFullscreen: (value: boolean) => void;
  setShowVectorEditor: (value: boolean) => void;
  setShowExportDialog: (value: boolean) => void;
  setAdvanced3DEffects: (value: any) => void;
  onPhotoUpload: () => void;
  addEffectLayer: (type: EffectLayerData['type']) => void;
  updateEffectLayer: (layer: EffectLayerData) => void;
  removeEffectLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  setSelectedLayerId: (id: string) => void;
  updateLighting: (updates: any) => void;
  updateDesign: (updates: any) => void;
  updateLayer: (updates: any) => void;
  addLayer: (layer: any) => void;
  removeLayer: (id: string) => void;
  reorderLayers: (layers: any[]) => void;
  selectLayer: (id: string) => void;
  applyLightingPreset: (preset: string) => void;
  handleAddElement: (type: string) => void;
  handleExport: () => void;
}

export const StudioTabContent: React.FC<StudioTabContentProps> = ({
  activeTab,
  currentPhoto,
  cardData,
  advanced3DEffects,
  effectLayers,
  selectedLayerId,
  studioState,
  show3DPreview,
  showCRDBack,
  isFullscreen,
  isExporting,
  setShow3DPreview,
  setShowCRDBack,
  setIsFullscreen,
  setShowVectorEditor,
  setShowExportDialog,
  setAdvanced3DEffects,
  onPhotoUpload,
  addEffectLayer,
  updateEffectLayer,
  removeEffectLayer,
  toggleLayerVisibility,
  setSelectedLayerId,
  updateLighting,
  updateDesign,
  updateLayer,
  addLayer,
  removeLayer,
  reorderLayers,
  selectLayer,
  applyLightingPreset,
  handleAddElement,
  handleExport
}) => {
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
              <Button
                onClick={onPhotoUpload}
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
                  onClick={onPhotoUpload}
                  variant="outline"
                  className="flex-1 border-editor-border text-white hover:bg-editor-border"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
              
              <div className="text-xs text-crd-lightGray p-3 bg-editor-tool rounded">
                💡 Tip: Try the 3D View and Vector tools for advanced editing!
              </div>
            </div>
          )}
        </div>
      );

    case '3d-preview':
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-2">3D Preview Studio</h3>
            <p className="text-crd-lightGray text-sm mb-6">
              Advanced 3D rendering with WebGL effects
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setShow3DPreview(!show3DPreview)}
              className={`w-full ${show3DPreview ? 'bg-crd-green text-black' : 'bg-editor-border text-white hover:bg-crd-green hover:text-black'}`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {show3DPreview ? 'Hide 3D Preview' : 'Show 3D Preview'}
            </Button>

            {show3DPreview && (
              <div className="space-y-4">
                <div className="h-64 bg-editor-darker rounded-lg overflow-hidden">
                  <Advanced3DCardRenderer
                    cardData={cardData}
                    imageUrl={currentPhoto}
                    effects={advanced3DEffects}
                    onInteraction={(type, data) => {
                      console.log('3D interaction:', type, data);
                    }}
                  />
                </div>
                
                <Card className="bg-editor-darker border-editor-border p-4">
                  <h4 className="text-white font-semibold mb-3">3D Effects</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-crd-lightGray text-sm">Holographic</span>
                      <Button
                        size="sm"
                        variant={advanced3DEffects.holographic ? 'default' : 'outline'}
                        onClick={() => setAdvanced3DEffects(prev => ({ ...prev, holographic: !prev.holographic }))}
                        className={advanced3DEffects.holographic ? 'bg-crd-green text-black' : ''}
                      >
                        {advanced3DEffects.holographic ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-crd-lightGray text-sm">Particles</span>
                      <Button
                        size="sm"
                        variant={advanced3DEffects.particles ? 'default' : 'outline'}
                        onClick={() => setAdvanced3DEffects(prev => ({ ...prev, particles: !prev.particles }))}
                        className={advanced3DEffects.particles ? 'bg-crd-green text-black' : ''}
                      >
                        {advanced3DEffects.particles ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-crd-lightGray text-sm">Glow Effect</span>
                      <Button
                        size="sm"
                        variant={advanced3DEffects.glow ? 'default' : 'outline'}
                        onClick={() => setAdvanced3DEffects(prev => ({ ...prev, glow: !prev.glow }))}
                        className={advanced3DEffects.glow ? 'bg-crd-green text-black' : ''}
                      >
                        {advanced3DEffects.glow ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {!currentPhoto && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                <p className="text-crd-lightGray">Upload a photo first to see 3D effects</p>
              </div>
            )}
          </div>
        </div>
      );

    case 'vector':
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Vector Graphics</h3>
            <p className="text-crd-lightGray text-sm mb-6">
              Professional vector editing with advanced tools
            </p>
          </div>

          <Button
            onClick={() => setShowVectorEditor(true)}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Shapes className="w-4 h-4 mr-2" />
            Open Vector Editor
          </Button>

          <div className="space-y-3">
            <div className="text-xs text-crd-lightGray p-3 bg-editor-tool rounded">
              <div className="font-medium mb-1">Vector Features:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Shapes: Rectangle, Circle, Polygon</li>
                <li>Text editing with font controls</li>
                <li>Layer management and effects</li>
                <li>Professional export options</li>
              </ul>
            </div>
          </div>
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
      return (
        <EnhancedLayersPanel
          layers={studioState.layers}
          selectedLayerId={studioState.selectedLayerId}
          onUpdateLayer={updateLayer}
          onAddLayer={addLayer}
          onRemoveLayer={removeLayer}
          onReorderLayers={reorderLayers}
          onSelectLayer={selectLayer}
        />
      );

    case 'lighting':
      return (
        <LightingControls
          lightingState={studioState.lighting}
          onUpdateLighting={updateLighting}
          onApplyPreset={applyLightingPreset}
        />
      );

    case 'design':
      return (
        <DesignTools
          designState={studioState.design}
          onUpdateDesign={updateDesign}
          onAddElement={handleAddElement}
        />
      );

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
