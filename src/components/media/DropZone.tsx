
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

interface DropZoneProps {
  onBrowse: () => void;
  onCamera: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onBrowse, onCamera, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <div className="text-center">
        <p className="text-gray-700 mb-2">Drag and drop files here, or</p>
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={onBrowse}
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload size={16} />
            Browse
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCamera}
            size="sm"
            className="flex items-center gap-1"
          >
            <Camera size={16} />
            Camera
          </Button>
        </div>
      </div>
    </div>
  );
};
