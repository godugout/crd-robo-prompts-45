
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StudioHeaderProps {
  onUndo: () => void;
  canUndo: boolean;
  autoSaveStats: {
    draftAge: number;
    saveCount: number;
    historySize: number;
    lastAction: string | null;
  };
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  onUndo,
  canUndo,
  autoSaveStats
}) => {
  return (
    <div className="h-20 bg-editor-dark border-b border-editor-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-white text-xl font-bold">Enhanced Card Studio</h1>
        
        {/* Auto-save status */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Auto-saved</span>
          {autoSaveStats.saveCount > 0 && (
            <span className="text-crd-green">({autoSaveStats.saveCount} saves)</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Undo button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="border-editor-border text-white hover:bg-white/10 disabled:opacity-30"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Undo
        </Button>

        {/* Draft info */}
        {autoSaveStats.draftAge > 0 && (
          <div className="text-xs text-gray-500">
            Draft: {formatDistanceToNow(new Date(Date.now() - autoSaveStats.draftAge), { addSuffix: true })}
          </div>
        )}
      </div>
    </div>
  );
};
