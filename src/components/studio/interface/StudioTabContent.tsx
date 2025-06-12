
import React from 'react';
import { Camera, Upload, Box, Sparkles, Sun, Download, Layers, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioCardDetector } from '../detection/StudioCardDetector';

interface StudioTabContentProps {
  activeTab: string;
  currentPhoto: string;
  cardData: any;
  advanced3DEffects: any;
  effectLayers: any[];
  selectedLayerId: string | null;
  studioState: any;
  show3DPreview: boolean;
  showCRDBack: boolean;
  isFullscreen: boolean;
  isExporting: boolean;
  setShow3DPreview: (show: boolean) => void;
  setShowCRDBack: (show: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShowVectorEditor: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setAdvanced3DEffects: (effects: any) => void;
  onPhotoUpload: () => void;
  addEffectLayer: (layer: any) => void;
  updateEffectLayer: (id: string, updates: any) => void;
  removeEffectLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  setSelectedLayerId: (id: string | null) => void;
  updateLighting: (updates: any) => void;
  updateDesign: (updates: any) => void;
  updateLayer: (updates: any) => void;
  addLayer: (layer: any) => void;
  removeLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  selectLayer: (id: string | null) => void;
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
  const handleCardSelect = (cardBlob: Blob, bounds: any) => {
    const cardUrl = URL.createObjectURL(cardBlob);
    // This would update the Studio's current photo with the extracted card
    // You may need to implement a callback to update the parent's currentPhoto state
    console.log('Card selected for Studio:', { cardUrl, bounds });
  };

  switch (activeTab) {
    case 'photo':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Photo Upload
            </h3>
            
            {!currentPhoto ? (
              <div className="text-center">
                <div className="border-2 border-dashed border-crd-green/50 rounded-lg p-8 mb-4">
                  <Camera className="w-12 h-12 text-crd-green mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">Upload a photo to get started</p>
                  <Button 
                    onClick={onPhotoUpload}
                    className="bg-crd-green text-black hover:bg-crd-green/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Current Photo</span>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={onPhotoUpload}
                    className="text-white border-white/20"
                  >
                    Change Photo
                  </Button>
                </div>

                {/* Card Detection Component */}
                <div className="border border-editor-border rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Smart Card Detection</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Automatically detect and extract cards (2.5×3.5 aspect ratio) from your photo
                  </p>
                  <StudioCardDetector
                    imageUrl={currentPhoto}
                    onCardSelect={handleCardSelect}
                    onDetectionComplete={(cards) => {
                      console.log('Detection complete:', cards.length, 'cards found');
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case '3d-preview':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Box className="w-4 h-4 mr-2" />
              3D Preview Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">3D Preview</span>
                <Button
                  size="sm"
                  variant={show3DPreview ? "default" : "outline"}
                  onClick={() => setShow3DPreview(!show3DPreview)}
                  className={show3DPreview ? "bg-crd-green text-black" : "text-white border-white/20"}
                >
                  {show3DPreview ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Show CRD Back</span>
                <Button
                  size="sm"
                  variant={showCRDBack ? "default" : "outline"}
                  onClick={() => setShowCRDBack(!showCRDBack)}
                  className={showCRDBack ? "bg-crd-green text-black" : "text-white border-white/20"}
                >
                  {showCRDBack ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Fullscreen Mode</span>
                <Button
                  size="sm"
                  variant={isFullscreen ? "default" : "outline"}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={isFullscreen ? "bg-crd-green text-black" : "text-white border-white/20"}
                >
                  {isFullscreen ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'effects':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Visual Effects
            </h3>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleAddElement('holographic')}
                className="w-full bg-crd-purple text-white hover:bg-crd-purple/90"
              >
                Add Holographic Effect
              </Button>
              
              <Button
                onClick={() => handleAddElement('chrome')}
                className="w-full bg-gray-600 text-white hover:bg-gray-700"
              >
                Add Chrome Effect
              </Button>
              
              <Button
                onClick={() => handleAddElement('glow')}
                className="w-full bg-crd-green text-black hover:bg-crd-green/90"
              >
                Add Glow Effect
              </Button>
            </div>
          </div>
        </div>
      );

    case 'lighting':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Sun className="w-4 h-4 mr-2" />
              Lighting Settings
            </h3>
            
            <div className="space-y-4">
              <Button
                onClick={() => applyLightingPreset('studio')}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Studio Lighting
              </Button>
              
              <Button
                onClick={() => applyLightingPreset('dramatic')}
                className="w-full bg-red-600 text-white hover:bg-red-700"
              >
                Dramatic Lighting
              </Button>
              
              <Button
                onClick={() => applyLightingPreset('soft')}
                className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Soft Lighting
              </Button>
            </div>
          </div>
        </div>
      );

    case 'export':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Options
            </h3>
            
            <div className="space-y-4">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-crd-green text-black hover:bg-crd-green/90"
              >
                {isExporting ? 'Exporting...' : 'Export High-Quality Image'}
              </Button>
              
              <Button
                onClick={() => setShowExportDialog(true)}
                className="w-full bg-crd-purple text-white hover:bg-crd-purple/90"
              >
                Advanced Export Options
              </Button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center text-gray-400 py-8">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a tab to customize your card</p>
        </div>
      );
  }
};
