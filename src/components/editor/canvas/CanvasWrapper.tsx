
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
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
            <CRDButton variant="outline" className="flex-1 rounded-full">
              Add back
            </CRDButton>
            <CRDButton variant="outline" className="rounded-full text-crd-green" icon={<PaintBucket size={16} />}>
            </CRDButton>
            <CRDButton variant="outline" className="rounded-full text-crd-purple" icon={<Palette size={16} />}>
            </CRDButton>
          </div>
        </div>
      </div>
    </div>
  );
};
