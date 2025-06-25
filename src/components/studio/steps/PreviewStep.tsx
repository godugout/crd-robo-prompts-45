
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Maximize, 
  Download, 
  Share2, 
  RotateCw, 
  Pause, 
  Play,
  Camera,
  Printer
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface PreviewStepProps {
  cardData: any;
  isPlaying: boolean;
  onToggleAnimation: () => void;
  onComplete: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  cardData,
  isPlaying,
  onToggleAnimation,
  onComplete
}) => {
  const [viewMode, setViewMode] = useState<'card' | 'scene' | 'environment'>('card');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Preview Your Card</h3>
        <p className="text-gray-400 text-sm">Review and test your card design before adding effects</p>
      </div>

      {/* View Mode Selection */}
      <div className="space-y-3">
        <label className="text-white text-sm font-medium">Preview Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'card', name: 'Card Focus', desc: 'Isolated view' },
            { id: 'scene', name: 'Scene View', desc: 'With background' },
            { id: 'environment', name: '3D Environment', desc: 'Immersive' }
          ].map((mode) => (
            <Button
              key={mode.id}
              variant={viewMode === mode.id ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode.id as any)}
              className={`h-auto p-3 flex flex-col ${
                viewMode === mode.id 
                  ? 'bg-cyan-500 text-black' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <span className="font-medium text-xs">{mode.name}</span>
              <span className="text-xs opacity-70">{mode.desc}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Preview Controls */}
      <div className="space-y-3">
        <label className="text-white text-sm font-medium">Animation Controls</label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAnimation}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'} Rotation
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>
      </div>

      {/* Card Info Display */}
      <div className="bg-black/30 rounded-lg p-4 space-y-3">
        <h4 className="text-white font-medium">Card Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Title:</span>
            <p className="text-white">{cardData.title || 'Untitled Card'}</p>
          </div>
          <div>
            <span className="text-gray-400">Rarity:</span>
            <Badge variant="outline" className="ml-2 border-white/20 text-white">
              {cardData.rarity || 'common'}
            </Badge>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400">Description:</span>
            <p className="text-white">{cardData.description || 'No description provided'}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Maximize className="w-4 h-4 mr-2" />
              Full Screen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl h-[80vh] bg-black/95 border border-white/20">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-4">Immersive Card Preview</h3>
                <div className="w-80 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl mb-4 mx-auto"></div>
                    <p className="font-bold">{cardData.title || 'Card Preview'}</p>
                    <p className="text-sm text-gray-400">{viewMode} mode</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Camera className="w-4 h-4 mr-2" />
          Screenshot
        </Button>

        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export HD
        </Button>

        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Link
        </Button>
      </div>

      {/* Quality Settings */}
      <div className="bg-black/20 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Export Settings</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Resolution:</span>
            <span className="text-white">300 DPI (Print Ready)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Format:</span>
            <span className="text-white">PNG with transparency</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Size:</span>
            <span className="text-white">2.5" × 3.5" (Trading Card)</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-4 border-t border-white/10">
        <Button 
          onClick={onComplete}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          Continue to Effects
        </Button>
      </div>
    </div>
  );
};
