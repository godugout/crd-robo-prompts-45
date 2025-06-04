
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, RotateCcw, Check, FileImage, Users } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset } from '../types';

interface HorizontalExportControlsProps {
  card: CardData;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  activeEffectsCount: number;
  onDownload: (card: CardData) => void;
  onShare: (card: CardData) => void;
  onResetAll: () => void;
}

export const HorizontalExportControls: React.FC<HorizontalExportControlsProps> = ({
  card,
  selectedScene,
  selectedLighting,
  activeEffectsCount,
  onDownload,
  onShare,
  onResetAll
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-white text-xl font-semibold flex items-center">
          <Check className="w-5 h-5 mr-2 text-green-500" />
          Export & Save
        </h3>
        <p className="text-crd-lightGray text-sm mt-1">
          Your enhanced card is ready to save or share with the community
        </p>
      </div>

      {/* Main Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button 
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black py-4 h-auto flex flex-col items-center space-y-2"
          onClick={() => onDownload(card)}
        >
          <FileImage className="w-6 h-6" />
          <span className="font-medium">Download High Quality</span>
          <span className="text-xs opacity-75">2048x2560 • PNG with transparency</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-gray-600 text-white hover:bg-gray-700 py-4 h-auto flex flex-col items-center space-y-2"
          onClick={() => onShare(card)}
        >
          <Users className="w-6 h-6" />
          <span className="font-medium">Share with Community</span>
          <span className="text-xs opacity-75">Showcase your enhanced card</span>
        </Button>
      </div>

      {/* Settings Summary */}
      <div className="bg-editor-dark border border-editor-border rounded-lg p-6">
        <h4 className="text-white font-medium mb-4">Current Settings Summary</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-crd-lightGray block">Card</span>
            <p className="text-white font-medium">{card.title}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray block">Rarity</span>
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
            <span className="text-crd-lightGray block">Environment</span>
            <p className="text-white font-medium">{selectedScene.name}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray block">Lighting</span>
            <p className="text-white font-medium">{selectedLighting.name}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray block">Active Effects</span>
            <p className="text-white font-medium">{activeEffectsCount}</p>
          </div>
          
          <div>
            <span className="text-crd-lightGray block">Quality</span>
            <p className="text-white font-medium">Ultra High</p>
          </div>
        </div>
      </div>

      {/* Advanced Actions */}
      <div className="flex justify-center">
        <Button
          onClick={onResetAll}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All Settings
        </Button>
      </div>
    </div>
  );
};
