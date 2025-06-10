
import React from 'react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface WizardHeaderProps {
  onCancel: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ onCancel }) => {
  return (
    <div className="bg-editor-dark border-b border-crd-mediumGray/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-crd-white">
          Create New Card
        </h1>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500/10"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};
