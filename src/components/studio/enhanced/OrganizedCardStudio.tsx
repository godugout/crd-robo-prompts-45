
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image, Sparkles, Layers, Settings, Eye, Download, Save, Wand2 } from 'lucide-react';
import { UploadPhase } from './components/UploadPhase';
import { FrameSelectionPhase } from './components/FrameSelectionPhase';
import { EffectControlsPhase } from './components/EffectControlsPhase';
import { EnhancedStudioCardPreview } from './components/EnhancedStudioCardPreview';
import { StudioHeader } from './components/StudioHeader';
import { QuickActions } from './components/QuickActions';
import { LayerManager } from './components/LayerManager';
import { ExportDialog } from './components/ExportDialog';
import { toast } from 'sonner';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

interface BlobUrlManager {
  url: string;
  isValid: boolean;
  lastValidated: number;
  originalFile?: { name: string; size: number; type: string };
}

export const OrganizedCardStudio: React.FC = () => {
  // Core state
  const [currentPhase, setCurrentPhase] = useState<StudioPhase>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [effectValues, setEffectValues] = useState<Record<string, any>>({});
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Blob URL management
  const [blobManager, setBlobManager] = useState<BlobUrlManager | null>(null);
  const blobValidationTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Debug logging
  const logImageState = useCallback((context: string, imageUrl: string) => {
    console.log(`🔍 OrganizedCardStudio - ${context}:`, {
      imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : 'None',
      isBlobUrl: imageUrl.startsWith('blob:'),
      blobManagerExists: !!blobManager,
      blobManagerValid: blobManager?.isValid,
      currentPhase,
      timestamp: Date.now()
    });
  }, [blobManager, currentPhase]);

  // Validate blob URL health
  const validateBlobUrl = useCallback(async (url: string): Promise<boolean> => {
    if (!url.startsWith('blob:')) return true;
    
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        console.warn('🚨 Blob URL validation timeout:', url);
        resolve(false);
      }, 3000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('✅ Blob URL is valid:', url);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.warn('❌ Blob URL is invalid:', url);
        resolve(false);
      };
      
      img.src = url;
    });
  }, []);

  // Enhanced image upload handler with blob management
  const handleImageUpload = useCallback(async (imageUrl: string) => {
    console.log('🔄 OrganizedCardStudio - handleImageUpload called with:', imageUrl);
    logImageState('Before image upload', imageUrl);
    
    // Cleanup previous blob URL
    if (blobManager?.url && blobManager.url.startsWith('blob:')) {
      URL.revokeObjectURL(blobManager.url);
      console.log('🗑️ Cleaned up previous blob URL');
    }
    
    // Validate new blob URL if it's a blob
    let isValid = true;
    if (imageUrl.startsWith('blob:')) {
      isValid = await validateBlobUrl(imageUrl);
      if (!isValid) {
        console.error('🚨 Invalid blob URL provided:', imageUrl);
        toast.error('Image file is corrupted or invalid');
        return;
      }
    }
    
    // Update state
    setUploadedImage(imageUrl);
    setBlobManager({
      url: imageUrl,
      isValid,
      lastValidated: Date.now()
    });
    
    logImageState('After image upload', imageUrl);
    
    // Auto-advance to frames phase
    if (currentPhase === 'upload') {
      setCurrentPhase('frames');
      console.log('🎯 Auto-advanced to frames phase');
    }
    
    toast.success('Image uploaded successfully!');
  }, [blobManager, currentPhase, logImageState, validateBlobUrl]);

  // Periodic blob URL health check
  useEffect(() => {
    if (blobManager?.url.startsWith('blob:')) {
      blobValidationTimeoutRef.current = setTimeout(async () => {
        const isValid = await validateBlobUrl(blobManager.url);
        if (!isValid && blobManager.isValid) {
          console.warn('🚨 Blob URL became invalid, notifying user');
          setBlobManager(prev => prev ? { ...prev, isValid: false } : null);
          toast.error('Image became unavailable. Please re-upload.');
        }
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (blobValidationTimeoutRef.current) {
        clearTimeout(blobValidationTimeoutRef.current);
      }
    };
  }, [blobManager, validateBlobUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobManager?.url.startsWith('blob:')) {
        URL.revokeObjectURL(blobManager.url);
        console.log('🗑️ Cleaned up blob URL on unmount');
      }
    };
  }, [blobManager]);

  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('🖼️ Frame selected:', frameId);
    setSelectedFrame(frameId);
    toast.success('Frame applied!');
  }, []);

  const handleEffectChange = useCallback((effectId: string, value: any) => {
    console.log('✨ Effect changed:', effectId, value);
    setEffectValues(prev => ({
      ...prev,
      [effectId]: value
    }));
  }, []);

  const handlePhaseChange = useCallback((phase: StudioPhase) => {
    console.log('🔄 Phase change:', currentPhase, '->', phase);
    
    // Validate phase change requirements
    if (phase === 'frames' && !uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (phase === 'effects' && (!uploadedImage || !selectedFrame)) {
      toast.error('Please upload an image and select a frame first');
      return;
    }
    
    setCurrentPhase(phase);
    logImageState('Phase changed', uploadedImage);
  }, [currentPhase, uploadedImage, selectedFrame, logImageState]);

  const renderPhaseContent = () => {
    console.log('🔄 OrganizedCardStudio - Rendering phase content for:', currentPhase);
    
    switch (currentPhase) {
      case 'upload':
        return (
          <UploadPhase
            uploadedImage={uploadedImage}
            onImageUpload={handleImageUpload}
          />
        );
        
      case 'frames':
        return (
          <FrameSelectionPhase
            selectedFrame={selectedFrame}
            onFrameSelect={handleFrameSelect}
            uploadedImage={uploadedImage}
          />
        );
        
      case 'effects':
        return (
          <EffectControlsPhase
            effectValues={effectValues}
            onEffectChange={handleEffectChange}
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
          />
        );
        
      case 'layers':
        return (
          <LayerManager
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
            effectValues={effectValues}
          />
        );
        
      case 'export':
        return (
          <div className="p-6 text-center">
            <h3 className="text-white text-xl mb-4">Ready to Export</h3>
            <Button
              onClick={() => setShowExportDialog(true)}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Card
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Image state debugging panel (only in development)
  const renderDebugPanel = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <Card className="bg-red-900/20 border-red-500/50 mb-4">
        <CardContent className="p-3">
          <div className="text-red-400 text-xs space-y-1">
            <div>🔍 Debug - Image State:</div>
            <div>• URL: {uploadedImage ? `${uploadedImage.substring(0, 30)}...` : 'None'}</div>
            <div>• Is Blob: {uploadedImage.startsWith('blob:') ? 'Yes' : 'No'}</div>
            <div>• Blob Valid: {blobManager?.isValid ? 'Yes' : 'No'}</div>
            <div>• Last Validated: {blobManager?.lastValidated ? new Date(blobManager.lastValidated).toLocaleTimeString() : 'Never'}</div>
            <div>• Phase: {currentPhase}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-editor-dark via-black to-editor-dark">
      <StudioHeader />
      
      {renderDebugPanel()}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Phase Navigation */}
        <div className="w-16 bg-editor-dark border-r border-editor-border flex flex-col items-center py-4 space-y-4">
          {[
            { phase: 'upload' as StudioPhase, icon: Upload, label: 'Upload' },
            { phase: 'frames' as StudioPhase, icon: Image, label: 'Frames' },
            { phase: 'effects' as StudioPhase, icon: Sparkles, label: 'Effects' },
            { phase: 'layers' as StudioPhase, icon: Layers, label: 'Layers' },
            { phase: 'export' as StudioPhase, icon: Download, label: 'Export' }
          ].map(({ phase, icon: Icon, label }) => (
            <Button
              key={phase}
              variant="ghost"
              size="sm"
              onClick={() => handlePhaseChange(phase)}
              className={`w-12 h-12 p-0 rounded-lg transition-all ${
                currentPhase === phase
                  ? 'bg-crd-green text-black'
                  : 'text-white hover:bg-white/10'
              } ${
                (phase === 'frames' && !uploadedImage) ||
                (phase === 'effects' && (!uploadedImage || !selectedFrame))
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Controls Panel */}
          <div className="w-96 bg-editor-tool border-r border-editor-border overflow-y-auto">
            {renderPhaseContent()}
          </div>

          {/* 3D Preview */}
          <div className="flex-1 bg-black relative">
            <EnhancedStudioCardPreview
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              effectValues={effectValues}
              blobManager={blobManager}
            />
            
            {/* Invalid blob warning overlay */}
            {blobManager && !blobManager.isValid && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <Card className="bg-red-900/90 border-red-500">
                  <CardContent className="p-6 text-center">
                    <div className="text-red-400 mb-4">
                      <Wand2 className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold">Image Unavailable</h3>
                      <p className="text-sm">The uploaded image is no longer accessible.</p>
                    </div>
                    <Button
                      onClick={() => handlePhaseChange('upload')}
                      className="bg-crd-green hover:bg-crd-green/90 text-black"
                    >
                      Upload New Image
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-64 bg-editor-tool border-l border-editor-border">
          <QuickActions
            uploadedImage={uploadedImage}
            selectedFrame={selectedFrame}
            effectValues={effectValues}
            onExport={() => setShowExportDialog(true)}
          />
        </div>
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        cardData={{
          uploadedImage,
          selectedFrame,
          effectValues
        }}
      />
    </div>
  );
};
