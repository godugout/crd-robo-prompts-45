
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CardDetailHeaderProps {
  onGoBack: () => void;
}

export const CardDetailHeader: React.FC<CardDetailHeaderProps> = ({
  onGoBack
}) => {
  return (
    <div className="relative z-10 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoBack}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};
