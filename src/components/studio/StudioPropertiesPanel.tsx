
import React from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioPropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioPropertiesPanel: React.FC<StudioPropertiesPanelProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-[#2a2a2a] border-l border-[#3a3a3a] flex flex-col">
      <div className="p-4 border-b border-[#3a3a3a] flex items-center justify-between">
        <h3 className="text-white font-medium">Properties</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-[#3a3a3a]"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4">
        <Card className="bg-[#1a1a1a] border-[#3a3a3a] p-4">
          <p className="text-sm text-gray-400">
            Select an element to see its properties
          </p>
        </Card>
      </div>
    </div>
  );
};
