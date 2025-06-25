
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Maximize, 
  Eye, 
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface PreviewControlsProps {
  isPlaying: boolean;
  previewMode: 'design' | 'preview' | 'vr';
  onToggleAnimation: () => void;
  onModeChange: (mode: 'design' | 'preview' | 'vr') => void;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  isPlaying,
  previewMode,
  onToggleAnimation,
  onModeChange
}) => {
  return (
    <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md p-3 rounded-xl z-10 border border-white/20">
      <div className="flex items-center space-x-3">
        {/* Animation Controls */}
        <div className="flex items-center space-x-1">
          <Button
            onClick={onToggleAnimation}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview Mode */}
        <div className="flex items-center space-x-1 bg-black/40 rounded-lg p-1">
          <Button
            onClick={() => onModeChange('design')}
            variant={previewMode === 'design' ? "default" : "ghost"}
            size="sm"
            className={previewMode === 'design' ? "bg-cyan-500 text-black" : "text-white hover:bg-white/10"}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onModeChange('preview')}
            variant={previewMode === 'preview' ? "default" : "ghost"}
            size="sm"
            className={previewMode === 'preview' ? "bg-cyan-500 text-black" : "text-white hover:bg-white/10"}
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>

        {/* Device Preview */}
        <div className="flex items-center space-x-1 bg-black/40 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>

        {/* Status */}
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
          Live Preview
        </Badge>
      </div>
    </div>
  );
};
