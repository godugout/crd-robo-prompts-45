
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ExtractedCard } from '@/services/cardExtractor';

interface CardDetectionReviewControlsProps {
  extractedCards: ExtractedCard[];
  selectedCards: Set<number>;
  viewMode: 'grid' | 'large';
  onViewModeToggle: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const CardDetectionReviewControls = ({
  extractedCards,
  selectedCards,
  viewMode,
  onViewModeToggle,
  onSelectAll,
  onClearSelection
}: CardDetectionReviewControlsProps) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {selectedCards.size} of {extractedCards.length} selected
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewModeToggle}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            {viewMode === 'grid' ? 'Large View' : 'Grid View'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
