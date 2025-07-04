
import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Settings, Palette, Zap, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickComboPresets } from './QuickComboPresets';
import { MobileStudioDrawer } from './MobileStudioDrawer';
import { CardDetailsSection } from '@/components/cards/components/CardDetailsSection';
import { useMobileControl } from '../context/MobileControlContext';
import { cn } from '@/lib/utils';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface EnhancedMobileStudioPanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  card: any;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
  // Card details props
  cardDetails?: {
    id: string;
    title: string;
    description?: string;
    rarity: string;
    creator_name?: string;
    creator_verified?: boolean;
    price?: string;
    created_at: string;
    tags?: string[];
    view_count?: number;
    like_count?: number;
  };
  onLike?: () => void;
  onBookmark?: () => void;
}

export const EnhancedMobileStudioPanel: React.FC<EnhancedMobileStudioPanelProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  card,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false,
  cardDetails,
  onLike,
  onBookmark
}) => {
  const { panelState, closePanel, activePanel } = useMobileControl();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isVisible = panelState.studio;

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePanel();
    }
  };

  // Handle swipe down to close
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Only allow downward swipes to close
      if (deltaY > 0 && panelRef.current) {
        const opacity = Math.max(0.3, 1 - deltaY / 200);
        panelRef.current.style.transform = `translateY(${deltaY}px)`;
        panelRef.current.style.opacity = opacity.toString();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const deltaY = currentY - startY;
      if (deltaY > 100) { // Close if swiped down more than 100px
        closePanel();
      } else if (panelRef.current) {
        // Reset position
        panelRef.current.style.transform = 'translateY(0)';
        panelRef.current.style.opacity = '1';
      }
    };

    const panel = panelRef.current;
    if (panel && isVisible) {
      panel.addEventListener('touchstart', handleTouchStart);
      panel.addEventListener('touchmove', handleTouchMove);
      panel.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        panel.removeEventListener('touchstart', handleTouchStart);
        panel.removeEventListener('touchmove', handleTouchMove);
        panel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isVisible, closePanel]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Studio Panel */}
      <div 
        ref={panelRef}
        className={cn(
          "fixed bottom-20 left-0 right-0 z-50",
          "bg-black/95 backdrop-blur-lg border-t border-white/10 rounded-t-xl",
          "transform transition-all duration-250 ease-out",
          "pb-safe-area-inset-bottom max-h-[70vh] overflow-hidden"
        )}
        style={{
          animation: 'slideUp 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Quick Styles Section - Always Visible */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium text-sm flex items-center">
              <Zap className="w-4 h-4 text-crd-green mr-2" />
              Quick Styles
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={closePanel}
              className="text-white hover:bg-white/10"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Horizontal Scrollable Presets */}
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2" style={{ width: 'max-content' }}>
              <QuickComboPresets
                onApplyCombo={onApplyCombo}
                currentEffects={effectValues}
                selectedPresetId={selectedPresetId}
                onPresetSelect={onPresetSelect}
                isApplyingPreset={isApplyingPreset}
              />
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAdvanced(!showAdvanced);
                setShowDetails(false);
              }}
              className={cn(
                "text-white text-xs hover:bg-white/10 flex-col h-auto py-2",
                showAdvanced && "bg-crd-green/20 text-crd-green"
              )}
            >
              <Settings className="w-4 h-4 mb-1" />
              Studio
            </Button>
            
            {cardDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDetails(!showDetails);
                  setShowAdvanced(false);
                }}
                className={cn(
                  "text-white text-xs hover:bg-white/10 flex-col h-auto py-2",
                  showDetails && "bg-crd-green/20 text-crd-green"
                )}
              >
                <Info className="w-4 h-4 mb-1" />
                Details
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white text-xs hover:bg-white/10 flex-col h-auto py-2"
            >
              <Palette className="w-4 h-4 mb-1" />
              Themes
            </Button>
          </div>
        </div>

        {/* Expandable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Card Details Section */}
          {showDetails && cardDetails && (
            <div className="p-4">
              <CardDetailsSection
                card={cardDetails}
                onShare={onShare}
                onDownload={onDownload}
                onLike={onLike}
                onBookmark={onBookmark}
              />
            </div>
          )}

          {/* Advanced Studio Drawer */}
          <MobileStudioDrawer
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            effectValues={effectValues}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            materialSettings={materialSettings}
            isFullscreen={isFullscreen}
            onSceneChange={onSceneChange}
            onLightingChange={onLightingChange}
            onEffectChange={onEffectChange}
            onResetAllEffects={onResetAllEffects}
            onBrightnessChange={onBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
            onMaterialSettingsChange={onMaterialSettingsChange}
            onToggleFullscreen={onToggleFullscreen}
            onDownload={onDownload}
            onShare={onShare}
            card={card}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            onApplyCombo={onApplyCombo}
            isApplyingPreset={isApplyingPreset}
            isOpen={showAdvanced}
            onOpenChange={setShowAdvanced}
          />
        </div>

        {/* Swipe Indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};
