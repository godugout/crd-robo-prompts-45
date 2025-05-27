
import React from 'react';
import { Eye } from 'lucide-react';

export const DetectedCardsPreviewEmpty: React.FC = () => {
  return (
    <div className="bg-editor-tool rounded-lg p-4">
      <div className="flex items-center justify-center h-80 text-crd-lightGray">
        <div className="text-center">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a card to preview detection</p>
        </div>
      </div>
    </div>
  );
};
