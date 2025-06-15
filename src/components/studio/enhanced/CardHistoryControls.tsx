
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Undo, Redo } from 'lucide-react';

interface CardHistoryControlsProps {
  onAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  creationMode: 'mystical' | 'electric' | 'chaos';
  setCreationMode: (mode: 'mystical' | 'electric' | 'chaos') => void;
  canUndo: boolean;
  canRedo: boolean;
}
export const CardHistoryControls: React.FC<CardHistoryControlsProps> = ({
  onAdd, onUndo, onRedo, creationMode, setCreationMode, canUndo, canRedo
}) => (
  <div className="flex items-center gap-4">
    <Button
      onClick={onAdd}
      className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold shadow-xl"
    >
      <Plus className="w-4 h-4 mr-2" />
      Forge Card
    </Button>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] disabled:opacity-50"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] disabled:opacity-50"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
    <div className="flex gap-2 ml-4">
      {(['mystical', 'electric', 'chaos'] as const).map((mode) => (
        <Button
          key={mode}
          variant={creationMode === mode ? "default" : "outline"}
          size="sm"
          onClick={() => setCreationMode(mode)}
          className={creationMode === mode
            ? 'bg-purple-500 text-white'
            : 'border-[#4a4a4a] text-white hover:bg-[#4a4a4a]'
          }
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>
      ))}
    </div>
  </div>
);
