
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface FigmaBottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FigmaBottomPanel: React.FC<FigmaBottomPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const frames = [
    { id: 1, name: 'Classic Sports', preview: '🏀' },
    { id: 2, name: 'Holographic', preview: '✨' },
    { id: 3, name: 'Vintage', preview: '🎭' },
    { id: 4, name: 'Modern', preview: '🔮' },
    { id: 5, name: 'Chrome', preview: '⚡' },
    { id: 6, name: 'Neon', preview: '🌈' }
  ];

  return (
    <div className="h-48 bg-[#2c2c2c] border-t border-[#3c3c3c] flex flex-col">
      <div className="h-12 border-b border-[#3c3c3c] flex items-center justify-between px-4">
        <span className="text-white font-medium text-sm">Frames & Templates</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex gap-4">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="flex-shrink-0 w-24 cursor-pointer group"
            >
              <div className="w-24 h-16 bg-[#1e1e1e] rounded-lg border border-[#3c3c3c] flex items-center justify-center text-2xl group-hover:border-white/40 transition-colors">
                {frame.preview}
              </div>
              <p className="text-white/70 text-xs text-center mt-2 group-hover:text-white transition-colors">
                {frame.name}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
