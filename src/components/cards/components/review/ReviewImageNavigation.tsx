
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewImageNavigationProps {
  currentImageIndex: number;
  totalImages: number;
  onImageIndexChange: (index: number) => void;
}

export const ReviewImageNavigation: React.FC<ReviewImageNavigationProps> = ({
  currentImageIndex,
  totalImages,
  onImageIndexChange
}) => {
  if (totalImages <= 1) return null;

  return (
    <div className="flex items-center justify-center p-4 bg-gray-800 border-t border-gray-700 gap-4">
      <Button
        variant="outline"
        onClick={() => onImageIndexChange(Math.max(0, currentImageIndex - 1))}
        disabled={currentImageIndex === 0}
        className="text-gray-300"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex gap-2">
        {Array.from({ length: totalImages }, (_, index) => (
          <Button
            key={index}
            variant={index === currentImageIndex ? "default" : "outline"}
            size="sm"
            onClick={() => onImageIndexChange(index)}
            className={index === currentImageIndex ? "bg-blue-600" : "text-gray-300"}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => onImageIndexChange(Math.min(totalImages - 1, currentImageIndex + 1))}
        disabled={currentImageIndex === totalImages - 1}
        className="text-gray-300"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
