
import React from 'react';
import { Button } from '@/components/ui/button';
// Import from the correct file and export
import { CREATION_STYLES } from './EnhancedWhiteboardStudio';

interface ThemedCardMenuProps {
  show: boolean;
  onCancel: () => void;
  onSelect: (style: typeof CREATION_STYLES[0]) => void;
}
export const ThemedCardMenu: React.FC<ThemedCardMenuProps> = ({ show, onCancel, onSelect }) =>
  !show ? null : (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#2c2c54] to-[#40407a] rounded-3xl p-8 max-w-lg w-full mx-4 border-2 border-purple-500/30">
        <h3 className="text-white text-2xl font-bold mb-6 text-center">Choose Your Creation Style</h3>
        <div className="space-y-4">
          {CREATION_STYLES.map((style) => (
            <Button
              key={style.name}
              onClick={() => onSelect(style)}
              className="w-full bg-gradient-to-r from-[#4a4a4a] to-[#5a5a5a] hover:from-[#5a5a5a] hover:to-[#6a6a6a] text-white p-6 h-auto justify-start border border-purple-400/20"
            >
              <style.icon className="w-8 h-8 mr-4 text-purple-300" />
              <div className="text-left">
                <div className="font-bold text-lg">{style.name}</div>
                <div className="text-sm opacity-80">{style.description}</div>
              </div>
            </Button>
          ))}
        </div>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full mt-6 border-purple-400/30 text-white hover:bg-purple-400/10"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
