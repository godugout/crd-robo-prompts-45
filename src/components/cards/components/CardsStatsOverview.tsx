
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CardsStatsOverviewProps {
  totalCards: number;
  selectedCards: number;
  averageConfidence: number;
  processedCards: number;
}

export const CardsStatsOverview: React.FC<CardsStatsOverviewProps> = ({
  totalCards,
  selectedCards,
  averageConfidence,
  processedCards
}) => {
  if (totalCards === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-crd-green">{totalCards}</div>
          <div className="text-xs text-crd-lightGray">Total Cards Detected</div>
        </CardContent>
      </Card>
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{selectedCards}</div>
          <div className="text-xs text-crd-lightGray">Cards Selected</div>
        </CardContent>
      </Card>
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{Math.round(averageConfidence * 100)}%</div>
          <div className="text-xs text-crd-lightGray">Avg. Confidence</div>
        </CardContent>
      </Card>
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{processedCards}</div>
          <div className="text-xs text-crd-lightGray">Processed</div>
        </CardContent>
      </Card>
    </div>
  );
};
