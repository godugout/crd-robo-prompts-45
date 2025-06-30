
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardDetailHeaderProps {
  onGoBack: () => void;
}

export const CardDetailHeader: React.FC<CardDetailHeaderProps> = ({ onGoBack }) => {
  return (
    <div className="relative z-10 p-6 border-b border-crd-mediumGray/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="text-crd-lightGray hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Button>
      </div>
    </div>
  );
};
