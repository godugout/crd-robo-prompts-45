
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Palette, Settings, Download, Share2 } from 'lucide-react';

interface FloatingToolbarProps {
  position: { x: number; y: number };
  type: 'card' | 'image' | 'text' | 'general';
  onAction: (action: string) => void;
  visible: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  position,
  type,
  onAction,
  visible
}) => {
  if (!visible) return null;

  const getToolsForType = () => {
    switch (type) {
      case 'card':
        return [
          { icon: Camera, action: 'photo', label: 'Photo' },
          { icon: Sparkles, action: 'effects', label: 'Effects' },
          { icon: Palette, action: 'style', label: 'Style' },
          { icon: Settings, action: 'settings', label: 'Settings' }
        ];
      case 'image':
        return [
          { icon: Camera, action: 'replace', label: 'Replace' },
          { icon: Sparkles, action: 'enhance', label: 'Enhance' },
          { icon: Palette, action: 'filters', label: 'Filters' }
        ];
      case 'general':
        return [
          { icon: Download, action: 'export', label: 'Export' },
          { icon: Share2, action: 'share', label: 'Share' }
        ];
      default:
        return [];
    }
  };

  const tools = getToolsForType();

  return (
    <div
      className="fixed z-50 bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-2 flex gap-1"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {tools.map(({ icon: Icon, action, label }) => (
        <Button
          key={action}
          size="sm"
          variant="ghost"
          onClick={() => onAction(action)}
          className="text-white hover:bg-white/20 flex flex-col items-center gap-1 h-auto py-2 px-3"
        >
          <Icon className="w-4 h-4" />
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
};
