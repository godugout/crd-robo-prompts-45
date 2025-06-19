
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { autoSaveService } from '@/services/autosave/AutoSaveService';

interface StudioMainHeaderProps {
  currentPhase: string;
  onUndo: () => void;
}

export const StudioMainHeader: React.FC<StudioMainHeaderProps> = ({
  currentPhase,
  onUndo
}) => {
  const autoSaveStats = autoSaveService.getStats();

  return (
    <div className="border-b border-editor-border bg-editor-dark/50 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl font-bold">Enhanced Card Studio</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Phase: {currentPhase}</span>
            {autoSaveStats.saveCount > 0 && (
              <>
                <span>•</span>
                <span>Saves: {autoSaveStats.saveCount}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!autoSaveService.canUndo()}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo
          </Button>
        </div>
      </div>
    </div>
  );
};
