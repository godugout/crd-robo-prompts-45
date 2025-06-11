
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, RotateCcw, Check } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset } from '../types';
import { getEnvironmentSceneName, getLightingPresetName } from '../types';

interface ExportSaveStepProps {
  card: CardData;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  selectedPresetName?: string;
  activeEffectsCount: number;
  onDownload: (card: CardData) => void;
  onShare: (card: CardData) => void;
  onResetAll: () => void;
  onBack: () => void;
}

export const ExportSaveStep: React.FC<ExportSaveStepProps> = ({
  card,
  selectedScene,
  selectedLighting,
  selectedPresetName,
  activeEffectsCount,
  onDownload,
  onShare,
  onResetAll,
  onBack
}) => {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-semibold flex items-center justify-center">
          <Check className="w-5 h-5 mr-2 text-crd-green" />
          Save & Export
        </h3>
        <p className="text-crd-lightGray text-sm">
          Your enhanced card is ready to save or share
        </p>
      </div>

      {/* Settings Summary */}
      <div className="bg-editor-dark border border-editor-border rounded-lg p-4 space-y-3">
        <h4 className="text-white font-medium mb-3">Current Settings Summary</h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-crd-lightGray">Card:</span>
            <p className="text-white font-medium">{card.title}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray">Rarity:</span>
            <p className={`font-medium capitalize ${
              card.rarity === 'legendary' ? 'text-yellow-400' :
              card.rarity === 'epic' ? 'text-purple-400' :
              card.rarity === 'rare' ? 'text-blue-400' :
              card.rarity === 'uncommon' ? 'text-green-400' :
              'text-gray-300'
            }`}>
              {card.rarity || 'Common'}
            </p>
          </div>
          
          <div>
            <span className="text-crd-lightGray">Effect Style:</span>
            <p className="text-white font-medium">{selectedPresetName || 'Custom'}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray">Environment:</span>
            <p className="text-white font-medium">{getEnvironmentSceneName(selectedScene)}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray">Lighting:</span>
            <p className="text-white font-medium">{getLightingPresetName(selectedLighting)}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray">Active Effects:</span>
            <p className="text-white font-medium">{activeEffectsCount}</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Export Options</h4>
        
        <div className="grid grid-cols-1 gap-3">
          <Button 
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black py-3 flex items-center justify-center"
            onClick={() => onDownload(card)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download High Quality Image
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-white hover:bg-gray-700 py-3 flex items-center justify-center"
            onClick={() => onShare(card)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share with Community
          </Button>
        </div>
      </div>

      {/* Quality Settings Info */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <h5 className="text-blue-400 font-medium text-sm mb-1">Export Quality</h5>
        <p className="text-blue-300 text-xs">
          High resolution (2048x2560) with full effect rendering and transparency support
        </p>
      </div>

      {/* Advanced Actions */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Advanced Actions</h4>
        
        <Button
          onClick={onResetAll}
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All Settings
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex space-x-3 pt-4 border-t border-editor-border">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-editor-border text-white hover:bg-gray-700"
        >
          Back to Environment
        </Button>
        <Button
          onClick={() => onDownload(card)}
          className="flex-1 bg-crd-green text-black hover:bg-crd-green/90"
        >
          Download Now
        </Button>
      </div>
    </div>
  );
};
