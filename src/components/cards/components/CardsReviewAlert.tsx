
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface CardsReviewAlertProps {
  totalCards: number;
  onReviewClick: () => void;
}

export const CardsReviewAlert: React.FC<CardsReviewAlertProps> = ({
  totalCards,
  onReviewClick
}) => {
  return (
    <Card className="bg-blue-600/20 border-blue-500 mb-8">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">
                {totalCards} cards detected and ready for review
              </h3>
              <p className="text-blue-200 text-sm">
                Review the detected cards below, make any adjustments, and create your digital cards
              </p>
            </div>
          </div>
          <Button
            onClick={onReviewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Review Cards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
