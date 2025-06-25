
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Undo, 
  Redo, 
  Save, 
  Share2, 
  Download, 
  Eye, 
  Settings,
  Zap,
  Sparkles
} from 'lucide-react';

interface StudioToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* History Controls */}
      <div className="flex items-center space-x-1 bg-black/30 rounded-lg p-1">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 disabled:opacity-50"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Tools */}
      <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:bg-purple-500/20"
        >
          <Zap className="w-4 h-4 mr-1" />
          AI Enhance
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-pink-300 hover:bg-pink-500/20"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Auto Style
        </Button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-1 bg-black/30 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Save Button */}
      <Button
        onClick={onSave}
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-80 text-white"
      >
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
    </div>
  );
};
