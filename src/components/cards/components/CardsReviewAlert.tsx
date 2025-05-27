
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles } from 'lucide-react';

interface CardsReviewAlertProps {
  totalCards: number;
  onReviewClick: () => void;
}

export const CardsReviewAlert: React.FC<CardsReviewAlertProps> = ({
  totalCards,
  onReviewClick
}) => {
  return (
    <Alert className="mb-6 bg-gradient-to-r from-crd-green/20 to-blue-600/20 border-crd-green/30">
      <Sparkles className="h-5 w-5 text-crd-green" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium">
            🎉 Great! We detected {totalCards} trading cards in your images.
          </p>
          <p className="text-crd-lightGray text-sm mt-1">
            Review and select which cards you want to add to your collection.
          </p>
        </div>
        <Button 
          onClick={onReviewClick}
          className="bg-crd-green hover:bg-crd-green/80 text-black font-medium ml-4"
        >
          <Eye className="w-4 h-4 mr-2" />
          Review Cards
        </Button>
      </AlertDescription>
    </Alert>
  );
};
