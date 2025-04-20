
import React from 'react';
import { Button } from '@/components/ui/button';
import { PaintBucket, Palette } from 'lucide-react';

interface CanvasWrapperProps {
  children: React.ReactNode;
  onActionClick: () => void;
  title: string;
  description: string;
}

export const CanvasWrapper = ({
  children,
  onActionClick,
  title,
  description
}: CanvasWrapperProps) => {
  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-start justify-center py-8">
      <div className="flex flex-col gap-8">
        <div className="bg-editor-dark rounded-xl p-6 w-[400px]">
          {children}
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 rounded-full border border-editor-border text-cardshow-white">
              Add back
            </Button>
            <Button variant="outline" className="rounded-full border border-editor-border text-cardshow-green">
              <PaintBucket size={16} />
            </Button>
            <Button variant="outline" className="rounded-full border border-editor-border text-cardshow-purple">
              <Palette size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
